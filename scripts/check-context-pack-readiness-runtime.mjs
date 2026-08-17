import { existsSync, readFileSync } from 'node:fs';

const required = [
  'docs/development/v1.10-scope.md',
  'docs/development/iteration-v1.10-context-pack-readiness-runtime-scope.md',
  'docs/development/release-v1.10-context-pack-readiness-runtime-scope.md',
  'docs/development/closure-v1.10-context-pack-readiness-runtime-scope.md',
  'docs/development/iteration-v1.10-readiness-evidence-model.md',
  'docs/development/release-v1.10-readiness-evidence-model.md',
  'docs/development/closure-v1.10-readiness-evidence-model.md',
  'docs/development/iteration-v1.10-operator-decision-state.md',
  'docs/development/release-v1.10-operator-decision-state.md',
  'docs/development/closure-v1.10-operator-decision-state.md',
  'docs/development/iteration-v1.10-studio-readiness-detail.md',
  'docs/development/release-v1.10-studio-readiness-detail.md',
  'docs/development/closure-v1.10-studio-readiness-detail.md',
  'docs/decisions/0032-context-pack-readiness-runtime-start.md',
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
const evidenceIteration = readFileSync('docs/development/iteration-v1.10-readiness-evidence-model.md', 'utf8');
const evidenceRelease = readFileSync('docs/development/release-v1.10-readiness-evidence-model.md', 'utf8');
const evidenceClosure = readFileSync('docs/development/closure-v1.10-readiness-evidence-model.md', 'utf8');
const decisionStateIteration = readFileSync('docs/development/iteration-v1.10-operator-decision-state.md', 'utf8');
const decisionStateRelease = readFileSync('docs/development/release-v1.10-operator-decision-state.md', 'utf8');
const decisionStateClosure = readFileSync('docs/development/closure-v1.10-operator-decision-state.md', 'utf8');
const studioDetailIteration = readFileSync('docs/development/iteration-v1.10-studio-readiness-detail.md', 'utf8');
const studioDetailRelease = readFileSync('docs/development/release-v1.10-studio-readiness-detail.md', 'utf8');
const studioDetailClosure = readFileSync('docs/development/closure-v1.10-studio-readiness-detail.md', 'utf8');
const decision = readFileSync('docs/decisions/0032-context-pack-readiness-runtime-start.md', 'utf8');
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
  ['docs/development/iteration-v1.10-readiness-evidence-model.md', evidenceIteration, '# Context Pack Readiness Runtime v1.10 Iteration: Readiness Evidence Model'],
  ['docs/development/iteration-v1.10-readiness-evidence-model.md', evidenceIteration, 'Proceed to Operator Decision State.'],
  ['docs/development/release-v1.10-readiness-evidence-model.md', evidenceRelease, '# Context Pack Readiness Runtime v1.10 Release Notes: Readiness Evidence Model'],
  ['docs/development/release-v1.10-readiness-evidence-model.md', evidenceRelease, 'Proceed to Operator Decision State.'],
  ['docs/development/closure-v1.10-readiness-evidence-model.md', evidenceClosure, '# Context Pack Readiness Runtime v1.10 Closure Checklist: Readiness Evidence Model'],
  ['docs/development/closure-v1.10-readiness-evidence-model.md', evidenceClosure, 'Closed.'],
  ['docs/development/iteration-v1.10-operator-decision-state.md', decisionStateIteration, '# Context Pack Readiness Runtime v1.10 Iteration: Operator Decision State'],
  ['docs/development/iteration-v1.10-operator-decision-state.md', decisionStateIteration, 'Proceed to Studio Readiness Detail.'],
  ['docs/development/release-v1.10-operator-decision-state.md', decisionStateRelease, '# Context Pack Readiness Runtime v1.10 Release Notes: Operator Decision State'],
  ['docs/development/release-v1.10-operator-decision-state.md', decisionStateRelease, 'Proceed to Studio Readiness Detail.'],
  ['docs/development/closure-v1.10-operator-decision-state.md', decisionStateClosure, '# Context Pack Readiness Runtime v1.10 Closure Checklist: Operator Decision State'],
  ['docs/development/closure-v1.10-operator-decision-state.md', decisionStateClosure, 'Closed.'],
  ['docs/development/iteration-v1.10-studio-readiness-detail.md', studioDetailIteration, '# Context Pack Readiness Runtime v1.10 Iteration: Studio Readiness Detail'],
  ['docs/development/iteration-v1.10-studio-readiness-detail.md', studioDetailIteration, 'Proceed to Context Pack Readiness Aggregate Summary.'],
  ['docs/development/release-v1.10-studio-readiness-detail.md', studioDetailRelease, '# Context Pack Readiness Runtime v1.10 Release Notes: Studio Readiness Detail'],
  ['docs/development/release-v1.10-studio-readiness-detail.md', studioDetailRelease, 'Proceed to Context Pack Readiness Aggregate Summary.'],
  ['docs/development/closure-v1.10-studio-readiness-detail.md', studioDetailClosure, '# Context Pack Readiness Runtime v1.10 Closure Checklist: Studio Readiness Detail'],
  ['docs/development/closure-v1.10-studio-readiness-detail.md', studioDetailClosure, 'Closed.'],
  ['packages/domain/src/use-cases.mjs', domainUseCases, 'export function createReadinessEvidenceModel'],
  ['packages/domain/src/use-cases.mjs', domainUseCases, 'export function createOperatorDecisionState'],
  ['packages/domain/src/use-cases.mjs', domainUseCases, 'export function createStudioReadinessDetail'],
  ['packages/domain/src/index.mjs', domainIndex, 'createReadinessEvidenceModel'],
  ['packages/domain/src/index.mjs', domainIndex, 'createOperatorDecisionState'],
  ['packages/domain/src/index.mjs', domainIndex, 'createStudioReadinessDetail'],
  ['apps/studio/src/app.mjs', studioApp, 'const readinessEvidenceModel = createReadinessEvidenceModel'],
  ['apps/studio/src/app.mjs', studioApp, 'const operatorDecisionState = createOperatorDecisionState'],
  ['apps/studio/src/app.mjs', studioApp, 'const studioReadinessDetail = createStudioReadinessDetail'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Readiness Evidence Model"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Operator Decision State"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Studio Readiness Detail"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'Readiness evidence item:'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Readiness Evidence Model summarizes blocking Context Pack evidence'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Operator Decision State asks the operator to resolve blocking readiness evidence'],
  ['tests/domain/product-core-use-cases.test.mjs', domainTest, 'Studio Readiness Detail summarizes blocked Context Pack readiness for Studio'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Evidence status: blocked'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Operator decision status: needs-action'],
  ['tests/studio/render-html.test.mjs', studioTest, 'Studio readiness detail status: blocked'],
  ['docs/decisions/0032-context-pack-readiness-runtime-start.md', decision, '# ADR 0032: Context Pack Readiness Runtime v1.10 Start'],
  ['docs/decisions/0032-context-pack-readiness-runtime-start.md', decision, '- Status: accepted'],
  ['docs/development/README.md', developmentIndex, '- Active workstream: Context Pack Readiness Runtime v1.10'],
  ['docs/development/README.md', developmentIndex, '`v1.10-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.10-context-pack-readiness-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.10-context-pack-readiness-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.10-context-pack-readiness-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.10-readiness-evidence-model.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.10-readiness-evidence-model.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.10-readiness-evidence-model.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.10-operator-decision-state.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.10-operator-decision-state.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.10-operator-decision-state.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.10-studio-readiness-detail.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.10-studio-readiness-detail.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.10-studio-readiness-detail.md`'],
  ['docs/decisions/README.md', decisionsIndex, '`0032-context-pack-readiness-runtime-start.md`'],
  ['README.md', rootReadme, '- Active workstream: Context Pack Readiness Runtime v1.10'],
  ['PROJECT_MANIFEST.md', manifest, '- Active workstream: Context Pack Readiness Runtime v1.10'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.10 Scope'],
  ['CHANGELOG.md', changelog, 'Started Context Pack Readiness Runtime v1.10 scope and decision record.'],
  ['CHANGELOG.md', changelog, 'Added Context Pack Readiness Runtime Scope release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Readiness Evidence Model release notes, closure checklist, runtime model, Studio panel, and tests.'],
  ['CHANGELOG.md', changelog, 'Added Operator Decision State release notes, closure checklist, runtime model, Studio panel, and tests.'],
  ['CHANGELOG.md', changelog, 'Added Studio Readiness Detail release notes, closure checklist, runtime model, Studio panel, and tests.'],
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
