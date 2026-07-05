# Harness And Codebase Dictionary

Use these terms when writing or updating AI harness guidance, skills,
tool adapters, repo instructions, and codebase workflow notes. Link to
the term instead of redefining it in every file.

- [Harness And Codebase Dictionary](#harness-and-codebase-dictionary)
  - [Harness Ownership](#harness-ownership)
    - [AI Harness](#ai-harness)
    - [Source Of Truth](#source-of-truth)
    - [Thin Adapter](#thin-adapter)
    - [Executable Workflow](#executable-workflow)
    - [Shared Reference](#shared-reference)
  - [Discovery And Stability](#discovery-and-stability)
    - [Repo Discovery](#repo-discovery)
    - [Durable Guidance](#durable-guidance)
    - [Runtime Discovery](#runtime-discovery)
    - [Portable Guidance](#portable-guidance)
  - [Repository Boundaries](#repository-boundaries)
    - [Nx Workspace](#nx-workspace)
    - [Nx Project](#nx-project)
    - [Workspace Package](#workspace-package)
    - [Project Boundary](#project-boundary)
    - [Permanent Worktree](#permanent-worktree)
    - [Slot Worktree](#slot-worktree)
    - [Recurring Topic Type](#recurring-topic-type)
    - [Topic Branch](#topic-branch)
    - [Public Surface](#public-surface)
    - [Internal Surface](#internal-surface)

## Harness Ownership

### AI Harness

The repo-owned instruction layer that lets AI tools work from the same
project guidance.

Use for `.agents/` and the shared guidance it owns.
Avoid: `AI setup` or `agent docs` when the point is source-of-truth
ownership.

### Source Of Truth

A durable place that owns a rule, workflow, or definition. Other files
may route to it, but should not copy the full content.

Avoid: `reference` when the point is authority rather than
discoverability.

### Thin Adapter

A tool-specific file whose job is to bootstrap the tool into the shared
harness.

Thin adapters may include tool-required metadata, but should not copy
workflow bodies, dictionaries, or reusable guidance.

Examples:

- `AGENTS.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md`

### Executable Workflow

A repeatable agent process with triggers, steps, validation, and
reporting expectations.

Executable workflows belong under `.agents/skills/`.

Avoid: putting executable workflow steps in thin adapters.

### Shared Reference

Durable guidance used by more than one workflow or tool.

Shared references belong under `.agents/references/`.

Avoid: creating a skill for guidance that has no executable process.

## Discovery And Stability

### Repo Discovery

The process of inspecting the current repository before planning,
editing, or validating work.

Repo discovery includes reading nearby README files, project
configuration, package metadata, existing content, and relevant source
files.

Avoid: guessing from memory when the repo can answer the question.

### Durable Guidance

Guidance that should remain true across future tasks unless intentionally
changed.

Avoid: listing current generated files, exact counts, or temporary
state as durable guidance.

### Runtime Discovery

A command or inspection step that discovers changing state at the time
an agent needs it.

Use runtime discovery for project lists, tags, content files, targets,
and generated output.

### Portable Guidance

Shared guidance written without personal machine paths, private local
configuration, or tool-owned session details.

Use repo-relative paths, placeholders, environment variables, or runtime
discovery commands.

## Repository Boundaries

### Nx Workspace

The repository-level Nx environment that owns project discovery,
dependency graph behavior, and task execution.

### Nx Project

A project known to Nx with its own root, targets, and configuration.

Use this term for entries discoverable through Nx project metadata.

### Workspace Package

A package managed by the repository package manager workspace.

Use this term for npm workspace packages rather than every Nx project.

### Project Boundary

The source, configuration, assets, and documentation owned by a specific
Nx project or package area.

Avoid: `folder` when the point is ownership rather than path shape.

### Permanent Worktree

A long-lived git worktree used for a recurring area of work.

Use this term for worktrees that persist across many changes, such as a
worktree for blog posts or another worktree for package work.

Avoid: assuming each change needs its own worktree.

### Slot Worktree

A permanent worktree dedicated to one recurring topic.

For example, a blog slot worktree is a long-lived checkout used for blog
work. Before creating a new blog topic branch, refresh local `main` from
`origin/main` in a checkout where `main` is available.

The slot identity comes from its purpose and git-flow config, not from
the filesystem folder name.

### Recurring Topic Type

A git-flow topic type registered for a recurring work area.

For example, a recurring topic type can be registered so individual
topic branches use `<topic>/<slug>`.

### Topic Branch

A short-lived branch for one change within a recurring topic type.

Topic branches are opened as pull requests and squash-merged into
`main`.

Create topic branches after local `main` has just been refreshed from
`origin/main`, not from stale local state.

### Public Surface

The files, exports, commands, content, or behavior intended for
consumers outside the implementation boundary.

Avoid: changing a public surface without checking current consumers or
validation requirements.

### Internal Surface

Implementation details used only inside the owning project boundary.

Internal surfaces may still need tests or documentation when behavior is
non-obvious.
