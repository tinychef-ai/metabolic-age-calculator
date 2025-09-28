# Quick Deployment Guide

## Option 1: Netlify (Recommended)

1. **Push to GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/metabolic-age-calculator.git
git branch -M main
git push -u origin main
```

2. **Deploy on Netlify:**
   - Go to netlify.com
   - Click "New site from Git"
   - Connect GitHub
   - Select repository
   - Deploy!

## Option 2: Vercel (Fastest)

```bash
npm i -g vercel
vercel
```

## Option 3: GitHub Pages

```bash
npm install --save-dev gh-pages
# Add to package.json:
# "homepage": "https://YOUR_USERNAME.github.io/metabolic-age-calculator"
# "scripts": { "predeploy": "npm run build", "deploy": "gh-pages -d build" }
npm run deploy
```

## Your PWA will be live and installable! 🎉
