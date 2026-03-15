# Engineering Constitution

## Mission
Build software quickly, cheaply, and reliably while maintaining high code quality and long-term architectural flexibility.

---

## Test Driven Development (Mandatory)

All development must follow **Test Driven Development (TDD)**.

Workflow:
1. Write a failing test
2. Implement minimal code
3. Make tests pass
4. Refactor safely

Rules:
- No production code without a failing test.
- Every bug fix must include a regression test.
- All features must define tests before implementation.

---

## Separation of Concerns

The system must follow clear architectural boundaries:

- **Client Layer** — UI only, no business logic  
- **Domain Layer** — core business rules and validation  
- **Application Layer** — workflows and use cases  
- **Infrastructure Layer** — database, APIs, external services

Business logic must never depend on infrastructure or vendor-specific code.

---

## Portability

Architecture should minimize vendor lock-in.

- Business logic must remain infrastructure-agnostic.
- External services must be accessed through adapters.
- Avoid unnecessary vendor-specific features.

Infrastructure should be replaceable without rewriting core business logic.

---

## Data Principles

The database enforces:
- integrity
- constraints
- indexing
- transactions

Schema changes must use migrations.

---

## Testing Standards

Every feature must include:

- **Unit tests** for domain logic
- **Integration tests** for infrastructure interactions
- **End-to-end tests** for critical user flows

Tests must run automatically in CI.

---

## Spec-Driven Development

All work begins with a spec.

Specs must define:
- problem
- user scenarios
- acceptance criteria
- test cases
- implementation tasks

Agents may only implement tasks defined in specs.

---

## Security

- Follow least privilege
- Protect secrets
- Never commit credentials
- Sensitive operations must run server-side

---

## Cost Awareness

Prefer simple, low-cost infrastructure and managed services.

Avoid unnecessary complexity before product-market fit.

---

## Definition of Done

A feature is complete when:
- tests exist and pass
- architecture rules are followed
- CI succeeds
- documentation is updated