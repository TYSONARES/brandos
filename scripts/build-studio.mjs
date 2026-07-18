import { mkdirSync, writeFileSync } from 'node:fs';

import { createBrandOSStudioShell } from '../apps/studio/src/app.mjs';
import { renderStudioHtml } from '../apps/studio/src/render-html.mjs';

const outputDir = 'dist/studio';
const builds = [
  {
    path: `${outputDir}/index.html`,
    shell: createBrandOSStudioShell(),
    activeScenario: 'blocked'
  },
  {
    path: `${outputDir}/ready.html`,
    shell: createBrandOSStudioShell({ completedWorkflowActionId: 'workflow_action_example_001' }),
    activeScenario: 'ready'
  }
];

mkdirSync(outputDir, { recursive: true });

for (const build of builds) {
  writeFileSync(build.path, `${renderStudioHtml(build.shell, { activeScenario: build.activeScenario })}\n`, 'utf8');
  console.log(`Built ${build.path}`);
}
