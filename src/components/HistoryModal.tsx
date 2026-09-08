import React, { useState } from 'react';
import { X, Play, Trash2, Clock, Copy, Check, Volume2 } from 'lucide-react';
import { SpeechHistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SpeechHistoryItem[];
  onReplay: (item: SpeechHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onReplay,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Speech History</h3>
              <p className="text-xs text-slate-400">
                {history.length} saved utterances stored on your device
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                id="btn-clear-history"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 transition"
                title="Clear all stored history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No speech history yet.</p>
              <p className="text-xs text-slate-600 mt-1">
                Spoken phrases will automatically appear here for quick replay.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
              >
                <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed">
                  "{item.text}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.languageName}
                    </span>
                    <span>•</span>
                    <span>{item.styleName}</span>
                    <span>•</span>
                    <span>
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item.text, item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                      title="Copy text"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onReplay(item);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
