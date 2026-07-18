# Generate Context Pack

## Trigger

A human or AI agent needs scoped brand context for a task.

## Owner

Operator.

## Inputs

- Task type
- Intended audience
- Approved Brand Profile sections
- Approved or scoped draft Claims
- Accepted Decisions
- Excluded topics
- Expiry date

## Steps

1. Select task type and intended audience.
2. Select approved Brand Profile sections.
3. Add relevant Claims and Decisions.
4. Define excluded topics and agent instructions.
5. Set expiry or review date.
6. Request Review if the pack will be reused.

## Output

Draft or approved Context Pack.

## Acceptance Criteria

- Pack declares scope, owner, task type, and expiry.
- Pack links to source BrandOS objects.
- Pack states what an AI agent may not assume.
- Pack excludes deprecated or rejected content.

## Failure States

- Pack includes stale or deprecated content.
- Pack lacks expiry.
- Pack asks an AI agent to infer unsupported strategy.

## Runtime Behavior

The Studio readiness flow reports blocking reasons and next actions for claims, decisions, and reviews.
Next actions expose a status so workflow panels can distinguish pending, blocked, and ready states.
Workflow actions are represented by `schemas/workflow-action.schema.json`.
