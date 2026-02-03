---
name: operating-git
description: Comprehensive guide for managing Git operations in large-scale projects following best practices. Covers branch management, commit conventions, code synchronization, conflict resolution, and push workflows.
license: MIT
metadata:
    author: sqliang
    version: "1.0.0"
---


  # Git Project Practices Guide

  This skill provides comprehensive guidance for Git operations in large-scale projects.
  Follow these principles: **Clean Trunk** and **Linear History**.

  ## Core Principles

  - **Clean Trunk**: The main branch (main/master) should only contain reviewed and tested code.
    Never work directly on the main branch.
  - **Linear History**: Avoid merge commits. Use rebase or squash to maintain linear history.
  - **Feature Branches**: Each feature/fix should be developed on a separate branch.
  - **Conventional Commits**: Follow Conventional Commits specification for commit messages.

  ## 1. Branch Strategy & Setup

  Before starting any work, ensure the main branch is up-to-date:

  ```bash
  # Switch to main branch
  git checkout main

  # Fetch latest changes from remote
  git pull origin main

  # Rebase to maintain linear history
  git pull --rebase origin main

  # Create a new feature branch with descriptive name
  git checkout -b feature/add-user-auth
  # or for bug fixes
  git checkout -b fix/resolve-login-issue
  ```

  Branch naming conventions:
  - Use `feature/` prefix for new features
  - Use `fix/` prefix for bug fixes
  - Keep names descriptive and kebab-case

  ## 2. Commit Conventions

  Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

  ### Commit Message Format
  ```
  <type>(<scope>): <description>

  [optional body]

  [optional footer]
  ```

  ### Type Categories
  - **feat**: New feature
  - **fix**: Bug fix
  - **docs**: Documentation changes
  - **style**: Formatting changes (no code logic impact)
  - **refactor**: Code refactoring (no new features or fixes)
  - **test**: Adding or modifying tests
  - **chore**: Other changes (no code logic impact)

  ### Example Commit Message
  ```
  feat(auth): 添加用户认证功能

  添加用户登录、注册、注销等功能，确保系统安全。

  #### 变更影响
  - 新增用户认证模块，包括登录、注册、注销等功能。
  - 新增用户角色管理功能，用于分配不同的权限。

  Closes #123
  ```

  ### Using Commitizen (Recommended)
  ```bash
  # Install globally
  npm install -g commitizen

  # Or per-project
  npm install commitizen --save-dev

  # Interactive commit
  git cz
  ```

  ## 3. Synchronization & Conflict Resolution

  When others have pushed changes to your branch:

  ```bash
  # Fetch latest changes
  git fetch origin

  # Rebase your branch on top of remote changes
  git pull --rebase origin feature/add-user-auth

  # If conflicts occur, resolve them then:
  git add <conflicted-file>
  git rebase --continue
  ```

  ## 4. Pushing to Remote

  ```bash
  # Push feature branch
  git push origin feature/add-user-auth

  # Force push (use with caution, after rebase)
  git push --force-with-lease origin feature/add-user-auth
  ```

  ## 5. Updating Commits After Review

  Avoid creating multiple "fix review" commits. Instead, amend the original commit:

  ```bash
  # Stage all changes
  git add .

  # Amend the last commit (edit message)
  git commit --amend

  # Amend without changing message
  git commit --amend --no-edit

  # Push the amended commit
  git push origin feature/add-user-auth
  ```

  ## 6. Code Review Best Practices

  ### PR Requirements
  - Clear title describing the change
  - Detailed description explaining context and impact
  - Single logical change per PR
  - At least one reviewer approval
  - All CI checks passed

  ### Review Process
  - Review promptly once approved
  - Use AI tools to assist review (not replace human review)
  - Reference [Google's Code Review Guide](https://google.github.io/eng-practices/review/reviewer/)

  ### Merging
  - Merge immediately after approval, don't wait
  - Prefer squash merge for single-feature commits
  - Delete feature branch after merge

  ## Important Notes

  1. **Never commit directly to main** - always use feature branches
  2. **Always rebase before pushing** to maintain linear history
  3. **Use descriptive commit messages** following Conventional Commits
  4. **Resolve conflicts through rebase**, not merge commits
  5. **Keep PRs small and focused** on single functionality
  6. **Review promptly** and merge quickly after approval
  7. **Leverage AI tools** for commit message generation and code review assistance

examples:
  - name: Create a new feature branch and commit
    description: Start a new feature with proper branch naming and commit
    command: |
      git checkout main && git pull --rebase origin main && git checkout -b feature/user-dashboard && git add . && git cz

  - name: Sync feature branch with remote changes
    description: Rebase feature branch to get latest changes from remote
    command: |
      git fetch origin && git pull --rebase origin feature/user-dashboard

  - name: Update commit after review feedback
    description: Amend the last commit with additional changes
    command: |
      git add . && git commit --amend --no-edit && git push --force-with-lease origin feature/user-dashboard

  - name: Check git status and view history
    description: Review current state and recent commits
    command: |
      git status && git log --oneline -10

constraints:
  - Always use rebase instead of merge to maintain linear history
  - Never work directly on main/master branch
  - Ensure commit messages follow Conventional Commits specification
  - Always fetch and rebase before pushing to remote
  - Force push only with --force-with-lease for safety
  - Keep PRs focused on single functionality
  - Require at least one reviewer approval before merging

tags:
  - git
  - version-control
  - branch-management
  - commit-conventions
  - code-review
  - collaboration
