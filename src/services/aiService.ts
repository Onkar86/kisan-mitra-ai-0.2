
import { AIProvider, DiagnosisResult, Recommendation, SupportedLanguage, UserProfile } from "../types";
import { analyzeCropImage, getFarmerAdviceWithGrounding, getQuickAgriTip } from "./geminiService";
import { analyzeCropImageOpenAI, getFarmerAdviceOpenAI, getQuickAgriTipOpenAI } from "./openaiService";

export const analyzeCropImageUnified = async (
  base64Image: string, 
  profile: UserProfile
): Promise<DiagnosisResult> => {
  if (profile.aiProvider === AIProvider.OPENAI) {
    return analyzeCropImageOpenAI(base64Image, profile.language);
  }
  return analyzeCropImage(base64Image, profile.language);
};

export const getFarmerAdviceUnified = async (
  query: string, 
  profile: UserProfile
): Promise<Recommendation> => {
  if (profile.aiProvider === AIProvider.OPENAI) {
    return getFarmerAdviceOpenAI(query, profile.address, profile.language);
  }
  return getFarmerAdviceWithGrounding(query, profile.address, profile.language);
};

export const getQuickAgriTipUnified = async (
  profile: UserProfile
): Promise<string> => {
  if (profile.aiProvider === AIProvider.OPENAI) {
    return getQuickAgriTipOpenAI(profile.language);
  }
  return getQuickAgriTip(profile.language);
};
