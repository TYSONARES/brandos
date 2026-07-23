import { existsSync } from 'node:fs';
import {
  completeWorkflowAction,
  createPullRequestReadiness,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createRepositoryBranchStatus
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.6-scope.md',
  'docs/development/iteration-v1.6-repository-branch-status.md',
  'docs/development/iteration-v1.6-pull-request-readiness.md',
  'docs/decisions/0028-repository-collaboration-workflow-start.md',
  'fixtures/components/repository-branch-status-panel.json',
  'fixtures/components/pull-request-readiness-panel.json',
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

console.log('Repository Collaboration Workflow requirements passed.');
