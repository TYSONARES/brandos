# Domain Model

## Purpose

The architecture domain model maps Product Core domains to system ownership boundaries.

## Product Core Domains

- Workspace
- Brand Profile
- Evidence
- Decision
- Workflow
- Context Pack
- Review

## Service Boundary Rule

Each service boundary must own a clear set of domains and explicitly name what it does not own.

## Schema

The draft contract is defined in `schemas/service-boundary.schema.json`.

## Fixture

See `fixtures/service-boundary.example.json`.
