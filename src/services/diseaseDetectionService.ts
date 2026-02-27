import { DiseaseDetectionResult } from '../types';
import { generateAIResponse } from './aiChatService';
import { UserProfile } from '../types';

/**
 * Crop Disease Detection Service
 * Uses AI image recognition to identify crop diseases
 * 
 * Two modes:
 * 1. Local: TensorFlow.js for on-device processing (requires model file)
 * 2. API: Sends image to Google Vision API or similar
 * 
 * For MVP: Using image-to-text analysis with Gemini Vision API
 */

/**
 * Analyze crop disease from image using Gemini Vision API
 */
export async function detectCropDiseaseFromImage(
  imageFile: File,
  userProfile: UserProfile
): Promise<DiseaseDetectionResult | null> {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    const imageData = base64Image.split(',')[1]; // Remove data:image/jpeg;base64, prefix

    // Call Gemini Vision API
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
                  inline_data: {
                    mime_type: imageFile.type || 'image/jpeg',
                    data: imageData,
                  },
                },
                {
                  text: `Analyze this crop/plant image and identify:
1. Disease or problem (if any)
2. Affected area percentage (0-100%)
3. Disease stage (early/moderate/severe)
4. Crop type visible
5. Immediate actions to take
6. Prevention measures
7. Recommended chemical treatment
8. Recommended organic treatment

Format response as JSON:
{
  "disease": "disease name or 'healthy'",
  "confidence": 0.95,
  "affectedArea": "estimate %",
  "stage": "early/moderate/severe",
  "cropType": "crop name",
  "immediateActions": ["action1", "action2"],
  "preventiveMeasures": ["measure1", "measure2"],
  "chemicalTreatment": "product and dosage",
  "organicTreatment": "organic solution"
}

Be specific and practical for Indian farmers.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 20,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini Vision API error:', error);
      return null;
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not parse disease detection response');
      return null;
    }

    const detectionData = JSON.parse(jsonMatch[0]);

    const result: DiseaseDetectionResult = {
      disease: detectionData.disease || 'Unknown',
      confidence: detectionData.confidence || 0.8,
      affectedArea: detectionData.affectedArea || '0%',
      stage: detectionData.stage || 'moderate',
      cropType: detectionData.cropType || userProfile.crops?.[0] || 'Unknown',
      image: base64Image,
      immediateActions: detectionData.immediateActions || [],
      preventiveMeasures: detectionData.preventiveMeasures || [],
      chemicalTreatment: detectionData.chemicalTreatment,
      organicTreatment: detectionData.organicTreatment,
    };

    return result;
  } catch (error) {
    console.error('Error detecting crop disease:', error);
    return null;
  }
}

/**
 * Convert File to Base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generate detailed disease solution using AI
 */
export async function generateDiseaseSolution(
  detection: DiseaseDetectionResult,
  userProfile: UserProfile
): Promise<string> {
  const prompt = `
🌾 CROP DISEASE ANALYSIS

Detected Disease: ${detection.disease}
Crop: ${detection.cropType}
Confidence: ${(detection.confidence * 100).toFixed(1)}%
Affected Area: ${detection.affectedArea}
Severity: ${detection.stage}

${userProfile.crops ? `Farmer's crops: ${userProfile.crops.join(', ')}` : ''}
${userProfile.farmingMode ? `Farming preference: ${userProfile.farmingMode}` : ''}

Please provide:
1. Detailed explanation of the disease
2. Immediate action steps (within 24 hours)
3. Step-by-step treatment process
4. Chemical treatment with products available in Indian markets
5. Organic/natural treatment alternatives
6. Prevention for future crops
7. When to contact agricultural officer
8. Expected recovery timeline

Make it practical for a rural Indian farmer.`;

  const response = await generateAIResponse(prompt, userProfile);
  return response.content;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please upload an image file' };
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload JPEG, PNG, or WebP image',
    };
  }

  return { valid: true };
}

/**
 * Create thumbnail from image for display
 */
export function createImageThumbnail(
  base64Image: string,
  maxWidth: number = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = reject;
    img.src = base64Image;
  });
}

/**
 * Cache detection results locally
 */
export function cacheDetectionResult(
  result: DiseaseDetectionResult & { id: string }
): void {
  try {
    const cached = localStorage.getItem('diseaseDetections') || '[]';
    const detections = JSON.parse(cached) as any[];
    detections.unshift(result);
    // Keep only last 10 detections
    if (detections.length > 10) {
      detections.pop();
    }
    localStorage.setItem('diseaseDetections', JSON.stringify(detections));
  } catch (error) {
    console.warn('Could not cache detection result:', error);
  }
}

/**
 * Get cached detection results
 */
export function getCachedDetections(): (DiseaseDetectionResult & {
  id: string;
})[] {
  try {
    const cached = localStorage.getItem('diseaseDetections');
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.warn('Could not retrieve cached detections:', error);
    return [];
  }
}
