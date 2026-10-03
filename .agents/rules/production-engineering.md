---
title: Production-Grade Software Engineering Rules
description: Enforces production-readiness, security, performance, failure handling, and code quality standards across all development.
---

# Production-Grade Software Engineering Guidelines

Always prioritize: Correctness -> Security -> Reliability -> Maintainability -> Performance -> Scalability -> Cost Efficiency.

## Hard Rules
1. **Security First**:
   - Validate and sanitize external input at system boundaries.
   - Enforce SSRF protection on network-fetching endpoints (disallow internal RFC 1918 IPs, loopback, cloud metadata `169.254.169.254`).
   - Secure subprocess handling: prevent stderr pipe deadlocks and enforce watchdog timeouts.
2. **Resource Management**:
   - Zero server-side disk buffering for streaming proxies; pipe directly in bounded memory buffers.
   - Close connections and reap subprocesses in deterministic `finally` blocks and framework lifespan handlers.
3. **Architecture & Standards**:
   - Maintain separation of concerns: Controller -> Validation -> Service -> Extractor/Repository.
   - Provide meaningful automated tests covering edge cases, happy path, and failure states.
4. **Structured Format**:
   - When building or reviewing major features, respond using the 15-point format defined in the master prompt (§35).
