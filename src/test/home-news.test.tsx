import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import HomeNewsSection from '@/components/HomeNewsSection';
import { LanguageProvider } from '@/i18n';
import type { NewsRecord } from '@/types/admin';

const baseArticle: NewsRecord = {
  id: '1', slug: 'article-one', title: 'Artikel satu', cover_image: '/news/one.webp', content: '', author: 'Visitiga', category: 'Teknologi', excerpt: 'Ringkasan artikel satu.', published_at: '2026-11-01', created_at: '', updated_at: '',
  content_en: { title: 'Article one', content: '', author: 'Visitiga', category: 'Technology', excerpt: 'Article one excerpt.', seo_title: '', seo_description: '', cover_alt: 'Article one cover', target_keyword: '' },
};

const articles = [
  baseArticle,
  { ...baseArticle, id: '2', slug: 'article-two', title: 'Artikel dua', published_at: '2026-11-10' },
  { ...baseArticle, id: '3', slug: 'article-three', title: 'Artikel tiga', published_at: '2026-11-05' },
  { ...baseArticle, id: '4', slug: 'article-four', title: 'Artikel empat', published_at: '2026-10-20' },
];

function renderSection(items: NewsRecord[], path = '/id/') {
  window.history.pushState({}, '', path);
  return render(<LanguageProvider><MemoryRouter><HomeNewsSection articles={items} /></MemoryRouter></LanguageProvider>);
}

afterEach(() => window.history.pushState({}, '', '/'));

describe('homepage news section', () => {
  it('renders the three newest published articles in Indonesian with localized links', () => {
    renderSection(articles);
    expect(screen.getByRole('heading', { name: 'Berita terbaru' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByText('Artikel dua')).toBeInTheDocument();
    expect(screen.queryByText('Artikel empat')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Artikel/ })[0]).toHaveAttribute('href', '/id/news/article-two/');
  });

  it('renders English article copy and the all-news link', () => {
    renderSection(articles, '/en/');
    expect(screen.getByRole('heading', { name: 'Latest news' })).toBeInTheDocument();
    expect(screen.getAllByText('Article one excerpt.')).toHaveLength(3);
    expect(screen.getByRole('link', { name: /View all news/ })).toHaveAttribute('href', '/en/news/');
  });

  it('renders nothing when there are no published articles', () => {
    const { container } = renderSection([{ ...baseArticle, published_at: null }]);
    expect(container.firstChild).toBeNull();
  });
});
