# Agents

This folder is the canonical home for project AI guidance, workflows,
and shared conventions. Tool-specific entrypoints should point here
instead of duplicating instructions.

Guidance in `.agents/` should be tool-agnostic by default. Put only
tool-required bootstrap, schema, or configuration details in the thin
adapter files owned by each tool.

## Folders

- `skills/`: Future executable workflows. Each workflow should live in
  its own folder with a `SKILL.md` file.
- `references/`: Shared project guidance and conventions used by more
  than one tool or workflow. Start with `.agents/references/README.md`.

## Start Here

Use `.agents/references/README.md` to discover shared references before
adding reusable guidance or changing recurring workflows. Use
`.agents/references/ai-harness.md` for source-of-truth ownership,
adapter, and placement rules.

Before running `git commit`, use
`.agents/skills/commit-message/SKILL.md` to validate the exact final
commit message with commitlint.

## Placement

| Change type | Put it here |
| --- | --- |
| Repeatable workflow or command-like process | `.agents/skills/<skill-name>/SKILL.md` |
| Shared convention used by multiple tools or workflows | `.agents/references/README.md` or the owning reference |
| Thin tool adapter | Tool-specific file that points back to `.agents/` |

Keep shared guidance portable: use repo-relative paths, environment
variables, placeholders, or runtime discovery commands instead of local
machine paths.
