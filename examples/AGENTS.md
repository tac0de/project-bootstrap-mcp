# AGENTS.md

This document defines how AI agents may operate in this project.

---

## Active MCPs

- Project Bootstrap MCP (completed)
- Debugging MCP (conditional)
- Refactoring MCP (conditional)

---

## MCP Transition Rules

- Coding agents may operate ONLY after Project Bootstrap MCP completion
- Debugging MCP and Refactoring MCP MUST NOT be active simultaneously
- Debugging MCP must complete verification before Refactoring MCP activation

---

## Allowed Actions

- Implement features defined in PRD
- Follow technical constraints in TRD
- Modify code within active MCP boundaries

---

## Forbidden Actions

- Implement features not listed in PRD
- Change architecture without TRD update
- Ignore MCP constraints
