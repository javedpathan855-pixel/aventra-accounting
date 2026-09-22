# GIT_WORKFLOW.md

## BRANCHES
Preferred:
```text
feature/<name>
fix/<name>
hotfix/<name>
```
Use lowercase kebab-case.

## COMMITS
Atomic Conventional Commits:
```text
feat(invoice): add finalization
fix(tax): correct rounding
refactor(auth): simplify session guard
```

## BEFORE COMMIT
Review:
```text
git status
git diff
git diff --cached
```
Do not stage unrelated work.

## PROHIBITED WITHOUT AUTHORIZATION
- git reset --hard
- git clean -fd
- destructive branch deletion
- force push
- shared-history rewrite

Prefer `git revert` for undoing shared history.

## SECRETS
Never commit secrets, production env files with credentials, database dumps, customer data, or private keys.

## MIGRATIONS
Commit schema changes with appropriate migrations. Never rewrite applied production migrations.

## AGENT
Do not commit or push unless explicitly authorized or the project has an approved automated workflow that does so.
