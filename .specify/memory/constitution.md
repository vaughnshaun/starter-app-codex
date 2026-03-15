<!--
Sync Impact Report
Version change: unversioned template -> 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] -> I. Test Driven Development (Mandatory)
- [PRINCIPLE_2_NAME] -> II. Separation of Concerns
- [PRINCIPLE_3_NAME] -> III. Portability
- [PRINCIPLE_4_NAME] -> IV. Data Principles
- [PRINCIPLE_5_NAME] -> V. Testing Standards
Added sections:
- Mission
- VI. Spec-Driven Development
- VII. Security
- VIII. Cost Awareness
- IX. Definition of Done
- Governance
Removed sections:
- [SECTION_2_NAME]
- [SECTION_3_NAME]
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .codex/prompts/speckit.specify.md
- ✅ .codex/prompts/speckit.tasks.md
- ✅ .codex/prompts/speckit.constitution.md
Follow-up TODOs:
- None
-->
# Starter App Codex Constitution

## Mission
Build software quickly, cheaply, and reliably while maintaining high code quality
and long-term architectural flexibility.

## Core Principles

### I. Test Driven Development (Mandatory)
All development MUST follow Test Driven Development. Teams MUST write a failing
test first, implement the minimum code needed to make it pass, and then refactor
safely. No production code may be introduced without a failing test, every bug
fix MUST add a regression test, and every feature MUST define tests before
implementation begins.

Rationale: TDD keeps scope tight, prevents regressions, and makes change cost
predictable.

### II. Separation of Concerns
The system MUST preserve clear architectural boundaries. The client layer is UI
only and MUST NOT contain business logic. The domain layer owns business rules
and validation. The application layer coordinates workflows and use cases. The
infrastructure layer contains databases, APIs, and other external services.
Business logic MUST NOT depend directly on infrastructure or vendor-specific
code.

Rationale: Clear layering improves testability, portability, and long-term
maintainability.

### III. Portability
Architecture MUST minimize vendor lock-in. Business logic MUST remain
infrastructure-agnostic, external services MUST be accessed through adapters, and
unnecessary vendor-specific features MUST be avoided. Infrastructure choices MUST
remain replaceable without rewriting the core business logic.

Rationale: Portable systems preserve negotiating leverage and reduce future
migration cost.

### IV. Data Principles
Data storage MUST enforce integrity, constraints, indexing, and transactional
correctness where applicable. Every schema change MUST be delivered through an
explicit migration. Application code MUST rely on the database for durable
consistency guarantees rather than re-implementing them informally in the client
or application layer.

Rationale: Data correctness is cheaper to enforce once at the storage boundary
than to repair after corruption.

### V. Testing Standards
Every feature MUST include unit tests for domain logic, integration tests for
infrastructure interactions, and end-to-end tests for critical user flows. Tests
MUST run automatically in CI before work is considered complete.

Rationale: Each test layer catches a different failure mode; omitting any of
them creates blind spots.

### VI. Spec-Driven Development
All work MUST begin with a spec. Each spec MUST define the problem, user
scenarios, acceptance criteria, test cases, and implementation tasks before
implementation starts. Agents MAY implement only tasks that are defined in the
approved spec and its derived plan/tasks artifacts.

Rationale: Specs provide the contract that keeps delivery aligned with product
intent and with this constitution.

### VII. Security
Systems MUST follow least privilege, protect secrets, and never commit
credentials. Sensitive operations MUST run server-side. Security-sensitive
changes MUST explicitly describe secret handling, permission boundaries, and
server-side enforcement in the relevant plan and tasks.

Rationale: Security failures are usually architectural, not cosmetic.

### VIII. Cost Awareness
Teams MUST prefer simple, low-cost infrastructure and managed services when they
satisfy the requirement. Complexity or spend beyond current needs MUST be
justified in the plan.

Rationale: Premature complexity creates ongoing operational and development cost
without proven product value.

### IX. Definition of Done
A feature is complete only when tests exist and pass, architecture rules are
followed, CI succeeds, and documentation is updated. Work that fails any of
these conditions MUST remain open.

Rationale: Done is a quality gate, not a coding milestone.

## Governance
This constitution supersedes conflicting local practices for this repository.
Amendments MUST be made by updating this document, syncing affected templates and
command prompts in the same change, and recording the rationale in version
control.

Versioning MUST follow semantic versioning:
- MAJOR for removing or redefining a principle or governance rule in a backward-
  incompatible way.
- MINOR for adding a new principle, section, or materially expanding required
  practice.
- PATCH for clarifications, wording improvements, or non-semantic refinements.

Compliance MUST be reviewed at spec creation, plan approval, task generation,
implementation, and code review. Any exception MUST be documented in the plan's
Complexity Tracking section with a concrete justification and a simpler
alternative considered.

**Version**: 1.0.0 | **Ratified**: 2026-03-15 | **Last Amended**: 2026-03-15
