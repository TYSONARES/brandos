# Accessibility Checklist

## Purpose

This checklist defines the minimum accessibility expectations for BrandOS interface specs.

## Required Checks

- Status is exposed as text and never color alone.
- Every interactive control has a clear accessible name.
- Keyboard focus order follows the visual workflow order.
- Focus indicators use `shadow.focus` or an approved equivalent.
- Error, blocked, expired, rejected, and changes-needed states include text explanations.
- Tables, lists, and dense object views preserve heading or label structure.
- Actions that change object status require visible confirmation or review context.

## Product Core Coverage

The checklist applies to Brand Profile, Claim, Decision, Context Pack, Review, and Workflow Run surfaces.

## Acceptance Rule

A component cannot be approved in v0.3 unless this checklist is satisfied or an exception is recorded in a decision.
