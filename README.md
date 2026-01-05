# Project Bootstrap MCP — PRD

This project turns the MCP (Management Control Plane) bootstrap documentation into runnable tooling: an Express-based API plus CLI that teams can publish via GitHub and npm.

## 1. Project Goal

- **What is this project?**  
  An API server and CLI that surface PRD/TRD definitions, agent rules, and related operations so MCP bootstraps can be executed programmatically.
- **What problem does it solve?**  
  Markdown-only documentation cannot be executed; this project exposes those definitions through a lightweight service and CLI, making MCP setup automatable.
- **Who is the primary user?**  
  Platform engineers or operation teams bootstrapping MCPs, and any development team that installs this package via npm.

## 2. Success Definition

- **How do we know this project is successful?**  
  By installing the npm package and starting the CLI/server, users can POST/GET bootstrap definitions through the provided REST endpoints.
- **What measurable outcome must be achieved?**  
  `npm test` passes, the Express API listens on port 4000 (default), and at least one bootstrap definition can be created and retrieved.
- **What does failure look like?**  
  The repository still only contains Markdown documentation or lacks automated verification for the API/CLI behavior.

## 3. Core User Action

- **What is the single most important action a user performs?**  
  Run `project-bootstrap-mcp` (or `npm start`) to launch the server and interact with `/api/bootstraps`.
- **What moment should make the user say “this works”?**  
  A successful `POST /api/bootstraps` followed immediately by a `GET /api/bootstraps/:id` that returns the stored definition.

## 4. Non-Goals

- **What will this project NOT attempt to do?**  
  It does not introduce persistent storage, authentication/authorization, multi-tenancy, or automated agent scheduling.
- **What features are explicitly out of scope?**  
  Connecting agents to external workflows or configuring high-availability deployments is not part of the MVP.

## 5. Constraints

- **Time constraints:** Deliver the MVP API, CLI, and documentation within 1–2 days.
- **Scope constraints:** Single Node/Express service, simple CLI, and PRD/TRD CRUD operations only.
- **Resource constraints:** No external databases; use in-memory storage and only trusted, minimal dependencies (Express and built-in Node modules).

## Validation Check

- **Can the project goal be explained in one sentence?** Yes — “Expose MCP bootstrap docs as runnable API/CLI tooling ready for npm/GitHub distribution.”
- **Can success be evaluated without subjective judgment?** Yes — API functionality and `npm test` results provide objective verification.

## Implementation & Usage

### API Overview

- `GET /api/status`: Returns service metadata (name, version), uptime, and timestamp.
- `GET /api/bootstraps`: Lists all stored bootstrap plans.
- `POST /api/bootstraps`: Validates and stores a bootstrap definition with `name`, `description`, `primaryAction`, and `steps`.
- `GET /api/bootstraps/:id`: Retrieves a bootstrap plan by ID.

### CLI / Execution

- `npm start` or the `project-bootstrap-mcp` binary starts the server on port 4000 by default.
- Override the port with `--port` or `-p` (e.g., `project-bootstrap-mcp --port 5000`), or set the `PORT` environment variable.

### Testing & Validation

- Run `npm test` to execute `node --test test/store.test.js`, which verifies the in-memory store and payload validation helper.
