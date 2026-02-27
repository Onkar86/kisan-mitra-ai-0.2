
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DIAGNOSTIC = 'DIAGNOSTIC',
  ADVISOR = 'ADVISOR',
  RAJIV_WISDOM = 'RAJIV_WISDOM',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE',
  LIVE_VOICE = 'LIVE_VOICE',
  FARM_AI_CHAT = 'FARM_AI_CHAT',
  EMERGENCY_HELP = 'EMERGENCY_HELP',
  IMAGE_UPLOAD = 'IMAGE_UPLOAD',
  OFFICER_DIRECTORY = 'OFFICER_DIRECTORY'
}

export enum AIProvider {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI'
}

export enum FarmingMode {
  ORGANIC_ONLY = 'ORGANIC_ONLY',
  CHEMICAL = 'CHEMICAL',
  BOTH = 'BOTH'
}

export type SoilType = 'black' | 'red' | 'sandy' | 'loamy' | 'clay' | 'mixed';

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
  uid?: string;
  name: string;
  email?: string;
  phone?: string;
  photoURL?: string;
  address: string;
  farmSize: number;
  crops: string[];
  language: SupportedLanguage;
  aiProvider: AIProvider;
  onboarded: boolean;
  createdAt?: string;
  updatedAt?: string;
  // New farm-specific data
  farmingMode?: FarmingMode;
  soilType?: SoilType;
  district?: string;
  state?: string;
  currentFertilizers?: string[];
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'ai';
  content: string;
  language: SupportedLanguage;
  timestamp?: string;
  farmingMode?: FarmingMode;
  cropContext?: string;
}

export interface ChatSession {
  id?: string;
  userId?: string;
  messages: ChatMessage[];
  language: SupportedLanguage;
  createdAt?: string;
  updatedAt?: string;
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
  timestamp?: string | number;
  image?: string;
  disease: string;
  confidence: number;
  description: string;
  solutions: Recommendation;
}

export interface AppNotification {
  id: string;
  type: 'weather' | 'pest' | 'market' | 'emergency';
  title: string;
  message: string;
  time: number;
  severity?: 'low' | 'medium' | 'high';
}

// Weather & Climate
export interface WeatherData {
  temperature: number; // Celsius
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall?: number;
  feelsLike?: number;
  uvIndex?: number;
  advice?: string;
}

// Disease Detection
export interface DiseaseDetectionResult {
  disease: string;
  confidence: number;
  affectedArea: string;
  stage: 'early' | 'moderate' | 'severe';
  cropType: string;
  image?: string;
  immediateActions: string[];
  preventiveMeasures: string[];
  chemicalTreatment?: string;
  organicTreatment?: string;
}

// Agricultural Officer
export interface AgriculturalOfficer {
  id: string;
  name: string;
  designation: string;
  phone: string;
  email?: string;
  office: string;
  district: string;
  state: string;
  expertise: string[]; // crop types they specialize in
  languages: SupportedLanguage[];
  availability?: 'available' | 'offline' | 'busy';
  ratings?: number;
}

// Offline Data
export interface OfflineData {
  lastSync: string;
  chatHistory: ChatMessage[];
  savedArticles: string[];
  officers: AgriculturalOfficer[];
  weatherCache: WeatherData;
}

