# Skills

Use this folder for future executable AI workflows.

Each workflow should live in its own folder:

```text
.agents/skills/<skill-name>/SKILL.md
```

A skill should define:

- when to use it.
- what inputs or context to gather.
- the workflow steps and decision points.
- required validation.
- what to report when finished.

Keep skills focused on repeatable actions. Put durable conventions and
background guidance in `.agents/references/` instead.

When adding, updating, renaming, or removing command-style skills, follow
`.agents/skills/sync-skills/SKILL.md` so thin tool wrappers stay aligned.
