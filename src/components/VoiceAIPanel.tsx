import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Volume2, 
  CheckCircle2, 
  AlertCircle,
  Compass
} from 'lucide-react';
import { AICommandResult, MapRegion, POI } from '../types';
import { parseAICommand } from '../ai/commandParser';
import { voiceEngine } from '../voice/voiceGuidance';

type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

interface VoiceAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion: MapRegion;
  savedLocations: POI[];
  onExecuteCommand: (result: AICommandResult) => void;
}

export const VoiceAIPanel: React.FC<VoiceAIPanelProps> = ({
  isOpen,
  onClose,
  activeRegion,
  savedLocations,
  onExecuteCommand,
}) => {
  const [inputText, setInputText] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [lastResult, setLastResult] = useState<AICommandResult | null>(null);

  if (!isOpen) return null;

  const demoCommands = [
    'Navigate to College',
    'Take me Home',
    'Start Navigation',
    'Cancel Navigation',
    "What's my ETA?",
    'Show saved places',
  ];

  const handleProcessInput = (text: string) => {
    if (!text.trim()) return;

    setVoiceState('PROCESSING');

    setTimeout(() => {
      const result = parseAICommand(text, activeRegion, savedLocations);
      setLastResult(result);

      if (result.intent === 'UNKNOWN') {
        setVoiceState('ERROR');
        voiceEngine.speak("Couldn't understand that. Try saying: Navigate to College.", true);
      } else {
        setVoiceState('SUCCESS');
        voiceEngine.speak(result.responseVoiceText, true);

        // Auto execute after confirmation
        setTimeout(() => {
          onExecuteCommand(result);
        }, 900);
      }
    }, 450);
  };

  const handleToggleVoice = () => {
    if (voiceState === 'LISTENING') {
      voiceEngine.stopListening();
      setVoiceState('IDLE');
    } else {
      setVoiceState('LISTENING');
      const started = voiceEngine.startListening(
        (transcript) => {
          setInputText(transcript);
          handleProcessInput(transcript);
        },
        () => setVoiceState('IDLE')
      );

      if (!started) {
        // Fallback simulation if speech recognition is not supported/granted in web browser
        setTimeout(() => {
          const sample = 'Navigate to College';
          setInputText(sample);
          handleProcessInput(sample);
        }, 1500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111315] border border-[#2B2F33] rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2B2F33] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFD400]/15 text-[#FFD400]">
              <Compass size={17} />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#F5F7F8] font-display">
                Voice Interaction
              </span>
              <p className="text-[10px] text-[#A4A9AE]">Hands-free Navigation Commands</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#191C1F] hover:bg-[#22262A] text-[#A4A9AE] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Voice Visualizer Area */}
        <div className="flex flex-col items-center justify-center py-6 bg-[#191C1F] rounded-2xl border border-[#2B2F33] space-y-3 relative overflow-hidden">
          <button
            onClick={handleToggleVoice}
            className={`w-18 h-18 rounded-full flex items-center justify-center transition-all ${
              voiceState === 'LISTENING'
                ? 'bg-[#FFD400] text-black shadow-[0_0_35px_rgba(255,212,0,0.4)] scale-110 animate-pulse'
                : voiceState === 'PROCESSING'
                ? 'bg-[#F59E0B] text-black animate-spin'
                : voiceState === 'SUCCESS'
                ? 'bg-[#22C55E] text-black shadow-[0_0_25px_rgba(34,197,94,0.4)]'
                : voiceState === 'ERROR'
                ? 'bg-[#EF4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'bg-[#22262A] hover:bg-[#FFD400]/20 text-[#F5F7F8] hover:text-[#FFD400] border border-[#2B2F33]'
            }`}
          >
            {voiceState === 'LISTENING' ? (
              <Mic size={30} />
            ) : voiceState === 'SUCCESS' ? (
              <CheckCircle2 size={30} />
            ) : voiceState === 'ERROR' ? (
              <AlertCircle size={30} />
            ) : (
              <MicOff size={28} />
            )}
          </button>

          {/* Voice State Title */}
          <div className="text-center font-display">
            <span className="text-xs font-bold text-[#F5F7F8] tracking-wide block">
              {voiceState === 'IDLE' && 'Tap to speak'}
              {voiceState === 'LISTENING' && 'Listening...'}
              {voiceState === 'PROCESSING' && 'Understanding...'}
              {voiceState === 'SUCCESS' && (lastResult?.destinationName ? `Navigating to ${lastResult.destinationName}` : 'Command Confirmed')}
              {voiceState === 'ERROR' && "Couldn't understand that"}
            </span>
            <span className="text-[10px] text-[#A4A9AE]">
              {voiceState === 'LISTENING' ? 'Speak a navigation destination or command' : 'Tap microphone to start voice input'}
            </span>
          </div>

          {/* Waveform Bars during Listening */}
          {voiceState === 'LISTENING' && (
            <div className="flex items-center gap-1 pt-1">
              {[35, 70, 95, 55, 85, 40, 75, 50].map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height * 0.25}px` }}
                  className="w-1 bg-[#FFD400] rounded-full animate-pulse"
                />
              ))}
            </div>
          )}
        </div>

        {/* Text Input Fallback */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type navigation command (e.g. Navigate to College)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleProcessInput(inputText);
            }}
            className="flex-1 bg-[#191C1F] border border-[#2B2F33] focus:border-[#FFD400] rounded-2xl px-4 py-2.5 text-xs text-[#F5F7F8] placeholder-[#6F757B] focus:outline-none"
          />

          <button
            onClick={() => handleProcessInput(inputText)}
            className="px-4 rounded-2xl bg-[#FFD400] text-black font-bold flex items-center justify-center hover:bg-[#e6bf00] transition-colors"
          >
            <Send size={15} />
          </button>
        </div>

        {/* Supported Demo Commands Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-[#A4A9AE] tracking-wider font-display">
            Supported Commands:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {demoCommands.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(prompt);
                  handleProcessInput(prompt);
                }}
                className="px-2.5 py-1 rounded-full bg-[#191C1F] hover:bg-[#FFD400]/20 text-[#A4A9AE] hover:text-[#FFD400] border border-[#2B2F33] text-[11px] font-medium transition-all"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Confirmed Command Result */}
        {lastResult && voiceState === 'SUCCESS' && (
          <div className="p-3 rounded-2xl bg-[#191C1F] border border-[#2B2F33] space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A4A9AE]">Intent:</span>
              <span className="font-mono font-bold text-[#FFD400] px-2 py-0.5 rounded bg-[#22262A] border border-[#2B2F33]">
                {lastResult.intent}
              </span>
            </div>

            {lastResult.destinationName && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A4A9AE]">Destination:</span>
                <span className="font-bold text-[#F5F7F8]">{lastResult.destinationName}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#2B2F33] text-xs text-[#A4A9AE] italic">
              <Volume2 size={13} className="text-[#FFD400] flex-shrink-0" />
              <span>"{lastResult.responseVoiceText}"</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
