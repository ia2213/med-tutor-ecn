# GitHub Token Configuration Issue

The token you provided works for reading your profile but doesn't have permission to:
- Create new repositories
- Push code to new repositories

## Solution: Update your GitHub Token

Go to: **https://github.com/settings/tokens**

1. Find your token named "hermes-agent" (or similar)
2. Click "Edit"
3. Make sure these permissions are checked:
   - ✅ **Contents: Read and write** (or "repo" for classic tokens)
   - ✅ **Metadata: Read**
   - ✅ **Create repository** (if available)

4. Click "Update token"

## Alternative: Use the GitHub CLI

If you prefer, you can install `gh` CLI and authenticate interactively:
https://github.com/cli/cli#installation

```bash
gh auth login
# Follow the prompts to authenticate
```

Then I can use `gh` commands instead of the token directly.
