import { existsSync, readFileSync } from 'node:fs';

const required = [
  'docs/development/v1.8-scope.md',
  'docs/development/iteration-v1.8-release-decision-record.md',
  'docs/development/release-v1.8-release-decision-record.md',
  'docs/development/closure-v1.8-release-decision-record.md',
  'docs/decisions/0030-release-governance-start.md',
  'docs/development/README.md',
  'docs/decisions/README.md',
  'README.md',
  'PROJECT_MANIFEST.md',
  'docs/README.md',
  'CHANGELOG.md',
  'scripts/check-release-governance.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Release Governance requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const scope = readFileSync('docs/development/v1.8-scope.md', 'utf8');
const decision = readFileSync('docs/decisions/0030-release-governance-start.md', 'utf8');
const developmentIndex = readFileSync('docs/development/README.md', 'utf8');
const decisionsIndex = readFileSync('docs/decisions/README.md', 'utf8');
const rootReadme = readFileSync('README.md', 'utf8');
const manifest = readFileSync('PROJECT_MANIFEST.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const packageJson = readFileSync('package.json', 'utf8');
const releaseDecisionIteration = readFileSync('docs/development/iteration-v1.8-release-decision-record.md', 'utf8');
const releaseDecisionRelease = readFileSync('docs/development/release-v1.8-release-decision-record.md', 'utf8');
const releaseDecisionClosure = readFileSync('docs/development/closure-v1.8-release-decision-record.md', 'utf8');

const requiredSnippets = [
  ['docs/development/v1.8-scope.md', scope, '# Release Governance v1.8 Scope'],
  ['docs/development/v1.8-scope.md', scope, 'Release Decision Record'],
  ['docs/development/v1.8-scope.md', scope, 'Release Approval Evidence'],
  ['docs/development/v1.8-scope.md', scope, 'Publication Plan'],
  ['docs/development/v1.8-scope.md', scope, 'Rollback Readiness'],
  ['docs/development/v1.8-scope.md', scope, 'Post-Release Audit Summary'],
  ['docs/development/v1.8-scope.md', scope, 'Release Governance Aggregate Summary'],
  ['docs/development/v1.8-scope.md', scope, 'Release Governance Final Closure'],
  ['docs/development/v1.8-scope.md', scope, '`npm run check:release-governance`'],
  ['docs/development/iteration-v1.8-release-decision-record.md', releaseDecisionIteration, '# Release Governance v1.8 Iteration: Release Decision Record'],
  ['docs/development/iteration-v1.8-release-decision-record.md', releaseDecisionIteration, 'Release candidate identifier'],
  ['docs/development/iteration-v1.8-release-decision-record.md', releaseDecisionIteration, 'Main branch or publication actions still require explicit operator approval.'],
  ['docs/development/release-v1.8-release-decision-record.md', releaseDecisionRelease, '# Release Governance v1.8 Release Notes: Release Decision Record'],
  ['docs/development/release-v1.8-release-decision-record.md', releaseDecisionRelease, 'Release Decision Record release notes exist.'],
  ['docs/development/closure-v1.8-release-decision-record.md', releaseDecisionClosure, '# Release Governance v1.8 Closure Checklist: Release Decision Record'],
  ['docs/development/closure-v1.8-release-decision-record.md', releaseDecisionClosure, 'Release Approval Evidence.'],
  ['docs/decisions/0030-release-governance-start.md', decision, '# ADR 0030: Release Governance v1.8 Start'],
  ['docs/decisions/0030-release-governance-start.md', decision, '- Status: accepted'],
  ['docs/decisions/0030-release-governance-start.md', decision, 'Mainline Release Readiness v1.7 remains closed'],
  ['docs/development/README.md', developmentIndex, '- Latest completed implementation cycle: Mainline Release Readiness v1.7'],
  ['docs/development/README.md', developmentIndex, '- Active workstream: Release Governance v1.8'],
  ['docs/development/README.md', developmentIndex, '`v1.8-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.8-release-decision-record.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.8-release-decision-record.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.8-release-decision-record.md`'],
  ['docs/decisions/README.md', decisionsIndex, '`0030-release-governance-start.md`'],
  ['README.md', rootReadme, '- Latest completed implementation cycle: Mainline Release Readiness v1.7'],
  ['README.md', rootReadme, '- Active workstream: Release Governance v1.8'],
  ['PROJECT_MANIFEST.md', manifest, '- Latest completed implementation cycle: Mainline Release Readiness v1.7'],
  ['PROJECT_MANIFEST.md', manifest, '- Active workstream: Release Governance v1.8'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.8 Scope'],
  ['docs/README.md', docsIndex, 'active Release Governance v1.8 work'],
  ['CHANGELOG.md', changelog, 'Started Release Governance v1.8 scope and decision record.'],
  ['CHANGELOG.md', changelog, 'Added Release Decision Record release notes and closure checklist.'],
  ['package.json', packageJson, '"check:release-governance"']
];

const missingSnippets = requiredSnippets
  .filter(([, content, snippet]) => !content.includes(snippet))
  .map(([file, , snippet]) => `${file}: ${snippet}`);

if (missingSnippets.length) {
  console.error(`Missing Release Governance content: ${missingSnippets.join(', ')}`);
  process.exit(1);
}

console.log('Release Governance requirements passed.');
