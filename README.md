# JournalsPro Protocol UI (`frontend/`)

This is the production-style React/Vite UI for the JournalsPro protocol.

## Run locally

From repo root:

```bash
pnpm install --no-frozen-lockfile
pnpm dev:api
pnpm dev:frontend
```

## Configuration

- **API base URL**: set `VITE_API_BASE_URL` when the API is on a different origin (otherwise omit it to use same-origin).

Create `frontend/.env.local`:

```bash
VITE_API_BASE_URL="http://127.0.0.1:3001"
```

## Documentation

See the root [`README.md`](../README.md) for:
- protocol overview and architecture
- contract deploy / verification
- API endpoints
- environment variables

## Security note

Never commit private keys, RPC URLs with embedded credentials, or API keys to the repository.