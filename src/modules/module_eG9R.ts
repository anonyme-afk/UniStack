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
 * UniPack – simple package manager for UniStack
 *
 * Allows installing and publishing UniStack modules. Packages are
 * pre-compiled for the target (web/native) using the hot-swap backend.
 * This is a minimal proof-of-concept; a real registry would handle
 * remote storage, versioning, dependency resolution, etc.
 */

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import { HotSwapBackend } from '../compiler/hotswap.js';

const REGISTRY_DIR = 'unistack_packages';

export async function installPackage(name: string, target: 'web' | 'native' | 'hybrid' = 'web'): Promise<void> {
  // ensure registry folder exists
  await fs.mkdir(REGISTRY_DIR, { recursive: true });
  const pkgPath = resolve(REGISTRY_DIR, name);
  console.log(`english: Installing package ${name} for target ${target}`);
  // in this stub we simply create the directory to simulate install
  await fs.mkdir(pkgPath, { recursive: true });
  // pre-compile using HotSwapBackend (dummy call)
  const backend = new HotSwapBackend();
  backend.switchBackend(target);
  // note: real compilation would compile the package sources
  console.log(`english: Package ${name} installed (simulated).`);
}

export async function publishPackage(path: string): Promise<void> {
  console.log(`english: Publishing package from ${path}`);
  // stub – in real world we'd tarball, upload to registry
  await fs.mkdir(REGISTRY_DIR, { recursive: true });
  const dest = resolve(REGISTRY_DIR, path.split('/').pop() || path);
  try {
    await fs.copyFile(path, dest);
  } catch {
    // ignore
  }
  console.log(`english: Package published (simulated).`);
}