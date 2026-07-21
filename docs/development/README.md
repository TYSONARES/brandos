# Development Index

Development Ready v1.0 turns the repository definition into an implementation-ready baseline.

## Status

- Released baseline: Development Ready v1.0
- Latest completed implementation cycle: Runtime Reliability v1.3
- Active workstream: Studio Workflow Runtime v1.4
- Current goal: make Studio workflow sessions, transitions, command outcomes, and handoffs deterministic

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
22. `release-v1.3-operator-recovery-guidance.md`
23. `closure-v1.3-operator-recovery-guidance.md`
24. `release-v1.3-aggregate-summary.md`
25. `closure-v1.3-aggregate-summary.md`
26. `release-v1.3-final-closure.md`
27. `closure-v1.3-final-closure.md`
28. `v1.4-scope.md`
29. `iteration-v1.4-workflow-session-summary.md`
30. `release-v1.4-workflow-session-summary.md`
31. `closure-v1.4-workflow-session-summary.md`
32. `iteration-v1.4-workflow-transition-plan.md`
33. `iteration-v1.2-agent-handoff-context.md`
34. `release-v1.2-agent-handoff-context.md`
35. `closure-v1.2-agent-handoff-context.md`
36. `iteration-v1.2-agent-prompt-plan.md`
37. `release-v1.2-agent-prompt-plan.md`
38. `closure-v1.2-agent-prompt-plan.md`
39. `iteration-v1.2-agent-draft-execution.md`
40. `release-v1.2-agent-draft-execution.md`
41. `closure-v1.2-agent-draft-execution.md`
42. `iteration-v1.2-draft-review.md`
43. `release-v1.2-draft-review.md`
44. `closure-v1.2-draft-review.md`
45. `iteration-v1.2-agent-handoff-closure.md`
46. `release-v1.2-agent-handoff-closure.md`
47. `closure-v1.2-agent-handoff-closure.md`
48. `iteration-v1.2-agent-handoff-runtime-summary.md`
49. `release-v1.2-agent-handoff-runtime-summary.md`
50. `closure-v1.2-agent-handoff-runtime-summary.md`
51. `iteration-v1.2-agent-handoff-runtime-aggregate-summary.md`
52. `release-v1.2-agent-handoff-runtime-aggregate-summary.md`
53. `closure-v1.2-agent-handoff-runtime-aggregate-summary.md`
54. `iteration-v1.2-agent-handoff-runtime-final-closure.md`
55. `release-v1.2-agent-handoff-runtime-final-closure.md`
56. `closure-v1.2-agent-handoff-runtime-final-closure.md`
57. `release-v1.2-aggregate-summary.md`
58. `closure-v1.2-aggregate-summary.md`
59. `release-v1.2-final-closure.md`
60. `closure-v1.2-final-closure.md`
61. `iteration-v1.1-operator-run-model.md`
62. `release-v1.1-operator-run-model.md`
63. `closure-v1.1-operator-run-model.md`
64. `iteration-v1.1-operator-run-queue.md`
65. `release-v1.1-operator-run-queue.md`
66. `closure-v1.1-operator-run-queue.md`
67. `iteration-v1.1-operator-runbook-execution.md`
68. `release-v1.1-operator-runbook-execution.md`
69. `closure-v1.1-operator-runbook-execution.md`
70. `iteration-v1.1-handoff-acceptance.md`
71. `release-v1.1-handoff-acceptance.md`
72. `closure-v1.1-handoff-acceptance.md`
73. `release-v1.1-aggregate-summary.md`
74. `closure-v1.1-aggregate-summary.md`
75. `release-v1.1-final-closure.md`
76. `closure-v1.1-final-closure.md`
77. `iteration-post-v1-workflow-actions.md`
78. `release-post-v1-workflow-actions.md`
79. `closure-post-v1-workflow-actions.md`
80. `iteration-post-v1-durable-studio-state.md`
81. `release-post-v1-durable-studio-state.md`
82. `closure-post-v1-durable-studio-state.md`
83. `iteration-post-v1-studio-state-inspection.md`
84. `release-post-v1-studio-state-inspection.md`
85. `closure-post-v1-studio-state-inspection.md`
86. `iteration-post-v1-studio-diagnostics.md`
87. `release-post-v1-studio-diagnostics.md`
88. `closure-post-v1-studio-diagnostics.md`
89. `iteration-post-v1-operator-guidance.md`
90. `release-post-v1-operator-guidance.md`
91. `closure-post-v1-operator-guidance.md`
92. `iteration-post-v1-operator-workflow.md`
93. `release-post-v1-operator-workflow.md`
94. `closure-post-v1-operator-workflow.md`
95. `iteration-post-v1-operator-workflow-execution-controls.md`
96. `release-post-v1-operator-workflow-execution-controls.md`
97. `closure-post-v1-operator-workflow-execution-controls.md`
98. `iteration-post-v1-context-pack-usage-flow.md`
99. `release-post-v1-context-pack-usage-flow.md`
100. `closure-post-v1-context-pack-usage-flow.md`
101. `iteration-post-v1-multi-action-workflow-state.md`
102. `release-post-v1-multi-action-workflow-state.md`
103. `closure-post-v1-multi-action-workflow-state.md`
104. `iteration-post-v1-review-resolution-workflow.md`
105. `release-post-v1-review-resolution-workflow.md`
106. `closure-post-v1-review-resolution-workflow.md`
107. `iteration-post-v1-studio-workflow-audit-trail.md`
108. `release-post-v1-studio-workflow-audit-trail.md`
109. `closure-post-v1-studio-workflow-audit-trail.md`
110. `iteration-post-v1-operator-handoff.md`
111. `release-post-v1-operator-handoff.md`
112. `closure-post-v1-operator-handoff.md`
113. `release-post-v1-aggregate-summary.md`
114. `closure-post-v1-aggregate-summary.md`
115. `release-post-v1-final-closure.md`
116. `closure-post-v1-final-closure.md`

## Dependency

Development Ready v1.0 depends on Product Core v0.2, Design System v0.3, AI Agents v0.4,
Architecture v0.5, and Infrastructure v0.6.

## Maintenance Rule

Every runtime source file must map back to an approved product, design, AI, architecture, or infrastructure contract.
