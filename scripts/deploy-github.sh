#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login --web"
  exit 1
fi

owner="$(gh api user --jq .login)"
repo="personal-homepage"
repository="$owner/$repo"
release_tag="notes-v1"
release_base="https://github.com/$repository/releases/latest/download"

RELEASE_BASE="$release_base" perl -0pi -e \
  's#assets/notes/([a-z0-9-]+\.pdf)#$ENV{RELEASE_BASE}/$1#g' index.html

git add index.html
if ! git diff --cached --quiet; then
  git commit -m "Link course notes from GitHub Releases"
fi

if ! gh repo view "$repository" >/dev/null 2>&1; then
  gh repo create "$repo" \
    --public \
    --description "Personal academic homepage and mathematics course notes" \
    --source . \
    --remote origin \
    --push
else
  if ! git remote get-url origin >/dev/null 2>&1; then
    git remote add origin "https://github.com/$repository.git"
  fi
  git push -u origin main
fi

note_files=(
  assets/notes/mathematical-analysis-1.pdf
  assets/notes/mathematical-analysis-2.pdf
  assets/notes/mathematical-analysis-3.pdf
  assets/notes/advanced-algebra.pdf
  assets/notes/algebra-1.pdf
  assets/notes/ordinary-differential-equations.pdf
)

if gh release view "$release_tag" --repo "$repository" >/dev/null 2>&1; then
  gh release upload "$release_tag" "${note_files[@]}" --clobber --repo "$repository"
else
  gh release create "$release_tag" "${note_files[@]}" \
    --repo "$repository" \
    --title "课程笔记" \
    --notes "个人主页公开课程笔记 PDF。"
fi

if ! gh api "repos/$repository/pages" >/dev/null 2>&1; then
  gh api --method POST "repos/$repository/pages" \
    -f 'source[branch]=main' \
    -f 'source[path]=/' >/dev/null
fi

echo "Deployment configured: https://$owner.github.io/$repo/"
