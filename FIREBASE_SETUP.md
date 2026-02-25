# Firebase Setup Guide for Kisan Mitra AI

## 🚀 Quick Setup (5 Minutes)

This app now uses Firebase for cloud database and Google Sign-In. **It's completely free!**

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `kisan-mitra-ai` (or any name)
4. Click **Continue** through the setup
5. Select your Google account
6. Click **Create project**

### Step 2: Enable Google Sign-In

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Click on **Google** provider
4. Toggle **Enable** 
5. Add your email as project support email
6. Click **Save**

### Step 3: Create Firestore Database

1. Go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select region closest to you
5. Click **Enable** (or **Create database**)

### Step 4: Get Your Firebase Config

1. Go to **Project Settings** (⚙️ icon, top right)
2. Scroll to "Your apps" section
3. Click the **Web app** icon (or `</>`)
4. Copy the `firebaseConfig` object
5. Create/Edit `.env.local` in your project root:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

Replace the values with your actual Firebase config.

### Step 5: Add Your Domain to Firebase

1. Go to **Authentication** → **Settings** (settings tab)
2. Scroll to **Authorized domains**
3. Add these (they're auto-added once you deploy):
   - `localhost` (for local development)
   - `127.0.0.1`
   - `onkar86.github.io` (your GitHub Pages domain)

### Step 6: Run the App

```bash
npm install        # Already done if you followed updates
npm run dev        # Test locally
npm run build      # Build for production
npm run deploy     # Deploy to GitHub Pages
```

## ✅ What's Included

- **Google Sign-In** - One-click login with email auto-fill
- **Cloud Database** - User profiles and diagnosis history saved securely
- **Multi-Device Access** - Login from any device and see your data
- **100% Free** - Firebase free tier covers your needs
- **GDPR Ready** - User data is in their own account

## 📱 How Users Login

1. Click **"Sign in with Google"** button
2. Choose/approve their Google account
3. Their email auto-fills
4. Complete onboarding
5. App saves everything to their cloud database

## 🔒 Security

- `.env.local` is in `.gitignore` - API keys never visible
- Firestore rules restrict data to each user's UID
- Google handles authentication securely
- No passwords stored - uses OAuth

## 📊 Data Structure in Firestore

```
users/
  {uid}/
    - name: "Farmer Name"
    - email: "farmer@gmail.com"
    - address: "Village, State"
    - crops: ["Rice", "Wheat"]
    - language: "hi"
    - aiProvider: "GEMINI"
    - onboarded: true
    - createdAt: "2026-02-25..."
    - updatedAt: "2026-02-25..."
    
    history/  (subcollection)
      {docId}/
        - disease: "Leaf Spot"
        - confidence: 0.92
        - solutions: {...}
        - timestamp: "2026-02-25..."
```

## 🆓 Free Tier Limits

Firebase free tier includes:
- ✅ **Unlimited users**
- ✅ **50K read/day** (more than enough)
- ✅ **20K write/day** (more than enough)
- ✅ **1 GB storage**
- ✅ **20K delete/day**

For a farming app with moderate users, you'll never hit these limits.

## 🚀 Deployment

After setup:

```bash
git add .
git commit -m "Add Firebase configuration"
git push origin main
npm run deploy
```

Your app will be live at: `https://onkar86.github.io/kisan-mitra-ai-0.2/`

## 🆘 Troubleshooting

### "Google Sign-In not working"
- Check `.env.local` has correct Firebase keys
- Verify domain is authorized in Firebase Console
- Check browser console for error messages

### "404 on Firebase files"
- Make sure `.env.local` is in project root
- Restart dev server: `npm run dev`

### "Data not saving"
- Check Firestore is enabled in Firebase Console
- Verify user is logged in
- Check browser Network tab in DevTools

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Sign-In Guide](https://developers.google.com/identity/sign-in)
- [Firestore Guide](https://firebase.google.com/docs/firestore)

---

**That's it! Your app now has cloud database with zero cost!** 🎉
