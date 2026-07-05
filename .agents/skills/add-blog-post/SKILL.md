---
name: add-blog-post
description: Use when adding, drafting, planning, or starting a new blog post for the Astro/Starlight blog, including topic intake, interviewing, related-post and tag research, terminology alignment, draft creation, and validation.
---

# Add Blog Post

Use this skill when the user wants to add, draft, write, plan, or start a
new blog post for the Astro site.

Blog posts live in:

```text
projects/rishabhmhjn.com/app/src/content/docs/blog/
```

Blog assets live in:

```text
projects/rishabhmhjn.com/app/src/content/docs/blog/assets/
```

Use frontmatter with:

```yaml
---
title: "Post title"
date: YYYY-MM-DD
description: "Short summary"
tags: ["Tag"]
---
```

## Workflow

Before starting, read `.agents/references/terminology.md` and follow
its dictionary routing. Keep shared harness terminology separate from
the post-local terminology used to write the blog.

Use `.agents/references/git-worktrees.md` for permanent blog worktree,
git-flow config, and blog topic branch rules. Include the final
`blog/<slug>` branch name in the plan and report.

### 1. Topic intake

If the user provides a topic, restate it in one sentence and begin
discovery.

If the user does not provide a topic, ask for the topic before doing
anything else.

Do not draft from a shallow prompt. Treat the first topic as a starting
point, not enough material to write the post.

### 2. Existing blog research

Before interviewing deeply, inspect the existing blog posts:

- list titles, descriptions, dates, and tags from existing frontmatter.
- identify related posts, overlapping posts, and adjacent angles.
- identify tag patterns and recommend tags, reusing current tags when
  they fit.
- call out when the new topic risks repeating an existing post.

Share the related-post and tag findings with the user before finalizing
the angle.

### 3. Interview relentlessly

Interview the user until the post has enough substance to draft.

Cover these areas:

- thesis: the main claim or question.
- audience: who the post is for and what they already know.
- purpose: what the reader should think, feel, or do afterward.
- personal angle: why the user is writing this and what experience
  informs it.
- examples: concrete incidents, comparisons, anecdotes, commands, code,
  screenshots, or evidence.
- counterpoints: what a thoughtful reader might object to.
- boundaries: what the post should not cover.
- ending: the takeaway, question, call to action, or open loop.

Ask focused follow-up questions instead of broad questionnaires. Keep
going until the answers produce a clear outline and vocabulary.

### 4. Maintain terminology

During the interview, keep a working terminology list. Include:

- term.
- meaning in this post.
- preferred wording.
- terms to avoid or clarify.
- any distinction that prevents misunderstanding.

Use this list to sharpen the post's vocabulary and to resolve ambiguous
phrasing before drafting.

This is post-local terminology. Do not add it to shared harness
terminology unless the term is also useful for future AI guidance,
workflow instructions, or codebase discussion.

### 5. Blog plan

Before writing the file, propose:

- 2-4 title options.
- final slug.
- blog feature branch name using the final slug.
- description.
- tags.
- outline.
- key claims.
- related posts considered.
- terminology list.

Ask for confirmation only on high-impact unresolved choices, such as the
central thesis, title, slug, blog feature branch name, or whether to
publish as a draft.

### 6. Draft or create the post

When there is enough material and the user wants the post created:

- follow `.agents/references/git-worktrees.md` to update the permanent
  blog worktree and create or switch to the `blog/<slug>` feature branch
  before writing files, unless the user explicitly asks to draft without
  touching git state.
- create one Markdown file in the blog folder.
- use today's date unless the user specifies another date.
- preserve the user's voice.
- follow existing Markdown and frontmatter conventions.
- reference images as `./assets/<filename>` only when images are
  provided, requested, or clearly needed.
- do not create unrelated files or task/project memory.

If the user only wants a draft in chat, provide the draft without
creating a file.

### 7. Validate and report

After creating or editing a post:

1. Run `git diff --check`.
2. Run the site build through Nx/package-manager tooling for the
   `rishabhmhjn.com` project.

Report:

- file created or changed.
- chosen title, slug, blog feature branch name, description, and tags.
- related posts considered.
- terminology list.
- any shared harness terminology consulted or updated.
- validation commands and results.
- any follow-up questions or intentionally deferred assets.
