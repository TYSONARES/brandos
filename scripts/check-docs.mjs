import { existsSync } from 'node:fs';

const required = ['README.md', 'PROJECT_MANIFEST.md', 'CODEX.md', 'docs/README.md'];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error(`Missing required docs: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('Required documentation files are present.');
