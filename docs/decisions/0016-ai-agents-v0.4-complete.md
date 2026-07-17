# ADR 0016: AI Agents v0.4 Complete

- Status: accepted
- Date: 2026-07-17
- Owner: BrandOS maintainers

## Context

BrandOS needed repository-level AI agent standards before architecture and infrastructure work could rely
on agent behavior, context loading, prompt boundaries, and evaluation rules.

## Decision

AI Agents v0.4 is complete at the repository definition level. The official AI agent system includes
agent cards, prompt contracts, context loading, memory policy, evaluation checks, output formats, safety
rules, handoff rules, and tool-use expectations.

## Consequences

- v0.5 Architecture can map future services and data boundaries to agent contracts.
- AI agents must load repository context before acting.
- Future runtime agent implementation must conform to v0.4 contracts or update them through decision records.
