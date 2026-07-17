# Project Manifest

## Identity

- Name: BrandOS
- Released baseline: Foundation v0.1.0
- Latest completed workstream: Architecture v0.5
- Next workstream: Infrastructure v0.6
- Repository role: single source of truth
- Primary audience: product builders, brand strategists, designers, engineers, and AI coding agents

## Mission

BrandOS turns brand strategy into an operational system: structured knowledge, repeatable workflows,
agent-assisted decisions, design standards, and product-ready implementation guidance.

## Non-Negotiables

1. Repository truth overrides conversation memory.
2. Every change must preserve traceability from idea to decision to implementation.
3. Documentation must be actionable, not decorative.
4. AI agents must follow `CODEX.md` and the standards under `docs/standards/`.
5. Ambiguity should be resolved by updating the repository, not by relying on private context.

## v0.1.0 Scope

Foundation v0.1.0 establishes the professional GitHub repository skeleton. It does not implement
BrandOS product runtime code yet. It prepares the system for v0.2 Product Core.

## v0.2 Scope

Product Core v0.2 defines the first official BrandOS product model. It captures the core domains,
objects, roles, workflows, success metrics, and non-goals required before design system, AI agent,
architecture, and infrastructure work become implementation-ready.

## v0.2 Completion

Product Core v0.2 is complete at repository definition level. See `docs/product/release-v0.2.0.md`
and `docs/decisions/0012-product-core-v0.2-complete.md`.

## v0.3 Scope

Design System v0.3 defines repository-level design standards for BrandOS tokens, components, accessibility,
layout, interaction, content design, and review before implementation begins.

## v0.3 Completion

Design System v0.3 is complete at repository definition level. See `docs/design/release-v0.3.0.md`
and `docs/decisions/0014-design-system-v0.3-complete.md`.

## v0.4 Scope

AI Agents v0.4 defines repository-level contracts for agent roles, prompt boundaries, context loading,
memory policy, evaluations, output formats, safety, and handoffs.

## v0.4 Completion

AI Agents v0.4 is complete at repository definition level. See `docs/ai/release-v0.4.0.md`
and `docs/decisions/0016-ai-agents-v0.4-complete.md`.

## v0.5 Scope

Architecture v0.5 defines repository-level service boundaries, API boundaries, data entities, events,
auth, permissions, testing, and integration constraints.

## v0.5 Completion

Architecture v0.5 is complete at repository definition level. See `docs/architecture/release-v0.5.0.md`
and `docs/decisions/0018-architecture-v0.5-complete.md`.

## Definition of Done

- Core repository files exist and are internally linked.
- Documentation has owners, status, and clear next-step placeholders.
- GitHub collaboration, issue, PR, and decision templates exist.
- Future versions have stable locations in the repository.
- AI agents can begin a fresh session and understand how to work here.
