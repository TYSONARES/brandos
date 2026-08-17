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
    .product-mode-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .product-mode-row {
      align-items: start;
      background: #fbfcfe;
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .product-mode-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .product-mode-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
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
    .workflow-session-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .workflow-session-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .workflow-session-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .workflow-session-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .workflow-transition-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .workflow-transition-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .workflow-transition-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .workflow-transition-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .command-result-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .command-result-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .command-result-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .command-result-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .studio-workflow-runtime-aggregate-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .studio-workflow-runtime-aggregate-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .studio-workflow-runtime-aggregate-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .studio-workflow-runtime-aggregate-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .studio-workflow-runtime-final-closure-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .studio-workflow-runtime-final-closure-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .studio-workflow-runtime-final-closure-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .studio-workflow-runtime-final-closure-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .operator-workflow-map-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-workflow-map-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-workflow-map-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-workflow-map-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .operator-task-selection-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-task-selection-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-task-selection-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-task-selection-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .operator-step-detail-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-step-detail-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-step-detail-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-step-detail-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .operator-handoff-readiness-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-handoff-readiness-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-handoff-readiness-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-handoff-readiness-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .operator-workflow-design-aggregate-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-workflow-design-aggregate-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-workflow-design-aggregate-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-workflow-design-aggregate-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .operator-workflow-design-final-closure-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .operator-workflow-design-final-closure-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .operator-workflow-design-final-closure-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .operator-workflow-design-final-closure-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .repository-branch-status-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .repository-branch-status-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .repository-branch-status-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .repository-branch-status-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .pull-request-readiness-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .pull-request-readiness-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .pull-request-readiness-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .pull-request-readiness-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .review-evidence-summary-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .review-evidence-summary-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .review-evidence-summary-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .review-evidence-summary-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .merge-readiness-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .merge-readiness-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 170px minmax(0, 1fr);
      padding: 8px;
    }
    .merge-readiness-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .merge-readiness-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .repository-collaboration-aggregate-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .repository-collaboration-aggregate-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 190px minmax(0, 1fr);
      padding: 8px;
    }
    .repository-collaboration-aggregate-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .repository-collaboration-aggregate-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .repository-collaboration-final-closure-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .repository-collaboration-final-closure-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 190px minmax(0, 1fr);
      padding: 8px;
    }
    .repository-collaboration-final-closure-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .repository-collaboration-final-closure-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .pull-request-review-package-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .pull-request-review-package-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 190px minmax(0, 1fr);
      padding: 8px;
    }
    .pull-request-review-package-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .pull-request-review-package-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .ci-evidence-summary-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .ci-evidence-summary-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 190px minmax(0, 1fr);
      padding: 8px;
    }
    .ci-evidence-summary-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .ci-evidence-summary-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .main-merge-plan-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .main-merge-plan-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 190px minmax(0, 1fr);
      padding: 8px;
    }
    .main-merge-plan-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .main-merge-plan-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .release-tag-readiness-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .release-tag-readiness-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 190px minmax(0, 1fr);
      padding: 8px;
    }
    .release-tag-readiness-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .release-tag-readiness-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .mainline-aggregate-summary-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .mainline-aggregate-summary-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 190px minmax(0, 1fr);
      padding: 8px;
    }
    .mainline-aggregate-summary-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .mainline-aggregate-summary-value {
      color: var(--text);
      display: grid;
      font-size: 13px;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .mainline-final-closure-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .mainline-final-closure-row {
      align-items: start;
      background: var(--muted);
      border: 1px solid #d7dce3;
      border-radius: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: 190px minmax(0, 1fr);
      padding: 8px;
    }
    .mainline-final-closure-label {
      color: var(--secondary);
      font-size: 12px;
      font-weight: 700;
    }
    .mainline-final-closure-value {
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
      .workflow-session-row,
      .workflow-transition-row,
      .operator-workflow-map-row,
      .operator-task-selection-row,
      .operator-step-detail-row,
      .operator-handoff-readiness-row,
      .operator-workflow-design-aggregate-row,
      .operator-workflow-design-final-closure-row,
      .repository-branch-status-row,
      .pull-request-readiness-row,
      .review-evidence-summary-row,
      .merge-readiness-row,
      .repository-collaboration-aggregate-row,
      .repository-collaboration-final-closure-row,
      .pull-request-review-package-row,
      .ci-evidence-summary-row,
      .main-merge-plan-row,
      .release-tag-readiness-row,
      .mainline-aggregate-summary-row,
      .mainline-final-closure-row,
      .product-mode-row,
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

    <p class="section-title">Studio Product Mode</p>
    <section class="panel" aria-label="Studio Product Mode">
      <h2>${escapeHtml(shell.studioProductMode.title)}</h2>
      <div class="product-mode-list">
        ${renderProductModeRow('Mode', `Product mode: ${shell.studioProductMode.mode}`)}
        ${renderProductModeRow('Status', `Product mode status: ${shell.studioProductMode.status}`)}
        ${renderProductModeRow('Workflow', `Selected product workflow: ${shell.studioProductMode.selectedWorkflow}`)}
        ${renderProductModeRow('Surface', `Primary product surface: ${shell.studioProductMode.primarySurface}`)}
        ${renderProductModeRow('Decision', `Product decision: ${shell.studioProductMode.productDecision}`)}
        ${renderProductModeRow('Readiness', `Product readiness: ${shell.studioProductMode.readiness}`)}
        ${renderProductModeRow('Evidence', `Product evidence: ${shell.studioProductMode.evidence.join(', ')}`)}
        ${renderProductModeRow('Blockers', `Product blockers: ${shell.studioProductMode.blockers.length ? shell.studioProductMode.blockers.join(', ') : 'none'}`)}
        ${renderProductModeRow('Next actions', `Product next actions: ${shell.studioProductMode.nextActions.map((action) => `${action.status} ${action.label}`).join(', ')}`)}
      </div>
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

    <p class="section-title">Workflow Session Summary</p>
    <section class="panel" aria-label="Workflow Session Summary">
      <h2>${escapeHtml(shell.workflowSessionSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Workflow session status: ${shell.workflowSessionSummary.status}`)}
        ${renderGuidanceRow('Ready', `Workflow session ready: ${shell.workflowSessionSummary.sessionReady}`)}
        ${renderGuidanceRow('Workflow', `Workflow session workflow: ${shell.workflowSessionSummary.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Workflow session scenario: ${shell.workflowSessionSummary.scenario}`)}
        ${renderGuidanceRow('Current step', `Workflow session current step: ${shell.workflowSessionSummary.currentStep}`)}
        ${renderGuidanceRow('Action status', `Workflow session action status: ${shell.workflowSessionSummary.actionStatus}`)}
        ${renderGuidanceRow('State source', `Workflow session source: ${shell.workflowSessionSummary.stateSource}`)}
        ${renderGuidanceRow('State status', `Workflow session state status: ${shell.workflowSessionSummary.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Workflow session completed actions: ${shell.workflowSessionSummary.completedActionCount}`)}
        ${renderGuidanceRow('Decision', `Workflow session decision: ${shell.workflowSessionSummary.sessionDecision}`)}
        ${renderGuidanceRow('Summary', `Workflow session summary: ${shell.workflowSessionSummary.sessionSummary}`)}
        ${renderGuidanceRow('Next route', `Workflow session next route: ${shell.workflowSessionSummary.nextRoute}`)}
        ${renderGuidanceRow('Next workflow', `Workflow session next workflow: ${shell.workflowSessionSummary.nextWorkflow}`)}
      </div>
      <div class="workflow-session-list">
        ${shell.workflowSessionSummary.sessionSignals.map(renderWorkflowSessionSignal).join('')}
        ${shell.workflowSessionSummary.requiredEvidence.map(renderWorkflowSessionEvidence).join('')}
        ${shell.workflowSessionSummary.blockers.map(renderWorkflowSessionBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Workflow Transition Plan</p>
    <section class="panel" aria-label="Workflow Transition Plan">
      <h2>${escapeHtml(shell.workflowTransitionPlan.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Workflow transition status: ${shell.workflowTransitionPlan.status}`)}
        ${renderGuidanceRow('Ready', `Workflow transition ready: ${shell.workflowTransitionPlan.transitionReady}`)}
        ${renderGuidanceRow('Workflow', `Workflow transition workflow: ${shell.workflowTransitionPlan.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Workflow transition scenario: ${shell.workflowTransitionPlan.scenario}`)}
        ${renderGuidanceRow('Current step', `Workflow transition current step: ${shell.workflowTransitionPlan.currentStep}`)}
        ${renderGuidanceRow('From route', `Workflow transition from route: ${shell.workflowTransitionPlan.fromRoute}`)}
        ${renderGuidanceRow('To route', `Workflow transition to route: ${shell.workflowTransitionPlan.toRoute}`)}
        ${renderGuidanceRow('State source', `Workflow transition source: ${shell.workflowTransitionPlan.stateSource}`)}
        ${renderGuidanceRow('State status', `Workflow transition state status: ${shell.workflowTransitionPlan.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Workflow transition completed actions: ${shell.workflowTransitionPlan.completedActionCount}`)}
        ${renderGuidanceRow('Decision', `Workflow transition decision: ${shell.workflowTransitionPlan.transitionDecision}`)}
        ${renderGuidanceRow('Summary', `Workflow transition summary: ${shell.workflowTransitionPlan.transitionSummary}`)}
        ${renderGuidanceRow('Next workflow', `Workflow transition next workflow: ${shell.workflowTransitionPlan.nextWorkflow}`)}
      </div>
      <div class="workflow-transition-list">
        ${shell.workflowTransitionPlan.transitionSteps.map(renderWorkflowTransitionStep).join('')}
        ${shell.workflowTransitionPlan.transitionSignals.map(renderWorkflowTransitionSignal).join('')}
        ${shell.workflowTransitionPlan.requiredEvidence.map(renderWorkflowTransitionEvidence).join('')}
        ${shell.workflowTransitionPlan.blockers.map(renderWorkflowTransitionBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Command Result Summary</p>
    <section class="panel" aria-label="Command Result Summary">
      <h2>${escapeHtml(shell.commandResultSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Command result status: ${shell.commandResultSummary.status}`)}
        ${renderGuidanceRow('Complete', `Command result complete: ${shell.commandResultSummary.commandComplete}`)}
        ${renderGuidanceRow('Workflow', `Command result workflow: ${shell.commandResultSummary.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Command result scenario: ${shell.commandResultSummary.scenario}`)}
        ${renderGuidanceRow('From route', `Command result from route: ${shell.commandResultSummary.fromRoute}`)}
        ${renderGuidanceRow('To route', `Command result to route: ${shell.commandResultSummary.toRoute}`)}
        ${renderGuidanceRow('State source', `Command result source: ${shell.commandResultSummary.stateSource}`)}
        ${renderGuidanceRow('State status', `Command result state status: ${shell.commandResultSummary.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Command result completed actions: ${shell.commandResultSummary.completedActionCount}`)}
        ${renderGuidanceRow('Decision', `Command result decision: ${shell.commandResultSummary.commandDecision}`)}
        ${renderGuidanceRow('Summary', `Command result summary: ${shell.commandResultSummary.commandSummary}`)}
        ${renderGuidanceRow('Next workflow', `Command result next workflow: ${shell.commandResultSummary.nextWorkflow}`)}
      </div>
      <div class="command-result-list">
        ${shell.commandResultSummary.commandResults.map(renderCommandResultItem).join('')}
        ${shell.commandResultSummary.transitionSignals.map(renderCommandResultSignal).join('')}
        ${shell.commandResultSummary.requiredEvidence.map(renderCommandResultEvidence).join('')}
        ${shell.commandResultSummary.blockers.map(renderCommandResultBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Studio Workflow Runtime Aggregate Summary</p>
    <section class="panel" aria-label="Studio Workflow Runtime Aggregate Summary">
      <h2>${escapeHtml(shell.studioWorkflowRuntimeAggregateSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Studio workflow runtime aggregate status: ${shell.studioWorkflowRuntimeAggregateSummary.status}`)}
        ${renderGuidanceRow('Ready', `Studio workflow runtime aggregate ready: ${shell.studioWorkflowRuntimeAggregateSummary.aggregateReady}`)}
        ${renderGuidanceRow('Workflow', `Studio workflow runtime aggregate workflow: ${shell.studioWorkflowRuntimeAggregateSummary.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Studio workflow runtime aggregate scenario: ${shell.studioWorkflowRuntimeAggregateSummary.scenario}`)}
        ${renderGuidanceRow('State source', `Studio workflow runtime aggregate source: ${shell.studioWorkflowRuntimeAggregateSummary.stateSource}`)}
        ${renderGuidanceRow('State status', `Studio workflow runtime aggregate state status: ${shell.studioWorkflowRuntimeAggregateSummary.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Studio workflow runtime aggregate completed actions: ${shell.studioWorkflowRuntimeAggregateSummary.completedActionCount}`)}
        ${renderGuidanceRow('Commands', `Studio workflow runtime aggregate commands: ${shell.studioWorkflowRuntimeAggregateSummary.completeCommandCount}/${shell.studioWorkflowRuntimeAggregateSummary.commandCount}`)}
        ${renderGuidanceRow('Blocked commands', `Studio workflow runtime aggregate blocked commands: ${shell.studioWorkflowRuntimeAggregateSummary.blockedCommandCount}`)}
        ${renderGuidanceRow('Decision', `Studio workflow runtime aggregate decision: ${shell.studioWorkflowRuntimeAggregateSummary.aggregateDecision}`)}
        ${renderGuidanceRow('Summary', `Studio workflow runtime aggregate summary: ${shell.studioWorkflowRuntimeAggregateSummary.aggregateSummary}`)}
        ${renderGuidanceRow('Next workflow', `Studio workflow runtime aggregate next workflow: ${shell.studioWorkflowRuntimeAggregateSummary.nextWorkflow}`)}
      </div>
      <div class="studio-workflow-runtime-aggregate-list">
        ${shell.studioWorkflowRuntimeAggregateSummary.commandItems.map(renderStudioWorkflowRuntimeAggregateItem).join('')}
        ${shell.studioWorkflowRuntimeAggregateSummary.requiredEvidence.map(renderStudioWorkflowRuntimeAggregateEvidence).join('')}
        ${shell.studioWorkflowRuntimeAggregateSummary.blockers.map(renderStudioWorkflowRuntimeAggregateBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Studio Workflow Runtime Final Closure</p>
    <section class="panel" aria-label="Studio Workflow Runtime Final Closure">
      <h2>${escapeHtml(shell.studioWorkflowRuntimeFinalClosure.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Studio workflow runtime final closure status: ${shell.studioWorkflowRuntimeFinalClosure.status}`)}
        ${renderGuidanceRow('Closed', `Studio workflow runtime final closure closed: ${shell.studioWorkflowRuntimeFinalClosure.closed}`)}
        ${renderGuidanceRow('Workflow', `Studio workflow runtime final closure workflow: ${shell.studioWorkflowRuntimeFinalClosure.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Studio workflow runtime final closure scenario: ${shell.studioWorkflowRuntimeFinalClosure.scenario}`)}
        ${renderGuidanceRow('State source', `Studio workflow runtime final closure source: ${shell.studioWorkflowRuntimeFinalClosure.stateSource}`)}
        ${renderGuidanceRow('State status', `Studio workflow runtime final closure state status: ${shell.studioWorkflowRuntimeFinalClosure.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Studio workflow runtime final closure completed actions: ${shell.studioWorkflowRuntimeFinalClosure.completedActionCount}`)}
        ${renderGuidanceRow('Decision', `Studio workflow runtime final closure decision: ${shell.studioWorkflowRuntimeFinalClosure.closureDecision}`)}
        ${renderGuidanceRow('Summary', `Studio workflow runtime final closure summary: ${shell.studioWorkflowRuntimeFinalClosure.closureSummary}`)}
        ${renderGuidanceRow('Next workflow', `Studio workflow runtime final closure next workflow: ${shell.studioWorkflowRuntimeFinalClosure.nextWorkflow}`)}
      </div>
      <div class="studio-workflow-runtime-final-closure-list">
        ${shell.studioWorkflowRuntimeFinalClosure.releaseArtifacts.map(renderStudioWorkflowRuntimeFinalClosureArtifact).join('')}
        ${shell.studioWorkflowRuntimeFinalClosure.closureEvidence.map(renderStudioWorkflowRuntimeFinalClosureEvidence).join('')}
        ${shell.studioWorkflowRuntimeFinalClosure.closureChecks.map(renderStudioWorkflowRuntimeFinalClosureCheck).join('')}
        ${shell.studioWorkflowRuntimeFinalClosure.blockers.map(renderStudioWorkflowRuntimeFinalClosureBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Operator Workflow Map</p>
    <section class="panel" aria-label="Operator Workflow Map">
      <h2>${escapeHtml(shell.operatorWorkflowMap.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator workflow map status: ${shell.operatorWorkflowMap.status}`)}
        ${renderGuidanceRow('Ready', `Operator workflow map ready: ${shell.operatorWorkflowMap.mapReady}`)}
        ${renderGuidanceRow('Workflow', `Operator workflow map workflow: ${shell.operatorWorkflowMap.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Operator workflow map scenario: ${shell.operatorWorkflowMap.scenario}`)}
        ${renderGuidanceRow('State source', `Operator workflow map source: ${shell.operatorWorkflowMap.stateSource}`)}
        ${renderGuidanceRow('State status', `Operator workflow map state status: ${shell.operatorWorkflowMap.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Operator workflow map completed actions: ${shell.operatorWorkflowMap.completedActionCount}`)}
        ${renderGuidanceRow('Active path', `Operator workflow map active path: ${shell.operatorWorkflowMap.activePath}`)}
        ${renderGuidanceRow('Paths', `Operator workflow map paths: ${shell.operatorWorkflowMap.readyPathCount}/${shell.operatorWorkflowMap.pathCount}`)}
        ${renderGuidanceRow('Blocked paths', `Operator workflow map blocked paths: ${shell.operatorWorkflowMap.blockedPathCount}`)}
        ${renderGuidanceRow('Decision', `Operator workflow map decision: ${shell.operatorWorkflowMap.mapDecision}`)}
        ${renderGuidanceRow('Summary', `Operator workflow map summary: ${shell.operatorWorkflowMap.mapSummary}`)}
        ${renderGuidanceRow('Next workflow', `Operator workflow map next workflow: ${shell.operatorWorkflowMap.nextWorkflow}`)}
      </div>
      <div class="operator-workflow-map-list">
        ${shell.operatorWorkflowMap.workflowPaths.map(renderOperatorWorkflowMapPath).join('')}
        ${shell.operatorWorkflowMap.requiredEvidence.map(renderOperatorWorkflowMapEvidence).join('')}
        ${shell.operatorWorkflowMap.blockers.map(renderOperatorWorkflowMapBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Operator Task Selection</p>
    <section class="panel" aria-label="Operator Task Selection">
      <h2>${escapeHtml(shell.operatorTaskSelection.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator task selection status: ${shell.operatorTaskSelection.status}`)}
        ${renderGuidanceRow('Ready', `Operator task selection ready: ${shell.operatorTaskSelection.selectionReady}`)}
        ${renderGuidanceRow('Workflow', `Operator task selection workflow: ${shell.operatorTaskSelection.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Operator task selection scenario: ${shell.operatorTaskSelection.scenario}`)}
        ${renderGuidanceRow('State source', `Operator task selection source: ${shell.operatorTaskSelection.stateSource}`)}
        ${renderGuidanceRow('State status', `Operator task selection state status: ${shell.operatorTaskSelection.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Operator task selection completed actions: ${shell.operatorTaskSelection.completedActionCount}`)}
        ${renderGuidanceRow('Selected task', `Operator task selection selected task: ${shell.operatorTaskSelection.selectedTask}`)}
        ${renderGuidanceRow('Selected workflow', `Operator task selection selected workflow: ${shell.operatorTaskSelection.selectedWorkflow}`)}
        ${renderGuidanceRow('Tasks', `Operator task selection tasks: ${shell.operatorTaskSelection.availableTaskCount}/${shell.operatorTaskSelection.taskCount}`)}
        ${renderGuidanceRow('Blocked tasks', `Operator task selection blocked tasks: ${shell.operatorTaskSelection.blockedTaskCount}`)}
        ${renderGuidanceRow('Decision', `Operator task selection decision: ${shell.operatorTaskSelection.selectionDecision}`)}
        ${renderGuidanceRow('Summary', `Operator task selection summary: ${shell.operatorTaskSelection.selectionSummary}`)}
        ${renderGuidanceRow('Next workflow', `Operator task selection next workflow: ${shell.operatorTaskSelection.nextWorkflow}`)}
      </div>
      <div class="operator-task-selection-list">
        ${shell.operatorTaskSelection.taskOptions.map(renderOperatorTaskSelectionOption).join('')}
        ${shell.operatorTaskSelection.requiredEvidence.map(renderOperatorTaskSelectionEvidence).join('')}
        ${shell.operatorTaskSelection.blockers.map(renderOperatorTaskSelectionBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Operator Step Detail</p>
    <section class="panel" aria-label="Operator Step Detail">
      <h2>${escapeHtml(shell.operatorStepDetail.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator step detail status: ${shell.operatorStepDetail.status}`)}
        ${renderGuidanceRow('Ready', `Operator step detail ready: ${shell.operatorStepDetail.detailReady}`)}
        ${renderGuidanceRow('Workflow', `Operator step detail workflow: ${shell.operatorStepDetail.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Operator step detail scenario: ${shell.operatorStepDetail.scenario}`)}
        ${renderGuidanceRow('State source', `Operator step detail source: ${shell.operatorStepDetail.stateSource}`)}
        ${renderGuidanceRow('State status', `Operator step detail state status: ${shell.operatorStepDetail.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Operator step detail completed actions: ${shell.operatorStepDetail.completedActionCount}`)}
        ${renderGuidanceRow('Selected task', `Operator step detail selected task: ${shell.operatorStepDetail.selectedTask}`)}
        ${renderGuidanceRow('Selected workflow', `Operator step detail selected workflow: ${shell.operatorStepDetail.selectedWorkflow}`)}
        ${renderGuidanceRow('Active step', `Operator step detail active step: ${shell.operatorStepDetail.activeStep}`)}
        ${renderGuidanceRow('Owner', `Operator step detail owner: ${shell.operatorStepDetail.stepOwner}`)}
        ${renderGuidanceRow('Command', `Operator step detail command: ${shell.operatorStepDetail.stepCommand}`)}
        ${renderGuidanceRow('Outcome', `Operator step detail outcome: ${shell.operatorStepDetail.stepOutcome}`)}
        ${renderGuidanceRow('Steps', `Operator step detail steps: ${shell.operatorStepDetail.readyStepCount}/${shell.operatorStepDetail.stepCount}`)}
        ${renderGuidanceRow('Blocked steps', `Operator step detail blocked steps: ${shell.operatorStepDetail.blockedStepCount}`)}
        ${renderGuidanceRow('Decision', `Operator step detail decision: ${shell.operatorStepDetail.detailDecision}`)}
        ${renderGuidanceRow('Summary', `Operator step detail summary: ${shell.operatorStepDetail.detailSummary}`)}
        ${renderGuidanceRow('Next workflow', `Operator step detail next workflow: ${shell.operatorStepDetail.nextWorkflow}`)}
      </div>
      <div class="operator-step-detail-list">
        ${shell.operatorStepDetail.stepDetails.map(renderOperatorStepDetailStep).join('')}
        ${shell.operatorStepDetail.requiredEvidence.map(renderOperatorStepDetailEvidence).join('')}
        ${shell.operatorStepDetail.blockers.map(renderOperatorStepDetailBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Operator Handoff Readiness</p>
    <section class="panel" aria-label="Operator Handoff Readiness">
      <h2>${escapeHtml(shell.operatorHandoffReadiness.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator handoff readiness status: ${shell.operatorHandoffReadiness.status}`)}
        ${renderGuidanceRow('Ready', `Operator handoff readiness ready: ${shell.operatorHandoffReadiness.handoffReady}`)}
        ${renderGuidanceRow('Workflow', `Operator handoff readiness workflow: ${shell.operatorHandoffReadiness.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Operator handoff readiness scenario: ${shell.operatorHandoffReadiness.scenario}`)}
        ${renderGuidanceRow('State source', `Operator handoff readiness source: ${shell.operatorHandoffReadiness.stateSource}`)}
        ${renderGuidanceRow('State status', `Operator handoff readiness state status: ${shell.operatorHandoffReadiness.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Operator handoff readiness completed actions: ${shell.operatorHandoffReadiness.completedActionCount}`)}
        ${renderGuidanceRow('Selected task', `Operator handoff readiness selected task: ${shell.operatorHandoffReadiness.selectedTask}`)}
        ${renderGuidanceRow('Selected workflow', `Operator handoff readiness selected workflow: ${shell.operatorHandoffReadiness.selectedWorkflow}`)}
        ${renderGuidanceRow('Active step', `Operator handoff readiness active step: ${shell.operatorHandoffReadiness.activeStep}`)}
        ${renderGuidanceRow('Target', `Operator handoff readiness target: ${shell.operatorHandoffReadiness.handoffTarget}`)}
        ${renderGuidanceRow('Mode', `Operator handoff readiness mode: ${shell.operatorHandoffReadiness.handoffMode}`)}
        ${renderGuidanceRow('Command', `Operator handoff readiness command: ${shell.operatorHandoffReadiness.handoffCommand}`)}
        ${renderGuidanceRow('Outcome', `Operator handoff readiness outcome: ${shell.operatorHandoffReadiness.handoffOutcome}`)}
        ${renderGuidanceRow('Checks', `Operator handoff readiness checks: ${shell.operatorHandoffReadiness.passedCheckCount}/${shell.operatorHandoffReadiness.checkCount}`)}
        ${renderGuidanceRow('Blocked checks', `Operator handoff readiness blocked checks: ${shell.operatorHandoffReadiness.blockedCheckCount}`)}
        ${renderGuidanceRow('Decision', `Operator handoff readiness decision: ${shell.operatorHandoffReadiness.handoffDecision}`)}
        ${renderGuidanceRow('Summary', `Operator handoff readiness summary: ${shell.operatorHandoffReadiness.handoffSummary}`)}
        ${renderGuidanceRow('Next workflow', `Operator handoff readiness next workflow: ${shell.operatorHandoffReadiness.nextWorkflow}`)}
      </div>
      <div class="operator-handoff-readiness-list">
        ${shell.operatorHandoffReadiness.handoffChecks.map(renderOperatorHandoffReadinessCheck).join('')}
        ${shell.operatorHandoffReadiness.requiredEvidence.map(renderOperatorHandoffReadinessEvidence).join('')}
        ${shell.operatorHandoffReadiness.blockers.map(renderOperatorHandoffReadinessBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Operator Workflow Design Aggregate Summary</p>
    <section class="panel" aria-label="Operator Workflow Design Aggregate Summary">
      <h2>${escapeHtml(shell.operatorWorkflowDesignAggregateSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator workflow design aggregate status: ${shell.operatorWorkflowDesignAggregateSummary.status}`)}
        ${renderGuidanceRow('Ready', `Operator workflow design aggregate ready: ${shell.operatorWorkflowDesignAggregateSummary.aggregateReady}`)}
        ${renderGuidanceRow('Workflow', `Operator workflow design aggregate workflow: ${shell.operatorWorkflowDesignAggregateSummary.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Operator workflow design aggregate scenario: ${shell.operatorWorkflowDesignAggregateSummary.scenario}`)}
        ${renderGuidanceRow('State source', `Operator workflow design aggregate source: ${shell.operatorWorkflowDesignAggregateSummary.stateSource}`)}
        ${renderGuidanceRow('State status', `Operator workflow design aggregate state status: ${shell.operatorWorkflowDesignAggregateSummary.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Operator workflow design aggregate completed actions: ${shell.operatorWorkflowDesignAggregateSummary.completedActionCount}`)}
        ${renderGuidanceRow('Selected task', `Operator workflow design aggregate selected task: ${shell.operatorWorkflowDesignAggregateSummary.selectedTask}`)}
        ${renderGuidanceRow('Selected workflow', `Operator workflow design aggregate selected workflow: ${shell.operatorWorkflowDesignAggregateSummary.selectedWorkflow}`)}
        ${renderGuidanceRow('Handoff target', `Operator workflow design aggregate handoff target: ${shell.operatorWorkflowDesignAggregateSummary.handoffTarget}`)}
        ${renderGuidanceRow('Workflows', `Operator workflow design aggregate workflows: ${shell.operatorWorkflowDesignAggregateSummary.readyWorkflowCount}/${shell.operatorWorkflowDesignAggregateSummary.workflowCount}`)}
        ${renderGuidanceRow('Blocked workflows', `Operator workflow design aggregate blocked workflows: ${shell.operatorWorkflowDesignAggregateSummary.blockedWorkflowCount}`)}
        ${renderGuidanceRow('Decision', `Operator workflow design aggregate decision: ${shell.operatorWorkflowDesignAggregateSummary.aggregateDecision}`)}
        ${renderGuidanceRow('Summary', `Operator workflow design aggregate summary: ${shell.operatorWorkflowDesignAggregateSummary.aggregateSummary}`)}
        ${renderGuidanceRow('Next workflow', `Operator workflow design aggregate next workflow: ${shell.operatorWorkflowDesignAggregateSummary.nextWorkflow}`)}
      </div>
      <div class="operator-workflow-design-aggregate-list">
        ${shell.operatorWorkflowDesignAggregateSummary.workflowItems.map(renderOperatorWorkflowDesignAggregateItem).join('')}
        ${shell.operatorWorkflowDesignAggregateSummary.requiredEvidence.map(renderOperatorWorkflowDesignAggregateEvidence).join('')}
        ${shell.operatorWorkflowDesignAggregateSummary.blockers.map(renderOperatorWorkflowDesignAggregateBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Operator Workflow Design Final Closure</p>
    <section class="panel" aria-label="Operator Workflow Design Final Closure">
      <h2>${escapeHtml(shell.operatorWorkflowDesignFinalClosure.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator workflow design final closure status: ${shell.operatorWorkflowDesignFinalClosure.status}`)}
        ${renderGuidanceRow('Closed', `Operator workflow design final closure closed: ${shell.operatorWorkflowDesignFinalClosure.closed}`)}
        ${renderGuidanceRow('Workflow', `Operator workflow design final closure workflow: ${shell.operatorWorkflowDesignFinalClosure.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Operator workflow design final closure scenario: ${shell.operatorWorkflowDesignFinalClosure.scenario}`)}
        ${renderGuidanceRow('State source', `Operator workflow design final closure source: ${shell.operatorWorkflowDesignFinalClosure.stateSource}`)}
        ${renderGuidanceRow('State status', `Operator workflow design final closure state status: ${shell.operatorWorkflowDesignFinalClosure.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Operator workflow design final closure completed actions: ${shell.operatorWorkflowDesignFinalClosure.completedActionCount}`)}
        ${renderGuidanceRow('Selected task', `Operator workflow design final closure selected task: ${shell.operatorWorkflowDesignFinalClosure.selectedTask}`)}
        ${renderGuidanceRow('Selected workflow', `Operator workflow design final closure selected workflow: ${shell.operatorWorkflowDesignFinalClosure.selectedWorkflow}`)}
        ${renderGuidanceRow('Handoff target', `Operator workflow design final closure handoff target: ${shell.operatorWorkflowDesignFinalClosure.handoffTarget}`)}
        ${renderGuidanceRow('Decision', `Operator workflow design final closure decision: ${shell.operatorWorkflowDesignFinalClosure.closureDecision}`)}
        ${renderGuidanceRow('Summary', `Operator workflow design final closure summary: ${shell.operatorWorkflowDesignFinalClosure.closureSummary}`)}
        ${renderGuidanceRow('Next workflow', `Operator workflow design final closure next workflow: ${shell.operatorWorkflowDesignFinalClosure.nextWorkflow}`)}
      </div>
      <div class="operator-workflow-design-final-closure-list">
        ${shell.operatorWorkflowDesignFinalClosure.releaseArtifacts.map(renderOperatorWorkflowDesignFinalClosureArtifact).join('')}
        ${shell.operatorWorkflowDesignFinalClosure.closureEvidence.map(renderOperatorWorkflowDesignFinalClosureEvidence).join('')}
        ${shell.operatorWorkflowDesignFinalClosure.closureChecks.map(renderOperatorWorkflowDesignFinalClosureCheck).join('')}
        ${shell.operatorWorkflowDesignFinalClosure.blockers.map(renderOperatorWorkflowDesignFinalClosureBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Repository Branch Status</p>
    <section class="panel" aria-label="Repository Branch Status">
      <h2>${escapeHtml(shell.repositoryBranchStatus.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Repository branch status: ${shell.repositoryBranchStatus.status}`)}
        ${renderGuidanceRow('Ready', `Repository branch ready: ${shell.repositoryBranchStatus.branchReady}`)}
        ${renderGuidanceRow('Workflow', `Repository branch workflow: ${shell.repositoryBranchStatus.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Repository branch scenario: ${shell.repositoryBranchStatus.scenario}`)}
        ${renderGuidanceRow('State source', `Repository branch source: ${shell.repositoryBranchStatus.stateSource}`)}
        ${renderGuidanceRow('State status', `Repository branch state status: ${shell.repositoryBranchStatus.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Repository branch completed actions: ${shell.repositoryBranchStatus.completedActionCount}`)}
        ${renderGuidanceRow('Local branch', `Repository branch local: ${shell.repositoryBranchStatus.localBranch}`)}
        ${renderGuidanceRow('Remote branch', `Repository branch remote: ${shell.repositoryBranchStatus.remoteBranch}`)}
        ${renderGuidanceRow('Main branch', `Repository branch main: ${shell.repositoryBranchStatus.mainBranch}`)}
        ${renderGuidanceRow('Sync status', `Repository branch sync: ${shell.repositoryBranchStatus.syncStatus}`)}
        ${renderGuidanceRow('Working tree', `Repository branch working tree: ${shell.repositoryBranchStatus.workingTreeStatus}`)}
        ${renderGuidanceRow('Branches', `Repository branch branches: ${shell.repositoryBranchStatus.readyBranchCount}/${shell.repositoryBranchStatus.branchCount}`)}
        ${renderGuidanceRow('Blocked branches', `Repository branch blocked branches: ${shell.repositoryBranchStatus.blockedBranchCount}`)}
        ${renderGuidanceRow('Decision', `Repository branch decision: ${shell.repositoryBranchStatus.branchDecision}`)}
        ${renderGuidanceRow('Summary', `Repository branch summary: ${shell.repositoryBranchStatus.branchSummary}`)}
        ${renderGuidanceRow('Next workflow', `Repository branch next workflow: ${shell.repositoryBranchStatus.nextWorkflow}`)}
      </div>
      <div class="repository-branch-status-list">
        ${shell.repositoryBranchStatus.branchItems.map(renderRepositoryBranchStatusItem).join('')}
        ${shell.repositoryBranchStatus.requiredEvidence.map(renderRepositoryBranchStatusEvidence).join('')}
        ${shell.repositoryBranchStatus.blockers.map(renderRepositoryBranchStatusBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Pull Request Readiness</p>
    <section class="panel" aria-label="Pull Request Readiness">
      <h2>${escapeHtml(shell.pullRequestReadiness.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Pull request readiness status: ${shell.pullRequestReadiness.status}`)}
        ${renderGuidanceRow('Ready', `Pull request ready: ${shell.pullRequestReadiness.prReady}`)}
        ${renderGuidanceRow('Workflow', `Pull request workflow: ${shell.pullRequestReadiness.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Pull request scenario: ${shell.pullRequestReadiness.scenario}`)}
        ${renderGuidanceRow('State source', `Pull request source: ${shell.pullRequestReadiness.stateSource}`)}
        ${renderGuidanceRow('State status', `Pull request state status: ${shell.pullRequestReadiness.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Pull request completed actions: ${shell.pullRequestReadiness.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Pull request title: ${shell.pullRequestReadiness.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Pull request source branch: ${shell.pullRequestReadiness.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Pull request target branch: ${shell.pullRequestReadiness.pullRequestTarget}`)}
        ${renderGuidanceRow('Remote branch', `Pull request remote branch: ${shell.pullRequestReadiness.remoteBranch}`)}
        ${renderGuidanceRow('Review mode', `Pull request review mode: ${shell.pullRequestReadiness.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Pull request merge policy: ${shell.pullRequestReadiness.mergePolicy}`)}
        ${renderGuidanceRow('Checks', `Pull request checks: ${shell.pullRequestReadiness.passedCheckCount}/${shell.pullRequestReadiness.checkCount}`)}
        ${renderGuidanceRow('Blocked checks', `Pull request blocked checks: ${shell.pullRequestReadiness.blockedCheckCount}`)}
        ${renderGuidanceRow('Decision', `Pull request decision: ${shell.pullRequestReadiness.readinessDecision}`)}
        ${renderGuidanceRow('Summary', `Pull request summary: ${shell.pullRequestReadiness.readinessSummary}`)}
        ${renderGuidanceRow('Next workflow', `Pull request next workflow: ${shell.pullRequestReadiness.nextWorkflow}`)}
      </div>
      <div class="pull-request-readiness-list">
        ${shell.pullRequestReadiness.readinessChecks.map(renderPullRequestReadinessCheck).join('')}
        ${shell.pullRequestReadiness.requiredEvidence.map(renderPullRequestReadinessEvidence).join('')}
        ${shell.pullRequestReadiness.blockers.map(renderPullRequestReadinessBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Review Evidence Summary</p>
    <section class="panel" aria-label="Review Evidence Summary">
      <h2>${escapeHtml(shell.reviewEvidenceSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Review evidence status: ${shell.reviewEvidenceSummary.status}`)}
        ${renderGuidanceRow('Ready', `Review evidence ready: ${shell.reviewEvidenceSummary.evidenceReady}`)}
        ${renderGuidanceRow('Workflow', `Review evidence workflow: ${shell.reviewEvidenceSummary.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Review evidence scenario: ${shell.reviewEvidenceSummary.scenario}`)}
        ${renderGuidanceRow('State source', `Review evidence source: ${shell.reviewEvidenceSummary.stateSource}`)}
        ${renderGuidanceRow('State status', `Review evidence state status: ${shell.reviewEvidenceSummary.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Review evidence completed actions: ${shell.reviewEvidenceSummary.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Review evidence pull request title: ${shell.reviewEvidenceSummary.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Review evidence source branch: ${shell.reviewEvidenceSummary.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Review evidence target branch: ${shell.reviewEvidenceSummary.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `Review evidence review mode: ${shell.reviewEvidenceSummary.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Review evidence merge policy: ${shell.reviewEvidenceSummary.mergePolicy}`)}
        ${renderGuidanceRow('Release notes', `Review evidence release notes: ${shell.reviewEvidenceSummary.releaseNotesStatus}`)}
        ${renderGuidanceRow('Closure evidence', `Review evidence closure evidence: ${shell.reviewEvidenceSummary.closureEvidenceStatus}`)}
        ${renderGuidanceRow('Evidence', `Review evidence items: ${shell.reviewEvidenceSummary.readyEvidenceCount}/${shell.reviewEvidenceSummary.evidenceCount}`)}
        ${renderGuidanceRow('Blocked evidence', `Review evidence blocked items: ${shell.reviewEvidenceSummary.blockedEvidenceCount}`)}
        ${renderGuidanceRow('Unresolved blockers', `Review evidence unresolved blockers: ${shell.reviewEvidenceSummary.unresolvedBlockerCount}`)}
        ${renderGuidanceRow('Decision', `Review evidence decision: ${shell.reviewEvidenceSummary.evidenceDecision}`)}
        ${renderGuidanceRow('Summary', `Review evidence summary: ${shell.reviewEvidenceSummary.evidenceSummary}`)}
        ${renderGuidanceRow('Next workflow', `Review evidence next workflow: ${shell.reviewEvidenceSummary.nextWorkflow}`)}
      </div>
      <div class="review-evidence-summary-list">
        ${shell.reviewEvidenceSummary.evidenceItems.map(renderReviewEvidenceSummaryItem).join('')}
        ${shell.reviewEvidenceSummary.requiredEvidence.map(renderReviewEvidenceSummaryEvidence).join('')}
        ${shell.reviewEvidenceSummary.blockers.map(renderReviewEvidenceSummaryBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Merge Readiness</p>
    <section class="panel" aria-label="Merge Readiness">
      <h2>${escapeHtml(shell.mergeReadiness.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Merge readiness status: ${shell.mergeReadiness.status}`)}
        ${renderGuidanceRow('Ready', `Merge readiness ready: ${shell.mergeReadiness.mergeReady}`)}
        ${renderGuidanceRow('Workflow', `Merge readiness workflow: ${shell.mergeReadiness.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Merge readiness scenario: ${shell.mergeReadiness.scenario}`)}
        ${renderGuidanceRow('State source', `Merge readiness source: ${shell.mergeReadiness.stateSource}`)}
        ${renderGuidanceRow('State status', `Merge readiness state status: ${shell.mergeReadiness.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Merge readiness completed actions: ${shell.mergeReadiness.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Merge readiness pull request title: ${shell.mergeReadiness.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Merge readiness source branch: ${shell.mergeReadiness.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Merge readiness target branch: ${shell.mergeReadiness.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `Merge readiness review mode: ${shell.mergeReadiness.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Merge readiness merge policy: ${shell.mergeReadiness.mergePolicy}`)}
        ${renderGuidanceRow('Main branch', `Merge readiness main branch: ${shell.mergeReadiness.mainBranchStatus}`)}
        ${renderGuidanceRow('Review evidence', `Merge readiness review evidence: ${shell.mergeReadiness.reviewEvidenceStatus}`)}
        ${renderGuidanceRow('Release evidence', `Merge readiness release evidence: ${shell.mergeReadiness.releaseEvidenceStatus}`)}
        ${renderGuidanceRow('Merge window', `Merge readiness merge window: ${shell.mergeReadiness.mergeWindowStatus}`)}
        ${renderGuidanceRow('Checks', `Merge readiness checks: ${shell.mergeReadiness.passedCheckCount}/${shell.mergeReadiness.checkCount}`)}
        ${renderGuidanceRow('Blocked checks', `Merge readiness blocked checks: ${shell.mergeReadiness.blockedCheckCount}`)}
        ${renderGuidanceRow('Blockers', `Merge readiness blockers: ${shell.mergeReadiness.blockerCount}`)}
        ${renderGuidanceRow('Decision', `Merge readiness decision: ${shell.mergeReadiness.mergeDecision}`)}
        ${renderGuidanceRow('Summary', `Merge readiness summary: ${shell.mergeReadiness.mergeSummary}`)}
        ${renderGuidanceRow('Next workflow', `Merge readiness next workflow: ${shell.mergeReadiness.nextWorkflow}`)}
      </div>
      <div class="merge-readiness-list">
        ${shell.mergeReadiness.mergeChecks.map(renderMergeReadinessCheck).join('')}
        ${shell.mergeReadiness.requiredEvidence.map(renderMergeReadinessEvidence).join('')}
        ${shell.mergeReadiness.blockers.map(renderMergeReadinessBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Repository Collaboration Aggregate Summary</p>
    <section class="panel" aria-label="Repository Collaboration Aggregate Summary">
      <h2>${escapeHtml(shell.repositoryCollaborationAggregateSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Repository collaboration aggregate status: ${shell.repositoryCollaborationAggregateSummary.status}`)}
        ${renderGuidanceRow('Ready', `Repository collaboration aggregate ready: ${shell.repositoryCollaborationAggregateSummary.aggregateReady}`)}
        ${renderGuidanceRow('Workflow', `Repository collaboration aggregate workflow: ${shell.repositoryCollaborationAggregateSummary.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Repository collaboration aggregate scenario: ${shell.repositoryCollaborationAggregateSummary.scenario}`)}
        ${renderGuidanceRow('State source', `Repository collaboration aggregate source: ${shell.repositoryCollaborationAggregateSummary.stateSource}`)}
        ${renderGuidanceRow('State status', `Repository collaboration aggregate state status: ${shell.repositoryCollaborationAggregateSummary.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Repository collaboration aggregate completed actions: ${shell.repositoryCollaborationAggregateSummary.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Repository collaboration aggregate pull request title: ${shell.repositoryCollaborationAggregateSummary.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Repository collaboration aggregate source branch: ${shell.repositoryCollaborationAggregateSummary.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Repository collaboration aggregate target branch: ${shell.repositoryCollaborationAggregateSummary.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `Repository collaboration aggregate review mode: ${shell.repositoryCollaborationAggregateSummary.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Repository collaboration aggregate merge policy: ${shell.repositoryCollaborationAggregateSummary.mergePolicy}`)}
        ${renderGuidanceRow('Main branch', `Repository collaboration aggregate main branch: ${shell.repositoryCollaborationAggregateSummary.mainBranchStatus}`)}
        ${renderGuidanceRow('Merge window', `Repository collaboration aggregate merge window: ${shell.repositoryCollaborationAggregateSummary.mergeWindowStatus}`)}
        ${renderGuidanceRow('Workflows', `Repository collaboration aggregate workflows: ${shell.repositoryCollaborationAggregateSummary.readyWorkflowCount}/${shell.repositoryCollaborationAggregateSummary.workflowCount}`)}
        ${renderGuidanceRow('Blocked workflows', `Repository collaboration aggregate blocked workflows: ${shell.repositoryCollaborationAggregateSummary.blockedWorkflowCount}`)}
        ${renderGuidanceRow('Blockers', `Repository collaboration aggregate blockers: ${shell.repositoryCollaborationAggregateSummary.blockerCount}`)}
        ${renderGuidanceRow('Decision', `Repository collaboration aggregate decision: ${shell.repositoryCollaborationAggregateSummary.aggregateDecision}`)}
        ${renderGuidanceRow('Summary', `Repository collaboration aggregate summary: ${shell.repositoryCollaborationAggregateSummary.aggregateSummary}`)}
        ${renderGuidanceRow('Next workflow', `Repository collaboration aggregate next workflow: ${shell.repositoryCollaborationAggregateSummary.nextWorkflow}`)}
      </div>
      <div class="repository-collaboration-aggregate-list">
        ${shell.repositoryCollaborationAggregateSummary.workflowItems.map(renderRepositoryCollaborationAggregateItem).join('')}
        ${shell.repositoryCollaborationAggregateSummary.requiredEvidence.map(renderRepositoryCollaborationAggregateEvidence).join('')}
        ${shell.repositoryCollaborationAggregateSummary.blockers.map(renderRepositoryCollaborationAggregateBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Repository Collaboration Final Closure</p>
    <section class="panel" aria-label="Repository Collaboration Final Closure">
      <h2>${escapeHtml(shell.repositoryCollaborationFinalClosure.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Repository collaboration final closure status: ${shell.repositoryCollaborationFinalClosure.status}`)}
        ${renderGuidanceRow('Closed', `Repository collaboration final closure closed: ${shell.repositoryCollaborationFinalClosure.closed}`)}
        ${renderGuidanceRow('Workflow', `Repository collaboration final closure workflow: ${shell.repositoryCollaborationFinalClosure.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Repository collaboration final closure scenario: ${shell.repositoryCollaborationFinalClosure.scenario}`)}
        ${renderGuidanceRow('State source', `Repository collaboration final closure source: ${shell.repositoryCollaborationFinalClosure.stateSource}`)}
        ${renderGuidanceRow('State status', `Repository collaboration final closure state status: ${shell.repositoryCollaborationFinalClosure.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Repository collaboration final closure completed actions: ${shell.repositoryCollaborationFinalClosure.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Repository collaboration final closure pull request title: ${shell.repositoryCollaborationFinalClosure.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Repository collaboration final closure source branch: ${shell.repositoryCollaborationFinalClosure.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Repository collaboration final closure target branch: ${shell.repositoryCollaborationFinalClosure.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `Repository collaboration final closure review mode: ${shell.repositoryCollaborationFinalClosure.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Repository collaboration final closure merge policy: ${shell.repositoryCollaborationFinalClosure.mergePolicy}`)}
        ${renderGuidanceRow('Main branch', `Repository collaboration final closure main branch: ${shell.repositoryCollaborationFinalClosure.mainBranchStatus}`)}
        ${renderGuidanceRow('Merge window', `Repository collaboration final closure merge window: ${shell.repositoryCollaborationFinalClosure.mergeWindowStatus}`)}
        ${renderGuidanceRow('Release artifact', `Repository collaboration final closure release artifact: ${shell.repositoryCollaborationFinalClosure.releaseArtifact}`)}
        ${renderGuidanceRow('Closure checklist', `Repository collaboration final closure checklist: ${shell.repositoryCollaborationFinalClosure.closureChecklist}`)}
        ${renderGuidanceRow('Checks', `Repository collaboration final closure checks: ${shell.repositoryCollaborationFinalClosure.passedCheckCount}/${shell.repositoryCollaborationFinalClosure.checkCount}`)}
        ${renderGuidanceRow('Blocked checks', `Repository collaboration final closure blocked checks: ${shell.repositoryCollaborationFinalClosure.blockedCheckCount}`)}
        ${renderGuidanceRow('Blockers', `Repository collaboration final closure blockers: ${shell.repositoryCollaborationFinalClosure.blockerCount}`)}
        ${renderGuidanceRow('Decision', `Repository collaboration final closure decision: ${shell.repositoryCollaborationFinalClosure.closureDecision}`)}
        ${renderGuidanceRow('Summary', `Repository collaboration final closure summary: ${shell.repositoryCollaborationFinalClosure.closureSummary}`)}
        ${renderGuidanceRow('Next workflow', `Repository collaboration final closure next workflow: ${shell.repositoryCollaborationFinalClosure.nextWorkflow}`)}
      </div>
      <div class="repository-collaboration-final-closure-list">
        ${shell.repositoryCollaborationFinalClosure.closureChecks.map(renderRepositoryCollaborationFinalClosureCheck).join('')}
        ${shell.repositoryCollaborationFinalClosure.closureEvidence.map(renderRepositoryCollaborationFinalClosureEvidence).join('')}
        ${shell.repositoryCollaborationFinalClosure.blockers.map(renderRepositoryCollaborationFinalClosureBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Pull Request Review Package</p>
    <section class="panel" aria-label="Pull Request Review Package">
      <h2>${escapeHtml(shell.pullRequestReviewPackage.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Pull request review package status: ${shell.pullRequestReviewPackage.status}`)}
        ${renderGuidanceRow('Ready', `Pull request review package ready: ${shell.pullRequestReviewPackage.reviewReady}`)}
        ${renderGuidanceRow('Workflow', `Pull request review package workflow: ${shell.pullRequestReviewPackage.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Pull request review package scenario: ${shell.pullRequestReviewPackage.scenario}`)}
        ${renderGuidanceRow('State source', `Pull request review package source: ${shell.pullRequestReviewPackage.stateSource}`)}
        ${renderGuidanceRow('State status', `Pull request review package state status: ${shell.pullRequestReviewPackage.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Pull request review package completed actions: ${shell.pullRequestReviewPackage.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Pull request review package title: ${shell.pullRequestReviewPackage.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Pull request review package source branch: ${shell.pullRequestReviewPackage.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Pull request review package target branch: ${shell.pullRequestReviewPackage.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `Pull request review package review mode: ${shell.pullRequestReviewPackage.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Pull request review package merge policy: ${shell.pullRequestReviewPackage.mergePolicy}`)}
        ${renderGuidanceRow('Main branch', `Pull request review package main branch: ${shell.pullRequestReviewPackage.mainBranchStatus}`)}
        ${renderGuidanceRow('Merge window', `Pull request review package merge window: ${shell.pullRequestReviewPackage.mergeWindowStatus}`)}
        ${renderGuidanceRow('Review checklist', `Pull request review package checklist: ${shell.pullRequestReviewPackage.reviewChecklist}`)}
        ${renderGuidanceRow('Review summary', `Pull request review package summary artifact: ${shell.pullRequestReviewPackage.reviewSummaryArtifact}`)}
        ${renderGuidanceRow('Review items', `Pull request review package items: ${shell.pullRequestReviewPackage.readyReviewItemCount}/${shell.pullRequestReviewPackage.reviewItemCount}`)}
        ${renderGuidanceRow('Blocked items', `Pull request review package blocked items: ${shell.pullRequestReviewPackage.blockedReviewItemCount}`)}
        ${renderGuidanceRow('Blockers', `Pull request review package blockers: ${shell.pullRequestReviewPackage.blockerCount}`)}
        ${renderGuidanceRow('Decision', `Pull request review package decision: ${shell.pullRequestReviewPackage.reviewDecision}`)}
        ${renderGuidanceRow('Summary', `Pull request review package summary: ${shell.pullRequestReviewPackage.reviewSummary}`)}
        ${renderGuidanceRow('Next workflow', `Pull request review package next workflow: ${shell.pullRequestReviewPackage.nextWorkflow}`)}
      </div>
      <div class="pull-request-review-package-list">
        ${shell.pullRequestReviewPackage.reviewItems.map(renderPullRequestReviewPackageItem).join('')}
        ${shell.pullRequestReviewPackage.reviewEvidence.map(renderPullRequestReviewPackageEvidence).join('')}
        ${shell.pullRequestReviewPackage.blockers.map(renderPullRequestReviewPackageBlocker).join('')}
      </div>
    </section>

    <p class="section-title">CI Evidence Summary</p>
    <section class="panel" aria-label="CI Evidence Summary">
      <h2>${escapeHtml(shell.ciEvidenceSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `CI evidence summary status: ${shell.ciEvidenceSummary.status}`)}
        ${renderGuidanceRow('Ready', `CI evidence summary ready: ${shell.ciEvidenceSummary.ciReady}`)}
        ${renderGuidanceRow('Workflow', `CI evidence summary workflow: ${shell.ciEvidenceSummary.workflowName}`)}
        ${renderGuidanceRow('Scenario', `CI evidence summary scenario: ${shell.ciEvidenceSummary.scenario}`)}
        ${renderGuidanceRow('State source', `CI evidence summary source: ${shell.ciEvidenceSummary.stateSource}`)}
        ${renderGuidanceRow('State status', `CI evidence summary state status: ${shell.ciEvidenceSummary.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `CI evidence summary completed actions: ${shell.ciEvidenceSummary.completedActionCount}`)}
        ${renderGuidanceRow('Title', `CI evidence summary pull request title: ${shell.ciEvidenceSummary.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `CI evidence summary source branch: ${shell.ciEvidenceSummary.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `CI evidence summary target branch: ${shell.ciEvidenceSummary.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `CI evidence summary review mode: ${shell.ciEvidenceSummary.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `CI evidence summary merge policy: ${shell.ciEvidenceSummary.mergePolicy}`)}
        ${renderGuidanceRow('Main branch', `CI evidence summary main branch: ${shell.ciEvidenceSummary.mainBranchStatus}`)}
        ${renderGuidanceRow('Merge window', `CI evidence summary merge window: ${shell.ciEvidenceSummary.mergeWindowStatus}`)}
        ${renderGuidanceRow('CI command', `CI evidence summary command: ${shell.ciEvidenceSummary.ciCommand}`)}
        ${renderGuidanceRow('CI status', `CI evidence summary ci status: ${shell.ciEvidenceSummary.ciStatus}`)}
        ${renderGuidanceRow('CI provider', `CI evidence summary provider: ${shell.ciEvidenceSummary.ciProvider}`)}
        ${renderGuidanceRow('Evidence items', `CI evidence summary items: ${shell.ciEvidenceSummary.readyEvidenceItemCount}/${shell.ciEvidenceSummary.evidenceItemCount}`)}
        ${renderGuidanceRow('Blocked items', `CI evidence summary blocked items: ${shell.ciEvidenceSummary.blockedEvidenceItemCount}`)}
        ${renderGuidanceRow('Blockers', `CI evidence summary blockers: ${shell.ciEvidenceSummary.blockerCount}`)}
        ${renderGuidanceRow('Decision', `CI evidence summary decision: ${shell.ciEvidenceSummary.ciDecision}`)}
        ${renderGuidanceRow('Summary', `CI evidence summary summary: ${shell.ciEvidenceSummary.ciSummary}`)}
        ${renderGuidanceRow('Next workflow', `CI evidence summary next workflow: ${shell.ciEvidenceSummary.nextWorkflow}`)}
      </div>
      <div class="ci-evidence-summary-list">
        ${shell.ciEvidenceSummary.evidenceItems.map(renderCiEvidenceSummaryItem).join('')}
        ${shell.ciEvidenceSummary.ciEvidence.map(renderCiEvidenceSummaryEvidence).join('')}
        ${shell.ciEvidenceSummary.blockers.map(renderCiEvidenceSummaryBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Main Merge Plan</p>
    <section class="panel" aria-label="Main Merge Plan">
      <h2>${escapeHtml(shell.mainMergePlan.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Main merge plan status: ${shell.mainMergePlan.status}`)}
        ${renderGuidanceRow('Ready', `Main merge plan ready: ${shell.mainMergePlan.mergePlanReady}`)}
        ${renderGuidanceRow('Workflow', `Main merge plan workflow: ${shell.mainMergePlan.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Main merge plan scenario: ${shell.mainMergePlan.scenario}`)}
        ${renderGuidanceRow('State source', `Main merge plan source: ${shell.mainMergePlan.stateSource}`)}
        ${renderGuidanceRow('State status', `Main merge plan state status: ${shell.mainMergePlan.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Main merge plan completed actions: ${shell.mainMergePlan.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Main merge plan pull request title: ${shell.mainMergePlan.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Main merge plan source branch: ${shell.mainMergePlan.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Main merge plan target branch: ${shell.mainMergePlan.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `Main merge plan review mode: ${shell.mainMergePlan.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Main merge plan merge policy: ${shell.mainMergePlan.mergePolicy}`)}
        ${renderGuidanceRow('Main branch', `Main merge plan main branch: ${shell.mainMergePlan.mainBranchStatus}`)}
        ${renderGuidanceRow('Merge window', `Main merge plan merge window: ${shell.mainMergePlan.mergeWindowStatus}`)}
        ${renderGuidanceRow('CI command', `Main merge plan ci command: ${shell.mainMergePlan.ciCommand}`)}
        ${renderGuidanceRow('CI status', `Main merge plan ci status: ${shell.mainMergePlan.ciStatus}`)}
        ${renderGuidanceRow('CI provider', `Main merge plan ci provider: ${shell.mainMergePlan.ciProvider}`)}
        ${renderGuidanceRow('Merge strategy', `Main merge plan strategy: ${shell.mainMergePlan.mergeStrategy}`)}
        ${renderGuidanceRow('Rollback plan', `Main merge plan rollback: ${shell.mainMergePlan.rollbackPlan}`)}
        ${renderGuidanceRow('Verification', `Main merge plan verification command: ${shell.mainMergePlan.verificationCommand}`)}
        ${renderGuidanceRow('Plan items', `Main merge plan items: ${shell.mainMergePlan.readyPlanItemCount}/${shell.mainMergePlan.planItemCount}`)}
        ${renderGuidanceRow('Blocked items', `Main merge plan blocked items: ${shell.mainMergePlan.blockedPlanItemCount}`)}
        ${renderGuidanceRow('Blockers', `Main merge plan blockers: ${shell.mainMergePlan.blockerCount}`)}
        ${renderGuidanceRow('Decision', `Main merge plan decision: ${shell.mainMergePlan.mergeDecision}`)}
        ${renderGuidanceRow('Summary', `Main merge plan summary: ${shell.mainMergePlan.mergeSummary}`)}
        ${renderGuidanceRow('Next workflow', `Main merge plan next workflow: ${shell.mainMergePlan.nextWorkflow}`)}
      </div>
      <div class="main-merge-plan-list">
        ${shell.mainMergePlan.planItems.map(renderMainMergePlanItem).join('')}
        ${shell.mainMergePlan.mergeEvidence.map(renderMainMergePlanEvidence).join('')}
        ${shell.mainMergePlan.blockers.map(renderMainMergePlanBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Release Tag Readiness</p>
    <section class="panel" aria-label="Release Tag Readiness">
      <h2>${escapeHtml(shell.releaseTagReadiness.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Release tag readiness status: ${shell.releaseTagReadiness.status}`)}
        ${renderGuidanceRow('Ready', `Release tag readiness ready: ${shell.releaseTagReadiness.tagReady}`)}
        ${renderGuidanceRow('Workflow', `Release tag readiness workflow: ${shell.releaseTagReadiness.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Release tag readiness scenario: ${shell.releaseTagReadiness.scenario}`)}
        ${renderGuidanceRow('State source', `Release tag readiness source: ${shell.releaseTagReadiness.stateSource}`)}
        ${renderGuidanceRow('State status', `Release tag readiness state status: ${shell.releaseTagReadiness.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Release tag readiness completed actions: ${shell.releaseTagReadiness.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Release tag readiness pull request title: ${shell.releaseTagReadiness.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Release tag readiness source branch: ${shell.releaseTagReadiness.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Release tag readiness target branch: ${shell.releaseTagReadiness.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `Release tag readiness review mode: ${shell.releaseTagReadiness.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Release tag readiness merge policy: ${shell.releaseTagReadiness.mergePolicy}`)}
        ${renderGuidanceRow('Main branch', `Release tag readiness main branch: ${shell.releaseTagReadiness.mainBranchStatus}`)}
        ${renderGuidanceRow('Merge window', `Release tag readiness merge window: ${shell.releaseTagReadiness.mergeWindowStatus}`)}
        ${renderGuidanceRow('CI command', `Release tag readiness ci command: ${shell.releaseTagReadiness.ciCommand}`)}
        ${renderGuidanceRow('CI status', `Release tag readiness ci status: ${shell.releaseTagReadiness.ciStatus}`)}
        ${renderGuidanceRow('CI provider', `Release tag readiness ci provider: ${shell.releaseTagReadiness.ciProvider}`)}
        ${renderGuidanceRow('Merge strategy', `Release tag readiness merge strategy: ${shell.releaseTagReadiness.mergeStrategy}`)}
        ${renderGuidanceRow('Rollback plan', `Release tag readiness rollback: ${shell.releaseTagReadiness.rollbackPlan}`)}
        ${renderGuidanceRow('Verification', `Release tag readiness verification command: ${shell.releaseTagReadiness.verificationCommand}`)}
        ${renderGuidanceRow('Release version', `Release tag readiness version: ${shell.releaseTagReadiness.releaseVersion}`)}
        ${renderGuidanceRow('Tag policy', `Release tag readiness policy: ${shell.releaseTagReadiness.tagPolicy}`)}
        ${renderGuidanceRow('Release notes', `Release tag readiness notes: ${shell.releaseTagReadiness.releaseNotes}`)}
        ${renderGuidanceRow('Tag checklist', `Release tag readiness checklist: ${shell.releaseTagReadiness.tagChecklist}`)}
        ${renderGuidanceRow('Tag items', `Release tag readiness items: ${shell.releaseTagReadiness.readyTagItemCount}/${shell.releaseTagReadiness.tagItemCount}`)}
        ${renderGuidanceRow('Blocked items', `Release tag readiness blocked items: ${shell.releaseTagReadiness.blockedTagItemCount}`)}
        ${renderGuidanceRow('Blockers', `Release tag readiness blockers: ${shell.releaseTagReadiness.blockerCount}`)}
        ${renderGuidanceRow('Decision', `Release tag readiness decision: ${shell.releaseTagReadiness.tagDecision}`)}
        ${renderGuidanceRow('Summary', `Release tag readiness summary: ${shell.releaseTagReadiness.tagSummary}`)}
        ${renderGuidanceRow('Next workflow', `Release tag readiness next workflow: ${shell.releaseTagReadiness.nextWorkflow}`)}
      </div>
      <div class="release-tag-readiness-list">
        ${shell.releaseTagReadiness.tagItems.map(renderReleaseTagReadinessItem).join('')}
        ${shell.releaseTagReadiness.tagEvidence.map(renderReleaseTagReadinessEvidence).join('')}
        ${shell.releaseTagReadiness.blockers.map(renderReleaseTagReadinessBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Mainline Aggregate Summary</p>
    <section class="panel" aria-label="Mainline Aggregate Summary">
      <h2>${escapeHtml(shell.mainlineAggregateSummary.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Mainline aggregate summary status: ${shell.mainlineAggregateSummary.status}`)}
        ${renderGuidanceRow('Ready', `Mainline aggregate summary ready: ${shell.mainlineAggregateSummary.aggregateReady}`)}
        ${renderGuidanceRow('Workflow', `Mainline aggregate summary workflow: ${shell.mainlineAggregateSummary.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Mainline aggregate summary scenario: ${shell.mainlineAggregateSummary.scenario}`)}
        ${renderGuidanceRow('State source', `Mainline aggregate summary source: ${shell.mainlineAggregateSummary.stateSource}`)}
        ${renderGuidanceRow('State status', `Mainline aggregate summary state status: ${shell.mainlineAggregateSummary.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Mainline aggregate summary completed actions: ${shell.mainlineAggregateSummary.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Mainline aggregate summary pull request title: ${shell.mainlineAggregateSummary.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Mainline aggregate summary source branch: ${shell.mainlineAggregateSummary.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Mainline aggregate summary target branch: ${shell.mainlineAggregateSummary.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `Mainline aggregate summary review mode: ${shell.mainlineAggregateSummary.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Mainline aggregate summary merge policy: ${shell.mainlineAggregateSummary.mergePolicy}`)}
        ${renderGuidanceRow('Main branch', `Mainline aggregate summary main branch: ${shell.mainlineAggregateSummary.mainBranchStatus}`)}
        ${renderGuidanceRow('Merge window', `Mainline aggregate summary merge window: ${shell.mainlineAggregateSummary.mergeWindowStatus}`)}
        ${renderGuidanceRow('CI command', `Mainline aggregate summary ci command: ${shell.mainlineAggregateSummary.ciCommand}`)}
        ${renderGuidanceRow('CI status', `Mainline aggregate summary ci status: ${shell.mainlineAggregateSummary.ciStatus}`)}
        ${renderGuidanceRow('CI provider', `Mainline aggregate summary ci provider: ${shell.mainlineAggregateSummary.ciProvider}`)}
        ${renderGuidanceRow('Merge strategy', `Mainline aggregate summary merge strategy: ${shell.mainlineAggregateSummary.mergeStrategy}`)}
        ${renderGuidanceRow('Rollback plan', `Mainline aggregate summary rollback: ${shell.mainlineAggregateSummary.rollbackPlan}`)}
        ${renderGuidanceRow('Verification', `Mainline aggregate summary verification command: ${shell.mainlineAggregateSummary.verificationCommand}`)}
        ${renderGuidanceRow('Release version', `Mainline aggregate summary version: ${shell.mainlineAggregateSummary.releaseVersion}`)}
        ${renderGuidanceRow('Tag policy', `Mainline aggregate summary tag policy: ${shell.mainlineAggregateSummary.tagPolicy}`)}
        ${renderGuidanceRow('Release notes', `Mainline aggregate summary release notes: ${shell.mainlineAggregateSummary.releaseNotes}`)}
        ${renderGuidanceRow('Tag checklist', `Mainline aggregate summary tag checklist: ${shell.mainlineAggregateSummary.tagChecklist}`)}
        ${renderGuidanceRow('Aggregate artifact', `Mainline aggregate summary artifact: ${shell.mainlineAggregateSummary.aggregateArtifact}`)}
        ${renderGuidanceRow('Closure checklist', `Mainline aggregate summary closure checklist: ${shell.mainlineAggregateSummary.closureChecklist}`)}
        ${renderGuidanceRow('Workflow items', `Mainline aggregate summary items: ${shell.mainlineAggregateSummary.readyWorkflowItemCount}/${shell.mainlineAggregateSummary.workflowItemCount}`)}
        ${renderGuidanceRow('Blocked items', `Mainline aggregate summary blocked items: ${shell.mainlineAggregateSummary.blockedWorkflowItemCount}`)}
        ${renderGuidanceRow('Blockers', `Mainline aggregate summary blockers: ${shell.mainlineAggregateSummary.blockerCount}`)}
        ${renderGuidanceRow('Decision', `Mainline aggregate summary decision: ${shell.mainlineAggregateSummary.aggregateDecision}`)}
        ${renderGuidanceRow('Summary', `Mainline aggregate summary summary: ${shell.mainlineAggregateSummary.aggregateSummary}`)}
        ${renderGuidanceRow('Next workflow', `Mainline aggregate summary next workflow: ${shell.mainlineAggregateSummary.nextWorkflow}`)}
      </div>
      <div class="mainline-aggregate-summary-list">
        ${shell.mainlineAggregateSummary.workflowItems.map(renderMainlineAggregateSummaryItem).join('')}
        ${shell.mainlineAggregateSummary.aggregateEvidence.map(renderMainlineAggregateSummaryEvidence).join('')}
        ${shell.mainlineAggregateSummary.blockers.map(renderMainlineAggregateSummaryBlocker).join('')}
      </div>
    </section>

    <p class="section-title">Mainline Final Closure</p>
    <section class="panel" aria-label="Mainline Final Closure">
      <h2>${escapeHtml(shell.mainlineFinalClosure.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Mainline final closure status: ${shell.mainlineFinalClosure.status}`)}
        ${renderGuidanceRow('Closed', `Mainline final closure closed: ${shell.mainlineFinalClosure.closed}`)}
        ${renderGuidanceRow('Workflow', `Mainline final closure workflow: ${shell.mainlineFinalClosure.workflowName}`)}
        ${renderGuidanceRow('Scenario', `Mainline final closure scenario: ${shell.mainlineFinalClosure.scenario}`)}
        ${renderGuidanceRow('State source', `Mainline final closure source: ${shell.mainlineFinalClosure.stateSource}`)}
        ${renderGuidanceRow('State status', `Mainline final closure state status: ${shell.mainlineFinalClosure.stateStatus}`)}
        ${renderGuidanceRow('Completed actions', `Mainline final closure completed actions: ${shell.mainlineFinalClosure.completedActionCount}`)}
        ${renderGuidanceRow('Title', `Mainline final closure pull request title: ${shell.mainlineFinalClosure.pullRequestTitle}`)}
        ${renderGuidanceRow('Source branch', `Mainline final closure source branch: ${shell.mainlineFinalClosure.pullRequestSource}`)}
        ${renderGuidanceRow('Target branch', `Mainline final closure target branch: ${shell.mainlineFinalClosure.pullRequestTarget}`)}
        ${renderGuidanceRow('Review mode', `Mainline final closure review mode: ${shell.mainlineFinalClosure.reviewMode}`)}
        ${renderGuidanceRow('Merge policy', `Mainline final closure merge policy: ${shell.mainlineFinalClosure.mergePolicy}`)}
        ${renderGuidanceRow('Main branch', `Mainline final closure main branch: ${shell.mainlineFinalClosure.mainBranchStatus}`)}
        ${renderGuidanceRow('Merge window', `Mainline final closure merge window: ${shell.mainlineFinalClosure.mergeWindowStatus}`)}
        ${renderGuidanceRow('CI command', `Mainline final closure ci command: ${shell.mainlineFinalClosure.ciCommand}`)}
        ${renderGuidanceRow('CI status', `Mainline final closure ci status: ${shell.mainlineFinalClosure.ciStatus}`)}
        ${renderGuidanceRow('CI provider', `Mainline final closure ci provider: ${shell.mainlineFinalClosure.ciProvider}`)}
        ${renderGuidanceRow('Merge strategy', `Mainline final closure merge strategy: ${shell.mainlineFinalClosure.mergeStrategy}`)}
        ${renderGuidanceRow('Rollback plan', `Mainline final closure rollback: ${shell.mainlineFinalClosure.rollbackPlan}`)}
        ${renderGuidanceRow('Verification', `Mainline final closure verification command: ${shell.mainlineFinalClosure.verificationCommand}`)}
        ${renderGuidanceRow('Release version', `Mainline final closure version: ${shell.mainlineFinalClosure.releaseVersion}`)}
        ${renderGuidanceRow('Tag policy', `Mainline final closure tag policy: ${shell.mainlineFinalClosure.tagPolicy}`)}
        ${renderGuidanceRow('Release notes', `Mainline final closure release notes: ${shell.mainlineFinalClosure.releaseNotes}`)}
        ${renderGuidanceRow('Tag checklist', `Mainline final closure tag checklist: ${shell.mainlineFinalClosure.tagChecklist}`)}
        ${renderGuidanceRow('Aggregate artifact', `Mainline final closure aggregate artifact: ${shell.mainlineFinalClosure.aggregateArtifact}`)}
        ${renderGuidanceRow('Closure checklist', `Mainline final closure closure checklist: ${shell.mainlineFinalClosure.closureChecklist}`)}
        ${renderGuidanceRow('Final release notes', `Mainline final closure final release notes: ${shell.mainlineFinalClosure.finalReleaseNotes}`)}
        ${renderGuidanceRow('Archive checklist', `Mainline final closure archive checklist: ${shell.mainlineFinalClosure.archiveChecklist}`)}
        ${renderGuidanceRow('Checks', `Mainline final closure checks: ${shell.mainlineFinalClosure.passedCheckCount}/${shell.mainlineFinalClosure.checkCount}`)}
        ${renderGuidanceRow('Blocked checks', `Mainline final closure blocked checks: ${shell.mainlineFinalClosure.blockedCheckCount}`)}
        ${renderGuidanceRow('Blockers', `Mainline final closure blockers: ${shell.mainlineFinalClosure.blockerCount}`)}
        ${renderGuidanceRow('Decision', `Mainline final closure decision: ${shell.mainlineFinalClosure.closureDecision}`)}
        ${renderGuidanceRow('Summary', `Mainline final closure summary: ${shell.mainlineFinalClosure.closureSummary}`)}
        ${renderGuidanceRow('Next workflow', `Mainline final closure next workflow: ${shell.mainlineFinalClosure.nextWorkflow}`)}
      </div>
      <div class="mainline-final-closure-list">
        ${shell.mainlineFinalClosure.closureChecks.map(renderMainlineFinalClosureCheck).join('')}
        ${shell.mainlineFinalClosure.closureEvidence.map(renderMainlineFinalClosureEvidence).join('')}
        ${shell.mainlineFinalClosure.blockers.map(renderMainlineFinalClosureBlocker).join('')}
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

    <p class="section-title">Readiness evidence</p>
    <section class="workflow-grid" aria-label="Readiness Evidence Model">
      <article class="panel">
        <h2>${escapeHtml(shell.readinessEvidenceModel.title)}</h2>
        <p class="meta">Evidence status: ${escapeHtml(shell.readinessEvidenceModel.status)}</p>
        <p class="meta">Readiness decision: ${escapeHtml(shell.readinessEvidenceModel.readinessDecision)}</p>
        <p class="meta">Evidence count: ${shell.readinessEvidenceModel.evidenceCount}</p>
        <p class="meta">Blocking evidence: ${shell.readinessEvidenceModel.blockingEvidenceCount}</p>
      </article>
      <article class="panel">
        <h2>Evidence items</h2>
        <ul>
          ${shell.readinessEvidenceModel.evidenceItems.map(renderReadinessEvidenceItem).join('')}
        </ul>
      </article>
    </section>

    <p class="section-title">Operator decision</p>
    <section class="panel" aria-label="Operator Decision State">
      <h2>${escapeHtml(shell.operatorDecisionState.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Operator decision status: ${shell.operatorDecisionState.status}`)}
        ${renderGuidanceRow('Decision', `Operator decision: ${shell.operatorDecisionState.decision}`)}
        ${renderGuidanceRow('Reason', `Operator decision reason: ${shell.operatorDecisionState.reason}`)}
        ${renderGuidanceRow('Action', `Operator decision action: ${shell.operatorDecisionState.recommendedAction}`)}
        ${renderGuidanceRow('Command', `Operator decision command: ${shell.operatorDecisionState.command}`)}
        ${renderGuidanceRow('Owner', `Operator decision owner: ${shell.operatorDecisionState.owner}`)}
        ${renderGuidanceRow('Evidence', `Operator decision evidence: ${shell.operatorDecisionState.evidenceStatus}, ${shell.operatorDecisionState.blockingEvidenceCount} blocking`)}
      </div>
    </section>

    <p class="section-title">Studio readiness detail</p>
    <section class="panel" aria-label="Studio Readiness Detail">
      <h2>${escapeHtml(shell.studioReadinessDetail.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Studio readiness detail status: ${shell.studioReadinessDetail.status}`)}
        ${renderGuidanceRow('Summary', `Studio readiness detail summary: ${shell.studioReadinessDetail.summary}`)}
        ${renderGuidanceRow('State', `Studio readiness state: ${shell.studioReadinessDetail.readinessState}`)}
        ${renderGuidanceRow('Evidence', `Studio readiness evidence: ${shell.studioReadinessDetail.evidenceSummary}`)}
        ${renderGuidanceRow('Decision', `Studio readiness decision: ${shell.studioReadinessDetail.operatorDecision}`)}
        ${renderGuidanceRow('Primary action', `Studio readiness primary action: ${shell.studioReadinessDetail.primaryAction}`)}
      </div>
      <div class="guidance-list">
        ${shell.studioReadinessDetail.detailRows.map(renderStudioReadinessDetailRow).join('')}
      </div>
    </section>

    <p class="section-title">Context Pack usage flow</p>
    <section class="panel" aria-label="Context Pack Handoff Source Package">
      <h2>${escapeHtml(shell.contextPackHandoffSourcePackage.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Context Pack handoff package status: ${shell.contextPackHandoffSourcePackage.status}`)}
        ${renderGuidanceRow('Decision', `Context Pack handoff decision: ${shell.contextPackHandoffSourcePackage.handoffDecision}`)}
        ${renderGuidanceRow('Policy', `Context Pack handoff source policy: ${shell.contextPackHandoffSourcePackage.sourcePolicy}`)}
        ${renderGuidanceRow('Sources', `Context Pack handoff sources: ${shell.contextPackHandoffSourcePackage.includedSourceCount} included, ${shell.contextPackHandoffSourcePackage.blockedSourceCount} blocked`)}
        ${renderGuidanceRow('Audience', `Context Pack handoff audience: ${shell.contextPackHandoffSourcePackage.intendedAudience}`)}
        ${renderGuidanceRow('Next workflow', `Context Pack handoff next workflow: ${shell.contextPackHandoffSourcePackage.recommendedNextWorkflow}`)}
      </div>
      <div class="usage-step-list">
        ${shell.contextPackHandoffSourcePackage.includedSources.map(renderContextPackHandoffSource).join('')}
      </div>
    </section>

    <section class="panel" aria-label="Agent Context Readiness">
      <h2>${escapeHtml(shell.agentContextReadiness.title)}</h2>
      <div class="guidance-list">
        ${renderGuidanceRow('Status', `Agent context readiness status: ${shell.agentContextReadiness.status}`)}
        ${renderGuidanceRow('Decision', `Agent context readiness decision: ${shell.agentContextReadiness.readinessDecision}`)}
        ${renderGuidanceRow('Source package', `Agent context source package: ${shell.agentContextReadiness.sourcePackageStatus}`)}
        ${renderGuidanceRow('Read order', `Agent context read order: ${shell.agentContextReadiness.requiredReadOrder.join(', ')}`)}
        ${renderGuidanceRow('Instructions', `Agent context instruction count: ${shell.agentContextReadiness.instructionCount}`)}
        ${renderGuidanceRow('Next workflow', `Agent context next workflow: ${shell.agentContextReadiness.recommendedNextWorkflow}`)}
      </div>
      <div class="usage-step-list">
        ${shell.agentContextReadiness.readinessChecks.map(renderAgentContextReadinessCheck).join('')}
      </div>
    </section>

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

function renderProductModeRow(label, value) {
  return `<div class="product-mode-row">
          <span class="product-mode-label">${escapeHtml(label)}</span>
          <span class="product-mode-value">${escapeHtml(value)}</span>
        </div>`;
}

function renderReadinessEvidenceItem(item) {
  return `<li>
          Readiness evidence item: ${escapeHtml(item.type)} ${escapeHtml(item.id)} -
          ${escapeHtml(item.status)} - ${escapeHtml(item.detail)}
        </li>`;
}

function renderStudioReadinessDetailRow(row) {
  return `<div class="guidance-row">
          <span class="guidance-label">${escapeHtml(row.label)}</span>
          <span class="guidance-value">Studio readiness detail row: ${escapeHtml(row.label)} - ${escapeHtml(row.value)}</span>
        </div>`;
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

function renderWorkflowSessionSignal(signal) {
  return `<div class="workflow-session-row">
    <span class="workflow-session-label">Signal</span>
    <span class="workflow-session-value">Workflow session signal: ${escapeHtml(signal.label)} - ${escapeHtml(signal.status)} - ${escapeHtml(signal.detail)}</span>
  </div>`;
}

function renderWorkflowSessionEvidence(evidence) {
  return `<div class="workflow-session-row">
    <span class="workflow-session-label">Evidence</span>
    <span class="workflow-session-value">Workflow session evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderWorkflowSessionBlocker(blocker) {
  return `<div class="workflow-session-row">
    <span class="workflow-session-label">Blocker</span>
    <span class="workflow-session-value">Workflow session blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderWorkflowTransitionStep(step) {
  return `<div class="workflow-transition-row">
    <span class="workflow-transition-label">Step</span>
    <span class="workflow-transition-value">Workflow transition step: ${escapeHtml(step.label)} - ${escapeHtml(step.status)} - ${escapeHtml(step.detail)}</span>
  </div>`;
}

function renderWorkflowTransitionSignal(signal) {
  return `<div class="workflow-transition-row">
    <span class="workflow-transition-label">Signal</span>
    <span class="workflow-transition-value">Workflow transition signal: ${escapeHtml(signal.label)} - ${escapeHtml(signal.status)} - ${escapeHtml(signal.detail)}</span>
  </div>`;
}

function renderWorkflowTransitionEvidence(evidence) {
  return `<div class="workflow-transition-row">
    <span class="workflow-transition-label">Evidence</span>
    <span class="workflow-transition-value">Workflow transition evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderWorkflowTransitionBlocker(blocker) {
  return `<div class="workflow-transition-row">
    <span class="workflow-transition-label">Blocker</span>
    <span class="workflow-transition-value">Workflow transition blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderCommandResultItem(result) {
  return `<div class="command-result-row">
    <span class="command-result-label">Result</span>
    <span class="command-result-value">Command result item: ${escapeHtml(result.label)} - ${escapeHtml(result.status)} - ${escapeHtml(result.detail)}</span>
  </div>`;
}

function renderCommandResultSignal(signal) {
  return `<div class="command-result-row">
    <span class="command-result-label">Signal</span>
    <span class="command-result-value">Command result signal: ${escapeHtml(signal.label)} - ${escapeHtml(signal.status)} - ${escapeHtml(signal.detail)}</span>
  </div>`;
}

function renderCommandResultEvidence(evidence) {
  return `<div class="command-result-row">
    <span class="command-result-label">Evidence</span>
    <span class="command-result-value">Command result evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderCommandResultBlocker(blocker) {
  return `<div class="command-result-row">
    <span class="command-result-label">Blocker</span>
    <span class="command-result-value">Command result blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderStudioWorkflowRuntimeAggregateItem(item) {
  return `<div class="studio-workflow-runtime-aggregate-row">
    <span class="studio-workflow-runtime-aggregate-label">Command</span>
    <span class="studio-workflow-runtime-aggregate-value">Studio workflow runtime aggregate item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.scenario)} - ${escapeHtml(item.route)} - ${item.resultCount} results</span>
  </div>`;
}

function renderStudioWorkflowRuntimeAggregateEvidence(evidence) {
  return `<div class="studio-workflow-runtime-aggregate-row">
    <span class="studio-workflow-runtime-aggregate-label">Evidence</span>
    <span class="studio-workflow-runtime-aggregate-value">Studio workflow runtime aggregate evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderStudioWorkflowRuntimeAggregateBlocker(blocker) {
  return `<div class="studio-workflow-runtime-aggregate-row">
    <span class="studio-workflow-runtime-aggregate-label">Blocker</span>
    <span class="studio-workflow-runtime-aggregate-value">Studio workflow runtime aggregate blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderStudioWorkflowRuntimeFinalClosureArtifact(artifact) {
  return `<div class="studio-workflow-runtime-final-closure-row">
    <span class="studio-workflow-runtime-final-closure-label">Artifact</span>
    <span class="studio-workflow-runtime-final-closure-value">Studio workflow runtime final closure artifact: ${escapeHtml(artifact)}</span>
  </div>`;
}

function renderStudioWorkflowRuntimeFinalClosureEvidence(evidence) {
  return `<div class="studio-workflow-runtime-final-closure-row">
    <span class="studio-workflow-runtime-final-closure-label">Evidence</span>
    <span class="studio-workflow-runtime-final-closure-value">Studio workflow runtime final closure evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderStudioWorkflowRuntimeFinalClosureCheck(check) {
  return `<div class="studio-workflow-runtime-final-closure-row">
    <span class="studio-workflow-runtime-final-closure-label">Check</span>
    <span class="studio-workflow-runtime-final-closure-value">Studio workflow runtime final closure check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)}</span>
  </div>`;
}

function renderStudioWorkflowRuntimeFinalClosureBlocker(blocker) {
  return `<div class="studio-workflow-runtime-final-closure-row">
    <span class="studio-workflow-runtime-final-closure-label">Blocker</span>
    <span class="studio-workflow-runtime-final-closure-value">Studio workflow runtime final closure blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderOperatorWorkflowMapPath(path) {
  return `<div class="operator-workflow-map-row">
    <span class="operator-workflow-map-label">Path</span>
    <span class="operator-workflow-map-value">Operator workflow map path: ${escapeHtml(path.label)} - ${escapeHtml(path.status)} - ${escapeHtml(path.detail)}</span>
  </div>`;
}

function renderOperatorWorkflowMapEvidence(evidence) {
  return `<div class="operator-workflow-map-row">
    <span class="operator-workflow-map-label">Evidence</span>
    <span class="operator-workflow-map-value">Operator workflow map evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderOperatorWorkflowMapBlocker(blocker) {
  return `<div class="operator-workflow-map-row">
    <span class="operator-workflow-map-label">Blocker</span>
    <span class="operator-workflow-map-value">Operator workflow map blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderOperatorTaskSelectionOption(option) {
  return `<div class="operator-task-selection-row">
    <span class="operator-task-selection-label">Task</span>
    <span class="operator-task-selection-value">Operator task selection option: ${escapeHtml(option.label)} - ${escapeHtml(option.workflow)} - ${escapeHtml(option.status)} - ${escapeHtml(option.reason)}</span>
  </div>`;
}

function renderOperatorTaskSelectionEvidence(evidence) {
  return `<div class="operator-task-selection-row">
    <span class="operator-task-selection-label">Evidence</span>
    <span class="operator-task-selection-value">Operator task selection evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderOperatorTaskSelectionBlocker(blocker) {
  return `<div class="operator-task-selection-row">
    <span class="operator-task-selection-label">Blocker</span>
    <span class="operator-task-selection-value">Operator task selection blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderOperatorStepDetailStep(step) {
  return `<div class="operator-step-detail-row">
    <span class="operator-step-detail-label">Step</span>
    <span class="operator-step-detail-value">Operator step detail step: ${escapeHtml(step.label)} - ${escapeHtml(step.status)} - ${escapeHtml(step.detail)}</span>
  </div>`;
}

function renderOperatorStepDetailEvidence(evidence) {
  return `<div class="operator-step-detail-row">
    <span class="operator-step-detail-label">Evidence</span>
    <span class="operator-step-detail-value">Operator step detail evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderOperatorStepDetailBlocker(blocker) {
  return `<div class="operator-step-detail-row">
    <span class="operator-step-detail-label">Blocker</span>
    <span class="operator-step-detail-value">Operator step detail blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderOperatorHandoffReadinessCheck(check) {
  return `<div class="operator-handoff-readiness-row">
    <span class="operator-handoff-readiness-label">Check</span>
    <span class="operator-handoff-readiness-value">Operator handoff readiness check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)} - ${escapeHtml(check.detail)}</span>
  </div>`;
}

function renderOperatorHandoffReadinessEvidence(evidence) {
  return `<div class="operator-handoff-readiness-row">
    <span class="operator-handoff-readiness-label">Evidence</span>
    <span class="operator-handoff-readiness-value">Operator handoff readiness evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderOperatorHandoffReadinessBlocker(blocker) {
  return `<div class="operator-handoff-readiness-row">
    <span class="operator-handoff-readiness-label">Blocker</span>
    <span class="operator-handoff-readiness-value">Operator handoff readiness blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderOperatorWorkflowDesignAggregateItem(item) {
  return `<div class="operator-workflow-design-aggregate-row">
    <span class="operator-workflow-design-aggregate-label">Workflow</span>
    <span class="operator-workflow-design-aggregate-value">Operator workflow design aggregate item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.ready)} - ${escapeHtml(item.detail)}</span>
  </div>`;
}

function renderOperatorWorkflowDesignAggregateEvidence(evidence) {
  return `<div class="operator-workflow-design-aggregate-row">
    <span class="operator-workflow-design-aggregate-label">Evidence</span>
    <span class="operator-workflow-design-aggregate-value">Operator workflow design aggregate evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderOperatorWorkflowDesignAggregateBlocker(blocker) {
  return `<div class="operator-workflow-design-aggregate-row">
    <span class="operator-workflow-design-aggregate-label">Blocker</span>
    <span class="operator-workflow-design-aggregate-value">Operator workflow design aggregate blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderOperatorWorkflowDesignFinalClosureArtifact(artifact) {
  return `<div class="operator-workflow-design-final-closure-row">
    <span class="operator-workflow-design-final-closure-label">Artifact</span>
    <span class="operator-workflow-design-final-closure-value">Operator workflow design final closure artifact: ${escapeHtml(artifact)}</span>
  </div>`;
}

function renderOperatorWorkflowDesignFinalClosureEvidence(evidence) {
  return `<div class="operator-workflow-design-final-closure-row">
    <span class="operator-workflow-design-final-closure-label">Evidence</span>
    <span class="operator-workflow-design-final-closure-value">Operator workflow design final closure evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderOperatorWorkflowDesignFinalClosureCheck(check) {
  return `<div class="operator-workflow-design-final-closure-row">
    <span class="operator-workflow-design-final-closure-label">Check</span>
    <span class="operator-workflow-design-final-closure-value">Operator workflow design final closure check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)}</span>
  </div>`;
}

function renderOperatorWorkflowDesignFinalClosureBlocker(blocker) {
  return `<div class="operator-workflow-design-final-closure-row">
    <span class="operator-workflow-design-final-closure-label">Blocker</span>
    <span class="operator-workflow-design-final-closure-value">Operator workflow design final closure blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderRepositoryBranchStatusItem(item) {
  return `<div class="repository-branch-status-row">
    <span class="repository-branch-status-label">Branch</span>
    <span class="repository-branch-status-value">Repository branch item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.detail)}</span>
  </div>`;
}

function renderRepositoryBranchStatusEvidence(evidence) {
  return `<div class="repository-branch-status-row">
    <span class="repository-branch-status-label">Evidence</span>
    <span class="repository-branch-status-value">Repository branch evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderRepositoryBranchStatusBlocker(blocker) {
  return `<div class="repository-branch-status-row">
    <span class="repository-branch-status-label">Blocker</span>
    <span class="repository-branch-status-value">Repository branch blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderPullRequestReadinessCheck(check) {
  return `<div class="pull-request-readiness-row">
    <span class="pull-request-readiness-label">Check</span>
    <span class="pull-request-readiness-value">Pull request check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)} - ${escapeHtml(check.detail)}</span>
  </div>`;
}

function renderPullRequestReadinessEvidence(evidence) {
  return `<div class="pull-request-readiness-row">
    <span class="pull-request-readiness-label">Evidence</span>
    <span class="pull-request-readiness-value">Pull request evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderPullRequestReadinessBlocker(blocker) {
  return `<div class="pull-request-readiness-row">
    <span class="pull-request-readiness-label">Blocker</span>
    <span class="pull-request-readiness-value">Pull request blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderReviewEvidenceSummaryItem(item) {
  return `<div class="review-evidence-summary-row">
    <span class="review-evidence-summary-label">Evidence item</span>
    <span class="review-evidence-summary-value">Review evidence item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.detail)}</span>
  </div>`;
}

function renderReviewEvidenceSummaryEvidence(evidence) {
  return `<div class="review-evidence-summary-row">
    <span class="review-evidence-summary-label">Evidence</span>
    <span class="review-evidence-summary-value">Review evidence proof: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderReviewEvidenceSummaryBlocker(blocker) {
  return `<div class="review-evidence-summary-row">
    <span class="review-evidence-summary-label">Blocker</span>
    <span class="review-evidence-summary-value">Review evidence blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderMergeReadinessCheck(check) {
  return `<div class="merge-readiness-row">
    <span class="merge-readiness-label">Check</span>
    <span class="merge-readiness-value">Merge readiness check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)} - ${escapeHtml(check.detail)}</span>
  </div>`;
}

function renderMergeReadinessEvidence(evidence) {
  return `<div class="merge-readiness-row">
    <span class="merge-readiness-label">Evidence</span>
    <span class="merge-readiness-value">Merge readiness evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderMergeReadinessBlocker(blocker) {
  return `<div class="merge-readiness-row">
    <span class="merge-readiness-label">Blocker</span>
    <span class="merge-readiness-value">Merge readiness blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderRepositoryCollaborationAggregateItem(item) {
  return `<div class="repository-collaboration-aggregate-row">
    <span class="repository-collaboration-aggregate-label">Workflow</span>
    <span class="repository-collaboration-aggregate-value">Repository collaboration aggregate item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.ready)} - ${escapeHtml(item.detail)}</span>
  </div>`;
}

function renderRepositoryCollaborationAggregateEvidence(evidence) {
  return `<div class="repository-collaboration-aggregate-row">
    <span class="repository-collaboration-aggregate-label">Evidence</span>
    <span class="repository-collaboration-aggregate-value">Repository collaboration aggregate evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderRepositoryCollaborationAggregateBlocker(blocker) {
  return `<div class="repository-collaboration-aggregate-row">
    <span class="repository-collaboration-aggregate-label">Blocker</span>
    <span class="repository-collaboration-aggregate-value">Repository collaboration aggregate blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderRepositoryCollaborationFinalClosureCheck(check) {
  return `<div class="repository-collaboration-final-closure-row">
    <span class="repository-collaboration-final-closure-label">Check</span>
    <span class="repository-collaboration-final-closure-value">Repository collaboration final closure check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)} - ${escapeHtml(check.detail)}</span>
  </div>`;
}

function renderRepositoryCollaborationFinalClosureEvidence(evidence) {
  return `<div class="repository-collaboration-final-closure-row">
    <span class="repository-collaboration-final-closure-label">Evidence</span>
    <span class="repository-collaboration-final-closure-value">Repository collaboration final closure evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderRepositoryCollaborationFinalClosureBlocker(blocker) {
  return `<div class="repository-collaboration-final-closure-row">
    <span class="repository-collaboration-final-closure-label">Blocker</span>
    <span class="repository-collaboration-final-closure-value">Repository collaboration final closure blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderPullRequestReviewPackageItem(item) {
  return `<div class="pull-request-review-package-row">
    <span class="pull-request-review-package-label">Review item</span>
    <span class="pull-request-review-package-value">Pull request review package item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.detail)}</span>
  </div>`;
}

function renderPullRequestReviewPackageEvidence(evidence) {
  return `<div class="pull-request-review-package-row">
    <span class="pull-request-review-package-label">Evidence</span>
    <span class="pull-request-review-package-value">Pull request review package evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderPullRequestReviewPackageBlocker(blocker) {
  return `<div class="pull-request-review-package-row">
    <span class="pull-request-review-package-label">Blocker</span>
    <span class="pull-request-review-package-value">Pull request review package blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderCiEvidenceSummaryItem(item) {
  return `<div class="ci-evidence-summary-row">
    <span class="ci-evidence-summary-label">CI item</span>
    <span class="ci-evidence-summary-value">CI evidence summary item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.detail)}</span>
  </div>`;
}

function renderCiEvidenceSummaryEvidence(evidence) {
  return `<div class="ci-evidence-summary-row">
    <span class="ci-evidence-summary-label">Evidence</span>
    <span class="ci-evidence-summary-value">CI evidence summary evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderCiEvidenceSummaryBlocker(blocker) {
  return `<div class="ci-evidence-summary-row">
    <span class="ci-evidence-summary-label">Blocker</span>
    <span class="ci-evidence-summary-value">CI evidence summary blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderMainMergePlanItem(item) {
  return `<div class="main-merge-plan-row">
    <span class="main-merge-plan-label">Plan item</span>
    <span class="main-merge-plan-value">Main merge plan item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.detail)}</span>
  </div>`;
}

function renderMainMergePlanEvidence(evidence) {
  return `<div class="main-merge-plan-row">
    <span class="main-merge-plan-label">Evidence</span>
    <span class="main-merge-plan-value">Main merge plan evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderMainMergePlanBlocker(blocker) {
  return `<div class="main-merge-plan-row">
    <span class="main-merge-plan-label">Blocker</span>
    <span class="main-merge-plan-value">Main merge plan blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderReleaseTagReadinessItem(item) {
  return `<div class="release-tag-readiness-row">
    <span class="release-tag-readiness-label">Tag item</span>
    <span class="release-tag-readiness-value">Release tag readiness item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.detail)}</span>
  </div>`;
}

function renderReleaseTagReadinessEvidence(evidence) {
  return `<div class="release-tag-readiness-row">
    <span class="release-tag-readiness-label">Evidence</span>
    <span class="release-tag-readiness-value">Release tag readiness evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderReleaseTagReadinessBlocker(blocker) {
  return `<div class="release-tag-readiness-row">
    <span class="release-tag-readiness-label">Blocker</span>
    <span class="release-tag-readiness-value">Release tag readiness blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderMainlineAggregateSummaryItem(item) {
  return `<div class="mainline-aggregate-summary-row">
    <span class="mainline-aggregate-summary-label">Workflow item</span>
    <span class="mainline-aggregate-summary-value">Mainline aggregate summary item: ${escapeHtml(item.label)} - ${escapeHtml(item.status)} - ${escapeHtml(item.detail)}</span>
  </div>`;
}

function renderMainlineAggregateSummaryEvidence(evidence) {
  return `<div class="mainline-aggregate-summary-row">
    <span class="mainline-aggregate-summary-label">Evidence</span>
    <span class="mainline-aggregate-summary-value">Mainline aggregate summary evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderMainlineAggregateSummaryBlocker(blocker) {
  return `<div class="mainline-aggregate-summary-row">
    <span class="mainline-aggregate-summary-label">Blocker</span>
    <span class="mainline-aggregate-summary-value">Mainline aggregate summary blocker: ${escapeHtml(blocker)}</span>
  </div>`;
}

function renderMainlineFinalClosureCheck(check) {
  return `<div class="mainline-final-closure-row">
    <span class="mainline-final-closure-label">Closure check</span>
    <span class="mainline-final-closure-value">Mainline final closure check: ${escapeHtml(check.label)} - ${escapeHtml(check.status)} - ${escapeHtml(check.detail)}</span>
  </div>`;
}

function renderMainlineFinalClosureEvidence(evidence) {
  return `<div class="mainline-final-closure-row">
    <span class="mainline-final-closure-label">Evidence</span>
    <span class="mainline-final-closure-value">Mainline final closure evidence: ${escapeHtml(evidence)}</span>
  </div>`;
}

function renderMainlineFinalClosureBlocker(blocker) {
  return `<div class="mainline-final-closure-row">
    <span class="mainline-final-closure-label">Blocker</span>
    <span class="mainline-final-closure-value">Mainline final closure blocker: ${escapeHtml(blocker)}</span>
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

function renderContextPackHandoffSource(source) {
  return `
    <div class="usage-step">
      <span class="usage-step-label">Context Pack handoff source: ${escapeHtml(source.type)} ${escapeHtml(source.id)}</span>
      <span class="usage-step-detail">Context Pack handoff source detail: ${escapeHtml(source.status)} from ${escapeHtml(source.source)}</span>
    </div>
  `;
}

function renderAgentContextReadinessCheck(check) {
  return `
    <div class="usage-step">
      <span class="usage-step-label">Agent context readiness check: ${escapeHtml(check.label)}</span>
      <span class="usage-step-detail">Agent context readiness detail: ${escapeHtml(check.status)} - ${escapeHtml(check.detail)}</span>
    </div>
  `;
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
