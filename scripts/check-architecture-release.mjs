import { existsSync } from 'node:fs';

const required = [
  'docs/architecture/release-v0.5.0.md',
  'docs/decisions/0017-architecture-start.md',
  'docs/decisions/0018-architecture-v0.5-complete.md',
  'schemas/service-boundary.schema.json',
  'schemas/api-boundary.schema.json',
  'schemas/data-entity.schema.json',
  'schemas/event-boundary.schema.json',
  'schemas/auth-boundary.schema.json',
  'schemas/integration-boundary.schema.json',
  'schemas/test-strategy.schema.json',
  'docs/architecture/service-boundaries.md',
  'docs/architecture/api-boundaries.md',
  'docs/architecture/data-entities.md',
  'docs/architecture/events.md',
  'docs/architecture/auth.md',
  'docs/architecture/permissions.md',
  'docs/architecture/integrations.md',
  'docs/architecture/testing.md',
  'docs/architecture/frontend.md',
  'docs/architecture/backend.md'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing architecture release requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Architecture release requirements passed.');
