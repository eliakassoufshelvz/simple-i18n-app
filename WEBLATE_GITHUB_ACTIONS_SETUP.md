# Weblate GitHub Actions Setup Guide

## What Was Wrong

The original workflow used `peter-evans/create-pull-request@v6` action, which is designed for creating PRs from **changes made within the workflow itself** (like automated formatting, dependency updates, etc.), not for creating a PR from an existing branch that was pushed externally.

When Weblate pushes to the `weblate` branch, that push triggers the workflow, but the action couldn't create a PR properly because it wasn't designed for this use case.

## The Fix

The new workflow uses GitHub CLI (`gh`) to:
1. Check if a PR from `weblate` to `master` already exists
2. If no PR exists, create one with proper labels and assignees
3. If a PR already exists, simply acknowledge it (GitHub automatically updates existing PRs when new commits are pushed to the source branch)

## How It Works

1. **Weblate pushes translations** to the `weblate` branch
2. **GitHub Actions workflow triggers** on push to `weblate` branch
3. **Workflow checks** if a PR already exists
4. **If no PR exists**: Creates a new PR from `weblate` → `master`
5. **If PR exists**: Acknowledges it (PR auto-updates with new commits)

## Requirements

### Permissions
The workflow requires these permissions (already configured):
- `contents: read` - To checkout the repository
- `pull-requests: write` - To create and manage PRs

### GitHub Token
The workflow uses `${{ secrets.GITHUB_TOKEN }}` which is automatically provided by GitHub Actions. No additional secrets needed!

## Self-Hosted Runner - NOT NEEDED

The Docker runner you set up is **not necessary** for this workflow. GitHub's `ubuntu-latest` runners work perfectly fine for this use case.

If you want to remove the self-hosted runner:
```bash
docker stop github-runner
docker rm github-runner
```

## Testing the Workflow

### Option 1: Wait for Weblate
Wait for Weblate to push new translations to the `weblate` branch, and the workflow will automatically run.

### Option 2: Manual Test
```bash
# Switch to weblate branch
git checkout weblate

# Make a small change to test
echo "test" >> test.txt
git add test.txt
git commit -m "test: trigger workflow"
git push origin weblate

# The workflow should run and create a PR
```

## Verifying It Works

1. Go to your repository on GitHub
2. Navigate to **Actions** tab
3. Look for "Weblate Translation PR" workflow runs
4. Check the workflow run details - it should show success ✅
5. Navigate to **Pull Requests** tab
6. You should see a PR titled "🌐 Translation updates from Weblate"

## Troubleshooting

### Workflow fails with "Resource not accessible by integration"
- Make sure the workflow has proper permissions
- The permissions block should include `pull-requests: write`

### PR is not created
- Check the workflow logs in the Actions tab
- Verify that commits were pushed to the `weblate` branch
- Ensure the workflow file is on the `weblate` branch

### Multiple PRs being created
- The workflow checks for existing PRs and won't create duplicates
- If you see duplicates, close the older ones manually

## Workflow File Location

The workflow file is located at:
```
.github/workflows/weblate-pr.yml
```

## Next Steps

1. Commit and push the updated workflow file:
   ```bash
   cd /mnt/c/DevelopmentSpace/Shelvz/simple-i18n-app
   git add .github/workflows/weblate-pr.yml
   git commit -m "fix: update Weblate PR workflow to use GitHub CLI"
   git push origin master
   ```

2. Copy the workflow to the `weblate` branch:
   ```bash
   git checkout weblate
   git cherry-pick master  # or merge master into weblate
   git push origin weblate
   ```

3. Test by having Weblate push a translation update, or make a test commit to the `weblate` branch

## Weblate Configuration

Make sure your Weblate project is configured to push to the `weblate` branch:

1. In Weblate, go to your project settings
2. Under **Version Control**, set:
   - **Push URL**: Your repository URL
   - **Push branch**: `weblate`
3. Enable **Push on commit**
4. Configure authentication (SSH key or token)

## Alternative: Direct Push to Master (Not Recommended)

If you want Weblate to push directly to `master` without PRs, you can:
- Configure Weblate to push to `master` branch directly
- Remove the GitHub Actions workflow

However, using PRs is recommended because it allows you to:
- Review translations before merging
- Run tests/checks on translations
- Keep a clean commit history
- Easily revert problematic translations
