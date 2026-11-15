---
title: iDEAL 2.0 rollout at KPN
summary: Moving checkout to a new payment flow on a high-traffic telecom shop without breaking the moment customers pay.
role: Front-end engineer
year: "2024"
order: 2
outcome: ~22% fewer payment-related incidents and +9% conversion, validated with an A/B test over ~100k sessions.
draft: true
---

## Problem

Payment is the most fragile step of any checkout: a small regression shows up directly as lost orders. Migrating to iDEAL 2.0 meant changing that step for every customer of the KPN shop.

## Hardest design decision

[TODO: which UX decision in the new payment step mattered most — e.g. states while redirecting to the bank, error and retry flows, or how the fallback looks to the customer.]

## How it was built

- Feature flags and a gradual rollout, so the new flow reached customers in steps.
- Fallbacks to the previous flow if something failed.
- An A/B test (~100k sessions) to compare both flows on real traffic.
- Observability on the payment journey to catch issues before customers reported them.

## Outcome

Around 22% fewer payment-related incidents and a 9% increase in conversion.
