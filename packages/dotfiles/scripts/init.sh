#!/usr/bin/env bash
set -e

# Resolve the real script location, following symlinks (e.g. when run via npx)
SOURCE="${BASH_SOURCE[0]}"
while [ -L "$SOURCE" ]; do
  DIR="$(cd "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
SCRIPT_DIR="$(cd "$(dirname "$SOURCE")" && pwd)"
DOTFILES_SOURCE="$SCRIPT_DIR/../dotfiles"
VENDORS_SOURCE="$SCRIPT_DIR/../vendors"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RELEASE_DIR="$HOME/.dotfiles/releases/$TIMESTAMP"
CURRENT_LINK="$HOME/.dotfiles/current"

echo "==> Creating release: $RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

# Copy all dotfiles into the release dir (including dot-prefixed files)
cp "$DOTFILES_SOURCE"/.[!.]* "$RELEASE_DIR/"

# Generate git-flow completions into the release if git-flow is available
if command -v git-flow >/dev/null 2>&1; then
  if git-flow completion zsh >"$RELEASE_DIR/.git-flow-completions" 2>/dev/null; then
    echo "==> Generated: $RELEASE_DIR/.git-flow-completions"
  else
    rm -f "$RELEASE_DIR/.git-flow-completions"
    echo "==> Skipping git-flow completions (unsupported command output)"
  fi
fi

# Copy all vendored plugins into the release dir
PLUGINS_DIR="$RELEASE_DIR/plugins"
mkdir -p "$PLUGINS_DIR"
if [ -d "$VENDORS_SOURCE" ]; then
  echo "==> Copying plugins from: $VENDORS_SOURCE"
  for plugin in "$VENDORS_SOURCE"/*; do
    [ -d "$plugin" ] || continue
    plugin_name="$(basename "$plugin")"
    cp -R "$plugin" "$PLUGINS_DIR/$plugin_name"
    echo "    Copied plugin: $plugin_name"
  done
fi

# Update the current symlink to point to the new release
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"
echo "==> Linked: $CURRENT_LINK -> $RELEASE_DIR"

# Helper: append a block to a file if the marker line isn't already present
append_if_missing() {
  local file="$1"
  local marker="$2"   # unique string to check for (idempotency)
  local content="$3"  # full block to append
  touch "$file"
  if ! grep -qF "$marker" "$file"; then
    printf "\n%s\n" "$content" >> "$file"
    echo "    Updated: $file"
  else
    echo "    Already set: $file"
  fi
}

echo ""
echo "==> Wiring tool configs via native includes..."

# gitconfig — git [include] (gitignore handled via core.excludesFile inside managed gitconfig)
append_if_missing \
  "$HOME/.gitconfig" \
  "path = ~/.dotfiles/current/.gitconfig" \
  "# Added by @rishabhmhjn/dotfiles
[include]
  path = ~/.dotfiles/current/.gitconfig"

# vimrc — vim source
append_if_missing \
  "$HOME/.vimrc" \
  "source ~/.dotfiles/current/.vimrc" \
  '" Added by @rishabhmhjn/dotfiles
source ~/.dotfiles/current/.vimrc'

# tmux.conf — tmux source-file
append_if_missing \
  "$HOME/.tmux.conf" \
  "source-file ~/.dotfiles/current/.tmux.conf" \
  "# Added by @rishabhmhjn/dotfiles
source-file ~/.dotfiles/current/.tmux.conf"

echo ""
echo "Done! Dotfiles installed from release $TIMESTAMP."
echo ""
echo "To activate shell dotfiles, add this to your ~/.zshrc or ~/.zprofile:"
echo ""
echo "  source ~/.dotfiles/current/.dotfilerc"
echo ""
echo "To roll back to a previous release, re-point the current symlink:"
echo ""
echo "  ln -sfn ~/.dotfiles/releases/<timestamp> ~/.dotfiles/current"
echo ""
