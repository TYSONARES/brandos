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
