# SpecKit Prompts

A brief reference for each prompt in this directory. These prompts form a sequential workflow from idea → specification → planning → implementation.

---

## Workflow Overview

```
speckit.specify → speckit.clarify → speckit.checklist → speckit.plan → speckit.tasks → speckit.analyze → speckit.implement → speckit.taskstoissues
```

`speckit.constitution` can be run at any point to update project governance.

---

## Prompts

### `speckit.specify`
Creates a new feature branch and generates a feature specification (`spec.md`) from a natural language description. Extracts actors, requirements, user scenarios, and success criteria. Runs a quality validation pass and surfaces up to 3 clarification questions if critical decisions are ambiguous. Also creates an initial `checklists/requirements.md` file.

---

### `speckit.clarify`
Identifies underspecified areas in an existing `spec.md` and asks up to 5 targeted questions. Encodes the user's answers directly back into the spec. Intended to run **before** `speckit.plan` to reduce downstream rework risk.

---

### `speckit.checklist`
Generates a custom domain-specific checklist for the current feature. Checklists act as **"unit tests for requirements"** — they validate the completeness, clarity, and consistency of the written spec, not the implementation. For example: *"Is 'prominent display' quantified with specific sizing/positioning?"*

---

### `speckit.plan`
Executes the planning workflow to produce design artifacts:
- `research.md` — resolves unknowns and documents technical decisions
- `data-model.md` — entities, fields, and relationships
- `contracts/` — interface contracts (APIs, CLI schemas, UI contracts, etc.)
- `quickstart.md` — integration scenarios

Also updates the agent context file for the current AI environment.

---

### `speckit.tasks`
Generates a fully structured `tasks.md` from the design artifacts (`plan.md`, `spec.md`, `data-model.md`, `contracts/`). Tasks are organized by user story (phase per story), tagged with IDs (`T001`, `T002`…), parallelism markers (`[P]`), and story labels (`[US1]`, `[US2]`…). Each task includes an explicit file path for direct executability.

---

### `speckit.analyze`
Performs a **read-only** cross-artifact consistency check across `spec.md`, `plan.md`, and `tasks.md`. Flags inconsistencies, duplications, ambiguities, and constitution violations. Outputs a structured report and an optional remediation plan — no files are modified without explicit user approval.

---

### `speckit.implement`
Executes the implementation plan by working through `tasks.md` phase by phase. Follows TDD order (tests before code), respects task dependencies and parallelism markers, verifies ignore files, checks pre/post extension hooks from `.specify/extensions.yml`, and marks tasks complete (`[X]`) as they finish.

---

### `speckit.constitution`
Updates the project constitution at `.specify/memory/constitution.md`. Fills all template placeholder tokens, bumps the semantic version (MAJOR/MINOR/PATCH), propagates changes to dependent templates (`plan`, `spec`, `tasks`), and outputs a Sync Impact Report. Ratification and amendment dates are tracked in ISO format.

---

### `speckit.taskstoissues`
Converts tasks from `tasks.md` into GitHub Issues using the GitHub MCP server (`github/github-mcp-server/issue_write`). Reads the Git remote to determine the target repository and will **only** create issues in repositories matching that remote URL.

---

## Checklists vs Tasks

These two concepts are easy to confuse but serve completely different purposes:

| | Checklists (`speckit.checklist`) | Tasks (`speckit.tasks`) |
|---|---|---|
| **Purpose** | Validate the *quality of the written spec* | Define the *implementation work* to be done |
| **Audience** | Authors of the spec / product thinking | Developers / AI implementing the feature |
| **Format** | Domain-specific quality criteria | Actionable to-dos with file paths and IDs |
| **Output file** | `checklists/*.md` | `tasks.md` |
| **When to run** | After `speckit.specify`, before `speckit.plan` | After `speckit.plan` |
| **Example item** | *"Is 'prominent display' quantified with sizing?"* | `- [ ] T012 [P] [US1] Create User model in src/models/user.py` |
| **Question it answers** | "Is the spec good enough to build from?" | "What exactly needs to be built and in what order?" |
| **Modifies spec?** | No — only flags issues for the author to fix | No — consumes the plan to produce executable steps |

**Mental model**: checklists are *tests for your requirements writing*; tasks are *your implementation backlog*.

---

## Example Workflows

### Modifying a Spec mid-flight

Use this when requirements change after `speckit.specify` has already run (e.g. stakeholder feedback, scope change).

```
1. Edit spec.md manually — or re-run speckit.clarify to surface new questions
   and encode answers back in.

2. Re-run speckit.checklist  →  validate the updated spec still passes
   quality criteria.

3. Re-run speckit.plan  →  regenerate research.md / data-model.md / contracts/
   to reflect the new requirements.

4. Re-run speckit.tasks  →  regenerate tasks.md from the updated plan.

5. Re-run speckit.analyze  →  confirm all three artifacts are consistent
   before resuming implementation.
```

> If implementation (`speckit.implement`) was already in progress, check which tasks were marked `[X]` complete before discarding them. Carry completed work forward manually or note it as context when re-running `speckit.tasks`.

---

### Modifying a Plan mid-flight

Use this when a technical decision changes after `speckit.plan` has run (e.g. switching libraries, restructuring the data model) but the spec itself is still correct.

```
1. Edit plan.md / data-model.md / contracts/ directly to reflect the change.

2. Re-run speckit.tasks  →  regenerate tasks.md from the updated plan.
   (No need to re-run speckit.plan unless you want to re-trigger the full
   research and design phase.)

3. Re-run speckit.analyze  →  verify spec ↔ plan ↔ tasks are still aligned.

4. Resume speckit.implement from the first incomplete task.
```

> For breaking changes (e.g. renaming a core entity), also check `contracts/` for outdated interface definitions and update them before regenerating tasks.
