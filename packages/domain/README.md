# Domain Package

The domain package exposes implementation primitives that map to Product Core v0.2.

## Product Core Models

- Brand Profile
- Claim
- Decision
- Review
- Workflow Run
- Context Pack

## Rule

Model metadata must keep schema and fixture paths aligned with repository contracts.

## In-Memory Store

The initial store is deterministic and service-free. It exists to prove that the app shell can create,
read, and summarize Product Core objects before a persistence decision is made.

## Use Cases

- Brand Profile overview resolves linked claims and decisions.
- Context Pack readiness checks included claims, decisions, and blocking reviews.
