import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

async function clean() {
  const dirs = ['dist', 'generated'];
  for (const dir of dirs) {
    try {
      await fs.rm(resolve(process.cwd(), dir), { recursive: true, force: true });
      console.log(`Cleaned ${dir}`);
    } catch {}
  }
}

clean();
