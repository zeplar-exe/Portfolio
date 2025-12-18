# Portfolio Deployment Guide

## Branch Structure

This project uses a two-branch workflow for development and deployment:

- **`in-progress`** (or `dev`/`development`): Development branch for work-in-progress
- **`main`** (or `live`): Production branch that deploys to GitHub Pages

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **GitHub Actions**
4. Save the settings

### 2. Create Your Branches

```bash
# If you're currently on main branch
git branch in-progress
git push -u origin in-progress

# Or if you want to use 'live' for production
git branch live
git checkout live
git push -u origin live
```

### 3. Set Repository Base Path (if needed)

If your repository is **not** at `https://username.github.io`:

#### Option A: Using repository name (e.g., `https://username.github.io/Portfolio`)

Update `vite.config.ts` to set a static base:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/',  // Replace with your repo name
})
```

#### Option B: Keep it flexible with environment variable

The current setup uses `VITE_BASE_PATH`. Update your workflow file (`.github/workflows/deploy.yml`):

```yaml
- name: Build
  run: npm run build
  env:
    VITE_BASE_PATH: /Portfolio/  # Replace with your repo name
```

### 4. Workflow Behavior

#### Deploy Workflow (`deploy.yml`)
- **Triggers on**: Push to `main` or `live` branch
- **Action**: Builds and deploys to GitHub Pages
- **Can be**: Manually triggered from GitHub Actions tab

#### Preview Workflow (`preview.yml`)
- **Triggers on**: 
  - Push to `dev`, `development`, or `in-progress` branches
  - Pull requests to `main` or `live`
- **Action**: Builds the project to verify it compiles
- **Does NOT deploy**: Just validates the build

## Workflow

### Development Process

```bash
# Work on in-progress branch
git checkout in-progress

# Make your changes
# ... edit files ...

# Commit and push
git add .
git commit -m "Add new feature"
git push origin in-progress

# This triggers the preview workflow (build only, no deploy)
```

### Deploying to Production

```bash
# When ready to deploy, merge to main
git checkout main
git merge in-progress
git push origin main

# This triggers the deploy workflow and updates GitHub Pages
```

Or create a pull request from `in-progress` → `main` on GitHub.

## Custom Domain (Optional)

If you have a custom domain:

1. Add a `public/CNAME` file with your domain:
   ```
   yourdomain.com
   ```

2. Configure DNS with your domain provider:
   - Add A records pointing to GitHub's IPs or
   - Add CNAME record pointing to `username.github.io`

3. In GitHub Settings → Pages, add your custom domain

## Troubleshooting

### Build Fails
- Check the Actions tab in your GitHub repository
- Review the error logs in the failed workflow run
- Common issues:
  - Missing dependencies in `package.json`
  - TypeScript errors
  - Asset path issues

### Pages Not Updating
- Ensure the workflow completed successfully
- Check that GitHub Pages source is set to "GitHub Actions"
- Clear browser cache
- Wait a few minutes for DNS propagation

### Assets Not Loading (404s)
- Verify `base` path in `vite.config.ts` matches your repository name
- Check that paths in your code use relative imports
- Ensure public assets are in the `/public` folder

## Manual Deployment

You can also manually trigger deployment:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy to GitHub Pages** workflow
4. Click **Run workflow**
5. Choose the branch (usually `main` or `live`)
6. Click **Run workflow** button

## Local Testing with Production Build

Test your production build locally before deploying:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

This will start a local server serving the built files from `dist/` folder.
