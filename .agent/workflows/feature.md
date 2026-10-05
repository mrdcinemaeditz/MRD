# Feature Workflow (`/feature`)

This workflow governs how new features, bug fixes, chores, and documentation are developed and delivered on isolated branches.

---

## 🛠 Step-by-Step Execution Workflow

### Step 1: Check Working Tree Cleanliness
Run `git status` to verify the working directory is clean.
- If uncommitted changes exist, **STOP** and ask the user how they would like to proceed (stash, commit, or discard).

### Step 2: Safely Sync Main
Switch to `main` and pull the latest upstream changes:
```bash
git checkout main
git pull origin main
```

### Step 3: Create Dedicated Feature Branch
Branch off with an appropriate prefix and short kebab-case name:
- Features: `git checkout -b feature/<short-kebab-case-name>`
- Bug Fixes: `git checkout -b fix/<short-kebab-case-name>`
- Maintenance/Chores: `git checkout -b chore/<short-kebab-case-name>`
- Documentation: `git checkout -b docs/<short-kebab-case-name>`

### Step 4: Propose Changes & Await Confirmation
Present the user with the list of planned files to create or modify and the technical approach. Wait for the user's confirmation before modifying code.

### Step 5: Implement Changes with Logical Commits
- Implement changes cleanly and modularly.
- Separate backend and frontend commits where possible.
- Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).

### Step 6: Automated Verification Checks
Before the final commit and push, run all project verification suites:
- **Backend**:
  ```bash
  cd backend && bundle exec rspec
  # bundle exec rubocop (if configured)
  ```
- **Frontend**:
  ```bash
  cd frontend && npm run lint && npm run build
  ```
- Resolve any test failures, lint errors, or build issues on the feature branch.

### Step 7: Push Feature Branch to Remote
Push only the active feature branch to GitHub:
```bash
git push -u origin <branch-name>
```

### Step 8: Deliver Summary & Handoff
**STOP here. DO NOT MERGE into main.**
Provide the user with a structured handoff summary containing:
- **Branch Name**: `feature/<name>`
- **Files Changed / Created**
- **Feature Overview**: What was built and key implementation decisions
- **Testing Guide**: Step-by-step instructions for manual testing
- **Database / ENV Requirements**: Any migrations to run (`rails db:migrate`) or `.env` variables to add
- **Suggested PR Title & Description**: Ready to copy-paste into GitHub

### Step 9: Final Merge Reminder
Conclude with the reminder:
> *"Review the branch and merge it into main manually."*
