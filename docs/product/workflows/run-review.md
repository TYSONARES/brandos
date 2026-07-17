# Run Review

## Trigger

An object needs approval, rejection, or requested changes before reuse.

## Owner

Operator.

## Inputs

- Target object
- Reviewer list
- Review criteria
- Current status

## Steps

1. Confirm target object and review criteria.
2. Notify reviewers.
3. Collect feedback.
4. Resolve conflicting feedback.
5. Record final outcome.
6. Update target object status.

## Output

Review record and updated target object status.

## Acceptance Criteria

- Review identifies target, reviewer, outcome, date, and notes.
- Approved objects satisfy their object-specific acceptance criteria.
- Changes-needed reviews identify concrete required changes.

## Failure States

- Reviewer is not authorized.
- Review criteria are unclear.
- Target object changes during review without a new review cycle.
