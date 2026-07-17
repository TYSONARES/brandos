# Objects

## Core Objects

| Object | Purpose | Required Status |
| --- | --- | --- |
| Workspace | Groups people, brands, sources, decisions, and workflows. | active, archived |
| Brand Profile | Holds approved brand strategy and operating context. | draft, approved, deprecated |
| Source | Captures evidence imported or authored inside BrandOS. | draft, verified, rejected |
| Claim | A specific statement about the brand, audience, market, or offer. | draft, supported, disputed, approved |
| Decision | Records a strategic choice and its rationale. | proposed, accepted, deprecated |
| Context Pack | Packages approved knowledge for AI or human execution. | draft, approved, expired |
| Workflow Run | Tracks an instance of a product workflow. | queued, active, blocked, complete |
| Review | Records feedback, approval, or rejection. | requested, changes-needed, approved |

## Relationship Rules

- A Brand Profile belongs to one Workspace.
- A Claim should link to at least one Source or Decision before approval.
- A Context Pack must declare its intended task and included knowledge scope.
- A Review must identify reviewer, target object, status, and timestamp.
