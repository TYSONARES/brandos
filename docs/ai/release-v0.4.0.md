# Release v0.4.0

## Name

BrandOS AI Agents

## Status

Complete for repository-level AI agent definition.

## Outcome

AI Agents v0.4.0 defines how BrandOS agents load repository truth, respect release scope, use prompt
contracts, produce traceable outputs, evaluate readiness, and hand off work without hidden memory.

## Included

- Agent principles
- Agent Card schema and fixture
- Prompt Contract schema and fixture
- Agent set for five initial BrandOS agents
- Prompt contract set mapped to agent cards
- Context loading rules
- Memory policy
- Evaluation Check schema and fixtures
- Output format rules
- Safety and refusal rules
- Handoff requirements
- Tool use rules
- AI Agents start and completion decision records

## Release Checklist

- [x] Agent cards have schema, example fixture, agent set, and validation.
- [x] Prompt contracts have schema, example fixture, prompt set, and validation.
- [x] Prompt contracts reference valid agent ids.
- [x] Context loading rules require repository source truth.
- [x] Memory policy rejects chat-only source truth.
- [x] Evaluation checks cover context, traceability, and scope boundaries.
- [x] Output, safety, handoff, and tool-use rules are documented.
- [x] Repository checks can validate AI agent requirements.

## Out Of Scope

- Runtime orchestration
- Model provider selection
- Tool implementation
- Vector database or memory infrastructure
- Production automation

## Next Release

v0.5 Architecture.
