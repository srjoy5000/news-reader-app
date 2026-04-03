// web/src/App.tsx

import React, { useState, useEffect } from 'react';
import { HeadlinesList } from './components/HeadlinesList';
import './styles.css';

const CATEGORIES = [
  'tech',
  'general',
  'science',
  'sports',
  'business',
  'health',
  'entertainment',
  'politics',
  'food',
  'travel',
];

const FAVORITES_STORAGE_KEY = 'news-reader-favorites';

export const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tech');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavorites, setShowFavorites] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(new Set(JSON.parse(stored)));
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const handleToggleFavorite = (uuid: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) {
        next.delete(uuid);
      } else {
        next.add(uuid);
      }
      return next;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearch(''); // Clear search when selecting category
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleReturnToLive = () => {
    setShowFavorites(false);
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Search */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Search</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Search news..."
            value={search}
            onChange={handleSearchChange}
            disabled={showFavorites}
          />
        </div>

        {/* Categories */}
        {!showFavorites && (
          <div className="sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <div className="categories">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${
                    selectedCategory === category && !search ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Favorites View Info */}
        {showFavorites && (
          <div className="sidebar-section">
            <div
              style={{
                padding: '12px',
                background: '#3a3a3a',
                borderRadius: '4px',
                fontSize: '13px',
                color: '#aaa',
              }}
            >
              Viewing {favorites.size} saved articles. Search and filters are disabled.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="sidebar-section action-buttons" style={{ marginTop: 'auto' }}>
          {!showFavorites && (
            <button
              className="btn btn-secondary favorites-btn"
              onClick={handleShowFavorites}
              title={`View ${favorites.size} favorites`}
            >
              ★ Favorites ({favorites.size})
            </button>
          )}
          {showFavorites && (
            <button
              className="btn btn-primary"
              onClick={handleReturnToLive}
              style={{ marginTop: 'auto' }}
            >
              ← Back to Live
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {!showFavorites ? (
          <HeadlinesList
            search={search}
            categories={selectedCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <FavoritesView favorites={favorites} onToggleFavorite={handleToggleFavorite} />
        )}

        {/* Mobile Toggle Button */}
        <button
          className="toggle-filters-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Hide filters' : 'Show filters'}
          style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </div>
    </div>
  );
};

interface FavoritesViewProps {
  favorites: Set<string>;
  onToggleFavorite: (uuid: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onToggleFavorite }) => {
  const [articles, setArticles] = useState<Array<{ uuid: string; title: string }>>([]);

  // Load favorite articles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('news-reader-articles');
    if (stored) {
      try {
        const allArticles = JSON.parse(stored);
        const favItems = allArticles.filter((a: any) => favorites.has(a.uuid));
        setArticles(favItems);
      } catch (err) {
        console.error('Failed to load articles:', err);
      }
    }
  }, [favorites]);

  if (favorites.size === 0) {
    return (
      <div className="empty-container">
        <div className="empty-card">
          <div className="empty-icon">⭐</div>
          <h2 className="empty-title">No Favorites Yet</h2>
          <p className="empty-message">
            Click the star icon to save articles and view them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', overflow: 'auto', flex: 1 }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>★ Saved Favorites</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {Array.from(favorites).map((uuid) => (
          <div
            key={uuid}
            style={{
              background: '#3a3a3a',
              padding: '16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <p style={{ fontSize: '14px', color: '#ddd', marginBottom: '12px' }}>{uuid}</p>
            <button
              onClick={() => onToggleFavorite(uuid)}
              style={{
                padding: '8px 12px',
                background: '#ff6b6b',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
