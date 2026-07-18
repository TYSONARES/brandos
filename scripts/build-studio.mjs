import { mkdirSync, writeFileSync } from 'node:fs';

import { createBrandOSStudioShell } from '../apps/studio/src/app.mjs';
import { renderStudioHtml } from '../apps/studio/src/render-html.mjs';

const outputDir = 'dist/studio';
const builds = [
  {
    path: `${outputDir}/index.html`,
    shell: createBrandOSStudioShell()
  },
  {
    path: `${outputDir}/ready.html`,
    shell: createBrandOSStudioShell({ completeWorkflowAction: true })
  }
];

mkdirSync(outputDir, { recursive: true });

for (const build of builds) {
  writeFileSync(build.path, `${renderStudioHtml(build.shell)}\n`, 'utf8');
  console.log(`Built ${build.path}`);
}
