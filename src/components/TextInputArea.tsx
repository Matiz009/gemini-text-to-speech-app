import React, { useMemo } from 'react';
import { Clipboard, Trash2, BookOpen, Volume2 } from 'lucide-react';
import { LanguageOption, PlaybackStatus } from '../types';

interface TextInputAreaProps {
  text: string;
  onChangeText: (text: string) => void;
  status: PlaybackStatus;
  currentCharIndex: number;
  currentWordLength: number;
  currentLanguage: LanguageOption;
  onSelectSampleText: (text: string) => void;
  onClear: () => void;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({
  text,
  onChangeText,
  status,
  currentCharIndex,
  currentWordLength,
  currentLanguage,
  onSelectSampleText,
  onClear,
}) => {
  const isPlaying = status === 'playing';

  // Stats
  const charCount = text.length;
  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [text]);

  // Estimated reading duration (average 140 words per min)
  const estimatedSeconds = useMemo(() => {
    if (wordCount === 0) return 0;
    return Math.ceil((wordCount / 140) * 60);
  }, [wordCount]);

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        onChangeText(clipText);
      }
    } catch {
      // Fallback if clipboard permission denied
    }
  };

  // Render text with word boundary highlight when speaking
  const renderHighlightedText = () => {
    if (currentCharIndex < 0 || currentCharIndex >= text.length) {
      return text;
    }
    const before = text.slice(0, currentCharIndex);
    const wordEnd = Math.min(text.length, currentCharIndex + (currentWordLength || 4));
    const word = text.slice(currentCharIndex, wordEnd);
    const after = text.slice(wordEnd);

    return (
      <>
        <span>{before}</span>
        <span className="bg-indigo-500/40 text-white font-bold px-1 py-0.5 rounded shadow-xs border border-indigo-400/50">
          {word}
        </span>
        <span>{after}</span>
      </>
    );
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg flex flex-col">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-200">Text to Speak</span>
          <span className="text-xs text-slate-500 font-mono">
            {charCount} chars • {wordCount} words (~{estimatedSeconds}s)
          </span>
        </div>

        {/* Quick sample chips and buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sample texts dropdown/buttons */}
          {currentLanguage.sampleTexts.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 hidden sm:inline flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-indigo-400" />
                Samples:
              </span>
              <div className="flex gap-1">
                {currentLanguage.sampleTexts.map((sample, idx) => (
                  <button
                    key={idx}
                    id={`btn-sample-text-${idx}`}
                    onClick={() => onSelectSampleText(sample.text)}
                    className="text-[11px] font-medium px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95"
                    title={sample.text}
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paste button */}
          <button
            id="btn-paste-text"
            onClick={handlePaste}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Paste text from clipboard"
          >
            <Clipboard className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {/* Clear button */}
          {text.length > 0 && (
            <button
              id="btn-clear-text"
              onClick={onClear}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-transparent hover:border-rose-900/40 transition"
              title="Clear text"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea / Live Reader Display */}
      <div className="relative min-h-[160px] sm:min-h-[200px] flex flex-col">
        {isPlaying && currentCharIndex >= 0 ? (
          /* Live karaoke display while audio is speaking */
          <div className="w-full h-full min-h-[160px] sm:min-h-[200px] p-4 text-base sm:text-lg leading-relaxed bg-slate-950 border border-indigo-500/50 rounded-xl overflow-y-auto font-sans select-text text-slate-200">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-xs text-indigo-400 font-medium">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Speech Tracking</span>
            </div>
            <div className="whitespace-pre-wrap">{renderHighlightedText()}</div>
          </div>
        ) : (
          /* Standard editable textarea */
          <textarea
            id="input-tts-text"
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={`Type or paste any text in ${currentLanguage.name} to hear it spoken aloud...`}
            rows={7}
            className="w-full p-4 text-base sm:text-lg leading-relaxed bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-y"
          />
        )}
      </div>
    </div>
  );
};
