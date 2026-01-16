# EaseGit Deployment Checklist

## Pre-Publishing Checklist

### 1. Package Configuration
- [ ] Update `package.json` name (check npm availability)
- [ ] Set correct `author` field
- [ ] Add `repository` URL
- [ ] Verify `version` number
- [ ] Check `license` is correct
- [ ] Ensure `keywords` are relevant

### 2. Code Quality
- [ ] Run `npm run build` successfully
- [ ] No TypeScript errors
- [ ] All files compile to `dist/`
- [ ] Hooks exist in `hooks/` directory

### 3. Testing
- [ ] Test `easegit init` in a Git repo
- [ ] Verify hooks are installed in `.git/hooks/`
- [ ] Test checkpoint creation (run git rebase/merge/checkout)
- [ ] Verify `easegit status` shows checkpoint
- [ ] Test `easegit undo` restores files
- [ ] Verify untracked files are restored
- [ ] Verify staged changes are restored

### 4. Documentation
- [ ] README.md is clear and complete
- [ ] QUICKSTART.md has working examples
- [ ] EXAMPLE.md shows real scenarios
- [ ] All code examples use correct commands

### 5. Package Contents
Verify these are included (check `package.json` "files" field):
- [ ] `dist/` directory (compiled code)
- [ ] `bin/` directory (CLI entry)
- [ ] `hooks/` directory (hook templates)
- [ ] `README.md`
- [ ] `LICENSE` file (create if missing)

## Publishing Steps

### 1. Clean Build
```bash
# Remove old build
rm -rf dist/

# Fresh build
npm run build

# Verify output
ls dist/
```

### 2. Test Package Locally
```bash
# Create a tarball
npm pack

# This creates easegit-1.0.0.tgz

# Install it in a test project
cd /path/to/test-repo
npm install /path/to/easegit-1.0.0.tgz
easegit init
```

### 3. Publish to npm
```bash
# Login to npm (first time only)
npm login

# Publish (make sure you're in the project root)
npm publish

# For scoped packages (optional)
npm publish --access public
```

### 4. Verify Published Package
```bash
# Install from npm
npm install -g easegit

# Test commands
cd /path/to/git/repo
easegit init
easegit status
```

## Post-Publishing

### 1. Create Git Repository
```bash
git init
git add .
git commit -m "Initial release"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Tag Release
```bash
git tag v1.0.0
git push --tags
```

### 3. Update Documentation
- [ ] Add npm badge to README
- [ ] Add installation instructions
- [ ] Link to GitHub repository

## Maintenance Checklist

### For Each Update
1. [ ] Update version in `package.json`
2. [ ] Run `npm run build`
3. [ ] Test all commands
4. [ ] Update CHANGELOG (if you create one)
5. [ ] Commit changes
6. [ ] Create git tag
7. [ ] Run `npm publish`
8. [ ] Push to GitHub

## Common Issues

### "package name already taken"
→ Change `name` in package.json (try: `easegit-cli`, `git-easeback`, etc.)

### Hooks not working after install
→ Verify `hooks/` directory is included in published package
→ Check `package.json` "files" field

### Command not found after global install
→ Verify `bin` field in package.json
→ Check bin/easegit has correct shebang: `#!/usr/bin/env node`

### TypeScript errors during build
→ Run `npm install` to ensure dev dependencies are installed
→ Check `tsconfig.json` is correct

## Final Verification

Before publishing, run this test sequence:

```bash
# 1. Build
npm run build

# 2. Create test repo
mkdir test-repo && cd test-repo
git init
git config user.email "test@test.com"
git config user.name "Test"

# 3. Initialize EaseGit
node /path/to/easegit-CLI/bin/easegit init

# 4. Create checkpoint scenario
echo "test" > file.txt
git add file.txt
git commit -m "test"
echo "changes" > file.txt

# 5. Trigger checkpoint
git checkout HEAD -- file.txt

# 6. Verify checkpoint
node /path/to/easegit-CLI/bin/easegit status

# 7. Undo
node /path/to/easegit-CLI/bin/easegit undo

# 8. Verify restoration
cat file.txt  # Should show "changes"
```

If all steps pass → **READY TO PUBLISH** ✅

## Support & Issues

After publishing:
- [ ] Set up GitHub Issues
- [ ] Add CONTRIBUTING.md (optional)
- [ ] Create issue templates (optional)
- [ ] Monitor npm downloads

## Success Metrics

Track these after publishing:
- npm downloads per week
- GitHub stars
- Issues reported
- User feedback

---

**Remember: Ship it first. Perfect it later.** 🚀
