# Brand Profile

## Purpose

A Brand Profile is the central product object for approved brand strategy and operating context.

## Required Sections

- Identity: name, owner, workspace, status, update date
- Positioning: category, promise, differentiators
- Audience: primary audience and secondary audiences
- Voice: traits and language to avoid
- Proof points: evidence-backed reasons to believe
- Constraints: rules that prevent misuse
- Claims: linked claim identifiers
- Decisions: linked decision identifiers

## Schema

The draft contract is defined in `schemas/brand-profile.schema.json`.

## Acceptance Criteria

- The profile has a clear owner.
- Approved profiles include only approved or supported claims.
- Every strategic claim can be traced to a Source or Decision.
- Deprecated profiles cannot be used in new Context Packs.
