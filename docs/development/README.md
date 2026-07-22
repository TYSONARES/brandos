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
38. `iteration-v1.4-studio-workflow-runtime-aggregate-summary.md`
39. `release-v1.4-studio-workflow-runtime-aggregate-summary.md`
40. `closure-v1.4-studio-workflow-runtime-aggregate-summary.md`
41. `iteration-v1.4-studio-workflow-runtime-final-closure.md`
42. `release-v1.4-studio-workflow-runtime-final-closure.md`
43. `closure-v1.4-studio-workflow-runtime-final-closure.md`
44. `release-v1.4-aggregate-summary.md`
45. `closure-v1.4-aggregate-summary.md`
46. `release-v1.4-final-closure.md`
47. `closure-v1.4-final-closure.md`
48. `iteration-v1.2-agent-handoff-context.md`
49. `release-v1.2-agent-handoff-context.md`
50. `closure-v1.2-agent-handoff-context.md`
51. `iteration-v1.2-agent-prompt-plan.md`
52. `release-v1.2-agent-prompt-plan.md`
53. `closure-v1.2-agent-prompt-plan.md`
54. `iteration-v1.2-agent-draft-execution.md`
55. `release-v1.2-agent-draft-execution.md`
56. `closure-v1.2-agent-draft-execution.md`
57. `iteration-v1.2-draft-review.md`
58. `release-v1.2-draft-review.md`
59. `closure-v1.2-draft-review.md`
60. `iteration-v1.2-agent-handoff-closure.md`
61. `release-v1.2-agent-handoff-closure.md`
62. `closure-v1.2-agent-handoff-closure.md`
63. `iteration-v1.2-agent-handoff-runtime-summary.md`
64. `release-v1.2-agent-handoff-runtime-summary.md`
65. `closure-v1.2-agent-handoff-runtime-summary.md`
66. `iteration-v1.2-agent-handoff-runtime-aggregate-summary.md`
67. `release-v1.2-agent-handoff-runtime-aggregate-summary.md`
68. `closure-v1.2-agent-handoff-runtime-aggregate-summary.md`
69. `iteration-v1.2-agent-handoff-runtime-final-closure.md`
70. `release-v1.2-agent-handoff-runtime-final-closure.md`
71. `closure-v1.2-agent-handoff-runtime-final-closure.md`
72. `release-v1.2-aggregate-summary.md`
73. `closure-v1.2-aggregate-summary.md`
74. `release-v1.2-final-closure.md`
75. `closure-v1.2-final-closure.md`
76. `iteration-v1.1-operator-run-model.md`
77. `release-v1.1-operator-run-model.md`
78. `closure-v1.1-operator-run-model.md`
79. `iteration-v1.1-operator-run-queue.md`
80. `release-v1.1-operator-run-queue.md`
81. `closure-v1.1-operator-run-queue.md`
82. `iteration-v1.1-operator-runbook-execution.md`
83. `release-v1.1-operator-runbook-execution.md`
84. `closure-v1.1-operator-runbook-execution.md`
85. `iteration-v1.1-handoff-acceptance.md`
86. `release-v1.1-handoff-acceptance.md`
87. `closure-v1.1-handoff-acceptance.md`
88. `release-v1.1-aggregate-summary.md`
89. `closure-v1.1-aggregate-summary.md`
90. `release-v1.1-final-closure.md`
91. `closure-v1.1-final-closure.md`
92. `iteration-post-v1-workflow-actions.md`
93. `release-post-v1-workflow-actions.md`
94. `closure-post-v1-workflow-actions.md`
95. `iteration-post-v1-durable-studio-state.md`
96. `release-post-v1-durable-studio-state.md`
97. `closure-post-v1-durable-studio-state.md`
98. `iteration-post-v1-studio-state-inspection.md`
99. `release-post-v1-studio-state-inspection.md`
100. `closure-post-v1-studio-state-inspection.md`
101. `iteration-post-v1-studio-diagnostics.md`
102. `release-post-v1-studio-diagnostics.md`
103. `closure-post-v1-studio-diagnostics.md`
104. `iteration-post-v1-operator-guidance.md`
105. `release-post-v1-operator-guidance.md`
106. `closure-post-v1-operator-guidance.md`
107. `iteration-post-v1-operator-workflow.md`
108. `release-post-v1-operator-workflow.md`
109. `closure-post-v1-operator-workflow.md`
110. `iteration-post-v1-operator-workflow-execution-controls.md`
111. `release-post-v1-operator-workflow-execution-controls.md`
112. `closure-post-v1-operator-workflow-execution-controls.md`
113. `iteration-post-v1-context-pack-usage-flow.md`
114. `release-post-v1-context-pack-usage-flow.md`
115. `closure-post-v1-context-pack-usage-flow.md`
116. `iteration-post-v1-multi-action-workflow-state.md`
117. `release-post-v1-multi-action-workflow-state.md`
118. `closure-post-v1-multi-action-workflow-state.md`
119. `iteration-post-v1-review-resolution-workflow.md`
120. `release-post-v1-review-resolution-workflow.md`
121. `closure-post-v1-review-resolution-workflow.md`
122. `iteration-post-v1-studio-workflow-audit-trail.md`
123. `release-post-v1-studio-workflow-audit-trail.md`
124. `closure-post-v1-studio-workflow-audit-trail.md`
125. `iteration-post-v1-operator-handoff.md`
126. `release-post-v1-operator-handoff.md`
127. `closure-post-v1-operator-handoff.md`
128. `release-post-v1-aggregate-summary.md`
129. `closure-post-v1-aggregate-summary.md`
130. `release-post-v1-final-closure.md`
131. `closure-post-v1-final-closure.md`

## Dependency

Development Ready v1.0 depends on Product Core v0.2, Design System v0.3, AI Agents v0.4,
Architecture v0.5, and Infrastructure v0.6.

## Maintenance Rule

Every runtime source file must map back to an approved product, design, AI, architecture, or infrastructure contract.
