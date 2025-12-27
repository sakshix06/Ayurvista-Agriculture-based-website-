# Server setup

Create a `.env` file next to `index.js` with:

```
MONGODB_URI=mongodb://127.0.0.1:27017/ayurvista
JWT_SECRET=please_change_me

# Optional AI providers (leave empty to use local stubs)
# Google Cloud (service account JSON fields)
GOOGLE_PROJECT_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Gemini APIs (for Vision or TTS services)
GEMINI_API_KEY=

# ElevenLabs (for transcription alt.)
ELEVENLABS_API_KEY=
```

Run locally:

```
npm run server
```

Notes:
- Private keys must retain line breaks as `\n` when set via `.env`.
- If keys are not provided, the AI endpoints respond with deterministic stub data for UI development.
