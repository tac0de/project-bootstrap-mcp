# TRD — Project Bootstrap MCP

This document captures the technical boundaries that support the PRD; it intentionally lives alongside PRD documentation so the architecture, data, and operational expectations are transparent for the MCP project.

## 1. Architecture Direction

- **Is this a single-user tool or multi-user system?**  
  A single-process tool targeting the platform or operations team that owns the MCP bootstrap; multi-tenant or concurrent-user support is explicitly deferred to later phases.
- **Is persistence required?**  
  Not for the MVP. In-memory storage suffices, but the `BootstrapStore` abstraction allows replacing the backing store with a file or database in the future.
- **Is real-time behavior required?**  
  No. RESTful request/response cycles (ms latency) are adequate; streaming or WebSocket behavior is out of scope for now.

## 2. Data Model Boundaries

- **What data MUST be stored?**  
  Bootstrap plan metadata such as name, description, primary action, step list, and timestamps must be retained in memory for GET endpoints.
- **What data MUST NOT be stored?**  
  Authentication credentials, secret keys, or any sensitive tokens must never enter the store.
- **What data can be derived instead of persisted?**  
  Runtime metrics (e.g., total bootstrap count) are computed on demand rather than persistently stored.

## 3. Technology Constraints

- **Required technologies:** Node.js 18+, Express, and the built-in `node:test` module for validation.
- **Forbidden technologies:** External databases, ORMs, authentication frameworks, and TypeScript (current focus is CommonJS).
- **Justification for constraints:** Keeping the stack minimal accelerates npm publishing and keeps the package lightweight for quick bootstraps.

## 4. Operational Constraints

- **Expected scale:** Tens of concurrent requests at most; a single process serving on port 4000 (customizable via CLI flags).
- **Performance expectations:** Responses should stay in the millisecond range without caching or database overhead.
- **Security or compliance requirements:** Does not collect sensitive data, but CORS or authentication middleware can be layered on later if needed.

## Validation Check

- **Do technical choices support the PRD goals?** Yes, the Express/CLI stack fulfills the API delivery and documentation-driven outcome defined in the PRD.
- **Are any technical decisions premature or unnecessary?** No, everything beyond in-memory storage or REST endpoints is deferred until future phases.
