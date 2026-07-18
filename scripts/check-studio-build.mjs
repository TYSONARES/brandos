import { existsSync, readFileSync } from 'node:fs';

const checks = [
  {
    path: 'dist/studio/index.html',
    snippets: [
      '<!doctype html>',
      'BrandOS Studio',
      'aria-label="Workflow scenarios"',
      'aria-current="page" href="index.html"',
      'href="ready.html"',
      'Product Core objects',
      'Context readiness',
      'Action status: pending',
      'Review is blocking release: review_example_001'
    ]
  },
  {
    path: 'dist/studio/ready.html',
    snippets: [
      '<!doctype html>',
      'BrandOS Studio',
      'aria-label="Workflow scenarios"',
      'href="index.html"',
      'aria-current="page" href="ready.html"',
      'Context readiness',
      'Current step: ready-for-use',
      'Action status: ready',
      'Use context pack context_pack_example_001'
    ]
  }
];

for (const check of checks) {
  if (!existsSync(check.path)) {
    console.error(`Missing Studio build output: ${check.path}`);
    process.exit(1);
  }

  const html = readFileSync(check.path, 'utf8');
  const missing = check.snippets.filter((snippet) => !html.includes(snippet));
  if (missing.length) {
    console.error(`${check.path} is missing required content: ${missing.join(', ')}`);
    process.exit(1);
  }
}

console.log('Studio build requirements passed.');
