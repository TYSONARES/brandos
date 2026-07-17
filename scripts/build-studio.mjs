import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { createBrandOSStudioShell } from '../apps/studio/src/app.mjs';
import { renderStudioHtml } from '../apps/studio/src/render-html.mjs';

const outputPath = 'dist/studio/index.html';
const html = renderStudioHtml(createBrandOSStudioShell());

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${html}\n`, 'utf8');

console.log(`Built ${outputPath}`);
