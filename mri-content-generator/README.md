# MRI Safety Matters — Content Generator

A web app that generates LinkedIn posts and Rad Magazine articles for MRI Safety Matters, trained on their existing content style and tone.

## How It Works

- **Frontend**: React app (Vite) — the interface Vin uses
- **Backend**: One Vercel serverless function (`/api/generate`) — holds the API key securely
- **AI**: Calls Anthropic's Claude API to generate content

The API key never leaves the server. Vin never sees it or needs it.

---

## Deployment Steps (15 minutes)

### 1. Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account (or sign in)
3. Add a payment method (pay-as-you-go, ~£1/month for this usage)
4. Go to **Settings → API Keys → Create Key**
5. Copy the key (starts with `sk-ant-...`)

### 2. Push to GitHub

1. Create a new GitHub repository (e.g. `mri-content-generator`)
2. Push this entire folder to it:

```bash
cd mri-content-generator
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mri-content-generator.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New → Project"**
3. Import your `mri-content-generator` repo
4. Before clicking Deploy, go to **Environment Variables** and add:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: paste your API key from step 1
5. Click **Deploy**
6. Wait ~60 seconds. Vercel gives you a URL like `mri-content-generator.vercel.app`

### 4. Send the Link to Vin

That's it. She opens the URL in her browser and starts using it. No login, no install, works on phone and desktop.

---

## Making Changes Later

### To update prompts or UI:
1. Edit the files locally
2. Push to GitHub: `git add . && git commit -m "update" && git push`
3. Vercel auto-deploys in ~30 seconds

### To change the AI model or API key:
- Go to Vercel dashboard → Project → Settings → Environment Variables

---

## Project Structure

```
mri-content-generator/
├── api/
│   └── generate.js          ← Serverless function (holds API key)
├── src/
│   ├── App.jsx               ← Main app UI and logic
│   └── main.jsx              ← React entry point
├── index.html                ← HTML shell
├── package.json
├── vite.config.js
├── vercel.json               ← Vercel config
└── .env.example              ← Reference for env vars
```

## Cost Summary

| Item | Cost |
|------|------|
| Vercel hosting (free tier) | £0 |
| Anthropic API (~30 generations/month) | ~£0.50–£1 |
| Domain name (optional) | £8–12/year |
| **Total** | **~£1/month** |
