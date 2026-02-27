import React, { useState, useEffect } from 'react';
import { UserProfile, SupportedLanguage } from '../types';
import {
  searchOfficers,
  getTopRatedOfficers,
  formatOfficerInfo,
  getCachedOfficers,
  AGRICULTURAL_OFFICERS,
} from '../services/officerDirectory';

interface OfficerDirectoryProps {
  userProfile: UserProfile;
}

export default function OfficerDirectory({ userProfile }: OfficerDirectoryProps) {
  const [searchCrop, setSearchCrop] = useState('');
  const [searchDistrict, setSearchDistrict] = useState(
    userProfile.district || ''
  );
  const [searchLanguage, setSearchLanguage] = useState<SupportedLanguage>(
    userProfile.language || 'en'
  );
  const [results, setResults] = useState(getTopRatedOfficers(5));
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);
  const [searchMode, setSearchMode] = useState<'quick' | 'advanced'>('quick');

  const uniqueDistricts = Array.from(
    new Set(AGRICULTURAL_OFFICERS.map(o => o.district))
  ).sort();

  const handleSearch = () => {
    const searchResults = searchOfficers({
      district: searchDistrict || undefined,
      crop: searchCrop || undefined,
      language: searchLanguage,
    });

    setResults(searchResults.length > 0 ? searchResults : getTopRatedOfficers(5));
  };

  const handleReset = () => {
    setSearchCrop('');
    setSearchDistrict(userProfile.district || '');
    setResults(getTopRatedOfficers(5));
    setSelectedOfficer(null);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  if (selectedOfficer) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setSelectedOfficer(null)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-semibold"
        >
          ← Back to Search
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {selectedOfficer.name}
              </h2>
              <p className="text-lg text-green-600 font-semibold">
                {selectedOfficer.designation}
              </p>
            </div>

            {selectedOfficer.ratings && (
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span className="font-bold text-gray-800">
                  {selectedOfficer.ratings}/5
                </span>
                <span className="text-gray-500 text-sm">
                  ({selectedOfficer.ratings > 4.5 ? 'Highly Rated' : selectedOfficer.ratings > 4 ? 'Well Rated' : 'Rated'})
                </span>
              </div>
            )}

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-900 mb-3">Contact</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleCall(selectedOfficer.phone)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                >
                  📱 {selectedOfficer.phone}
                </button>
                {selectedOfficer.email && (
                  <button
                    onClick={() => handleEmail(selectedOfficer.email)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                  >
                    📧 {selectedOfficer.email}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Office Location</h3>
              <p className="text-gray-700 mb-1">🏛️ {selectedOfficer.office}</p>
              <p className="text-gray-600">
                📍 {selectedOfficer.district}, {selectedOfficer.state}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">
                🌾 Expertise Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedOfficer.expertise.map((crop: string) => (
                  <span
                    key={crop}
                    className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">
                🌍 Languages Spoken
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedOfficer.languages.map((lang: string) => (
                  <span
                    key={lang}
                    className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm"
                  >
                    {lang === 'hi'
                      ? 'हिंदी'
                      : lang === 'mr'
                        ? 'मराठी'
                        : lang === 'en'
                          ? 'English'
                          : lang}
                  </span>
                ))}
              </div>
            </div>

            {selectedOfficer.availability && (
              <div className="bg-lime-50 p-4 rounded-lg">
                <p className="text-sm">
                  <span className="font-bold text-lime-900">Status:</span>
                  <span
                    className={`ml-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      selectedOfficer.availability === 'available'
                        ? 'bg-green-200 text-green-900'
                        : 'bg-yellow-200 text-yellow-900'
                    }`}
                  >
                    {selectedOfficer.availability === 'available'
                      ? '✅ Available'
                      : '⏳ Checking...'}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          👨‍🌾 Agricultural Officer Directory
        </h2>

        {/* Search Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSearchMode('quick')}
            className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${
              searchMode === 'quick'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quick Search
          </button>
          <button
            onClick={() => setSearchMode('advanced')}
            className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${
              searchMode === 'advanced'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Advanced Search
          </button>
        </div>

        {/* Search Form */}
        <div className="space-y-4">
          {/* District Search */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              District
            </label>
            <select
              value={searchDistrict}
              onChange={e => setSearchDistrict(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Districts</option>
              {uniqueDistricts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Search (Advanced) */}
          {searchMode === 'advanced' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Crop/Specialty
              </label>
              <input
                type="text"
                value={searchCrop}
                onChange={e => setSearchCrop(e.target.value)}
                placeholder="e.g., wheat, rice, cotton, vegetables..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Language Search (Advanced) */}
          {searchMode === 'advanced' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Preferred Language
              </label>
              <select
                value={searchLanguage}
                onChange={e => setSearchLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
              </select>
            </div>
          )}

          {/* Search Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              🔍 Search
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          {results.length} Officer(s) Found
        </h3>

        {results.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-6 text-center">
            <p className="text-yellow-800">
              No officers found matching your search. Try broader search filters.
            </p>
          </div>
        ) : (
          results.map(officer => (
            <div
              key={officer.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-pointer border-l-4 border-green-600"
              onClick={() => setSelectedOfficer(officer)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {officer.name}
                  </h3>
                  <p className="text-green-600 font-semibold text-sm">
                    {officer.designation}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    📍 {officer.district}, {officer.state}
                  </p>

                  {/* Quick Info */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {officer.ratings && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                        ⭐ {officer.ratings}/5
                      </span>
                    )}
                    {officer.expertise.slice(0, 2).map(crop => (
                      <span
                        key={crop}
                        className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                      >
                        {crop}
                      </span>
                    ))}
                    {officer.expertise.length > 2 && (
                      <span className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                        +{officer.expertise.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-gray-400 text-xl">→</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
