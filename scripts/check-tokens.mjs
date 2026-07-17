import { readFileSync } from 'node:fs';

const schema = JSON.parse(readFileSync('schemas/design-token.schema.json', 'utf8'));
const files = [
  'fixtures/tokens/color.json',
  'fixtures/tokens/typography.json',
  'fixtures/tokens/spacing.json',
  'fixtures/tokens/radius.json',
  'fixtures/tokens/shadow.json',
  'fixtures/tokens/motion.json'
];

const seen = new Set();

for (const file of files) {
  const tokens = JSON.parse(readFileSync(file, 'utf8'));

  if (!Array.isArray(tokens) || tokens.length === 0) {
    console.error(`${file} must contain a non-empty token array.`);
    process.exit(1);
  }

  for (const token of tokens) {
    const missing = schema.required.filter((key) => !(key in token));
    if (missing.length) {
      console.error(`${file} token is missing required fields: ${missing.join(', ')}`);
      process.exit(1);
    }

    if (seen.has(token.name)) {
      console.error(`Duplicate token name: ${token.name}`);
      process.exit(1);
    }
    seen.add(token.name);

    for (const [key, definition] of Object.entries(schema.properties)) {
      if (definition.enum && token[key] !== undefined && !definition.enum.includes(token[key])) {
        console.error(`${file} has invalid ${key}: ${token[key]}`);
        process.exit(1);
      }
    }
  }
}

console.log('Design token set passed.');
