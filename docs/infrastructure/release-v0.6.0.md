# Release v0.6.0

## Name

BrandOS Infrastructure

## Status

Complete for repository-level infrastructure definition.

## Outcome

Infrastructure v0.6.0 defines BrandOS runtime and operations contracts before implementation readiness.
Later releases can depend on environment definitions, deployment targets, observability signals, secret
rules, backup expectations, incident procedures, release operations, cost controls, and CI/CD checks.

## Included

- Environment schema and fixtures
- Deployment Target schema and fixtures
- Observability Signal schema and fixtures
- Secret Policy schema and fixture
- Backup Policy schema and fixture
- Incident Procedure schema and fixture
- Release Operation schema and fixture
- Cost Control schema and fixture
- CI Check schema and fixture
- Local, preview, staging, and production environment definitions
- Preview, staging, and production deployment target definitions
- Release validation, error rate, and audit log observability signal definitions
- Infrastructure start and completion decision records

## Release Checklist

- [x] Environments are named, tiered, and validated.
- [x] Deployment targets reference valid environment ids.
- [x] Observability signals are typed and owned.
- [x] Secret handling rules are documented.
- [x] Backup and restore expectations are documented.
- [x] Incident response expectations are documented.
- [x] Release operation expectations are documented.
- [x] Cost control expectations are documented.
- [x] CI/CD checks are documented and validated.
- [x] Repository checks can validate infrastructure requirements.

## Out Of Scope

- Cloud provider selection
- Production infrastructure provisioning
- Runtime deployment automation
- Database engine selection
- Application implementation

## Next Release

v1.0 Development Ready.
