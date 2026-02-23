
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DIAGNOSTIC = 'DIAGNOSTIC',
  ADVISOR = 'ADVISOR',
  RAJIV_WISDOM = 'RAJIV_WISDOM',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE',
  LIVE_VOICE = 'LIVE_VOICE'
}

export enum AIProvider {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI'
}

export type SupportedLanguage = 'hi' | 'mr' | 'pa' | 'gu' | 'ta' | 'te' | 'kn' | 'bn' | 'ml' | 'or' | 'en';

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  hi: 'Hindi - हिंदी',
  mr: 'Marathi - मराठी',
  pa: 'Punjabi - ਪੰਜਾਬੀ',
  gu: 'Gujarati - ગુજરાતી',
  ta: 'Tamil - தமிழ்',
  te: 'Telugu - తెలుగు',
  kn: 'Kannada - ಕನ್ನಡ',
  bn: 'Bengali - বাংলা',
  ml: 'Malayalam - മലയാളം',
  or: 'Odia - ଓਡੜੀଆ',
  en: 'English'
};

export interface UserProfile {
  name: string;
  address: string;
  mobile: string;
  farmSize: string;
  crops: string;
  language: SupportedLanguage;
  aiProvider: AIProvider;
  isLoggedIn: boolean;
  onboarded: boolean;
  syncEnabled: boolean;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface Recommendation {
  issue: string;
  chemicalSolution: {
    product: string;
    dosage: string;
    precautions: string;
  };
  naturalSolution: {
    name: string;
    preparation: string;
    benefits: string;
    philosophy: string;
  };
  groundingSources?: GroundingSource[];
}

export interface SoilMetric {
  name: string;
  value: number;
  unit: string;
  status: 'Good' | 'Fair' | 'Critical';
}

export interface DiagnosisResult {
  id: string;
  timestamp: number;
  image?: string;
  disease: string;
  confidence: number;
  description: string;
  solutions: Recommendation;
}

export interface AppNotification {
  id: string;
  type: 'weather' | 'pest' | 'market';
  title: string;
  message: string;
  time: number;
}
