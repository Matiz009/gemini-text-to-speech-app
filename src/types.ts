export type SpeechEngineMode = 'offline' | 'neural';

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'loading';

export interface VoiceStyle {
  id: string;
  name: string;
  tagline: string;
  pitch: number; // 0.5 to 2.0 (default 1.0)
  rate: number;  // 0.5 to 2.0 (default 1.0)
  volume: number; // 0.0 to 1.0 (default 1.0)
  iconName: string;
  badge: string;
  description: string;
  neuralPromptPrefix: string;
}

export interface LanguageOption {
  code: string;       // BCP 47 prefix, e.g. "en-US"
  matchPrefix: string; // e.g. "en"
  name: string;
  nativeName: string;
  flag: string;
  sampleTexts: {
    title: string;
    text: string;
  }[];
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  timestamp: number;
  languageCode: string;
  languageName: string;
  voiceName: string;
  styleName: string;
  engineMode: SpeechEngineMode;
  audioBlobUrl?: string;
  durationSec?: number;
}

export interface NeuralVoiceOption {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'neutral';
  tone: string;
  description: string;
}
