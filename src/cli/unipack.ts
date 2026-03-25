/*
Copyright 2026 anonyme-afk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * UniPack package manager for UniStack
 *
 * Supports publishing local packages into a local registry and installing
 * them into unistack_modules with target metadata.
 */

import { promises as fs } from 'node:fs';
import { resolve, basename } from 'node:path';
import { HotSwapBackend } from '../compiler/hotswap.js';

const REGISTRY_DIR = 'unistack_packages';
const MODULES_DIR = 'unistack_modules';

interface PackageManifest {
  name: string;
  version: string;
  description?: string;
  main?: string;
}

interface InstalledLockEntry {
  name: string;
  version: string;
  target: 'web' | 'native' | 'hybrid';
  installedAt: string;
}

interface UniLockFile {
  packages: InstalledLockEntry[];
}

function splitPackageSpec(spec: string): { name: string; version: string | null } {
  const at = spec.lastIndexOf('@');
  if (at > 0) {
    return { name: spec.slice(0, at), version: spec.slice(at + 1) };
  }
  return { name: spec, version: null };
}

async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await fs.writeFile(path, JSON.stringify(value, null, 2), 'utf8');
}

async function ensureRegistry(): Promise<void> {
  await fs.mkdir(REGISTRY_DIR, { recursive: true });
}

async function readLocalManifestFromSource(sourcePath: string): Promise<PackageManifest> {
  const packageJsonPath = resolve(sourcePath, 'package.json');
  const unistackManifestPath = resolve(sourcePath, 'unistack.package.json');

  if (await exists(unistackManifestPath)) {
    return readJson<PackageManifest>(unistackManifestPath);
  }
  if (await exists(packageJsonPath)) {
    const pkg = await readJson<any>(packageJsonPath);
    return {
      name: pkg.name ?? basename(sourcePath),
      version: pkg.version ?? '0.1.0',
      description: pkg.description,
      main: pkg.main,
    };
  }
  return {
    name: basename(sourcePath),
    version: '0.1.0',
    description: 'UniStack package',
    main: 'app.uni',
  };
}

async function findLatestVersion(name: string): Promise<string | null> {
  const pkgDir = resolve(REGISTRY_DIR, name);
  if (!(await exists(pkgDir))) return null;
  const entries = await fs.readdir(pkgDir, { withFileTypes: true });
  const versions = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
  return versions.length > 0 ? versions[versions.length - 1] : null;
}

async function updateLock(entry: InstalledLockEntry): Promise<void> {
  await fs.mkdir(MODULES_DIR, { recursive: true });
  const lockPath = resolve(MODULES_DIR, 'unistack.lock.json');
  let lock: UniLockFile = { packages: [] };
  if (await exists(lockPath)) {
    lock = await readJson<UniLockFile>(lockPath);
  }
  const next = lock.packages.filter(p => !(p.name === entry.name && p.version === entry.version));
  next.push(entry);
  await writeJson(lockPath, { packages: next });
}

export async function installPackage(name: string, target: 'web' | 'native' | 'hybrid' = 'web'): Promise<void> {
  await ensureRegistry();
  await fs.mkdir(MODULES_DIR, { recursive: true });

  const spec = splitPackageSpec(name);
  const version = spec.version ?? (await findLatestVersion(spec.name));
  if (!version) {
    throw new Error(`english: Package not found in local registry: ${spec.name}`);
  }

  const registryPath = resolve(REGISTRY_DIR, spec.name, version);
  if (!(await exists(registryPath))) {
    throw new Error(`english: Package ${spec.name}@${version} does not exist in local registry.`);
  }

  const installPath = resolve(MODULES_DIR, spec.name);
  await fs.rm(installPath, { recursive: true, force: true });
  await fs.cp(registryPath, installPath, { recursive: true, force: true });

  const backend = new HotSwapBackend();
  backend.switchBackend(target);

  await writeJson(resolve(installPath, 'unistack.install.json'), {
    name: spec.name,
    version,
    target,
    installedAt: new Date().toISOString(),
  });

  await updateLock({
    name: spec.name,
    version,
    target,
    installedAt: new Date().toISOString(),
  });

  console.log(`english: Package installed: ${spec.name}@${version} (target=${target}).`);
}

export async function publishPackage(path: string): Promise<void> {
  await ensureRegistry();
  console.log(`english: Publishing package from ${path}`);
  const srcPath = resolve(path);

  const stat = await fs.stat(srcPath);
  if (!stat.isDirectory()) {
    throw new Error('english: publish path must be a directory containing a UniStack package.');
  }

  const manifest = await readLocalManifestFromSource(srcPath);
  const packageBase = resolve(REGISTRY_DIR, manifest.name, manifest.version);
  await fs.mkdir(packageBase, { recursive: true });

  await fs.cp(srcPath, packageBase, { recursive: true, force: true });
  await writeJson(resolve(packageBase, 'unistack.package.json'), manifest);

  const packageIndexPath = resolve(REGISTRY_DIR, manifest.name, 'index.json');
  const indexData = {
    name: manifest.name,
    latest: manifest.version,
    versions: await fs.readdir(resolve(REGISTRY_DIR, manifest.name)).catch(() => []),
    updatedAt: new Date().toISOString(),
  };
  await writeJson(packageIndexPath, indexData);

  console.log(`english: Package published: ${manifest.name}@${manifest.version}.`);
}
