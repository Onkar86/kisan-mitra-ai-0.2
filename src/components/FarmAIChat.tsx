import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, FarmingMode, SupportedLanguage, LANGUAGE_LABELS } from '../types';
import { generateAIResponse } from '../services/aiChatService';
import { saveChatMessage, getChatHistory } from '../services/firebaseService';
import VoiceInput from './VoiceInput';

interface FarmAIChatProps {
  userProfile: UserProfile;
  onEmergency?: () => void;
}

export default function FarmAIChat({ userProfile, onEmergency }: FarmAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [farmingMode, setFarmingMode] = useState<FarmingMode>(userProfile.farmingMode || FarmingMode.BOTH);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(userProfile.language || 'en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on component mount
  useEffect(() => {
    const loadHistory = async () => {
      if (userProfile.uid) {
        const history = await getChatHistory(userProfile.uid, 20);
        setMessages(history as ChatMessage[]);
      }
    };
    loadHistory();
  }, [userProfile.uid]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      language: selectedLanguage,
      farmingMode,
      cropContext: userProfile.crops?.join(', '),
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Save user message to Firestore
      if (userProfile.uid) {
        await saveChatMessage(userProfile.uid, userMessage);
      }

      // Generate AI response
      const aiMessage = await generateAIResponse(text, userProfile, farmingMode);
      setMessages(prev => [...prev, aiMessage]);

      // Save AI response to Firestore
      if (userProfile.uid) {
        await saveChatMessage(userProfile.uid, aiMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorLanguageMessages: Record<SupportedLanguage, string> = {
        en: 'Sorry, I encountered an error. Please try again.',
        hi: 'माफ़ी चाहता हूँ, मुझे एक त्रुटि का सामना करना पड़ा। कृपया फिर से कोशिश करें।',
        mr: 'खेद आहे, मुझे एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
        pa: 'ਮੈਨੂੰ ਮਾਫ਼ ਕਰੋ, ਮੈਨੂੰ ਇੱਕ ਤ੍ਰੁਟੀ ਦਾ ਸਾਹਮਣਾ ਕਰਨਾ ਪਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੜ ਅਜ਼ਮਾਇਸ਼ ਕਰੋ।',
        gu: 'માફ કરજો, મને એક ભૂલ આવી. કૃપયા ફરીથી પ્રયાસ કરો.',
        ta: 'முன்னிலையில் போதாயை கூறவேண்டும், தவறு ஏற்பட்டுள்ளது। மீண்டும் முயற்சி করவும்.',
        te: 'అందులో నాకు ఒక ఛిద్రం ఎదుర్కొన్నాను. దయచేసి మళ్లీ ప్రయత్నించండి.',
        kn: 'ಕ್ಷಮೆಯಾಚಿಸಿ, ನನಗೆ ಒಂದು ದೋಷ ಎದುರಾಯಿತು. ದಯಕರವಾಗಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        bn: 'দুঃখিত, আমি একটি ত্রুটির সম্মুখীন হয়েছি। অনুগ্রহ করে আবার চেষ্টা করুন।',
        ml: 'ക്ഷമിക്കുക, എനിക്ക് ഒരു പിഴവ് നേരിട്ടു. ദയ ചെയ്തു വീണ്ടും ശ്രമിക്കുക.',
        or: 'କ୍ଷମା ଚାହଁ, ମୁଁ ଏକ ତ୍ରୁଟି ସମ୍ମୁଖୀନ ହେଲି। ଦୟ ଚାଇଁ ଆବାର ଚେଷ୍ଟା କରନ୍ତୁ।',
      };

      const errorMessage: ChatMessage = {
        role: 'ai',
        content: errorLanguageMessages[selectedLanguage] || errorLanguageMessages['en'],
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-green-50 to-lime-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-lg p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">🌾 Kisan Mitra - Farm AI Chat</h1>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-3 py-2 bg-white text-gray-800 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Farming Mode */}
            <div>
              <label className="block text-sm font-medium mb-1">Farming Mode</label>
              <select
                value={farmingMode}
                onChange={e => setFarmingMode(e.target.value as FarmingMode)}
                className="w-full px-3 py-2 bg-white text-gray-800 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <option value={FarmingMode.ORGANIC_ONLY}>🌿 Organic Only</option>
                <option value={FarmingMode.CHEMICAL}>⚗️ Chemical Only</option>
                <option value={FarmingMode.BOTH}>🔄 Both Methods</option>
              </select>
            </div>

            {/* Emergency Button */}
            <div className="flex items-end">
              <button
                onClick={onEmergency}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
              >
                🚨 Emergency Help
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <div className="text-4xl mb-4">🌾</div>
            <p className="text-lg font-semibold mb-2">Welcome to Kisan Mitra!</p>
            <p className="text-sm">Ask me anything about farming - pests, diseases, crops, fertilizers, and more.</p>
            <p className="text-xs mt-4 text-gray-500">
              💡 Tips: Select your language, farming mode, and describe your farm problem.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-green-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-green-200 px-4 py-3 rounded-lg rounded-bl-none shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-green-200 shadow-lg max-w-4xl mx-auto w-full">
        <div className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder={
                selectedLanguage === 'en'
                  ? 'Ask about your farm...'
                  : selectedLanguage === 'hi'
                    ? 'अपने खेत के बारे में पूछें...'
                    : selectedLanguage === 'mr'
                      ? 'आपल्या शेतीविषयी विचारा...'
                      : 'Ask about your farm...'
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>

          {/* Voice Input Button */}
          <div className="mt-2">
            <VoiceInput language={selectedLanguage} onTranscript={handleVoiceInput} />
          </div>
        </div>
      </div>
    </div>
  );
}
