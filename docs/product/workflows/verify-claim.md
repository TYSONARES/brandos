# Verify Claim

## Trigger

A draft Claim needs to become supported, disputed, approved, or rejected for reuse.

## Owner

Strategist.

## Inputs

- Claim identifier
- Claim statement
- Linked Sources
- Linked Decisions
- Reviewer notes, if available

## Steps

1. Confirm the Claim is specific and reusable.
2. Review linked Sources and Decisions.
3. Determine whether evidence supports, disputes, or fails to support the Claim.
4. Update Claim status.
5. Record rationale and affected Brand Profile or Context Pack references.

## Output

Claim with updated status.

## Acceptance Criteria

- Supported Claims link to at least one Source or accepted Decision.
- Disputed Claims record the reason for dispute.
- Approved Claims are safe to reuse in Brand Profiles and Context Packs.

## Failure States

- Claim is too broad to verify.
- Claim has no evidence and no accepted Decision.
- Evidence contradicts the statement.
