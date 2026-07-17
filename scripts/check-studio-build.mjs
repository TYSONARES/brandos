import { existsSync, readFileSync } from 'node:fs';

const outputPath = 'dist/studio/index.html';

if (!existsSync(outputPath)) {
  console.error(`Missing Studio build output: ${outputPath}`);
  process.exit(1);
}

const html = readFileSync(outputPath, 'utf8');
const requiredSnippets = [
  '<!doctype html>',
  'BrandOS Studio',
  'Product Core objects',
  'Context readiness',
  'Review is blocking release: review_example_001'
];

const missing = requiredSnippets.filter((snippet) => !html.includes(snippet));
if (missing.length) {
  console.error(`Studio build output is missing required content: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Studio build requirements passed.');
