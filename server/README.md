// server/README.md

# News Reader Server

Express.js proxy that securely forwards requests to TheNewsApi without exposing the API token to the browser.

## Setup

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Add your TheNewsApi token to `.env`:

   ```
   THENEWSAPI_TOKEN=your_actual_token_here
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running

Development:

```bash
npm run dev
```

The server listens on `http://localhost:5177` by default.

## Endpoints

### GET /api/health

Health check endpoint.

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-04-03T10:30:00.000Z"
}
```

### GET /api/news/all

Proxy endpoint for TheNewsApi `/v1/news/all`.

Query parameters:

- `search` (string, optional) - Search term; mutually exclusive with `categories`
- `categories` (string, optional) - Category name (tech, general, science, sports, business, health, entertainment, politics, food, travel)
- `page` (number, default: 1) - Page number
- `limit` (number, default: 3) - Results per page
- `language` (string, default: "en") - Language code

Example:

```
GET /api/news/all?categories=tech&page=1&limit=3
GET /api/news/all?search=climate+change&page=1&limit=3
```

## Security

- The real API token is never exposed to the client
- Proxy logs only the proxied URL without the token
- Environment variables are gitignored
- CORS is configured to allow frontend requests
