import React from 'react';
import { Volume2, Globe, Clock, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { LanguageOption, SpeechEngineMode } from '../types';

interface HeaderProps {
  currentLanguage: LanguageOption;
  onOpenLanguageModal: () => void;
  onOpenHistoryModal: () => void;
  historyCount: number;
  engineMode: SpeechEngineMode;
  onToggleEngineMode: () => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onOpenLanguageModal,
  onOpenHistoryModal,
  historyCount,
  engineMode,
  onToggleEngineMode,
  isOnline,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-950 text-white">
            <Volume2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Text-to-Speech Studio
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-400" />
                    <span>Online Ready</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-400" />
                    <span>Offline Mode</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-language voice synthesizer with offline PWA support
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Engine Mode Toggle (Offline vs Neural AI) */}
          <button
            id="btn-toggle-engine"
            onClick={onToggleEngineMode}
            disabled={!isOnline && engineMode === 'offline'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              engineMode === 'neural'
                ? 'bg-purple-950/70 border-purple-500/60 text-purple-200 shadow-sm shadow-purple-950'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
            } ${!isOnline && engineMode === 'offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={
              isOnline
                ? 'Switch between Native Offline Speech and Gemini Neural Cloud Voice'
                : 'Neural voices require internet connectivity. Currently running in offline mode.'
            }
          >
            {engineMode === 'neural' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline">Engine:</span>
                <span>Neural AI</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Engine:</span>
                <span>Offline Native</span>
              </>
            )}
          </button>

          {/* Language Selector Button */}
          <button
            id="btn-header-language"
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition"
          >
            <span className="text-base leading-none">{currentLanguage.flag}</span>
            <span className="max-w-[80px] sm:max-w-none truncate font-semibold">
              {currentLanguage.name}
            </span>
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* History Button */}
          <button
            id="btn-header-history"
            onClick={onOpenHistoryModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition"
            title="Speech History"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                {historyCount > 99 ? '99+' : historyCount}
              </span>
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
