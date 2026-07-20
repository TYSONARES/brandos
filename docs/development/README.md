# Development Index

Development Ready v1.0 turns the repository definition into an implementation-ready baseline.

## Status

- Released baseline: Development Ready v1.0
- Latest completed implementation cycle: Agent Handoff Runtime v1.2
- Active workstream: Runtime Reliability v1.3
- Current goal: harden local Studio runtime state, recovery, and validation signals

## Read Order

1. `v1.0-scope.md`
2. `local-setup.md`
3. `repository-layout.md`
4. `runtime-baseline.md`
5. `app-shell.md`
6. `package-boundaries.md`
7. `quality-gates.md`
8. `release-v1.0.0.md`
9. `v1.1-scope.md`
10. `v1.2-scope.md`
11. `v1.3-scope.md`
12. `iteration-v1.2-agent-handoff-context.md`
13. `release-v1.2-agent-handoff-context.md`
14. `closure-v1.2-agent-handoff-context.md`
15. `iteration-v1.2-agent-prompt-plan.md`
16. `release-v1.2-agent-prompt-plan.md`
17. `closure-v1.2-agent-prompt-plan.md`
18. `iteration-v1.2-agent-draft-execution.md`
19. `release-v1.2-agent-draft-execution.md`
20. `closure-v1.2-agent-draft-execution.md`
21. `iteration-v1.2-draft-review.md`
22. `release-v1.2-draft-review.md`
23. `closure-v1.2-draft-review.md`
24. `iteration-v1.2-agent-handoff-closure.md`
25. `release-v1.2-agent-handoff-closure.md`
26. `closure-v1.2-agent-handoff-closure.md`
27. `iteration-v1.2-agent-handoff-runtime-summary.md`
28. `release-v1.2-agent-handoff-runtime-summary.md`
29. `closure-v1.2-agent-handoff-runtime-summary.md`
30. `iteration-v1.2-agent-handoff-runtime-aggregate-summary.md`
31. `release-v1.2-agent-handoff-runtime-aggregate-summary.md`
32. `closure-v1.2-agent-handoff-runtime-aggregate-summary.md`
33. `iteration-v1.2-agent-handoff-runtime-final-closure.md`
34. `release-v1.2-agent-handoff-runtime-final-closure.md`
35. `closure-v1.2-agent-handoff-runtime-final-closure.md`
36. `release-v1.2-aggregate-summary.md`
37. `closure-v1.2-aggregate-summary.md`
38. `release-v1.2-final-closure.md`
39. `closure-v1.2-final-closure.md`
40. `iteration-v1.1-operator-run-model.md`
41. `release-v1.1-operator-run-model.md`
42. `closure-v1.1-operator-run-model.md`
43. `iteration-v1.1-operator-run-queue.md`
44. `release-v1.1-operator-run-queue.md`
45. `closure-v1.1-operator-run-queue.md`
46. `iteration-v1.1-operator-runbook-execution.md`
47. `release-v1.1-operator-runbook-execution.md`
48. `closure-v1.1-operator-runbook-execution.md`
49. `iteration-v1.1-handoff-acceptance.md`
50. `release-v1.1-handoff-acceptance.md`
51. `closure-v1.1-handoff-acceptance.md`
52. `release-v1.1-aggregate-summary.md`
53. `closure-v1.1-aggregate-summary.md`
54. `release-v1.1-final-closure.md`
55. `closure-v1.1-final-closure.md`
56. `iteration-post-v1-workflow-actions.md`
57. `release-post-v1-workflow-actions.md`
58. `closure-post-v1-workflow-actions.md`
59. `iteration-post-v1-durable-studio-state.md`
60. `release-post-v1-durable-studio-state.md`
61. `closure-post-v1-durable-studio-state.md`
62. `iteration-post-v1-studio-state-inspection.md`
63. `release-post-v1-studio-state-inspection.md`
64. `closure-post-v1-studio-state-inspection.md`
65. `iteration-post-v1-studio-diagnostics.md`
66. `release-post-v1-studio-diagnostics.md`
67. `closure-post-v1-studio-diagnostics.md`
68. `iteration-post-v1-operator-guidance.md`
69. `release-post-v1-operator-guidance.md`
70. `closure-post-v1-operator-guidance.md`
71. `iteration-post-v1-operator-workflow.md`
72. `release-post-v1-operator-workflow.md`
73. `closure-post-v1-operator-workflow.md`
74. `iteration-post-v1-operator-workflow-execution-controls.md`
75. `release-post-v1-operator-workflow-execution-controls.md`
76. `closure-post-v1-operator-workflow-execution-controls.md`
77. `iteration-post-v1-context-pack-usage-flow.md`
78. `release-post-v1-context-pack-usage-flow.md`
79. `closure-post-v1-context-pack-usage-flow.md`
80. `iteration-post-v1-multi-action-workflow-state.md`
81. `release-post-v1-multi-action-workflow-state.md`
82. `closure-post-v1-multi-action-workflow-state.md`
83. `iteration-post-v1-review-resolution-workflow.md`
84. `release-post-v1-review-resolution-workflow.md`
85. `closure-post-v1-review-resolution-workflow.md`
86. `iteration-post-v1-studio-workflow-audit-trail.md`
87. `release-post-v1-studio-workflow-audit-trail.md`
88. `closure-post-v1-studio-workflow-audit-trail.md`
89. `iteration-post-v1-operator-handoff.md`
90. `release-post-v1-operator-handoff.md`
91. `closure-post-v1-operator-handoff.md`
92. `release-post-v1-aggregate-summary.md`
93. `closure-post-v1-aggregate-summary.md`
94. `release-post-v1-final-closure.md`
95. `closure-post-v1-final-closure.md`

## Dependency

Development Ready v1.0 depends on Product Core v0.2, Design System v0.3, AI Agents v0.4,
Architecture v0.5, and Infrastructure v0.6.

## Maintenance Rule

Every runtime source file must map back to an approved product, design, AI, architecture, or infrastructure contract.
