import React from 'react';
import { PlaybackStatus } from '../types';

interface AudioVisualizerProps {
  status: PlaybackStatus;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  status,
  barCount = 24,
}) => {
  const isPlaying = status === 'playing';

  // Heights for resting state vs dynamic wave animation
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Generate different base animation delay and height
    const animDelay = (i * 0.08) % 1.2;
    const animDuration = 0.5 + ((i * 13) % 7) * 0.1;
    return { id: i, delay: animDelay, duration: animDuration };
  });

  return (
    <div className="flex items-center justify-center gap-1 h-9 px-3 py-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
      {bars.map((bar) => (
        <span
          key={bar.id}
          className={`w-1 rounded-full transition-all ${
            isPlaying
              ? 'bg-gradient-to-t from-indigo-500 to-purple-400 animate-pulse'
              : 'bg-slate-800 h-1.5'
          }`}
          style={
            isPlaying
              ? {
                  animationDelay: `${bar.delay}s`,
                  animationDuration: `${bar.duration}s`,
                  height: `${Math.max(20, Math.sin(bar.id * 0.8) * 40 + 50)}%`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
};
