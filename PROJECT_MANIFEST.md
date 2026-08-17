# Project Manifest

## Identity

- Name: BrandOS
- Released baseline: Foundation v0.1.0
- Latest completed workstream: Development Ready v1.0
- Latest completed implementation cycle: Context Pack Readiness Runtime v1.10
- Active workstream: Context Pack Handoff Runtime v1.11
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

## v0.6 Scope

Infrastructure v0.6 defines repository-level environment, deployment, CI/CD, observability, secret, backup,
incident, cost, and release operations standards.

## v0.6 Completion

Infrastructure v0.6 is complete at repository definition level. See `docs/infrastructure/release-v0.6.0.md`
and `docs/decisions/0020-infrastructure-v0.6-complete.md`.

## v1.0 Scope

Development Ready v1.0 establishes the first runnable BrandOS implementation baseline. It introduces
the app shell, package boundaries, local setup rules, runtime baseline, and quality gates required before
feature implementation can begin.

## v1.0 Completion

Development Ready v1.0 is complete at implementation baseline level. See `docs/development/release-v1.0.0.md`
and `docs/decisions/0022-development-ready-v1.0-complete.md`.

## v1.1 Scope

Operator Runtime v1.1 turns the completed post-v1 Studio workflow surface into a traceable operator
execution baseline. It defines operator run state, queue behavior, runbook execution, and handoff
acceptance without adding production deployment, database, authentication, external integrations, or
AI model execution.

## v1.1 Completion

Operator Runtime v1.1 is complete at implementation cycle level. See
`docs/development/release-v1.1-final-closure.md` and `docs/development/closure-v1.1-final-closure.md`.

## v1.2 Scope

Agent Handoff Runtime v1.2 turns accepted Operator Runtime handoff context into deterministic,
repository-backed agent work context. It defines agent handoff context, agent task packets, inspection,
and traceability checks without adding live AI model execution or external agent orchestration.

## v1.7 Completion

Mainline Release Readiness v1.7 is complete at implementation cycle level. See
`docs/development/release-v1.7-final-closure.md` and `docs/development/closure-v1.7-final-closure.md`.

## v1.8 Scope

Release Governance v1.8 turns completed mainline readiness into repository-backed release governance.
It defines release decision evidence, approval readiness, publication planning, rollback readiness, and
post-release audit signals without adding production deployment, external release automation, database
integration, authentication runtime, or live AI model execution.

## v1.8 Completion

Release Governance v1.8 is complete at implementation cycle level. See
`docs/development/release-v1.8-final-closure.md` and `docs/development/closure-v1.8-final-closure.md`.

## v1.9 Scope

Productization Runtime v1.9 turns the released BrandOS v1.0.0 baseline into the first product-facing
runtime track. It defines productization scope, product surface inventory, workflow prioritization,
Studio Product Mode, product evidence packs, aggregate summary, and final closure without adding
production deployment, database integration, authentication runtime, external integrations, hosted
infrastructure, or live AI model execution.

## v1.9 Completion

Productization Runtime v1.9 is complete at implementation cycle level on the productization branch.
See `docs/development/release-v1.9-final-closure.md` and
`docs/development/closure-v1.9-final-closure.md`.

## v1.10 Scope

Context Pack Readiness Runtime v1.10 turns the first productized Studio Product Mode path into a
dedicated readiness runtime track. It defines context pack readiness scope, readiness evidence,
operator decision state, Studio readiness details, aggregate summary, and final closure without adding
production deployment, database integration, authentication runtime, external integrations, hosted
infrastructure, or live AI model execution.

## v1.10 Completion

Context Pack Readiness Runtime v1.10 is complete at implementation cycle level on the context pack
readiness branch. See `docs/development/release-v1.10-final-closure.md` and
`docs/development/closure-v1.10-final-closure.md`.

## v1.11 Scope

Context Pack Handoff Runtime v1.11 turns completed Context Pack readiness evidence into a deterministic
handoff runtime track. It defines handoff source packaging, agent context readiness, Studio handoff
details, aggregate summary, and final closure without adding production deployment, database integration,
authentication runtime, external integrations, hosted infrastructure, or live AI model execution.

## Definition of Done

- Core repository files exist and are internally linked.
- Documentation has owners, status, and clear next-step placeholders.
- GitHub collaboration, issue, PR, and decision templates exist.
- Future versions have stable locations in the repository.
- AI agents can begin a fresh session and understand how to work here.
