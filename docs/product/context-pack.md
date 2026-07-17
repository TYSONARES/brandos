# Context Pack

## Purpose

A Context Pack is the bridge between BrandOS product truth and AI-assisted execution.

## Required Fields

- Identity: id, workspace, name, owner, status
- Task type
- Intended audience
- Included Brand Profile sections
- Included Claims
- Included Decisions
- Excluded topics
- Agent instructions
- Expiry or review date

## Schema

The draft contract is defined in `schemas/context-pack.schema.json`.

## Acceptance Criteria

- The pack uses approved or explicitly scoped draft content.
- The pack declares what an AI agent may and may not assume.
- The pack links back to source BrandOS objects.
- The pack has an expiry date so stale context does not continue spreading.
