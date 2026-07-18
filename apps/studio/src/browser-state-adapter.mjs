export const DEFAULT_WORKFLOW_ACTION_STATE_KEY = 'brandos.workflow.completedActionId';

export function createBrowserWorkflowStateAdapterScript(options = {}) {
  const storageKey = options.storageKey ?? DEFAULT_WORKFLOW_ACTION_STATE_KEY;

  return `<script>
    (() => {
      const storageKey = ${JSON.stringify(storageKey)};
      const params = new URLSearchParams(window.location.search);
      const completedActionId = params.get('actionId') || params.get('completedWorkflowActionId');

      if (completedActionId) {
        window.localStorage.setItem(storageKey, completedActionId);
      }

      const storedActionId = window.localStorage.getItem(storageKey);
      document.querySelectorAll('[data-local-completed-action]').forEach((node) => {
        node.textContent = storedActionId || node.textContent;
      });

      document.querySelectorAll('[data-clear-workflow-state]').forEach((control) => {
        control.addEventListener('click', () => {
          window.localStorage.removeItem(storageKey);
          window.location.href = 'index.html';
        });
      });
    })();
  </script>`;
}
