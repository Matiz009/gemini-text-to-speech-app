import React, { useState, useMemo } from 'react';
import { Search, X, Check, Volume2, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { LanguageOption } from '../types';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
  systemVoices: SpeechSynthesisVoice[];
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  systemVoices,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Map voices count per language prefix
  const voiceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const voice of systemVoices) {
      const code = voice.lang.toLowerCase();
      const prefix = code.split('-')[0] || code;
      counts[prefix] = (counts[prefix] || 0) + 1;
      counts[code] = (counts[code] || 0) + 1;
    }
    return counts;
  }, [systemVoices]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Select Language & Region</h3>
              <p className="text-xs text-slate-400">
                Filters local voice models and sample phrases
              </p>
            </div>
          </div>
          <button
            id="btn-close-lang-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-lang-search"
              type="text"
              placeholder="Search language, e.g. Spanish, Français, 日本語, de..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              autoFocus
            />
          </div>
        </div>

        {/* Languages list */}
        <div className="overflow-y-auto p-4 space-y-1.5 flex-1 divide-y divide-slate-800/40">
          {filteredLanguages.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching languages found. Try searching by country name or code.
            </div>
          ) : (
            filteredLanguages.map((lang) => {
              const isSelected = selectedLanguage.code === lang.code;
              const count = voiceCounts[lang.matchPrefix] || voiceCounts[lang.code.toLowerCase()] || 0;

              return (
                <button
                  key={lang.code}
                  id={`btn-select-lang-${lang.code}`}
                  onClick={() => {
                    onSelectLanguage(lang);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'hover:bg-slate-800/60 text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl leading-none">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{lang.name}</span>
                        <span className="text-xs text-slate-400 font-mono">({lang.code})</span>
                      </div>
                      <span className="text-xs text-slate-400">{lang.nativeName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {count > 0 ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                        <Volume2 className="w-3 h-3" />
                        {count} {count === 1 ? 'voice' : 'voices'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">
                        Default Engine
                      </span>
                    )}

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-5">
          <span>{SUPPORTED_LANGUAGES.length} supported regional profiles</span>
          <span>Offline Web Speech Engine</span>
        </div>
      </div>
    </div>
  );
};
