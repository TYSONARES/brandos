# Workflows

## Detailed Specs

Detailed workflow specifications live in `docs/product/workflows/`.

## Workflow Run Schema

Workflow execution records use `schemas/workflow-run.schema.json`.

## Core Workflows

### Create Brand Profile

- Input: workspace, initial sources, owner intent
- Output: draft Brand Profile
- Owner: Brand Owner or Strategist
- Acceptance: profile has audience, positioning, voice, proof, and open questions

### Verify Claim

- Input: claim and supporting sources
- Output: supported, disputed, or approved claim
- Owner: Strategist
- Acceptance: claim links to evidence or a decision record

### Approve Decision

- Input: proposed decision, rationale, consequences
- Output: accepted or rejected decision
- Owner: Brand Owner
- Acceptance: decision has status, date, owner, and affected objects

### Generate Context Pack

- Input: task type, approved claims, relevant decisions, output constraints
- Output: AI-ready context bundle
- Owner: Operator
- Acceptance: pack declares scope, expiry, source objects, and usage notes

### Run Review

- Input: target object and reviewer list
- Output: approved, changes-needed, or rejected review
- Owner: Operator
- Acceptance: review records feedback and final status
