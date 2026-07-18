# Workflow Action

## Purpose

A Workflow Action is a concrete next step produced by a BrandOS workflow.

## Required Fields

- Identity: id, workspace, workflow run, owner
- Type
- Status
- Target object
- Label
- Created timestamp
- Optional completed timestamp

## Status

Workflow Action status values are:

- `pending`: action is ready for an owner to complete.
- `blocked`: action depends on another object or decision.
- `ready`: action can be used or released.
- `complete`: action has been finished.

## Schema

The contract is defined in `schemas/workflow-action.schema.json`.

## Acceptance Criteria

- The action belongs to a Workflow Run.
- The action identifies the target object it changes or unlocks.
- The action status is explicit.
- The action label is human-readable enough for Studio panels.
- Completed actions keep their completion timestamp.

## Runtime Behavior

Completing a `review-resolution` action approves the related Review in the in-memory baseline and allows
Context Pack readiness to move to ready when no other blockers remain.

## Studio Command Surface

Studio renders pending Workflow Actions with their owner, target object, status, and a completion control.
In the static baseline, completing the example review-resolution action navigates to the ready scenario build.
The app shell also accepts an explicit completed Workflow Action command so rendered output can be generated
from a named action instead of a generic ready-state flag.
Static Studio preview stores the completed action id in browser state so the command result can be visible
across local navigation without adding a backend.
