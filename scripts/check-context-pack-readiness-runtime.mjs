import { existsSync, readFileSync } from 'node:fs';

const required = [
  'docs/development/v1.10-scope.md',
  'docs/development/iteration-v1.10-context-pack-readiness-runtime-scope.md',
  'docs/development/release-v1.10-context-pack-readiness-runtime-scope.md',
  'docs/development/closure-v1.10-context-pack-readiness-runtime-scope.md',
  'docs/decisions/0032-context-pack-readiness-runtime-start.md',
  'docs/development/README.md',
  'docs/decisions/README.md',
  'README.md',
  'PROJECT_MANIFEST.md',
  'CHANGELOG.md',
  'package.json',
  'scripts/check-context-pack-readiness-runtime.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Context Pack Readiness Runtime requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const scope = readFileSync('docs/development/v1.10-scope.md', 'utf8');
const iteration = readFileSync('docs/development/iteration-v1.10-context-pack-readiness-runtime-scope.md', 'utf8');
const release = readFileSync('docs/development/release-v1.10-context-pack-readiness-runtime-scope.md', 'utf8');
const closure = readFileSync('docs/development/closure-v1.10-context-pack-readiness-runtime-scope.md', 'utf8');
const decision = readFileSync('docs/decisions/0032-context-pack-readiness-runtime-start.md', 'utf8');
const developmentIndex = readFileSync('docs/development/README.md', 'utf8');
const decisionsIndex = readFileSync('docs/decisions/README.md', 'utf8');
const rootReadme = readFileSync('README.md', 'utf8');
const manifest = readFileSync('PROJECT_MANIFEST.md', 'utf8');
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const packageJson = readFileSync('package.json', 'utf8');

const requiredSnippets = [
  ['docs/development/v1.10-scope.md', scope, '# Context Pack Readiness Runtime v1.10 Scope'],
  ['docs/development/v1.10-scope.md', scope, 'Readiness Evidence Model'],
  ['docs/development/v1.10-scope.md', scope, 'Operator Decision State'],
  ['docs/development/v1.10-scope.md', scope, 'Studio Readiness Detail'],
  ['docs/development/v1.10-scope.md', scope, '`npm run check:context-pack-readiness-runtime`'],
  ['docs/development/iteration-v1.10-context-pack-readiness-runtime-scope.md', iteration, '# Context Pack Readiness Runtime v1.10 Iteration: Context Pack Readiness Runtime Scope'],
  ['docs/development/iteration-v1.10-context-pack-readiness-runtime-scope.md', iteration, 'Proceed to Readiness Evidence Model.'],
  ['docs/development/release-v1.10-context-pack-readiness-runtime-scope.md', release, '# Context Pack Readiness Runtime v1.10 Release Notes: Context Pack Readiness Runtime Scope'],
  ['docs/development/release-v1.10-context-pack-readiness-runtime-scope.md', release, 'Proceed to Readiness Evidence Model.'],
  ['docs/development/closure-v1.10-context-pack-readiness-runtime-scope.md', closure, '# Context Pack Readiness Runtime v1.10 Closure Checklist: Context Pack Readiness Runtime Scope'],
  ['docs/development/closure-v1.10-context-pack-readiness-runtime-scope.md', closure, 'Closed.'],
  ['docs/decisions/0032-context-pack-readiness-runtime-start.md', decision, '# ADR 0032: Context Pack Readiness Runtime v1.10 Start'],
  ['docs/decisions/0032-context-pack-readiness-runtime-start.md', decision, '- Status: accepted'],
  ['docs/development/README.md', developmentIndex, '- Active workstream: Context Pack Readiness Runtime v1.10'],
  ['docs/development/README.md', developmentIndex, '`v1.10-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.10-context-pack-readiness-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.10-context-pack-readiness-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.10-context-pack-readiness-runtime-scope.md`'],
  ['docs/decisions/README.md', decisionsIndex, '`0032-context-pack-readiness-runtime-start.md`'],
  ['README.md', rootReadme, '- Active workstream: Context Pack Readiness Runtime v1.10'],
  ['PROJECT_MANIFEST.md', manifest, '- Active workstream: Context Pack Readiness Runtime v1.10'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.10 Scope'],
  ['CHANGELOG.md', changelog, 'Started Context Pack Readiness Runtime v1.10 scope and decision record.'],
  ['CHANGELOG.md', changelog, 'Added Context Pack Readiness Runtime Scope release notes and closure checklist.'],
  ['package.json', packageJson, '"check:context-pack-readiness-runtime"']
];

const missingSnippets = requiredSnippets
  .filter(([, content, snippet]) => !content.includes(snippet))
  .map(([file, , snippet]) => `${file}: ${snippet}`);

if (missingSnippets.length) {
  console.error(`Missing Context Pack Readiness Runtime content: ${missingSnippets.join(', ')}`);
  process.exit(1);
}

console.log('Context Pack Readiness Runtime requirements passed.');
