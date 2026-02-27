import React, { useState } from 'react';
import { UserProfile, DiseaseDetectionResult } from '../types';
import {
  detectCropDiseaseFromImage,
  validateImageFile,
  generateDiseaseSolution,
  createImageThumbnail,
  cacheDetectionResult,
} from '../services/diseaseDetectionService';

interface CropImageUploadProps {
  userProfile: UserProfile;
  onDetectionComplete?: (result: DiseaseDetectionResult) => void;
}

export default function CropImageUpload({
  userProfile,
  onDetectionComplete,
}: CropImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] =
    useState<DiseaseDetectionResult | null>(null);
  const [solution, setSolution] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedImage(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = e => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError('');

    try {
      // Detect disease
      const result = await detectCropDiseaseFromImage(
        selectedImage,
        userProfile
      );

      if (!result) {
        setError(
          'Could not analyze image. Please try another image or contact support.'
        );
        setIsAnalyzing(false);
        return;
      }

      setDetectionResult(result);

      // Generate detailed solution
      const solutionText = await generateDiseaseSolution(result, userProfile);
      setSolution(solutionText);

      // Cache result
      cacheDetectionResult({
        ...result,
        id: Date.now().toString(),
      });

      // Callback
      if (onDetectionComplete) {
        onDetectionComplete(result);
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Error analyzing image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDetectionResult(null);
    setSolution('');
    setError('');
  };

  if (detectionResult) {
    return (
      <div className="space-y-6">
        {/* Results */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📊 Detection Results
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded">
              <p className="text-xs text-gray-600 font-semibold">Disease</p>
              <p className="text-lg font-bold text-gray-800">
                {detectionResult.disease}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-xs text-gray-600 font-semibold">Confidence</p>
              <p className="text-lg font-bold text-gray-800">
                {(detectionResult.confidence * 100).toFixed(0)}%
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-xs text-gray-600 font-semibold">Severity</p>
              <p className="text-lg font-bold text-gray-800 capitalize">
                {detectionResult.stage}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-xs text-gray-600 font-semibold">Affected</p>
              <p className="text-lg font-bold text-gray-800">
                {detectionResult.affectedArea}
              </p>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-6">
              <img
                src={imagePreview}
                alt="Analyzed crop"
                className="max-w-xs rounded-lg shadow"
              />
            </div>
          )}

          {/* Immediate Actions */}
          {detectionResult.immediateActions.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
              <h3 className="font-bold text-red-900 mb-2">
                🔴 Immediate Actions (Next 24 Hours)
              </h3>
              <ul className="space-y-1">
                {detectionResult.immediateActions.map((action, idx) => (
                  <li key={idx} className="text-sm text-red-800">
                    • {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Treatments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {detectionResult.chemicalTreatment && (
              <div className="bg-amber-50 border border-amber-200 rounded p-4">
                <h3 className="font-bold text-amber-900 mb-2">⚗️ Chemical</h3>
                <p className="text-sm text-amber-800">
                  {detectionResult.chemicalTreatment}
                </p>
              </div>
            )}
            {detectionResult.organicTreatment && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-bold text-green-900 mb-2">
                  🌿 Organic
                </h3>
                <p className="text-sm text-green-800">
                  {detectionResult.organicTreatment}
                </p>
              </div>
            )}
          </div>

          {/* Full Solution */}
          {solution && (
            <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
              <h3 className="font-bold text-gray-800 mb-3">
                📋 Detailed Solution
              </h3>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {solution}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            ← Analyze Another Image
          </button>
          <button
            onClick={() => {
              // TODO: Share results or save report
              alert('Feature coming soon!');
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            💾 Save Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📸 Crop Disease Detection
        </h2>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="imageInput"
          />
          <label htmlFor="imageInput" className="cursor-pointer">
            {imagePreview ? (
              <div>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded mb-4"
                />
                <p className="text-sm text-gray-600">
                  Click to change image
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-2">🌾</div>
                <p className="text-lg font-bold text-gray-700 mb-2">
                  Click to upload or drag image
                </p>
                <p className="text-sm text-gray-500">
                  JPEG, PNG, WebP • Up to 5MB
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-800 text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 For Best Results:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Take a clear photo of affected leaf/plant area</li>
            <li>• Include both healthy and diseased parts</li>
            <li>• Shoot in good lighting (avoid shadows)</li>
            <li>• One crop per image</li>
            <li>• Show signs clearly (spots, discoloration, wilting)</li>
          </ul>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!selectedImage || isAnalyzing}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing Image...
            </>
          ) : (
            <>🔍 Analyze Crop Image</>
          )}
        </button>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-6">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ Important:</strong> This is an AI-assisted diagnosis.
            For serious crop issues, consult your local agricultural officer.
            AI confidence below 70% should be verified by experts.
          </p>
        </div>
      </div>
    </div>
  );
}
