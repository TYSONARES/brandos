export function renderStudioHtml(shell) {
  const readinessTone = shell.contextPackReadiness.ready ? 'ready' : 'blocked';
  const blockingItems = shell.contextPackReadiness.blockingReasons
    .map((reason) => `<li>${escapeHtml(reason)}</li>`)
    .join('');
  const actionItems = shell.contextPackWorkflow.nextActions
    .map((action) => `<li><strong>${escapeHtml(action.status)}</strong>: ${escapeHtml(action.label)}</li>`)
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
    @media (max-width: 760px) {
      header, .workflow-grid { display: block; }
      .status { margin-top: 16px; }
      .grid { grid-template-columns: 1fr; }
      .panel { margin-bottom: 12px; }
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
        <p class="meta">Owner: ${escapeHtml(shell.contextPackWorkflow.owner)}</p>
        <div class="actions">
          <h2>Next action</h2>
          <ul>${actionItems}</ul>
        </div>
      </article>
    </section>
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
