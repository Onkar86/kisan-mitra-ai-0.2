import React, { useState, useRef } from 'react';
import { SupportedLanguage } from '../types';

interface VoiceInputProps {
  language: SupportedLanguage;
  onTranscript: (text: string) => void;
}

// Map of supported languages to Web Speech API language codes
const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  pa: 'pa-IN',
  gu: 'gu-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
  ml: 'ml-IN',
  or: 'or-IN',
};

export default function VoiceInput({ language, onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    // Use Web Speech API (works in Chrome, Edge, Safari)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = LANGUAGE_CODES[language] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          setTranscript(transcript);
          onTranscript(transcript);
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech detected. Please try again.',
        'network': 'Network error. Please check your connection.',
        'audio-capture': 'No microphone found.',
        'not-allowed': 'Microphone permission denied.',
      };

      const message = errorMessages[event.error] || `Error: ${event.error}`;
      console.error(message);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`w-full py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
        isListening
          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
          : 'bg-lime-500 hover:bg-lime-600 text-white'
      }`}
      title="Click to use voice input (works best in Chrome, Edge, Safari)"
    >
      <span>{isListening ? '🎙️ Listening...' : '🎤 Voice Input'}</span>
      {isListening && transcript && <span className="text-xs">"{transcript.slice(0, 20)}..."</span>}
    </button>
  );
}
