import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'docs/ai/v0.4-scope.md',
  'docs/ai/agent-principles.md',
  'docs/ai/agent-roles.md',
  'docs/ai/agent-set.md',
  'docs/ai/prompt-contracts.md',
  'docs/ai/prompt-contract-set.md',
  'docs/ai/context-loading.md',
  'docs/ai/memory-policy.md',
  'docs/ai/evaluation.md',
  'docs/ai/output-formats.md',
  'docs/ai/safety.md',
  'docs/ai/handoff.md',
  'docs/ai/tool-use.md',
  'schemas/agent-card.schema.json',
  'schemas/prompt-contract.schema.json',
  'schemas/evaluation-check.schema.json',
  'fixtures/agent-card.example.json',
  'fixtures/prompt-contract.example.json',
  'fixtures/evaluation-check.example.json',
  'fixtures/agents/brand-context-steward.json',
  'fixtures/agents/product-spec-assistant.json',
  'fixtures/agents/design-system-assistant.json',
  'fixtures/agents/review-qa-assistant.json',
  'fixtures/agents/repository-maintenance-assistant.json',
  'fixtures/prompts/context-loading.json',
  'fixtures/prompts/product-spec.json',
  'fixtures/prompts/design-system.json',
  'fixtures/prompts/review-qa.json',
  'fixtures/prompts/repository-maintenance.json',
  'fixtures/evaluations/repository-context-loaded.json',
  'fixtures/evaluations/traceable-output.json',
  'fixtures/evaluations/scope-boundary.json',
  'docs/decisions/0015-ai-agents-start.md'
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));
if (missingFiles.length) {
  console.error(`Missing AI requirements: ${missingFiles.join(', ')}`);
  process.exit(1);
}

const exampleAgentFiles = [
  'fixtures/agent-card.example.json'
];
const agentSetFiles = [
  'fixtures/agents/brand-context-steward.json',
  'fixtures/agents/product-spec-assistant.json',
  'fixtures/agents/design-system-assistant.json',
  'fixtures/agents/review-qa-assistant.json',
  'fixtures/agents/repository-maintenance-assistant.json'
];
const examplePromptFiles = [
  'fixtures/prompt-contract.example.json'
];
const promptSetFiles = [
  'fixtures/prompts/context-loading.json',
  'fixtures/prompts/product-spec.json',
  'fixtures/prompts/design-system.json',
  'fixtures/prompts/review-qa.json',
  'fixtures/prompts/repository-maintenance.json'
];
const evaluationFiles = [
  'fixtures/evaluation-check.example.json',
  'fixtures/evaluations/repository-context-loaded.json',
  'fixtures/evaluations/traceable-output.json',
  'fixtures/evaluations/scope-boundary.json'
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function validateFixture(schema, fixture, file) {
  const missing = schema.required.filter((key) => !(key in fixture));

  if (missing.length) {
    console.error(`${file} is missing required fields: ${missing.join(', ')}`);
    process.exit(1);
  }

  for (const [key, definition] of Object.entries(schema.properties)) {
    if (definition.enum && fixture[key] !== undefined && !definition.enum.includes(fixture[key])) {
      console.error(`${file} has invalid ${key}: ${fixture[key]}`);
      process.exit(1);
    }
  }
}

const agentSchema = readJson('schemas/agent-card.schema.json');
const promptSchema = readJson('schemas/prompt-contract.schema.json');
const evaluationSchema = readJson('schemas/evaluation-check.schema.json');
const agentIds = new Set();

for (const file of exampleAgentFiles) {
  validateFixture(agentSchema, readJson(file), file);
}

for (const file of agentSetFiles) {
  const fixture = readJson(file);
  validateFixture(agentSchema, fixture, file);
  if (agentIds.has(fixture.id)) {
    console.error(`Duplicate agent id: ${fixture.id}`);
    process.exit(1);
  }
  agentIds.add(fixture.id);
}

for (const file of examplePromptFiles) {
  validateFixture(promptSchema, readJson(file), file);
}

for (const file of promptSetFiles) {
  const fixture = readJson(file);
  validateFixture(promptSchema, fixture, file);
  if (!agentIds.has(fixture.agentId)) {
    console.error(`${file} references unknown agentId: ${fixture.agentId}`);
    process.exit(1);
  }
}

for (const file of evaluationFiles) {
  const fixture = readJson(file);
  validateFixture(evaluationSchema, fixture, file);
}

console.log('AI agent requirements passed.');
