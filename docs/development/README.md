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
12. `iteration-v1.3-runtime-health-summary.md`
13. `release-v1.3-runtime-health-summary.md`
14. `closure-v1.3-runtime-health-summary.md`
15. `iteration-v1.3-studio-state-recovery.md`
16. `release-v1.3-studio-state-recovery.md`
17. `closure-v1.3-studio-state-recovery.md`
18. `iteration-v1.3-runtime-validation-signals.md`
19. `release-v1.3-runtime-validation-signals.md`
20. `closure-v1.3-runtime-validation-signals.md`
21. `iteration-v1.2-agent-handoff-context.md`
22. `release-v1.2-agent-handoff-context.md`
23. `closure-v1.2-agent-handoff-context.md`
24. `iteration-v1.2-agent-prompt-plan.md`
25. `release-v1.2-agent-prompt-plan.md`
26. `closure-v1.2-agent-prompt-plan.md`
27. `iteration-v1.2-agent-draft-execution.md`
28. `release-v1.2-agent-draft-execution.md`
29. `closure-v1.2-agent-draft-execution.md`
30. `iteration-v1.2-draft-review.md`
31. `release-v1.2-draft-review.md`
32. `closure-v1.2-draft-review.md`
33. `iteration-v1.2-agent-handoff-closure.md`
34. `release-v1.2-agent-handoff-closure.md`
35. `closure-v1.2-agent-handoff-closure.md`
36. `iteration-v1.2-agent-handoff-runtime-summary.md`
37. `release-v1.2-agent-handoff-runtime-summary.md`
38. `closure-v1.2-agent-handoff-runtime-summary.md`
39. `iteration-v1.2-agent-handoff-runtime-aggregate-summary.md`
40. `release-v1.2-agent-handoff-runtime-aggregate-summary.md`
41. `closure-v1.2-agent-handoff-runtime-aggregate-summary.md`
42. `iteration-v1.2-agent-handoff-runtime-final-closure.md`
43. `release-v1.2-agent-handoff-runtime-final-closure.md`
44. `closure-v1.2-agent-handoff-runtime-final-closure.md`
45. `release-v1.2-aggregate-summary.md`
46. `closure-v1.2-aggregate-summary.md`
47. `release-v1.2-final-closure.md`
48. `closure-v1.2-final-closure.md`
49. `iteration-v1.1-operator-run-model.md`
50. `release-v1.1-operator-run-model.md`
51. `closure-v1.1-operator-run-model.md`
52. `iteration-v1.1-operator-run-queue.md`
53. `release-v1.1-operator-run-queue.md`
54. `closure-v1.1-operator-run-queue.md`
55. `iteration-v1.1-operator-runbook-execution.md`
56. `release-v1.1-operator-runbook-execution.md`
57. `closure-v1.1-operator-runbook-execution.md`
58. `iteration-v1.1-handoff-acceptance.md`
59. `release-v1.1-handoff-acceptance.md`
60. `closure-v1.1-handoff-acceptance.md`
61. `release-v1.1-aggregate-summary.md`
62. `closure-v1.1-aggregate-summary.md`
63. `release-v1.1-final-closure.md`
64. `closure-v1.1-final-closure.md`
65. `iteration-post-v1-workflow-actions.md`
66. `release-post-v1-workflow-actions.md`
67. `closure-post-v1-workflow-actions.md`
68. `iteration-post-v1-durable-studio-state.md`
69. `release-post-v1-durable-studio-state.md`
70. `closure-post-v1-durable-studio-state.md`
71. `iteration-post-v1-studio-state-inspection.md`
72. `release-post-v1-studio-state-inspection.md`
73. `closure-post-v1-studio-state-inspection.md`
74. `iteration-post-v1-studio-diagnostics.md`
75. `release-post-v1-studio-diagnostics.md`
76. `closure-post-v1-studio-diagnostics.md`
77. `iteration-post-v1-operator-guidance.md`
78. `release-post-v1-operator-guidance.md`
79. `closure-post-v1-operator-guidance.md`
80. `iteration-post-v1-operator-workflow.md`
81. `release-post-v1-operator-workflow.md`
82. `closure-post-v1-operator-workflow.md`
83. `iteration-post-v1-operator-workflow-execution-controls.md`
84. `release-post-v1-operator-workflow-execution-controls.md`
85. `closure-post-v1-operator-workflow-execution-controls.md`
86. `iteration-post-v1-context-pack-usage-flow.md`
87. `release-post-v1-context-pack-usage-flow.md`
88. `closure-post-v1-context-pack-usage-flow.md`
89. `iteration-post-v1-multi-action-workflow-state.md`
90. `release-post-v1-multi-action-workflow-state.md`
91. `closure-post-v1-multi-action-workflow-state.md`
92. `iteration-post-v1-review-resolution-workflow.md`
93. `release-post-v1-review-resolution-workflow.md`
94. `closure-post-v1-review-resolution-workflow.md`
95. `iteration-post-v1-studio-workflow-audit-trail.md`
96. `release-post-v1-studio-workflow-audit-trail.md`
97. `closure-post-v1-studio-workflow-audit-trail.md`
98. `iteration-post-v1-operator-handoff.md`
99. `release-post-v1-operator-handoff.md`
100. `closure-post-v1-operator-handoff.md`
101. `release-post-v1-aggregate-summary.md`
102. `closure-post-v1-aggregate-summary.md`
103. `release-post-v1-final-closure.md`
104. `closure-post-v1-final-closure.md`

## Dependency

Development Ready v1.0 depends on Product Core v0.2, Design System v0.3, AI Agents v0.4,
Architecture v0.5, and Infrastructure v0.6.

## Maintenance Rule

Every runtime source file must map back to an approved product, design, AI, architecture, or infrastructure contract.
