---
name: sync-skills
description: Synchronize thin tool-specific command and prompt wrappers from the canonical `.agents/skills` structure without duplicating skill instructions outside `.agents`.
---

# sync-skills

Use this skill when adding, updating, renaming, or removing project
skills that affect tool-specific command or prompt entrypoints.

## Source of truth

`.agents/skills/*/SKILL.md` is canonical for skill names, trigger
descriptions, workflow steps, validation, and reporting expectations.

Do not duplicate skill inventories or workflow bodies in root, Copilot,
Claude, Codex, or other tool-specific files. Those files should only
bootstrap into `.agents`, contain thin wrappers required by the tool, or
declare tool-specific configuration.

## Sync targets

Keep these tool-specific surfaces aligned with `.agents/skills` when
they exist:

- `AGENTS.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md`
- `.claude/commands/*.md`
- `.github/prompts/*.prompt.md`
- future tool-specific entrypoint files

Keep MCP or role-agent surfaces aligned only after this repository adds
those surfaces. Do not create MCP or role-agent files just because this
skill mentions them.

## Wrapper rules

Create wrappers only for skills intended to be invoked as commands or
agent prompts. Do not create wrappers for helper or reference-like
skills unless the user explicitly wants them exposed as commands.

Wrappers must stay thin:

- point to `.agents/skills/<skill-name>/SKILL.md`.
- include only tool-required metadata or argument passthrough.
- do not copy workflow steps, coding standards, reference text, or skill
  inventories.

## Wrapper formats

Claude command wrapper:

```md
Read `.agents/skills/<skill-name>/SKILL.md` and execute the workflow defined there.

Arguments: $ARGUMENTS
```

GitHub prompt wrapper:

```md
---
mode: agent
description: '<description from the skill frontmatter>'
---

Read [.agents/skills/<skill-name>/SKILL.md](.agents/skills/<skill-name>/SKILL.md) and execute the workflow defined there.
```

Use the skill frontmatter description for GitHub prompt descriptions.
Keep it synchronized when the skill description changes.

## When creating a skill

1. Create `.agents/skills/<skill-name>/SKILL.md`.
2. Use lowercase letters, digits, and hyphens for `<skill-name>`.
3. Include `name` and `description` in frontmatter.
4. Keep `SKILL.md` focused on the executable workflow.
5. Put reusable background guidance in `.agents/references/` and link to
   it from the skill.
6. Add thin wrappers only when the workflow should be directly invoked
   from another AI tool.
7. Run this sync validation before finishing.

## Validation

After syncing:

1. Check wrappers point to existing skills:

```sh
node -e "const fs=require('fs'); const path=require('path'); const wrappers=[['.claude/commands','.md'],['.github/prompts','.prompt.md']]; const missing=[]; for (const [dir,suffix] of wrappers) { if (!fs.existsSync(dir)) continue; for (const file of fs.readdirSync(dir)) { if (!file.endsWith(suffix)) continue; const name=file.slice(0,-suffix.length); const skillPath=path.join('.agents/skills',name,'SKILL.md'); const full=path.join(dir,file); const text=fs.readFileSync(full,'utf8'); if (!fs.existsSync(skillPath)) missing.push({wrapper:full,missing:skillPath}); if (!text.includes(skillPath)) missing.push({wrapper:full,missingLink:skillPath}); } } if (missing.length) { console.error(JSON.stringify(missing,null,2)); process.exit(1); } console.log('skill wrappers ok');"
```

2. Check GitHub prompt descriptions match skill frontmatter when both are
   present:

```sh
node -e "const fs=require('fs'); const path=require('path'); const unquote=(value)=>{ value=(value||'').trim(); const first=value[0]; const last=value[value.length-1]; return first===last && (first===\"'\" || first==='\"') ? value.slice(1,-1) : value; }; const skillsDir='.agents/skills'; const promptDir='.github/prompts'; const mismatches=[]; if (fs.existsSync(skillsDir) && fs.existsSync(promptDir)) { for (const name of fs.readdirSync(skillsDir)) { const skillPath=path.join(skillsDir,name,'SKILL.md'); const promptPath=path.join(promptDir,name+'.prompt.md'); if (!fs.existsSync(skillPath) || !fs.existsSync(promptPath)) continue; const skill=fs.readFileSync(skillPath,'utf8'); const prompt=fs.readFileSync(promptPath,'utf8'); const skillDescription=unquote(skill.match(/^description:\s*(.*)$/m)?.[1]); const promptDescription=unquote(prompt.match(/^description:\s*(.*)$/m)?.[1]); if (skillDescription && promptDescription && skillDescription!==promptDescription) mismatches.push({name,skillDescription,promptDescription}); } } if (mismatches.length) { console.error(JSON.stringify(mismatches,null,2)); process.exit(1); } console.log('github prompt descriptions ok');"
```

3. Search tool-specific files for duplicated workflow bodies or stale
   non-harness instruction locations:

```sh
rg -n '\.instructions|workflow steps|coding standards|skill inventories' AGENTS.md CLAUDE.md .github .claude .agents
```

4. Search for accidental local paths:

```sh
rg -n '/(Users|Volumes)/' AGENTS.md CLAUDE.md .github .claude .agents
```

5. Search separately for any external repository names or task-specific
   source names that should not appear in the current repository.
6. Run `git diff --check`.
