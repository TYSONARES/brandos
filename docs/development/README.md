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
33. `release-v1.4-workflow-transition-plan.md`
34. `closure-v1.4-workflow-transition-plan.md`
35. `iteration-v1.4-command-result-summary.md`
36. `release-v1.4-command-result-summary.md`
37. `closure-v1.4-command-result-summary.md`
38. `iteration-v1.2-agent-handoff-context.md`
39. `release-v1.2-agent-handoff-context.md`
40. `closure-v1.2-agent-handoff-context.md`
41. `iteration-v1.2-agent-prompt-plan.md`
42. `release-v1.2-agent-prompt-plan.md`
43. `closure-v1.2-agent-prompt-plan.md`
44. `iteration-v1.2-agent-draft-execution.md`
45. `release-v1.2-agent-draft-execution.md`
46. `closure-v1.2-agent-draft-execution.md`
47. `iteration-v1.2-draft-review.md`
48. `release-v1.2-draft-review.md`
49. `closure-v1.2-draft-review.md`
50. `iteration-v1.2-agent-handoff-closure.md`
51. `release-v1.2-agent-handoff-closure.md`
52. `closure-v1.2-agent-handoff-closure.md`
53. `iteration-v1.2-agent-handoff-runtime-summary.md`
54. `release-v1.2-agent-handoff-runtime-summary.md`
55. `closure-v1.2-agent-handoff-runtime-summary.md`
56. `iteration-v1.2-agent-handoff-runtime-aggregate-summary.md`
57. `release-v1.2-agent-handoff-runtime-aggregate-summary.md`
58. `closure-v1.2-agent-handoff-runtime-aggregate-summary.md`
59. `iteration-v1.2-agent-handoff-runtime-final-closure.md`
60. `release-v1.2-agent-handoff-runtime-final-closure.md`
61. `closure-v1.2-agent-handoff-runtime-final-closure.md`
62. `release-v1.2-aggregate-summary.md`
63. `closure-v1.2-aggregate-summary.md`
64. `release-v1.2-final-closure.md`
65. `closure-v1.2-final-closure.md`
66. `iteration-v1.1-operator-run-model.md`
67. `release-v1.1-operator-run-model.md`
68. `closure-v1.1-operator-run-model.md`
69. `iteration-v1.1-operator-run-queue.md`
70. `release-v1.1-operator-run-queue.md`
71. `closure-v1.1-operator-run-queue.md`
72. `iteration-v1.1-operator-runbook-execution.md`
73. `release-v1.1-operator-runbook-execution.md`
74. `closure-v1.1-operator-runbook-execution.md`
75. `iteration-v1.1-handoff-acceptance.md`
76. `release-v1.1-handoff-acceptance.md`
77. `closure-v1.1-handoff-acceptance.md`
78. `release-v1.1-aggregate-summary.md`
79. `closure-v1.1-aggregate-summary.md`
80. `release-v1.1-final-closure.md`
81. `closure-v1.1-final-closure.md`
82. `iteration-post-v1-workflow-actions.md`
83. `release-post-v1-workflow-actions.md`
84. `closure-post-v1-workflow-actions.md`
85. `iteration-post-v1-durable-studio-state.md`
86. `release-post-v1-durable-studio-state.md`
87. `closure-post-v1-durable-studio-state.md`
88. `iteration-post-v1-studio-state-inspection.md`
89. `release-post-v1-studio-state-inspection.md`
90. `closure-post-v1-studio-state-inspection.md`
91. `iteration-post-v1-studio-diagnostics.md`
92. `release-post-v1-studio-diagnostics.md`
93. `closure-post-v1-studio-diagnostics.md`
94. `iteration-post-v1-operator-guidance.md`
95. `release-post-v1-operator-guidance.md`
96. `closure-post-v1-operator-guidance.md`
97. `iteration-post-v1-operator-workflow.md`
98. `release-post-v1-operator-workflow.md`
99. `closure-post-v1-operator-workflow.md`
100. `iteration-post-v1-operator-workflow-execution-controls.md`
101. `release-post-v1-operator-workflow-execution-controls.md`
102. `closure-post-v1-operator-workflow-execution-controls.md`
103. `iteration-post-v1-context-pack-usage-flow.md`
104. `release-post-v1-context-pack-usage-flow.md`
105. `closure-post-v1-context-pack-usage-flow.md`
106. `iteration-post-v1-multi-action-workflow-state.md`
107. `release-post-v1-multi-action-workflow-state.md`
108. `closure-post-v1-multi-action-workflow-state.md`
109. `iteration-post-v1-review-resolution-workflow.md`
110. `release-post-v1-review-resolution-workflow.md`
111. `closure-post-v1-review-resolution-workflow.md`
112. `iteration-post-v1-studio-workflow-audit-trail.md`
113. `release-post-v1-studio-workflow-audit-trail.md`
114. `closure-post-v1-studio-workflow-audit-trail.md`
115. `iteration-post-v1-operator-handoff.md`
116. `release-post-v1-operator-handoff.md`
117. `closure-post-v1-operator-handoff.md`
118. `release-post-v1-aggregate-summary.md`
119. `closure-post-v1-aggregate-summary.md`
120. `release-post-v1-final-closure.md`
121. `closure-post-v1-final-closure.md`

## Dependency

Development Ready v1.0 depends on Product Core v0.2, Design System v0.3, AI Agents v0.4,
Architecture v0.5, and Infrastructure v0.6.

## Maintenance Rule

Every runtime source file must map back to an approved product, design, AI, architecture, or infrastructure contract.
