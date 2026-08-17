import { existsSync, readFileSync } from 'node:fs';

const required = [
  'docs/development/v1.11-scope.md',
  'docs/development/iteration-v1.11-context-pack-handoff-runtime-scope.md',
  'docs/development/release-v1.11-context-pack-handoff-runtime-scope.md',
  'docs/development/closure-v1.11-context-pack-handoff-runtime-scope.md',
  'docs/development/iteration-v1.11-handoff-source-package.md',
  'docs/development/release-v1.11-handoff-source-package.md',
  'docs/development/closure-v1.11-handoff-source-package.md',
  'docs/decisions/0033-context-pack-handoff-runtime-start.md',
  'packages/domain/src/use-cases.mjs',
  'packages/domain/src/index.mjs',
  'apps/studio/src/app.mjs',
  'apps/studio/src/render-html.mjs',
  'tests/domain/product-core-use-cases.test.mjs',
  'tests/studio/render-html.test.mjs',
  'docs/development/README.md',
  'docs/decisions/README.md',
  'README.md',
  'PROJECT_MANIFEST.md',
  'CHANGELOG.md',
  'package.json',
  'scripts/check-context-pack-handoff-runtime.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Context Pack Handoff Runtime requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const scope = readFileSync('docs/development/v1.11-scope.md', 'utf8');
const iteration = readFileSync('docs/development/iteration-v1.11-context-pack-handoff-runtime-scope.md', 'utf8');
const release = readFileSync('docs/development/release-v1.11-context-pack-handoff-runtime-scope.md', 'utf8');
const closure = readFileSync('docs/development/closure-v1.11-context-pack-handoff-runtime-scope.md', 'utf8');
const sourceIteration = readFileSync('docs/development/iteration-v1.11-handoff-source-package.md', 'utf8');
const sourceRelease = readFileSync('docs/development/release-v1.11-handoff-source-package.md', 'utf8');
const sourceClosure = readFileSync('docs/development/closure-v1.11-handoff-source-package.md', 'utf8');
const decision = readFileSync('docs/decisions/0033-context-pack-handoff-runtime-start.md', 'utf8');
const domainUseCases = readFileSync('packages/domain/src/use-cases.mjs', 'utf8');
const domainIndex = readFileSync('packages/domain/src/index.mjs', 'utf8');
const studioApp = readFileSync('apps/studio/src/app.mjs', 'utf8');
const studioRender = readFileSync('apps/studio/src/render-html.mjs', 'utf8');
const domainTest = readFileSync('tests/domain/product-core-use-cases.test.mjs', 'utf8');
const studioTest = readFileSync('tests/studio/render-html.test.mjs', 'utf8');
const developmentIndex = readFileSync('docs/development/README.md', 'utf8');
const decisionsIndex = readFileSync('docs/decisions/README.md', 'utf8');
const rootReadme = readFileSync('README.md', 'utf8');
const manifest = readFileSync('PROJECT_MANIFEST.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const packageJson = readFileSync('package.json', 'utf8');

const requiredSnippets = [
  ['docs/development/v1.11-scope.md', scope, '# Context Pack Handoff Runtime v1.11 Scope'],
  ['docs/development/v1.11-scope.md', scope, 'Handoff Source Package'],
  ['docs/development/v1.11-scope.md', scope, 'Agent Context Readiness'],
  ['docs/development/v1.11-scope.md', scope, 'Studio Handoff Detail'],
  ['docs/development/v1.11-scope.md', scope, '`npm run check:context-pack-handoff-runtime`'],
  ['docs/development/iteration-v1.11-context-pack-handoff-runtime-scope.md', iteration, '# Context Pack Handoff Runtime v1.11 Iteration: Context Pack Handoff Runtime Scope'],
  ['docs/development/iteration-v1.11-context-pack-handoff-runtime-scope.md', iteration, 'Proceed to Handoff Source Package.'],
  ['docs/development/release-v1.11-context-pack-handoff-runtime-scope.md', release, '# Context Pack Handoff Runtime v1.11 Release Notes: Context Pack Handoff Runtime Scope'],
  ['docs/development/release-v1.11-context-pack-handoff-runtime-scope.md', release, 'Proceed to Handoff Source Package.'],
  ['docs/development/closure-v1.11-context-pack-handoff-runtime-scope.md', closure, '# Context Pack Handoff Runtime v1.11 Closure Checklist: Context Pack Handoff Runtime Scope'],
  ['docs/development/closure-v1.11-context-pack-handoff-runtime-scope.md', closure, 'Closed.'],
  ['docs/development/iteration-v1.11-handoff-source-package.md', sourceIteration, '# Context Pack Handoff Runtime v1.11 Iteration: Handoff Source Package'],
  ['docs/development/iteration-v1.11-handoff-source-package.md', sourceIteration, 'Proceed to Agent Context Readiness.'],
  ['docs/development/release-v1.11-handoff-source-package.md', sourceRelease, '# Context Pack Handoff Runtime v1.11 Release Notes: Handoff Source Package'],
  ['docs/development/release-v1.11-handoff-source-package.md', sourceRelease, 'Proceed to Agent Context Readiness.'],
  ['docs/development/closure-v1.11-handoff-source-package.md', sourceClosure, '# Context Pack Handoff Runtime v1.11 Closure Checklist: Handoff Source Package'],
  ['docs/development/closure-v1.11-handoff-source-package.md', sourceClosure, 'Closed.'],
  ['docs/decisions/0033-context-pack-handoff-runtime-start.md', decision, '# ADR 0033: Context Pack Handoff Runtime v1.11 Start'],
  ['docs/decisions/0033-context-pack-handoff-runtime-start.md', decision, '- Status: accepted'],
  ['packages/domain/src/use-cases.mjs', domainUseCases, 'export function createContextPackHandoffSourcePackage'],
  ['packages/domain/src/index.mjs', domainIndex, 'createContextPackHandoffSourcePackage'],
  ['apps/studio/src/app.mjs', studioApp, 'const contextPackHandoffSourcePackage = createContextPackHandoffSourcePackage'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Context Pack Handoff Source Package"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'Context Pack handoff source policy:'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Context Pack Handoff Source Package blocks until readiness evidence is clear'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Context Pack Handoff Source Package opens agent context readiness for ready evidence'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Context Pack handoff package status: blocked'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Context Pack handoff package status: ready'],
  ['docs/development/README.md', developmentIndex, '- Latest completed implementation cycle: Context Pack Readiness Runtime v1.10'],
  ['docs/development/README.md', developmentIndex, '- Active workstream: Context Pack Handoff Runtime v1.11'],
  ['docs/development/README.md', developmentIndex, '`v1.11-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.11-context-pack-handoff-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.11-context-pack-handoff-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.11-context-pack-handoff-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.11-handoff-source-package.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.11-handoff-source-package.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.11-handoff-source-package.md`'],
  ['docs/decisions/README.md', decisionsIndex, '`0033-context-pack-handoff-runtime-start.md`'],
  ['README.md', rootReadme, '- Latest completed implementation cycle: Context Pack Readiness Runtime v1.10'],
  ['README.md', rootReadme, '- Active workstream: Context Pack Handoff Runtime v1.11'],
  ['PROJECT_MANIFEST.md', manifest, '- Latest completed implementation cycle: Context Pack Readiness Runtime v1.10'],
  ['PROJECT_MANIFEST.md', manifest, '- Active workstream: Context Pack Handoff Runtime v1.11'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.11 Scope'],
  ['docs/README.md', docsIndex, 'active Context Pack Handoff Runtime v1.11 work'],
  ['CHANGELOG.md', changelog, 'Started Context Pack Handoff Runtime v1.11 scope and decision record.'],
  ['CHANGELOG.md', changelog, 'Added Context Pack Handoff Runtime Scope release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Handoff Source Package release notes, closure checklist, runtime model, Studio panel, and tests.'],
  ['package.json', packageJson, '"check:context-pack-handoff-runtime"']
];

const missingSnippets = requiredSnippets
  .filter(([, content, snippet]) => !content.includes(snippet))
  .map(([file, , snippet]) => `${file}: ${snippet}`);

if (missingSnippets.length) {
  console.error(`Missing Context Pack Handoff Runtime content: ${missingSnippets.join(', ')}`);
  process.exit(1);
}

console.log('Context Pack Handoff Runtime requirements passed.');
