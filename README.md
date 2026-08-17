# BrandOS

BrandOS is a repository-first operating system for building, governing, and scaling brand intelligence.
This repository is the single source of truth for product direction, design standards, AI agent behavior,
architecture decisions, and delivery workflow.

## Current Release

- Released baseline: Foundation v0.1.0
- Latest completed workstream: Development Ready v1.0
- Latest completed implementation cycle: Release Governance v1.8
- Active workstream: Productization Runtime v1.9
- Status: productization runtime scope started
- Principle: docs and manifests define the operating contract before implementation begins

## Read First

Every AI tool and human contributor must read these files before making changes:

1. `README.md`
2. `PROJECT_MANIFEST.md`
3. `CODEX.md`
4. `docs/README.md`

## Roadmap

- v0.1 Foundation: repository standards, governance, manifests, and working agreements
- v0.2 Product Core: core domain, user journeys, and product primitives
- v0.3 Design System: interface language, tokens, components, and accessibility
- v0.4 AI Agents: agent roles, prompts, memory, evaluations, and tool contracts
- v0.5 Architecture: application architecture, APIs, data, security, and integration patterns
- v0.6 Infrastructure: environments, CI/CD, observability, and release operations
- v1.0 Development Ready: implementation-ready baseline

## Completed Workstreams

Product Core v0.2 defined the first durable product model for BrandOS: workspace structure,
brand profiles, source evidence, strategic decisions, workflows, approvals, and AI-ready context packs.

Design System v0.3 defined design tokens, component specs, accessibility rules, and review standards
that map directly to Product Core objects and workflows.

AI Agents v0.4 defined agent roles, prompt contracts, context loading, memory policy, evaluations,
handoff behavior, and safety rules for repository-grounded AI work.

Architecture v0.5 defined service boundaries, API boundaries, data entities, events, auth, permissions,
testing, and integration rules before runtime implementation begins.

Infrastructure v0.6 defined environments, deployment gates, CI/CD expectations, observability, secrets,
backups, incidents, and release operations before development readiness.

Development Ready v1.0 established the first runnable app shell, package boundaries, local setup rules,
runtime baseline, quality gates, static build, local preview server, and test-covered Product Core use cases.

## Active Workstream

Productization Runtime v1.9 turns the released BrandOS v1.0.0 baseline into the first product-facing
runtime track while keeping scope, product surfaces, workflow priority, evidence, and closure grounded
in repository truth.

## Repository Contract

If a decision is not represented in this repository, it is not official. Chat history, external notes,
and temporary drafts are useful inputs, but they are not authoritative until merged here.
