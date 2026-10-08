# Text-to-Speech Studio

A text-to-speech web app with multiple languages and voice styles, powered by Google Gemini and installable as a PWA.

> 📸 Screenshot / demo: TODO

## Features

- Turn typed text into speech with Google Gemini TTS (server-side). The raw PCM output is wrapped as WAV.
- Choose a language and voice style (`LanguageModal`, `VoiceStyleSelector`)
- Playback controls with an audio visualizer
- History of past generations (`HistoryModal`)
- Installable PWA with an offline indicator

## Tech stack

React · TypeScript · Vite · Tailwind CSS · Motion · Express · `@google/genai`

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # starts the Express + Vite server on http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Environment variables

| Name | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `APP_URL` | Public URL of the app |

## Project structure

```
server.ts          Express server + Gemini TTS endpoint
src/App.tsx        Main UI
src/components/    Header, text input, playback, visualizer, modals
src/hooks/         Speech synthesis, online status, PWA install
src/data/          Languages and voice styles
public/            PWA icons
```

## Author

**Mati ul Rehman**: [github.com/Matiz009](https://github.com/Matiz009)
