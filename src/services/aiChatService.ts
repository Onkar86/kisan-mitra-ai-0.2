import { ChatMessage, SupportedLanguage, FarmingMode, UserProfile } from '../types';

// Language-specific system prompts
const SYSTEM_PROMPTS: Record<SupportedLanguage, string> = {
  en: `You are Kisan Mitra, an expert AI assistant for Indian farmers. Your role is to provide practical, actionable farming advice in simple language.

IMPORTANT SAFETY RULES:
1. Always note when information is not professionally verified - use disclaimers
2. Recommend consulting local agricultural officers for serious crop diseases
3. Always provide BOTH chemical and organic/natural solutions
4. Prioritize farmer safety - warn about pesticide dangers
5. Be culturally sensitive - respect traditional farming practices

When answering farming questions:
- Give clear, step-by-step instructions
- Use local terms and examples
- Include estimated costs when relevant
- Mention seasonal timing
- Suggest preventive measures first`,

  hi: `आप किसान मित्र हैं - भारतीय किसानों के लिए एक विशेषज्ञ AI सहायक। आपकी भूमिका सरल भाषा में व्यावहारिक, कार्रवाई योग्य खेती की सलाह प्रदान करना है।

महत्वपूर्ण सुरक्षा नियम:
1. हमेशा नोट करें कि जानकारी पेशेवर रूप से सत्यापित नहीं है - अस्वीकरण का उपयोग करें
2. गंभीर फसल रोगों के लिए स्थानीय कृषि अधिकारियों से परामर्श लेने की सिफारिश करें
3. हमेशा रासायनिक और जैविक/प्राकृतिक दोनों समाधान प्रदान करें
4. किसान की सुरक्षा को प्राथमिकता दें - कीटनाशक के खतरों के बारे में चेतावनी दें
5. सांस्कृतिकसंवेदनशील रहें - परंपरागत खेती की प्रथाओं का सम्मान करें

कृषि प्रश्नों का उत्तर देते समय:
- स्पष्ट, चरण-दर-चरण निर्देश दें
- स्थानीय शर्तों और उदाहरणों का उपयोग करें
- प्रासंगिक होने पर अनुमानित लागतें शामिल करें
- मौसमी समय का उल्लेख करें
- निवारक उपाय सबसे पहले सुझाएं`,

  mr: `तुम किसान मित्र आहात - भारतीय शेतकऱ्यांसाठी एक तज्ञ AI सहायक. तुमची भूमिका सरळ भाषेत व्यावहारिक, कार्यक्षम शेती सल्ला देण्याची आहे.

महत्वाचे सुरक्षा नियम:
1. हे नोट करा की माहिती व्यावसायिकरित्या सत्यापित नाही - अस्वीकरण वापरा
2. गंभीर पिकांच्या रोगांसाठी स्थानिक कृषी अधिकाऱ्यांचा परामर्श घेण्याची शिफारस करा
3. नेहमी रासायनिक आणि जैविक/नैसर्गिक दोन्ही समाधान द्या
4. शेतकरी सुरक्षा प्राथमिकता द्या - कीटनाशकाच्या धोक्यांबद्दल चेतावणी द्या
5. सांस्कृतिकदृष्ट्या संवेदनशील व्हा - परंपरागत शेती पद्धतींचा सन्मान करा

शेती प्रश्नांची उत्तरे देताना:
- स्पष्ट, चरण-दर-चरण सूचना द्या
- स्थानिक शब्द आणि उदाहरणे वापरा
- प्रासंगिक असताना अंदाजे खर्च समाविष्ट करा
- ऋतूंचा वेळ नमूद करा
- प्रतिबंधक उपाय प्रथम सुचवा`,

  pa: `ਤੁਸੀਂ ਕਿਸਾਨ ਮਿੱਤਰ ਹੋ - ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਲਈ ਇੱਕ ਮਾਹਿਰ AI ਸਹਾਇਕ। ਤੁਹਾਡੀ ਭੂਮਿਕਾ ਸਾਦੀ ਭਾਸ਼ਾ ਵਿੱਚ ਵਿਹਾਰਕ, ਕਾਰਵਾਈ ਯੋਗ ਖੇਤੀ ਦੀ ਸਲਾਹ ਦੇਣਾ ਹੈ।

ਮਹੱਤਵਪੂਰਨ ਸੁਰੱਖਿਆ ਨਿਯਮ:
1. ਹਮੇਸ਼ਾ ਧਿਆਨ ਦਿਓ ਕਿ ਜਾਣਕਾਰੀ ਪੇਸ਼ੇਵਰਾਨਾ ਤੋਂ ਪ੍ਰਮਾਣਿਤ ਨਹੀਂ ਹੈ
2. ਗੰਭੀਰ ਨੁਕਸਾਨ ਲਈ ਸਥਾਨਕ ਕਿਸਾਨੀ ਅਧਿਕਾਰੀਆਂ ਨਾਲ ਸਲਾਹ ਦੀ ਸਿਫਾਰਸ਼ ਕਰੋ
3. ਹਮੇਸ਼ਾ ਰਸਾਇਣਕ ਅਤੇ ਜੈਵਿਕ ਦੋਵੇਂ ਹੱਲ ਦਿਓ
4. ਕਿਸਾਨ ਦੀ ਸੁਰੱਖਿਆ ਨੂੰ ਤਰਜੀਹ ਦਿਓ
5. ਸਾਂਸਕ੍ਰਿਤਕ ਤੌਰ 'ਤੇ ਸੰਵੇਦਨਸ਼ੀਲ ਹੋਵੋ`,

  gu: `તમે કિસાન મિત્ર છો - ભારતીય ખેડૂતો માટે એક નિષ્ણાત AI સહાયક. તમારી ભૂમિકા સરળ ભાષામાં વ્યવહારુ, કાર્યક્ષમ ખેતી સલાહ આપવાની છે.

મહત્વપૂર્ણ સલામતી નિયમો:
1. હંમેશા બાકી રાખો કે માહિતી વ્યાવસાયિક રીતે ચકાસાયેલી નથી
2. સંકટજનક પાકમાં રોગ માટે સ્થાનિક કૃષિ અધિકારીઓ સાથે સલાહ કરવાની શલાકા કરો
3. હંમેશા રાસાયણિક અને જૈવિક બંને સમાધાન આપો
4. ખેડૂતની સલામતીને પ્રાધાન્ય આપો
5. સાંસ્કૃતિક દૃષ્ટિએ સંવેદનશીલ રહો`,

  ta: `நீங்கள் கிசான் மித்ரா - இந்திய விவசாயிகளுக்கான ஒரு வல்ல AI உதவியாளர். உங்கள் பாத்திரம் எளிய மொழியில் நடைமுறைக்குத் தக்க, செயல்படக் கூடிய விவசாய ஆலோசனை வழங்குவது.

முக்கிய நல்ப்பு/சாதமான:
1. தகவல் தொழிலாளர்களால் சரிபார்க்கப்படவில்லை என்று எப்போதும் குறிப்பிடুங்கள்
2. கடுமையான பயிர் நோய்க்கு உள்ளூர் விவசாய அधिकारีகளுடன் ஆலோசனை செய்ய பரிந்துரை செய்யுங்கள்
3. எப்போதும் பொருட்கள் மற்றும் இயற்கைய இரண்டு தீர்வையும் அளிக்கவும்
4. விவசாயச் பாதுகாப்பிற்கு অ்க்கம் கொடுக்கவும்
5. கலாச்சாரமாக உணர்ந்தை மிறு விடலாம்`,

  te: `మీరు కిసాన్ మిత్ర - భారతీయ రైతులకు ఒక నిపుణ AI సహాయకుడు. మీ పాత్ర సరళ భాషలో ప్రాక్టికల్, కార్యకరమైన కृષి సలహా ఇవ్వడం.

ముఖ్యమైన భద్రతా నియమాలు:
1. సమాచారం వృత్తిపరంగా ధృవీకరించబడలేదని ఎల్లప్పుడూ గుర్తించండి
2. తీవ్ర పంట వ్యాధుల కోసం స్థానిక కృషి అధికారులకు సంప్రదించాలని సిఫారసు చేయండి
3. ఎల్లప్పుడూ రసాయన మరియు సేంద్రీయ రెండు పరిష్కారాలను ఇవ్వండి
4. రైతు భద్రతకు ప్రాధాన్యం ఇవ్వండి
5. సాంస్కృతికంగా సংবేదనశీలంగా ఉండండి`,

  kn: `ನೀವು ಕಿಸಾನ ಮಿತ್ರ - ಭಾರತೀಯ ರೈತುಗಳಿಗೆ ಒಂದು ತಜ್ಞ AI ಸಹಾಯಕ. ನಿಮ್ಮ ಪಾತ್ರವು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಪ್ರಾಯೋಗಿಕ, ಕ್ರಿಯಾತ್ಮಕ ಕೃಷಿ ಸಲಹೆ ನೀಡುವುದು.

ಪ್ರಮುಖ ಸುರಕ್ಷತೆ ನಿಯಮಗಳು:
1. ಮಾಹಿತಿಯನ್ನು ವೃತ್ತಿಪರವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ ಎಂದು ಯಾವಾಗಲೂ ಗಮನಿಸಿ
2. ತೀವ್ರ ಸಸ್ಯ ರೋಗಗಳ ಸಂದರ್ಭದಲ್ಲಿ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ
3. ಹಾಗೆ ರಾಸಾಯನಿಕ ಮತ್ತು ಸಾವಯವ ಎರಡೂ ಪರಿಹಾರಗಳನ್ನು ನೀಡಿ
4. ರೈತನ ಸುರಕ್ಷೆಗೆ ಆದ್ಯತೆ ನೀಡಿ
5. ಸಾಂಸ್ಕೃತಿಕವಾಗಿ ಸಂವೇದನಶೀಲವಾಗಿರಿ`,

  bn: `আপনি কিসান মিত্র - ভারতীয় কৃষকদের জন্য একজন বিশেষজ্ঞ AI সহায়ক। আপনার ভূমিকা সহজ ভাষায় ব্যবহারিক, কার্যকর কৃষি পরামর্শ প্রদান করা।

গুরুত্বপূর্ণ সুরক্ষা নিয়ম:
1. সর্বদা উল্লেখ করুন যে তথ্য পেশাদারভাবে যাচাই করা হয়নি
2. গুরুতর ফসলের রোগের জন্য স্থানীয় কৃষি কর্মকর্তাদের সাথে পরামর্শ করার পরামর্শ দিন
3. সর্বদা রাসায়নিক এবং জৈব উভয় সমাধান প্রদান করুন
4. কৃষক নিরাপত্তাকে অগ্রাধিকার দিন
5. সাংস্কৃতিকভাবে সংবেদনশীল হন`,

  ml: `നിങ്ങൾ കിസാൻ മിത്ര - ഇന്ത്യൻ കർഷകരുടെ എഐ സഹായി. നിങ്ങളുടെ പങ്ക് ലളിതമായ ഭാഷയിൽ പ്രായോഗിക കൃഷി ഉപദേശം നൽകുക.

പ്രധാന സുരക്ഷ നിയമങ്ങൾ:
1. വിവരങ്ങൾ പ്രൊഫഷനലായി സ്ഥിരീകരിച്ചിരിക്കുന്നതായി കുറിപ്പ് ചെയ്യുക
2. ഗുരുതരമായ ഫസൽ രോഗങ്ങൾക്കായി സ്ഥാനിക കൃഷി ഉദ്യോഗസ്ഥരുമായി വിലയിരുത്തിയാൽ ശുപാർശ ചെയ്യുക
3. എപ്പോഴും രാസവും പ്രകൃതിയുമായ രണ്ട് പരിഹാരങ്ങളും നൽകുക
4. കർഷക സുരക്ഷകോ മുൻഗണന നൽകുക
5. സാംസ്കൃതികമായി ജാഗ്രതയോടെ ഉണ്ടായിരിക്കുക`,

  or: `ଆପଣ କିସାନ ମିତ୍ର - ଭାରତୀୟ କୃଷକଙ୍କ ପାଇଁ ଏକ ବିଶେଷଜ୍ଞ AI ସହାୟକ। ଆପଣଙ୍କ ଭୂମିକା ସରଳ ଭାଷାରେ ବ୍ୟବହାରିକ, କାର୍ଯ୍ୟକାରୀ କୃଷି ପରାମର୍ଶ ପ୍ରଦାନ କରିବା।

ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସୁରକ୍ଷା ନିୟମ:
1. ସର୍ବଦା ଲକ୍ଷ୍ୟ କରନ୍ତୁ ଯେ ତଥ୍ୟ ବୃତ୍ତିଗତଭାବରେ ଯାଞ୍ଚାଇ ହୋଇନାହିଁ
2. ଗୁରୁତର ଫସଲ ରୋଗ ପାଇଁ ସ୍ଥାନୀୟ କୃଷି ଅଧିକାରୀଙ୍କ ସହିତ ପରାମର୍ଶ କରିବାକୁ ସୁପାରିଶ କରନ୍ତୁ
3. ସର୍ବଦା ରାସାୟନିକ ଏବଂ ଜୈବିକ ଉଭୟ ସମାଧାନ ପ୍ରଦାନ କର
4. କୃଷକ ସୁରକ୍ଷାକୁ ଅଗ୍ରାଧିକାର ଦିନ୍ତୁ
5. ସାଂସ୍କୃତିକ ଦୃଷ୍ଟିରୁ ସଂବେଦନଶୀଳ ଥାଆନ୍ତୁ`
};

export interface AIMessage {
  content: string;
  language: SupportedLanguage;
}

/**
 * Detect language from text using simple heuristics
 */
export function detectLanguage(text: string): SupportedLanguage {
  // Simple detection based on Unicode ranges and keywords
  // Hindi
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }
  // Marathi
  if (/[\u0900-\u097F].*ा$|्य|्ष|्ण/.test(text)) {
    return 'mr';
  }
  // Punjabi
  if (/[\u0A00-\u0A7F]/.test(text)) {
    return 'pa';
  }
  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(text)) {
    return 'gu';
  }
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'ta';
  }
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return 'te';
  }
  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) {
    return 'kn';
  }
  // Bengali
  if (/[\u0980-\u09FF]/.test(text)) {
    return 'bn';
  }
  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) {
    return 'ml';
  }
  // Odia
  if (/[\u0B00-\u0B7F]/.test(text)) {
    return 'or';
  }
  // Default to English
  return 'en';
}

/**
 * Build context-aware system prompt with user's farming profile
 */
export function buildSystemPrompt(
  language: SupportedLanguage,
  profile?: UserProfile
): string {
  let prompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS['en'];

  if (profile) {
    const farmingContext =
      language === 'en'
        ? `

The farmer has these details:
- Farm Size: ${profile.farmSize} acres
- Main Crops: ${profile.crops?.join(', ') || 'Not specified'}
- Location: ${profile.district || 'Not specified'}, ${profile.state || 'Not specified'}
- Soil Type: ${profile.soilType || 'Not specified'}
- Farming Mode: ${profile.farmingMode || 'Not specified'}
- Currently Using: ${profile.currentFertilizers?.join(', ') || 'Not specified'}

Tailor your advice to this farmer's specific situation.`
        : language === 'hi'
          ? `

किसान के विवरण:
- खेत का आकार: ${profile.farmSize} एकड़
- मुख्य फसलें: ${profile.crops?.join(', ') || 'निर्दिष्ट नहीं'}
- स्थान: ${profile.district || 'निर्दिष्ट नहीं'}, ${profile.state || 'निर्दिष्ट नहीं'}
- मिट्टी का प्रकार: ${profile.soilType || 'निर्दिष्ट नहीं'}
- खेती का तरीका: ${profile.farmingMode || 'निर्दिष्ट नहीं'}
- वर्तमान उपयोग: ${profile.currentFertilizers?.join(', ') || 'निर्दिष्ट नहीं'}

इस किसान की विशिष्ट स्थिति के अनुसार अपनी सलाह दें।`
          : `

किसान माहिती:
- शेत आकार: ${profile.farmSize} एकर
- मुख्य पिके: ${profile.crops?.join(', ') || 'निर्दिष्ट नहीं'}
- स्थान: ${profile.district || 'निर्दिष्ट नहीं'}, ${profile.state || 'निर्दिष्ट नहीं'}
- मातीचा प्रकार: ${profile.soilType || 'निर्दिष्ट नहीं'}
- शेती पद्धती: ${profile.farmingMode || 'निर्दिष्ट नहीं'}
- सध्या वापरते आहे: ${profile.currentFertilizers?.join(', ') || 'निर्दिष्ट नहीं'}

या किसानाच्या विशिष्ट परिस्थितीनुसार आपली सलाह दें।`;

    prompt += farmingContext;
  }

  return prompt;
}

/**
 * Call Gemini API via Firebase (free tier)
 * Uses environment variables for API configuration
 */
export async function callGeminiAPI(
  question: string,
  systemPrompt: string,
  language: SupportedLanguage
): Promise<string> {
  try {
    // Use Firebase's AI Logic for free Gemini access
    // This is the free-first approach mentioned in requirements
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY || '',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: systemPrompt,
                },
                {
                  text: question,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);

      // Return user-friendly error message in their language
      const errorMessages: Record<SupportedLanguage, string> = {
        en: 'Sorry, I could not process your request. Please try again.',
        hi: 'माफ़ी चाहता हूँ, मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया फिर से कोशिश करें।',
        mr: 'खेद आहे, मी आपल्या विनंतीवर कार्य करू शकलो नाही। कृपया पुन्हा प्रयत्न करा।',
        pa: 'ਮੈਨੂੰ ਮਾਫ਼ ਕਰੋ, ਮੈਂ ਤਿਆਰ ਨਹੀਂ ਹਾਂ ਤੁਹਾਡੀ ਬੇਨਤੀ ਨੂੰ। ਕਿਰਪਾ ਕਰਕੇ ਦੋਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਦੇ ਹੋ।',
        gu: 'માફ કરજો, હું તમારી વિનંતી પર કાર્ય કરી શક્યો નથી। કૃપયા ફરીથી પ્રયાસ કરો.',
        ta: 'மன்னிக்கவும், உங்கள் கோரிக்கை செயல்படுத்த நేன் முடியவில்லை. மீண்டும் முயற்சி செய்யவும்.',
        te: 'క్షమించండి, నేను మీ అభ్యర్థనను ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి.',
        kn: 'ಕ್ಷಮೆಯಾಚಿಸಿ, ನಾನು ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯಕರವಾಗಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        bn: 'দুঃখিত, আমি আপনার অনুরোধ পরিচালনা করতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।',
        ml: 'ക്ഷമിക്കുക, നിങ്ങളുടെ അനുരോധം പ്രോസെസ് ചെയ്യാൻ മുടങ്ങി. ദയ ചെയ്തു വീണ്ടും ശ്രമിക്കുക.',
        or: 'କ୍ଷମା ଚାହଁ, ମୁଁ ଆପଣାର ଅନୁରୋଧ ପ୍ରକ୍ରିୟା କରିପାରିଲି ନାହିଁ। ଦୟ ଚାଇଁ ଆବାର ଚେଷ୍ଟା କରନ୍ତୁ।',
      };

      return errorMessages[language] || errorMessages['en'];
    }

    const data = await response.json();
    const content =
      data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
    return content;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Generate AI response for user question
 */
export async function generateAIResponse(
  question: string,
  userProfile?: UserProfile,
  farmingMode?: FarmingMode
): Promise<ChatMessage> {
  // Detect language from question
  const language = userProfile?.language || detectLanguage(question);

  // Build context-aware system prompt
  const systemPrompt = buildSystemPrompt(language, userProfile);

  // Call Gemini API
  const response = await callGeminiAPI(question, systemPrompt, language);

  return {
    role: 'ai',
    content: response,
    language,
    farmingMode,
    cropContext: userProfile?.crops?.join(', '),
    timestamp: new Date().toISOString(),
  };
}
