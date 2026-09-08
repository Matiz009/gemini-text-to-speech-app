import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { TextInputArea } from './components/TextInputArea';
import { VoiceStyleSelector } from './components/VoiceStyleSelector';
import { PlaybackControls } from './components/PlaybackControls';
import { LanguageModal } from './components/LanguageModal';
import { HistoryModal } from './components/HistoryModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { SUPPORTED_LANGUAGES } from './data/languages';
import { VOICE_STYLES } from './data/styles';
import {
  LanguageOption,
  VoiceStyle,
  SpeechEngineMode,
  SpeechHistoryItem,
  PlaybackStatus,
} from './types';
import { AlertCircle, CheckCircle2, ShieldCheck, Sparkles, Volume2 } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'tts_studio_history_v1';

export default function App() {
  const isOnline = useOnlineStatus();

  // State
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [selectedStyle, setSelectedStyle] = useState<VoiceStyle>(VOICE_STYLES[0]);
  const [rate, setRate] = useState<number>(VOICE_STYLES[0].rate);
  const [pitch, setPitch] = useState<number>(VOICE_STYLES[0].pitch);
  const [volume, setVolume] = useState<number>(VOICE_STYLES[0].volume);

  const [text, setText] = useState<string>(
    SUPPORTED_LANGUAGES[0].sampleTexts[0]?.text || 'Hello and welcome to Text-to-Speech Studio!'
  );

  const [engineMode, setEngineMode] = useState<SpeechEngineMode>('offline');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [selectedNeuralVoice, setSelectedNeuralVoice] = useState<string>('Kore');

  // Modals
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Notifications / Toast
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(null);

  // History
  const [history, setHistory] = useState<SpeechHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Neural audio player
  const [neuralAudioUrl, setNeuralAudioUrl] = useState<string | null>(null);
  const [isNeuralLoading, setIsNeuralLoading] = useState(false);
  const neuralAudioRef = useRef<HTMLAudioElement | null>(null);
  const [neuralPlaying, setNeuralPlaying] = useState(false);
  const [neuralPaused, setNeuralPaused] = useState(false);

  // Offline Web Speech hook
  const {
    isSupported: isWebSpeechSupported,
    voices,
    status: offlineStatus,
    currentCharIndex,
    currentWordLength,
    errorMessage: offlineError,
    speak: speakOffline,
    pause: pauseOffline,
    resume: resumeOffline,
    stop: stopOffline,
  } = useSpeechSynthesis();

  // Show temporary toast
  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // If user goes offline while in Neural mode, auto-switch to offline mode
  useEffect(() => {
    if (!isOnline && engineMode === 'neural') {
      setEngineMode('offline');
      showToast('Network disconnected. Switched to 100% Offline Speech Engine.', 'warning');
    }
  }, [isOnline, engineMode]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 50)));
    } catch {
      // Storage quota or private browsing
    }
  }, [history]);

  // Filter available voices for current language
  const availableVoicesForLang = useMemo(() => {
    const langPrefix = currentLanguage.matchPrefix.toLowerCase();
    const langCode = currentLanguage.code.toLowerCase();

    return voices.filter((v) => {
      const vLang = v.lang.toLowerCase();
      return vLang.startsWith(langPrefix) || vLang === langCode;
    });
  }, [voices, currentLanguage]);

  // Auto select best voice for language when voices load or language changes
  useEffect(() => {
    if (availableVoicesForLang.length > 0) {
      // Pick local service voice if available
      const localVoice = availableVoicesForLang.find((v) => v.localService) || availableVoicesForLang[0];
      setSelectedVoice(localVoice);
    } else {
      setSelectedVoice(null);
    }
  }, [availableVoicesForLang]);

  // Style change handler
  const handleSelectStyle = (style: VoiceStyle) => {
    setSelectedStyle(style);
    setPitch(style.pitch);
    setRate(style.rate);
    setVolume(style.volume);
    showToast(`Voice style changed to ${style.name}`, 'info');
  };

  const handleResetTuning = () => {
    setPitch(selectedStyle.pitch);
    setRate(selectedStyle.rate);
    setVolume(selectedStyle.volume);
    showToast('Reset to default preset values', 'info');
  };

  // Language change handler
  const handleSelectLanguage = (lang: LanguageOption) => {
    setCurrentLanguage(lang);
    if (lang.sampleTexts.length > 0) {
      setText(lang.sampleTexts[0].text);
    }
    showToast(`Language set to ${lang.name}`, 'success');
  };

  // Add item to history
  const addHistoryItem = (itemText: string, audioUrl?: string) => {
    const newItem: SpeechHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: itemText,
      timestamp: Date.now(),
      languageCode: currentLanguage.code,
      languageName: currentLanguage.name,
      voiceName: engineMode === 'offline' ? (selectedVoice?.name || 'System Default') : selectedNeuralVoice,
      styleName: selectedStyle.name,
      engineMode,
      audioBlobUrl: audioUrl,
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]);
  };

  // Playback handlers
  const handlePlayOffline = () => {
    if (!text.trim()) return;
    speakOffline(text, {
      voice: selectedVoice,
      lang: currentLanguage.code,
      pitch,
      rate,
      volume,
      onEnd: () => {
        addHistoryItem(text);
      },
      onError: (err) => {
        showToast(err, 'warning');
      },
    });
  };

  const handlePlayNeural = async () => {
    if (!text.trim()) return;
    setIsNeuralLoading(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: selectedNeuralVoice,
          stylePrompt: selectedStyle.neuralPromptPrefix,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate neural speech');
      }

      const audioSrc = `data:${data.mimeType};base64,${data.audio}`;
      setNeuralAudioUrl(audioSrc);

      if (neuralAudioRef.current) {
        neuralAudioRef.current.pause();
      }

      const audio = new Audio(audioSrc);
      neuralAudioRef.current = audio;
      audio.playbackRate = Math.max(0.5, Math.min(2.0, rate));
      audio.volume = volume;

      audio.onplay = () => {
        setNeuralPlaying(true);
        setNeuralPaused(false);
      };
      audio.onpause = () => {
        setNeuralPlaying(false);
        setNeuralPaused(true);
      };
      audio.onended = () => {
        setNeuralPlaying(false);
        setNeuralPaused(false);
        addHistoryItem(text, audioSrc);
      };
      audio.onerror = () => {
        setNeuralPlaying(false);
        setNeuralPaused(false);
        showToast('Audio playback error', 'warning');
      };

      await audio.play();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating neural voice';
      showToast(`${msg}. Falling back to Offline Voice.`, 'warning');
      // Graceful fallback to offline
      handlePlayOffline();
    } finally {
      setIsNeuralLoading(false);
    }
  };

  const handlePlay = () => {
    if (engineMode === 'offline') {
      handlePlayOffline();
    } else {
      handlePlayNeural();
    }
  };

  const handlePause = () => {
    if (engineMode === 'offline') {
      pauseOffline();
    } else if (neuralAudioRef.current) {
      neuralAudioRef.current.pause();
    }
  };

  const handleResume = () => {
    if (engineMode === 'offline') {
      resumeOffline();
    } else if (neuralAudioRef.current) {
      neuralAudioRef.current.play();
    }
  };

  const handleStop = () => {
    if (engineMode === 'offline') {
      stopOffline();
    } else if (neuralAudioRef.current) {
      neuralAudioRef.current.pause();
      neuralAudioRef.current.currentTime = 0;
      setNeuralPlaying(false);
      setNeuralPaused(false);
    }
  };

  const handleReplay = () => {
    handleStop();
    setTimeout(() => {
      handlePlay();
    }, 150);
  };

  // Replay from history
  const handleReplayHistoryItem = (item: SpeechHistoryItem) => {
    setText(item.text);
    // Find matching language
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === item.languageCode) || currentLanguage;
    setCurrentLanguage(lang);

    setTimeout(() => {
      if (item.audioBlobUrl) {
        const audio = new Audio(item.audioBlobUrl);
        audio.play();
      } else {
        speakOffline(item.text, {
          voice: selectedVoice,
          lang: item.languageCode,
          pitch,
          rate,
          volume,
        });
      }
    }, 200);
  };

  // Download WAV audio
  const handleDownloadAudio = () => {
    if (neuralAudioUrl) {
      const link = document.createElement('a');
      link.href = neuralAudioUrl;
      link.download = `speech-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('WAV audio downloaded successfully!', 'success');
    } else if (engineMode === 'offline') {
      // Trigger neural generation if online, or alert user
      if (isOnline) {
        showToast('Generating studio WAV file for download...', 'info');
        handlePlayNeural();
      } else {
        showToast('WAV export requires generating with Neural Engine or Web Audio.', 'warning');
      }
    }
  };

  // Derive current playback status
  const currentStatus: PlaybackStatus = useMemo(() => {
    if (isNeuralLoading) return 'loading';
    if (engineMode === 'offline') return offlineStatus;
    if (neuralPlaying) return 'playing';
    if (neuralPaused) return 'paused';
    return 'idle';
  }, [engineMode, offlineStatus, isNeuralLoading, neuralPlaying, neuralPaused]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white pb-16">
      {/* App Header */}
      <Header
        currentLanguage={currentLanguage}
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        historyCount={history.length}
        engineMode={engineMode}
        onToggleEngineMode={() => {
          if (!isOnline && engineMode === 'offline') {
            showToast('Neural voices require internet connection.', 'warning');
            return;
          }
          const nextMode = engineMode === 'offline' ? 'neural' : 'offline';
          setEngineMode(nextMode);
          showToast(`Switched engine to ${nextMode === 'offline' ? 'Offline Native' : 'Gemini Neural AI'}`, 'info');
        }}
        isOnline={isOnline}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Capability Overview Banner */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  100% Offline & Private Speech Synthesis
                </span>
                <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  Zero Network Latency
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Voices render entirely on your device with native speech synthesis. No data is stored or transmitted externally unless you explicitly use Neural AI.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              id="btn-quick-lang"
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.name}</span>
            </button>
          </div>
        </div>

        {/* Warning if Web Speech is somehow unsupported */}
        {!isWebSpeechSupported && (
          <div className="bg-amber-950/40 border border-amber-800/60 text-amber-200 p-4 rounded-xl text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Notice:</span> Web Speech Synthesis is not supported in this browser environment. The app will use server-side neural speech synthesis when online.
            </div>
          </div>
        )}

        {/* Text Input Area */}
        <TextInputArea
          text={text}
          onChangeText={setText}
          status={currentStatus}
          currentCharIndex={currentCharIndex}
          currentWordLength={currentWordLength}
          currentLanguage={currentLanguage}
          onSelectSampleText={(sample) => {
            setText(sample);
            showToast('Sample text inserted', 'info');
          }}
          onClear={() => {
            setText('');
            handleStop();
          }}
        />

        {/* Voice Style Selector */}
        <VoiceStyleSelector
          selectedStyle={selectedStyle}
          onSelectStyle={handleSelectStyle}
          rate={rate}
          pitch={pitch}
          volume={volume}
          onRateChange={setRate}
          onPitchChange={setPitch}
          onVolumeChange={setVolume}
          onResetTuning={handleResetTuning}
          engineMode={engineMode}
          availableVoices={availableVoicesForLang}
          selectedVoice={selectedVoice}
          onSelectVoice={setSelectedVoice}
          selectedNeuralVoice={selectedNeuralVoice}
          onSelectNeuralVoice={setSelectedNeuralVoice}
        />

        {/* Playback Controls & Wave Visualizer */}
        <PlaybackControls
          status={currentStatus}
          engineMode={engineMode}
          onPlay={handlePlay}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          onReplay={handleReplay}
          onDownloadAudio={handleDownloadAudio}
          hasAudioDownload={!!neuralAudioUrl || engineMode === 'neural'}
          isDownloadLoading={isNeuralLoading}
          textEmpty={!text.trim()}
        />

        {/* Error message banner if any */}
        {offlineError && (
          <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{offlineError}</span>
          </div>
        )}
      </main>

      {/* Floating Offline Status Banner */}
      <OfflineIndicator />

      {/* Language Selector Modal */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        selectedLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        systemVoices={voices}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onReplay={handleReplayHistoryItem}
        onClearHistory={() => {
          setHistory([]);
          try {
            localStorage.removeItem(STORAGE_KEY_HISTORY);
          } catch {}
          showToast('History cleared', 'info');
        }}
      />

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-medium transition-all transform duration-300 animate-slide-up ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60'
              : notification.type === 'warning'
              ? 'bg-amber-950/90 text-amber-200 border-amber-700/60'
              : 'bg-slate-900/95 text-slate-100 border-slate-700/80'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : notification.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}
