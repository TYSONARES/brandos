import { existsSync } from 'node:fs';

const required = [
  'docs/ai/release-v0.4.0.md',
  'docs/decisions/0015-ai-agents-start.md',
  'docs/decisions/0016-ai-agents-v0.4-complete.md',
  'schemas/agent-card.schema.json',
  'schemas/prompt-contract.schema.json',
  'schemas/evaluation-check.schema.json',
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
  'docs/ai/context-loading.md',
  'docs/ai/memory-policy.md',
  'docs/ai/evaluation.md',
  'docs/ai/output-formats.md',
  'docs/ai/safety.md',
  'docs/ai/handoff.md',
  'docs/ai/tool-use.md'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing AI release requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('AI release requirements passed.');
