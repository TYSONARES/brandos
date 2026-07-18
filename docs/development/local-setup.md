# Local Setup

## Purpose

Local setup defines how contributors start working on BrandOS without relying on private context.

## Requirements

- Use the repository root as the working directory.
- Run repository checks before committing changes.
- Do not add external services to local setup without an ADR.
- Do not commit generated secrets, local databases, or machine-specific files.

## Commands

- `npm run check:all` validates the repository contract.
- `npm run smoke:app` runs the first app shell smoke test.
- `npm run build:studio` generates blocked and ready local Studio HTML builds.
- `npm run render:studio -- --complete-workflow-action=workflow_action_example_001` renders the ready shell from a Workflow Action command.
- `npm run persist:studio-action -- --complete-workflow-action=workflow_action_example_001` stores local Studio Workflow Action state under `.tmp/`.
- `npm run serve:studio` serves the generated Studio build at `http://localhost:4173`.

## Environment

The baseline implementation must run without required environment variables. Optional variables must be documented in `.env.example`.

## Build Output

Studio build output is generated under `dist/studio/index.html` and `dist/studio/ready.html`. The generated pages include workflow scenario navigation so blocked and ready states can be compared during local QA. The `dist/` directory is local build output and is not committed.
The generated preview stores completed Workflow Action ids in browser state only; it does not write repository files.
Repository-backed local Workflow Action state is written under `.tmp/studio-workflow-state.json`, which is ignored by git.

## Local Preview

Run `npm run build:studio` before `npm run serve:studio`. Set `PORT` to use another local port.
