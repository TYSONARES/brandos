import { existsSync } from 'node:fs';

const required = [
  'docs/product/workflows/README.md',
  'docs/product/workflows/create-brand-profile.md',
  'docs/product/workflows/verify-claim.md',
  'docs/product/workflows/approve-decision.md',
  'docs/product/workflows/generate-context-pack.md',
  'docs/product/workflows/run-review.md'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing workflow specs: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Workflow specs are present.');
