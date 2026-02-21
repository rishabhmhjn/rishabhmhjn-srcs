# @rishabhmhjn/dotfiles

Personal shell dotfiles managed as an Nx package.

## Structure

```
packages/dotfiles/
├── dotfiles/          # The actual dotfiles
│   ├── .aliases       # Shell aliases
│   ├── .dotfilerc     # Entry point — source this from ~/.zshrc
│   ├── .functions     # Shell functions
│   ├── .gitconfig     # Git config (aliases, push defaults, user info)
│   ├── .gitignore     # Global gitignore
│   ├── .tmux.conf     # tmux config
│   └── .vimrc         # Vim config
├── scripts/
│   └── init.sh        # Init script
├── package.json
└── project.json
```

## Init

Copies dotfiles into a timestamped release and wires tool configs into your `$HOME` files via native includes.

```bash
# Via npx
npx @rishabhmhjn/dotfiles

# Via Nx
nx run dotfiles:init

# Via npm (from this directory)
npm run init
```

### What it does

1. Creates `~/.dotfiles/releases/{timestamp}/` and copies all dotfiles there
2. Points `~/.dotfiles/current` → that release (symlink)
3. Appends native include directives to your `$HOME` config files (idempotent):
   - `~/.gitconfig` — `[include] path = ~/.dotfiles/current/.gitconfig`
   - `~/.vimrc` — `source ~/.dotfiles/current/.vimrc`
   - `~/.tmux.conf` — `source-file ~/.dotfiles/current/.tmux.conf`

> `.gitignore` is wired automatically via `core.excludesFile` inside `.gitconfig` — no separate `$HOME` entry needed.

### After init (one-time manual step)

Add to your `~/.zshrc`:

```bash
source ~/.dotfiles/current/.dotfilerc
```

This sources aliases, functions, and sets up PATH, history, locale, editor, rbenv/rvm.

## Rollback

Each run creates a new release. To roll back to a previous one:

```bash
ln -sfn ~/.dotfiles/releases/<timestamp> ~/.dotfiles/current
```

List available releases:

```bash
ls ~/.dotfiles/releases/
```
