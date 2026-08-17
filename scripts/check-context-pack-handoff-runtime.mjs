import { existsSync, readFileSync } from 'node:fs';

const required = [
  'docs/development/v1.11-scope.md',
  'docs/development/iteration-v1.11-context-pack-handoff-runtime-scope.md',
  'docs/development/release-v1.11-context-pack-handoff-runtime-scope.md',
  'docs/development/closure-v1.11-context-pack-handoff-runtime-scope.md',
  'docs/development/iteration-v1.11-handoff-source-package.md',
  'docs/development/release-v1.11-handoff-source-package.md',
  'docs/development/closure-v1.11-handoff-source-package.md',
  'docs/development/iteration-v1.11-agent-context-readiness.md',
  'docs/development/release-v1.11-agent-context-readiness.md',
  'docs/development/closure-v1.11-agent-context-readiness.md',
  'docs/development/iteration-v1.11-studio-handoff-detail.md',
  'docs/development/release-v1.11-studio-handoff-detail.md',
  'docs/development/closure-v1.11-studio-handoff-detail.md',
  'docs/development/iteration-v1.11-context-pack-handoff-aggregate-summary.md',
  'docs/development/release-v1.11-aggregate-summary.md',
  'docs/development/closure-v1.11-aggregate-summary.md',
  'docs/development/iteration-v1.11-context-pack-handoff-final-closure.md',
  'docs/development/release-v1.11-final-closure.md',
  'docs/development/closure-v1.11-final-closure.md',
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
const contextIteration = readFileSync('docs/development/iteration-v1.11-agent-context-readiness.md', 'utf8');
const contextRelease = readFileSync('docs/development/release-v1.11-agent-context-readiness.md', 'utf8');
const contextClosure = readFileSync('docs/development/closure-v1.11-agent-context-readiness.md', 'utf8');
const studioHandoffIteration = readFileSync('docs/development/iteration-v1.11-studio-handoff-detail.md', 'utf8');
const studioHandoffRelease = readFileSync('docs/development/release-v1.11-studio-handoff-detail.md', 'utf8');
const studioHandoffClosure = readFileSync('docs/development/closure-v1.11-studio-handoff-detail.md', 'utf8');
const aggregateIteration = readFileSync('docs/development/iteration-v1.11-context-pack-handoff-aggregate-summary.md', 'utf8');
const aggregateRelease = readFileSync('docs/development/release-v1.11-aggregate-summary.md', 'utf8');
const aggregateClosure = readFileSync('docs/development/closure-v1.11-aggregate-summary.md', 'utf8');
const finalIteration = readFileSync('docs/development/iteration-v1.11-context-pack-handoff-final-closure.md', 'utf8');
const finalRelease = readFileSync('docs/development/release-v1.11-final-closure.md', 'utf8');
const finalClosure = readFileSync('docs/development/closure-v1.11-final-closure.md', 'utf8');
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
  ['docs/development/iteration-v1.11-agent-context-readiness.md', contextIteration, '# Context Pack Handoff Runtime v1.11 Iteration: Agent Context Readiness'],
  ['docs/development/iteration-v1.11-agent-context-readiness.md', contextIteration, 'Proceed to Studio Handoff Detail.'],
  ['docs/development/release-v1.11-agent-context-readiness.md', contextRelease, '# Context Pack Handoff Runtime v1.11 Release Notes: Agent Context Readiness'],
  ['docs/development/release-v1.11-agent-context-readiness.md', contextRelease, 'Proceed to Studio Handoff Detail.'],
  ['docs/development/closure-v1.11-agent-context-readiness.md', contextClosure, '# Context Pack Handoff Runtime v1.11 Closure Checklist: Agent Context Readiness'],
  ['docs/development/closure-v1.11-agent-context-readiness.md', contextClosure, 'Closed.'],
  ['docs/development/iteration-v1.11-studio-handoff-detail.md', studioHandoffIteration, '# Context Pack Handoff Runtime v1.11 Iteration: Studio Handoff Detail'],
  ['docs/development/iteration-v1.11-studio-handoff-detail.md', studioHandoffIteration, 'Proceed to Context Pack Handoff Aggregate Summary.'],
  ['docs/development/release-v1.11-studio-handoff-detail.md', studioHandoffRelease, '# Context Pack Handoff Runtime v1.11 Release Notes: Studio Handoff Detail'],
  ['docs/development/release-v1.11-studio-handoff-detail.md', studioHandoffRelease, 'Proceed to Context Pack Handoff Aggregate Summary.'],
  ['docs/development/closure-v1.11-studio-handoff-detail.md', studioHandoffClosure, '# Context Pack Handoff Runtime v1.11 Closure Checklist: Studio Handoff Detail'],
  ['docs/development/closure-v1.11-studio-handoff-detail.md', studioHandoffClosure, 'Closed.'],
  ['docs/development/iteration-v1.11-context-pack-handoff-aggregate-summary.md', aggregateIteration, '# Context Pack Handoff Runtime v1.11 Iteration: Context Pack Handoff Aggregate Summary'],
  ['docs/development/iteration-v1.11-context-pack-handoff-aggregate-summary.md', aggregateIteration, 'Context Pack Handoff Runtime v1.11 is ready for final closure.'],
  ['docs/development/release-v1.11-aggregate-summary.md', aggregateRelease, '# Context Pack Handoff Runtime v1.11 Release Notes: Aggregate Summary'],
  ['docs/development/release-v1.11-aggregate-summary.md', aggregateRelease, 'Proceed to Context Pack Handoff Final Closure.'],
  ['docs/development/closure-v1.11-aggregate-summary.md', aggregateClosure, '# Context Pack Handoff Runtime v1.11 Closure Checklist: Aggregate Summary'],
  ['docs/development/closure-v1.11-aggregate-summary.md', aggregateClosure, 'Closed.'],
  ['docs/development/iteration-v1.11-context-pack-handoff-final-closure.md', finalIteration, '# Context Pack Handoff Runtime v1.11 Iteration: Context Pack Handoff Final Closure'],
  ['docs/development/iteration-v1.11-context-pack-handoff-final-closure.md', finalIteration, 'Context Pack Handoff Runtime v1.11 is closed at implementation cycle level.'],
  ['docs/development/release-v1.11-final-closure.md', finalRelease, '# Context Pack Handoff Runtime v1.11 Release Notes: Final Closure'],
  ['docs/development/release-v1.11-final-closure.md', finalRelease, 'Open draft PR for Context Pack Handoff Runtime v1.11 review.'],
  ['docs/development/closure-v1.11-final-closure.md', finalClosure, '# Context Pack Handoff Runtime v1.11 Closure Checklist: Final Closure'],
  ['docs/development/closure-v1.11-final-closure.md', finalClosure, 'Context Pack Handoff Runtime v1.11 is complete at implementation cycle level.'],
  ['docs/decisions/0033-context-pack-handoff-runtime-start.md', decision, '# ADR 0033: Context Pack Handoff Runtime v1.11 Start'],
  ['docs/decisions/0033-context-pack-handoff-runtime-start.md', decision, '- Status: accepted'],
  ['packages/domain/src/use-cases.mjs', domainUseCases, 'export function createContextPackHandoffSourcePackage'],
  ['packages/domain/src/use-cases.mjs', domainUseCases, 'export function createAgentContextReadiness'],
  ['packages/domain/src/use-cases.mjs', domainUseCases, 'export function createStudioHandoffDetail'],
  ['packages/domain/src/use-cases.mjs', domainUseCases, 'export function createContextPackHandoffAggregateSummary'],
  ['packages/domain/src/use-cases.mjs', domainUseCases, 'export function createContextPackHandoffFinalClosure'],
  ['packages/domain/src/index.mjs', domainIndex, 'createContextPackHandoffSourcePackage'],
  ['packages/domain/src/index.mjs', domainIndex, 'createAgentContextReadiness'],
  ['packages/domain/src/index.mjs', domainIndex, 'createStudioHandoffDetail'],
  ['packages/domain/src/index.mjs', domainIndex, 'createContextPackHandoffAggregateSummary'],
  ['packages/domain/src/index.mjs', domainIndex, 'createContextPackHandoffFinalClosure'],
  ['apps/studio/src/app.mjs', studioApp, 'const contextPackHandoffSourcePackage = createContextPackHandoffSourcePackage'],
  ['apps/studio/src/app.mjs', studioApp, 'const agentContextReadiness = createAgentContextReadiness'],
  ['apps/studio/src/app.mjs', studioApp, 'const studioHandoffDetail = createStudioHandoffDetail'],
  ['apps/studio/src/app.mjs', studioApp, 'const contextPackHandoffAggregateSummary = createContextPackHandoffAggregateSummary'],
  ['apps/studio/src/app.mjs', studioApp, 'const contextPackHandoffFinalClosure = createContextPackHandoffFinalClosure'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Context Pack Handoff Source Package"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'Context Pack handoff source policy:'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Agent Context Readiness"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'Agent context readiness decision:'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Studio Handoff Detail"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'Studio handoff detail status:'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Context Pack Handoff Aggregate Summary"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'Context Pack handoff aggregate decision:'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Context Pack Handoff Final Closure"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'Context Pack handoff final closure decision:'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Context Pack Handoff Source Package blocks until readiness evidence is clear'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Context Pack Handoff Source Package opens agent context readiness for ready evidence'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Agent Context Readiness blocks when handoff sources are not ready'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Agent Context Readiness opens Studio handoff detail for ready source packages'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Studio Handoff Detail summarizes blocked handoff readiness for Studio'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Studio Handoff Detail summarizes ready handoff state for Studio'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Context Pack Handoff Aggregate Summary blocks until handoff packages are ready'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Context Pack Handoff Aggregate Summary opens final closure when all packages are ready'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Context Pack Handoff Final Closure blocks until aggregate readiness is ready'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Context Pack Handoff Final Closure closes when aggregate readiness is ready'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Context Pack handoff package status: blocked'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Context Pack handoff package status: ready'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Agent context readiness status: blocked'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Agent context readiness status: ready'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Studio handoff detail status: blocked'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Studio handoff detail status: ready'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Context Pack handoff aggregate status: blocked'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Context Pack handoff aggregate status: ready'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Context Pack handoff final closure status: blocked'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Context Pack handoff final closure status: closed'],
  ['docs/development/README.md', developmentIndex, '- Latest completed implementation cycle: Context Pack Handoff Runtime v1.11'],
  ['docs/development/README.md', developmentIndex, '- Active workstream: Context Pack Handoff Runtime v1.11'],
  ['docs/development/README.md', developmentIndex, '`v1.11-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.11-context-pack-handoff-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.11-context-pack-handoff-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.11-context-pack-handoff-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.11-handoff-source-package.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.11-handoff-source-package.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.11-handoff-source-package.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.11-agent-context-readiness.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.11-agent-context-readiness.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.11-agent-context-readiness.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.11-studio-handoff-detail.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.11-studio-handoff-detail.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.11-studio-handoff-detail.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.11-context-pack-handoff-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.11-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.11-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.11-context-pack-handoff-final-closure.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.11-final-closure.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.11-final-closure.md`'],
  ['docs/decisions/README.md', decisionsIndex, '`0033-context-pack-handoff-runtime-start.md`'],
  ['README.md', rootReadme, '- Latest completed implementation cycle: Context Pack Handoff Runtime v1.11'],
  ['README.md', rootReadme, '- Active workstream: Context Pack Handoff Runtime v1.11'],
  ['PROJECT_MANIFEST.md', manifest, '- Latest completed implementation cycle: Context Pack Handoff Runtime v1.11'],
  ['PROJECT_MANIFEST.md', manifest, '- Active workstream: Context Pack Handoff Runtime v1.11'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.11 Scope'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.11 Completion'],
  ['docs/README.md', docsIndex, 'active Context Pack Handoff Runtime v1.11 work'],
  ['CHANGELOG.md', changelog, 'Started Context Pack Handoff Runtime v1.11 scope and decision record.'],
  ['CHANGELOG.md', changelog, 'Added Context Pack Handoff Runtime Scope release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Handoff Source Package release notes, closure checklist, runtime model, Studio panel, and tests.'],
  ['CHANGELOG.md', changelog, 'Added Agent Context Readiness release notes, closure checklist, runtime model, Studio panel, and tests.'],
  ['CHANGELOG.md', changelog, 'Added Studio Handoff Detail release notes, closure checklist, runtime model, Studio panel, and tests.'],
  ['CHANGELOG.md', changelog, 'Added Context Pack Handoff Runtime v1.11 aggregate release summary and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Closed Context Pack Handoff Runtime v1.11 with final release notes and closure checklist.'],
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
