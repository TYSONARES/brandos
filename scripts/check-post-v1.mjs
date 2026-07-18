import { existsSync } from 'node:fs';

const required = [
  'docs/development/iteration-post-v1-workflow-actions.md',
  'docs/product/workflow-action.md',
  'schemas/workflow-action.schema.json',
  'fixtures/workflow-action.example.json',
  'fixtures/components/action-status-badge.json',
  'fixtures/components/workflow-action-row.json',
  'fixtures/components/workflow-action-state-panel.json',
  'apps/studio/src/browser-state-adapter.mjs',
  'apps/studio/src/repository-state-adapter.mjs',
  'scripts/inspect-studio-action.mjs',
  'scripts/persist-studio-action.mjs',
  'scripts/reset-studio-action.mjs',
  'scripts/check-studio-action-state.mjs',
  'scripts/check-studio-render.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing post-v1 iteration requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Post-v1 iteration requirements passed.');
