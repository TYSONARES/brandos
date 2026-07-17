import { existsSync } from 'node:fs';

const required = [
  'docs/design/release-v0.3.0.md',
  'docs/decisions/0013-design-system-start.md',
  'docs/decisions/0014-design-system-v0.3-complete.md',
  'schemas/design-token.schema.json',
  'schemas/component-spec.schema.json',
  'fixtures/design-token.example.json',
  'fixtures/component-spec.example.json',
  'fixtures/tokens/color.json',
  'fixtures/tokens/typography.json',
  'fixtures/tokens/spacing.json',
  'fixtures/tokens/radius.json',
  'fixtures/tokens/shadow.json',
  'fixtures/tokens/motion.json',
  'fixtures/components/brand-profile-summary.json',
  'fixtures/components/claim-status-row.json',
  'fixtures/components/decision-record.json',
  'fixtures/components/context-pack-card.json',
  'fixtures/components/review-panel.json',
  'fixtures/components/workflow-stepper.json',
  'docs/design/accessibility-checklist.md',
  'docs/design/review-checklist.md',
  'docs/design/state-guidelines.md'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing design release requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Design release requirements passed.');
