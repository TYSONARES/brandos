import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'docs/ai/v0.4-scope.md',
  'docs/ai/agent-principles.md',
  'docs/ai/agent-roles.md',
  'docs/ai/prompt-contracts.md',
  'docs/ai/context-loading.md',
  'schemas/agent-card.schema.json',
  'schemas/prompt-contract.schema.json',
  'fixtures/agent-card.example.json',
  'fixtures/prompt-contract.example.json',
  'docs/decisions/0015-ai-agents-start.md'
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));
if (missingFiles.length) {
  console.error(`Missing AI requirements: ${missingFiles.join(', ')}`);
  process.exit(1);
}

const checks = [
  {
    schema: 'schemas/agent-card.schema.json',
    fixture: 'fixtures/agent-card.example.json'
  },
  {
    schema: 'schemas/prompt-contract.schema.json',
    fixture: 'fixtures/prompt-contract.example.json'
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

console.log('AI agent requirements passed.');
