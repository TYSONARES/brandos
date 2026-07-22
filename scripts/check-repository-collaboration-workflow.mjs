import { existsSync } from 'node:fs';

const required = [
  'docs/development/v1.6-scope.md',
  'docs/decisions/0028-repository-collaboration-workflow-start.md',
  'docs/development/README.md',
  'README.md',
  'CHANGELOG.md',
  'scripts/check-repository-collaboration-workflow.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Repository Collaboration Workflow requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Repository Collaboration Workflow requirements passed.');
