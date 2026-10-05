# Git Branching & Safety Rule

> **CRITICAL POLICY:** Every new feature, bug fix, chore, or documentation change must be developed on its own dedicated branch. Antigravity/AI agents must **NEVER** merge into `main`, `master`, or `develop`. The human developer reviews and merges manually.

---

## 1. Branch Protection & Safe Execution Rules
1. **Never Commit Directly to Main/Master/Develop**:
   - Committing directly to `main`, `master`, or `develop` is strictly forbidden.
   - Always verify the current branch with `git branch --show-current` before making any commits. If on `main` or `master`, immediately branch off to a dedicated feature branch.

2. **Never Merge or Force Push to Protected Branches**:
   - **DO NOT** execute `git merge` into `main` or `master`.
   - **DO NOT** execute `git push origin main` or `git push origin master`.
   - **DO NOT** execute `git push --force` or `git push -f` on any branch.
   - **DO NOT** execute `git rebase` on `main` or `master`.

3. **Destructive Commands Restricted**:
   - Never delete branches (local or remote) without explicit user confirmation.
   - Never run `git reset --hard` or `git clean -fd` without asking the user first.

4. **Working Tree Cleanliness**:
   - If the working tree has uncommitted or dirty changes, notify the user and ask for instructions before switching branches or pulling upstream.

5. **Conventional Commits**:
   - Make small, incremental, logically isolated commits with clear messages following the Conventional Commits specification:
     - `feat:` (new feature)
     - `fix:` (bug fix)
     - `chore:` (maintenance, dependencies)
     - `docs:` (documentation, README, guides)
     - `test:` (adding or refactoring tests)
     - `refactor:` (code refactoring without functional changes)
     - `style:` (formatting, UI cosmetic styling)

6. **Secrets & Credentials Prevention**:
   - **NEVER** commit secrets, API keys, tokens, or environment files (`.env`, `.env.local`, `config/master.key`, `config/credentials/*.key`, Active Storage local disk storage files, etc.).
   - Always verify `.gitignore` covers all sensitive files before committing.
