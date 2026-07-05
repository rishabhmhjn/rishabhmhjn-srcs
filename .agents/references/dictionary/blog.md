# Blog Dictionary

Use these terms when writing blog workflow guidance, planning blog
posts, creating blog branches, or discussing blog content conventions.
Use [general.md](general.md) when deciding whether to also load generic
AI harness, worktree, or codebase terms.

- [Blog Dictionary](#blog-dictionary)
  - [Content Terms](#content-terms)
    - [Blog Post](#blog-post)
    - [Blog Slug](#blog-slug)
    - [Post-Local Terminology](#post-local-terminology)
  - [Branching Terms](#branching-terms)
    - [Blog Worktree](#blog-worktree)
    - [Blog Feature Branch](#blog-feature-branch)

## Content Terms

### Blog Post

A Markdown document in the Astro/Starlight blog content folder with
frontmatter and post body.

### Blog Slug

The lowercase kebab-case identifier for a blog post.

Use the blog slug as the Markdown filename and as the blog feature
branch name unless the user explicitly chooses a different branch name.

### Post-Local Terminology

The vocabulary list built while writing one blog post. It captures
topic-specific terms, definitions, preferred wording, and distinctions
needed for that post.

Do not store this as shared harness terminology unless the term is also
useful across future AI guidance or codebase work.

## Branching Terms

### Blog Worktree

The permanent slot worktree used for creating, editing, and managing
blog posts.

The blog worktree is reusable across blog posts. Each blog post should
still use its own blog feature branch when preparing a pull request. The
blog feature branch should be created as `blog/<blog-slug>` after local
`main` has been refreshed from `origin/main`.

For the template placeholders in `.agents/references/git-worktrees.md`:

- `<slot-branch>` is `main-blog`.
- `<topic>` is `blog`.
- `<slug>` is the selected blog slug.
- the topic parent and start point remain `main`.
- `main-blog` only keeps the permanent blog worktree active.

### Blog Feature Branch

A feature branch created from the blog worktree for one blog post.

The branch name should use the blog slug selected during the blog
planning workflow. Create it only after refreshing local `main` from
`origin/main`. Use this branch for the pull request that will be
squash-merged into `main`.
