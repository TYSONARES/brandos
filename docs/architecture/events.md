# Events

## Purpose

Event boundaries define cross-service state notifications before runtime event infrastructure is selected.

## Rules

- Events must name producer service and consumers.
- Event payloads must preserve traceability.
- Events must not replace source-of-truth records.
- Event infrastructure selection is out of scope for v0.5.

## Schema

The draft contract is defined in `schemas/event-boundary.schema.json`.

## Fixture

See `fixtures/event-boundary.example.json`.
