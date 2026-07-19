# App Shell

## Purpose

The app shell proves that BrandOS can run from repository-defined contracts.

## Baseline App

The first app is `apps/studio`. It exposes a minimal BrandOS Studio shell with:

- app identity
- release readiness status
- enabled package list
- Product Core model count
- Product Core object count from deterministic example state
- Context Pack readiness from the first domain use-case layer
- next actions for blocked Context Pack readiness
- separated Brand overview and Context Pack workflow panels
- action status for Context Pack workflow next actions
- Action Status Badge and Workflow Action Row render semantics
- owner, target, and completion control for pending Workflow Actions
- completed Workflow Action command options for ready-state rendering
- browser-backed saved action state for static Studio preview
- isolated browser state adapter for Workflow Action preview state
- repository-backed local Workflow Action state adapter
- versioned durable Studio state adapter
- render command integration for repository-backed Workflow Action state
- inspect and reset commands for local Workflow Action state
- command-output validation for local Workflow Action state
- state source panel for browser and repository Workflow Action state
- durable state version and completed action history in the state panel
- dedicated inspect command for durable Studio state
- dedicated reset command for durable Studio state
- post-v1 Durable Studio State release notes
- post-v1 Durable Studio State closure checklist
- dedicated Studio state inspection panel
- post-v1 Studio State Inspection release notes
- post-v1 Studio State Inspection closure checklist
- compact visual treatment for Workflow Action state source rows
- component fixture coverage for the Workflow Action state panel
- post-v1 Workflow Actions release notes
- post-v1 Workflow Actions closure checklist
- render quality checks for landmarks and component classes
- blocked and ready Context Pack workflow render scenarios
- blocked and ready Studio static build outputs
- HTML rendering for the initial Studio overview
- static HTML build output under `dist/studio/index.html`
- smoke output for CI

## Rules

- The shell must not invent product behavior beyond approved docs.
- The shell must import domain, contract, and design-system package boundaries.
- User-facing implementation details will be added only after v1.0 quality gates are stable.
