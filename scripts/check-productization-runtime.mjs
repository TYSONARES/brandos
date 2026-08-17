import { existsSync, readFileSync } from 'node:fs';

const required = [
  'docs/development/v1.9-scope.md',
  'docs/development/iteration-v1.9-productization-runtime-scope.md',
  'docs/development/release-v1.9-productization-runtime-scope.md',
  'docs/development/closure-v1.9-productization-runtime-scope.md',
  'docs/development/iteration-v1.9-product-surface-inventory.md',
  'docs/development/release-v1.9-product-surface-inventory.md',
  'docs/development/closure-v1.9-product-surface-inventory.md',
  'docs/development/iteration-v1.9-product-workflow-prioritization.md',
  'docs/development/release-v1.9-product-workflow-prioritization.md',
  'docs/development/closure-v1.9-product-workflow-prioritization.md',
  'docs/development/iteration-v1.9-studio-product-mode.md',
  'docs/development/release-v1.9-studio-product-mode.md',
  'docs/development/closure-v1.9-studio-product-mode.md',
  'docs/development/iteration-v1.9-product-evidence-pack.md',
  'docs/development/release-v1.9-product-evidence-pack.md',
  'docs/development/closure-v1.9-product-evidence-pack.md',
  'docs/development/iteration-v1.9-productization-aggregate-summary.md',
  'docs/development/release-v1.9-aggregate-summary.md',
  'docs/development/closure-v1.9-aggregate-summary.md',
  'docs/development/iteration-v1.9-productization-final-closure.md',
  'docs/development/release-v1.9-final-closure.md',
  'docs/development/closure-v1.9-final-closure.md',
  'docs/product/product-surface-inventory.md',
  'docs/product/product-workflow-prioritization.md',
  'docs/product/studio-product-mode.md',
  'docs/product/product-evidence-pack.md',
  'docs/product/README.md',
  'apps/studio/src/app.mjs',
  'apps/studio/src/render-html.mjs',
  'tests/studio/render-html.test.mjs',
  'docs/decisions/0031-productization-runtime-start.md',
  'docs/development/README.md',
  'docs/decisions/README.md',
  'README.md',
  'PROJECT_MANIFEST.md',
  'CHANGELOG.md',
  'package.json',
  'scripts/check-productization-runtime.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Productization Runtime requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const scope = readFileSync('docs/development/v1.9-scope.md', 'utf8');
const iteration = readFileSync('docs/development/iteration-v1.9-productization-runtime-scope.md', 'utf8');
const release = readFileSync('docs/development/release-v1.9-productization-runtime-scope.md', 'utf8');
const closure = readFileSync('docs/development/closure-v1.9-productization-runtime-scope.md', 'utf8');
const inventoryIteration = readFileSync('docs/development/iteration-v1.9-product-surface-inventory.md', 'utf8');
const inventoryRelease = readFileSync('docs/development/release-v1.9-product-surface-inventory.md', 'utf8');
const inventoryClosure = readFileSync('docs/development/closure-v1.9-product-surface-inventory.md', 'utf8');
const priorityIteration = readFileSync('docs/development/iteration-v1.9-product-workflow-prioritization.md', 'utf8');
const priorityRelease = readFileSync('docs/development/release-v1.9-product-workflow-prioritization.md', 'utf8');
const priorityClosure = readFileSync('docs/development/closure-v1.9-product-workflow-prioritization.md', 'utf8');
const productModeIteration = readFileSync('docs/development/iteration-v1.9-studio-product-mode.md', 'utf8');
const productModeRelease = readFileSync('docs/development/release-v1.9-studio-product-mode.md', 'utf8');
const productModeClosure = readFileSync('docs/development/closure-v1.9-studio-product-mode.md', 'utf8');
const evidenceIteration = readFileSync('docs/development/iteration-v1.9-product-evidence-pack.md', 'utf8');
const evidenceRelease = readFileSync('docs/development/release-v1.9-product-evidence-pack.md', 'utf8');
const evidenceClosure = readFileSync('docs/development/closure-v1.9-product-evidence-pack.md', 'utf8');
const aggregateIteration = readFileSync('docs/development/iteration-v1.9-productization-aggregate-summary.md', 'utf8');
const aggregateRelease = readFileSync('docs/development/release-v1.9-aggregate-summary.md', 'utf8');
const aggregateClosure = readFileSync('docs/development/closure-v1.9-aggregate-summary.md', 'utf8');
const finalIteration = readFileSync('docs/development/iteration-v1.9-productization-final-closure.md', 'utf8');
const finalRelease = readFileSync('docs/development/release-v1.9-final-closure.md', 'utf8');
const finalClosure = readFileSync('docs/development/closure-v1.9-final-closure.md', 'utf8');
const productSurfaceInventory = readFileSync('docs/product/product-surface-inventory.md', 'utf8');
const productWorkflowPrioritization = readFileSync('docs/product/product-workflow-prioritization.md', 'utf8');
const studioProductMode = readFileSync('docs/product/studio-product-mode.md', 'utf8');
const productEvidencePack = readFileSync('docs/product/product-evidence-pack.md', 'utf8');
const productIndex = readFileSync('docs/product/README.md', 'utf8');
const studioApp = readFileSync('apps/studio/src/app.mjs', 'utf8');
const studioRender = readFileSync('apps/studio/src/render-html.mjs', 'utf8');
const studioRenderTest = readFileSync('tests/studio/render-html.test.mjs', 'utf8');
const decision = readFileSync('docs/decisions/0031-productization-runtime-start.md', 'utf8');
const developmentIndex = readFileSync('docs/development/README.md', 'utf8');
const decisionsIndex = readFileSync('docs/decisions/README.md', 'utf8');
const rootReadme = readFileSync('README.md', 'utf8');
const manifest = readFileSync('PROJECT_MANIFEST.md', 'utf8');
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const packageJson = readFileSync('package.json', 'utf8');

const requiredSnippets = [
  ['docs/development/v1.9-scope.md', scope, '# Productization Runtime v1.9 Scope'],
  ['docs/development/v1.9-scope.md', scope, 'Product Surface Inventory'],
  ['docs/development/v1.9-scope.md', scope, 'Product Workflow Prioritization'],
  ['docs/development/v1.9-scope.md', scope, 'Studio Product Mode'],
  ['docs/development/v1.9-scope.md', scope, 'Product Evidence Pack'],
  ['docs/development/v1.9-scope.md', scope, '`npm run check:productization-runtime`'],
  ['docs/development/iteration-v1.9-productization-runtime-scope.md', iteration, '# Productization Runtime v1.9 Iteration: Productization Runtime Scope'],
  ['docs/development/iteration-v1.9-productization-runtime-scope.md', iteration, 'Product Surface Inventory'],
  ['docs/development/release-v1.9-productization-runtime-scope.md', release, '# Productization Runtime v1.9 Release Notes: Productization Runtime Scope'],
  ['docs/development/release-v1.9-productization-runtime-scope.md', release, 'Proceed to Product Surface Inventory.'],
  ['docs/development/closure-v1.9-productization-runtime-scope.md', closure, '# Productization Runtime v1.9 Closure Checklist: Productization Runtime Scope'],
  ['docs/development/closure-v1.9-productization-runtime-scope.md', closure, 'Closed.'],
  ['docs/development/iteration-v1.9-product-surface-inventory.md', inventoryIteration, '# Productization Runtime v1.9 Iteration: Product Surface Inventory'],
  ['docs/development/iteration-v1.9-product-surface-inventory.md', inventoryIteration, 'Studio Product Mode should begin with operator-facing surfaces'],
  ['docs/development/release-v1.9-product-surface-inventory.md', inventoryRelease, '# Productization Runtime v1.9 Release Notes: Product Surface Inventory'],
  ['docs/development/release-v1.9-product-surface-inventory.md', inventoryRelease, 'Proceed to Product Workflow Prioritization.'],
  ['docs/development/closure-v1.9-product-surface-inventory.md', inventoryClosure, '# Productization Runtime v1.9 Closure Checklist: Product Surface Inventory'],
  ['docs/development/closure-v1.9-product-surface-inventory.md', inventoryClosure, 'Closed.'],
  ['docs/product/product-surface-inventory.md', productSurfaceInventory, '# Product Surface Inventory'],
  ['docs/product/product-surface-inventory.md', productSurfaceInventory, 'Operator-Facing Surfaces'],
  ['docs/product/product-surface-inventory.md', productSurfaceInventory, 'Future Customer-Facing Surfaces'],
  ['docs/product/product-surface-inventory.md', productSurfaceInventory, 'The first productization candidate is Studio Product Mode'],
  ['docs/development/iteration-v1.9-product-workflow-prioritization.md', priorityIteration, '# Productization Runtime v1.9 Iteration: Product Workflow Prioritization'],
  ['docs/development/iteration-v1.9-product-workflow-prioritization.md', priorityIteration, 'Context Pack Readiness is the first Studio Product Mode path'],
  ['docs/development/release-v1.9-product-workflow-prioritization.md', priorityRelease, '# Productization Runtime v1.9 Release Notes: Product Workflow Prioritization'],
  ['docs/development/release-v1.9-product-workflow-prioritization.md', priorityRelease, 'Proceed to Studio Product Mode.'],
  ['docs/development/closure-v1.9-product-workflow-prioritization.md', priorityClosure, '# Productization Runtime v1.9 Closure Checklist: Product Workflow Prioritization'],
  ['docs/development/closure-v1.9-product-workflow-prioritization.md', priorityClosure, 'Closed.'],
  ['docs/product/product-workflow-prioritization.md', productWorkflowPrioritization, '# Product Workflow Prioritization'],
  ['docs/product/product-workflow-prioritization.md', productWorkflowPrioritization, 'Context Pack Readiness'],
  ['docs/product/product-workflow-prioritization.md', productWorkflowPrioritization, 'Studio Product Mode should begin with Context Pack Readiness'],
  ['docs/development/iteration-v1.9-studio-product-mode.md', productModeIteration, '# Productization Runtime v1.9 Iteration: Studio Product Mode'],
  ['docs/development/iteration-v1.9-studio-product-mode.md', productModeIteration, 'The first mode is `context-pack-readiness`.'],
  ['docs/development/release-v1.9-studio-product-mode.md', productModeRelease, '# Productization Runtime v1.9 Release Notes: Studio Product Mode'],
  ['docs/development/release-v1.9-studio-product-mode.md', productModeRelease, 'Proceed to Product Evidence Pack.'],
  ['docs/development/closure-v1.9-studio-product-mode.md', productModeClosure, '# Productization Runtime v1.9 Closure Checklist: Studio Product Mode'],
  ['docs/development/closure-v1.9-studio-product-mode.md', productModeClosure, 'Closed.'],
  ['docs/product/studio-product-mode.md', studioProductMode, '# Studio Product Mode'],
  ['docs/product/studio-product-mode.md', studioProductMode, 'Mode: `context-pack-readiness`'],
  ['docs/development/iteration-v1.9-product-evidence-pack.md', evidenceIteration, '# Productization Runtime v1.9 Iteration: Product Evidence Pack'],
  ['docs/development/iteration-v1.9-product-evidence-pack.md', evidenceIteration, 'Studio Product Mode is productization-ready'],
  ['docs/development/release-v1.9-product-evidence-pack.md', evidenceRelease, '# Productization Runtime v1.9 Release Notes: Product Evidence Pack'],
  ['docs/development/release-v1.9-product-evidence-pack.md', evidenceRelease, 'Proceed to Productization Aggregate Summary.'],
  ['docs/development/closure-v1.9-product-evidence-pack.md', evidenceClosure, '# Productization Runtime v1.9 Closure Checklist: Product Evidence Pack'],
  ['docs/development/closure-v1.9-product-evidence-pack.md', evidenceClosure, 'Closed.'],
  ['docs/product/product-evidence-pack.md', productEvidencePack, '# Product Evidence Pack'],
  ['docs/product/product-evidence-pack.md', productEvidencePack, 'Product Decision Evidence'],
  ['docs/product/product-evidence-pack.md', productEvidencePack, 'Runtime Evidence'],
  ['docs/product/product-evidence-pack.md', productEvidencePack, '`npm run check:all`'],
  ['docs/development/iteration-v1.9-productization-aggregate-summary.md', aggregateIteration, '# Productization Runtime v1.9 Iteration: Productization Aggregate Summary'],
  ['docs/development/iteration-v1.9-productization-aggregate-summary.md', aggregateIteration, 'Productization Runtime v1.9 is ready for final closure'],
  ['docs/development/release-v1.9-aggregate-summary.md', aggregateRelease, '# Productization Runtime v1.9 Release Notes: Aggregate Summary'],
  ['docs/development/release-v1.9-aggregate-summary.md', aggregateRelease, 'Proceed to Productization Final Closure.'],
  ['docs/development/closure-v1.9-aggregate-summary.md', aggregateClosure, '# Productization Runtime v1.9 Closure Checklist: Aggregate Summary'],
  ['docs/development/closure-v1.9-aggregate-summary.md', aggregateClosure, 'Closed.'],
  ['docs/development/iteration-v1.9-productization-final-closure.md', finalIteration, '# Productization Runtime v1.9 Iteration: Productization Final Closure'],
  ['docs/development/iteration-v1.9-productization-final-closure.md', finalIteration, 'Productization Runtime v1.9 is closed at implementation cycle level.'],
  ['docs/development/release-v1.9-final-closure.md', finalRelease, '# Productization Runtime v1.9 Release Notes: Final Closure'],
  ['docs/development/release-v1.9-final-closure.md', finalRelease, 'Studio Product Mode for Context Pack Readiness'],
  ['docs/development/closure-v1.9-final-closure.md', finalClosure, '# Productization Runtime v1.9 Closure Checklist: Final Closure'],
  ['docs/development/closure-v1.9-final-closure.md', finalClosure, 'Productization Runtime v1.9 is complete at implementation cycle level.'],
  ['apps/studio/src/app.mjs', studioApp, 'studioProductMode'],
  ['apps/studio/src/render-html.mjs', studioRender, 'aria-label="Studio Product Mode"'],
  ['apps/studio/src/render-html.mjs', studioRender, 'Product mode status:'],
  ['tests/studio/render-html.test.mjs', studioRenderTest, 'Product mode status: needs-action'],
  ['tests/studio/render-html.test.mjs', studioRenderTest, 'Product mode status: ready'],
  ['docs/product/README.md', productIndex, '`product-surface-inventory.md`'],
  ['docs/product/README.md', productIndex, '`product-workflow-prioritization.md`'],
  ['docs/product/README.md', productIndex, '`studio-product-mode.md`'],
  ['docs/product/README.md', productIndex, '`product-evidence-pack.md`'],
  ['docs/decisions/0031-productization-runtime-start.md', decision, '# ADR 0031: Productization Runtime v1.9 Start'],
  ['docs/decisions/0031-productization-runtime-start.md', decision, '- Status: accepted'],
  ['docs/development/README.md', developmentIndex, '- Latest completed implementation cycle: Context Pack Readiness Runtime v1.10'],
  ['docs/development/README.md', developmentIndex, '`v1.9-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.9-productization-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.9-productization-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.9-productization-runtime-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.9-product-surface-inventory.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.9-product-surface-inventory.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.9-product-surface-inventory.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.9-product-workflow-prioritization.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.9-product-workflow-prioritization.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.9-product-workflow-prioritization.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.9-studio-product-mode.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.9-studio-product-mode.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.9-studio-product-mode.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.9-product-evidence-pack.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.9-product-evidence-pack.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.9-product-evidence-pack.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.9-productization-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.9-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.9-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.9-productization-final-closure.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.9-final-closure.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.9-final-closure.md`'],
  ['docs/decisions/README.md', decisionsIndex, '`0031-productization-runtime-start.md`'],
  ['README.md', rootReadme, '- Latest completed implementation cycle: Context Pack Readiness Runtime v1.10'],
  ['README.md', rootReadme, '- Active workstream: Context Pack Handoff Runtime v1.11'],
  ['PROJECT_MANIFEST.md', manifest, '- Latest completed implementation cycle: Context Pack Readiness Runtime v1.10'],
  ['PROJECT_MANIFEST.md', manifest, '- Active workstream: Context Pack Handoff Runtime v1.11'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.9 Scope'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.9 Completion'],
  ['CHANGELOG.md', changelog, 'Started Productization Runtime v1.9 scope and decision record.'],
  ['CHANGELOG.md', changelog, 'Added Product Surface Inventory release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Product Workflow Prioritization release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Studio Product Mode release notes, closure checklist, runtime panel, and tests.'],
  ['CHANGELOG.md', changelog, 'Added Product Evidence Pack release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Productization Runtime v1.9 aggregate release summary and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Closed Productization Runtime v1.9 with final release notes and closure checklist.'],
  ['package.json', packageJson, '"check:productization-runtime"']
];

const missingSnippets = requiredSnippets
  .filter(([, content, snippet]) => !content.includes(snippet))
  .map(([file, , snippet]) => `${file}: ${snippet}`);

if (missingSnippets.length) {
  console.error(`Missing Productization Runtime content: ${missingSnippets.join(', ')}`);
  process.exit(1);
}

console.log('Productization Runtime requirements passed.');
