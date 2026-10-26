import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Only validated filenames enter this local, trusted content path.
export async function readNarrative(filename: string) {
  if (!/^[a-z0-9-]+\.mdx$/.test(filename)) throw new Error('Invalid narrative filename');
  return readFile(join(process.cwd(), 'content', 'narratives', filename), 'utf8');
}
