# Product Workflow Prioritization

## Status

Active for Productization Runtime v1.9.

## Purpose

This document ranks the first BrandOS product workflows for Studio Product Mode. Prioritization is based
on repository evidence, runtime availability, operator value, and the ability to validate without
production infrastructure.

## Criteria

| Criterion | Meaning |
| --- | --- |
| Repository evidence | The workflow maps to existing docs, fixtures, runtime code, and tests. |
| Operator value | The workflow helps a maintainer or operator make a real BrandOS decision faster. |
| Runtime readiness | The workflow can run from existing local state, fixtures, or in-memory Product Core objects. |
| Boundary fit | The workflow does not require deployment, database, authentication, external integrations, or live AI execution. |
| Product learning | The workflow teaches which product surface should become durable UI first. |

## Priority Order

1. Context Pack Readiness
2. Brand Profile Overview
3. Workflow Action State
4. Operator Run Summary
5. Release Evidence Summary

## First Product Mode Path

Studio Product Mode should begin with Context Pack Readiness because it connects Product Core objects,
review status, source evidence, AI context boundaries, and operator next actions in one inspectable flow.

## Required Product Mode Behavior

- Show whether a context pack is ready.
- Explain which claims, decisions, reviews, or workflow actions block readiness.
- Link readiness state to existing repository-backed next actions.
- Preserve a non-production boundary.
- Keep the output deterministic enough for local tests and static builds.

## Deferred Workflows

Brand Workspace Home, Evidence Library, Decision Review Queue, and AI Context Pack Builder remain future
customer-facing candidates. They should not be implemented until Studio Product Mode proves the operator
workflow and a later ADR approves any required runtime expansion.
