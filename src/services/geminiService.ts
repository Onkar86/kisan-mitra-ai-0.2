
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, Recommendation, GroundingSource, SupportedLanguage, LANGUAGE_LABELS } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not set. Please set GEMINI_API_KEY in your environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

const DIAGNOSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    disease: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
    description: { type: Type.STRING },
    solutions: {
      type: Type.OBJECT,
      properties: {
        issue: { type: Type.STRING },
        chemicalSolution: {
          type: Type.OBJECT,
          properties: {
            product: { type: Type.STRING },
            dosage: { type: Type.STRING },
            precautions: { type: Type.STRING }
          },
          required: ["product", "dosage", "precautions"]
        },
        naturalSolution: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            preparation: { type: Type.STRING },
            benefits: { type: Type.STRING },
            philosophy: { type: Type.STRING }
          },
          required: ["name", "preparation", "benefits", "philosophy"]
        }
      },
      required: ["issue", "chemicalSolution", "naturalSolution"]
    }
  },
  required: ["disease", "confidence", "description", "solutions"]
};

export const analyzeCropImage = async (base64Image: string, lang: SupportedLanguage = 'en'): Promise<DiagnosisResult> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: `Diagnose the crop disease. Provide chemical and Rajiv Dixit natural solutions in JSON. Output all text in ${LANGUAGE_LABELS[lang]}.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: DIAGNOSIS_SCHEMA
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getFarmerAdviceWithGrounding = async (query: string, location: string, lang: SupportedLanguage = 'en'): Promise<Recommendation> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Farmer Question: "${query}" in "${location || 'India'}". Provide chemical and natural solutions with Google Search. Output all text in ${LANGUAGE_LABELS[lang]}.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: DIAGNOSIS_SCHEMA.properties.solutions
    }
  });
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: GroundingSource[] = groundingChunks.map((chunk: any) => ({
    title: chunk.web?.title,
    uri: chunk.web?.uri
  })).filter((s: any) => s.uri);
  const result = JSON.parse(response.text || "{}");
  return { ...result, groundingSources: sources };
};

export const getQuickAgriTip = async (lang: SupportedLanguage = 'en'): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite-latest",
    contents: `Give a 1-sentence quick professional tip for soil moisture conservation today in ${LANGUAGE_LABELS[lang]}.`
  });
  return response.text || "Keep your soil mulched!";
};

export const getLiveAssistant = (callbacks: any, lang: SupportedLanguage = 'en') => {
  const ai = getAI();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: ['audio'] as any,
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
      },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      systemInstruction: `You are 'Kisan Mitra', a wise and warm agricultural advisor. 
      Respond ONLY in ${LANGUAGE_LABELS[lang]} using simple, conversational language.
      
      RULES:
      1. Always address the farmer with respect.
      2. First, offer a natural, zero-budget solution based on Rajiv Dixit's principles.
      3. Then, provide a scientific chemical alternative as a backup.
      4. Use regional farming terms in ${LANGUAGE_LABELS[lang]}.
      5. Agriculture is hard work; be empathetic.`,
    },
  });
};
