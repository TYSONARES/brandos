# Memory Policy

## Policy

Repository files are source truth. Chat history, hidden memory, model memory, screenshots, and external notes
are inputs only after their content is represented in the repository.

## Allowed Memory

- Current task instructions
- Repository files
- Explicitly provided user context
- Approved Context Packs

## Disallowed Memory As Source Truth

- Private chat history
- Unverified recollection
- Hidden assistant memory
- External documents not added to the repository

## Required Behavior

- Name missing repository context before acting.
- Separate assumptions from repository facts.
- Prefer updating source files over relying on memory.
- Do not approve claims, design decisions, or agent rules from memory alone.
