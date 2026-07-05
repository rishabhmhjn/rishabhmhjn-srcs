# AI Harness

The AI harness is the repo-owned layer that lets agent tools work from
the same project guidance. It lives in `.agents/` and owns shared
workflow definitions, references, and conventions.

The harness should describe durable repository behavior. Tool-specific
files should adapt a tool to the harness, not become a second source of
truth.

## Source of Truth

`.agents/` is canonical for reusable AI guidance in this repository:

- `.agents/skills/` owns executable workflow entrypoints.
- `.agents/references/` owns shared guidance and conventions.

Root and tool-owned files such as `AGENTS.md`, `CLAUDE.md`, Copilot
instructions, command wrappers, prompt wrappers, or future agent config
should point into the harness or declare only the minimal schema a tool
requires.

Use `.agents/skills/sync-skills/SKILL.md` when command-style skills or
tool-specific wrappers are added, updated, renamed, or removed.

Use `.agents/references/terminology.md` before adding or changing
reusable harness, workflow, repository, or codebase vocabulary.

## Shared Resource Boundaries

Do not commit person-specific, machine-specific, device-specific,
AI-tool-specific, or absolute local path details into shared repo
resources.

Shared examples should use one of these forms:

- repository-relative paths, such as `.agents/references/...`.
- environment variables documented by the owning tool or workflow.
- placeholders, such as `<repo-root>`, `<task-slug>`, or
  `<workspace-root>`.
- runtime discovery commands that find paths, executables, or project
  metadata in the active environment.

Personal tool configuration belongs in personal user config, not in
repo-shared config or shared `.agents` guidance.

## Workflow Entrypoints

Create or update a skill when guidance describes an action an agent
should execute as a workflow. Skills belong in
`.agents/skills/<skill-name>/SKILL.md` and should contain trigger
conditions, workflow steps, validation, and reporting expectations.

Do not create command or prompt wrappers for reference-only guidance
unless that guidance is intentionally exposed as an executable workflow.

Expose a skill through command or prompt wrappers only when the workflow
is meant to be invoked directly from that tool. Keep those wrappers thin
and synchronized through `.agents/skills/sync-skills/SKILL.md`.

## Shared References

Create or update a shared reference when guidance is durable context
used by more than one workflow or tool. References belong under
`.agents/references/` and should:

- use repo-relative paths and portable language.
- describe ownership boundaries and routing decisions.
- tell agents how to discover changing files or state at runtime.
- link to owning skills instead of copying their full procedures.

## Tool Adapters

Tool-specific adapters should stay thin:

- bootstrap the tool into `.agents/`.
- declare only tool-required metadata or configuration.
- link to shared guidance for conventions and workflows.
- avoid copied workflow steps, skill inventories, or project policies.

If an adapter needs substantial guidance, move that guidance into
`.agents/skills/` or `.agents/references/` and point the adapter there.

## Verification

For harness-only changes, use lightweight documentation checks:

- `git diff --check`
- search adapters for `.agents` links.
- search for accidental local paths or external project references.

Broad build, lint, or test runs are not required unless the change also
touches executable code.
