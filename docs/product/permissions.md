# Permissions

## Baseline Roles

| Role | Can View | Can Draft | Can Approve | Can Admin |
| --- | --- | --- | --- | --- |
| Owner | yes | yes | yes | yes |
| Strategist | yes | yes | proposed only | no |
| Designer | yes | limited | no | no |
| Operator | yes | yes | workflow only | limited |
| Viewer | yes | no | no | no |
| AI Agent | scoped | scoped | no | no |

## Permission Rule

AI Agents can only access the context explicitly granted by a Workspace, task, or Context Pack.
