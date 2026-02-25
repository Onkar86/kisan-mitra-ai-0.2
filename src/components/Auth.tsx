import React, { useState } from 'react';
import { signInWithGoogle } from '../services/firebaseService';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-950 to-black flex flex-col items-center justify-center gap-8 p-6">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black text-lime-400 tracking-[0.3em] uppercase">
          Kisan Mitra AI
        </h1>
        <p className="text-white/60 text-sm mt-2 tracking-widest">SMART FARMER ASSISTANT</p>
        <p className="text-white/40 text-xs mt-1">By Onkar Mahamuni</p>
      </div>

      {/* Card Container */}
      <div className="bg-white/5 backdrop-blur-md border border-lime-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-white text-2xl font-bold mb-2 text-center">Welcome to the Farm</h2>
        <p className="text-white/60 text-center text-sm mb-8">
          Sign in to access your personalized farming AI assistant and save your data securely.
        </p>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white hover:bg-white/90 disabled:bg-white/50 text-gray-900 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Info Text */}
        <p className="text-white/40 text-xs mt-6 text-center leading-relaxed">
          ✓ One-click sign in with your Google account
          <br />
          ✓ Your data is saved securely in the cloud
          <br />
          ✓ Access from any device
          <br />
          ✓ 100% Free - No credit card needed
        </p>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-md mt-8 grid grid-cols-3 gap-4">
        <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🤖</div>
          <p className="text-white/70 text-xs font-semibold">AI Diagnosis</p>
        </div>
        <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">💾</div>
          <p className="text-white/70 text-xs font-semibold">Cloud Storage</p>
        </div>
        <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🌍</div>
          <p className="text-white/70 text-xs font-semibold">Multi-Device</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
