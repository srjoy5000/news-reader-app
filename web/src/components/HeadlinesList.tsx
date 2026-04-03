// web/src/components/HeadlinesList.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { fetchNews, prefetchPage, Article, NewsResponse } from '../lib/newsapi';

interface HeadlinesListProps {
  search: string;
  categories: string;
  favorites: Set<string>;
  onToggleFavorite: (uuid: string) => void;
}

export const HeadlinesList: React.FC<HeadlinesListProps> = ({
  search,
  categories,
  favorites,
  onToggleFavorite,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalFound, setTotalFound] = useState(0);

  // Load articles on category/search change
  useEffect(() => {
    loadArticles(1);
  }, [search, categories]);

  const loadArticles = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);
      setCurrentIndex(0);

      try {
        const data = await fetchNews(search, categories, page);
        setArticles(data.data);
        setCurrentPage(page);
        setTotalFound(data.meta.found);

        // Prefetch next page if available
        if (data.data.length === 3) {
          console.log(`[Prefetch] Next page (${page + 1})`);
          prefetchPage(search, categories, page + 1).catch(() => {});
        }

        // Prefetch previous page if we're not on page 1
        if (page > 1) {
          console.log(`[Prefetch] Previous page (${page - 1})`);
          prefetchPage(search, categories, page - 1).catch(() => {});
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load articles';
        setError(message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    },
    [search, categories]
  );

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      setCurrentIndex(newIndex);

      // Prefetch next page when reaching index 1 (2nd article)
      if (newIndex === 1 && articles.length === 3) {
        console.log(`[Prefetch trigger] Index 1 reached, prefetching next page`);
        prefetchPage(search, categories, currentPage + 1).catch(() => {});
      }

      // Prefetch previous page when at index 0 on page > 1
      if (newIndex === 0 && currentPage > 1) {
        console.log(`[Prefetch trigger] Index 0 on page ${currentPage}, prefetching previous`);
        prefetchPage(search, categories, currentPage - 1).catch(() => {});
      }
    },
    [articles.length, currentPage, search, categories]
  );

  const goToFirstPage = () => {
    if (currentPage > 1) {
      loadArticles(1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      loadArticles(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (articles.length === 3) {
      loadArticles(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page !== currentPage) {
      loadArticles(page);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="skeleton"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Error Loading News</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => loadArticles(currentPage)}>Try Again</button>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-card">
          <div className="empty-icon">📰</div>
          <h2 className="empty-title">No Articles Found</h2>
          <p className="empty-message">
            Try adjusting your search or category filters
          </p>
        </div>
      </div>
    );
  }

  const article = articles[currentIndex];
  const isFavorited = favorites.has(article.uuid);
  const articleNumber = (currentPage - 1) * 3 + currentIndex + 1;

  return (
    <>
      <div className="article-container">
        <div className="featured-card">
          {/* Article Image */}
          <div className="article-image">
            {article.image_url ? (
              <img src={article.image_url} alt={article.title} />
            ) : (
              <div className="article-image placeholder">📸</div>
            )}
          </div>

          {/* Article Meta */}
          <div className="article-meta">
            <span className="article-source">{article.source}</span>
            <span className="article-date">
              {new Date(article.published_at).toLocaleDateString()}
            </span>
          </div>

          {/* Article Content */}
          <div className="article-content">
            <h1 className="article-title">{article.title}</h1>
            <p className="article-description">
              {article.description || article.snippet}
            </p>
          </div>

          {/* Article Footer */}
          <div className="article-footer">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-read"
              role="button"
              aria-label="View full article"
            >
              View Full Article →
            </a>
            <button
              className={`btn-favorite ${isFavorited ? 'favorited' : ''}`}
              onClick={() => onToggleFavorite(article.uuid)}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorited}
            >
              {isFavorited ? '★ Favorited' : '☆ Favorite'}
            </button>
          </div>
        </div>
      </div>

      {/* Pager */}
      <div className="pager">
        <button
          className="pager-btn"
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          aria-label="First page"
          title="First page"
        >
          «
        </button>

        <button
          className="pager-btn"
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
          title="Previous page"
        >
          ‹
        </button>

        {/* Circular page indicators */}
        {articles.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                className={`pager-btn ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => handleIndexChange(idx)}
                aria-label={`Article ${idx + 1}`}
                style={{ width: '40px', height: '40px' }}
              >
                {articleNumber - currentIndex + idx}
              </button>
            ))}
          </div>
        )}

        <button
          className="pager-btn"
          onClick={goToNextPage}
          disabled={articles.length < 3}
          aria-label="Next page"
          title="Next page"
        >
          ›
        </button>

        <div className="pager-info">
          {articleNumber}/{totalFound}
        </div>
      </div>
    </>
  );
};
