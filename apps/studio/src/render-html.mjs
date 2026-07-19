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
