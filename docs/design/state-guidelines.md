# State Guidelines

## Purpose

State guidelines define how BrandOS communicates Product Core object status in interface specs.

## Object States

- Draft: editable and not official.
- Proposed: ready for review.
- Supported: evidence exists but approval may still be pending.
- Approved: official and reusable.
- Changes needed: reviewed but not yet acceptable.
- Disputed: contradicted or insufficiently supported.
- Deprecated: should not be used for new work.
- Rejected: reviewed and declined.
- Expired: no longer valid without renewal.
- Blocked: cannot continue until a named issue is resolved.

## Presentation Rules

- Pair status color with status text.
- Include owner and date when status affects trust.
- Explain blocked, disputed, rejected, deprecated, and expired states.
- Keep destructive or irreversible status actions visually distinct and reviewable.

## Token Mapping

- Success: `color.status.success`
- Warning: `color.status.warning`
- Danger: `color.status.danger`
- Primary action: `color.action.primary`
