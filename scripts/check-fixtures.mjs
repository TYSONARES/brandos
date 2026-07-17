import { readFileSync } from 'node:fs';

const checks = [
  {
    schema: 'schemas/brand-profile.schema.json',
    fixture: 'fixtures/brand-profile.example.json'
  },
  {
    schema: 'schemas/context-pack.schema.json',
    fixture: 'fixtures/context-pack.example.json'
  },
  {
    schema: 'schemas/claim.schema.json',
    fixture: 'fixtures/claim.example.json'
  },
  {
    schema: 'schemas/source.schema.json',
    fixture: 'fixtures/source.example.json'
  },
  {
    schema: 'schemas/decision.schema.json',
    fixture: 'fixtures/decision.example.json'
  },
  {
    schema: 'schemas/review.schema.json',
    fixture: 'fixtures/review.example.json'
  },
  {
    schema: 'schemas/workflow-run.schema.json',
    fixture: 'fixtures/workflow-run.example.json'
  },
  {
    schema: 'schemas/design-token.schema.json',
    fixture: 'fixtures/design-token.example.json'
  },
  {
    schema: 'schemas/component-spec.schema.json',
    fixture: 'fixtures/component-spec.example.json'
  }
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

for (const check of checks) {
  const schema = readJson(check.schema);
  const fixture = readJson(check.fixture);
  const missing = schema.required.filter((key) => !(key in fixture));

  if (missing.length) {
    console.error(`${check.fixture} is missing required fields: ${missing.join(', ')}`);
    process.exit(1);
  }

  for (const [key, definition] of Object.entries(schema.properties)) {
    if (definition.enum && fixture[key] !== undefined && !definition.enum.includes(fixture[key])) {
      console.error(`${check.fixture} has invalid ${key}: ${fixture[key]}`);
      process.exit(1);
    }
  }
}

console.log('Fixture contracts passed.');
