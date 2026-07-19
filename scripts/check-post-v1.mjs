import { existsSync } from 'node:fs';

const required = [
  'docs/development/iteration-post-v1-workflow-actions.md',
  'docs/development/release-post-v1-workflow-actions.md',
  'docs/development/closure-post-v1-workflow-actions.md',
  'docs/development/iteration-post-v1-durable-studio-state.md',
  'docs/development/release-post-v1-durable-studio-state.md',
  'docs/development/closure-post-v1-durable-studio-state.md',
  'docs/development/iteration-post-v1-studio-state-inspection.md',
  'docs/development/release-post-v1-studio-state-inspection.md',
  'docs/development/closure-post-v1-studio-state-inspection.md',
  'docs/development/iteration-post-v1-studio-diagnostics.md',
  'docs/development/release-post-v1-studio-diagnostics.md',
  'docs/development/closure-post-v1-studio-diagnostics.md',
  'docs/development/iteration-post-v1-operator-guidance.md',
  'docs/development/release-post-v1-operator-guidance.md',
  'docs/development/closure-post-v1-operator-guidance.md',
  'docs/development/iteration-post-v1-operator-workflow.md',
  'docs/development/release-post-v1-operator-workflow.md',
  'docs/development/closure-post-v1-operator-workflow.md',
  'docs/development/iteration-post-v1-operator-workflow-execution-controls.md',
  'docs/development/release-post-v1-operator-workflow-execution-controls.md',
  'docs/development/closure-post-v1-operator-workflow-execution-controls.md',
  'docs/development/iteration-post-v1-context-pack-usage-flow.md',
  'docs/development/release-post-v1-context-pack-usage-flow.md',
  'docs/development/closure-post-v1-context-pack-usage-flow.md',
  'docs/development/iteration-post-v1-multi-action-workflow-state.md',
  'docs/development/release-post-v1-multi-action-workflow-state.md',
  'docs/development/closure-post-v1-multi-action-workflow-state.md',
  'docs/development/iteration-post-v1-review-resolution-workflow.md',
  'docs/development/release-post-v1-review-resolution-workflow.md',
  'docs/development/closure-post-v1-review-resolution-workflow.md',
  'docs/development/iteration-post-v1-studio-workflow-audit-trail.md',
  'docs/development/release-post-v1-studio-workflow-audit-trail.md',
  'docs/development/closure-post-v1-studio-workflow-audit-trail.md',
  'docs/product/workflow-action.md',
  'schemas/workflow-action.schema.json',
  'fixtures/workflow-action.example.json',
  'fixtures/components/action-status-badge.json',
  'fixtures/components/workflow-action-row.json',
  'fixtures/components/context-pack-usage-flow.json',
  'fixtures/components/review-resolution-workflow-panel.json',
  'fixtures/components/workflow-action-state-panel.json',
  'fixtures/components/studio-state-inspection-panel.json',
  'fixtures/components/multi-action-workflow-state-panel.json',
  'fixtures/components/studio-workflow-audit-trail-panel.json',
  'fixtures/components/studio-diagnostics-panel.json',
  'fixtures/components/operator-guidance-panel.json',
  'fixtures/components/operator-workflow-panel.json',
  'fixtures/components/operator-workflow-execution-controls.json',
  'apps/studio/src/browser-state-adapter.mjs',
  'apps/studio/src/repository-state-adapter.mjs',
  'apps/studio/src/studio-state-adapter.mjs',
  'scripts/inspect-studio-action.mjs',
  'scripts/persist-studio-action.mjs',
  'scripts/reset-studio-action.mjs',
  'scripts/check-studio-action-state.mjs',
  'scripts/check-studio-state.mjs',
  'scripts/inspect-studio-state.mjs',
  'scripts/reset-studio-state.mjs',
  'scripts/check-studio-render.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing post-v1 iteration requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Post-v1 iteration requirements passed.');
