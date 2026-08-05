import { existsSync, readFileSync } from 'node:fs';

const required = [
  'docs/development/v1.7-scope.md',
  'docs/decisions/0029-mainline-release-readiness-start.md',
  'docs/development/README.md',
  'docs/decisions/README.md',
  'CHANGELOG.md',
  'scripts/check-mainline-release-readiness.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Mainline Release Readiness requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const scope = readFileSync('docs/development/v1.7-scope.md', 'utf8');
const decision = readFileSync('docs/decisions/0029-mainline-release-readiness-start.md', 'utf8');
const developmentIndex = readFileSync('docs/development/README.md', 'utf8');
const decisionsIndex = readFileSync('docs/decisions/README.md', 'utf8');
const changelog = readFileSync('CHANGELOG.md', 'utf8');

const requiredSnippets = [
  ['docs/development/v1.7-scope.md', scope, '# Mainline Release Readiness v1.7 Scope'],
  ['docs/development/v1.7-scope.md', scope, 'Pull Request Review Package'],
  ['docs/development/v1.7-scope.md', scope, 'CI Evidence Summary'],
  ['docs/development/v1.7-scope.md', scope, 'Main Merge Plan'],
  ['docs/development/v1.7-scope.md', scope, 'Release Tag Readiness'],
  ['docs/development/v1.7-scope.md', scope, 'Mainline Aggregate Summary'],
  ['docs/development/v1.7-scope.md', scope, 'Mainline Final Closure'],
  ['docs/decisions/0029-mainline-release-readiness-start.md', decision, '# ADR 0029: Mainline Release Readiness v1.7 Start'],
  ['docs/decisions/0029-mainline-release-readiness-start.md', decision, '- Status: accepted'],
  ['docs/development/README.md', developmentIndex, '- Latest completed implementation cycle: Repository Collaboration Workflow v1.6'],
  ['docs/development/README.md', developmentIndex, '- Active workstream: Mainline Release Readiness v1.7'],
  ['docs/development/README.md', developmentIndex, '`v1.7-scope.md`'],
  ['docs/decisions/README.md', decisionsIndex, '`0029-mainline-release-readiness-start.md`'],
  ['CHANGELOG.md', changelog, 'Started Mainline Release Readiness v1.7 scope and decision record.']
];

const missingSnippets = requiredSnippets
  .filter(([, content, snippet]) => !content.includes(snippet))
  .map(([file, , snippet]) => `${file}: ${snippet}`);

if (missingSnippets.length) {
  console.error(`Missing Mainline Release Readiness content: ${missingSnippets.join(', ')}`);
  process.exit(1);
}

console.log('Mainline Release Readiness requirements passed.');
