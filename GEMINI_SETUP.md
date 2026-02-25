# 🅰️ Gemini API Setup Guide for Kisan Mitra

> **FREE & EASY!** Get your free Gemini API key in 2 minutes. No credit card needed.

## Why Gemini API?

Gemini API powers our AI Farm Companion to provide:
- ✅ **Multilingual responses** (Hindi, Marathi, English, and 9+ languages)
- ✅ **Chemical & Organic solutions** for each farming problem
- ✅ **Context-aware advice** based on your farm profile
- ✅ **100% FREE** for development and testing

---

## Step 1: Create Your Free Gemini API Key

### Option A: Google AI Studio (Easiest)

1. Go to: https://aistudio.google.com/
2. Click **"Get API Key"** button (top-right)
3. Click **"Create API Key in new project"**
4. A popup will show your API key → **Copy it**
5. Done! ✅

### Option B: Google Cloud Console

1. Go to: https://console.cloud.google.com/
2. Create a new project (if you don't have one)
3. Search for **"Generative AI API"**
4. Click **"Enable"** button
5. Go to **APIs & Services** → **Credentials**
6. Click **"Create Credentials"** → **API Key**
7. Copy your API key → **Done!** ✅

---

## Step 2: Add API Key to Your Project

### For Development (Local Machine)

1. Open `.env` in the project root (create if not exists)
2. Add this line:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here_paste_it
   ```
3. Save the file
4. **DO NOT** commit `.env` to GitHub (it's in `.gitignore`)
5. Restart your dev server: `npm run dev`

### For GitHub Pages (Production)

Since `.env` files are not sent to GitHub Pages:

**Option 1: Using Environment Secrets (Recommended)**
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `VITE_GEMINI_API_KEY`
4. Value: paste your Gemini API key
5. Click **"Add secret"**
6. Update GitHub Actions workflow to use the secret

**Option 2: Store Key in Browser (Development Only)**
1. Users can paste their key in the browser console
2. API key stored in browser memory for that session
3. Good for demo/testing

**Option 3: Backend Proxy (Secure)**
1. Create a backend service to proxy Gemini API calls
2. Your backend holds the secret API key
3. Frontend calls your backend instead
4. Prevents exposing API key publicly

---

## Step 3: Verify It Works

1. Start the app: `npm run dev`
2. Go to **Dashboard** → **AI FARM COMPANION** button
3. Ask a farming question like:
   - "What's wrong with my wheat crops if leaves are turning yellow?"
   - "मेरे आलू के पौधों में क्या बीमारी है?"
   - "माझ्या भाजीच्या पिकात काय समस्या आहे?"
4. You should get a response in seconds! ✅

---

## Troubleshooting

### ❌ "Fetching error" or "No response"
**Problem:** API key not found or invalid
- Check `.env` file has the correct key
- Make sure no spaces before/after the key
- Restart dev server: `npm run dev`
- Try pasting the key again

### ❌ "auth/configuration-not-found"
**Problem:** Firebase auth issue (not Gemini)
- See [FIREBASE_FIX.md](./FIREBASE_FIX.md) for Firebase setup

### ❌ "Your API key is not valid"
**Problem:** Wrong or expired key
1. Go to https://aistudio.google.com/
2. Click your API key to check its status
3. If it shows "Restricted", enable the Generative AI API
4. Delete the old key and create a new one

### ❌ "quota exceeded" or "rate limited"
**Problem:** Too many requests
- Free tier has limits (~60 requests per minute)
- Wait a few minutes and try again
- For production, upgrade to a paid plan

---

## Free Tier Limits

Google's free Gemini API allows:
- ✅ **60 requests/minute** (plenty for a small farm assistant)
- ✅ **Unlimited requests/month** (no monthly cap)
- ✅ **No payment method required**
- ✅ **0 cost forever** for reasonable usage

---

## Security Best Practices

⚠️ **IMPORTANT:**

1. ✅ **Never commit `.env` to GitHub**
   - `.env` is in `.gitignore` ✓

2. ✅ **Rotate your API key regularly**
   - Delete old keys, create new ones
   - Available at: https://aistudio.google.com/

3. ✅ **For production, use backend proxy**
   - Don't expose API key in frontend code
   - See "Option 3: Backend Proxy" above

4. ✅ **Monitor your API usage**
   - Check at: https://console.cloud.google.com/

---

## What Happens With Your Data?

- 📤 Your farming questions are sent to Google's Gemini API
- 🔒 Google processes them per their [privacy policy](https://policies.google.com/privacy)
- 💾 Chat history is saved **locally** in Firebase (only you can access)
- 🚫 We never store or use your data for training

---

## Questions?

- 📖 Gemini API Docs: https://ai.google.dev/
- 🆘 Support: https://support.google.com/a
- 🐛 Bug Report: https://github.com/Onkar86/kisan-mitra-ai-0.2/issues

---

**That's it!** 🎉 Your AI Farm Companion is now ready to help farmers across India with multilingual, context-aware farming advice.

Happy farming! 🌾💚
