
import OpenAI from "openai";
import { DiagnosisResult, Recommendation, SupportedLanguage, LANGUAGE_LABELS } from "../types";

let openaiInstance: OpenAI | null = null;

const getOpenAI = () => {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key is not set. Please set OPENAI_API_KEY in your environment.");
    }
    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return openaiInstance;
};

const SYSTEM_PROMPT = `You are 'Kisan Mitra', a professional agricultural advisor. 
Provide dual solutions:
1. Modern Scientific (Chemical): Product name, dosage, and precautions.
2. Rajiv Dixit Natural: Preparation method, benefits, and philosophy.

Always respond in the requested language.`;

const DIAGNOSIS_JSON_SCHEMA = {
  type: "object",
  properties: {
    disease: { type: "string" },
    confidence: { type: "number" },
    description: { type: "string" },
    solutions: {
      type: "object",
      properties: {
        issue: { type: "string" },
        chemicalSolution: {
          type: "object",
          properties: {
            product: { type: "string" },
            dosage: { type: "string" },
            precautions: { type: "string" }
          },
          required: ["product", "dosage", "precautions"]
        },
        naturalSolution: {
          type: "object",
          properties: {
            name: { type: "string" },
            preparation: { type: "string" },
            benefits: { type: "string" },
            philosophy: { type: "string" }
          },
          required: ["name", "preparation", "benefits", "philosophy"]
        }
      },
      required: ["issue", "chemicalSolution", "naturalSolution"]
    }
  },
  required: ["disease", "confidence", "description", "solutions"]
};

export const analyzeCropImageOpenAI = async (base64Image: string, lang: SupportedLanguage = 'en'): Promise<DiagnosisResult> => {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: `Diagnose this crop disease. Provide solutions in JSON format. Language: ${LANGUAGE_LABELS[lang]}.` },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || "{}");
};

export const getFarmerAdviceOpenAI = async (query: string, location: string, lang: SupportedLanguage = 'en'): Promise<Recommendation> => {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Farmer Question: "${query}" in "${location || 'India'}". Provide chemical and natural solutions in JSON. Language: ${LANGUAGE_LABELS[lang]}.` }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  const result = JSON.parse(content || "{}");
  // If the model returns the whole diagnosis object, extract solutions
  return result.solutions || result;
};

export const getQuickAgriTipOpenAI = async (lang: SupportedLanguage = 'en'): Promise<string> => {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional agronomist. Give a 1-sentence quick tip." },
      { role: "user", content: `Give a 1-sentence quick professional tip for soil moisture conservation today in ${LANGUAGE_LABELS[lang]}.` }
    ]
  });

  return response.choices[0].message.content || "Keep your soil mulched!";
};
