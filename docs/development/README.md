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
21. `iteration-v1.3-operator-recovery-guidance.md`
22. `iteration-v1.2-agent-handoff-context.md`
23. `release-v1.2-agent-handoff-context.md`
24. `closure-v1.2-agent-handoff-context.md`
25. `iteration-v1.2-agent-prompt-plan.md`
26. `release-v1.2-agent-prompt-plan.md`
27. `closure-v1.2-agent-prompt-plan.md`
28. `iteration-v1.2-agent-draft-execution.md`
29. `release-v1.2-agent-draft-execution.md`
30. `closure-v1.2-agent-draft-execution.md`
31. `iteration-v1.2-draft-review.md`
32. `release-v1.2-draft-review.md`
33. `closure-v1.2-draft-review.md`
34. `iteration-v1.2-agent-handoff-closure.md`
35. `release-v1.2-agent-handoff-closure.md`
36. `closure-v1.2-agent-handoff-closure.md`
37. `iteration-v1.2-agent-handoff-runtime-summary.md`
38. `release-v1.2-agent-handoff-runtime-summary.md`
39. `closure-v1.2-agent-handoff-runtime-summary.md`
40. `iteration-v1.2-agent-handoff-runtime-aggregate-summary.md`
41. `release-v1.2-agent-handoff-runtime-aggregate-summary.md`
42. `closure-v1.2-agent-handoff-runtime-aggregate-summary.md`
43. `iteration-v1.2-agent-handoff-runtime-final-closure.md`
44. `release-v1.2-agent-handoff-runtime-final-closure.md`
45. `closure-v1.2-agent-handoff-runtime-final-closure.md`
46. `release-v1.2-aggregate-summary.md`
47. `closure-v1.2-aggregate-summary.md`
48. `release-v1.2-final-closure.md`
49. `closure-v1.2-final-closure.md`
50. `iteration-v1.1-operator-run-model.md`
51. `release-v1.1-operator-run-model.md`
52. `closure-v1.1-operator-run-model.md`
53. `iteration-v1.1-operator-run-queue.md`
54. `release-v1.1-operator-run-queue.md`
55. `closure-v1.1-operator-run-queue.md`
56. `iteration-v1.1-operator-runbook-execution.md`
57. `release-v1.1-operator-runbook-execution.md`
58. `closure-v1.1-operator-runbook-execution.md`
59. `iteration-v1.1-handoff-acceptance.md`
60. `release-v1.1-handoff-acceptance.md`
61. `closure-v1.1-handoff-acceptance.md`
62. `release-v1.1-aggregate-summary.md`
63. `closure-v1.1-aggregate-summary.md`
64. `release-v1.1-final-closure.md`
65. `closure-v1.1-final-closure.md`
66. `iteration-post-v1-workflow-actions.md`
67. `release-post-v1-workflow-actions.md`
68. `closure-post-v1-workflow-actions.md`
69. `iteration-post-v1-durable-studio-state.md`
70. `release-post-v1-durable-studio-state.md`
71. `closure-post-v1-durable-studio-state.md`
72. `iteration-post-v1-studio-state-inspection.md`
73. `release-post-v1-studio-state-inspection.md`
74. `closure-post-v1-studio-state-inspection.md`
75. `iteration-post-v1-studio-diagnostics.md`
76. `release-post-v1-studio-diagnostics.md`
77. `closure-post-v1-studio-diagnostics.md`
78. `iteration-post-v1-operator-guidance.md`
79. `release-post-v1-operator-guidance.md`
80. `closure-post-v1-operator-guidance.md`
81. `iteration-post-v1-operator-workflow.md`
82. `release-post-v1-operator-workflow.md`
83. `closure-post-v1-operator-workflow.md`
84. `iteration-post-v1-operator-workflow-execution-controls.md`
85. `release-post-v1-operator-workflow-execution-controls.md`
86. `closure-post-v1-operator-workflow-execution-controls.md`
87. `iteration-post-v1-context-pack-usage-flow.md`
88. `release-post-v1-context-pack-usage-flow.md`
89. `closure-post-v1-context-pack-usage-flow.md`
90. `iteration-post-v1-multi-action-workflow-state.md`
91. `release-post-v1-multi-action-workflow-state.md`
92. `closure-post-v1-multi-action-workflow-state.md`
93. `iteration-post-v1-review-resolution-workflow.md`
94. `release-post-v1-review-resolution-workflow.md`
95. `closure-post-v1-review-resolution-workflow.md`
96. `iteration-post-v1-studio-workflow-audit-trail.md`
97. `release-post-v1-studio-workflow-audit-trail.md`
98. `closure-post-v1-studio-workflow-audit-trail.md`
99. `iteration-post-v1-operator-handoff.md`
100. `release-post-v1-operator-handoff.md`
101. `closure-post-v1-operator-handoff.md`
102. `release-post-v1-aggregate-summary.md`
103. `closure-post-v1-aggregate-summary.md`
104. `release-post-v1-final-closure.md`
105. `closure-post-v1-final-closure.md`

## Dependency

Development Ready v1.0 depends on Product Core v0.2, Design System v0.3, AI Agents v0.4,
Architecture v0.5, and Infrastructure v0.6.

## Maintenance Rule

Every runtime source file must map back to an approved product, design, AI, architecture, or infrastructure contract.
