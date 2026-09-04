#!/usr/bin/env bash
# Simula o clone degradado do Windows: troca os symlinks por arquivos de texto
# contendo o caminho, roda o instalar, e verifica que virou conteúdo real.
set -euo pipefail
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
cp -r --no-dereference "$(dirname "$0")/.." "$tmp/chassi"
cd "$tmp/chassi"
rm -f CLAUDE.md .claude/skills
printf 'AGENTS.md' > CLAUDE.md
mkdir -p .claude && printf '../.agents/skills' > .claude/skills
./scripts/instalar >/dev/null
grep -q "chassi" CLAUDE.md || { echo "FALHOU: CLAUDE.md não virou conteúdo real"; exit 1; }
[ -d .claude/skills ] || { echo "FALHOU: .claude/skills não virou diretório"; exit 1; }
echo "OK: conserto de symlink degradado funciona"
