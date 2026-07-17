import { existsSync } from 'node:fs';

const required = [
  'docs/product/release-v0.2.0.md',
  'docs/decisions/0012-product-core-v0.2-complete.md',
  'schemas/brand-profile.schema.json',
  'schemas/claim.schema.json',
  'schemas/context-pack.schema.json',
  'schemas/decision.schema.json',
  'schemas/review.schema.json',
  'schemas/source.schema.json',
  'schemas/workflow-run.schema.json',
  'fixtures/brand-profile.example.json',
  'fixtures/claim.example.json',
  'fixtures/context-pack.example.json',
  'fixtures/decision.example.json',
  'fixtures/review.example.json',
  'fixtures/source.example.json',
  'fixtures/workflow-run.example.json'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing release requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Release requirements passed.');
