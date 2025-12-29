# 🔒 How to Analyze Private Repositories

## Issue: "Not Found" Error

If you get `Not Found` error for a repository, it's likely **private** or doesn't exist.

---

## ✅ Solution 1: Make Repository Public (Easiest)

If you want to analyze your own repository:

1. Go to your repository: `https://github.com/Sanjay-Balam/Real-Chess`
2. Click **Settings** (top right)
3. Scroll to **Danger Zone** (bottom)
4. Click **Change visibility** → **Make public**
5. Confirm the change
6. Run the Actor again!

**Note**: Only make public if you're comfortable sharing your code!

---

## ✅ Solution 2: Use GitHub Token (For Private Repos)

To analyze private repositories, you need a **GitHub Personal Access Token**.

### Step 1: Create a GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `"Apify Actor"`
4. Select these scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:user` (Read user profile data)
5. Click **"Generate token"**
6. **Copy the token** (starts with `ghp_...`)
   - ⚠️ **Save it somewhere safe!** You won't see it again.

### Step 2: Create Test Input with Token

Create a new file: `.actor/INPUT/test-private.json`

```json
{
  "repositoryUrls": [
    "https://github.com/Sanjay-Balam/Real-Chess"
  ],
  "githubToken": "ghp_YOUR_TOKEN_HERE",
  "includeCodeQuality": true,
  "includeContributorInsights": true,
  "includeActivityTrends": true,
  "analyzeDays": 90
}
```

### Step 3: Run with Token

```bash
cd /Users/balamsanjay/Desktop/Apify-Actors/github-insights-generator
apify run --input-file .actor/INPUT/test-private.json
```

---

## ✅ Solution 3: Verify Repository URL

Make sure the URL is correct:

### Check if repository exists:

Visit in your browser:
```
https://github.com/Sanjay-Balam/Real-Chess
```

### Common URL formats (all work):
- ✅ `https://github.com/Sanjay-Balam/Real-Chess`
- ✅ `https://github.com/Sanjay-Balam/Real-Chess.git`
- ✅ `github.com/Sanjay-Balam/Real-Chess`
- ✅ `git@github.com:Sanjay-Balam/Real-Chess.git`

---

## 🎯 Quick Test Command

Once you have your token or made repo public:

```bash
cd github-insights-generator

# With token
echo '{
  "repositoryUrls": ["https://github.com/Sanjay-Balam/Real-Chess"],
  "githubToken": "ghp_YOUR_TOKEN_HERE",
  "analyzeDays": 90
}' > .actor/INPUT/test-private.json

apify run --input-file .actor/INPUT/test-private.json
```

---

## 💡 Benefits of Using a Token

### Without Token:
- ❌ Can't access private repos
- ❌ Only 60 requests/hour
- ❌ Lower rate limits

### With Token:
- ✅ Access private repos
- ✅ 5,000 requests/hour
- ✅ Can analyze more repositories

---

## 🔍 Troubleshooting

### Still getting "Not Found"?

1. **Verify repository exists**:
   ```bash
   # Check if you can view it in browser
   open https://github.com/Sanjay-Balam/Real-Chess
   ```

2. **Check repository name**:
   - Is it `Real-Chess` or `real-chess`? (case matters!)
   - Any typos in username or repo name?

3. **Verify token permissions**:
   - Token must have `repo` scope
   - Token must not be expired

4. **Test with a known public repo**:
   ```bash
   apify run --input-file .actor/INPUT/test-basic.json
   ```
   If this works, the issue is with your specific repo URL/access.

---

## 📊 Example: Analyzing Your Profile

To see ALL your public repositories:

```bash
# Visit
https://github.com/Sanjay-Balam?tab=repositories

# Pick any public repo and test:
{
  "repositoryUrls": [
    "https://github.com/Sanjay-Balam/YOUR_PUBLIC_REPO"
  ],
  "analyzeDays": 90
}
```

---

## 🎯 What We Know Works

✅ **Confirmed working** (from our tests):
- `https://github.com/apify/crawlee` → Health Score: 58/100
- `https://github.com/facebook/react` → Health Score: 68/100

Your Actor is working perfectly! The issue is just repository access.

---

## 🚀 Next Steps

1. **Choose one option**:
   - Make Real-Chess public, OR
   - Get a GitHub token

2. **Test again**:
   ```bash
   apify run --input-file .actor/INPUT/test-real-chess.json
   ```

3. **Verify results**:
   ```bash
   cat storage/datasets/default/*.json | python3 -m json.tool
   ```

---

## 🔐 Security Note

**Never commit your GitHub token to git!**

- ✅ Store in `.env` file (already in `.gitignore`)
- ✅ Use Apify secrets when deployed
- ❌ Don't paste in code or commit files

---

Need help? Let me know and I can:
- Help you create a token
- Test with different repositories
- Check if a repo is public/private

