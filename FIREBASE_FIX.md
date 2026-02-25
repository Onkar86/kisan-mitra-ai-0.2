# 🔧 Firebase Error: "auth/configuration-not-found" - SOLUTION

## ❌ Problem
You see this error when trying to sign in:
```
Firebase: Error (auth/configuration-not-found).
```

## ✅ Solution - Follow These Steps

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: **kisan-mitra-ai-a362f**
3. Click **Authentication** (left sidebar)

### Step 2: Enable Google Sign-In Provider
1. In Authentication, go to the **Sign-in method** tab
2. Look for **Google** provider
3. Click on **Google**
4. Click **Enable** toggle (make it blue)
5. Select an **Project support email** (your email)
6. Click **Save**

✅ You should see "Google" listed with status "Approved"

### Step 3: Add Authorized Domains
1. In Authentication, go to **Settings** tab
2. Scroll down to **Authorized domains**
3. Click **Add domain**
4. Add these three domains:
   - `localhost`
   - `127.0.0.1`
   - `onkar86.github.io`
5. Click **Add** for each one

### Step 4: Create Firestore Database
1. Go to **Firestore Database** (left sidebar)
2. Click **Create Database**
3. Choose **Start in test mode** (easier for development)
4. Select region: **us-central1** (or nearest to you)
5. Click **Enable**

✅ You should see "Firestore Database has been created"

### Step 5: Set Firestore Security Rules (Important!)
1. In Firestore, go to **Rules** tab
2. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write, create: if request.auth.uid == userId;
      
      // Subcollection - user history
      match /history/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **Publish**

✅ Rules are now secure

### Step 6: Test Locally
```bash
cd "e:\kisan-mitra-ai---smart-farmer-assistant (2)"
npm run dev
```

Open: `http://localhost:5173/kisan-mitra-ai-0.2/`
Click "Sign in with Google" button

### Step 7: Deploy to GitHub Pages
Once working locally:
```bash
npm run build
npm run deploy
```

Your live site: `https://onkar86.github.io/kisan-mitra-ai-0.2/`

---

## 🆘 Still Getting Error?

### Error: "auth/configuration-not-found"
**Fix:** Ensure Google provider is **Enabled** (blue toggle) in Authentication → Sign-in method

### Error: "auth/unauthorized-domain"
**Fix:** Add `onkar86.github.io` to Authorized domains in Authentication → Settings

### Error: "auth/operation-not-supported-in-this-environment"
**Fix:** 
- Clear browser cache: Press `Ctrl+Shift+Delete`
- Try a different browser (Chrome, Firefox, Safari)
- Ensure pop-ups are allowed for this site

### Error: "Firestore doesn't exist"
**Fix:** Create Firestore Database in Firebase Console

---

## ✅ Checklist

- [ ] Google Sign-In Provider **Enabled** in Firebase
- [ ] Authorized domains added (**localhost**, **127.0.0.1**, **onkar86.github.io**)
- [ ] Firestore Database **Created** (test mode is fine)
- [ ] Firestore Security Rules **Published**
- [ ] Tested on localhost (`npm run dev`)
- [ ] Tested on GitHub Pages (after `npm run deploy`)

---

## 📱 Expected Behavior After Setup

1. User visits app
2. Sees **"Sign in with Google"** button
3. Clicks button → Google login popup appears
4. User selects/approves their Google account
5. Email auto-fills from Google
6. User is signed in ✓
7. Data saved to Firestore
8. User sees Dashboard

---

## 🔐 Trust & Security
- Your Firebase project is **secure** because:
  - Only authenticated users can sign in
  - Google handles the authentication securely
  - Firestore rules ensure users see only their own data
  - API keys are public (this is normal for web apps)

---

## 📞 Need More Help?
- Firebase Docs: https://firebase.google.com/docs/auth
- Google Sign-In: https://developers.google.com/identity/sign-in/web
- Firestore: https://firebase.google.com/docs/firestore

**Once you complete these steps, the error will disappear and your app will work perfectly!** 🎉
