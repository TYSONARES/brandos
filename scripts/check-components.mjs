import { readFileSync } from 'node:fs';

const schema = JSON.parse(readFileSync('schemas/component-spec.schema.json', 'utf8'));
const componentFiles = [
  'fixtures/components/brand-profile-summary.json',
  'fixtures/components/claim-status-row.json',
  'fixtures/components/decision-record.json',
  'fixtures/components/context-pack-card.json',
  'fixtures/components/context-pack-usage-flow.json',
  'fixtures/components/review-panel.json',
  'fixtures/components/review-resolution-workflow-panel.json',
  'fixtures/components/workflow-stepper.json',
  'fixtures/components/action-status-badge.json',
  'fixtures/components/workflow-action-row.json',
  'fixtures/components/workflow-action-state-panel.json',
  'fixtures/components/studio-state-inspection-panel.json',
  'fixtures/components/multi-action-workflow-state-panel.json',
  'fixtures/components/studio-workflow-audit-trail-panel.json',
  'fixtures/components/studio-diagnostics-panel.json',
  'fixtures/components/operator-guidance-panel.json',
  'fixtures/components/operator-handoff-panel.json',
  'fixtures/components/operator-run-queue-panel.json',
  'fixtures/components/operator-workflow-panel.json',
  'fixtures/components/operator-workflow-execution-controls.json'
];
const tokenFiles = [
  'fixtures/tokens/color.json',
  'fixtures/tokens/typography.json',
  'fixtures/tokens/spacing.json',
  'fixtures/tokens/radius.json',
  'fixtures/tokens/shadow.json',
  'fixtures/tokens/motion.json'
];

const tokenNames = new Set();
for (const file of tokenFiles) {
  for (const token of JSON.parse(readFileSync(file, 'utf8'))) {
    tokenNames.add(token.name);
  }
}

const componentNames = new Set();

for (const file of componentFiles) {
  const component = JSON.parse(readFileSync(file, 'utf8'));
  const missing = schema.required.filter((key) => !(key in component));

  if (missing.length) {
    console.error(`${file} is missing required fields: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (componentNames.has(component.name)) {
    console.error(`Duplicate component name: ${component.name}`);
    process.exit(1);
  }
  componentNames.add(component.name);

  for (const [key, definition] of Object.entries(schema.properties)) {
    if (definition.enum && component[key] !== undefined && !definition.enum.includes(component[key])) {
      console.error(`${file} has invalid ${key}: ${component[key]}`);
      process.exit(1);
    }
  }

  for (const token of component.tokens) {
    if (!tokenNames.has(token)) {
      console.error(`${file} references unknown token: ${token}`);
      process.exit(1);
    }
  }
}

console.log('Component specs passed.');
