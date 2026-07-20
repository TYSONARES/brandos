import { createBrowserWorkflowStateAdapterScript, DEFAULT_WORKFLOW_ACTION_STATE_KEY } from './browser-state-adapter.mjs';

export function renderStudioHtml(shell, options = {}) {
  const activeScenario = options.activeScenario ?? 'blocked';
  const browserStateKey = options.browserStateKey ?? DEFAULT_WORKFLOW_ACTION_STATE_KEY;
  const readinessTone = shell.contextPackReadiness.ready ? 'ready' : 'blocked';
  const blockingItems = shell.contextPackReadiness.blockingReasons
    .map((reason) => `<li>${escapeHtml(reason)}</li>`)
    .join('');
  const scenarioLinks = [
    { id: 'blocked', label: 'Blocked', href: 'index.html' },
    { id: 'ready', label: 'Ready', href: 'ready.html' }
  ]
    .map((scenario) => {
      const current = scenario.id === activeScenario ? ' aria-current="page"' : '';

      return `<a${current} href="${scenario.href}">${scenario.label}</a>`;
    })
    .join('');
  const actionItems = shell.contextPackWorkflow.nextActions
    .map(
      (action) => `<li class="workflow-action-row">
            <div class="workflow-action-copy">
              <span class="action-status-badge action-status-${escapeHtml(action.status)}">${escapeHtml(action.status)}</span>
              <span>${escapeHtml(action.label)}</span>
              <span class="meta">Owner: ${escapeHtml(action.owner)} - Target: ${escapeHtml(action.targetId)}</span>
            </div>
            ${renderActionCommand(action)}
          </li>`
    )
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(shell.app)}</title>
  <style>
    :root {
      color-scheme: light;
      --surface: #ffffff;
      --muted: #f6f7f9;
      --text: #18202b;
      --secondary: #5b6472;
      --action: #1f6feb;
      --success: #237a57;
      --warning: #9a5b00;
      --danger: #b42318;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--muted);
      color: var(--text);
      line-height: 1.5;
    }
    main {
      max-width: 1120px;
      margin: 0 auto;
      padding: 32px 20px;
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: flex-start;
      margin-bottom: 24px;
    }
    h1, h2, p { margin: 0; }
    h1 { font-size: 28px; font-weight: 720; }
    h2 { font-size: 16px; margin-bottom: 12px; }
    .subtitle { color: var(--secondary); margin-top: 6px; }
    .status {
      border: 1px solid #d7dce3;
      border-radius: 8px;
      background: var(--surface);
      padding: 10px 12px;
      min-width: 210px;
      font-size: 14px;
    }
    .scenario-nav {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .scenario-nav a {
      border: 1px solid #d7dce3;
      border-radius: 8px;
      color: var(--text);
      font-size: 14px;
      font-weight: 650;
      min-width: 86px;
      padding: 7px 10px;
      text-align: center;
      text-decoration: none;
    }
    .scenario-nav a[aria-current="page"] {
      background: var(--text);
      border-color: var(--text);
      color: var(--surface);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .panel {
      background: var(--surface);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      padding: 16px;
    }
    .metric {
      display: block;
      color: var(--action);
      font-size: 26px;
      font-weight: 720;
    }
    .label, .meta { color: var(--secondary); font-size: 13px; }
    .workflow-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 16px;
    }
    .readiness {
      color: ${readinessTone === 'ready' ? 'var(--success)' : 'var(--warning)'};
      font-weight: 700;
      text-transform: capitalize;
    }
    ul {
      margin: 10px 0 0;
      padding-left: 20px;
    }
    .section-title {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0;
      margin: 22px 0 10px;
      text-transform: uppercase;
    }
    .actions {
      margin-top: 14px;
      border-top: 1px solid #d7dce3;
      padding-top: 12px;
    }
    .workflow-action-row {
      align-items: flex-start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: flex;
      gap: 8px;
      justify-content: space-between;
      list-style: none;
      margin-top: 8px;
      padding: 8px;
    }
    .workflow-action-copy {
      display: grid;
      gap: 4px;
    }
    .action-status-badge {
      width: fit-content;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 8px;
      text-transform: capitalize;
    }
    .action-status-pending,
    .action-status-blocked {
      color: var(--warning);
    }
    .action-status-ready,
    .action-status-complete {
      color: var(--success);
    }
    .workflow-command {
      display: flex;
      margin: 0;
    }
    .workflow-command input {
      display: none;
    }
    .workflow-command button,
    .workflow-command a {
      appearance: none;
      background: var(--action);
      border: 1px solid var(--action);
      border-radius: 8px;
      color: var(--surface);
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      min-width: 112px;
      padding: 7px 10px;
      text-align: center;
      text-decoration: none;
    }
    .local-state {
      margin-top: 12px;
    }
    .state-source-list {
      background: #fbfcfe;
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 6px;
      margin-top: 10px;
      padding: 10px;
    }
    .state-source-row {
      align-items: center;
      display: grid;
      gap: 8px;
      grid-template-columns: 120px minmax(0, 1fr);
    }
    .state-source-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .state-source-value {
      color: var(--text);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .state-source-badge {
      border: 1px solid #d7dce3;
      border-radius: 999px;
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 8px;
      text-transform: capitalize;
    }
    .inspection-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .inspection-row {
      align-items: start;
      border-top: 1px solid #e7ebf0;
      display: grid;
      gap: 8px;
      grid-template-columns: 160px minmax(0, 1fr);
      padding-top: 8px;
    }
    .inspection-row:first-child {
      border-top: 0;
      padding-top: 0;
    }
    .inspection-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .inspection-value {
      color: var(--text);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .diagnostics-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .diagnostic-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 160px minmax(0, 1fr);
      padding: 8px;
    }
    .diagnostic-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .diagnostic-value {
      color: var(--text);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .guidance-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .guidance-row {
      align-items: start;
      border-top: 1px solid #e7ebf0;
      display: grid;
      gap: 8px;
      grid-template-columns: 160px minmax(0, 1fr);
      padding-top: 8px;
    }
    .guidance-row:first-child {
      border-top: 0;
      padding-top: 0;
    }
    .guidance-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .guidance-value {
      color: var(--text);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .operator-workflow-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-workflow-stage {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 130px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-workflow-stage-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-workflow-stage-copy {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .operator-workflow-status {
      font-weight: 700;
      text-transform: capitalize;
    }
    .operator-control-list {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }
    .operator-control-row {
      align-items: center;
      background: #fbfcfe;
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 10px;
      grid-template-columns: minmax(0, 1fr) auto;
      padding: 8px;
    }
    .operator-control-copy {
      display: grid;
      gap: 3px;
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .operator-control-command {
      color: var(--secondary);
      font-size: 12px;
    }
    .operator-control-action {
      display: flex;
      margin: 0;
    }
    .operator-control-action input {
      display: none;
    }
    .operator-control-action button,
    .operator-control-action a {
      appearance: none;
      background: var(--action);
      border: 1px solid var(--action);
      border-radius: 8px;
      color: var(--surface);
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      min-width: 142px;
      padding: 7px 10px;
      text-align: center;
      text-decoration: none;
    }
    .operator-run-queue-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-run-queue-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-run-queue-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-run-queue-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .operator-runbook-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-runbook-step {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-runbook-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-runbook-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .handoff-acceptance-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .handoff-acceptance-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .handoff-acceptance-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .handoff-acceptance-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .agent-handoff-context-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .agent-handoff-context-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .agent-handoff-context-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .agent-handoff-context-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .agent-prompt-plan-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .agent-prompt-plan-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .agent-prompt-plan-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .agent-prompt-plan-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .agent-draft-execution-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .agent-draft-execution-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .agent-draft-execution-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .agent-draft-execution-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .draft-review-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .draft-review-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .draft-review-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .draft-review-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .agent-handoff-closure-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .agent-handoff-closure-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .agent-handoff-closure-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .agent-handoff-closure-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .agent-handoff-runtime-summary-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .agent-handoff-runtime-summary-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .agent-handoff-runtime-summary-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .agent-handoff-runtime-summary-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .agent-handoff-runtime-aggregate-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .agent-handoff-runtime-aggregate-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .agent-handoff-runtime-aggregate-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .agent-handoff-runtime-aggregate-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .agent-handoff-runtime-final-closure-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .agent-handoff-runtime-final-closure-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .agent-handoff-runtime-final-closure-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .agent-handoff-runtime-final-closure-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .runtime-health-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .runtime-health-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .runtime-health-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .runtime-health-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .studio-state-recovery-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .studio-state-recovery-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .studio-state-recovery-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .studio-state-recovery-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .runtime-validation-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .runtime-validation-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .runtime-validation-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .runtime-validation-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .operator-recovery-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-recovery-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-recovery-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-recovery-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .usage-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .usage-row {
      align-items: start;
      border-top: 1px solid #e7ebf0;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding-top: 8px;
    }
    .usage-row:first-child {
      border-top: 0;
      padding-top: 0;
    }
    .usage-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .usage-value {
      color: var(--text);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .usage-step-list {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }
    .usage-step {
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 4px;
      padding: 8px;
    }
    .usage-step-label {
      color: var(--text);
      font-size: 13px;
      font-weight: 700;
    }
    .usage-step-detail {
      color: var(--secondary);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .multi-action-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .multi-action-row {
      align-items: start;
      border-top: 1px solid #e7ebf0;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding-top: 8px;
    }
    .multi-action-row:first-child {
      border-top: 0;
      padding-top: 0;
    }
    .multi-action-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .multi-action-value {
      color: var(--text);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .review-resolution-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .review-resolution-row {
      align-items: start;
      border-top: 1px solid #e7ebf0;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding-top: 8px;
    }
    .review-resolution-row:first-child {
      border-top: 0;
      padding-top: 0;
    }
    .review-resolution-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .review-resolution-value {
      color: var(--text);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .review-resolution-step-list {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }
    .review-resolution-step {
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 4px;
      padding: 8px;
    }
    .review-resolution-step-label {
      color: var(--text);
      font-size: 13px;
      font-weight: 700;
    }
    .review-resolution-step-detail {
      color: var(--secondary);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .audit-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .audit-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .audit-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .audit-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .handoff-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .handoff-row {
      align-items: start;
      border-top: 1px solid #e7ebf0;
      display: grid;
      gap: 8px;
      grid-template-columns: 180px minmax(0, 1fr);
      padding-top: 8px;
    }
    .handoff-row:first-child {
      border-top: 0;
      padding-top: 0;
    }
    .handoff-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .handoff-value {
      color: var(--text);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .local-state button {
      appearance: none;
      background: transparent;
      border: 0;
      color: var(--secondary);
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      padding: 0;
      text-decoration: underline;
    }
    @media (max-width: 760px) {
      header, .workflow-grid { display: block; }
      .status { margin-top: 16px; }
      .grid { grid-template-columns: 1fr; }
      .panel { margin-bottom: 12px; }
      .workflow-action-row { display: grid; }
      .workflow-command button,
      .workflow-command a { width: 100%; }
      .state-source-row,
      .inspection-row,
      .diagnostic-row,
      .guidance-row,
      .operator-workflow-stage,
      .usage-row,
      .multi-action-row,
      .review-resolution-row,
      .audit-row,
      .handoff-row,
      .operator-run-queue-row,
      .operator-runbook-step,
      .handoff-acceptance-row,
      .agent-handoff-context-row,
      .agent-prompt-plan-row,
      .agent-draft-execution-row,
      .draft-review-row,
      .agent-handoff-closure-row,
      .agent-handoff-runtime-summary-row,
      .agent-handoff-runtime-aggregate-row,
      .agent-handoff-runtime-final-closure-row,
      .runtime-health-row,
      .studio-state-recovery-row,
      .runtime-validation-row,
      .operator-recovery-row,
      .operator-control-row { grid-template-columns: 1fr; }
      .operator-control-action button,
      .operator-control-action a { width: 100%; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <section>
        <h1>${escapeHtml(shell.app)}</h1>
        <p class="subtitle">${escapeHtml(shell.release)} - ${escapeHtml(shell.status)}</p>
      </section>
      <aside class="status">
        <strong>Context readiness</strong>
        <p class="readiness">${readinessTone}</p>
      </aside>
    </header>

    <nav class="scenario-nav" aria-label="Workflow scenarios">${scenarioLinks}</nav>

    <section class="grid" aria-label="Studio metrics">
      <article class="panel">
        <span class="metric">${shell.state.workspaceCount}</span>
        <span class="label">Workspace</span>
      </article>
      <article class="panel">
        <span class="metric">${shell.state.objectCount}</span>
        <span class="label">Product Core objects</span>
      </article>
      <article class="panel">
        <span class="metric">${shell.contextPackReadiness.blockingReasons.length}</span>
        <span class="label">Readiness blockers</span>
      </article>
    </section>

    <p class="section-title">Studio diagnostics</p>
    <section class="panel" aria-label="Studio diagnostics">
      <h2>${escapeHtml(shell.diagnostics.title)}</h2>
      <div class="diagnostics-list">
        ${renderDiagnosticRow('Packages', `Package count: ${shell.diagnostics.packageCount}`)}
        ${renderDiagnosticRow('Objects', `Product object count: ${shell.diagnostics.objectCount}`)}
        ${renderDiagnosticRow('Readiness', `Readiness blockers: ${shell.diagnostics.readinessBlockerCount}`)}
        ${renderDiagnosticRow('State source', `Diagnostic state source: ${shell.diagnostics.stateSource}`)}
        ${renderDiagnosticRow('State status', `Diagnostic state status: ${shell.diagnostics.stateStatus}`)}
        ${renderDiagnosticRow('Result', `Diagnostic result: ${shell.diagnostics.result}`)}
        ${shell.diagnostics.checks.map(renderDiagnosticCheck).join('')}
      </div>
    </section>

    <p class="section-title">Operator guidance</p>
    <section class="panel" aria-label="Operator guidance">
      <h2>${escapeHtml(shell.operatorGuidance.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Guidance status: ${shell.operatorGuidance.status}`)}
        ${renderGuidanceRow('Recommendation', `Recommended action: ${shell.operatorGuidance.recommendation}`)}
        ${renderGuidanceRow('Reason', `Guidance reason: ${shell.operatorGuidance.reason}`)}
        ${renderGuidanceRow('Command', `Guidance command: ${shell.operatorGuidance.command}`)}
      </div>
    </section>

    <p class="section-title">Operator workflow</p>
    <section class="panel" aria-label="Operator workflow">
      <h2>${escapeHtml(shell.operatorWorkflow.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator workflow status: ${shell.operatorWorkflow.status}`)}
        ${renderGuidanceRow('Active stage', `Operator active stage: ${shell.operatorWorkflow.activeStage}`)}
        ${renderGuidanceRow('Next action', `Operator next action: ${shell.operatorWorkflow.nextAction}`)}
      </div>
      <div class="operator-workflow-list">
        ${shell.operatorWorkflow.stages.map(renderOperatorWorkflowStage).join('')}
      </div>
      <div class="operator-control-list" aria-label="Operator execution controls">
        ${shell.operatorWorkflow.executionControls.map(renderOperatorExecutionControl).join('')}
      </div>
    </section>

    <p class="section-title">Operator Run Queue</p>
    <section class="panel" aria-label="Operator Run Queue">
      <h2>${escapeHtml(shell.operatorRunQueue.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Run count', `Operator run queue count: ${shell.operatorRunQueue.runCount}`)}
        ${renderGuidanceRow('Blocked', `Operator run blocked count: ${shell.operatorRunQueue.blockedCount}`)}
        ${renderGuidanceRow('Ready', `Operator run ready count: ${shell.operatorRunQueue.readyCount}`)}
        ${renderGuidanceRow('Active run', `Operator run active id: ${shell.operatorRunQueue.activeRunId || 'none'}`)}
      </div>
      <div class="operator-run-queue-list">
        ${shell.operatorRunQueue.items.map(renderOperatorRunQueueItem).join('')}
      </div>
    </section>

    <p class="section-title">Operator Runbook Execution</p>
    <section class="panel" aria-label="Operator Runbook Execution">
      <h2>${escapeHtml(shell.operatorRunbookExecution.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator runbook status: ${shell.operatorRunbookExecution.status}`)}
        ${renderGuidanceRow('Run', `Operator runbook run id: ${shell.operatorRunbookExecution.runId}`)}
        ${renderGuidanceRow('Action', `Operator runbook current action: ${shell.operatorRunbookExecution.currentActionId}`)}
        ${renderGuidanceRow('Handoff', `Operator runbook handoff: ${shell.operatorRunbookExecution.handoffId}`)}
      </div>
      <div class="operator-runbook-list">
        ${shell.operatorRunbookExecution.steps.map(renderOperatorRunbookStep).join('')}
      </div>
    </section>

    <p class="section-title">Handoff Acceptance</p>
    <section class="panel" aria-label="Handoff Acceptance">
      <h2>${escapeHtml(shell.handoffAcceptance.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Handoff acceptance status: ${shell.handoffAcceptance.status}`)}
        ${renderGuidanceRow('Decision', `Handoff acceptance decision: ${shell.handoffAcceptance.decision}`)}
        ${renderGuidanceRow('Run', `Handoff acceptance run id: ${shell.handoffAcceptance.runId}`)}
        ${renderGuidanceRow('Next workflow', `Handoff acceptance next workflow: ${shell.handoffAcceptance.nextWorkflow}`)}
      </div>
      <div class="handoff-acceptance-list">
        ${shell.handoffAcceptance.requiredEvidence.map(renderHandoffAcceptanceEvidence).join('')}
        ${shell.handoffAcceptance.blockedReasons.map(renderHandoffAcceptanceBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Agent Handoff Context</p>
    <section class="panel" aria-label="Agent Handoff Context">
      <h2>${escapeHtml(shell.agentHandoffContext.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Agent handoff context status: ${shell.agentHandoffContext.status}`)}
        ${renderGuidanceRow('Ready', `Agent handoff ready: ${shell.agentHandoffContext.readyForAgent}`)}
        ${renderGuidanceRow('Operator run', `Agent handoff operator run: ${shell.agentHandoffContext.operatorRunId}`)}
        ${renderGuidanceRow('Context Pack', `Agent handoff context pack: ${shell.agentHandoffContext.contextPackId}`)}
        ${renderGuidanceRow('Task type', `Agent handoff task type: ${shell.agentHandoffContext.taskType}`)}
        ${renderGuidanceRow('Next workflow', `Agent handoff next workflow: ${shell.agentHandoffContext.nextWorkflow}`)}
        ${renderGuidanceRow('Next agent', `Agent handoff next agent: ${shell.agentHandoffContext.nextAgent}`)}
      </div>
      <div class="agent-handoff-context-list">
        ${shell.agentHandoffContext.contextSources.map(renderAgentHandoffContextSource).join('')}
        ${shell.agentHandoffContext.requiredEvidence.map(renderAgentHandoffContextEvidence).join('')}
        ${shell.agentHandoffContext.blockedReasons.map(renderAgentHandoffContextBlocker).join('')}
        ${shell.agentHandoffContext.agentInstructions.map(renderAgentHandoffContextInstruction).join('')}
      </div>
    </section>

    <p class="section-title">Agent Prompt Plan</p>
    <section class="panel" aria-label="Agent Prompt Plan">
      <h2>${escapeHtml(shell.agentPromptPlan.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Agent prompt plan status: ${shell.agentPromptPlan.status}`)}
        ${renderGuidanceRow('Allowed', `Agent prompt allowed: ${shell.agentPromptPlan.promptAllowed}`)}
        ${renderGuidanceRow('Agent', `Agent prompt agent: ${shell.agentPromptPlan.agent}`)}
        ${renderGuidanceRow('Context Pack', `Agent prompt context pack: ${shell.agentPromptPlan.contextPackId}`)}
        ${renderGuidanceRow('Task type', `Agent prompt task type: ${shell.agentPromptPlan.taskType}`)}
        ${renderGuidanceRow('Objective', `Agent prompt objective: ${shell.agentPromptPlan.objective}`)}
        ${renderGuidanceRow('Source policy', `Agent prompt source policy: ${shell.agentPromptPlan.sourcePolicy}`)}
        ${renderGuidanceRow('Next workflow', `Agent prompt next workflow: ${shell.agentPromptPlan.nextWorkflow}`)}
      </div>
      <div class="agent-prompt-plan-list">
        ${shell.agentPromptPlan.promptSections.map(renderAgentPromptPlanSection).join('')}
        ${shell.agentPromptPlan.guardrails.map(renderAgentPromptPlanGuardrail).join('')}
        ${shell.agentPromptPlan.blockers.map(renderAgentPromptPlanBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Agent Draft Execution</p>
    <section class="panel" aria-label="Agent Draft Execution">
      <h2>${escapeHtml(shell.agentDraftExecution.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Agent draft execution status: ${shell.agentDraftExecution.status}`)}
        ${renderGuidanceRow('Allowed', `Agent draft allowed: ${shell.agentDraftExecution.draftAllowed}`)}
        ${renderGuidanceRow('Agent', `Agent draft agent: ${shell.agentDraftExecution.agent}`)}
        ${renderGuidanceRow('Context Pack', `Agent draft context pack: ${shell.agentDraftExecution.contextPackId}`)}
        ${renderGuidanceRow('Task type', `Agent draft task type: ${shell.agentDraftExecution.taskType}`)}
        ${renderGuidanceRow('Title', `Agent draft title: ${shell.agentDraftExecution.draftTitle}`)}
        ${renderGuidanceRow('Body', `Agent draft body: ${shell.agentDraftExecution.draftBody || 'none'}`)}
        ${renderGuidanceRow('Source policy', `Agent draft source policy: ${shell.agentDraftExecution.sourcePolicy}`)}
        ${renderGuidanceRow('Next workflow', `Agent draft next workflow: ${shell.agentDraftExecution.nextWorkflow}`)}
      </div>
      <div class="agent-draft-execution-list">
        ${shell.agentDraftExecution.evidenceCitations.map(renderAgentDraftExecutionCitation).join('')}
        ${shell.agentDraftExecution.qualityChecks.map(renderAgentDraftExecutionQualityCheck).join('')}
        ${shell.agentDraftExecution.blockers.map(renderAgentDraftExecutionBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Draft Review</p>
    <section class="panel" aria-label="Draft Review">
      <h2>${escapeHtml(shell.draftReview.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Draft review status: ${shell.draftReview.status}`)}
        ${renderGuidanceRow('Approved', `Draft review approved: ${shell.draftReview.approved}`)}
        ${renderGuidanceRow('Context Pack', `Draft review context pack: ${shell.draftReview.contextPackId}`)}
        ${renderGuidanceRow('Draft', `Draft review title: ${shell.draftReview.draftTitle}`)}
        ${renderGuidanceRow('Decision', `Draft review decision: ${shell.draftReview.reviewDecision}`)}
        ${renderGuidanceRow('Summary', `Draft review summary: ${shell.draftReview.reviewSummary}`)}
        ${renderGuidanceRow('Next workflow', `Draft review next workflow: ${shell.draftReview.nextWorkflow}`)}
      </div>
      <div class="draft-review-list">
        ${shell.draftReview.requiredEvidence.map(renderDraftReviewEvidence).join('')}
        ${shell.draftReview.reviewChecks.map(renderDraftReviewCheck).join('')}
        ${shell.draftReview.blockers.map(renderDraftReviewBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Agent Handoff Closure</p>
    <section class="panel" aria-label="Agent Handoff Closure">
      <h2>${escapeHtml(shell.agentHandoffClosure.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Agent handoff closure status: ${shell.agentHandoffClosure.status}`)}
        ${renderGuidanceRow('Closed', `Agent handoff closed: ${shell.agentHandoffClosure.closed}`)}
        ${renderGuidanceRow('Context Pack', `Agent handoff closure context pack: ${shell.agentHandoffClosure.contextPackId}`)}
        ${renderGuidanceRow('Decision', `Agent handoff closure decision: ${shell.agentHandoffClosure.closureDecision}`)}
        ${renderGuidanceRow('Summary', `Agent handoff closure summary: ${shell.agentHandoffClosure.closureSummary}`)}
        ${renderGuidanceRow('Next workflow', `Agent handoff closure next workflow: ${shell.agentHandoffClosure.nextWorkflow}`)}
      </div>
      <div class="agent-handoff-closure-list">
        ${shell.agentHandoffClosure.closedArtifacts.map(renderAgentHandoffClosureArtifact).join('')}
        ${shell.agentHandoffClosure.closureEvidence.map(renderAgentHandoffClosureEvidence).join('')}
        ${shell.agentHandoffClosure.closureChecks.map(renderAgentHandoffClosureCheck).join('')}
        ${shell.agentHandoffClosure.blockers.map(renderAgentHandoffClosureBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Agent Handoff Runtime Summary</p>
    <section class="panel" aria-label="Agent Handoff Runtime Summary">
      <h2>${escapeHtml(shell.agentHandoffRuntimeSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Agent handoff runtime summary status: ${shell.agentHandoffRuntimeSummary.status}`)}
        ${renderGuidanceRow('Complete', `Agent handoff runtime complete: ${shell.agentHandoffRuntimeSummary.complete}`)}
        ${renderGuidanceRow('Context Pack', `Agent handoff runtime context pack: ${shell.agentHandoffRuntimeSummary.contextPackId}`)}
        ${renderGuidanceRow('Stages', `Agent handoff runtime stages: ${shell.agentHandoffRuntimeSummary.completedStageCount}/${shell.agentHandoffRuntimeSummary.stageCount}`)}
        ${renderGuidanceRow('Blocked', `Agent handoff runtime blocked stages: ${shell.agentHandoffRuntimeSummary.blockedStageCount}`)}
        ${renderGuidanceRow('Decision', `Agent handoff runtime decision: ${shell.agentHandoffRuntimeSummary.finalDecision}`)}
        ${renderGuidanceRow('Summary', `Agent handoff runtime summary: ${shell.agentHandoffRuntimeSummary.finalSummary}`)}
        ${renderGuidanceRow('Next workflow', `Agent handoff runtime next workflow: ${shell.agentHandoffRuntimeSummary.nextWorkflow}`)}
      </div>
      <div class="agent-handoff-runtime-summary-list">
        ${shell.agentHandoffRuntimeSummary.stages.map(renderAgentHandoffRuntimeSummaryStage).join('')}
        ${shell.agentHandoffRuntimeSummary.evidence.map(renderAgentHandoffRuntimeSummaryEvidence).join('')}
        ${shell.agentHandoffRuntimeSummary.blockers.map(renderAgentHandoffRuntimeSummaryBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Agent Handoff Runtime Aggregate Summary</p>
    <section class="panel" aria-label="Agent Handoff Runtime Aggregate Summary">
      <h2>${escapeHtml(shell.agentHandoffRuntimeAggregateSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Agent handoff runtime aggregate status: ${shell.agentHandoffRuntimeAggregateSummary.status}`)}
        ${renderGuidanceRow('Complete', `Agent handoff runtime aggregate complete: ${shell.agentHandoffRuntimeAggregateSummary.complete}`)}
        ${renderGuidanceRow('Context Pack', `Agent handoff runtime aggregate context pack: ${shell.agentHandoffRuntimeAggregateSummary.contextPackId}`)}
        ${renderGuidanceRow('Runtimes', `Agent handoff runtime aggregate runtimes: ${shell.agentHandoffRuntimeAggregateSummary.completeRuntimeCount}/${shell.agentHandoffRuntimeAggregateSummary.runtimeCount}`)}
        ${renderGuidanceRow('Blocked', `Agent handoff runtime aggregate blocked runtimes: ${shell.agentHandoffRuntimeAggregateSummary.blockedRuntimeCount}`)}
        ${renderGuidanceRow('Stages', `Agent handoff runtime aggregate stages: ${shell.agentHandoffRuntimeAggregateSummary.completedStageCount}/${shell.agentHandoffRuntimeAggregateSummary.totalStageCount}`)}
        ${renderGuidanceRow('Decision', `Agent handoff runtime aggregate decision: ${shell.agentHandoffRuntimeAggregateSummary.aggregateDecision}`)}
        ${renderGuidanceRow('Summary', `Agent handoff runtime aggregate summary: ${shell.agentHandoffRuntimeAggregateSummary.aggregateSummary}`)}
        ${renderGuidanceRow('Next workflow', `Agent handoff runtime aggregate next workflow: ${shell.agentHandoffRuntimeAggregateSummary.nextWorkflow}`)}
      </div>
      <div class="agent-handoff-runtime-aggregate-list">
        ${shell.agentHandoffRuntimeAggregateSummary.runtimeItems.map(renderAgentHandoffRuntimeAggregateItem).join('')}
        ${shell.agentHandoffRuntimeAggregateSummary.evidence.map(renderAgentHandoffRuntimeAggregateEvidence).join('')}
        ${shell.agentHandoffRuntimeAggregateSummary.blockers.map(renderAgentHandoffRuntimeAggregateBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Agent Handoff Runtime Final Closure</p>
    <section class="panel" aria-label="Agent Handoff Runtime Final Closure">
      <h2>${escapeHtml(shell.agentHandoffRuntimeFinalClosure.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Agent handoff runtime final closure status: ${shell.agentHandoffRuntimeFinalClosure.status}`)}
        ${renderGuidanceRow('Closed', `Agent handoff runtime final closure closed: ${shell.agentHandoffRuntimeFinalClosure.closed}`)}
        ${renderGuidanceRow('Context Pack', `Agent handoff runtime final closure context pack: ${shell.agentHandoffRuntimeFinalClosure.contextPackId}`)}
        ${renderGuidanceRow('Decision', `Agent handoff runtime final closure decision: ${shell.agentHandoffRuntimeFinalClosure.closureDecision}`)}
        ${renderGuidanceRow('Summary', `Agent handoff runtime final closure summary: ${shell.agentHandoffRuntimeFinalClosure.closureSummary}`)}
        ${renderGuidanceRow('Next workflow', `Agent handoff runtime final closure next workflow: ${shell.agentHandoffRuntimeFinalClosure.nextWorkflow}`)}
      </div>
      <div class="agent-handoff-runtime-final-closure-list">
        ${shell.agentHandoffRuntimeFinalClosure.releaseArtifacts.map(renderAgentHandoffRuntimeFinalClosureArtifact).join('')}
        ${shell.agentHandoffRuntimeFinalClosure.closureEvidence.map(renderAgentHandoffRuntimeFinalClosureEvidence).join('')}
        ${shell.agentHandoffRuntimeFinalClosure.closureChecks.map(renderAgentHandoffRuntimeFinalClosureCheck).join('')}
        ${shell.agentHandoffRuntimeFinalClosure.blockers.map(renderAgentHandoffRuntimeFinalClosureBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Runtime Health Summary</p>
    <section class="panel" aria-label="Runtime Health Summary">
      <h2>${escapeHtml(shell.runtimeHealthSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Runtime health status: ${shell.runtimeHealthSummary.status}`)}
        ${renderGuidanceRow('Healthy', `Runtime health healthy: ${shell.runtimeHealthSummary.healthy}`)}
        ${renderGuidanceRow('State source', `Runtime health state source: ${shell.runtimeHealthSummary.stateSource}`)}
        ${renderGuidanceRow('State status', `Runtime health state status: ${shell.runtimeHealthSummary.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Runtime health completed actions: ${shell.runtimeHealthSummary.completedActionCount}`)}
        ${renderGuidanceRow('Readiness', `Runtime health readiness: ${shell.runtimeHealthSummary.readinessStatus}`)}
        ${renderGuidanceRow('Runtime closure', `Runtime health closure: ${shell.runtimeHealthSummary.runtimeClosureStatus}`)}
        ${renderGuidanceRow('Decision', `Runtime health decision: ${shell.runtimeHealthSummary.healthDecision}`)}
        ${renderGuidanceRow('Summary', `Runtime health summary: ${shell.runtimeHealthSummary.healthSummary}`)}
        ${renderGuidanceRow('Next workflow', `Runtime health next workflow: ${shell.runtimeHealthSummary.nextWorkflow}`)}
      </div>
      <div class="runtime-health-list">
        ${shell.runtimeHealthSummary.signals.map(renderRuntimeHealthSignal).join('')}
        ${shell.runtimeHealthSummary.recoveryActions.map(renderRuntimeHealthRecoveryAction).join('')}
        ${shell.runtimeHealthSummary.blockers.map(renderRuntimeHealthBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Studio State Recovery</p>
    <section class="panel" aria-label="Studio State Recovery">
      <h2>${escapeHtml(shell.studioStateRecovery.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Studio state recovery status: ${shell.studioStateRecovery.status}`)}
        ${renderGuidanceRow('Ready', `Studio state recovery ready: ${shell.studioStateRecovery.recoveryReady}`)}
        ${renderGuidanceRow('State source', `Studio state recovery source: ${shell.studioStateRecovery.stateSource}`)}
        ${renderGuidanceRow('State status', `Studio state recovery state status: ${shell.studioStateRecovery.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Studio state recovery completed actions: ${shell.studioStateRecovery.completedActionCount}`)}
        ${renderGuidanceRow('Decision', `Studio state recovery decision: ${shell.studioStateRecovery.recoveryDecision}`)}
        ${renderGuidanceRow('Summary', `Studio state recovery summary: ${shell.studioStateRecovery.recoverySummary}`)}
        ${renderGuidanceRow('Next workflow', `Studio state recovery next workflow: ${shell.studioStateRecovery.nextWorkflow}`)}
      </div>
      <div class="studio-state-recovery-list">
        ${shell.studioStateRecovery.recoverySteps.map(renderStudioStateRecoveryStep).join('')}
        ${shell.studioStateRecovery.requiredEvidence.map(renderStudioStateRecoveryEvidence).join('')}
        ${shell.studioStateRecovery.blockers.map(renderStudioStateRecoveryBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Runtime Validation Signals</p>
    <section class="panel" aria-label="Runtime Validation Signals">
      <h2>${escapeHtml(shell.runtimeValidationSignals.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Runtime validation status: ${shell.runtimeValidationSignals.status}`)}
        ${renderGuidanceRow('Ready', `Runtime validation ready: ${shell.runtimeValidationSignals.validationReady}`)}
        ${renderGuidanceRow('State source', `Runtime validation source: ${shell.runtimeValidationSignals.stateSource}`)}
        ${renderGuidanceRow('State status', `Runtime validation state status: ${shell.runtimeValidationSignals.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Runtime validation completed actions: ${shell.runtimeValidationSignals.completedActionCount}`)}
        ${renderGuidanceRow('Decision', `Runtime validation decision: ${shell.runtimeValidationSignals.validationDecision}`)}
        ${renderGuidanceRow('Summary', `Runtime validation summary: ${shell.runtimeValidationSignals.validationSummary}`)}
        ${renderGuidanceRow('Next workflow', `Runtime validation next workflow: ${shell.runtimeValidationSignals.nextWorkflow}`)}
      </div>
      <div class="runtime-validation-list">
        ${shell.runtimeValidationSignals.validationSignals.map(renderRuntimeValidationSignal).join('')}
        ${shell.runtimeValidationSignals.validationCommands.map(renderRuntimeValidationCommand).join('')}
        ${shell.runtimeValidationSignals.requiredEvidence.map(renderRuntimeValidationEvidence).join('')}
        ${shell.runtimeValidationSignals.blockers.map(renderRuntimeValidationBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Operator Recovery Guidance</p>
    <section class="panel" aria-label="Operator Recovery Guidance">
      <h2>${escapeHtml(shell.operatorRecoveryGuidance.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator recovery status: ${shell.operatorRecoveryGuidance.status}`)}
        ${renderGuidanceRow('Ready', `Operator recovery ready: ${shell.operatorRecoveryGuidance.guidanceReady}`)}
        ${renderGuidanceRow('State source', `Operator recovery source: ${shell.operatorRecoveryGuidance.stateSource}`)}
        ${renderGuidanceRow('State status', `Operator recovery state status: ${shell.operatorRecoveryGuidance.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Operator recovery completed actions: ${shell.operatorRecoveryGuidance.completedActionCount}`)}
        ${renderGuidanceRow('Decision', `Operator recovery decision: ${shell.operatorRecoveryGuidance.guidanceDecision}`)}
        ${renderGuidanceRow('Summary', `Operator recovery summary: ${shell.operatorRecoveryGuidance.guidanceSummary}`)}
        ${renderGuidanceRow('Next workflow', `Operator recovery next workflow: ${shell.operatorRecoveryGuidance.nextWorkflow}`)}
      </div>
      <div class="operator-recovery-list">
        ${shell.operatorRecoveryGuidance.guidanceSteps.map(renderOperatorRecoveryStep).join('')}
        ${shell.operatorRecoveryGuidance.validationSignals.map(renderOperatorRecoverySignal).join('')}
        ${shell.operatorRecoveryGuidance.recommendedCommands.map(renderOperatorRecoveryCommand).join('')}
        ${shell.operatorRecoveryGuidance.requiredEvidence.map(renderOperatorRecoveryEvidence).join('')}
        ${shell.operatorRecoveryGuidance.blockers.map(renderOperatorRecoveryBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Brand overview</p>
    <section class="workflow-grid" aria-label="Brand overview">
      <article class="panel">
        <h2>${escapeHtml(shell.brandProfileOverview.name)}</h2>
        <p>${escapeHtml(shell.brandProfileOverview.promise)}</p>
        <p class="meta">Audience: ${escapeHtml(shell.brandProfileOverview.primaryAudience)}</p>
        <p class="meta">Claims: ${shell.brandProfileOverview.supportedClaimCount}/${shell.brandProfileOverview.claimCount} supported</p>
        <p class="meta">Decisions: ${shell.brandProfileOverview.acceptedDecisionCount}/${shell.brandProfileOverview.decisionCount} accepted</p>
      </article>
      <article class="panel">
        <h2>Source health</h2>
        <p class="meta">Claims: ${shell.brandProfileOverview.supportedClaimCount}/${shell.brandProfileOverview.claimCount} supported</p>
        <p class="meta">Decisions: ${shell.brandProfileOverview.acceptedDecisionCount}/${shell.brandProfileOverview.decisionCount} accepted</p>
      </article>
    </section>

    <p class="section-title">Context Pack workflow</p>
    <section class="workflow-grid" aria-label="Context Pack workflow">
      <article class="panel">
        <h2>${escapeHtml(shell.contextPackReadiness.name)}</h2>
        <p class="meta">Included claims: ${shell.contextPackReadiness.supportedClaimCount}/${shell.contextPackReadiness.includedClaimCount} supported</p>
        <p class="meta">Accepted decisions: ${shell.contextPackReadiness.acceptedDecisionCount}</p>
        <p class="meta">Reviews: ${shell.contextPackReadiness.reviewCount}</p>
        <p class="meta">Actions: ${shell.contextPackReadiness.actionCount}</p>
        <ul>${blockingItems}</ul>
      </article>
      <article class="panel">
        <h2>${escapeHtml(shell.contextPackWorkflow.title)}</h2>
        <p class="meta">Current step: ${escapeHtml(shell.contextPackWorkflow.currentStep)}</p>
        <p class="meta">Action status: ${escapeHtml(shell.contextPackWorkflow.actionStatus)}</p>
        ${renderCompletedActionMeta(shell.contextPackWorkflow.completedActionId)}
        <p class="meta">Owner: ${escapeHtml(shell.contextPackWorkflow.owner)}</p>
        <p class="meta local-state">Saved action: <span data-local-completed-action>${escapeHtml(shell.contextPackWorkflow.completedActionId || 'none')}</span></p>
        <p class="local-state"><button type="button" data-clear-workflow-state>Reset action</button></p>
        <div class="state-source-list" aria-label="State sources">
          <div class="state-source-row">
            <span class="state-source-label">Source</span>
            <span class="state-source-value">Workflow state source: <span class="state-source-badge state-source-${escapeHtml(shell.contextPackWorkflow.stateSource)}">${escapeHtml(shell.contextPackWorkflow.stateSource)}</span></span>
          </div>
          <div class="state-source-row">
            <span class="state-source-label">Browser</span>
            <span class="state-source-value">Browser state key: ${escapeHtml(shell.contextPackWorkflow.browserStateKey)}</span>
          </div>
          <div class="state-source-row">
            <span class="state-source-label">Repository</span>
            <span class="state-source-value">Repository state file: ${escapeHtml(shell.contextPackWorkflow.repositoryStateFile)}</span>
          </div>
          <div class="state-source-row">
            <span class="state-source-label">Status</span>
            <span class="state-source-value">Repository state status: ${escapeHtml(shell.contextPackWorkflow.repositoryStateStatus)}</span>
          </div>
          <div class="state-source-row">
            <span class="state-source-label">Version</span>
            <span class="state-source-value">Repository state version: ${escapeHtml(shell.contextPackWorkflow.repositoryStateVersion || 'none')}</span>
          </div>
          <div class="state-source-row">
            <span class="state-source-label">History</span>
            <span class="state-source-value">Completed action history: ${escapeHtml(shell.contextPackWorkflow.completedActionCount)}</span>
          </div>
        </div>
        <div class="actions">
          <h2>Next action</h2>
          <ul>${actionItems}</ul>
        </div>
      </article>
    </section>

    <p class="section-title">Context Pack usage flow</p>
    <section class="panel" aria-label="Context Pack usage flow">
      <h2>${escapeHtml(shell.contextPackUsageFlow.title)}</h2>
      <div class="usage-list">
        ${renderUsageRow('Status', `Context Pack usage status: ${shell.contextPackUsageFlow.status}`)}
        ${renderUsageRow('Task type', `Context Pack task type: ${shell.contextPackUsageFlow.taskType}`)}
        ${renderUsageRow('Audience', `Context Pack audience: ${shell.contextPackUsageFlow.intendedAudience}`)}
        ${renderUsageRow('Owner', `Context Pack owner: ${shell.contextPackUsageFlow.owner}`)}
        ${renderUsageRow('Expiry', `Context Pack expires at: ${shell.contextPackUsageFlow.expiresAt}`)}
        ${renderUsageRow('Source counts', `Context Pack sources: ${shell.contextPackUsageFlow.includedClaimCount} claims, ${shell.contextPackUsageFlow.includedDecisionCount} decisions`)}
        ${renderUsageRow('Sections', `Context Pack sections: ${shell.contextPackUsageFlow.includedSections.join(', ')}`)}
        ${renderUsageRow('Exclusions', `Context Pack exclusions: ${shell.contextPackUsageFlow.excludedTopics.join(', ')}`)}
      </div>
      <div class="usage-step-list">
        ${shell.contextPackUsageFlow.steps.map(renderUsageStep).join('')}
      </div>
    </section>

    <p class="section-title">Review resolution workflow</p>
    <section class="panel" aria-label="Review resolution workflow">
      <h2>${escapeHtml(shell.reviewResolutionWorkflow.title)}</h2>
      <div class="review-resolution-list">
        ${renderReviewResolutionRow('Status', `Review resolution status: ${shell.reviewResolutionWorkflow.status}`)}
        ${renderReviewResolutionRow('Target', `Review resolution target: ${shell.reviewResolutionWorkflow.targetObjectType} ${shell.reviewResolutionWorkflow.targetObjectId}`)}
        ${renderReviewResolutionRow('Reviewer', `Review resolution reviewer: ${shell.reviewResolutionWorkflow.reviewer}`)}
        ${renderReviewResolutionRow('Action', `Review resolution action: ${shell.reviewResolutionWorkflow.actionId || 'none'}`)}
        ${renderReviewResolutionRow('Action status', `Review resolution action status: ${shell.reviewResolutionWorkflow.actionStatus}`)}
        ${renderReviewResolutionRow('Owner', `Review resolution owner: ${shell.reviewResolutionWorkflow.owner}`)}
        ${renderReviewResolutionRow('Recommended action', `Review resolution recommendation: ${shell.reviewResolutionWorkflow.recommendedAction}`)}
        ${renderReviewResolutionRow('Result', `Review resolution result: ${shell.reviewResolutionWorkflow.resolutionResult}`)}
      </div>
      <div class="review-resolution-step-list">
        ${shell.reviewResolutionWorkflow.steps.map(renderReviewResolutionStep).join('')}
      </div>
    </section>

    <p class="section-title">Studio workflow audit trail</p>
    <section class="panel" aria-label="Studio workflow audit trail">
      <h2>${escapeHtml(shell.studioWorkflowAuditTrail.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Audit trail status: ${shell.studioWorkflowAuditTrail.status}`)}
        ${renderGuidanceRow('Source', `Audit trail source: ${shell.studioWorkflowAuditTrail.source}`)}
        ${renderGuidanceRow('Latest event', `Audit trail latest event: ${shell.studioWorkflowAuditTrail.latestEvent}`)}
      </div>
      <div class="audit-list">
        ${shell.studioWorkflowAuditTrail.events.map(renderAuditEvent).join('')}
      </div>
    </section>

    <p class="section-title">Operator handoff</p>
    <section class="panel" aria-label="Operator handoff">
      <h2>${escapeHtml(shell.operatorHandoff.title)}</h2>
      <div class="handoff-list">
        ${renderHandoffRow('Status', `Operator handoff status: ${shell.operatorHandoff.status}`)}
        ${renderHandoffRow('Objective', `Operator handoff objective: ${shell.operatorHandoff.objective}`)}
        ${renderHandoffRow('Sources loaded', `Operator handoff sources loaded: ${shell.operatorHandoff.sourcesLoaded.join(', ')}`)}
        ${renderHandoffRow('Changes made', `Operator handoff changes made: ${shell.operatorHandoff.changesMade}`)}
        ${renderHandoffRow('Assumptions', `Operator handoff assumptions: ${shell.operatorHandoff.assumptions}`)}
        ${renderHandoffRow('Missing context', `Operator handoff missing context: ${shell.operatorHandoff.missingContext}`)}
        ${renderHandoffRow('Verification', `Operator handoff verification performed: ${shell.operatorHandoff.verificationPerformed}`)}
        ${renderHandoffRow('Next workflow', `Operator handoff recommended next workflow: ${shell.operatorHandoff.recommendedNextWorkflow}`)}
        ${renderHandoffRow('Next agent', `Operator handoff next agent: ${shell.operatorHandoff.nextAgent}`)}
      </div>
    </section>

    <p class="section-title">Studio state inspection</p>
    <section class="panel" aria-label="Studio state inspection">
      <h2>${escapeHtml(shell.studioStateInspection.title)}</h2>
      <div class="inspection-list">
        ${renderInspectionRow('Source', `State source: ${shell.studioStateInspection.source}`)}
        ${renderInspectionRow('Status', `State status: ${shell.studioStateInspection.status}`)}
        ${renderInspectionRow('File', `State file: ${shell.studioStateInspection.file}`)}
        ${renderInspectionRow('Version', `State version: ${shell.studioStateInspection.version || 'none'}`)}
        ${renderInspectionRow('Latest action', `Latest completed action: ${shell.studioStateInspection.latestCompletedActionId || 'none'}`)}
        ${renderInspectionRow('Latest timestamp', `Latest completed at: ${shell.studioStateInspection.latestCompletedAt || 'none'}`)}
        ${renderInspectionRow('History', `Completed action count: ${shell.studioStateInspection.completedActionCount}`)}
        ${renderInspectionRow('Action ids', `Completed action ids: ${renderCompletedActionIds(shell.studioStateInspection.completedActionIds)}`)}
      </div>
    </section>

    <p class="section-title">Multi-action workflow state</p>
    <section class="panel" aria-label="Multi-action workflow state">
      <h2>${escapeHtml(shell.multiActionWorkflowState.title)}</h2>
      <div class="multi-action-list">
        ${renderMultiActionRow('Status', `Multi-action state status: ${shell.multiActionWorkflowState.status}`)}
        ${renderMultiActionRow('Source', `Multi-action state source: ${shell.multiActionWorkflowState.stateSource}`)}
        ${renderMultiActionRow('Count', `Multi-action completed count: ${shell.multiActionWorkflowState.completedActionCount}`)}
        ${renderMultiActionRow('Latest', `Multi-action latest completed action: ${shell.multiActionWorkflowState.latestCompletedActionId || 'none'}`)}
        ${renderMultiActionRow('Action ids', `Multi-action completed ids: ${renderCompletedActionIds(shell.multiActionWorkflowState.completedActionIds)}`)}
        ${renderMultiActionRow('Readiness impact', `Multi-action readiness impact: ${shell.multiActionWorkflowState.readinessImpact}`)}
      </div>
    </section>
  </main>
  ${renderBrowserStateScript(browserStateKey)}
</body>
</html>`;
}

function renderActionCommand(action) {
  if (action.id && action.status === 'pending') {
    return `<form class="workflow-command" method="get" action="ready.html">
              <input type="hidden" name="actionId" value="${escapeHtml(action.id)}">
              <input type="hidden" name="actionType" value="${escapeHtml(action.type)}">
              <button type="submit">Complete action</button>
            </form>`;
  }

  if (action.status === 'ready') {
    return `<div class="workflow-command"><a href="ready.html">Use context pack</a></div>`;
  }

  return '';
}

function renderCompletedActionMeta(completedActionId) {
  if (!completedActionId) {
    return '';
  }

  return `<p class="meta">Completed action: ${escapeHtml(completedActionId)}</p>`;
}

function renderInspectionRow(label, value) {
  return `<div class="inspection-row">
          <span class="inspection-label">${escapeHtml(label)}</span>
          <span class="inspection-value">${escapeHtml(value)}</span>
        </div>`;
}

function renderDiagnosticRow(label, value) {
  return `<div class="diagnostic-row">
          <span class="diagnostic-label">${escapeHtml(label)}</span>
          <span class="diagnostic-value">${escapeHtml(value)}</span>
        </div>`;
}

function renderDiagnosticCheck(check) {
  return renderDiagnosticRow(`Check: ${check.label}`, `Diagnostic check ${check.label}: ${check.status} - ${check.detail}`);
}

function renderGuidanceRow(label, value) {
  return `<div class="guidance-row">
          <span class="guidance-label">${escapeHtml(label)}</span>
          <span class="guidance-value">${escapeHtml(value)}</span>
        </div>`;
}

function renderOperatorWorkflowStage(stage) {
  return `<div class="operator-workflow-stage">
          <span class="operator-workflow-stage-label">${escapeHtml(stage.label)}</span>
          <span class="operator-workflow-stage-copy">
            <span class="operator-workflow-status">Operator stage status: ${escapeHtml(stage.status)}</span>
            <span>Operator stage detail: ${escapeHtml(stage.detail)}</span>
          </span>
        </div>`;
}

function renderOperatorExecutionControl(control) {
  return `<div class="operator-control-row">
          <span class="operator-control-copy">
            <span>Operator control label: ${escapeHtml(control.label)}</span>
            <span>Operator control status: ${escapeHtml(control.status)}</span>
            <span class="operator-control-command">Operator control command: ${escapeHtml(control.command)}</span>
            <span class="operator-control-command">Operator control result: ${escapeHtml(control.result)}</span>
          </span>
          ${renderOperatorControlAction(control)}
        </div>`;
}

function renderOperatorControlAction(control) {
  if (control.controlType === 'form') {
    return `<form class="operator-control-action" method="get" action="${escapeHtml(control.target)}">
              <input type="hidden" name="actionId" value="workflow_action_example_001">
              <input type="hidden" name="actionType" value="review-resolution">
              <button type="submit">${escapeHtml(control.label)}</button>
            </form>`;
  }

  return `<div class="operator-control-action"><a href="${escapeHtml(control.target)}">${escapeHtml(control.label)}</a></div>`;
}

function renderOperatorRunQueueItem(item) {
  return `<div class="operator-run-queue-row">
          <span class="operator-run-queue-label">${escapeHtml(item.id)}</span>
          <span class="operator-run-queue-value">
            <span>Operator run status: ${escapeHtml(item.status)}</span>
            <span>Operator run priority: ${escapeHtml(item.priority)}</span>
            <span>Operator run owner: ${escapeHtml(item.owner)}</span>
            <span>Operator run workflow: ${escapeHtml(item.workflow)}</span>
            <span>Operator run objective: ${escapeHtml(item.objective)}</span>
            <span>Operator run current action: ${escapeHtml(item.currentActionId)}</span>
            <span>Operator run current action status: ${escapeHtml(item.currentActionStatus)}</span>
            <span>Operator run next action: ${escapeHtml(item.nextActionLabel)}</span>
            <span>Operator run handoff: ${escapeHtml(item.handoffId)}</span>
            <span>Operator run audit events: ${escapeHtml(item.auditEventCount)}</span>
          </span>
        </div>`;
}

function renderOperatorRunbookStep(step) {
  return `<div class="operator-runbook-step">
          <span class="operator-runbook-label">${escapeHtml(step.label)}</span>
          <span class="operator-runbook-value">
            <span>Operator runbook step status: ${escapeHtml(step.status)}</span>
            <span>Operator runbook step detail: ${escapeHtml(step.detail)}</span>
          </span>
        </div>`;
}

function renderHandoffAcceptanceEvidence(evidence) {
  return `<div class="handoff-acceptance-row">
          <span class="handoff-acceptance-label">Evidence</span>
          <span class="handoff-acceptance-value">Handoff acceptance evidence: ${escapeHtml(evidence)}</span>
        </div>`;
}

function renderHandoffAcceptanceBlocker(reason) {
  return `<div class="handoff-acceptance-row">
    <span class="handoff-acceptance-label">Blocker</span>
    <span class="handoff-acceptance-value">Handoff acceptance blocker: ${escapeHtml(reason)}</span>
  </div>`;
}

function renderAgentHandoffContextSource(source) {
  return `<div class="agent-handoff-context-row">
    <span class="agent-handoff-context-label">Source</span>
    <span class="agent-handoff-context-value">Agent handoff source: ${escapeHtml(source)}</span>
  </div>`;
}

function renderAgentHandoffContextEvidence(evidence) {
  return `<div class="agent-handoff-context-row">
    <span class="agent-handoff-context-label">Evidence</span>
    <span class="agent-handoff-context-value">Agent handoff evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderAgentHandoffContextBlocker(reason) {
  return `<div class="agent-handoff-context-row">
    <span class="agent-handoff-context-label">Blocker</span>
    <span class="agent-handoff-context-value">Agent handoff blocker: ${escapeHtml(reason)}</span>
  </div>`;
}

function renderAgentHandoffContextInstruction(instruction) {
  return `<div class="agent-handoff-context-row">
    <span class="agent-handoff-context-label">Instruction</span>
    <span class="agent-handoff-context-value">Agent handoff instruction: ${escapeHtml(instruction)}</span>
  </div>`;
}

function renderAgentPromptPlanSection(section) {
  return `<div class="agent-prompt-plan-row">
    <span class="agent-prompt-plan-label">Section</span>
    <span class="agent-prompt-plan-value">Agent prompt section: ${escapeHtml(section)}</span>
  </div>`;
}

function renderAgentPromptPlanGuardrail(guardrail) {
  return `<div class="agent-prompt-plan-row">
    <span class="agent-prompt-plan-label">Guardrail</span>
    <span class="agent-prompt-plan-value">Agent prompt guardrail: ${escapeHtml(guardrail)}</span>
  </div>`;
}

function renderAgentPromptPlanBlocker(blocker) {
  return `<div class="agent-prompt-plan-row">
    <span class="agent-prompt-plan-label">Blocker</span>
    <span class="agent-prompt-plan-value">Agent prompt blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderAgentDraftExecutionCitation(citation) {
  return `<div class="agent-draft-execution-row">
    <span class="agent-draft-execution-label">Citation</span>
    <span class="agent-draft-execution-value">Agent draft citation: ${escapeHtml(citation)}</span>
  </div>`;
}

function renderAgentDraftExecutionQualityCheck(check) {
  return `<div class="agent-draft-execution-row">
    <span class="agent-draft-execution-label">Quality</span>
    <span class="agent-draft-execution-value">Agent draft quality check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)}</span>
  </div>`;
}

function renderAgentDraftExecutionBlocker(blocker) {
  return `<div class="agent-draft-execution-row">
    <span class="agent-draft-execution-label">Blocker</span>
    <span class="agent-draft-execution-value">Agent draft blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderDraftReviewEvidence(evidence) {
  return `<div class="draft-review-row">
    <span class="draft-review-label">Evidence</span>
    <span class="draft-review-value">Draft review evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderDraftReviewCheck(check) {
  return `<div class="draft-review-row">
    <span class="draft-review-label">Check</span>
    <span class="draft-review-value">Draft review check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)}</span>
  </div>`;
}

function renderDraftReviewBlocker(blocker) {
  return `<div class="draft-review-row">
    <span class="draft-review-label">Blocker</span>
    <span class="draft-review-value">Draft review blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderAgentHandoffClosureArtifact(artifact) {
  return `<div class="agent-handoff-closure-row">
    <span class="agent-handoff-closure-label">Artifact</span>
    <span class="agent-handoff-closure-value">Agent handoff closure artifact: ${escapeHtml(artifact)}</span>
  </div>`;
}

function renderAgentHandoffClosureEvidence(evidence) {
  return `<div class="agent-handoff-closure-row">
    <span class="agent-handoff-closure-label">Evidence</span>
    <span class="agent-handoff-closure-value">Agent handoff closure evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderAgentHandoffClosureCheck(check) {
  return `<div class="agent-handoff-closure-row">
    <span class="agent-handoff-closure-label">Check</span>
    <span class="agent-handoff-closure-value">Agent handoff closure check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)}</span>
  </div>`;
}

function renderAgentHandoffClosureBlocker(blocker) {
  return `<div class="agent-handoff-closure-row">
    <span class="agent-handoff-closure-label">Blocker</span>
    <span class="agent-handoff-closure-value">Agent handoff closure blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderAgentHandoffRuntimeSummaryStage(stage) {
  return `<div class="agent-handoff-runtime-summary-row">
    <span class="agent-handoff-runtime-summary-label">Stage</span>
    <span class="agent-handoff-runtime-summary-value">Agent handoff runtime stage: ${escapeHtml(stage.label)} - ${escapeHtml(stage.status)}</span>
  </div>`;
}

function renderAgentHandoffRuntimeSummaryEvidence(evidence) {
  return `<div class="agent-handoff-runtime-summary-row">
    <span class="agent-handoff-runtime-summary-label">Evidence</span>
    <span class="agent-handoff-runtime-summary-value">Agent handoff runtime evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderAgentHandoffRuntimeSummaryBlocker(blocker) {
  return `<div class="agent-handoff-runtime-summary-row">
    <span class="agent-handoff-runtime-summary-label">Blocker</span>
    <span class="agent-handoff-runtime-summary-value">Agent handoff runtime blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderAgentHandoffRuntimeAggregateItem(item) {
  return `<div class="agent-handoff-runtime-aggregate-row">
    <span class="agent-handoff-runtime-aggregate-label">Runtime</span>
    <span class="agent-handoff-runtime-aggregate-value">Agent handoff runtime aggregate item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${item.completedStages}/${item.totalStages}</span>
  </div>`;
}

function renderAgentHandoffRuntimeAggregateEvidence(evidence) {
  return `<div class="agent-handoff-runtime-aggregate-row">
    <span class="agent-handoff-runtime-aggregate-label">Evidence</span>
    <span class="agent-handoff-runtime-aggregate-value">Agent handoff runtime aggregate evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderAgentHandoffRuntimeAggregateBlocker(blocker) {
  return `<div class="agent-handoff-runtime-aggregate-row">
    <span class="agent-handoff-runtime-aggregate-label">Blocker</span>
    <span class="agent-handoff-runtime-aggregate-value">Agent handoff runtime aggregate blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderAgentHandoffRuntimeFinalClosureArtifact(artifact) {
  return `<div class="agent-handoff-runtime-final-closure-row">
    <span class="agent-handoff-runtime-final-closure-label">Artifact</span>
    <span class="agent-handoff-runtime-final-closure-value">Agent handoff runtime final closure artifact: ${escapeHtml(artifact)}</span>
  </div>`;
}

function renderAgentHandoffRuntimeFinalClosureEvidence(evidence) {
  return `<div class="agent-handoff-runtime-final-closure-row">
    <span class="agent-handoff-runtime-final-closure-label">Evidence</span>
    <span class="agent-handoff-runtime-final-closure-value">Agent handoff runtime final closure evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderAgentHandoffRuntimeFinalClosureCheck(check) {
  return `<div class="agent-handoff-runtime-final-closure-row">
    <span class="agent-handoff-runtime-final-closure-label">Check</span>
    <span class="agent-handoff-runtime-final-closure-value">Agent handoff runtime final closure check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)}</span>
  </div>`;
}

function renderAgentHandoffRuntimeFinalClosureBlocker(blocker) {
  return `<div class="agent-handoff-runtime-final-closure-row">
    <span class="agent-handoff-runtime-final-closure-label">Blocker</span>
    <span class="agent-handoff-runtime-final-closure-value">Agent handoff runtime final closure blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderRuntimeHealthSignal(signal) {
  return `<div class="runtime-health-row">
    <span class="runtime-health-label">Signal</span>
    <span class="runtime-health-value">Runtime health signal: ${escapeHtml(signal.label)} - ${escapeHtml(signal.status)} - ${escapeHtml(signal.detail)}</span>
  </div>`;
}

function renderRuntimeHealthRecoveryAction(action) {
  return `<div class="runtime-health-row">
    <span class="runtime-health-label">Recovery</span>
    <span class="runtime-health-value">Runtime health recovery: ${escapeHtml(action)}</span>
  </div>`;
}

function renderRuntimeHealthBlocker(blocker) {
  return `<div class="runtime-health-row">
    <span class="runtime-health-label">Blocker</span>
    <span class="runtime-health-value">Runtime health blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderStudioStateRecoveryStep(step) {
  return `<div class="studio-state-recovery-row">
    <span class="studio-state-recovery-label">Step</span>
    <span class="studio-state-recovery-value">Studio state recovery step: ${escapeHtml(step.label)} - ${escapeHtml(step.status)} - ${escapeHtml(step.detail)}</span>
  </div>`;
}

function renderStudioStateRecoveryEvidence(evidence) {
  return `<div class="studio-state-recovery-row">
    <span class="studio-state-recovery-label">Evidence</span>
    <span class="studio-state-recovery-value">Studio state recovery evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderStudioStateRecoveryBlocker(blocker) {
  return `<div class="studio-state-recovery-row">
    <span class="studio-state-recovery-label">Blocker</span>
    <span class="studio-state-recovery-value">Studio state recovery blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderRuntimeValidationSignal(signal) {
  return `<div class="runtime-validation-row">
    <span class="runtime-validation-label">Signal</span>
    <span class="runtime-validation-value">Runtime validation signal: ${escapeHtml(signal.label)} - ${escapeHtml(signal.status)} - ${escapeHtml(signal.detail)}</span>
  </div>`;
}

function renderRuntimeValidationCommand(command) {
  return `<div class="runtime-validation-row">
    <span class="runtime-validation-label">Command</span>
    <span class="runtime-validation-value">Runtime validation command: ${escapeHtml(command)}</span>
  </div>`;
}

function renderRuntimeValidationEvidence(evidence) {
  return `<div class="runtime-validation-row">
    <span class="runtime-validation-label">Evidence</span>
    <span class="runtime-validation-value">Runtime validation evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderRuntimeValidationBlocker(blocker) {
  return `<div class="runtime-validation-row">
    <span class="runtime-validation-label">Blocker</span>
    <span class="runtime-validation-value">Runtime validation blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderOperatorRecoveryStep(step) {
  return `<div class="operator-recovery-row">
    <span class="operator-recovery-label">Step</span>
    <span class="operator-recovery-value">Operator recovery step: ${escapeHtml(step.label)} - ${escapeHtml(step.status)} - ${escapeHtml(step.detail)}</span>
  </div>`;
}

function renderOperatorRecoverySignal(signal) {
  return `<div class="operator-recovery-row">
    <span class="operator-recovery-label">Signal</span>
    <span class="operator-recovery-value">Operator recovery signal: ${escapeHtml(signal.label)} - ${escapeHtml(signal.status)} - ${escapeHtml(signal.detail)}</span>
  </div>`;
}

function renderOperatorRecoveryCommand(command) {
  return `<div class="operator-recovery-row">
    <span class="operator-recovery-label">Command</span>
    <span class="operator-recovery-value">Operator recovery command: ${escapeHtml(command)}</span>
  </div>`;
}

function renderOperatorRecoveryEvidence(evidence) {
  return `<div class="operator-recovery-row">
    <span class="operator-recovery-label">Evidence</span>
    <span class="operator-recovery-value">Operator recovery evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderOperatorRecoveryBlocker(blocker) {
  return `<div class="operator-recovery-row">
    <span class="operator-recovery-label">Blocker</span>
    <span class="operator-recovery-value">Operator recovery blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderUsageRow(label, value) {
  return `<div class="usage-row">
          <span class="usage-label">${escapeHtml(label)}</span>
          <span class="usage-value">${escapeHtml(value)}</span>
        </div>`;
}

function renderUsageStep(step) {
  return `<div class="usage-step">
          <span class="usage-step-label">Context Pack usage step: ${escapeHtml(step.label)}</span>
          <span class="usage-step-detail">Context Pack usage detail: ${escapeHtml(step.detail)}</span>
        </div>`;
}

function renderMultiActionRow(label, value) {
  return `<div class="multi-action-row">
          <span class="multi-action-label">${escapeHtml(label)}</span>
          <span class="multi-action-value">${escapeHtml(value)}</span>
        </div>`;
}

function renderReviewResolutionRow(label, value) {
  return `<div class="review-resolution-row">
          <span class="review-resolution-label">${escapeHtml(label)}</span>
          <span class="review-resolution-value">${escapeHtml(value)}</span>
        </div>`;
}

function renderReviewResolutionStep(step) {
  return `<div class="review-resolution-step">
          <span class="review-resolution-step-label">Review resolution step: ${escapeHtml(step.label)} - ${escapeHtml(step.status)}</span>
          <span class="review-resolution-step-detail">Review resolution detail: ${escapeHtml(step.detail)}</span>
        </div>`;
}

function renderAuditEvent(event) {
  return `<div class="audit-row">
          <span class="audit-label">${escapeHtml(event.label)}</span>
          <span class="audit-value">
            <span>Audit event status: ${escapeHtml(event.status)}</span>
            <span>Audit event detail: ${escapeHtml(event.detail)}</span>
          </span>
        </div>`;
}

function renderHandoffRow(label, value) {
  return `<div class="handoff-row">
          <span class="handoff-label">${escapeHtml(label)}</span>
          <span class="handoff-value">${escapeHtml(value)}</span>
        </div>`;
}

function renderCompletedActionIds(actionIds) {
  if (!actionIds?.length) {
    return 'none';
  }

  return actionIds.join(', ');
}

function renderBrowserStateScript(browserStateKey) {
  return createBrowserWorkflowStateAdapterScript({ storageKey: browserStateKey });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
