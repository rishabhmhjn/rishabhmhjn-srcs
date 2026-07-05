# Git Worktrees

Use this guide to set up permanent worktrees for recurring areas of work
and short-lived topic branches for individual changes.

This repository uses `main` as the constant integration branch. Do not
set up a develop/main git-flow model. Topic branches start from `main`
and should be squash-merged into `main`.

Use `origin/main` as the source of truth for refreshing local `main`.
Do not use a potentially stale local `main` as the start point for new
topic branches.

## Concepts

- A **permanent worktree** is a long-lived checkout for a recurring work
  area.
- A **slot worktree** is a permanent worktree dedicated to one recurring
  topic. The slot is identified by its purpose and git-flow config, not
  by the filesystem folder name.
- A **recurring topic type** is a git-flow topic type for one recurring
  area.
- A **topic branch** is a short-lived branch for one change, such as
  `<topic>/<slug>`.

Do not create a new worktree for every individual change. Reuse the
permanent worktree for the recurring area, create one topic branch per
change, open a PR from that branch, and squash-merge it into `main`.

Before creating any topic branch, refresh local `main` from
`origin/main` in a checkout where `main` is available.

## Discover Current State

Run from the main repository checkout:

```sh
git worktree list --porcelain
git fetch origin main
git config --get-regexp '^(gitflow|branch\..*\.(remote|merge|rebase))' || true
git-flow config list
```

If local `main` exists and is not checked out in another worktree, it is
fine to update it after fetching:

```sh
git checkout main
git pull --ff-only origin main
```

If `git-flow config list` fails because `git-flow` is unavailable,
install or enable the git-flow-next tooling before running the setup
commands. Do not hand-edit `.git/config` when the git-flow command can
write the config.

## Initialize Git Flow

Use git-flow-next with `main` as the stable integration branch. Do not
create or rely on a `develop` branch.

Run from the main repository checkout. Use non-interactive flags so the
command can run from agents, scripts, and other non-TTY environments:

```sh
git fetch origin main
git checkout main
git pull --ff-only origin main

git-flow init --local --preset=github --main=main --no-create-branches
git config --unset-all gitflow.branch.develop.type
git config --unset-all gitflow.branch.develop.parent
git config --unset-all gitflow.branch.develop.autoupdate
git-flow config delete topic feature
git-flow config edit base main --downstream-strategy=rebase
```

Do not use `git-flow init --custom` for shared setup instructions because
it is interactive. Use `--force` only when intentionally replacing an
existing git-flow configuration.

The `github` preset creates the `main` base configuration. Do not run
`git-flow config add base main` after initialization; it fails because
`main` already exists. The cleanup commands remove the preset's default
`feature/` topic type and the legacy `develop` compatibility stub that
the preset writes without creating a branch.

For recurring work, configure a slot branch for the permanent worktree
and a topic type that starts from and merges back to `main`:

```sh
slot_branch=<slot-branch>
topic=<topic>

git-flow config add base "$slot_branch" main --downstream-strategy=rebase
git branch --set-upstream-to=origin/main "$slot_branch"
git config "branch.$slot_branch.rebase" true
git-flow config add topic "$topic" main --prefix="$topic/" --starting-point=main --upstream-strategy=squash
```

This enables topic branches such as `<topic>/<slug>`.

Do not use the same value for `<slot-branch>` and `<topic>`.
Git-flow-next does not allow a base branch config and a topic branch type
to share the same name.

## Configure Recurring Topic Work

Use this flow from the permanent worktree after the user has created
that worktree.

The user owns creating the permanent worktree and choosing its path. The
path may be tool-managed, user-selected, or otherwise outside the main
checkout tree. Do not assume a parent directory for permanent worktrees.
The folder name does not need to match the topic name.

Before starting a topic branch, refresh local `main` from `origin/main`
in a checkout where `main` is available:

```sh
git fetch origin main
git checkout main
git pull --ff-only origin main
```

Then refresh the slot branch in the permanent worktree:

```sh
slot_branch=<slot-branch>

git checkout "$slot_branch"
git rebase origin/main
```

Then verify the topic type exists:

```sh
git-flow config list
```

The resulting topic type must have this behavior:

```text
name: <topic>
type: topic
parent: main
startpoint: main
prefix: <topic>/
upstream strategy: squash
```

Expected shape after setup:

```text
worktree path: user-created path
slot branch: <slot-branch>
topic branches: <topic>/<slug>
```

## Start a Topic Branch

Before creating the topic branch, refresh local `main` from
`origin/main` in a checkout where `main` is available:

```sh
git fetch origin main
git checkout main
git pull --ff-only origin main
```

Then refresh the slot branch in the permanent worktree:

```sh
slot_branch=<slot-branch>
topic=<topic>
slug=<slug>

git checkout "$slot_branch"
git rebase origin/main
```

Then run from the permanent worktree:

```sh
git-flow "$topic" start "$slug"
```

If the custom `git-flow <topic> start` command is unavailable, or the
custom topic type has not yet been registered, use plain git as a
fallback:

```sh
git fetch origin main
git checkout main
git pull --ff-only origin main
```

Then refresh the slot branch in the permanent worktree:

```sh
slot_branch=<slot-branch>
topic=<topic>
slug=<slug>

git checkout "$slot_branch"
git rebase origin/main
```

Then run from the permanent worktree:

```sh
git checkout -b "$topic/$slug" main
```

Use the final selected slug as `<slug>`. The PR branch should be
`<topic>/<slug>`.

Do not create a new topic branch from stale local state. If
`git rebase origin/main` cannot update cleanly, stop and resolve that
first.

## Open and Merge the Pull Request

Push the topic branch and open a pull request against `main`:

```sh
git push -u origin "<topic>/<slug>"
```

The PR should be squash-merged into `main`. After merge, remove the
local topic branch if it still exists, then refresh the slot branch:

```sh
slot_branch=<slot-branch>
topic=<topic>
slug=<slug>

git fetch origin main
git checkout "$slot_branch"
git rebase origin/main
git branch -d "$topic/$slug"
```

## Rules

- Check `git worktree list --porcelain` before creating a permanent
  worktree.
- Treat worktree paths as local environment choices. Discover and report
  the actual path; do not encode a default parent directory in shared
  guidance.
- Do not infer the topic from the worktree folder name. Inspect the
  checked-out branch and git-flow config.
- Keep topic names short and tied to recurring work areas.
- Do not register a git-flow base branch with the same name as the topic
  type.
- Create new topic branches only after updating from `origin/main`.
- Register or verify a matching git-flow topic type so short-lived
  branches use `<topic>/<slug>` when the installed git-flow tooling
  supports custom topic commands.
- Use a squash PR merge for topic branches.
- Do not create task-memory files for recurring worktree state.
