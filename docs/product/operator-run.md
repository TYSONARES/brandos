# Operator Run

## Purpose

An Operator Run groups the workflow state an operator needs to start, track, and close a unit of BrandOS
work.

## Required Fields

- Identity: id, workspace, workflow run, owner
- Objective
- Status
- Priority
- Linked Workflow Actions
- Current Workflow Action
- Handoff id
- Audit event ids
- Started and updated timestamps
- Optional completed timestamp

## Status

Operator Run status values are:

- `queued`: run is waiting for operator attention.
- `active`: run is being worked.
- `blocked`: run cannot finish until a Workflow Action or review blocker is resolved.
- `ready`: run has no known readiness blockers and can move to handoff or use.
- `complete`: run has been closed with evidence.

## Schema

The contract is defined in `schemas/operator-run.schema.json`.

## Acceptance Criteria

- The run belongs to one Workflow Run.
- The run lists the Workflow Actions that define its executable work.
- The run identifies the current action.
- The run includes handoff and audit references even while the concrete handoff and audit models are still represented by Studio surfaces.
- The run status is explicit enough for Studio queue and runbook views.

## Runtime Behavior

The in-memory baseline can summarize an Operator Run by resolving its Workflow Run and current Workflow
Action. The summary exposes action counts, current action status, next action label, handoff id, audit
event count, and owner.
