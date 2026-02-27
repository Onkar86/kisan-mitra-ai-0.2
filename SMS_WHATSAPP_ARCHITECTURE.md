# 📱 SMS & WhatsApp Integration Guide

> Bring Kisan Mitra to feature phones and WhatsApp for deeper farmer reach

---

## 🎯 Overview

This guide shows how to add SMS and WhatsApp interfaces to Kisan Mitra so farmers can access features via:
- **📱 SMS** - Works on ALL phones (no internet needed)
- **💬 WhatsApp** - Most farmers already have it
- **☎️ Voice Calls** - Support for non-literate farmers

**Total Reach:** From 5G smartphones → feature phones → over-the-phone support

---

## 1. 📱 SMS Integration

### Option A: Twilio (Recommended)

**Cost:** Free tier covers testing, then $0.01-0.03 per SMS

#### Setup

```bash
# 1. Create Twilio account
Visit: https://www.twilio.com/console
Sign up (free phone number included)

# 2. Get credentials
- Phone number (your Twilio number)
- Account SID
- Auth Token

# 3. Install Twilio SDK
npm install twilio
```

#### Implementation

Create `src/services/smsService.ts`:

```typescript
import twilio from 'twilio';

const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.VITE_TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send farming advice via SMS
 */
export async function sendFarmingAdviceSMS(
  farmersPhone: string,
  question: string,
  answer: string
): Promise<boolean> {
  try {
    const message = await client.messages.create({
      body: `🌾 Kisan Mitra Response:\n\n${answer}\n\nReply with your question or call our hot line.`,
      from: twilioPhone,
      to: farmersPhone,
    });

    console.log(`SMS sent to ${farmersPhone}:`, message.sid);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

/**
 * Send emergency alert via SMS
 */
export async function sendEmergencyAlertSMS(
  farmersPhone: string,
  cropName: string,
  problemSummary: string
): Promise<boolean> {
  try {
    const message = await client.messages.create({
      body: `🚨 EMERGENCY ALERT\nCrop: ${cropName}\nProblem: ${problemSummary}\nVisit: kisan-mitra.com or call +91-XXXX-XXXX`,
      from: twilioPhone,
      to: farmersPhone,
    });

    return true;
  } catch (error) {
    console.error('Error sending emergency SMS:', error);
    return false;
  }
}

/**
 * SMS webhook handler for incoming messages
 * Called when farmer texts a question to your Twilio number
 */
export async function handleIncomingSMS(
  fromPhone: string,
  messageBody: string
): Promise<string> {
  // Translate SMS query to AI chat system
  const response = await generateAIResponse(messageBody, {
    uid: `sms_${fromPhone}`,
    phone: fromPhone,
    name: 'SMS User',
    address: 'Not provided',
    farmSize: 0,
    crops: [],
    language: 'hi', // Detect from message content
    aiProvider: 'GEMINI',
    onboarded: false,
  });

  return response.content;
}
```

#### Express.js Webhook (Backend)

```javascript
// server.js
const express = require('express');
const twilio = require('twilio');

const app = express();
app.use(express.urlencoded({ extended: false }));

// Twilio webhook
app.post('/sms-webhook', (req, res) => {
  const fromPhone = req.body.From;
  const messageBody = req.body.Body;

  // Process message asynchronously
  handleIncomingSMS(fromPhone, messageBody);

  // Send immediate response
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message('🌾 Thank you! Your question is being processed. Response coming soon.');

  res.type('text/xml').send(twiml.toString());
});

app.listen(3001, () => console.log('Twilio webhook running'));
```

#### Farmer Experience

```
FARMER TEXTS:
"Mere gahun ke patte yellow ho rahe hain kya karu?"
(My wheat leaves are yellowing, what should I do?)

↓

KISAN MITRA SMS RESPONSE (2 minutes later):
"🌾 KISAN MITRA
Aaphe gahun mein nitrogen ki kami ho sakti hai.

TURANT UPCHAR:
1. Urea ka spray kar sakten ho (0.5kg per 100L pani)
2. Mulch lagayen drought se bachne ke liye

ORGANIC:
Neem cake lagayen (500kg per hectare)

---
Visit: kisan-mitra.com
Or reply 'EMERGENCY' for urgent help"
```

---

### Option B: AWS SNS

**Cost:** Even cheaper for bulk SMS (₹0.5-1 per SMS in India)

```typescript
import AWS from 'aws-sdk';

const sns = new AWS.SNS({
  region: 'ap-south-1', // India
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export async function sendFarmingAdviceSMS(
  farmerPhone: string,
  answer: string
): Promise<boolean> {
  const params = {
    Message: answer,
    PhoneNumber: `+91${farmerPhone}`,
  };

  try {
    await sns.publish(params).promise();
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
```

---

## 2. 💬 WhatsApp Integration

### Option A: WhatsApp Business API + Twilio

**Cost:** Same as SMS (~$0.01 per message)

#### Setup

```bash
# Register WhatsApp Business Account
Visit: https://developers.facebook.com/docs/whatsapp

# Get credentials
- WhatsApp Business Phone Number
- Twilio WhatsApp Connection

# Test account: /whatsapp/start
```

#### Implementation

```typescript
import twilio from 'twilio';

const client = twilio(accountSid, authToken);

/**
 * Send WhatsApp message with media support
 */
export async function sendWhatsAppMessage(
  whatsappNumber: string,
  message: string,
  mediaUrl?: string
): Promise<boolean> {
  try {
    const msg = await client.messages.create({
      from: `whatsapp:${process.env.VITE_WHATSAPP_PHONE}`,
      to: `whatsapp:${whatsappNumber}`,
      body: message,
      mediaUrl: mediaUrl ? [mediaUrl] : undefined,
    });

    console.log('WhatsApp sent:', msg.sid);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return false;
  }
}

/**
 * Send disease diagnosis with image via WhatsApp
 */
export async function sendDiagnosisWhatsApp(
  whatsappNumber: string,
  disease: string,
  imageUrl: string,
  treatment: string
): Promise<boolean> {
  const message = `🩺 DISEASE DIAGNOSIS
Disease: ${disease}
Treatment: ${treatment}
Confidence: 95%`;

  return sendWhatsAppMessage(whatsappNumber, message, imageUrl);
}
```

#### Webhook Handler

```javascript
app.post('/whatsapp-webhook', async (req, res) => {
  const fromPhone = req.body.From.replace('whatsapp:', '');
  const messageBody = req.body.Body;
  const hasMedia = req.body.NumMedia > 0;

  // Handle image upload (disease detection)
  if (hasMedia) {
    const mediaUrl = req.body.MediaUrl0;
    const diagnosis = await detectCropDiseaseFromURL(mediaUrl);
    await sendDiagnosisWhatsApp(fromPhone, diagnosis.disease, mediaUrl, diagnosis.treatment);
  } else {
    // Handle text question
    const response = await generateAIResponse(messageBody);
    await sendWhatsAppMessage(fromPhone, response);
  }

  res.type('text/xml').send('<Response></Response>');
});
```

#### Farmer Experience

```
FARMER SENDS WHATSAPP:
[Photo of diseased leaf]
"क्या यह पावरी मिल्ड्यु है?"

↓

KISAN MITRA RESPONDS:
"🩺 DISEASE DETECTED
Disease: Powdery Mildew (98% confidence)

🚨 IMMEDIATE ACTION:
1. Remove affected leaves within 24hrs
2. Spray sulfur or milk solution

⚗️ CHEMICAL:
Baking soda @ 1% concentration

🌿 ORGANIC:
Milk spray 1:10 ratio, repeat every 5 days

Learn more: kisan-mitra.com"
```

---

### Option B: Official WhatsApp Messaging API

**Direct integration with Facebook WhatsApp API (managed solution)**

```typescript
/**
 * Official WhatsApp Business API via Facebook
 */
export async function sendWhatsAppViaFacebook(
  phoneNumberId: string,
  recipientPhone: string,
  message: {
    type: 'text' | 'image' | 'document';
    text?: string;
    image?: { link: string };
  }
) {
  const response = await fetch(
    `https://graph.instagram.com/v18.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VITE_WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: message.type,
        [message.type]: message[message.type as keyof typeof message],
      }),
    }
  );

  return response.json();
}
```

---

## 3. ☎️ Voice Call Support (IVR)

### Implementation with Twilio

For non-literate farmers, enable voice interaction:

```typescript
/**
 * Voice call handler using Twilio
 * Farmer dials, gets menu options via voice
 */
export async function handleFarmingAdviceCall(req: any, res: any) {
  const twiml = new twilio.twiml.VoiceResponse();

  // Welcome message in multiple languages
  twiml.gather({
    numDigits: 1,
    action: '/handle-call-input',
    method: 'POST',
  }).say({
    language: 'hi-IN', // Hindi
  }, `नमस्ते। किसान मित्र में स्वागत है। 
  अपनी समस्या के लिए 1 दबाएं।
  कीटों के लिए 2 दबाएं।
  मौसम की जानकारी के लिए 3 दबाएं।
  अधिकारी डायरेक्टरी के लिए 4 दबाएं।`);

  res.type('text/xml').send(twiml.toString());
}

export async function handleCallInput(req: any, res: any) {
  const digit = req.body.Digits;
  const twiml = new twilio.twiml.VoiceResponse();

  switch (digit) {
    case '1':
      twiml.say(
        { language: 'hi-IN' },
        'अपनी समस्या बताएं। बीस सेकंड में बोलें।'
      );
      twiml.record({
        action: '/process-voice-question',
        method: 'POST',
        maxLength: 20,
      });
      break;
    case '2':
      twiml.say(
        { language: 'hi-IN' },
        'कीटों से बचने के लिए नीम का तेल का छिड़काव करें।'
      );
      break;
    // ... more options
  }

  res.type('text/xml').send(twiml.toString());
}
```

---

## 4. 🌐 Backend Setup (Node.js + Express)

### Complete Server Implementation

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const axios = require('axios');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ============ SMS ENDPOINTS ============

app.post('/sms-incoming', async (req, res) => {
  const { From, Body } = req.body;

  // Call AI service to generate response
  const response = await fetch('http://localhost:5173/api/ai-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: Body }),
  });

  const { answer } = await response.json();

  // Split long responses into multiple SMS
  const chunks = chunkString(answer, 160);
  for (const chunk of chunks) {
    await sendSMS(From, chunk);
  }

  res.type('text/xml').send('<Response></Response>');
});

// ============ WHATSAPP ENDPOINTS ============

app.post('/whatsapp-incoming', async (req, res) => {
  const fromPhone = req.body.From.replace('whatsapp:', '');
  const messageBody = req.body.Body;
  const hasMedia = req.body.NumMedia > 0;

  let response;
  if (hasMedia) {
    // Disease detection from image
    const mediaUrl = req.body.MediaUrl0;
    response = await detectDisease(mediaUrl);
  } else {
    // AI chat response
    response = await getAIResponse(messageBody);
  }

  await sendWhatsApp(fromPhone, response);
  res.json({ success: true });
});

// ============ VOICE ENDPOINTS ============

app.post('/call-incoming', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();

  twiml.gather({
    numDigits: 1,
    action: '/call-menu-select',
    method: 'POST',
  }).say(
    { language: 'hi-IN' },
    'किसान मित्र में स्वागत है। कृपया विकल्प चुनें।'
  );

  res.type('text/xml').send(twiml.toString());
});

// ============ HELPER FUNCTIONS ============

function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g')) || [];
}

async function sendSMS(phone, message) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
}

async function sendWhatsApp(phone, message) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await client.messages.create({
    body: message,
    from: `whatsapp:${process.env.WHATSAPP_PHONE}`,
    to: `whatsapp:${phone}`,
  });
}

async function getAIResponse(question) {
  // Call your Gemini API or AI service
  // Return formatted response for SMS/WhatsApp
  return 'Response here';
}

async function detectDisease(imageUrl) {
  // Call disease detection service
  // Return diagnosis results
  return { disease: 'Powdery Mildew', treatment: '...' };
}

app.listen(process.env.PORT || 3001, () => {
  console.log('SMS/WhatsApp server running');
});
```

---

## 5. 📊 Cost Comparison

| Channel | Cost per Message | Setup | Language Support |
|---------|------------------|-------|------------------|
| **SMS (Twilio)** | $0.01 | 5 min | Limited |
| **SMS (AWS SNS)** | ₹0.5 | 10 min | Limited |
| **WhatsApp (Twilio)** | $0.01 | 10 min | Full |
| **WhatsApp (Official)** | Variable | Complex | Full |
| **Voice (IVR)** | $0.02/min | 15 min | Full |

**Recommendation:** Start with SMS + WhatsApp (Twilio), scale to Official APIs later

---

## 6. 🔐 Security & Privacy

```typescript
// Hash sensitive data
import crypto from 'crypto';

export function hashPhone(phone: string): string {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

// Validate incoming SMS/WhatsApp
export function validateTwilioRequest(req: any, authToken: string): boolean {
  const twilioSignature = req.headers['x-twilio-signature'];
  const url = `${process.env.BASE_URL}${req.originalUrl}`;
  const params = req.body;

  return twilio.validateRequest(authToken, twilioSignature, url, params);
}

// Rate limiting
import rateLimit from 'express-rate-limit';

const smsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
});

app.post('/sms-incoming', smsLimiter, (req, res) => {
  // Handle SMS
});
```

---

## 7. 📈 Deployment

### Heroku (Free tier works)

```bash
# 1. Create Heroku account
heroku create kiisan-mitra-sms

# 2. Set environment variables
heroku config:set TWILIO_ACCOUNT_SID=xxx
heroku config:set TWILIO_AUTH_TOKEN=xxx
heroku config:set TWILIO_PHONE_NUMBER=+1xxx

# 3. Deploy
git push heroku main

# 4. Set Twilio Webhooks
# In Twilio Console:
# SMS Webhook: https://kiisan-mitra-sms.herokuapp.com/sms-incoming
# WhatsApp Webhook: https://kiisan-mitra-sms.herokuapp.com/whatsapp-incoming
```

### Docker (Production)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

---

## 8. 🚀 Next Steps

1. ✅ Choose SMS provider (Twilio or AWS SNS)
2. ✅ Get Twilio account & phone number (free)
3. ✅ Deploy webhook server (Heroku or AWS)
4. ✅ Configure webhook URLs in Twilio Console
5. ✅ Test with real farmers
6. ✅ Scale to WhatsApp and IVR
7. ✅ Monitor usage & costs

---

## 📞 Quick Test

```bash
# Test SMS
curl -X POST http://localhost:3001/sms-incoming \
  -d "From=+919999999999" \
  -d "Body=Mere gahun ke patte yellow ho rahe hain"

# Test WhatsApp
curl -X POST http://localhost:3001/whatsapp-incoming \
  -d "From=whatsapp:+919999999999" \
  -d "Body=Help with farming"
```

---

## 📚 Resources

- Twilio Docs: https://www.twilio.com/docs
- WhatsApp API: https://developers.facebook.com/docs/whatsapp
- AWS SNS: https://aws.amazon.com/sns
- Express.js: https://expressjs.com

---

**This SMS/WhatsApp layer enables Kisan Mitra to reach farmers anywhere, anytime, on any device!** 📱🌾
