import assert from 'node:assert/strict';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createBrandOSStudioShell, createStudioShellOptionsFromArgs } from '../../apps/studio/src/app.mjs';
import {
  createBrowserWorkflowStateAdapterScript,
  DEFAULT_WORKFLOW_ACTION_STATE_KEY
} from '../../apps/studio/src/browser-state-adapter.mjs';
import {
  createStudioShellOptionsFromRepositoryState,
  createWorkflowActionState,
  describeWorkflowActionState,
  readWorkflowActionState,
  resetWorkflowActionState,
  writeWorkflowActionState
} from '../../apps/studio/src/repository-state-adapter.mjs';
import {
  completeStudioWorkflowAction,
  createEmptyStudioState,
  createStudioShellOptionsFromStudioState,
  createStudioState,
  DEFAULT_STUDIO_STATE_PATH,
  STUDIO_STATE_VERSION
} from '../../apps/studio/src/studio-state-adapter.mjs';
import { renderStudioHtml } from '../../apps/studio/src/render-html.mjs';

test('Studio HTML render includes shell identity and Product Core summary', () => {
  const html = renderStudioHtml(createBrandOSStudioShell());

  assert.match(html, /<!doctype html>/);
  assert.match(html, /BrandOS Studio/);
  assert.match(html, /Workflow scenarios/);
  assert.match(html, /aria-current="page" href="index.html"/);
  assert.match(html, /href="ready.html"/);
  assert.match(html, /Brand overview/);
  assert.match(html, /Product Core objects/);
  assert.match(html, /Readiness blockers/);
  assert.match(html, /aria-label="Studio diagnostics"/);
  assert.match(html, /Studio diagnostics/);
  assert.match(html, /aria-label="Operator guidance"/);
  assert.match(html, /Operator guidance/);
  assert.match(html, /aria-label="Operator workflow"/);
  assert.match(html, /Operator workflow/);
  assert.match(html, /aria-label="Operator Run Queue"/);
  assert.match(html, /Operator Run Queue/);
  assert.match(html, /aria-label="Operator Runbook Execution"/);
  assert.match(html, /Operator Runbook Execution/);
  assert.match(html, /aria-label="Handoff Acceptance"/);
  assert.match(html, /Handoff Acceptance/);
  assert.match(html, /aria-label="Agent Handoff Context"/);
  assert.match(html, /Agent Handoff Context/);
  assert.match(html, /aria-label="Agent Prompt Plan"/);
  assert.match(html, /Agent Prompt Plan/);
  assert.match(html, /aria-label="Agent Draft Execution"/);
  assert.match(html, /Agent Draft Execution/);
  assert.match(html, /aria-label="Draft Review"/);
  assert.match(html, /Draft Review/);
  assert.match(html, /aria-label="Agent Handoff Closure"/);
  assert.match(html, /Agent Handoff Closure/);
  assert.match(html, /aria-label="Agent Handoff Runtime Summary"/);
  assert.match(html, /Agent Handoff Runtime Summary/);
  assert.match(html, /aria-label="Agent Handoff Runtime Aggregate Summary"/);
  assert.match(html, /Agent Handoff Runtime Aggregate Summary/);
  assert.match(html, /aria-label="Agent Handoff Runtime Final Closure"/);
  assert.match(html, /Agent Handoff Runtime Final Closure/);
  assert.match(html, /aria-label="Runtime Health Summary"/);
  assert.match(html, /Runtime Health Summary/);
  assert.match(html, /aria-label="Studio State Recovery"/);
  assert.match(html, /Studio State Recovery/);
  assert.match(html, /aria-label="Runtime Validation Signals"/);
  assert.match(html, /Runtime Validation Signals/);
  assert.match(html, /aria-label="Operator Recovery Guidance"/);
  assert.match(html, /Operator Recovery Guidance/);
  assert.match(html, /aria-label="Workflow Session Summary"/);
  assert.match(html, /Workflow Session Summary/);
  assert.match(html, /aria-label="Workflow Transition Plan"/);
  assert.match(html, /Workflow Transition Plan/);
  assert.match(html, /aria-label="Command Result Summary"/);
  assert.match(html, /Command Result Summary/);
  assert.match(html, /aria-label="Studio Workflow Runtime Aggregate Summary"/);
  assert.match(html, /Studio Workflow Runtime Aggregate Summary/);
  assert.match(html, /aria-label="Studio Workflow Runtime Final Closure"/);
  assert.match(html, /Studio Workflow Runtime Final Closure/);
  assert.match(html, /aria-label="Operator Workflow Map"/);
  assert.match(html, /Operator Workflow Map/);
  assert.match(html, /aria-label="Operator Task Selection"/);
  assert.match(html, /Operator Task Selection/);
  assert.match(html, /aria-label="Operator Step Detail"/);
  assert.match(html, /Operator Step Detail/);
  assert.match(html, /aria-label="Operator Handoff Readiness"/);
  assert.match(html, /Operator Handoff Readiness/);
  assert.match(html, /aria-label="Operator Workflow Design Aggregate Summary"/);
  assert.match(html, /Operator Workflow Design Aggregate Summary/);
  assert.match(html, /aria-label="Operator Workflow Design Final Closure"/);
  assert.match(html, /Operator Workflow Design Final Closure/);
  assert.match(html, /aria-label="Repository Branch Status"/);
  assert.match(html, /Repository Branch Status/);
  assert.match(html, /aria-label="Context Pack usage flow"/);
  assert.match(html, /Context Pack usage flow/);
  assert.match(html, /aria-label="Review resolution workflow"/);
  assert.match(html, /Review resolution workflow/);
  assert.match(html, /aria-label="Studio workflow audit trail"/);
  assert.match(html, /Studio workflow audit trail/);
  assert.match(html, /aria-label="Operator handoff"/);
  assert.match(html, /Operator handoff/);
  assert.match(html, /aria-label="Studio state inspection"/);
  assert.match(html, /Studio state inspection/);
  assert.match(html, /aria-label="Multi-action workflow state"/);
  assert.match(html, /Multi-action workflow state/);
});

test('Studio HTML render includes blocking Context Pack readiness reason', () => {
  const html = renderStudioHtml(createBrandOSStudioShell());

  assert.match(html, /Context readiness/);
  assert.match(html, /Context Pack workflow/);
  assert.match(html, /Current step: resolve-review/);
  assert.match(html, /Action status: pending/);
  assert.match(html, /action-status-badge action-status-pending/);
  assert.match(html, /workflow-action-row/);
  assert.match(html, /Owner: operator@example.local - Target: review_example_001/);
  assert.match(html, /Saved action: <span data-local-completed-action>none<\/span>/);
  assert.match(html, /aria-label="State sources"/);
  assert.match(html, /state-source-row/);
  assert.match(html, /state-source-badge state-source-example/);
  assert.match(html, /Workflow state source: <span class="state-source-badge state-source-example">example<\/span>/);
  assert.match(html, /Browser state key: brandos.workflow.completedActionId/);
  assert.match(html, /Repository state file: .tmp\/studio-state.json/);
  assert.match(html, /Repository state status: not-loaded/);
  assert.match(html, /Repository state version: none/);
  assert.match(html, /Completed action history: 0/);
  assert.match(html, /State source: example/);
  assert.match(html, /State status: not-loaded/);
  assert.match(html, /State file: .tmp\/studio-state.json/);
  assert.match(html, /State version: none/);
  assert.match(html, /Latest completed action: none/);
  assert.match(html, /Latest completed at: none/);
  assert.match(html, /Completed action count: 0/);
  assert.match(html, /Completed action ids: none/);
  assert.match(html, /data-clear-workflow-state/);
  assert.match(html, /brandos.workflow.completedActionId/);
  assert.match(html, /action="ready.html"/);
  assert.match(html, /name="actionId" value="workflow_action_example_001"/);
  assert.match(html, /Complete action/);
  assert.match(html, /blocked/);
  assert.match(html, /Review is blocking release: review_example_001/);
  assert.match(html, /Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Package count: 3/);
  assert.match(html, /Product object count: 8/);
  assert.match(html, /Readiness blockers: 1/);
  assert.match(html, /Diagnostic state source: example/);
  assert.match(html, /Diagnostic state status: not-loaded/);
  assert.match(html, /Diagnostic result: attention/);
  assert.match(html, /Diagnostic check Packages loaded: pass - 3 packages available/);
  assert.match(html, /Diagnostic check Product objects loaded: pass - 8 objects available/);
  assert.match(html, /Diagnostic check Context readiness: attention - 1 blockers/);
  assert.match(html, /Diagnostic check State source available: pass - example/);
  assert.match(html, /Diagnostic check State status available: pass - not-loaded/);
  assert.match(html, /Guidance status: attention/);
  assert.match(html, /Recommended action: Resolve readiness blocker/);
  assert.match(html, /Guidance reason: Review is blocking release: review_example_001/);
  assert.match(html, /Guidance command: Complete pending Workflow Action/);
  assert.match(html, /Operator workflow status: attention/);
  assert.match(html, /Operator active stage: Resolve action/);
  assert.match(html, /Operator next action: Complete workflow_action_example_001/);
  assert.match(html, /Operator stage status: complete/);
  assert.match(html, /Operator stage detail: Context Pack readiness was evaluated./);
  assert.match(html, /Operator stage status: active/);
  assert.match(html, /Operator stage detail: Review is blocking release: review_example_001/);
  assert.match(html, /Operator stage status: blocked/);
  assert.match(html, /Operator stage detail: Context Pack use waits for the pending Workflow Action./);
  assert.match(html, /aria-label="Operator execution controls"/);
  assert.match(html, /Operator control label: Complete Workflow Action/);
  assert.match(html, /Operator control status: enabled/);
  assert.match(html, /Operator control command: Complete workflow_action_example_001/);
  assert.match(html, /Operator control result: Preview ready scenario/);
  assert.match(html, /class="operator-control-action" method="get" action="ready.html"/);
  assert.match(html, /<button type="submit">Complete Workflow Action<\/button>/);
  assert.match(html, /Operator run queue count: 1/);
  assert.match(html, /Operator run blocked count: 1/);
  assert.match(html, /Operator run ready count: 0/);
  assert.match(html, /Operator run active id: operator_run_example_001/);
  assert.match(html, /Operator run status: blocked/);
  assert.match(html, /Operator run priority: normal/);
  assert.match(html, /Operator run owner: operator@example.local/);
  assert.match(html, /Operator run workflow: generate-context-pack/);
  assert.match(html, /Operator run current action: workflow_action_example_001/);
  assert.match(html, /Operator run current action status: pending/);
  assert.match(html, /Operator run next action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Operator run handoff: operator_handoff_example_001/);
  assert.match(html, /Operator run audit events: 1/);
  assert.match(html, /Operator runbook status: blocked/);
  assert.match(html, /Operator runbook run id: operator_run_example_001/);
  assert.match(html, /Operator runbook current action: workflow_action_example_001/);
  assert.match(html, /Operator runbook handoff: operator_handoff_example_001/);
  assert.match(html, /Operator runbook step status: complete/);
  assert.match(html, /Operator runbook step detail: Resolve Context Pack readiness and prepare handoff./);
  assert.match(html, /Operator runbook step status: active/);
  assert.match(html, /Operator runbook step detail: workflow_action_example_001 is pending/);
  assert.match(html, /Operator runbook step status: blocked/);
  assert.match(html, /Operator runbook step detail: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Operator runbook step detail: Handoff operator_handoff_example_001 waits for 1 audit events/);
  assert.match(html, /Operator runbook step detail: Run status is blocked/);
  assert.match(html, /Handoff acceptance status: blocked/);
  assert.match(html, /Handoff acceptance decision: Resolve runbook blockers before acceptance/);
  assert.match(html, /Handoff acceptance run id: operator_run_example_001/);
  assert.match(html, /Handoff acceptance next workflow: Operator Runbook Execution/);
  assert.match(html, /Handoff acceptance evidence: Current action workflow_action_example_001 is pending/);
  assert.match(html, /Handoff acceptance evidence: Runbook status is blocked/);
  assert.match(html, /Handoff acceptance evidence: Handoff operator_handoff_example_001 is linked/);
  assert.match(html, /Handoff acceptance blocker: Resolve current action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Agent handoff context status: blocked/);
  assert.match(html, /Agent handoff ready: false/);
  assert.match(html, /Agent handoff operator run: operator_run_example_001/);
  assert.match(html, /Agent handoff context pack: context_pack_example_001/);
  assert.match(html, /Agent handoff task type: brand-writing/);
  assert.match(html, /Agent handoff next workflow: Operator Runbook Execution/);
  assert.match(html, /Agent handoff next agent: Operator/);
  assert.match(html, /Agent handoff source: Handoff Acceptance/);
  assert.match(html, /Agent handoff evidence: Current action workflow_action_example_001 is pending/);
  assert.match(html, /Agent handoff blocker: Resolve current action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Agent handoff instruction: Wait for accepted handoff before agent work./);
  assert.match(html, /Agent prompt plan status: blocked/);
  assert.match(html, /Agent prompt allowed: false/);
  assert.match(html, /Agent prompt agent: Operator/);
  assert.match(html, /Agent prompt context pack: context_pack_example_001/);
  assert.match(html, /Agent prompt task type: brand-writing/);
  assert.match(html, /Agent prompt objective: Resolve accepted handoff before prompt planning./);
  assert.match(html, /Agent prompt source policy: Prompt plan is blocked; do not use chat history as fallback context./);
  assert.match(html, /Agent prompt next workflow: Operator Runbook Execution/);
  assert.match(html, /Agent prompt section: Blocked state/);
  assert.match(html, /Agent prompt guardrail: Do not draft./);
  assert.match(html, /Agent prompt blocker: Resolve current action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Agent draft execution status: blocked/);
  assert.match(html, /Agent draft allowed: false/);
  assert.match(html, /Agent draft agent: Operator/);
  assert.match(html, /Agent draft context pack: context_pack_example_001/);
  assert.match(html, /Agent draft task type: brand-writing/);
  assert.match(html, /Agent draft title: Draft blocked/);
  assert.match(html, /Agent draft body: none/);
  assert.match(html, /Agent draft next workflow: Operator Runbook Execution/);
  assert.match(html, /Agent draft quality check: Accepted handoff present - blocked/);
  assert.match(html, /Agent draft blocker: Resolve current action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Draft review status: blocked/);
  assert.match(html, /Draft review approved: false/);
  assert.match(html, /Draft review context pack: context_pack_example_001/);
  assert.match(html, /Draft review title: Draft blocked/);
  assert.match(html, /Draft review decision: Block draft until execution is ready/);
  assert.match(html, /Draft review summary: Draft review waits for allowed draft execution./);
  assert.match(html, /Draft review next workflow: Operator Runbook Execution/);
  assert.match(html, /Draft review evidence: Draft body is not available./);
  assert.match(html, /Draft review check: Draft body present - blocked/);
  assert.match(html, /Draft review blocker: Resolve current action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Agent handoff closure status: blocked/);
  assert.match(html, /Agent handoff closed: false/);
  assert.match(html, /Agent handoff closure context pack: context_pack_example_001/);
  assert.match(html, /Agent handoff closure decision: Keep agent handoff open/);
  assert.match(html, /Agent handoff closure summary: Agent handoff closure waits for approved Draft Review./);
  assert.match(html, /Agent handoff closure next workflow: Operator Runbook Execution/);
  assert.match(html, /Agent handoff closure evidence: Draft body is not available./);
  assert.match(html, /Agent handoff closure check: Draft review approved - blocked/);
  assert.match(html, /Agent handoff closure blocker: Resolve current action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Agent handoff runtime summary status: blocked/);
  assert.match(html, /Agent handoff runtime complete: false/);
  assert.match(html, /Agent handoff runtime stages: 0\/5/);
  assert.match(html, /Agent handoff runtime blocked stages: 5/);
  assert.match(html, /Agent handoff runtime decision: Agent handoff runtime blocked/);
  assert.match(html, /Agent handoff runtime summary: Agent Handoff Runtime waits for upstream handoff readiness./);
  assert.match(html, /Agent handoff runtime next workflow: Operator Runbook Execution/);
  assert.match(html, /Agent handoff runtime stage: Agent Handoff Context - blocked/);
  assert.match(html, /Agent handoff runtime evidence: Draft body is not available./);
  assert.match(html, /Agent handoff runtime blocker: Resolve current action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Agent handoff runtime aggregate status: blocked/);
  assert.match(html, /Agent handoff runtime aggregate complete: false/);
  assert.match(html, /Agent handoff runtime aggregate runtimes: 0\/1/);
  assert.match(html, /Agent handoff runtime aggregate blocked runtimes: 1/);
  assert.match(html, /Agent handoff runtime aggregate stages: 0\/5/);
  assert.match(html, /Agent handoff runtime aggregate decision: Keep Agent Handoff Runtime v1.2 aggregate open/);
  assert.match(html, /Agent handoff runtime aggregate summary: Agent Handoff Runtime v1.2 aggregate waits for runtime summary completion./);
  assert.match(html, /Agent handoff runtime aggregate next workflow: Operator Runbook Execution/);
  assert.match(html, /Agent handoff runtime aggregate item: Agent Handoff Runtime Summary - blocked - 0\/5/);
  assert.match(html, /Agent handoff runtime aggregate evidence: Draft body is not available./);
  assert.match(html, /Agent handoff runtime aggregate blocker: Resolve current action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Agent handoff runtime final closure status: blocked/);
  assert.match(html, /Agent handoff runtime final closure closed: false/);
  assert.match(html, /Agent handoff runtime final closure decision: Keep Agent Handoff Runtime v1.2 open/);
  assert.match(html, /Agent handoff runtime final closure summary: Agent Handoff Runtime v1.2 final closure waits for aggregate completion./);
  assert.match(html, /Agent handoff runtime final closure next workflow: Operator Runbook Execution/);
  assert.match(html, /Agent handoff runtime final closure evidence: Draft body is not available./);
  assert.match(html, /Agent handoff runtime final closure check: Aggregate summary complete - blocked/);
  assert.match(html, /Agent handoff runtime final closure blocker: Resolve current action: Resolve review feedback for context_pack_example_001/);
  assert.match(html, /Context Pack usage status: draft/);
  assert.match(html, /Context Pack task type: brand-writing/);
  assert.match(html, /Context Pack audience: AI agents drafting product and brand copy/);
  assert.match(html, /Context Pack owner: operator@example.local/);
  assert.match(html, /Context Pack expires at: 2026-10-17/);
  assert.match(html, /Context Pack sources: 1 claims, 1 decisions/);
  assert.match(html, /Context Pack sections: positioning, audience, voice, constraints/);
  assert.match(html, /Context Pack exclusions: pricing, legal promises, unapproved customer claims/);
  assert.match(html, /Context Pack usage step: Load approved context/);
  assert.match(html, /Context Pack usage detail: Use Context Pack context_pack_example_001 as the source bundle./);
  assert.match(html, /Context Pack usage step: Apply task boundary/);
  assert.match(html, /Context Pack usage detail: Task type: brand-writing/);
  assert.match(html, /Context Pack usage step: Respect exclusions/);
  assert.match(html, /Context Pack usage step: Follow agent instructions/);
  assert.match(html, /Review resolution status: needs-resolution/);
  assert.match(html, /Review resolution target: context-pack context_pack_example_001/);
  assert.match(html, /Review resolution reviewer: brand-owner@example.local/);
  assert.match(html, /Review resolution action: workflow_action_example_001/);
  assert.match(html, /Review resolution action status: pending/);
  assert.match(html, /Review resolution owner: operator@example.local/);
  assert.match(html, /Review resolution recommendation: Resolve review feedback/);
  assert.match(html, /Review resolution result: Review blocks Context Pack readiness/);
  assert.match(html, /Review resolution step: Confirm review target - complete/);
  assert.match(html, /Review resolution step: Complete resolution action - active/);
  assert.match(html, /Review resolution step: Recheck readiness - blocked/);
  assert.match(html, /Audit trail status: open/);
  assert.match(html, /Audit trail source: example/);
  assert.match(html, /Audit trail latest event: readiness-blocker-detected/);
  assert.match(html, /Audit event status: attention/);
  assert.match(html, /Audit event detail: 1 blockers/);
  assert.match(html, /Audit event status: needs-resolution/);
  assert.match(html, /Audit event detail: Review blocks Context Pack readiness/);
  assert.match(html, /Audit event status: not-loaded/);
  assert.match(html, /Audit event detail: Source example/);
  assert.match(html, /Audit event status: empty/);
  assert.match(html, /Audit event detail: 0 completed actions/);
  assert.match(html, /Audit event detail: Complete workflow_action_example_001/);
  assert.match(html, /Operator handoff status: needs-operator/);
  assert.match(html, /Operator handoff objective: Hand off readiness blocker resolution to an operator./);
  assert.match(html, /Operator handoff sources loaded: Product Core example state, Context Pack readiness, Review resolution workflow, Studio workflow audit trail/);
  assert.match(html, /Operator handoff changes made: No repository state change in blocked preview./);
  assert.match(html, /Operator handoff assumptions: Review feedback must be resolved before Context Pack use./);
  assert.match(html, /Operator handoff missing context: Completed Workflow Action evidence is not present yet./);
  assert.match(html, /Operator handoff verification performed: Studio audit trail status: open/);
  assert.match(html, /Operator handoff recommended next workflow: Review Resolution Workflow/);
  assert.match(html, /Operator handoff next agent: Operator/);
  assert.match(html, /Runtime health status: attention/);
  assert.match(html, /Runtime health healthy: false/);
  assert.match(html, /Runtime health state source: example/);
  assert.match(html, /Runtime health completed actions: 0/);
  assert.match(html, /Runtime health readiness: blocked/);
  assert.match(html, /Runtime health closure: blocked/);
  assert.match(html, /Runtime health decision: Runtime needs operator attention before repeated local use/);
  assert.match(html, /Runtime health summary: Runtime health waits for ready context, closed runtime evidence, or durable workflow action state./);
  assert.match(html, /Runtime health next workflow: Review Resolution Workflow/);
  assert.match(html, /Runtime health signal: Context readiness - attention - 1 blockers/);
  assert.match(html, /Runtime health recovery: Resolve readiness blockers before relying on runtime output./);
  assert.match(html, /Runtime health blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Studio state recovery status: needs-recovery/);
  assert.match(html, /Studio state recovery ready: false/);
  assert.match(html, /Studio state recovery source: example/);
  assert.match(html, /Studio state recovery completed actions: 0/);
  assert.match(html, /Studio state recovery decision: Recover Studio state before repeated local use/);
  assert.match(html, /Studio state recovery summary: Studio state recovery must resolve runtime health attention signals./);
  assert.match(html, /Studio state recovery next workflow: Review Resolution Workflow/);
  assert.match(html, /Studio state recovery step: Recovery action 1 - active - Resolve readiness blockers before relying on runtime output./);
  assert.match(html, /Studio state recovery evidence: Context readiness: attention - 1 blockers/);
  assert.match(html, /Studio state recovery blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Runtime validation status: blocked/);
  assert.match(html, /Runtime validation ready: false/);
  assert.match(html, /Runtime validation source: example/);
  assert.match(html, /Runtime validation completed actions: 0/);
  assert.match(html, /Runtime validation decision: Runtime validation waits for Studio state recovery/);
  assert.match(html, /Runtime validation summary: Runtime validation signals are blocked until recovery evidence is ready./);
  assert.match(html, /Runtime validation next workflow: Review Resolution Workflow/);
  assert.match(html, /Runtime validation signal: Studio state recovery - attention - needs-recovery/);
  assert.match(html, /Runtime validation command: npm run check:runtime-reliability/);
  assert.match(html, /Runtime validation evidence: Context readiness: attention - 1 blockers/);
  assert.match(html, /Runtime validation blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Operator recovery status: action-required/);
  assert.match(html, /Operator recovery ready: false/);
  assert.match(html, /Operator recovery source: example/);
  assert.match(html, /Operator recovery completed actions: 0/);
  assert.match(html, /Operator recovery decision: Follow recovery guidance before closure/);
  assert.match(html, /Operator recovery summary: Operator recovery guidance explains the manual steps needed before runtime closure./);
  assert.match(html, /Operator recovery next workflow: Review Resolution Workflow/);
  assert.match(html, /Operator recovery step: Review validation blockers - active - Review is blocking release: review_example_001/);
  assert.match(html, /Operator recovery signal: Studio state recovery - attention - needs-recovery/);
  assert.match(html, /Operator recovery command: npm run check:runtime-reliability/);
  assert.match(html, /Operator recovery evidence: Context readiness: attention - 1 blockers/);
  assert.match(html, /Operator recovery blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Workflow session status: blocked/);
  assert.match(html, /Workflow session ready: false/);
  assert.match(html, /Workflow session workflow: Context Pack workflow/);
  assert.match(html, /Workflow session scenario: blocked/);
  assert.match(html, /Workflow session current step: resolve-review/);
  assert.match(html, /Workflow session action status: pending/);
  assert.match(html, /Workflow session source: example/);
  assert.match(html, /Workflow session completed actions: 0/);
  assert.match(html, /Workflow session decision: Resolve workflow session blockers/);
  assert.match(html, /Workflow session summary: Workflow session is blocked until readiness and recovery guidance are resolved./);
  assert.match(html, /Workflow session next route: index.html/);
  assert.match(html, /Workflow session next workflow: Review Resolution Workflow/);
  assert.match(html, /Workflow session signal: Context readiness - blocked - 1 blockers/);
  assert.match(html, /Workflow session evidence: Scenario: blocked/);
  assert.match(html, /Workflow session blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Workflow transition status: blocked/);
  assert.match(html, /Workflow transition ready: false/);
  assert.match(html, /Workflow transition workflow: Context Pack workflow/);
  assert.match(html, /Workflow transition scenario: blocked/);
  assert.match(html, /Workflow transition current step: resolve-review/);
  assert.match(html, /Workflow transition from route: index.html/);
  assert.match(html, /Workflow transition to route: index.html/);
  assert.match(html, /Workflow transition source: example/);
  assert.match(html, /Workflow transition completed actions: 0/);
  assert.match(html, /Workflow transition decision: Stay on blocked workflow route/);
  assert.match(html, /Workflow transition summary: Workflow transition waits for session blockers to clear./);
  assert.match(html, /Workflow transition next workflow: Review Resolution Workflow/);
  assert.match(html, /Workflow transition step: Hold blocked route - active - Stay on index.html until blockers are resolved./);
  assert.match(html, /Workflow transition signal: Context readiness - blocked - 1 blockers/);
  assert.match(html, /Workflow transition evidence: Scenario: blocked/);
  assert.match(html, /Workflow transition blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Command result status: blocked/);
  assert.match(html, /Command result complete: false/);
  assert.match(html, /Command result scenario: blocked/);
  assert.match(html, /Command result from route: index.html/);
  assert.match(html, /Command result to route: index.html/);
  assert.match(html, /Command result source: example/);
  assert.match(html, /Command result completed actions: 0/);
  assert.match(html, /Command result decision: Command result waits for transition readiness/);
  assert.match(html, /Command result summary: Command result remains blocked until the workflow transition can proceed./);
  assert.match(html, /Command result next workflow: Review Resolution Workflow/);
  assert.match(html, /Command result item: Workflow route command - blocked - Route remains index.html./);
  assert.match(html, /Command result signal: Context readiness - blocked - 1 blockers/);
  assert.match(html, /Command result evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Command result blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Studio workflow runtime aggregate status: blocked/);
  assert.match(html, /Studio workflow runtime aggregate ready: false/);
  assert.match(html, /Studio workflow runtime aggregate scenario: blocked/);
  assert.match(html, /Studio workflow runtime aggregate source: example/);
  assert.match(html, /Studio workflow runtime aggregate completed actions: 0/);
  assert.match(html, /Studio workflow runtime aggregate commands: 0\/1/);
  assert.match(html, /Studio workflow runtime aggregate blocked commands: 1/);
  assert.match(html, /Studio workflow runtime aggregate decision: Keep Studio workflow runtime aggregate blocked/);
  assert.match(html, /Studio workflow runtime aggregate summary: Studio Workflow Runtime v1.4 aggregate waits for command result completion./);
  assert.match(html, /Studio workflow runtime aggregate next workflow: Review Resolution Workflow/);
  assert.match(html, /Studio workflow runtime aggregate item: Command Result Summary - blocked - blocked - index.html -&gt; index.html - 3 results/);
  assert.match(html, /Studio workflow runtime aggregate evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Studio workflow runtime aggregate blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Studio workflow runtime final closure status: blocked/);
  assert.match(html, /Studio workflow runtime final closure closed: false/);
  assert.match(html, /Studio workflow runtime final closure scenario: blocked/);
  assert.match(html, /Studio workflow runtime final closure source: example/);
  assert.match(html, /Studio workflow runtime final closure completed actions: 0/);
  assert.match(html, /Studio workflow runtime final closure decision: Keep Studio Workflow Runtime v1.4 open/);
  assert.match(html, /Studio workflow runtime final closure summary: Studio Workflow Runtime v1.4 final closure waits for aggregate readiness./);
  assert.match(html, /Studio workflow runtime final closure next workflow: Review Resolution Workflow/);
  assert.match(html, /Studio workflow runtime final closure evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Studio workflow runtime final closure check: Aggregate summary ready - blocked/);
  assert.match(html, /Studio workflow runtime final closure blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Operator workflow map status: blocked/);
  assert.match(html, /Operator workflow map ready: false/);
  assert.match(html, /Operator workflow map scenario: blocked/);
  assert.match(html, /Operator workflow map source: example/);
  assert.match(html, /Operator workflow map completed actions: 0/);
  assert.match(html, /Operator workflow map active path: Review Resolution Workflow/);
  assert.match(html, /Operator workflow map paths: 1\/4/);
  assert.match(html, /Operator workflow map blocked paths: 1/);
  assert.match(html, /Operator workflow map decision: Resolve blockers before operator workflow selection/);
  assert.match(html, /Operator workflow map summary: Operator workflow map waits for runtime closure and session readiness./);
  assert.match(html, /Operator workflow map next workflow: Review Resolution Workflow/);
  assert.match(html, /Operator workflow map path: Review active run - active - operator_run_example_001 is blocked./);
  assert.match(html, /Operator workflow map path: Resolve workflow blocker - blocked - Review is blocking release: review_example_001/);
  assert.match(html, /Operator workflow map evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Operator workflow map blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Operator task selection status: blocked/);
  assert.match(html, /Operator task selection ready: false/);
  assert.match(html, /Operator task selection scenario: blocked/);
  assert.match(html, /Operator task selection source: example/);
  assert.match(html, /Operator task selection completed actions: 0/);
  assert.match(html, /Operator task selection selected task: Resolve workflow blockers/);
  assert.match(html, /Operator task selection selected workflow: Review Resolution Workflow/);
  assert.match(html, /Operator task selection tasks: 2\/3/);
  assert.match(html, /Operator task selection blocked tasks: 1/);
  assert.match(html, /Operator task selection decision: Select blocker resolution task/);
  assert.match(html, /Operator task selection summary: Operator Task Selection must resolve workflow blockers before task execution./);
  assert.match(html, /Operator task selection next workflow: Review Resolution Workflow/);
  assert.match(html, /Operator task selection option: Resolve workflow blockers - Review Resolution Workflow - selected - Resolve blockers before operator workflow selection/);
  assert.match(html, /Operator task selection option: Select operator task - Operator Task Selection - blocked - Task selection waits for a ready operator workflow map./);
  assert.match(html, /Operator task selection evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Operator task selection blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Operator step detail status: blocked/);
  assert.match(html, /Operator step detail ready: false/);
  assert.match(html, /Operator step detail scenario: blocked/);
  assert.match(html, /Operator step detail source: example/);
  assert.match(html, /Operator step detail completed actions: 0/);
  assert.match(html, /Operator step detail selected task: Resolve workflow blockers/);
  assert.match(html, /Operator step detail selected workflow: Review Resolution Workflow/);
  assert.match(html, /Operator step detail active step: Inspect blocker detail/);
  assert.match(html, /Operator step detail owner: operator@example.local/);
  assert.match(html, /Operator step detail command: Resolve workflow blockers/);
  assert.match(html, /Operator step detail outcome: Operator step waits for blocker resolution./);
  assert.match(html, /Operator step detail steps: 2\/3/);
  assert.match(html, /Operator step detail blocked steps: 1/);
  assert.match(html, /Operator step detail decision: Inspect blocker resolution step/);
  assert.match(html, /Operator step detail summary: Operator Step Detail keeps the blocker resolution task visible before execution./);
  assert.match(html, /Operator step detail next workflow: Review Resolution Workflow/);
  assert.match(html, /Operator step detail step: Inspect blocker detail - active - Select blocker resolution task/);
  assert.match(html, /Operator step detail step: Resolve selected blocker - blocked - Review is blocking release: review_example_001/);
  assert.match(html, /Operator step detail evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Operator step detail blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Operator handoff readiness status: blocked/);
  assert.match(html, /Operator handoff readiness ready: false/);
  assert.match(html, /Operator handoff readiness scenario: blocked/);
  assert.match(html, /Operator handoff readiness source: example/);
  assert.match(html, /Operator handoff readiness completed actions: 0/);
  assert.match(html, /Operator handoff readiness selected task: Resolve workflow blockers/);
  assert.match(html, /Operator handoff readiness selected workflow: Review Resolution Workflow/);
  assert.match(html, /Operator handoff readiness active step: Inspect blocker detail/);
  assert.match(html, /Operator handoff readiness target: Operator/);
  assert.match(html, /Operator handoff readiness mode: operator-resolution/);
  assert.match(html, /Operator handoff readiness command: Resolve blockers before handoff/);
  assert.match(html, /Operator handoff readiness outcome: Operator handoff readiness waits for blocker resolution./);
  assert.match(html, /Operator handoff readiness checks: 1\/4/);
  assert.match(html, /Operator handoff readiness blocked checks: 3/);
  assert.match(html, /Operator handoff readiness decision: Keep handoff readiness blocked/);
  assert.match(html, /Operator handoff readiness summary: Operator Handoff Readiness keeps local work with the operator until blockers clear./);
  assert.match(html, /Operator handoff readiness next workflow: Review Resolution Workflow/);
  assert.match(html, /Operator handoff readiness check: Step detail ready - blocked - Inspect blocker resolution step/);
  assert.match(html, /Operator handoff readiness check: Blockers clear - blocked - Review is blocking release: review_example_001/);
  assert.match(html, /Operator handoff readiness evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Operator handoff readiness blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Operator workflow design aggregate status: blocked/);
  assert.match(html, /Operator workflow design aggregate ready: false/);
  assert.match(html, /Operator workflow design aggregate scenario: blocked/);
  assert.match(html, /Operator workflow design aggregate source: example/);
  assert.match(html, /Operator workflow design aggregate completed actions: 0/);
  assert.match(html, /Operator workflow design aggregate selected task: Resolve workflow blockers/);
  assert.match(html, /Operator workflow design aggregate selected workflow: Review Resolution Workflow/);
  assert.match(html, /Operator workflow design aggregate handoff target: Operator/);
  assert.match(html, /Operator workflow design aggregate workflows: 0\/4/);
  assert.match(html, /Operator workflow design aggregate blocked workflows: 4/);
  assert.match(html, /Operator workflow design aggregate decision: Keep operator workflow design aggregate blocked/);
  assert.match(html, /Operator workflow design aggregate summary: Operator Workflow Design v1.5 aggregate waits for operator workflow readiness./);
  assert.match(html, /Operator workflow design aggregate next workflow: Review Resolution Workflow/);
  assert.match(html, /Operator workflow design aggregate item: Operator Handoff Readiness - blocked - false - Keep handoff readiness blocked/);
  assert.match(html, /Operator workflow design aggregate evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Operator workflow design aggregate blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Operator workflow design final closure status: blocked/);
  assert.match(html, /Operator workflow design final closure closed: false/);
  assert.match(html, /Operator workflow design final closure scenario: blocked/);
  assert.match(html, /Operator workflow design final closure source: example/);
  assert.match(html, /Operator workflow design final closure completed actions: 0/);
  assert.match(html, /Operator workflow design final closure selected task: Resolve workflow blockers/);
  assert.match(html, /Operator workflow design final closure selected workflow: Review Resolution Workflow/);
  assert.match(html, /Operator workflow design final closure handoff target: Operator/);
  assert.match(html, /Operator workflow design final closure decision: Keep Operator Workflow Design v1.5 open/);
  assert.match(html, /Operator workflow design final closure summary: Operator Workflow Design v1.5 final closure waits for aggregate readiness./);
  assert.match(html, /Operator workflow design final closure next workflow: Review Resolution Workflow/);
  assert.match(html, /Operator workflow design final closure evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Operator workflow design final closure check: Aggregate summary ready - blocked/);
  assert.match(html, /Operator workflow design final closure blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Repository branch status: blocked/);
  assert.match(html, /Repository branch ready: false/);
  assert.match(html, /Repository branch scenario: blocked/);
  assert.match(html, /Repository branch source: example/);
  assert.match(html, /Repository branch completed actions: 0/);
  assert.match(html, /Repository branch local: codex\/development-ready-v1.0/);
  assert.match(html, /Repository branch remote: origin\/codex\/development-ready-v1.0/);
  assert.match(html, /Repository branch main: main/);
  assert.match(html, /Repository branch sync: waiting-for-cycle-closure/);
  assert.match(html, /Repository branch working tree: blocked-preview/);
  assert.match(html, /Repository branch branches: 1\/4/);
  assert.match(html, /Repository branch blocked branches: 3/);
  assert.match(html, /Repository branch decision: Keep repository branch status blocked/);
  assert.match(html, /Repository branch summary: Repository Branch Status waits for Operator Workflow Design v1.5 closure before collaboration./);
  assert.match(html, /Repository branch next workflow: Review Resolution Workflow/);
  assert.match(html, /Repository branch item: Remote branch - blocked - origin\/codex\/development-ready-v1.0/);
  assert.match(html, /Repository branch evidence: Transition route: index.html -&gt; index.html/);
  assert.match(html, /Repository branch blocker: Workflow Action state is not durable for repeated local use./);
  assert.match(html, /Multi-action state status: empty/);
  assert.match(html, /Multi-action state source: example/);
  assert.match(html, /Multi-action completed count: 0/);
  assert.match(html, /Multi-action latest completed action: none/);
  assert.match(html, /Multi-action completed ids: none/);
  assert.match(html, /Multi-action readiness impact: readiness blocked/);
});

test('Studio HTML render includes ready Context Pack workflow state', () => {
  const html = renderStudioHtml(createBrandOSStudioShell({ completedWorkflowActionId: 'workflow_action_example_001' }), {
    activeScenario: 'ready'
  });

  assert.match(html, /Context readiness/);
  assert.match(html, /aria-current="page" href="ready.html"/);
  assert.match(html, /href="index.html"/);
  assert.match(html, /ready/);
  assert.match(html, /Current step: ready-for-use/);
  assert.match(html, /Action status: ready/);
  assert.match(html, /Completed action: workflow_action_example_001/);
  assert.match(html, /Workflow state source: <span class="state-source-badge state-source-command">command<\/span>/);
  assert.match(html, /Saved action: <span data-local-completed-action>workflow_action_example_001<\/span>/);
  assert.match(html, /State source: command/);
  assert.match(html, /Latest completed action: workflow_action_example_001/);
  assert.match(html, /Latest completed at: 2026-07-18/);
  assert.match(html, /Completed action count: 1/);
  assert.match(html, /Completed action ids: workflow_action_example_001/);
  assert.match(html, /action-status-badge action-status-ready/);
  assert.match(html, /Owner: operator@example.local - Target: context_pack_example_001/);
  assert.match(html, /Use context pack/);
  assert.match(html, /Use context pack context_pack_example_001/);
  assert.match(html, /Readiness blockers: 0/);
  assert.match(html, /Diagnostic state source: command/);
  assert.match(html, /Diagnostic result: ready/);
  assert.match(html, /Diagnostic check Context readiness: pass - 0 blockers/);
  assert.match(html, /Diagnostic check State source available: pass - command/);
  assert.match(html, /Guidance status: ready/);
  assert.match(html, /Recommended action: Use Context Pack/);
  assert.match(html, /Guidance reason: Context Pack has no readiness blockers./);
  assert.match(html, /Guidance command: Open ready scenario/);
  assert.match(html, /Operator workflow status: ready/);
  assert.match(html, /Operator active stage: Use Context Pack/);
  assert.match(html, /Operator next action: Use context pack context_pack_example_001/);
  assert.match(html, /Operator stage detail: Context Pack readiness has no blockers./);
  assert.match(html, /Operator stage detail: Required Workflow Action is complete./);
  assert.match(html, /Operator stage detail: Context Pack is ready for operator use./);
  assert.match(html, /aria-label="Operator execution controls"/);
  assert.match(html, /Operator control label: Use Context Pack/);
  assert.match(html, /Operator control status: enabled/);
  assert.match(html, /Operator control command: Open Context Pack workflow/);
  assert.match(html, /Operator control result: Continue with ready Context Pack/);
  assert.match(html, /<a href="ready.html">Use Context Pack<\/a>/);
  assert.match(html, /Context Pack usage status: draft/);
  assert.match(html, /Context Pack task type: brand-writing/);
  assert.match(html, /Context Pack usage step: Load approved context/);
  assert.match(html, /Context Pack usage detail: 3 instructions available/);
  assert.match(html, /Review resolution status: resolved/);
  assert.match(html, /Review resolution action status: complete/);
  assert.match(html, /Review resolution recommendation: Use resolved review/);
  assert.match(html, /Review resolution result: Review approved/);
  assert.match(html, /Review resolution step: Complete resolution action - complete/);
  assert.match(html, /Review resolution step: Recheck readiness - active/);
  assert.match(html, /Audit trail status: resolved/);
  assert.match(html, /Audit trail source: command/);
  assert.match(html, /Audit trail latest event: ready-state-rendered/);
  assert.match(html, /Audit event status: pass/);
  assert.match(html, /Audit event detail: 0 blockers/);
  assert.match(html, /Audit event status: resolved/);
  assert.match(html, /Audit event detail: Review approved/);
  assert.match(html, /Audit event detail: Source command/);
  assert.match(html, /Audit event status: single/);
  assert.match(html, /Audit event detail: 1 completed actions/);
  assert.match(html, /Audit event detail: Use context pack context_pack_example_001/);
  assert.match(html, /Operator handoff status: ready-for-agent/);
  assert.match(html, /Operator handoff objective: Hand off ready Context Pack usage to an AI agent./);
  assert.match(html, /Operator handoff changes made: Workflow Action completed and review resolved./);
  assert.match(html, /Operator handoff assumptions: Context Pack is ready because readiness blockers are clear./);
  assert.match(html, /Operator handoff missing context: No missing context for ready preview./);
  assert.match(html, /Operator handoff verification performed: Studio audit trail status: resolved/);
  assert.match(html, /Operator handoff recommended next workflow: Use Context Pack/);
  assert.match(html, /Operator handoff next agent: AI writing agent/);
  assert.match(html, /Operator runbook status: ready/);
  assert.match(html, /Operator runbook step detail: workflow_action_example_001 is complete/);
  assert.match(html, /Handoff acceptance status: accepted/);
  assert.match(html, /Handoff acceptance decision: Accept handoff context/);
  assert.match(html, /Handoff acceptance next workflow: Use Context Pack/);
  assert.match(html, /Handoff acceptance evidence: Current action workflow_action_example_001 is complete/);
  assert.match(html, /Handoff acceptance evidence: Runbook status is ready/);
  assert.match(html, /Agent handoff context status: ready/);
  assert.match(html, /Agent handoff ready: true/);
  assert.match(html, /Agent handoff operator run: operator_run_example_001/);
  assert.match(html, /Agent handoff context pack: context_pack_example_001/);
  assert.match(html, /Agent handoff task type: brand-writing/);
  assert.match(html, /Agent handoff next workflow: Use Context Pack/);
  assert.match(html, /Agent handoff next agent: AI writing agent/);
  assert.match(html, /Agent handoff evidence: Current action workflow_action_example_001 is complete/);
  assert.match(html, /Agent handoff instruction: Use accepted handoff context only./);
  assert.match(html, /Agent handoff instruction: Load Context Pack context_pack_example_001 before drafting./);
  assert.match(html, /Agent prompt plan status: ready/);
  assert.match(html, /Agent prompt allowed: true/);
  assert.match(html, /Agent prompt agent: AI writing agent/);
  assert.match(html, /Agent prompt context pack: context_pack_example_001/);
  assert.match(html, /Agent prompt task type: brand-writing/);
  assert.match(html, /Agent prompt objective: Draft brand-writing output using context_pack_example_001./);
  assert.match(html, /Agent prompt source policy: Repository context only: accepted handoff and Context Pack sources./);
  assert.match(html, /Agent prompt next workflow: Agent Draft Execution/);
  assert.match(html, /Agent prompt section: Accepted source context/);
  assert.match(html, /Agent prompt guardrail: Use accepted handoff context only./);
  assert.match(html, /Agent draft execution status: ready/);
  assert.match(html, /Agent draft allowed: true/);
  assert.match(html, /Agent draft agent: AI writing agent/);
  assert.match(html, /Agent draft context pack: context_pack_example_001/);
  assert.match(html, /Agent draft task type: brand-writing/);
  assert.match(html, /Agent draft title: Example Brand brand-writing draft/);
  assert.match(html, /Agent draft body: Example Brand helps Teams building brand-led products with AI assistance turns scattered brand knowledge into reusable operating context./);
  assert.match(html, /Agent draft next workflow: Draft Review/);
  assert.match(html, /Agent draft citation: Claim claim_example_001: BrandOS turns scattered brand knowledge into reusable operating context./);
  assert.match(html, /Agent draft quality check: Repository citations attached - pass/);
  assert.match(html, /Draft review status: approved/);
  assert.match(html, /Draft review approved: true/);
  assert.match(html, /Draft review title: Example Brand brand-writing draft/);
  assert.match(html, /Draft review decision: Approve draft for handoff closure/);
  assert.match(html, /Draft review summary: Draft includes repository citations and passes required quality checks./);
  assert.match(html, /Draft review next workflow: Agent Handoff Closure/);
  assert.match(html, /Draft review evidence: Citation count: 3/);
  assert.match(html, /Draft review check: Quality checks passed - pass/);
  assert.match(html, /Agent handoff closure status: closed/);
  assert.match(html, /Agent handoff closed: true/);
  assert.match(html, /Agent handoff closure decision: Close agent handoff/);
  assert.match(html, /Agent handoff closure summary: Agent handoff is closed with approved draft review evidence./);
  assert.match(html, /Agent handoff closure next workflow: Agent Handoff Runtime Summary/);
  assert.match(html, /Agent handoff closure artifact: Example Brand brand-writing draft/);
  assert.match(html, /Agent handoff closure evidence: Draft review status: approved/);
  assert.match(html, /Agent handoff closure check: Draft review approved - pass/);
  assert.match(html, /Agent handoff runtime summary status: complete/);
  assert.match(html, /Agent handoff runtime complete: true/);
  assert.match(html, /Agent handoff runtime stages: 5\/5/);
  assert.match(html, /Agent handoff runtime blocked stages: 0/);
  assert.match(html, /Agent handoff runtime decision: Agent handoff runtime complete/);
  assert.match(html, /Agent handoff runtime summary: All Agent Handoff Runtime stages are closed with repository-backed evidence./);
  assert.match(html, /Agent handoff runtime next workflow: Agent Handoff Runtime Aggregate Summary/);
  assert.match(html, /Agent handoff runtime stage: Agent Handoff Closure - closed/);
  assert.match(html, /Agent handoff runtime evidence: Closure status: closed/);
  assert.match(html, /Agent handoff runtime aggregate status: complete/);
  assert.match(html, /Agent handoff runtime aggregate complete: true/);
  assert.match(html, /Agent handoff runtime aggregate runtimes: 1\/1/);
  assert.match(html, /Agent handoff runtime aggregate blocked runtimes: 0/);
  assert.match(html, /Agent handoff runtime aggregate stages: 5\/5/);
  assert.match(html, /Agent handoff runtime aggregate decision: Close Agent Handoff Runtime v1.2 aggregate/);
  assert.match(html, /Agent handoff runtime aggregate summary: Agent Handoff Runtime v1.2 has a complete runtime summary and is ready for final closure./);
  assert.match(html, /Agent handoff runtime aggregate next workflow: Agent Handoff Runtime Final Closure/);
  assert.match(html, /Agent handoff runtime aggregate item: Agent Handoff Runtime Summary - complete - 5\/5/);
  assert.match(html, /Agent handoff runtime aggregate evidence: Runtime summary status: complete/);
  assert.match(html, /Agent handoff runtime final closure status: closed/);
  assert.match(html, /Agent handoff runtime final closure closed: true/);
  assert.match(html, /Agent handoff runtime final closure decision: Close Agent Handoff Runtime v1.2/);
  assert.match(html, /Agent handoff runtime final closure summary: Agent Handoff Runtime v1.2 is closed with aggregate evidence and is ready for archive./);
  assert.match(html, /Agent handoff runtime final closure next workflow: Agent Handoff Runtime v1.2 Closed/);
  assert.match(html, /Agent handoff runtime final closure artifact: Agent Handoff Runtime Summary/);
  assert.match(html, /Agent handoff runtime final closure evidence: Aggregate status: complete/);
  assert.match(html, /Agent handoff runtime final closure check: Aggregate summary complete - pass/);
  assert.match(html, /Runtime health status: healthy/);
  assert.match(html, /Runtime health healthy: true/);
  assert.match(html, /Runtime health state source: command/);
  assert.match(html, /Runtime health completed actions: 1/);
  assert.match(html, /Runtime health readiness: ready/);
  assert.match(html, /Runtime health closure: closed/);
  assert.match(html, /Runtime health decision: Runtime is reliable for repeated local use/);
  assert.match(html, /Runtime health summary: Studio state, workflow action history, and runtime closure are aligned./);
  assert.match(html, /Runtime health next workflow: Studio State Recovery/);
  assert.match(html, /Runtime health signal: Workflow action state - pass - command with 1 completed actions/);
  assert.match(html, /Runtime health recovery: Keep current Studio state for repeated local runs./);
  assert.match(html, /Studio state recovery status: ready/);
  assert.match(html, /Studio state recovery ready: true/);
  assert.match(html, /Studio state recovery source: command/);
  assert.match(html, /Studio state recovery completed actions: 1/);
  assert.match(html, /Studio state recovery decision: Keep current Studio state/);
  assert.match(html, /Studio state recovery summary: Studio state is reliable and can be reused as the local ready baseline./);
  assert.match(html, /Studio state recovery next workflow: Runtime Validation Signals/);
  assert.match(html, /Studio state recovery step: Preserve current Studio state - complete - Current state is reliable for repeated local runs./);
  assert.match(html, /Studio state recovery evidence: Runtime health status: healthy/);
  assert.match(html, /Runtime validation status: ready/);
  assert.match(html, /Runtime validation ready: true/);
  assert.match(html, /Runtime validation source: command/);
  assert.match(html, /Runtime validation completed actions: 1/);
  assert.match(html, /Runtime validation decision: Runtime validation signals are ready/);
  assert.match(html, /Runtime validation summary: Studio can use repeatable validation signals for local runtime confidence./);
  assert.match(html, /Runtime validation next workflow: Runtime Reliability Closure/);
  assert.match(html, /Runtime validation signal: Studio state recovery - pass - ready/);
  assert.match(html, /Runtime validation command: npm run check:all/);
  assert.match(html, /Runtime validation evidence: Runtime health status: healthy/);
  assert.match(html, /Operator recovery status: ready/);
  assert.match(html, /Operator recovery ready: true/);
  assert.match(html, /Operator recovery source: command/);
  assert.match(html, /Operator recovery completed actions: 1/);
  assert.match(html, /Operator recovery decision: Continue with runtime reliability closure/);
  assert.match(html, /Operator recovery summary: Operator recovery guidance confirms the local runtime baseline is reusable./);
  assert.match(html, /Operator recovery next workflow: Runtime Reliability Aggregate Summary/);
  assert.match(html, /Operator recovery step: Keep runtime baseline - complete - Validation signals are ready for repeated local runs./);
  assert.match(html, /Operator recovery signal: Studio state recovery - pass - ready/);
  assert.match(html, /Operator recovery command: npm run check:all/);
  assert.match(html, /Operator recovery evidence: Runtime health status: healthy/);
  assert.match(html, /Workflow session status: ready/);
  assert.match(html, /Workflow session ready: true/);
  assert.match(html, /Workflow session workflow: Context Pack workflow/);
  assert.match(html, /Workflow session scenario: ready/);
  assert.match(html, /Workflow session current step: ready-for-use/);
  assert.match(html, /Workflow session action status: ready/);
  assert.match(html, /Workflow session source: command/);
  assert.match(html, /Workflow session completed actions: 1/);
  assert.match(html, /Workflow session decision: Continue workflow session/);
  assert.match(html, /Workflow session summary: Workflow session is ready with reusable state and clear next route./);
  assert.match(html, /Workflow session next route: ready.html/);
  assert.match(html, /Workflow session next workflow: Workflow Transition Plan/);
  assert.match(html, /Workflow session signal: Context readiness - pass - 0 blockers/);
  assert.match(html, /Workflow session evidence: Scenario: ready/);
  assert.match(html, /Workflow transition status: ready/);
  assert.match(html, /Workflow transition ready: true/);
  assert.match(html, /Workflow transition workflow: Context Pack workflow/);
  assert.match(html, /Workflow transition scenario: ready/);
  assert.match(html, /Workflow transition current step: ready-for-use/);
  assert.match(html, /Workflow transition from route: index.html/);
  assert.match(html, /Workflow transition to route: ready.html/);
  assert.match(html, /Workflow transition source: command/);
  assert.match(html, /Workflow transition completed actions: 1/);
  assert.match(html, /Workflow transition decision: Proceed to ready workflow route/);
  assert.match(html, /Workflow transition summary: Workflow transition can continue because the session is ready./);
  assert.match(html, /Workflow transition next workflow: Command Result Summary/);
  assert.match(html, /Workflow transition step: Confirm ready route - complete - Route ready.html is ready./);
  assert.match(html, /Workflow transition signal: Context readiness - pass - 0 blockers/);
  assert.match(html, /Workflow transition evidence: Scenario: ready/);
  assert.match(html, /Command result status: complete/);
  assert.match(html, /Command result complete: true/);
  assert.match(html, /Command result scenario: ready/);
  assert.match(html, /Command result from route: index.html/);
  assert.match(html, /Command result to route: ready.html/);
  assert.match(html, /Command result source: command/);
  assert.match(html, /Command result completed actions: 1/);
  assert.match(html, /Command result decision: Command result can be accepted/);
  assert.match(html, /Command result summary: Command result confirms the ready workflow route and reusable state evidence./);
  assert.match(html, /Command result next workflow: Studio Workflow Runtime Aggregate Summary/);
  assert.match(html, /Command result item: Workflow route command - complete - index.html -&gt; ready.html/);
  assert.match(html, /Command result signal: Context readiness - pass - 0 blockers/);
  assert.match(html, /Command result evidence: Transition route: index.html -&gt; ready.html/);
  assert.match(html, /Studio workflow runtime aggregate status: ready/);
  assert.match(html, /Studio workflow runtime aggregate ready: true/);
  assert.match(html, /Studio workflow runtime aggregate scenario: ready/);
  assert.match(html, /Studio workflow runtime aggregate source: command/);
  assert.match(html, /Studio workflow runtime aggregate completed actions: 1/);
  assert.match(html, /Studio workflow runtime aggregate commands: 1\/1/);
  assert.match(html, /Studio workflow runtime aggregate blocked commands: 0/);
  assert.match(html, /Studio workflow runtime aggregate decision: Aggregate Studio workflow runtime evidence/);
  assert.match(html, /Studio workflow runtime aggregate summary: Studio Workflow Runtime v1.4 has complete command result evidence and can move toward final closure./);
  assert.match(html, /Studio workflow runtime aggregate next workflow: Studio Workflow Runtime Final Closure/);
  assert.match(html, /Studio workflow runtime aggregate item: Command Result Summary - complete - ready - index.html -&gt; ready.html - 3 results/);
  assert.match(html, /Studio workflow runtime aggregate evidence: Command route: index.html -&gt; ready.html/);
  assert.match(html, /Studio workflow runtime final closure status: closed/);
  assert.match(html, /Studio workflow runtime final closure closed: true/);
  assert.match(html, /Studio workflow runtime final closure scenario: ready/);
  assert.match(html, /Studio workflow runtime final closure source: command/);
  assert.match(html, /Studio workflow runtime final closure completed actions: 1/);
  assert.match(html, /Studio workflow runtime final closure decision: Close Studio Workflow Runtime v1.4/);
  assert.match(html, /Studio workflow runtime final closure summary: Studio Workflow Runtime v1.4 is closed with aggregate command evidence and is ready for archive./);
  assert.match(html, /Studio workflow runtime final closure next workflow: Studio Workflow Runtime v1.4 Closed/);
  assert.match(html, /Studio workflow runtime final closure artifact: Workflow Session Summary/);
  assert.match(html, /Studio workflow runtime final closure evidence: Aggregate commands complete: 1\/1/);
  assert.match(html, /Studio workflow runtime final closure check: Release artifacts assigned - pass/);
  assert.match(html, /Operator workflow map status: ready/);
  assert.match(html, /Operator workflow map ready: true/);
  assert.match(html, /Operator workflow map scenario: ready/);
  assert.match(html, /Operator workflow map source: command/);
  assert.match(html, /Operator workflow map completed actions: 1/);
  assert.match(html, /Operator workflow map active path: Use Context Pack/);
  assert.match(html, /Operator workflow map paths: 4\/4/);
  assert.match(html, /Operator workflow map blocked paths: 0/);
  assert.match(html, /Operator workflow map decision: Use ready operator workflow map/);
  assert.match(html, /Operator workflow map summary: Operator workflow paths are ready for task selection./);
  assert.match(html, /Operator workflow map next workflow: Operator Task Selection/);
  assert.match(html, /Operator workflow map path: Select operator task - active - Operator Workflow Map can move to Operator Task Selection./);
  assert.match(html, /Operator workflow map evidence: Aggregate commands complete: 1\/1/);
  assert.match(html, /Operator task selection status: ready/);
  assert.match(html, /Operator task selection ready: true/);
  assert.match(html, /Operator task selection scenario: ready/);
  assert.match(html, /Operator task selection source: command/);
  assert.match(html, /Operator task selection completed actions: 1/);
  assert.match(html, /Operator task selection selected task: Use Context Pack/);
  assert.match(html, /Operator task selection selected workflow: Use Context Pack/);
  assert.match(html, /Operator task selection tasks: 3\/3/);
  assert.match(html, /Operator task selection blocked tasks: 0/);
  assert.match(html, /Operator task selection decision: Select ready Context Pack task/);
  assert.match(html, /Operator task selection summary: Operator Task Selection can proceed with the ready Context Pack task./);
  assert.match(html, /Operator task selection next workflow: Operator Step Detail/);
  assert.match(html, /Operator task selection option: Use Context Pack - Use Context Pack - selected - Operator workflow map is ready and points to the ready Context Pack path./);
  assert.match(html, /Operator task selection option: Prepare step detail - Operator Step Detail - next - Selected task can move into inspectable operator step detail./);
  assert.match(html, /Operator task selection evidence: Aggregate commands complete: 1\/1/);
  assert.match(html, /Operator step detail status: ready/);
  assert.match(html, /Operator step detail ready: true/);
  assert.match(html, /Operator step detail scenario: ready/);
  assert.match(html, /Operator step detail source: command/);
  assert.match(html, /Operator step detail completed actions: 1/);
  assert.match(html, /Operator step detail selected task: Use Context Pack/);
  assert.match(html, /Operator step detail selected workflow: Use Context Pack/);
  assert.match(html, /Operator step detail active step: Prepare operator handoff readiness/);
  assert.match(html, /Operator step detail command: Prepare handoff readiness evidence/);
  assert.match(html, /Operator step detail outcome: Operator step can move toward handoff readiness./);
  assert.match(html, /Operator step detail steps: 3\/3/);
  assert.match(html, /Operator step detail blocked steps: 0/);
  assert.match(html, /Operator step detail decision: Inspect ready operator task step/);
  assert.match(html, /Operator step detail summary: Operator Step Detail can inspect the ready task and prepare handoff readiness./);
  assert.match(html, /Operator step detail next workflow: Operator Handoff Readiness/);
  assert.match(html, /Operator step detail step: Prepare operator handoff readiness - active - Step detail is ready for Operator Handoff Readiness./);
  assert.match(html, /Operator step detail evidence: Aggregate commands complete: 1\/1/);
  assert.match(html, /Operator handoff readiness status: ready/);
  assert.match(html, /Operator handoff readiness ready: true/);
  assert.match(html, /Operator handoff readiness scenario: ready/);
  assert.match(html, /Operator handoff readiness source: command/);
  assert.match(html, /Operator handoff readiness completed actions: 1/);
  assert.match(html, /Operator handoff readiness selected task: Use Context Pack/);
  assert.match(html, /Operator handoff readiness selected workflow: Use Context Pack/);
  assert.match(html, /Operator handoff readiness active step: Prepare operator handoff readiness/);
  assert.match(html, /Operator handoff readiness target: AI writing agent/);
  assert.match(html, /Operator handoff readiness mode: agent-ready/);
  assert.match(html, /Operator handoff readiness command: Prepare operator handoff package/);
  assert.match(html, /Operator handoff readiness outcome: Operator handoff readiness is ready for transfer./);
  assert.match(html, /Operator handoff readiness checks: 4\/4/);
  assert.match(html, /Operator handoff readiness blocked checks: 0/);
  assert.match(html, /Operator handoff readiness decision: Prepare handoff readiness package/);
  assert.match(html, /Operator handoff readiness summary: Operator Handoff Readiness can transfer the selected ready task with evidence./);
  assert.match(html, /Operator handoff readiness next workflow: Operator Workflow Design Aggregate Summary/);
  assert.match(html, /Operator handoff readiness check: Blockers clear - pass - No operator handoff blockers remain./);
  assert.match(html, /Operator handoff readiness evidence: Aggregate commands complete: 1\/1/);
  assert.match(html, /Operator workflow design aggregate status: ready/);
  assert.match(html, /Operator workflow design aggregate ready: true/);
  assert.match(html, /Operator workflow design aggregate scenario: ready/);
  assert.match(html, /Operator workflow design aggregate source: command/);
  assert.match(html, /Operator workflow design aggregate completed actions: 1/);
  assert.match(html, /Operator workflow design aggregate selected task: Use Context Pack/);
  assert.match(html, /Operator workflow design aggregate selected workflow: Use Context Pack/);
  assert.match(html, /Operator workflow design aggregate handoff target: AI writing agent/);
  assert.match(html, /Operator workflow design aggregate workflows: 4\/4/);
  assert.match(html, /Operator workflow design aggregate blocked workflows: 0/);
  assert.match(html, /Operator workflow design aggregate decision: Aggregate operator workflow design evidence/);
  assert.match(html, /Operator workflow design aggregate summary: Operator Workflow Design v1.5 has ready workflow map, task selection, step detail, and handoff readiness evidence./);
  assert.match(html, /Operator workflow design aggregate next workflow: Operator Workflow Design Final Closure/);
  assert.match(html, /Operator workflow design aggregate item: Operator Handoff Readiness - ready - true - Prepare handoff readiness package/);
  assert.match(html, /Operator workflow design aggregate evidence: Handoff checks passed: 4\/4/);
  assert.match(html, /Operator workflow design final closure status: closed/);
  assert.match(html, /Operator workflow design final closure closed: true/);
  assert.match(html, /Operator workflow design final closure scenario: ready/);
  assert.match(html, /Operator workflow design final closure source: command/);
  assert.match(html, /Operator workflow design final closure completed actions: 1/);
  assert.match(html, /Operator workflow design final closure selected task: Use Context Pack/);
  assert.match(html, /Operator workflow design final closure selected workflow: Use Context Pack/);
  assert.match(html, /Operator workflow design final closure handoff target: AI writing agent/);
  assert.match(html, /Operator workflow design final closure decision: Close Operator Workflow Design v1.5/);
  assert.match(html, /Operator workflow design final closure summary: Operator Workflow Design v1.5 is closed with aggregate workflow evidence and is ready for archive./);
  assert.match(html, /Operator workflow design final closure next workflow: Operator Workflow Design v1.5 Closed/);
  assert.match(html, /Operator workflow design final closure artifact: Operator Workflow Design Aggregate Summary/);
  assert.match(html, /Operator workflow design final closure evidence: Aggregate workflows ready: 4\/4/);
  assert.match(html, /Operator workflow design final closure check: Release artifacts assigned - pass/);
  assert.match(html, /Repository branch status: ready/);
  assert.match(html, /Repository branch ready: true/);
  assert.match(html, /Repository branch scenario: ready/);
  assert.match(html, /Repository branch source: command/);
  assert.match(html, /Repository branch completed actions: 1/);
  assert.match(html, /Repository branch local: codex\/development-ready-v1.0/);
  assert.match(html, /Repository branch remote: origin\/codex\/development-ready-v1.0/);
  assert.match(html, /Repository branch main: main/);
  assert.match(html, /Repository branch sync: synced/);
  assert.match(html, /Repository branch working tree: clean/);
  assert.match(html, /Repository branch branches: 4\/4/);
  assert.match(html, /Repository branch blocked branches: 0/);
  assert.match(html, /Repository branch decision: Use repository collaboration branch/);
  assert.match(html, /Repository branch summary: Repository Branch Status can use the active collaboration branch with remote and main evidence./);
  assert.match(html, /Repository branch next workflow: Pull Request Readiness/);
  assert.match(html, /Repository branch item: Remote branch - synced - origin\/codex\/development-ready-v1.0/);
  assert.match(html, /Repository branch evidence: Final closure status: closed/);
  assert.match(html, /Multi-action state status: single/);
  assert.match(html, /Multi-action state source: command/);
  assert.match(html, /Multi-action completed count: 1/);
  assert.match(html, /Multi-action latest completed action: workflow_action_example_001/);
  assert.match(html, /Multi-action completed ids: workflow_action_example_001/);
  assert.match(html, /Multi-action readiness impact: readiness resolved/);
});

test('Studio HTML render includes multi-action workflow state history', () => {
  const html = renderStudioHtml(createBrandOSStudioShell({
    completedWorkflowActionId: 'workflow_action_example_001',
    completedActionCount: 2,
    completedActionIds: ['workflow_action_example_000', 'workflow_action_example_001'],
    workflowStateSource: 'repository',
    repositoryStateStatus: 'loaded'
  }), { activeScenario: 'ready' });

  assert.match(html, /Multi-action state status: multiple/);
  assert.match(html, /Multi-action state source: repository/);
  assert.match(html, /Multi-action completed count: 2/);
  assert.match(html, /Multi-action latest completed action: workflow_action_example_001/);
  assert.match(html, /Multi-action completed ids: workflow_action_example_000, workflow_action_example_001/);
  assert.match(html, /Multi-action readiness impact: readiness resolved/);
});

test('Studio shell options parse completed Workflow Action command args', () => {
  const statePath = join(mkdtempSync(join(tmpdir(), 'brandos-studio-command-')), 'missing-state.json');

  assert.deepEqual(
    createStudioShellOptionsFromArgs([
      '--html',
      '--state-file',
      statePath,
      '--complete-workflow-action=workflow_action_example_001',
      '--completed-at',
      '2026-07-19'
    ]),
    {
      completedWorkflowActionId: 'workflow_action_example_001',
      completedAt: '2026-07-19',
      workflowStateSource: 'command',
      repositoryStateFile: statePath,
      repositoryStateStatus: 'not-found',
      repositoryStateVersion: null,
      completedActionCount: 0,
      completedActionIds: []
    }
  );
});

test('Studio shell options load completed Workflow Action from repository state', () => {
  const statePath = join(mkdtempSync(join(tmpdir(), 'brandos-studio-args-')), 'workflow-state.json');
  writeWorkflowActionState(
    statePath,
    createWorkflowActionState({
      completedWorkflowActionId: 'workflow_action_example_001',
      completedAt: '2026-07-20'
    })
  );

  assert.deepEqual(createStudioShellOptionsFromArgs(['--html', '--state-file', statePath]), {
    completedWorkflowActionId: 'workflow_action_example_001',
    completedAt: '2026-07-20',
    workflowStateSource: 'repository',
    repositoryStateFile: statePath,
    repositoryStateStatus: 'loaded',
    repositoryStateVersion: STUDIO_STATE_VERSION,
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });
});

test('Explicit Studio shell command args override repository state', () => {
  const statePath = join(mkdtempSync(join(tmpdir(), 'brandos-studio-override-')), 'workflow-state.json');
  writeWorkflowActionState(
    statePath,
    createWorkflowActionState({
      completedWorkflowActionId: 'workflow_action_from_state',
      completedAt: '2026-07-20'
    })
  );

  assert.deepEqual(
    createStudioShellOptionsFromArgs([
      '--html',
      '--state-file',
      statePath,
      '--complete-workflow-action',
      'workflow_action_example_001',
      '--completed-at',
      '2026-07-21'
    ]),
    {
      completedWorkflowActionId: 'workflow_action_example_001',
      completedAt: '2026-07-21',
      workflowStateSource: 'command',
      repositoryStateFile: statePath,
      repositoryStateStatus: 'loaded',
      repositoryStateVersion: STUDIO_STATE_VERSION,
      completedActionCount: 1,
      completedActionIds: ['workflow_action_from_state']
    }
  );
});

test('Studio shell options can ignore repository state', () => {
  const statePath = join(mkdtempSync(join(tmpdir(), 'brandos-studio-ignore-')), 'workflow-state.json');
  writeWorkflowActionState(
    statePath,
    createWorkflowActionState({
      completedWorkflowActionId: 'workflow_action_example_001',
      completedAt: '2026-07-20'
    })
  );

  assert.deepEqual(createStudioShellOptionsFromArgs(['--html', '--state-file', statePath, '--ignore-repository-state']), {
    workflowStateSource: 'example',
    repositoryStateFile: statePath,
    repositoryStateStatus: 'ignored',
    repositoryStateVersion: null,
    completedActionCount: 0,
    completedActionIds: []
  });
});

test('Studio inspection panel renders repository action ids', () => {
  const statePath = join(mkdtempSync(join(tmpdir(), 'brandos-studio-inspection-')), 'studio-state.json');
  const state = createStudioState({
    completedWorkflowActionId: 'workflow_action_example_001',
    completedAt: '2026-07-19'
  });

  writeWorkflowActionState(statePath, state);
  const shell = createBrandOSStudioShell(createStudioShellOptionsFromArgs(['--html', '--state-file', statePath]));
  const html = renderStudioHtml(shell, { activeScenario: 'ready' });

  assert.match(html, /State source: repository/);
  assert.match(html, /State status: loaded/);
  assert.match(html, /State version: 1/);
  assert.match(html, /Latest completed action: workflow_action_example_001/);
  assert.match(html, /Latest completed at: 2026-07-19/);
  assert.match(html, /Completed action count: 1/);
  assert.match(html, /Completed action ids: workflow_action_example_001/);
});

test('Browser Workflow Action state adapter script exposes storage contract', () => {
  const script = createBrowserWorkflowStateAdapterScript();

  assert.match(script, new RegExp(DEFAULT_WORKFLOW_ACTION_STATE_KEY));
  assert.match(script, /URLSearchParams/);
  assert.match(script, /params.get\('actionId'\)/);
  assert.match(script, /window.localStorage.setItem/);
  assert.match(script, /data-local-completed-action/);
  assert.match(script, /data-clear-workflow-state/);
});

test('Repository Workflow Action state adapter stores shell options', () => {
  const statePath = join(mkdtempSync(join(tmpdir(), 'brandos-studio-state-')), 'workflow-state.json');
  const state = createWorkflowActionState({
    completedWorkflowActionId: 'workflow_action_example_001',
    completedAt: '2026-07-19'
  });

  writeWorkflowActionState(statePath, state);

  assert.deepEqual(readWorkflowActionState(statePath), {
    version: STUDIO_STATE_VERSION,
    source: 'studio-local',
    updatedAt: '2026-07-19',
    workflows: {
      completedActionIds: ['workflow_action_example_001'],
      completedActions: {
        workflow_action_example_001: {
          completedAt: '2026-07-19'
        }
      }
    }
  });
  assert.deepEqual(createStudioShellOptionsFromRepositoryState(statePath), {
    completedWorkflowActionId: 'workflow_action_example_001',
    completedAt: '2026-07-19'
  });
});

test('Repository Workflow Action state adapter describes and resets state', () => {
  const statePath = join(mkdtempSync(join(tmpdir(), 'brandos-studio-reset-')), 'workflow-state.json');
  writeWorkflowActionState(
    statePath,
    createWorkflowActionState({
      completedWorkflowActionId: 'workflow_action_example_001',
      completedAt: '2026-07-22'
    })
  );

  assert.deepEqual(describeWorkflowActionState(statePath), {
    exists: true,
    filePath: statePath,
    version: STUDIO_STATE_VERSION,
    completedWorkflowActionId: 'workflow_action_example_001',
    completedAt: '2026-07-22',
    completedWorkflowActionIds: ['workflow_action_example_001']
  });
  assert.equal(resetWorkflowActionState(statePath), true);
  assert.equal(existsSync(statePath), false);
  assert.equal(resetWorkflowActionState(statePath), false);
  assert.deepEqual(describeWorkflowActionState(statePath), {
    exists: false,
    filePath: statePath,
    version: null,
    completedWorkflowActionId: null,
    completedAt: null,
    completedWorkflowActionIds: []
  });
});

test('Studio state adapter tracks multiple completed Workflow Actions durably', () => {
  const statePath = join(mkdtempSync(join(tmpdir(), 'brandos-studio-durable-')), 'studio-state.json');
  const state = completeStudioWorkflowAction(createStudioState({
    completedWorkflowActionId: 'workflow_action_example_001',
    completedAt: '2026-07-19'
  }), {
    actionId: 'workflow_action_example_002',
    completedAt: '2026-07-20'
  });

  writeWorkflowActionState(statePath, state);

  assert.deepEqual(describeWorkflowActionState(statePath), {
    exists: true,
    filePath: statePath,
    version: STUDIO_STATE_VERSION,
    completedWorkflowActionId: 'workflow_action_example_002',
    completedAt: '2026-07-20',
    completedWorkflowActionIds: ['workflow_action_example_001', 'workflow_action_example_002']
  });
  assert.deepEqual(createStudioShellOptionsFromStudioState(statePath), {
    completedWorkflowActionId: 'workflow_action_example_002',
    completedAt: '2026-07-20'
  });
});

test('Studio state adapter exposes an empty durable state contract', () => {
  assert.deepEqual(createEmptyStudioState(), {
    version: STUDIO_STATE_VERSION,
    source: 'studio-local',
    updatedAt: '2026-07-18',
    workflows: {
      completedActionIds: [],
      completedActions: {}
    }
  });
  assert.equal(DEFAULT_STUDIO_STATE_PATH, '.tmp/studio-state.json');
});
