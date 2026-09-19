# Contributing to Group 7 — IoT BTech (group-7-web-dev-iotbtech)

Thank you for contributing! This document explains the project's workflow, branch strategy, and how to open a good pull request so we can collaborate smoothly.

## Quick start
- Clone the repo:
  git clone git@github.com:Nikinggs/group-7-web-dev-iotbtech.git
  cd group-7-web-dev-iotbtech

- Create a branch for your work (from the default branch):
  git checkout -b feature/123-short-description

- Commit changes with clear messages and push:
  git add .
  git commit -m "feat(#123): short description"
  git push -u origin feature/123-short-description

- Open a Pull Request on GitHub against the default branch.

## Branching and naming
- Default branch: main (protected)
- Branch name examples:
  - feature/<issue>-short-description
  - fix/<issue>-short
  - chore/<topic>
  - hotfix/<description>

## Pull Request workflow
1. Push your branch to this repository (or your fork) and open a PR targeting `main`.
2. In the PR description, reference any related issue (e.g., fixes #42), explain what changed, and include test steps.
3. Request reviewers. Address feedback by pushing more commits to the same branch — the PR updates automatically.
4. After required approvals and passing CI checks, a maintainer will merge the PR.
5. Delete your feature branch after merge (GitHub can do this automatically).

## Reviews & approvals
- We require at least 1 review before merging (configured via branch protection).
- Use inline code comments for specific feedback. Mark approvals when ready.

## CI and checks
- Keep changes small and focused. CI will run on PRs; ensure all tests and linters pass before requesting final review.
- If you need a CI job added for your language/stack, open an issue or ask a maintainer.

## Rebase vs merge
- Prefer keeping history clean: rebase onto main when you want a linear history, or use merge when preserving feature branch history is important.
- If you rebase and have already pushed, use `git push --force-with-lease` to update the remote branch.

## Commit message convention
- Use short, meaningful messages. Example:
  feat(auth): add login endpoint
  fix(ui): fix navbar overlap on mobile

## Reporting issues
- Use Issues for bugs and feature requests. Fill out the provided template when available.

## Code of conduct
- Be respectful and constructive in reviews and discussions.

## Who to contact
- Repo lead / maintainer: @Nikinggs

---
This file was added by the project maintainer to document the contribution workflow.
