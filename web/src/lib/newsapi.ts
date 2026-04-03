// web/src/lib/newsapi.ts

export interface Article {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string | null;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
  relevance_score: number | null;
}

export interface NewsResponse {
  data: Article[];
  meta: {
    found: number;
    returned: number;
    limit: number;
    offset: number;
  };
}

// In-memory cache for pages
const pageCache: Record<string, NewsResponse> = {};

function getCacheKey(search: string, categories: string, page: number): string {
  return `${search || ''}:${categories || ''}:${page}`;
}

export async function fetchNews(
  search: string = '',
  categories: string = 'tech',
  page: number = 1
): Promise<NewsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: '3',
    language: 'en',
  });

  if (search.trim()) {
    params.append('search', search.trim());
  } else if (categories.trim()) {
    params.append('categories', categories.trim());
  }

  const cacheKey = getCacheKey(search, categories, page);
  if (pageCache[cacheKey]) {
    console.log(`[Cache HIT] ${cacheKey}`);
    return pageCache[cacheKey];
  }

  try {
    const response = await fetch(`/api/news/all?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    
    // Cache the result
    pageCache[cacheKey] = data;
    console.log(`[Cache STORE] ${cacheKey}`);
    
    return data;
  } catch (error) {
    throw error;
  }
}

export function clearCache(search: string = '', categories: string = 'tech'): void {
  // Clear all pages for this search/category combination
  const prefix = `${search || ''}:${categories || ''}:`;
  Object.keys(pageCache).forEach((key) => {
    if (key.startsWith(prefix)) {
      delete pageCache[key];
    }
  });
  console.log(`[Cache CLEAR] ${prefix}*`);
}

export function prefetchPage(
  search: string = '',
  categories: string = 'tech',
  page: number = 1
): Promise<NewsResponse> {
  return fetchNews(search, categories, page);
}
