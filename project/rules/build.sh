#!/usr/bin/env bash
# Assembles the rulebook into book.md. Order here is the order in the book.
set -euo pipefail
cd "$(dirname "$0")"

pandoc --defaults=book.yml \
  1-introduction.md \
  2-character.md \
  3-playing.md \
  4-classes.md \
  5-essences.md \
  6-spells.md \
  spells/7-00-spell-reference.md \
  spells/7-0[1-9]-*.md \
  spells/7-1[0-8]-*.md \
  8-feats.md \
  appendix-a-glossary.md

# pandoc emits '``` mermaid'; GitHub is happier with the info string unpadded
sed -i 's/^``` mermaid$/```mermaid/' book.md

echo "wrote book.md ($(wc -l < book.md) lines)"
