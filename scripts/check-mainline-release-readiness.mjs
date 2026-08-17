import { existsSync, readFileSync } from 'node:fs';
import {
  completeWorkflowAction,
  createCiEvidenceSummary,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createMainlineAggregateSummary,
  createMainlineFinalClosure,
  createMainMergePlan,
  createPullRequestReviewPackage,
  createReleaseTagReadiness
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.7-scope.md',
  'docs/development/iteration-v1.7-pull-request-review-package.md',
  'docs/development/iteration-v1.7-ci-evidence-summary.md',
  'docs/development/iteration-v1.7-main-merge-plan.md',
  'docs/development/iteration-v1.7-release-tag-readiness.md',
  'docs/development/iteration-v1.7-mainline-aggregate-summary.md',
  'docs/development/iteration-v1.7-mainline-final-closure.md',
  'docs/development/release-v1.7-aggregate-summary.md',
  'docs/development/closure-v1.7-aggregate-summary.md',
  'docs/development/release-v1.7-final-closure.md',
  'docs/development/closure-v1.7-final-closure.md',
  'docs/decisions/0029-mainline-release-readiness-start.md',
  'fixtures/components/pull-request-review-package-panel.json',
  'fixtures/components/ci-evidence-summary-panel.json',
  'fixtures/components/main-merge-plan-panel.json',
  'fixtures/components/release-tag-readiness-panel.json',
  'fixtures/components/mainline-aggregate-summary-panel.json',
  'fixtures/components/mainline-final-closure-panel.json',
  'apps/studio/src/app.mjs',
  'apps/studio/src/render-html.mjs',
  'packages/domain/src/use-cases.mjs',
  'packages/domain/src/index.mjs',
  'tests/domain/product-core-use-cases.test.mjs',
  'tests/studio/render-html.test.mjs',
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
const aggregateRelease = readFileSync('docs/development/release-v1.7-aggregate-summary.md', 'utf8');
const aggregateClosure = readFileSync('docs/development/closure-v1.7-aggregate-summary.md', 'utf8');
const finalRelease = readFileSync('docs/development/release-v1.7-final-closure.md', 'utf8');
const finalClosure = readFileSync('docs/development/closure-v1.7-final-closure.md', 'utf8');

const requiredSnippets = [
  ['docs/development/v1.7-scope.md', scope, '# Mainline Release Readiness v1.7 Scope'],
  ['docs/development/v1.7-scope.md', scope, 'Pull Request Review Package'],
  ['docs/development/iteration-v1.7-pull-request-review-package.md', readFileSync('docs/development/iteration-v1.7-pull-request-review-package.md', 'utf8'), '# Mainline Release Readiness v1.7 Iteration: Pull Request Review Package'],
  ['docs/development/iteration-v1.7-ci-evidence-summary.md', readFileSync('docs/development/iteration-v1.7-ci-evidence-summary.md', 'utf8'), '# Mainline Release Readiness v1.7 Iteration: CI Evidence Summary'],
  ['docs/development/iteration-v1.7-main-merge-plan.md', readFileSync('docs/development/iteration-v1.7-main-merge-plan.md', 'utf8'), '# Mainline Release Readiness v1.7 Iteration: Main Merge Plan'],
  ['docs/development/iteration-v1.7-release-tag-readiness.md', readFileSync('docs/development/iteration-v1.7-release-tag-readiness.md', 'utf8'), '# Mainline Release Readiness v1.7 Iteration: Release Tag Readiness'],
  ['docs/development/iteration-v1.7-mainline-aggregate-summary.md', readFileSync('docs/development/iteration-v1.7-mainline-aggregate-summary.md', 'utf8'), '# Mainline Release Readiness v1.7 Iteration: Mainline Aggregate Summary'],
  ['docs/development/iteration-v1.7-mainline-final-closure.md', readFileSync('docs/development/iteration-v1.7-mainline-final-closure.md', 'utf8'), '# Mainline Release Readiness v1.7 Iteration: Mainline Final Closure'],
  ['docs/development/release-v1.7-aggregate-summary.md', aggregateRelease, '# Mainline Release Readiness v1.7 Release Notes: Aggregate Summary'],
  ['docs/development/closure-v1.7-aggregate-summary.md', aggregateClosure, '# Mainline Release Readiness v1.7 Closure Checklist: Aggregate Summary'],
  ['docs/development/release-v1.7-aggregate-summary.md', aggregateRelease, 'Pull Request Review Package'],
  ['docs/development/release-v1.7-aggregate-summary.md', aggregateRelease, 'Mainline Final Closure'],
  ['docs/development/closure-v1.7-aggregate-summary.md', aggregateClosure, 'Ready for closure'],
  ['docs/development/closure-v1.7-aggregate-summary.md', aggregateClosure, 'Required Mainline Release Readiness checks include aggregate summary documents.'],
  ['docs/development/release-v1.7-final-closure.md', finalRelease, '# Mainline Release Readiness v1.7 Release Notes: Final Closure'],
  ['docs/development/closure-v1.7-final-closure.md', finalClosure, '# Mainline Release Readiness v1.7 Closure Checklist: Final Closure'],
  ['docs/development/release-v1.7-final-closure.md', finalRelease, 'Mainline Release Readiness v1.7 Aggregate Summary'],
  ['docs/development/closure-v1.7-final-closure.md', finalClosure, 'Closed.'],
  ['docs/development/closure-v1.7-final-closure.md', finalClosure, 'Development and Mainline Release Readiness checks require final closure documents.'],
  ['docs/development/v1.7-scope.md', scope, 'CI Evidence Summary'],
  ['docs/development/v1.7-scope.md', scope, 'Main Merge Plan'],
  ['docs/development/v1.7-scope.md', scope, 'Release Tag Readiness'],
  ['docs/development/v1.7-scope.md', scope, 'Mainline Aggregate Summary'],
  ['docs/development/v1.7-scope.md', scope, 'Mainline Final Closure'],
  ['docs/decisions/0029-mainline-release-readiness-start.md', decision, '# ADR 0029: Mainline Release Readiness v1.7 Start'],
  ['docs/decisions/0029-mainline-release-readiness-start.md', decision, '- Status: accepted'],
  ['docs/development/README.md', developmentIndex, '- Latest completed implementation cycle: Context Pack Handoff Runtime v1.11'],
  ['docs/development/README.md', developmentIndex, '- Active workstream: Context Pack Handoff Runtime v1.11'],
  ['docs/development/README.md', developmentIndex, '`v1.7-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.7-pull-request-review-package.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.7-ci-evidence-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.7-main-merge-plan.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.7-release-tag-readiness.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.7-mainline-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.7-mainline-final-closure.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.7-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.7-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.7-final-closure.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.7-final-closure.md`'],
  ['docs/decisions/README.md', decisionsIndex, '`0029-mainline-release-readiness-start.md`'],
  ['CHANGELOG.md', changelog, 'Started Mainline Release Readiness v1.7 scope and decision record.'],
  ['CHANGELOG.md', changelog, 'Added Pull Request Review Package start.'],
  ['CHANGELOG.md', changelog, 'Added CI Evidence Summary package start.'],
  ['CHANGELOG.md', changelog, 'Added Main Merge Plan package start.'],
  ['CHANGELOG.md', changelog, 'Added Release Tag Readiness package start.'],
  ['CHANGELOG.md', changelog, 'Added Mainline Aggregate Summary package start.'],
  ['CHANGELOG.md', changelog, 'Added Mainline Final Closure package start.'],
  ['CHANGELOG.md', changelog, 'Added Mainline Release Readiness v1.7 aggregate release summary and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Closed Mainline Release Readiness v1.7 with final release notes and closure checklist.']
];

const missingSnippets = requiredSnippets
  .filter(([, content, snippet]) => !content.includes(snippet))
  .map(([file, , snippet]) => `${file}: ${snippet}`);

if (missingSnippets.length) {
  console.error(`Missing Mainline Release Readiness content: ${missingSnippets.join(', ')}`);
  process.exit(1);
}

const store = createInMemoryProductCoreStore(createExampleProductCoreState());
const blockedReviewPackage = createPullRequestReviewPackage(store, 'operator_run_example_001');

if (blockedReviewPackage.status !== 'blocked' || blockedReviewPackage.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Pull Request Review Package blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
const readyReviewPackage = createPullRequestReviewPackage(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyReviewPackage.status !== 'ready' || readyReviewPackage.nextWorkflow !== 'CI Evidence Summary') {
  console.error('Pull Request Review Package ready scenario did not route to CI Evidence Summary.');
  process.exit(1);
}

const blockedCiEvidence = createCiEvidenceSummary(createInMemoryProductCoreStore(createExampleProductCoreState()), 'operator_run_example_001');

if (blockedCiEvidence.status !== 'blocked' || blockedCiEvidence.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('CI Evidence Summary blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const readyCiEvidence = createCiEvidenceSummary(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyCiEvidence.status !== 'ready' || readyCiEvidence.nextWorkflow !== 'Main Merge Plan') {
  console.error('CI Evidence Summary ready scenario did not route to Main Merge Plan.');
  process.exit(1);
}

const blockedMainMergePlan = createMainMergePlan(createInMemoryProductCoreStore(createExampleProductCoreState()), 'operator_run_example_001');

if (blockedMainMergePlan.status !== 'blocked' || blockedMainMergePlan.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Main Merge Plan blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const readyMainMergePlan = createMainMergePlan(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyMainMergePlan.status !== 'ready' || readyMainMergePlan.nextWorkflow !== 'Release Tag Readiness') {
  console.error('Main Merge Plan ready scenario did not route to Release Tag Readiness.');
  process.exit(1);
}

const blockedReleaseTagReadiness = createReleaseTagReadiness(createInMemoryProductCoreStore(createExampleProductCoreState()), 'operator_run_example_001');

if (blockedReleaseTagReadiness.status !== 'blocked' || blockedReleaseTagReadiness.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Release Tag Readiness blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const readyReleaseTagReadiness = createReleaseTagReadiness(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyReleaseTagReadiness.status !== 'ready' || readyReleaseTagReadiness.nextWorkflow !== 'Mainline Aggregate Summary') {
  console.error('Release Tag Readiness ready scenario did not route to Mainline Aggregate Summary.');
  process.exit(1);
}

const blockedMainlineAggregateSummary = createMainlineAggregateSummary(createInMemoryProductCoreStore(createExampleProductCoreState()), 'operator_run_example_001');

if (blockedMainlineAggregateSummary.status !== 'blocked' || blockedMainlineAggregateSummary.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Mainline Aggregate Summary blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const readyMainlineAggregateSummary = createMainlineAggregateSummary(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyMainlineAggregateSummary.status !== 'ready' || readyMainlineAggregateSummary.nextWorkflow !== 'Mainline Final Closure') {
  console.error('Mainline Aggregate Summary ready scenario did not route to Mainline Final Closure.');
  process.exit(1);
}

const blockedMainlineFinalClosure = createMainlineFinalClosure(createInMemoryProductCoreStore(createExampleProductCoreState()), 'operator_run_example_001');

if (blockedMainlineFinalClosure.status !== 'blocked' || blockedMainlineFinalClosure.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Mainline Final Closure blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const readyMainlineFinalClosure = createMainlineFinalClosure(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyMainlineFinalClosure.status !== 'closed' || readyMainlineFinalClosure.nextWorkflow !== 'Mainline Release Readiness v1.7 Closed') {
  console.error('Mainline Final Closure ready scenario did not close Mainline Release Readiness v1.7.');
  process.exit(1);
}

console.log('Mainline Release Readiness requirements passed.');
