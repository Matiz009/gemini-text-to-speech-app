import React from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Download,
  Loader2,
  Volume2,
} from 'lucide-react';
import { PlaybackStatus, SpeechEngineMode } from '../types';
import { AudioVisualizer } from './AudioVisualizer';

interface PlaybackControlsProps {
  status: PlaybackStatus;
  engineMode: SpeechEngineMode;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReplay: () => void;
  onDownloadAudio?: () => void;
  hasAudioDownload: boolean;
  isDownloadLoading: boolean;
  textEmpty: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  status,
  engineMode,
  onPlay,
  onPause,
  onResume,
  onStop,
  onReplay,
  onDownloadAudio,
  hasAudioDownload,
  isDownloadLoading,
  textEmpty,
}) => {
  const isPlaying = status === 'playing';
  const isPaused = status === 'paused';
  const isLoading = status === 'loading';

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Visualizer and Status Indicator */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <AudioVisualizer status={status} barCount={20} />
        <div className="text-xs">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            {isLoading ? (
              <span className="text-purple-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Synthesizing Voice...
              </span>
            ) : isPlaying ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Speaking aloud
              </span>
            ) : isPaused ? (
              <span className="text-amber-400">Paused</span>
            ) : (
              <span className="text-slate-400">Ready to speak</span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {engineMode === 'offline' ? 'Offline Web Speech' : 'Gemini Studio Audio'}
          </span>
        </div>
      </div>

      {/* Main Playback Buttons */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
        {/* Replay */}
        <button
          id="btn-replay"
          onClick={onReplay}
          disabled={textEmpty || isLoading}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 transition active:scale-95"
          title="Replay from start"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Primary Play / Pause / Resume Button */}
        {isLoading ? (
          <button
            id="btn-loading"
            disabled
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600/70 text-white font-semibold text-sm shadow-lg shadow-indigo-950/60 cursor-wait min-w-[130px]"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating</span>
          </button>
        ) : isPlaying ? (
          <button
            id="btn-pause"
            onClick={onPause}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-950/50 transition active:scale-95 min-w-[130px]"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause</span>
          </button>
        ) : isPaused ? (
          <button
            id="btn-resume"
            onClick={onResume}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition active:scale-95 min-w-[130px]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            id="btn-speak-main"
            onClick={onPlay}
            disabled={textEmpty}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:hover:from-indigo-600 disabled:hover:to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-950/80 transition active:scale-95 min-w-[130px]"
          >
            <Volume2 className="w-4 h-4" />
            <span>Speak Aloud</span>
          </button>
        )}

        {/* Stop Button */}
        {(isPlaying || isPaused) && (
          <button
            id="btn-stop"
            onClick={onStop}
            className="p-3 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 transition active:scale-95"
            title="Stop playback"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        )}

        {/* Download Audio Button */}
        {hasAudioDownload && onDownloadAudio && (
          <button
            id="btn-download-audio"
            onClick={onDownloadAudio}
            disabled={isDownloadLoading}
            className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
            title="Download synthesized WAV audio"
          >
            {isDownloadLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <Download className="w-4 h-4 text-indigo-400" />
            )}
            <span className="hidden sm:inline">Download WAV</span>
          </button>
        )}
      </div>
    </div>
  );
};
