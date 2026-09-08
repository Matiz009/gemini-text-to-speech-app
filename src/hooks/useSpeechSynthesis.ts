import { useState, useEffect, useRef, useCallback } from 'react';
import { PlaybackStatus } from '../types';

export interface UseSpeechSynthesisOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  lang?: string;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);
  const [currentWordLength, setCurrentWordLength] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  // Load available system voices
  const refreshVoices = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }
    const voiceList = window.speechSynthesis.getVoices();
    if (voiceList && voiceList.length > 0) {
      setVoices(voiceList);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [refreshVoices]);

  // Keep-alive timer for Chromium speech synthesis bug on long text
  const startKeepAlive = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 12000);
  }, []);

  const stopKeepAlive = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stopKeepAlive();
    setStatus('idle');
    setCurrentCharIndex(-1);
    setCurrentWordLength(0);
  }, [stopKeepAlive]);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStatus('playing');
    }
  }, []);

  const speak = useCallback(
    (text: string, options: UseSpeechSynthesisOptions = {}) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setErrorMessage('Web Speech Synthesis is not supported in this browser.');
        options.onError?.('Web Speech Synthesis not supported');
        return;
      }

      const cleanText = text.trim();
      if (!cleanText) {
        return;
      }

      // Cancel previous utterance
      window.speechSynthesis.cancel();
      stopKeepAlive();
      setErrorMessage(null);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      if (options.voice) {
        utterance.voice = options.voice;
      }
      if (options.lang) {
        utterance.lang = options.lang;
      }
      utterance.pitch = typeof options.pitch === 'number' ? Math.max(0.1, Math.min(2, options.pitch)) : 1.0;
      utterance.rate = typeof options.rate === 'number' ? Math.max(0.1, Math.min(2, options.rate)) : 1.0;
      utterance.volume = typeof options.volume === 'number' ? Math.max(0, Math.min(1, options.volume)) : 1.0;

      utterance.onstart = () => {
        setStatus('playing');
        setCurrentCharIndex(0);
        startKeepAlive();
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word' || typeof event.charIndex === 'number') {
          setCurrentCharIndex(event.charIndex);
          setCurrentWordLength(event.charLength || 5);
        }
      };

      utterance.onend = () => {
        stopKeepAlive();
        setStatus('idle');
        setCurrentCharIndex(-1);
        setCurrentWordLength(0);
        options.onEnd?.();
      };

      utterance.onerror = (event) => {
        stopKeepAlive();
        setStatus('idle');
        setCurrentCharIndex(-1);
        setCurrentWordLength(0);
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          const err = `Speech error: ${event.error}`;
          setErrorMessage(err);
          options.onError?.(err);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [startKeepAlive, stopKeepAlive]
  );

  return {
    isSupported,
    voices,
    status,
    currentCharIndex,
    currentWordLength,
    errorMessage,
    speak,
    pause,
    resume,
    stop,
    refreshVoices,
  };
}
