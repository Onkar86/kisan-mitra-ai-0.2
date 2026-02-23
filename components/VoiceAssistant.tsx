
import React, { useState, useEffect, useRef } from 'react';
import { getLiveAssistant } from '../services/geminiService';
import { UserProfile, AIProvider } from '../types';

const VoiceAssistant: React.FC<{userProfile: UserProfile}> = ({ userProfile }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [transcripts, setTranscripts] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const speakingTimeoutRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const isGemini = userProfile.aiProvider === AIProvider.GEMINI;

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts, currentInput, currentOutput]);

  useEffect(() => {
    if (isActive) {
      timerIntervalRef.current = window.setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setCallTime(0);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const startSession = async () => {
    setIsConnecting(true);
    setTranscripts([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = getLiveAssistant({
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
        },
        onmessage: async (message: any) => {
          const audioStr = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioStr && audioContextRef.current) {
            setIsAiSpeaking(true);
            const ctx = audioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const buffer = await decodeAudioData(decode(audioStr), ctx);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => {
              sourcesRef.current.delete(source);
              if (sourcesRef.current.size === 0) setIsAiSpeaking(false);
            };
          }

          if (message.serverContent?.inputTranscription) {
            setCurrentInput(prev => prev + message.serverContent.inputTranscription.text);
            setIsUserSpeaking(true);
            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
            speakingTimeoutRef.current = window.setTimeout(() => setIsUserSpeaking(false), 1500);
          }
          if (message.serverContent?.outputTranscription) {
            setCurrentOutput(prev => prev + message.serverContent.outputTranscription.text);
          }

          if (message.serverContent?.turnComplete) {
            setTranscripts(prev => [
              ...prev,
              ...(currentInput ? [{ role: 'user' as const, text: currentInput }] : []),
              ...(currentOutput ? [{ role: 'ai' as const, text: currentOutput }] : [])
            ]);
            setCurrentInput('');
            setCurrentOutput('');
            setIsUserSpeaking(false);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            setIsAiSpeaking(false);
            setCurrentOutput('');
          }
        },
        onerror: (e: any) => {
          console.error("Live Error", e);
          stopSession();
        },
        onclose: () => {
          setIsActive(false);
          setIsAiSpeaking(false);
          setIsUserSpeaking(false);
        },
      }, userProfile.language);

      sessionPromise.then(s => {
        sessionRef.current = s;
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = (e: any) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const int16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
          let binary = '';
          const bytes = new Uint8Array(int16.buffer);
          for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
          const base64 = btoa(binary);
          s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
        };
        source.connect(processor);
        processor.connect(inputCtx.destination);
      });

    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      alert("Microphone access is required.");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
  };

  const quickAsks = [
    "How to make Jeevamrut?",
    "Pests on my wheat crop",
    "Rajiv Dixit's soil tips",
    "Current market rates"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {!isGemini && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-800 text-sm font-medium">
          <span>⚠️</span>
          <p>Voice Assistant currently requires <b>Google Gemini</b>. Please switch your AI Engine in the Profile tab to use this feature.</p>
        </div>
      )}
      {/* Immersive Aura Container */}
      <div className={`flex-1 flex flex-col rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-1000 relative border-4 ${
        isActive 
          ? (isAiSpeaking ? 'bg-green-950 border-lime-500/30' : isUserSpeaking ? 'bg-blue-950 border-blue-500/30' : 'bg-stone-950 border-white/10') 
          : 'bg-white border-stone-100'
      } ${!isGemini ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
        
        {/* Dynamic Background Glow Layer */}
        <div className={`absolute inset-0 transition-opacity duration-1000 blur-[120px] pointer-events-none opacity-40 ${
          isAiSpeaking ? 'bg-lime-500' : isUserSpeaking ? 'bg-blue-500' : 'bg-transparent'
        }`} />

        {/* Call Status Bar */}
        <div className="pt-10 px-10 flex justify-between items-center relative z-20">
          <div className="flex flex-col">
            <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${isActive ? 'text-lime-400' : 'text-stone-400'}`}>
              {isActive ? 'Active Consultation' : 'Expert Offline'}
            </h4>
            {isActive && <span className="text-white/40 font-mono text-sm mt-1">{formatTime(callTime)}</span>}
          </div>
          <div className="flex items-center gap-4">
             <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? 'bg-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.8)]' : 'bg-stone-200'}`} />
          </div>
        </div>

        {/* Central Visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
          <div className="relative">
            {isActive && (
              <>
                <div className={`absolute -inset-24 rounded-full border border-white/5 animate-[ping_3s_linear_infinite] opacity-20`} />
                <div className={`absolute -inset-16 rounded-full border border-white/10 animate-[pulse_2s_ease-in-out_infinite] opacity-30`} />
              </>
            )}
            
            <div className={`w-44 h-44 rounded-full flex items-center justify-center text-7xl shadow-2xl transition-all duration-700 relative z-20 ${
              isActive ? 'bg-white ring-[12px] ring-white/10' : 'bg-stone-50'
            }`}>
              <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {isActive ? (isAiSpeaking ? '👨‍🌾' : isUserSpeaking ? '👂' : '✨') : '💤'}
              </div>
            </div>
          </div>

          <div className="mt-20 w-full max-w-xs h-16 flex items-center justify-center">
            <svg viewBox="0 0 200 60" className="w-full h-full">
              {[...Array(isActive ? 3 : 0)].map((_, i) => (
                <path
                  key={i}
                  d="M0 30 Q 25 10, 50 30 T 100 30 T 150 30 T 200 30"
                  fill="none"
                  stroke={isAiSpeaking ? '#a3e635' : isUserSpeaking ? '#60a5fa' : '#ffffff44'}
                  strokeWidth="2"
                  className={`transition-all duration-500 ${isActive ? 'animate-wave' : ''}`}
                  style={{
                    opacity: 1 - (i * 0.3),
                    animationDelay: `${i * -0.5}s`,
                    transform: `scaleY(${isActive ? (isAiSpeaking || isUserSpeaking ? 1.5 : 0.2) : 0})`
                  }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Real-time Subtitles Area */}
        <div className={`min-h-[140px] px-12 py-10 transition-all duration-500 relative z-20 ${isActive ? 'bg-black/40 text-white' : 'bg-stone-50/80 text-stone-400'}`}>
          <div className="flex flex-col gap-3">
            <p className="text-xl font-bold leading-snug italic line-clamp-2 transition-all">
              {isActive ? (currentOutput || currentInput || 'Go ahead, ask Kisan Mitra anything...') : 'Connect to speak with our AI expert.'}
            </p>
            {isActive && !isAiSpeaking && !isUserSpeaking && !currentInput && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar animate-fadeInUp">
                {quickAsks.map((ask, i) => (
                  <button key={i} className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold whitespace-nowrap hover:bg-white/20 transition-all">
                    {ask}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call Controls */}
        <div className={`p-10 flex justify-center items-center gap-10 relative z-20 transition-all ${isActive ? 'bg-black/60' : 'bg-white'}`}>
          {!isActive ? (
            <button 
              onClick={startSession}
              disabled={isConnecting}
              className="group relative w-28 h-28 bg-green-700 text-white rounded-full transition-all shadow-2xl hover:bg-green-800 hover:scale-105 active:scale-90 disabled:opacity-50"
            >
              <div className="absolute inset-0 rounded-full bg-green-500 animate-[ping_2s_linear_infinite] opacity-20" />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-4xl">{isConnecting ? '⏳' : '🎙️'}</span>
                <p className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">Consult</p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-10">
               <button onClick={stopSession} className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center text-4xl shadow-2xl hover:bg-red-700 transition-all">
                🚨
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: scaleY(1.5) translateX(-20px); }
          50% { transform: scaleY(0.8) translateX(20px); }
          100% { transform: scaleY(1.5) translateX(-20px); }
        }
        .animate-wave { animation: wave 3s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;
