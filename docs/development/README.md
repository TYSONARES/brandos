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
46. `iteration-v1.2-agent-handoff-context.md`
47. `release-v1.2-agent-handoff-context.md`
48. `closure-v1.2-agent-handoff-context.md`
49. `iteration-v1.2-agent-prompt-plan.md`
50. `release-v1.2-agent-prompt-plan.md`
51. `closure-v1.2-agent-prompt-plan.md`
52. `iteration-v1.2-agent-draft-execution.md`
53. `release-v1.2-agent-draft-execution.md`
54. `closure-v1.2-agent-draft-execution.md`
55. `iteration-v1.2-draft-review.md`
56. `release-v1.2-draft-review.md`
57. `closure-v1.2-draft-review.md`
58. `iteration-v1.2-agent-handoff-closure.md`
59. `release-v1.2-agent-handoff-closure.md`
60. `closure-v1.2-agent-handoff-closure.md`
61. `iteration-v1.2-agent-handoff-runtime-summary.md`
62. `release-v1.2-agent-handoff-runtime-summary.md`
63. `closure-v1.2-agent-handoff-runtime-summary.md`
64. `iteration-v1.2-agent-handoff-runtime-aggregate-summary.md`
65. `release-v1.2-agent-handoff-runtime-aggregate-summary.md`
66. `closure-v1.2-agent-handoff-runtime-aggregate-summary.md`
67. `iteration-v1.2-agent-handoff-runtime-final-closure.md`
68. `release-v1.2-agent-handoff-runtime-final-closure.md`
69. `closure-v1.2-agent-handoff-runtime-final-closure.md`
70. `release-v1.2-aggregate-summary.md`
71. `closure-v1.2-aggregate-summary.md`
72. `release-v1.2-final-closure.md`
73. `closure-v1.2-final-closure.md`
74. `iteration-v1.1-operator-run-model.md`
75. `release-v1.1-operator-run-model.md`
76. `closure-v1.1-operator-run-model.md`
77. `iteration-v1.1-operator-run-queue.md`
78. `release-v1.1-operator-run-queue.md`
79. `closure-v1.1-operator-run-queue.md`
80. `iteration-v1.1-operator-runbook-execution.md`
81. `release-v1.1-operator-runbook-execution.md`
82. `closure-v1.1-operator-runbook-execution.md`
83. `iteration-v1.1-handoff-acceptance.md`
84. `release-v1.1-handoff-acceptance.md`
85. `closure-v1.1-handoff-acceptance.md`
86. `release-v1.1-aggregate-summary.md`
87. `closure-v1.1-aggregate-summary.md`
88. `release-v1.1-final-closure.md`
89. `closure-v1.1-final-closure.md`
90. `iteration-post-v1-workflow-actions.md`
91. `release-post-v1-workflow-actions.md`
92. `closure-post-v1-workflow-actions.md`
93. `iteration-post-v1-durable-studio-state.md`
94. `release-post-v1-durable-studio-state.md`
95. `closure-post-v1-durable-studio-state.md`
96. `iteration-post-v1-studio-state-inspection.md`
97. `release-post-v1-studio-state-inspection.md`
98. `closure-post-v1-studio-state-inspection.md`
99. `iteration-post-v1-studio-diagnostics.md`
100. `release-post-v1-studio-diagnostics.md`
101. `closure-post-v1-studio-diagnostics.md`
102. `iteration-post-v1-operator-guidance.md`
103. `release-post-v1-operator-guidance.md`
104. `closure-post-v1-operator-guidance.md`
105. `iteration-post-v1-operator-workflow.md`
106. `release-post-v1-operator-workflow.md`
107. `closure-post-v1-operator-workflow.md`
108. `iteration-post-v1-operator-workflow-execution-controls.md`
109. `release-post-v1-operator-workflow-execution-controls.md`
110. `closure-post-v1-operator-workflow-execution-controls.md`
111. `iteration-post-v1-context-pack-usage-flow.md`
112. `release-post-v1-context-pack-usage-flow.md`
113. `closure-post-v1-context-pack-usage-flow.md`
114. `iteration-post-v1-multi-action-workflow-state.md`
115. `release-post-v1-multi-action-workflow-state.md`
116. `closure-post-v1-multi-action-workflow-state.md`
117. `iteration-post-v1-review-resolution-workflow.md`
118. `release-post-v1-review-resolution-workflow.md`
119. `closure-post-v1-review-resolution-workflow.md`
120. `iteration-post-v1-studio-workflow-audit-trail.md`
121. `release-post-v1-studio-workflow-audit-trail.md`
122. `closure-post-v1-studio-workflow-audit-trail.md`
123. `iteration-post-v1-operator-handoff.md`
124. `release-post-v1-operator-handoff.md`
125. `closure-post-v1-operator-handoff.md`
126. `release-post-v1-aggregate-summary.md`
127. `closure-post-v1-aggregate-summary.md`
128. `release-post-v1-final-closure.md`
129. `closure-post-v1-final-closure.md`

## Dependency

Development Ready v1.0 depends on Product Core v0.2, Design System v0.3, AI Agents v0.4,
Architecture v0.5, and Infrastructure v0.6.

## Maintenance Rule

Every runtime source file must map back to an approved product, design, AI, architecture, or infrastructure contract.
