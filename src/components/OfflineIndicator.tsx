import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500/90 backdrop-blur-md px-4 py-2 text-xs font-medium text-slate-950 shadow-xl border border-amber-400/40 animate-fade-in"
    >
      <div className="w-6 h-6 rounded-full bg-slate-950/15 flex items-center justify-center shrink-0">
        <WifiOff className="w-3.5 h-3.5 text-slate-950" />
      </div>
      <div>
        <span className="font-bold">Offline Mode Active</span>
        <span className="mx-1.5 opacity-60">•</span>
        <span className="text-slate-900">Native device speech synthesis works 100% offline.</span>
      </div>
    </div>
  );
};
