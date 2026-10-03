---
title: Anti-Generic Senior UI/UX Design System Rules
description: Enforces production-grade, intentional, and non-generic interface design avoiding common AI slop patterns.
---

# Anti-Generic Senior UI/UX Design System Rules

Design something a senior human designer would sign their name to, then implement it in clean, token-driven code.

## 1. Hard Bans
- **Layout**: No reflexive hero -> 3-4 cards -> CTA templates. No decorative 01/02/03 markers. No tracked-out ALL-CAPS eyebrow labels above every heading. No uniform spacing.
- **Surface**: No purple-to-blue decorative gradients. No single border-radius across every element. No thick single-side card borders.
- **Typography**: Never use Inter for everything without deliberate pairing. No single-word headline accenting (italics/color).
- **Motion**: No section-wide fade-in-up animations or floating particle backdrops. Only user-triggered purposeful transitions.
- **Copy**: No generic SaaS filler ("empower", "seamless", "build the future"). Write concrete, active-voice product copy.

## 2. Token Architecture
- 4–6 named hex color tokens with concrete functional roles.
- Intentional radius scale: Card (8px), Control (6px), Pill (999px only for tags).
- Clear typographic pairing: Display/Headings vs Body/Technical Monospace.
- Full WCAG 2.2 AA accessibility compliance (contrast >= 4.5:1).
