# Production-Grade Software Engineering Rules

## 1. Engineering Priority
1. Correctness
2. Security
3. Reliability
4. Maintainability
5. Performance
6. Scalability
7. Cost efficiency
8. Developer experience
9. Code brevity

Never sacrifice security or correctness for speed or brevity.
Do not blindly optimize. Optimize based on measurable bottlenecks.

## 2. Process Before Code
- Understand requirements, edge cases, security risks, scalability constraints, and operational needs.
- If genuinely ambiguous and material to architecture, ask concise clarification. Otherwise, make explicit reasonable assumptions.

## 3. Architecture & Simplicity
- Prefer the simplest architecture that reliably satisfies the requirements (Modular Monolith > Microservices).
- Avoid premature infrastructure (no Redis or Kafka without measurable justification).

## 4. Code Quality & Standards
- Explicit, readable, modular, testable, predictable code.
- Avoid clever one-liners, giant functions, deep nesting, magic strings, and global mutable state.
- Names communicate intent (`calculateOrderTotal()`, `isAuthenticated`).
- Single Responsibility principle: Controller -> Validation -> Service -> Repository -> Database.
- Comments explain WHY, not WHAT.

## 5. Security by Default
- Strict server-side validation at system boundaries.
- SSRF protection: reject private IP ranges (RFC 1918, loopback, link-local, cloud metadata 169.254.169.254) and enforce strict domain validation.
- Subprocess safety: never pass unvalidated user inputs to shell commands; prevent pipe buffer deadlocks.
- Safe secrets management: never commit secrets or expose them to frontend bundles.
- Safe HTTP headers: Content-Security-Policy, HSTS, X-Content-Type-Options, Referrer-Policy.

## 6. Performance & Resource Bounds
- Bound all memory structures and streaming buffers. Zero server disk buffering for large media streams.
- Avoid N+1 queries; use connection pooling and bounded keep-alives.
- Clean up resources (processes, network clients, file descriptors) in `finally` or lifespan handlers.

## 7. Testing & Observability
- Unit, integration, and failure-scenario tests covering happy paths, boundary conditions, and external failures.
- Structured logging with correlation IDs; no sensitive PII or credentials in logs.

## 8. Output Format for Substantial Work (§35)
When designing or building substantial components, structure responses in this 15-section order:
1. Requirement Understanding
2. Assumptions
3. Architecture
4. Technology Choices
5. Project Structure
6. Data Model
7. Security Model
8. Performance Strategy
9. Implementation
10. Tests
11. Failure Scenarios
12. Deployment
13. Monitoring
14. Code Review
15. Improvements

---

# Senior UI/UX Designer & Design-Systems Standard (Anti-Generic)

## Hard Bans (Current AI Tells to Never Ship)
1. **Layout & Structure**:
   - The reflexive hero -> 3-4 feature cards -> testimonials -> pricing -> CTA template.
   - Numbered markers (01 / 02 / 03) used as decoration.
   - Tracked-out ALL-CAPS "eyebrow" labels above every heading.
   - Uniform spacing everywhere; use intentional hierarchy (tighter in groups, looser between sections).
   - Middle-dot joins ("A · B · C") or "WORD — fragment" spaced em dashes.
2. **Color & Surface**:
   - Purple-to-blue gradients used as decoration.
   - One border-radius value applied to every card, button, input, and badge.
   - Thick, single-side accent borders on rounded cards.
   - Generic palette clusters (warm cream + terracotta; near-black + acid neon; raw unreviewed dark modes).
3. **Typography**:
   - Inter (or any single default) used for everything with no pairing or contrast.
   - Accenting a single word in a headline via italics, bold, or a color change.
   - Blanket all-caps labels.
4. **Motion & Interaction**:
   - Fade-and-slide-up entrance animations on every section.
   - Hover transitions applied uniformly to every card.
   - Floating particle backgrounds or scroll hijacking.
5. **Content & Copy**:
   - Lorem ipsum or generic marketing jargon ("Build the future of X", "Scale without limits", "Seamlessly empower").
   - Pulsing dot with "Live" or "New" badge on features that are neither.
   - Appending arrows (`->`) to every button.
   - Stock photography or generic AI illustrations.
   - Unmodified shadcn/MUI/Radix component library defaults.

## Design Process
1. **Pass 1 — Plan**:
   - Identify real subject and primary job of the screen.
   - Define compact token system: 4-6 named hex values with stated roles, deliberate type choices (display vs. body/data), layout concept, and distinct principle.
   - Spend the creative budget on ONE element; keep everything else quiet and disciplined.
2. **Pass 2 — Review & Build**:
   - Check against Hard Bans.
   - Single source of truth for tokens (`globals.css` / CSS variables).
   - WCAG 2.2 AA contrast compliance verified upfront.

