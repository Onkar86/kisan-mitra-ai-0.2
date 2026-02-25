# Firebase Setup Guide for Kisan Mitra AI

## ✅ Firebase is Already Configured!

Your Firebase project **kisan-mitra-ai-a362f** is already connected to the app. No setup needed!

Just start using it:

```bash
npm run dev        # Test locally
npm run build      # Build for production
npm run deploy     # Deploy to GitHub Pages
```

## 🔐 Security Note

The Firebase credentials are embedded in the code (this is safe for web apps - they're public anyway). The real security comes from:
- Firestore security rules (only authenticated users can access their data)
- Google OAuth prevents unauthorized access
- Each user can only see/edit their own data

## 📱 User Flow

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
