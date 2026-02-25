# 🌾 Kisan Mitra - AI Farm Companion for Rural India

> **Smart Farming Made Simple** | Multilingual AI | Free to Use | Works Offline

![Status](https://img.shields.io/badge/status-production-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Languages](https://img.shields.io/badge/languages-11-orange)

---

## 🚀 What's New: AI Farm Companion V2

This is a **complete upgrade** to help rural Indian farmers with intelligent, multilingual farming advice.

### ✨ New Features

#### 1. 💬 AI Farm Companion Chat
- **Real-time AI responses** using Google Gemini API (free tier)
- **Multilingual support**: Hindi, Marathi, Punjabi, Gujarati, Tamil, Telugu, Kannada, Bengali, Malayalam, Odia, English
- **Context-aware advice** - AI considers your:
  - Crop types
  - Farm size
  - Soil type
  - Current farming practices
  - Location (district/state)
- **Chemical + Organic solutions** for every problem
- **Chat history** - all conversations saved to your Firebase account

#### 2. 🎤 Voice Input (Free)
- **Web Speech API** - completely free, browser-native
- Works in Chrome, Edge, Safari, Firefox
- **11 languages** supported for voice recognition
- Click **🎤 Voice Input** to speak your question
- No recording, no server storage, all in-device processing

#### 3. 🚨 Emergency Crop Help
- **Fast-track mode** for urgent farming issues
- Describe symptoms → Get immediate solutions
- **Severity levels**: Moderate, Urgent, Critical
- **Instant action steps** you can take right now
- Recommendations to contact local agricultural officers for serious issues

#### 4. 🌿 Farming Mode Toggle
Choose your farming approach:
- **🌿 Organic Only** - 100% natural solutions
- **⚗️ Chemical** - Fast-acting commercial products
- **🔄 Both Methods** - Combination of organic and chemical

AI adapts its advice based on your preference!

#### 5. 👨‍🌾 Enhanced Farmer Profile
New profile fields:
- 🪴 **Soil Type** (Black, Red, Sandy, Loamy, Clay, Mixed)
- 🏘️ **District & State** (for location-specific advice)
- 🌾 **Farming Mode** (Organic/Chemical/Both)
- 🧪 **Current Fertilizers** (what you're already using)

---

## 🎯 How to Use

### Getting Started
1. **Install & Run**
   ```bash
   git clone https://github.com/Onkar86/kisan-mitra-ai-0.2.git
   cd kisan-mitra-ai-0.2
   npm install
   npm run dev
   ```

2. **Setup API Key** (takes 2 minutes)
   - See [GEMINI_SETUP.md](./GEMINI_SETUP.md)
   - Free API key from https://aistudio.google.com/

3. **Login & Onboard**
   - Sign in with Google
   - Set up your farm profile
   - Choose preferred language

### Using AI Farm Companion

#### Option 1: Text Chat
```
Dashboard → 💬 AI FARM COMPANION
↓
Select Language (Hindi/Marathi/etc)
↓
Type your question
↓
Get response with Chemical + Organic solutions
↓
Chat saved to your account
```

#### Option 2: Voice Chat
```
AI FARM COMPANION Chat
↓
Click 🎤 Voice Input button
↓
Speak your question in your language
↓
Get instant AI response
↓
Ask follow-up questions
```

#### Option 3: Emergency Mode
```
Dashboard → AI FARM COMPANION
↓
Click 🚨 Emergency Help button
↓
Select crop and severity
↓
Describe problem in detail
↓
Get IMMEDIATE action steps
```

---

## 📱 Technical Stack

```
Frontend:
├── React 19.2.4  (UI framework)
├── TypeScript 5.8.2  (type safety)
├── Tailwind CSS 4.2.0  (beautiful UI)
└── Vite 6.4.1  (fast builds)

Backend:
├── Firebase Auth  (Google Sign-In)
├── Firestore  (chat history)
└── Google Gemini API  (AI responses)

Voice:
└── Web Speech API  (free, browser-native)

Deployment:
└── GitHub Pages  (free hosting)
```

---

## 🌍 Supported Languages

| Language | Code | Status |
|----------|------|--------|
| 🇮🇳 Hindi | `hi` | ✅ Full Support |
| 🇮🇳 Marathi | `mr` | ✅ Full Support |
| 🇮🇳 Punjabi | `pa` | ✅ Full Support |
| 🇮🇳 Gujarati | `gu` | ✅ Full Support |
| 🇮🇳 Tamil | `ta` | ✅ Full Support |
| 🇮🇳 Telugu | `te` | ✅ Full Support |
| 🇮🇳 Kannada | `kn` | ✅ Full Support |
| 🇮🇳 Bengali | `bn` | ✅ Full Support |
| 🇮🇳 Malayalam | `ml` | ✅ Full Support |
| 🇮🇳 Odia | `or` | ✅ Full Support |
| 🌐 English | `en` | ✅ Full Support |

---

## 💰 Pricing

| Feature | Cost | Notes |
|---------|------|-------|
| **AI Chat** | 🟢 FREE | 60 reqs/min (plenty!) |
| **Voice Input** | 🟢 FREE | Browser-native Web Speech API |
| **Emergency Help** | 🟢 FREE | Unlimited emergency requests |
| **Chat History** | 🟢 FREE | Unlimited storage in Firebase |
| **Farming Profile** | 🟢 FREE | Unlimited profiles |
| **Gemini API** | 🟢 FREE | Free for development |

**Total Cost: ₹0 forever!** 🎉

---

## 🔒 Privacy & Safety

✅ **Your data is yours**
- Chat history stored in YOUR Firebase account only
- Only you can see your conversations
- No tracking, no ads, no selling data

✅ **Safety first**
- All solutions include safety warnings
- Age-appropriate pesticide precautions
- Recommendations to consult local agricultural officers

✅ **Transparency**
- Open source code - audit anything
- No hidden tracking
- Privacy policy: [See Firebase Privacy](https://policies.google.com/privacy)

---

## 📚 Features Breakdown

### 1. AI Chat Service
**File:** `src/services/aiChatService.ts`

```typescript
// Automatic language detection
detectLanguage('मेरी फसल में कीड़े हैं') // → 'hi'

// Context-aware prompt generation
buildSystemPrompt('hi', farmerProfile)
// Includes: farm size, crops, soil, location, fertilizers

// Gemini API integration
generateAIResponse(question, userProfile, farmingMode)
// Returns: Chemical + Organic solutions
```

### 2. Firestore Chat Storage
**File:** `src/services/firebaseService.ts`

```typescript
// Save chat to database
saveChatMessage(userId, {
  role: 'user',
  content: question,
  language: 'mr',
  farmingMode: 'ORGANIC_ONLY'
})

// Retrieve chat history
getChatHistory(userId, limit: 50)
// Returns: Ordered conversation history
```

### 3. Voice Input Component
**File:** `src/components/VoiceInput.tsx`

```typescript
// Web Speech API wrapper
<VoiceInput 
  language="hi"
  onTranscript={(text) => sendMessage(text)}
/>

// Supports all 11 languages
// Auto-detects India region variations
// No server-side processing needed
```

### 4. Farm AI Chat Component
**File:** `src/components/FarmAIChat.tsx`

```
Features:
├── Multi-language selector
├── Farming mode toggle
├── Emergency help button
├── Voice input integration
├── Chat message display
├── Loading states
├── Error handling
└── Firestore persistence
```

### 5. Emergency Help Component
**File:** `src/components/EmergencyCropHelp.tsx`

```
Features:
├── Quick problem input
├── Severity selector
├── Crop chooser
├── Emergency-specific prompts
├── Instant AI response
└── Next steps guide
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Google account (for Firebase & Gemini API)
- Modern browser (Chrome, Edge, Safari, or Firefox)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Onkar86/kisan-mitra-ai-0.2.git
cd kisan-mitra-ai-0.2

# 2. Install dependencies
npm install

# 3. Get Gemini API key
# See GEMINI_SETUP.md (takes 2 minutes, free!)

# 4. Create .env file
cat > .env << 'EOF'
VITE_GEMINI_API_KEY=your_api_key_here
EOF

# 5. Start development server
npm run dev

# 6. Open in browser
# http://localhost:5173/kisan-mitra-ai-0.2/
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📖 File Structure

```
src/
├── components/
│   ├── FarmAIChat.tsx          (💬 New! AI chat interface)
│   ├── VoiceInput.tsx          (🎤 New! Voice input)
│   ├── EmergencyCropHelp.tsx   (🚨 New! Emergency mode)
│   ├── Dashboard.tsx            (👤 Updated with AI chat button)
│   ├── Profile.tsx
│   ├── History.tsx
│   └── ... (other components)
│
├── services/
│   ├── aiChatService.ts         (🤖 New! AI response generation)
│   ├── firebaseService.ts       (Updated with chat functions)
│   ├── aiService.ts
│   └── ... (other services)
│
├── types.ts                      (Updated with new interfaces)
├── App.tsx                       (Updated with new routing)
└── vite-env.d.ts               (New! Environment type definitions)

docs/
├── GEMINI_SETUP.md             (🆕 API key setup guide)
├── FIREBASE_SETUP.md           (Firebase configuration)
├── FIREBASE_FIX.md             (Firebase troubleshooting)
└── AI_FARM_COMPANION.md        (This file)
```

---

## 🧪 Testing

```bash
# Run build verification (no errors)
npm run build

# Check TypeScript types
tsc --noEmit

# Test locally
npm run dev
# Then visit http://localhost:5173/kisan-mitra-ai-0.2/
```

---

## 🤝 Contributing

Want to improve Kisan Mitra? We'd love your help!

```bash
# 1. Fork the repository
# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes & test locally
npm run dev

# 4. Build to verify
npm run build

# 5. Commit with clear message
git commit -m "feat: Add your feature description"

# 6. Push & create Pull Request
git push origin feature/your-feature-name
```

---

## 📝 License

MIT License - Free to use for any purpose!

---

## 🙏 Acknowledgments

- **Farmers of India** 🇮🇳 - The inspiration for this project
- **Google Gemini API** - Free AI for agriculture
- **Firebase** - Free backend infrastructure
- **GitHub Pages** - Free hosting

---

## 🐛 Troubleshooting

### Chat not responding?
→ Check [GEMINI_SETUP.md](./GEMINI_SETUP.md)

### Firebase error?
→ See [FIREBASE_FIX.md](./FIREBASE_FIX.md)

### Voice input not working?
→ Check browser permissions for microphone
→ Supported: Chrome, Edge, Safari (iOS 14.5+)

### Chat history not saving?
→ Check browser's localStorage is enabled
→ Verify Firebase Firestore has write permissions

---

## 📞 Support

- 📚 [Full Documentation](./README.md)
- 🐞 [Report Issues](https://github.com/Onkar86/kisan-mitra-ai-0.2/issues)
- 💬 [Discussions](https://github.com/Onkar86/kisan-mitra-ai-0.2/discussions)

---

## 🎉 Roadmap

Future features planned:
- [ ] Image recognition for crop diseases
- [ ] Soil testing integration
- [ ] Weather API integration
- [ ] SMS-based access for feature phones
- [ ] WhatsApp integration
- [ ] Offline-first support (PWA)
- [ ] Payment gateway for premium features
- [ ] Regional agricultural officer directory

---

**Made with ❤️ for Indian Farmers**

🌾 Kisan Mitra AI | Smart Farming Assistant | Free Forever

Visit: https://onkar86.github.io/kisan-mitra-ai-0.2/
