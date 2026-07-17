import { readdirSync } from 'node:fs';

const entries = readdirSync('.', { withFileTypes: true });
const hasDocs = entries.some((entry) => entry.isDirectory() && entry.name === 'docs');
if (!hasDocs) {
  console.error('docs directory is required.');
  process.exit(1);
}
console.log('Repository foundation check passed.');
