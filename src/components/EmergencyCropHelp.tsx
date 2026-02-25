import React, { useState } from 'react';
import { UserProfile, SupportedLanguage, LANGUAGE_LABELS } from '../types';
import { generateAIResponse } from '../services/aiChatService';
import { saveChatMessage } from '../services/firebaseService';

interface EmergencyCropHelpProps {
  userProfile: UserProfile;
  onBack?: () => void;
}

interface EmergencyRequest {
  cropName: string;
  problemDescription: string;
  severity: 'low' | 'medium' | 'high';
  imageFile?: File;
}

export default function EmergencyCropHelp({ userProfile, onBack }: EmergencyCropHelpProps) {
  const [step, setStep] = useState<'form' | 'response'>('form');
  const [language, setLanguage] = useState<SupportedLanguage>(userProfile.language || 'en');
  const [formData, setFormData] = useState<EmergencyRequest>({
    cropName: userProfile.crops?.[0] || '',
    problemDescription: '',
    severity: 'high',
  });
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const severityLabels: Record<SupportedLanguage, Record<string, string>> = {
    en: { low: '🟡 Moderate', medium: '🟠 Urgent', high: '🔴 Critical' },
    hi: { low: '🟡 मध्यम', medium: '🟠 आपातकाल', high: '🔴 गंभीर' },
    mr: { low: '🟡 मध्यम', medium: '🟠 आपातकाल', high: '🔴 गंभीर' },
    pa: { low: '🟡 ਮੱਧਮ', medium: '🟠 ਸ਼ਾਹੀ', high: '🔴 ਗੰਭੀਰ' },
    gu: { low: '🟡 મધ્યમ', medium: '🟠 તાત્ક્ષણિક', high: '🔴 ગંભીર' },
    ta: { low: '🟡 மધ్യમ', medium: '🟠 உடన் ', high: '🔴 கடுமையான' },
    te: { low: '🟡 మధ్యమ', medium: '🟠 తక్షణ', high: '🔴 కఠినమైన' },
    kn: { low: '🟡 ಮಧ್ಯಮ', medium: '🟠 ತಾತ್ಕ್ಷಣಿಕ', high: '🔴 ಗಂಭೀರ' },
    bn: { low: '🟡 মাঝারি', medium: '🟠 জরুরি', high: '🔴 গুরুতর' },
    ml: { low: '🟡 മദ്ധ്യ', medium: '🟠 അത്യാപത്തായ', high: '🔴 ഗഗ്രവോ' },
    or: { low: '🟡 ମଧ୍ୟମ', medium: '🟠 ଜରୁରି', high: '🔴 ଗୁରୁତ୍ୱ' },
  };

  const placeholders: Record<SupportedLanguage, string> = {
    en: 'Describe the crop problem in detail... (color changes, spots, wilting, pest damage, etc.)',
    hi: 'फसल की समस्या का विस्तार से वर्णन करें... (रंग परिवर्तन, धब्बे, पड़दवा, कीट क्षति, आदि)',
    mr: 'पिकाची समस्या तपशीलवारपणे वर्णन करा... (रंग बदल, डाग, मुरणे, कीड नुकसान, इ.)',
    pa: 'ਫਸਲ ਦੀ ਸਮੱਸਿਆ ਦਾ ਤਫਸੀਲ ਨਾਲ ਵਰਣਨ ਕਰੋ...',
    gu: 'ફસલની સમસ્યાનું વિસ્તારથી વર્ણન કરો...',
    ta: 'விளை பொருளின் சమस్যை விளக்கி கூறவும்...',
    te: 'పిల సమస్యను వివరంగా వర్ణించండి...',
    kn: 'ಸಸ್ಯದ ಸಮಸ್ಯೆಯನ್ನು ವಿವರವಾಗಿ ವರ್ಣಿಸಿ...',
    bn: 'ফসলের সমস্যা বিস্তারিতভাবে বর্ণনা করুন...',
    ml: 'കൃഷി പ്രശ്നം വിശദമായി വിവരിക്കുക...',
    or: 'ଫସଲର ସମସ୍ୟାର ବିସ୍ତାରିତ ବର୍ଣ୍ଣନା ଦିଅ...',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.problemDescription.trim()) return;

    setIsLoading(true);

    try {
      // Create emergency-specific prompt
      const emergencyQuestion = `🚨 EMERGENCY CROP HELP REQUEST
Crop: ${formData.cropName}
Severity: ${formData.severity}
Problem: ${formData.problemDescription}

Please provide IMMEDIATE SOLUTIONS with:
1. Instant action steps (what to do RIGHT NOW)
2. Chemical solutions (fast-acting if severity is high)
3. Natural/organic alternatives
4. When to contact agricultural extension officer`;

      // Generate response
      const aiMessage = await generateAIResponse(emergencyQuestion, userProfile);
      setResponse(aiMessage.content);

      // Save to Firestore
      if (userProfile.uid) {
        await saveChatMessage(userProfile.uid, {
          role: 'user',
          content: `EMERGENCY: ${formData.cropName} - ${formData.problemDescription}`,
          language,
          severity: formData.severity,
        });
        await saveChatMessage(userProfile.uid, aiMessage);
      }

      setStep('response');
    } catch (error) {
      console.error('Error:', error);
      setResponse('Unable to process emergency request. Please contact your local agricultural officer immediately.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'response') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">🚨 Emergency Response</h1>
            <p className="text-sm opacity-90">Immediate solutions for: {formData.cropName}</p>
          </div>
        </div>

        {/* Response */}
        <div className="max-w-2xl mx-auto p-4 pt-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-red-600">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{response}</div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-yellow-900 mb-2">⚠️ Important</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Follow safety guidelines when using chemicals</li>
              <li>• Consult local agricultural extension office for professional guidance</li>
              <li>• Document the problem with photos for better diagnosis</li>
              <li>• Start with prevention measures to avoid future problems</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setStep('form')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              ← Ask Another Question
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              ← Back to Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">🚨 Emergency Crop Help</h1>
          <p className="text-sm opacity-90">Get urgent solutions for crop problems</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Crop Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Affected Crop</label>
              <select
                value={formData.cropName}
                onChange={e => setFormData({ ...formData, cropName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select crop...</option>
                {userProfile.crops?.map(crop => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Problem Description</label>
              <textarea
                value={formData.problemDescription}
                onChange={e => setFormData({ ...formData, problemDescription: e.target.value })}
                placeholder={placeholders[language]}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity: level })}
                    className={`py-2 px-3 rounded font-medium transition-colors ${
                      formData.severity === level
                        ? 'bg-red-600 text-white ring-2 ring-red-400'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {severityLabels[language][level] || level}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading || !formData.problemDescription.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? '⏳ Processing...' : '🚀 Get Emergency Help'}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                ← Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 For Best Results:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about symptoms (color, location, pattern)</li>
            <li>• Mention recent weather changes</li>
            <li>• Include farm size and current practices</li>
            <li>• Take clear photos of affected plants (if possible)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
