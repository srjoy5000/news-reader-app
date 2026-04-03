// web/README.md

# News Reader Web

React + Vite + TypeScript frontend for the news reader app.

## Features

- **Flipboard-like Design**: Single article view with featured card
- **Category & Search Filters**: Browse by category or search for specific topics
- **Smart Pagination**: 3 articles per page with circular pager navigation
- **Intelligent Prefetching**: Auto-prefetch next/previous pages for instant loading
- **Favorites System**: Save articles to localStorage with persistent sidebar
- **Responsive Design**: Desktop sidebar layout, mobile hamburger toggle
- **Loading States**: Full-height skeleton on category/search change
- **Error Handling**: Graceful error display with retry functionality
- **Accessibility**: Semantic HTML, ARIA attributes, keyboard navigation

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Ensure the backend server is running on port 5177

## Running

Development:

```bash
npm run dev
```

The frontend runs on `http://localhost:5176`.

## Building

```bash
npm run build
```

Output goes to `dist/`.

## Architecture

- `src/App.tsx` - Main component with state management
- `src/components/HeadlinesList.tsx` - Article display and pagination
- `src/lib/newsapi.ts` - API client with caching and prefetching
- `src/styles.css` - All styling (desktop + mobile responsive)
- `vite.config.ts` - Vite configuration with API proxy

## Styling

All styling is in `styles.css`:

- **Colors**: Dark theme (#333 background, #0a84ff accent)
- **Desktop**: Left sidebar (280px) with filters, right content area
- **Mobile**: Single column, toggle filters with FAB button
- **Responsive**: Breakpoint at 768px

## State Management

Simple React hooks:

- `search` & `selectedCategory` for filters
- `favorites` as a Set stored in localStorage
- `showFavorites` to toggle between live and favorites view
- Articles cached by page in the API client layer
