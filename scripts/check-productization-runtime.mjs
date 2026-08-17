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
  'docs/product/product-surface-inventory.md',
  'docs/product/product-workflow-prioritization.md',
  'docs/product/README.md',
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
const productSurfaceInventory = readFileSync('docs/product/product-surface-inventory.md', 'utf8');
const productWorkflowPrioritization = readFileSync('docs/product/product-workflow-prioritization.md', 'utf8');
const productIndex = readFileSync('docs/product/README.md', 'utf8');
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
  ['docs/product/README.md', productIndex, '`product-surface-inventory.md`'],
  ['docs/product/README.md', productIndex, '`product-workflow-prioritization.md`'],
  ['docs/decisions/0031-productization-runtime-start.md', decision, '# ADR 0031: Productization Runtime v1.9 Start'],
  ['docs/decisions/0031-productization-runtime-start.md', decision, '- Status: accepted'],
  ['docs/development/README.md', developmentIndex, '- Active workstream: Productization Runtime v1.9'],
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
  ['docs/decisions/README.md', decisionsIndex, '`0031-productization-runtime-start.md`'],
  ['README.md', rootReadme, '- Active workstream: Productization Runtime v1.9'],
  ['PROJECT_MANIFEST.md', manifest, '- Active workstream: Productization Runtime v1.9'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.9 Scope'],
  ['CHANGELOG.md', changelog, 'Started Productization Runtime v1.9 scope and decision record.'],
  ['CHANGELOG.md', changelog, 'Added Product Surface Inventory release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Product Workflow Prioritization release notes and closure checklist.'],
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
