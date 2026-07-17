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
- `npm run build:studio` generates the local Studio HTML build.

## Environment

The baseline implementation must run without required environment variables. Optional variables must be documented in `.env.example`.

## Build Output

Studio build output is generated under `dist/studio/index.html`. The `dist/` directory is local build output and is not committed.
