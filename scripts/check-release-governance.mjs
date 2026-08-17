import { existsSync, readFileSync } from 'node:fs';

const required = [
  'docs/development/v1.8-scope.md',
  'docs/development/iteration-v1.8-release-decision-record.md',
  'docs/development/release-v1.8-release-decision-record.md',
  'docs/development/closure-v1.8-release-decision-record.md',
  'docs/development/iteration-v1.8-release-approval-evidence.md',
  'docs/development/release-v1.8-release-approval-evidence.md',
  'docs/development/closure-v1.8-release-approval-evidence.md',
  'docs/development/iteration-v1.8-publication-plan.md',
  'docs/development/release-v1.8-publication-plan.md',
  'docs/development/closure-v1.8-publication-plan.md',
  'docs/development/iteration-v1.8-rollback-readiness.md',
  'docs/development/release-v1.8-rollback-readiness.md',
  'docs/development/closure-v1.8-rollback-readiness.md',
  'docs/development/iteration-v1.8-post-release-audit-summary.md',
  'docs/development/release-v1.8-post-release-audit-summary.md',
  'docs/development/closure-v1.8-post-release-audit-summary.md',
  'docs/development/iteration-v1.8-release-governance-aggregate-summary.md',
  'docs/development/release-v1.8-aggregate-summary.md',
  'docs/development/closure-v1.8-aggregate-summary.md',
  'docs/development/iteration-v1.8-release-governance-final-closure.md',
  'docs/development/release-v1.8-final-closure.md',
  'docs/development/closure-v1.8-final-closure.md',
  'docs/development/pr-mainline-handoff-v1.8.md',
  '.github/PULL_REQUEST_TEMPLATE.md',
  'docs/decisions/0030-release-governance-start.md',
  'docs/development/README.md',
  'docs/decisions/README.md',
  'README.md',
  'PROJECT_MANIFEST.md',
  'docs/README.md',
  'CHANGELOG.md',
  'scripts/check-release-governance.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Release Governance requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const scope = readFileSync('docs/development/v1.8-scope.md', 'utf8');
const decision = readFileSync('docs/decisions/0030-release-governance-start.md', 'utf8');
const developmentIndex = readFileSync('docs/development/README.md', 'utf8');
const decisionsIndex = readFileSync('docs/decisions/README.md', 'utf8');
const rootReadme = readFileSync('README.md', 'utf8');
const manifest = readFileSync('PROJECT_MANIFEST.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const packageJson = readFileSync('package.json', 'utf8');
const releaseDecisionIteration = readFileSync('docs/development/iteration-v1.8-release-decision-record.md', 'utf8');
const releaseDecisionRelease = readFileSync('docs/development/release-v1.8-release-decision-record.md', 'utf8');
const releaseDecisionClosure = readFileSync('docs/development/closure-v1.8-release-decision-record.md', 'utf8');
const approvalIteration = readFileSync('docs/development/iteration-v1.8-release-approval-evidence.md', 'utf8');
const approvalRelease = readFileSync('docs/development/release-v1.8-release-approval-evidence.md', 'utf8');
const approvalClosure = readFileSync('docs/development/closure-v1.8-release-approval-evidence.md', 'utf8');
const publicationIteration = readFileSync('docs/development/iteration-v1.8-publication-plan.md', 'utf8');
const publicationRelease = readFileSync('docs/development/release-v1.8-publication-plan.md', 'utf8');
const publicationClosure = readFileSync('docs/development/closure-v1.8-publication-plan.md', 'utf8');
const rollbackIteration = readFileSync('docs/development/iteration-v1.8-rollback-readiness.md', 'utf8');
const rollbackRelease = readFileSync('docs/development/release-v1.8-rollback-readiness.md', 'utf8');
const rollbackClosure = readFileSync('docs/development/closure-v1.8-rollback-readiness.md', 'utf8');
const auditIteration = readFileSync('docs/development/iteration-v1.8-post-release-audit-summary.md', 'utf8');
const auditRelease = readFileSync('docs/development/release-v1.8-post-release-audit-summary.md', 'utf8');
const auditClosure = readFileSync('docs/development/closure-v1.8-post-release-audit-summary.md', 'utf8');
const aggregateIteration = readFileSync('docs/development/iteration-v1.8-release-governance-aggregate-summary.md', 'utf8');
const aggregateRelease = readFileSync('docs/development/release-v1.8-aggregate-summary.md', 'utf8');
const aggregateClosure = readFileSync('docs/development/closure-v1.8-aggregate-summary.md', 'utf8');
const finalIteration = readFileSync('docs/development/iteration-v1.8-release-governance-final-closure.md', 'utf8');
const finalRelease = readFileSync('docs/development/release-v1.8-final-closure.md', 'utf8');
const finalClosure = readFileSync('docs/development/closure-v1.8-final-closure.md', 'utf8');
const pullRequestHandoff = readFileSync('docs/development/pr-mainline-handoff-v1.8.md', 'utf8');
const pullRequestTemplate = readFileSync('.github/PULL_REQUEST_TEMPLATE.md', 'utf8');

const requiredSnippets = [
  ['docs/development/v1.8-scope.md', scope, '# Release Governance v1.8 Scope'],
  ['docs/development/v1.8-scope.md', scope, 'Release Decision Record'],
  ['docs/development/v1.8-scope.md', scope, 'Release Approval Evidence'],
  ['docs/development/v1.8-scope.md', scope, 'Publication Plan'],
  ['docs/development/v1.8-scope.md', scope, 'Rollback Readiness'],
  ['docs/development/v1.8-scope.md', scope, 'Post-Release Audit Summary'],
  ['docs/development/v1.8-scope.md', scope, 'Release Governance Aggregate Summary'],
  ['docs/development/v1.8-scope.md', scope, 'Release Governance Final Closure'],
  ['docs/development/v1.8-scope.md', scope, '`npm run check:release-governance`'],
  ['docs/development/iteration-v1.8-release-decision-record.md', releaseDecisionIteration, '# Release Governance v1.8 Iteration: Release Decision Record'],
  ['docs/development/iteration-v1.8-release-decision-record.md', releaseDecisionIteration, 'Release candidate identifier'],
  ['docs/development/iteration-v1.8-release-decision-record.md', releaseDecisionIteration, 'Main branch or publication actions still require explicit operator approval.'],
  ['docs/development/release-v1.8-release-decision-record.md', releaseDecisionRelease, '# Release Governance v1.8 Release Notes: Release Decision Record'],
  ['docs/development/release-v1.8-release-decision-record.md', releaseDecisionRelease, 'Release Decision Record release notes exist.'],
  ['docs/development/closure-v1.8-release-decision-record.md', releaseDecisionClosure, '# Release Governance v1.8 Closure Checklist: Release Decision Record'],
  ['docs/development/closure-v1.8-release-decision-record.md', releaseDecisionClosure, 'Release Approval Evidence.'],
  ['docs/development/iteration-v1.8-release-approval-evidence.md', approvalIteration, '# Release Governance v1.8 Iteration: Release Approval Evidence'],
  ['docs/development/iteration-v1.8-release-approval-evidence.md', approvalIteration, 'Approval owner'],
  ['docs/development/iteration-v1.8-release-approval-evidence.md', approvalIteration, 'Publication boundary acknowledgment'],
  ['docs/development/release-v1.8-release-approval-evidence.md', approvalRelease, '# Release Governance v1.8 Release Notes: Release Approval Evidence'],
  ['docs/development/release-v1.8-release-approval-evidence.md', approvalRelease, 'Release Approval Evidence release notes exist.'],
  ['docs/development/closure-v1.8-release-approval-evidence.md', approvalClosure, '# Release Governance v1.8 Closure Checklist: Release Approval Evidence'],
  ['docs/development/closure-v1.8-release-approval-evidence.md', approvalClosure, 'Publication Plan.'],
  ['docs/development/iteration-v1.8-publication-plan.md', publicationIteration, '# Release Governance v1.8 Iteration: Publication Plan'],
  ['docs/development/iteration-v1.8-publication-plan.md', publicationIteration, 'Explicit non-execution boundary'],
  ['docs/development/iteration-v1.8-publication-plan.md', publicationIteration, 'Rollback handoff requirement'],
  ['docs/development/release-v1.8-publication-plan.md', publicationRelease, '# Release Governance v1.8 Release Notes: Publication Plan'],
  ['docs/development/release-v1.8-publication-plan.md', publicationRelease, 'Publication Plan release notes exist.'],
  ['docs/development/closure-v1.8-publication-plan.md', publicationClosure, '# Release Governance v1.8 Closure Checklist: Publication Plan'],
  ['docs/development/closure-v1.8-publication-plan.md', publicationClosure, 'Rollback Readiness.'],
  ['docs/development/iteration-v1.8-rollback-readiness.md', rollbackIteration, '# Release Governance v1.8 Iteration: Rollback Readiness'],
  ['docs/development/iteration-v1.8-rollback-readiness.md', rollbackIteration, 'Rollback trigger conditions'],
  ['docs/development/iteration-v1.8-rollback-readiness.md', rollbackIteration, 'Last known stable reference'],
  ['docs/development/release-v1.8-rollback-readiness.md', rollbackRelease, '# Release Governance v1.8 Release Notes: Rollback Readiness'],
  ['docs/development/release-v1.8-rollback-readiness.md', rollbackRelease, 'Rollback Readiness release notes exist.'],
  ['docs/development/closure-v1.8-rollback-readiness.md', rollbackClosure, '# Release Governance v1.8 Closure Checklist: Rollback Readiness'],
  ['docs/development/closure-v1.8-rollback-readiness.md', rollbackClosure, 'Post-Release Audit Summary.'],
  ['docs/development/iteration-v1.8-post-release-audit-summary.md', auditIteration, '# Release Governance v1.8 Iteration: Post-Release Audit Summary'],
  ['docs/development/iteration-v1.8-post-release-audit-summary.md', auditIteration, 'Closure recommendation'],
  ['docs/development/iteration-v1.8-post-release-audit-summary.md', auditIteration, 'Explicit non-execution boundary'],
  ['docs/development/release-v1.8-post-release-audit-summary.md', auditRelease, '# Release Governance v1.8 Release Notes: Post-Release Audit Summary'],
  ['docs/development/release-v1.8-post-release-audit-summary.md', auditRelease, 'Post-Release Audit Summary release notes exist.'],
  ['docs/development/closure-v1.8-post-release-audit-summary.md', auditClosure, '# Release Governance v1.8 Closure Checklist: Post-Release Audit Summary'],
  ['docs/development/closure-v1.8-post-release-audit-summary.md', auditClosure, 'Release Governance Aggregate Summary.'],
  ['docs/development/iteration-v1.8-release-governance-aggregate-summary.md', aggregateIteration, '# Release Governance v1.8 Iteration: Release Governance Aggregate Summary'],
  ['docs/development/iteration-v1.8-release-governance-aggregate-summary.md', aggregateIteration, 'Every included package has a closure checklist.'],
  ['docs/development/release-v1.8-aggregate-summary.md', aggregateRelease, '# Release Governance v1.8 Release Notes: Aggregate Summary'],
  ['docs/development/release-v1.8-aggregate-summary.md', aggregateRelease, 'Post-Release Audit Summary'],
  ['docs/development/closure-v1.8-aggregate-summary.md', aggregateClosure, '# Release Governance v1.8 Closure Checklist: Aggregate Summary'],
  ['docs/development/closure-v1.8-aggregate-summary.md', aggregateClosure, 'Ready for closure.'],
  ['docs/development/closure-v1.8-aggregate-summary.md', aggregateClosure, 'Release Governance Final Closure.'],
  ['docs/development/iteration-v1.8-release-governance-final-closure.md', finalIteration, '# Release Governance v1.8 Iteration: Release Governance Final Closure'],
  ['docs/development/iteration-v1.8-release-governance-final-closure.md', finalIteration, 'Top-level repository status reflects Release Governance v1.8 completion.'],
  ['docs/development/release-v1.8-final-closure.md', finalRelease, '# Release Governance v1.8 Release Notes: Final Closure'],
  ['docs/development/release-v1.8-final-closure.md', finalRelease, 'Release Governance Final Closure'],
  ['docs/development/closure-v1.8-final-closure.md', finalClosure, '# Release Governance v1.8 Closure Checklist: Final Closure'],
  ['docs/development/closure-v1.8-final-closure.md', finalClosure, 'Closed.'],
  ['docs/development/closure-v1.8-final-closure.md', finalClosure, 'Development and Release Governance checks require final closure documents.'],
  ['docs/development/pr-mainline-handoff-v1.8.md', pullRequestHandoff, '# Mainline Pull Request Handoff: Development Ready through Release Governance v1.8'],
  ['docs/development/pr-mainline-handoff-v1.8.md', pullRequestHandoff, 'codex/development-ready-v1.0'],
  ['docs/development/pr-mainline-handoff-v1.8.md', pullRequestHandoff, 'b7e9661 docs: close release governance v1.8'],
  ['docs/development/pr-mainline-handoff-v1.8.md', pullRequestHandoff, 'GitHub connector access attempted to'],
  ['.github/PULL_REQUEST_TEMPLATE.md', pullRequestTemplate, 'Release Boundary'],
  ['.github/PULL_REQUEST_TEMPLATE.md', pullRequestTemplate, '`npm run check:all`'],
  ['docs/decisions/0030-release-governance-start.md', decision, '# ADR 0030: Release Governance v1.8 Start'],
  ['docs/decisions/0030-release-governance-start.md', decision, '- Status: accepted'],
  ['docs/decisions/0030-release-governance-start.md', decision, 'Mainline Release Readiness v1.7 remains closed'],
  ['docs/development/README.md', developmentIndex, '- Latest completed implementation cycle: Productization Runtime v1.9'],
  ['docs/development/README.md', developmentIndex, '- Active workstream: Context Pack Readiness Runtime v1.10'],
  ['docs/development/README.md', developmentIndex, '`v1.8-scope.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.8-release-decision-record.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.8-release-decision-record.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.8-release-decision-record.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.8-release-approval-evidence.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.8-release-approval-evidence.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.8-release-approval-evidence.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.8-publication-plan.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.8-publication-plan.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.8-publication-plan.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.8-rollback-readiness.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.8-rollback-readiness.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.8-rollback-readiness.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.8-post-release-audit-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.8-post-release-audit-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.8-post-release-audit-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.8-release-governance-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.8-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.8-aggregate-summary.md`'],
  ['docs/development/README.md', developmentIndex, '`iteration-v1.8-release-governance-final-closure.md`'],
  ['docs/development/README.md', developmentIndex, '`release-v1.8-final-closure.md`'],
  ['docs/development/README.md', developmentIndex, '`closure-v1.8-final-closure.md`'],
  ['docs/development/README.md', developmentIndex, '`pr-mainline-handoff-v1.8.md`'],
  ['docs/decisions/README.md', decisionsIndex, '`0030-release-governance-start.md`'],
  ['README.md', rootReadme, '- Latest completed implementation cycle: Productization Runtime v1.9'],
  ['README.md', rootReadme, '- Active workstream: Context Pack Readiness Runtime v1.10'],
  ['PROJECT_MANIFEST.md', manifest, '- Latest completed implementation cycle: Productization Runtime v1.9'],
  ['PROJECT_MANIFEST.md', manifest, '- Active workstream: Context Pack Readiness Runtime v1.10'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.8 Scope'],
  ['PROJECT_MANIFEST.md', manifest, '## v1.8 Completion'],
  ['docs/README.md', docsIndex, 'active Context Pack Readiness Runtime v1.10 work'],
  ['CHANGELOG.md', changelog, 'Started Release Governance v1.8 scope and decision record.'],
  ['CHANGELOG.md', changelog, 'Added Release Decision Record release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Release Approval Evidence release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Publication Plan release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Rollback Readiness release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Post-Release Audit Summary release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added Release Governance v1.8 aggregate release summary and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Closed Release Governance v1.8 with final release notes and closure checklist.'],
  ['CHANGELOG.md', changelog, 'Added mainline pull request handoff and updated the pull request template.'],
  ['package.json', packageJson, '"check:release-governance"']
];

const missingSnippets = requiredSnippets
  .filter(([, content, snippet]) => !content.includes(snippet))
  .map(([file, , snippet]) => `${file}: ${snippet}`);

if (missingSnippets.length) {
  console.error(`Missing Release Governance content: ${missingSnippets.join(', ')}`);
  process.exit(1);
}

console.log('Release Governance requirements passed.');
