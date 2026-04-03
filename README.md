// README.md

# News Reader

A modern, responsive Flipboard-like news reader built with React + Vite (frontend) and Express (backend proxy).

## Features

✨ **Modern UI**

- Flipboard-style single article view
- Dark theme with subtle gradients
- Responsive desktop & mobile layouts
- Smooth animations and hover effects

📰 **News Management**

- Category filters (tech, general, science, sports, business, health, entertainment, politics, food, travel)
- Full-text search
- 3 articles per page with circular pager
- Favorites system with localStorage persistence

⚡ **Performance**

- Smart page prefetching (auto-prefetch next/previous)
- In-memory page caching
- Instant page swaps without flashing
- Optimized rendering

🔒 **Security**

- Node.js proxy hides API token from browser
- Secure environment variable handling
- No sensitive data in client code
- CORS configured

## Project Structure

```
news-reader/
├── package.json              # Root scripts
├── .gitignore
├── README.md
├── server/                   # Express proxy
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── README.md
└── web/                      # React + Vite app
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    ├── src/
    │   ├── App.tsx           # Main component
    │   ├── main.tsx
    │   ├── styles.css        # All styling
    │   ├── lib/
    │   │   └── newsapi.ts    # API client with caching
    │   └── components/
    │       └── HeadlinesList.tsx  # Article display
    └── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
npm run server:install
npm run web:install
```

Or install concurrently if not already installed:

```bash
npm install
```

### 2. Set up Environment Variables

In `server/.env`:

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` and add your TheNewsApi token:

```
THENEWSAPI_TOKEN=your_actual_token_here_from_api.thenewsapi.com
PORT=5177
```

**Get your free token:** https://www.thenewsapi.com

### 3. Run Development Servers

Both servers together:

```bash
npm run dev
```

Or separately:

```bash
# Terminal 1 - Backend on port 5177
npm run server:dev

# Terminal 2 - Frontend on port 5176
npm run web:dev
```

### 4. Open in Browser

```
http://localhost:5176
```

## Usage

### Desktop

- **Left sidebar**: Search input, 10 category buttons, Favorites button
- **Main content**: Single featured article card
- **Bottom**: Circular pager (« ‹ numbered buttons › with info)
- **Always visible**: Filters don't collapse

### Mobile

- **Toggle button** (☰): Show/hide filters
- **Single column layout**: Filters above or below articles
- **Responsive card**: Expands to avoid scroll on first load

### Features

- Click category to filter
- Type in search bar (clears category)
- Click article image to open source (opens full article)
- Click ★ to save/unsave favorites
- Click "Favorites (n)" to view saved articles
- Pager shows current article number and total found

## API Endpoints

### Public (Vite proxy)

- `GET /api/health` - Health check
- `GET /api/news/all?search=...&categories=...&page=...`

### Parameters for /news/all

- `search` (string, optional) - Search term
- `categories` (string, optional) - Category name (mutually exclusive with search)
- `page` (number, default: 1) - Page number
- `limit` (number, fixed: 3) - Results per page
- `language` (string, fixed: en) - Language

Example:

```bash
# Category
curl http://localhost:5176/api/news/all?categories=tech&page=1

# Search
curl http://localhost:5176/api/news/all?search=climate+change&page=1
```

## Tech Stack

### Frontend

- React 18.2
- Vite 5.0
- TypeScript 5.2
- CSS (no frameworks)

### Backend

- Node.js 16+
- Express 4.18
- CORS
- dotenv

### API

- TheNewsApi (https://www.thenewsapi.com)
- Endpoint: `/v1/news/all`

## Development

### Local Development

1. **Backend changes** automatically restart (just save)
2. **Frontend changes** hot-reload instantly
3. **API calls** proxied through Vite → Express → TheNewsApi
4. **Logging**: Check browser console and terminal logs

### Debugging

**Client logs:**

- All fetch calls logged without token
- Cache hits/stores logged for pagination

**Server logs:**

- Proxied URL shown (no token)
- API responses logged

**Environment:**

- Copy `.env.example` to `.env`
- Never commit `.env` with real tokens

## Production Build

```bash
npm run build:web
```

Output in `web/dist/`. Ready to deploy to any static host.

Don't forget to update the API proxy target if deployed separately from the backend.

## Security Considerations

1. **Never expose tokens in the browser**
   - Always use the Express proxy
   - Backend validates and forwards safely

2. **Environment variables**
   - `.env` is gitignored
   - `.env.example` shows template
   - Never commit real tokens

3. **CORS**
   - Backend allows all origins (safe behind proxy)
   - In production, restrict to your domain

4. **API Rate Limits**
   - TheNewsApi has daily/monthly limits
   - Prefetching may impact limits
   - Adjust limit=3 if needed

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+

## Troubleshooting

**Error: "Daily request limit reached"**

- You've hit TheNewsApi daily limit (429 error)
- Wait until tomorrow or upgrade plan

**Error: "TheNewsApi authentication failed"**

- Invalid token in `.env`
- Get a new token from https://www.thenewsapi.com
- Make sure to copy the entire token

**Frontend won't connect to API**

- Ensure backend is running on port 5177
- Check browser Network tab for errors
- Verify CORS headers

**Mobile layout not changing**

- Check browser width (viewport width < 768px)
- Open DevTools and toggle device toolbar
- Refresh page

## License

MIT
