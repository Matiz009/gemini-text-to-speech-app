import React, { useState } from 'react';
import {
  MessageSquare,
  Radio,
  HeartHandshake,
  BookOpen,
  Sparkles,
  Bot,
  Feather,
  Zap,
  Sliders,
  RotateCcw,
  Sparkle,
  Mic,
} from 'lucide-react';
import { VoiceStyle, SpeechEngineMode } from '../types';
import { VOICE_STYLES, NEURAL_VOICES } from '../data/styles';

interface VoiceStyleSelectorProps {
  selectedStyle: VoiceStyle;
  onSelectStyle: (style: VoiceStyle) => void;
  // Sliders
  rate: number;
  pitch: number;
  volume: number;
  onRateChange: (rate: number) => void;
  onPitchChange: (pitch: number) => void;
  onVolumeChange: (volume: number) => void;
  onResetTuning: () => void;
  // Specific voice dropdown
  engineMode: SpeechEngineMode;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelectVoice: (voice: SpeechSynthesisVoice | null) => void;
  // Neural AI Voice selection
  selectedNeuralVoice: string;
  onSelectNeuralVoice: (voiceName: string) => void;
}

export const VoiceStyleSelector: React.FC<VoiceStyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  rate,
  pitch,
  volume,
  onRateChange,
  onPitchChange,
  onVolumeChange,
  onResetTuning,
  engineMode,
  availableVoices,
  selectedVoice,
  onSelectVoice,
  selectedNeuralVoice,
  onSelectNeuralVoice,
}) => {
  const [showAdvancedTuning, setShowAdvancedTuning] = useState(false);

  // Icon map
  const renderIcon = (name: string, isSelected: boolean) => {
    const className = `w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`;
    switch (name) {
      case 'Radio':
        return <Radio className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Bot':
        return <Bot className={className} />;
      case 'Feather':
        return <Feather className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      default:
        return <MessageSquare className={className} />;
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5 shadow-lg">
      {/* Header with Title and Mode */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Voice Style & Expressiveness</span>
            <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300">
              {engineMode === 'offline' ? 'Offline Engine' : 'AI Neural Engine'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select an acoustic delivery profile or customize pitch and cadence
          </p>
        </div>

        <button
          id="btn-toggle-tuning"
          onClick={() => setShowAdvancedTuning(!showAdvancedTuning)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            showAdvancedTuning
              ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvancedTuning ? 'Hide Sliders' : 'Fine Tune'}</span>
        </button>
      </div>

      {/* Voice Styles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {VOICE_STYLES.map((style) => {
          const isSelected = selectedStyle.id === style.id;
          return (
            <button
              key={style.id}
              id={`btn-style-${style.id}`}
              onClick={() => onSelectStyle(style)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/50'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600/30' : 'bg-slate-800/60'
                  }`}
                >
                  {renderIcon(style.iconName, isSelected)}
                </div>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {style.badge}
                </span>
              </div>
              <span
                className={`text-xs font-semibold truncate ${
                  isSelected ? 'text-white' : 'text-slate-200'
                }`}
              >
                {style.name}
              </span>
              <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {style.tagline}
              </span>
            </button>
          );
        })}
      </div>

      {/* Specific Voice Selection row */}
      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Device Voice Selector (Offline Mode) */}
        {engineMode === 'offline' ? (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-indigo-400" />
                <span>Installed System Voice</span>
              </span>
              <span className="text-[11px] text-slate-500">
                {availableVoices.length} available
              </span>
            </label>
            <select
              id="select-system-voice"
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = availableVoices.find((v) => v.name === e.target.value) || null;
                onSelectVoice(voice);
              }}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            >
              <option value="">Auto-select optimal voice for language</option>
              {availableVoices.map((v) => (
                <option key={`${v.name}-${v.lang}`} value={v.name}>
                  {v.name} ({v.lang}){v.localService ? ' • Offline' : ''}
                </option>
              ))}
            </select>
          </div>
        ) : (
          /* Neural Voice Selection (Online AI Mode) */
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gemini Neural Voice</span>
              </span>
              <span className="text-[11px] text-slate-500">24kHz Studio</span>
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {NEURAL_VOICES.map((nv) => {
                const isSelected = selectedNeuralVoice === nv.id;
                return (
                  <button
                    key={nv.id}
                    id={`btn-neural-voice-${nv.id}`}
                    onClick={() => onSelectNeuralVoice(nv.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {nv.name}{' '}
                    <span className="opacity-70 text-[10px]">
                      ({nv.gender === 'female' ? 'F' : 'M'})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Current style description */}
        <div className="flex flex-col justify-center bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-white">{selectedStyle.name}</span>:{' '}
            {selectedStyle.description}
          </div>
          <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
            <span>Rate: {rate.toFixed(2)}x</span>
            <span>•</span>
            <span>Pitch: {pitch.toFixed(2)}x</span>
            <span>•</span>
            <span>Vol: {Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Advanced Fine Tuning Sliders (expandable) */}
      {showAdvancedTuning && (
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-semibold text-slate-200">
              Precision Acoustic Controls
            </span>
            <button
              id="btn-reset-tuning"
              onClick={onResetTuning}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Style Preset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Speed / Rate */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Speed / Rate</span>
                <span className="text-indigo-400 font-mono font-semibold">{rate.toFixed(2)}x</span>
              </div>
              <input
                id="slider-rate"
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={rate}
                onChange={(e) => onRateChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.5x (Slow)</span>
                <span>1.0x</span>
                <span>2.0x (Fast)</span>
              </div>
            </div>

            {/* Pitch */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Pitch</span>
                <span className="text-indigo-400 font-mono font-semibold">{pitch.toFixed(2)}x</span>
              </div>
              <input
                id="slider-pitch"
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={pitch}
                onChange={(e) => onPitchChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.5x (Deep)</span>
                <span>1.0x</span>
                <span>1.8x (High)</span>
              </div>
            </div>

            {/* Volume */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Volume</span>
                <span className="text-indigo-400 font-mono font-semibold">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                id="slider-volume"
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0% (Mute)</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
