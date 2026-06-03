# JournalsPro Protocol UI

Standalone React/Vite UI for the [JournalsPro](https://github.com/yashsharmaeminence/JournalsPro) protocol. Deployed at [credential-chain.vercel.app](https://credential-chain.vercel.app).

## Run locally

```bash
npm install
npm run dev
```

The dev server starts on port 8080 by default.

## Configuration

Set `VITE_API_BASE_URL` when the API runs on a different origin (omit it for same-origin).

Create `.env.local`:

```bash
VITE_API_BASE_URL="http://127.0.0.1:3001"
```

See [`.env.example`](./.env.example) for all supported variables.

## Build

```bash
npm run build
npm run preview
```

## Protocol documentation

For architecture, contract deploy, API endpoints, and backend setup, see the main [JournalsPro repository](https://github.com/yashsharmaeminence/JournalsPro).

## Security note

Never commit private keys, RPC URLs with embedded credentials, or API keys to the repository.
