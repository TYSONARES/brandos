import { existsSync } from 'node:fs';
import {
  completeWorkflowAction,
  createMergeReadiness,
  createPullRequestReadiness,
  createRepositoryCollaborationAggregateSummary,
  createRepositoryCollaborationFinalClosure,
  createReviewEvidenceSummary,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createRepositoryBranchStatus
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.6-scope.md',
  'docs/development/iteration-v1.6-repository-branch-status.md',
  'docs/development/iteration-v1.6-pull-request-readiness.md',
  'docs/development/iteration-v1.6-review-evidence-summary.md',
  'docs/development/iteration-v1.6-merge-readiness.md',
  'docs/development/iteration-v1.6-repository-collaboration-aggregate-summary.md',
  'docs/development/iteration-v1.6-repository-collaboration-final-closure.md',
  'docs/development/release-v1.6-aggregate-summary.md',
  'docs/development/closure-v1.6-aggregate-summary.md',
  'docs/development/release-v1.6-final-closure.md',
  'docs/development/closure-v1.6-final-closure.md',
  'docs/decisions/0028-repository-collaboration-workflow-start.md',
  'fixtures/components/repository-branch-status-panel.json',
  'fixtures/components/pull-request-readiness-panel.json',
  'fixtures/components/review-evidence-summary-panel.json',
  'fixtures/components/merge-readiness-panel.json',
  'fixtures/components/repository-collaboration-aggregate-summary-panel.json',
  'fixtures/components/repository-collaboration-final-closure-panel.json',
  'apps/studio/src/app.mjs',
  'apps/studio/src/render-html.mjs',
  'packages/domain/src/use-cases.mjs',
  'packages/domain/src/index.mjs',
  'tests/domain/product-core-use-cases.test.mjs',
  'tests/studio/render-html.test.mjs',
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

const store = createInMemoryProductCoreStore(createExampleProductCoreState());
const blocked = createRepositoryBranchStatus(store, 'operator_run_example_001');

if (blocked.status !== 'blocked' || blocked.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Repository Branch Status blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const blockedPullRequest = createPullRequestReadiness(store, 'operator_run_example_001');

if (blockedPullRequest.status !== 'blocked' || blockedPullRequest.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Pull Request Readiness blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const blockedReviewEvidence = createReviewEvidenceSummary(store, 'operator_run_example_001');

if (blockedReviewEvidence.status !== 'blocked' || blockedReviewEvidence.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Review Evidence Summary blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const blockedMergeReadiness = createMergeReadiness(store, 'operator_run_example_001');

if (blockedMergeReadiness.status !== 'blocked' || blockedMergeReadiness.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Merge Readiness blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const blockedAggregateSummary = createRepositoryCollaborationAggregateSummary(store, 'operator_run_example_001');

if (blockedAggregateSummary.status !== 'blocked' || blockedAggregateSummary.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Repository Collaboration Aggregate Summary blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

const blockedFinalClosure = createRepositoryCollaborationFinalClosure(store, 'operator_run_example_001');

if (blockedFinalClosure.status !== 'blocked' || blockedFinalClosure.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Repository Collaboration Final Closure blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
const ready = createRepositoryBranchStatus(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (ready.status !== 'ready' || ready.nextWorkflow !== 'Pull Request Readiness') {
  console.error('Repository Branch Status ready scenario did not route to Pull Request Readiness.');
  process.exit(1);
}

const readyPullRequest = createPullRequestReadiness(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyPullRequest.status !== 'ready' || readyPullRequest.nextWorkflow !== 'Review Evidence Summary') {
  console.error('Pull Request Readiness ready scenario did not route to Review Evidence Summary.');
  process.exit(1);
}

const readyReviewEvidence = createReviewEvidenceSummary(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyReviewEvidence.status !== 'ready' || readyReviewEvidence.nextWorkflow !== 'Merge Readiness') {
  console.error('Review Evidence Summary ready scenario did not route to Merge Readiness.');
  process.exit(1);
}

const readyMergeReadiness = createMergeReadiness(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyMergeReadiness.status !== 'ready' || readyMergeReadiness.nextWorkflow !== 'Repository Collaboration Aggregate Summary') {
  console.error('Merge Readiness ready scenario did not route to Repository Collaboration Aggregate Summary.');
  process.exit(1);
}

const readyAggregateSummary = createRepositoryCollaborationAggregateSummary(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyAggregateSummary.status !== 'ready' || readyAggregateSummary.nextWorkflow !== 'Repository Collaboration Final Closure') {
  console.error('Repository Collaboration Aggregate Summary ready scenario did not route to Repository Collaboration Final Closure.');
  process.exit(1);
}

const readyFinalClosure = createRepositoryCollaborationFinalClosure(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (readyFinalClosure.status !== 'closed' || readyFinalClosure.nextWorkflow !== 'Repository Collaboration v1.6 Closed') {
  console.error('Repository Collaboration Final Closure ready scenario did not close Repository Collaboration v1.6.');
  process.exit(1);
}

console.log('Repository Collaboration Workflow requirements passed.');
