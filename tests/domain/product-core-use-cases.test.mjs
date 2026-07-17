import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createBrandProfileOverview,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  evaluateContextPackReadiness,
  summarizeProductCoreState
} from '../../packages/domain/src/index.mjs';

function createExampleStore() {
  return createInMemoryProductCoreStore(createExampleProductCoreState());
}

test('example Product Core state contains one object for each runtime model', () => {
  const store = createExampleStore();
  const summary = summarizeProductCoreState(store);

  assert.equal(summary.workspaceCount, 1);
  assert.equal(summary.objectCount, 6);
  assert.equal(summary.modelCounts['brand-profile'], 1);
  assert.equal(summary.modelCounts.claim, 1);
  assert.equal(summary.modelCounts.decision, 1);
  assert.equal(summary.modelCounts.review, 1);
  assert.equal(summary.modelCounts['workflow-run'], 1);
  assert.equal(summary.modelCounts['context-pack'], 1);
});

test('Brand Profile overview resolves linked claims and decisions', () => {
  const overview = createBrandProfileOverview(createExampleStore(), 'brand_profile_example_001');

  assert.equal(overview.name, 'Example Brand');
  assert.equal(overview.claimCount, 1);
  assert.equal(overview.supportedClaimCount, 1);
  assert.equal(overview.decisionCount, 1);
  assert.equal(overview.acceptedDecisionCount, 1);
});

test('Context Pack readiness reports blocking review state', () => {
  const readiness = evaluateContextPackReadiness(createExampleStore(), 'context_pack_example_001');

  assert.equal(readiness.ready, false);
  assert.deepEqual(readiness.blockingReasons, ['Review is blocking release: review_example_001']);
});

test('Context Pack readiness passes when claims, decisions, and reviews are clear', () => {
  const state = createExampleProductCoreState();
  state.review = [
    {
      ...state.review[0],
      status: 'approved',
      notes: 'Ready for use.'
    }
  ];
  const readiness = evaluateContextPackReadiness(createInMemoryProductCoreStore(state), 'context_pack_example_001');

  assert.equal(readiness.ready, true);
  assert.deepEqual(readiness.blockingReasons, []);
});
