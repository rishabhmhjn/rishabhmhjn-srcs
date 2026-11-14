# @rishabhmhjn/dotfiles

Personal shell dotfiles managed as an Nx package.

## Structure

```
packages/dotfiles/
├── dotfiles/          # The actual dotfiles
│   ├── .aliases       # Shell aliases
│   ├── .dotfilerc     # Entry point — source this from ~/.zshrc
│   ├── .zsh-plugins   # zsh plugin loader
│   ├── .functions     # Shell functions
│   ├── .gitconfig     # Git config (aliases, push defaults, user info)
│   ├── .gitignore     # Global gitignore
│   ├── .tmux.conf     # tmux config
│   └── .vimrc         # Vim config
├── vendors/           # zsh plugins as git submodules
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
2. Copies `vendors/*` into `~/.dotfiles/releases/{timestamp}/plugins/`
3. Points `~/.dotfiles/current` → that release (symlink)
4. Appends native include directives to your `$HOME` config files (idempotent):
   - `~/.zshrc` — initializes Zsh completion, then sources `~/.dotfiles/current/.dotfilerc`.
     If the source line from the old manual setup is already present, the installer adds completion initialization before it.
   - `~/.gitconfig` — `[include] path = ~/.dotfiles/current/.gitconfig`
   - `~/.vimrc` — `source ~/.dotfiles/current/.vimrc`
   - `~/.tmux.conf` — `source-file ~/.dotfiles/current/.tmux.conf`

> `.gitignore` is wired automatically via `core.excludesFile` inside `.gitconfig` — no separate `$HOME` entry needed.

### After init

Open a new terminal or run `exec zsh` to activate the shell configuration.

This sources aliases, functions, and sets up PATH, history, locale, editor, rbenv/rvm.

It also sources `~/.dotfiles/current/.zsh-plugins`, where plugins are loaded from `~/.dotfiles/current/plugins/<name>/...`.

### Optional Oh My Zsh setup

Run from the repository root to install and enable Oh My Zsh with Powerlevel10k:

```bash
DOTFILES_WITH_OH_MY_ZSH=1 bash packages/dotfiles/scripts/init.sh
```

The installer reuses `~/.oh-my-zsh` if present and preserves existing Oh My Zsh
configuration. For a new setup it loads Oh My Zsh before the dotfiles plugins
and selects Powerlevel10k if `ZSH_THEME` is unset. With Powerlevel10k active,
it loads your existing `~/.p10k.zsh` if present, or the saved prompt from the
current dotfiles release. The installer leaves your plugin list intact, and the
dotfiles still load autosuggestions, Nx completion, and syntax highlighting.
Run without the environment variable for the standard dotfiles installation.

## Managing zsh plugins

Add plugin repositories under `packages/dotfiles/vendors/` (typically as git submodules), then source their entry points in `packages/dotfiles/dotfiles/.zsh-plugins`.

Each `init` run copies vendored plugins into the new release so rollbacks remain self-contained.

### Add a new plugin

1. Add the plugin repository under `packages/dotfiles/vendors/`:

```bash
git submodule add <plugin-repo-url> packages/dotfiles/vendors/<plugin-name>
```

Examples:

```bash
git submodule add https://github.com/zsh-users/zsh-autosuggestions packages/dotfiles/vendors/zsh-autosuggestions
git submodule add https://github.com/zsh-users/zsh-syntax-highlighting packages/dotfiles/vendors/zsh-syntax-highlighting
```

2. Add its entry script to `plugin_entries` in `packages/dotfiles/dotfiles/.zsh-plugins`.
   - Use a path relative to `~/.dotfiles/current/plugins/`
   - Format: `"<vendor-directory>/<entry-script>.zsh"`

Example:

```zsh
typeset -a plugin_entries=(
  "zsh-autosuggestions/zsh-autosuggestions.zsh"
  "nx-completion/nx-completion.plugin.zsh"
  "zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
)
```

3. Run init again to create a new release with copied plugins:

```bash
nx run dotfiles:init
```

## Rollback

Each run creates a new release. To roll back to a previous one:

```bash
ln -sfn ~/.dotfiles/releases/<timestamp> ~/.dotfiles/current
```

List available releases:

```bash
ls ~/.dotfiles/releases/
```
