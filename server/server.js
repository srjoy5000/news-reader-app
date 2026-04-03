// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5177;
const API_TOKEN = process.env.THENEWSAPI_TOKEN;
const API_BASE = 'https://api.thenewsapi.com/v1/news';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// News proxy endpoint
app.get('/api/news/all', async (req, res) => {
  try {
    if (!API_TOKEN) {
      return res.status(500).json({ error: 'TheNewsApi token not configured' });
    }

    // Extract query params
    const { search, categories, page = 1, limit = 3, language = 'en' } = req.query;

    // Build URL with params
    const params = new URLSearchParams({
      api_token: API_TOKEN,
      language,
      limit: String(limit),
      page: String(page),
    });

    // Add search or categories (mutually exclusive)
    if (search && search.trim()) {
      params.append('search', search.trim());
    } else if (categories && categories.trim()) {
      params.append('categories', categories.trim());
    }

    const url = `${API_BASE}/all?${params.toString()}`;

    // Log proxied URL without token (for debugging)
    console.log(`[${new Date().toISOString()}] GET /api/news/all - Proxying to: ${API_BASE}/all?language=${language}&limit=${limit}&page=${page}${search ? '&search=...' : categories ? '&categories=...' : ''}`);

    const response = await fetch(url);
    const data = await response.json();

    // Handle API error responses
    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({ error: 'Daily request limit reached. Please try again tomorrow.' });
      }
      if (response.status === 401 || response.status === 403) {
        return res.status(401).json({ error: 'TheNewsApi authentication failed. Check your token.' });
      }
      return res.status(response.status).json({ error: data.message || 'API error' });
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`📰 News Reader Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
