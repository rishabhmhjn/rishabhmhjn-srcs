---
name: commit-message
description: Suggest or validate commit messages and PR titles by inspecting the relevant diff, reading the resolved commitlint config, and applying the repo's commit message conventions.
---

# Commit Message

Use this skill when suggesting a commit message, validating a commit
message or PR title, preparing to run `git commit`, or preparing to
create/update a pull request.

## Requirements

- Never suggest a commit message until you have inspected the relevant
  diff.
- Before suggesting or validating a message, read the resolved
  commitlint config from:

```sh
npm exec commitlint -- --print-config
```

- Before running `git commit`, validate the exact final commit message:

```sh
printf '%s\n' '<type>(<scope>): <subject>' | npm exec commitlint
```

- Only run `git commit` after commitlint accepts the exact message.
- Before creating or updating a pull request, make the PR title follow
  the same style as a commit header and validate the exact title with
  commitlint.
- Do not use `--no-verify` to bypass commit hooks.
- If commitlint is unavailable, stop and ask the user to install
  dependencies or paste the resolved config.

## Background

This repo uses `@commitlint/config-angular` through
`commitlint.config.cjs`.

The format is:

```text
<type>(<scope>): <subject>

<body?>

<footer?>
```

The scope is optional unless the resolved commitlint config says
otherwise.

## Subject Rules

- Use imperative mood: `add`, `fix`, `update`, `remove`, `configure`.
- Do not end the subject with a period.
- Describe what the commit accomplishes, not a vague activity log.
- Resolve the commitlint config before deciding the final message, then
  follow its header, body, and footer length rules exactly.

A good subject should complete:

```text
If applied, this commit will <subject>
```

## Choosing Type And Scope

Always prefer the type and scope allowed by the resolved commitlint
config. As a default guide:

- `feat`: new user-facing behavior or content.
- `fix`: bug fixes or incorrect behavior.
- `docs`: documentation-only changes.
- `build`: build, package, dependency, or tooling setup.
- `ci`: CI workflow and deployment automation changes.
- `style`: formatting or style-only changes.
- `refactor`: restructuring without behavior change.
- `test`: test-only changes.

Use a scope that matches the primary affected area, such as:

- `blog`
- `site`
- `agents`
- `commitlint`
- `deps`

For mixed changes, choose the scope that best explains the main intent.

## Suggesting A Message

When asked to suggest a commit message:

1. Run `git status --short`.
2. Prefer staged changes with `git diff --cached`.
3. If nothing is staged, inspect `git diff` and relevant untracked
   files, then say the suggestion is based on unstaged changes.
4. Run `npm exec commitlint -- --print-config`.
5. Draft a message that fits the resolved config.
6. Validate the exact message through stdin before presenting it.

For multi-line messages, validate the full message exactly as it will be
committed:

```sh
printf '%s\n\n%s\n' \
  '<type>(<scope>): <subject>' \
  '<body>' | npm exec commitlint
```

## Before Commit

Before running `git commit`, always:

1. Decide the exact final message.
2. Validate it with `npm exec commitlint`.
3. Commit only after validation succeeds.

The `commit-msg` Husky hook also runs `commitlint --edit` on every
commit. The pre-validation step catches message failures earlier, before
the full commit flow reaches the hook.

## Pull Request Titles

PR titles should use the same convention as commit headers:

```text
<type>(<scope>): <subject>
```

Before creating or updating a PR:

1. Inspect the branch diff or the commits that will be included.
2. Run `npm exec commitlint -- --print-config`.
3. Pick a title that fits the resolved header rules.
4. Validate the exact title through stdin:

```sh
printf '%s\n' '<type>(<scope>): <subject>' | npm exec commitlint
```

Only create or update the PR after the title passes commitlint.
