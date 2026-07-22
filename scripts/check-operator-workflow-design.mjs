import { existsSync } from 'node:fs';

const required = [
  'docs/development/v1.5-scope.md',
  'docs/decisions/0027-operator-workflow-design-start.md',
  'docs/development/README.md',
  'scripts/check-operator-workflow-design.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Operator Workflow Design requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Operator Workflow Design requirements passed.');
