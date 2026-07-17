import { readFileSync } from 'node:fs';

const checks = [
  {
    file: 'docs/design/accessibility-checklist.md',
    required: ['Status is exposed as text', 'accessible name', 'Keyboard focus order', 'Focus indicators']
  },
  {
    file: 'docs/design/review-checklist.md',
    required: ['Product Core object or workflow', 'fixtures/tokens/', 'fixtures/components/', 'Accessibility checklist']
  },
  {
    file: 'docs/design/state-guidelines.md',
    required: ['Draft', 'Approved', 'Deprecated', 'Rejected', 'color.status.success']
  }
];

for (const check of checks) {
  const content = readFileSync(check.file, 'utf8');
  const missing = check.required.filter((text) => !content.includes(text));

  if (missing.length) {
    console.error(`${check.file} is missing required checklist terms: ${missing.join(', ')}`);
    process.exit(1);
  }
}

console.log('Design checklists passed.');
