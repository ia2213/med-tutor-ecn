# Deployment Guide

## GitHub Pages (Static)

1. Create a new GitHub repository
2. Push the code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/med-tutor-ecn.git
   git push -u origin main
   ```
3. Enable GitHub Pages:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / out/ folder
4. The site will be available at: `https://YOUR_USERNAME.github.io/med-tutor-ecn/`

## Vercel (With API Routes)

1. Push to GitHub first (see above)
2. Connect to Vercel:
   ```bash
   vercel --prod
   ```
3. Or connect your GitHub repo at https://vercel.com and deploy
4. Add environment variables in Vercel:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `OPENAI_BASE_URL` - (optional) Custom endpoint
   - `MODEL` - (optional) Model name (default: gpt-4o-mini)

## Environment Variables

Create `.env.local`:
```bash
OPENAI_API_KEY=your-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
MODEL=gpt-4o-mini
```

For Groq (cheaper):
```bash
OPENAI_BASE_URL=https://api.groq.com/openai/v1
MODEL=llama-3.3-70b-versatile
```
