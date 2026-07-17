import { existsSync } from 'node:fs';

const required = [
  'docs/design/v0.3-scope.md',
  'docs/design/principles.md',
  'docs/design/tokens.md',
  'docs/design/token-set.md',
  'docs/design/components.md',
  'docs/design/accessibility.md',
  'docs/design/design-review.md',
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
  'docs/decisions/0013-design-system-start.md'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing design system requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Design system requirements passed.');
