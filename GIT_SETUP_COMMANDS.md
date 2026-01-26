# Git Setup Commands

Run these commands in your terminal to complete the Git setup:

## 1. Configure your Git identity (REQUIRED - do this first!)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 2. Add all files to staging
```bash
git add .
```

## 3. Create your first commit
```bash
git commit -m "Initial commit: Complete project setup with backend, web, and mobile apps"
```

## 4. Create a repository on GitHub/GitLab/Bitbucket
- Go to GitHub.com (or your preferred Git hosting)
- Click "New Repository"
- Name it (e.g., "ozar-service-platform")
- Don't initialize with README (you already have files)
- Copy the repository URL

## 5. Connect to remote repository
```bash
git remote add origin YOUR_REPOSITORY_URL
git branch -M main
git push -u origin main
```

## Daily Workflow Commands

### Before starting work:
```bash
git pull origin main
```

### After making changes:
```bash
# Check what changed
git status

# Add specific files
git add path/to/file

# Or add all changes
git add .

# Commit with a descriptive message
git commit -m "Description of what you changed"

# Push to remote
git push origin main
```

## Useful Git Commands

### View commit history
```bash
git log --oneline
```

### Create a new branch for a feature
```bash
git checkout -b feature/new-feature-name
```

### Switch between branches
```bash
git checkout main
git checkout feature/new-feature-name
```

### Merge a feature branch into main
```bash
git checkout main
git merge feature/new-feature-name
```

### Undo uncommitted changes
```bash
git checkout -- path/to/file
```

### View differences
```bash
git diff
```

### Stash changes temporarily
```bash
git stash
git stash pop
```

## Best Practices

1. **Commit often** - Small, focused commits are better than large ones
2. **Write clear commit messages** - Describe what and why, not how
3. **Pull before push** - Always pull latest changes before pushing
4. **Use branches** - Create feature branches for new work
5. **Review before commit** - Use `git status` and `git diff` to review changes
6. **Don't commit sensitive data** - .env files are already in .gitignore

## Example Commit Messages

Good:
- "Add email verification to auth system"
- "Fix booking cancellation bug"
- "Update mobile UI for pro dashboard"
- "Refactor location selector component"

Bad:
- "Fixed stuff"
- "Updates"
- "WIP"
- "asdfasdf"
