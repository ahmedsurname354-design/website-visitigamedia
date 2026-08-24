export interface Portfolio {
  id: string;
  title: string;
  image_url: string;
  client: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type PortfolioInput = Pick<Portfolio, 'title' | 'image_url' | 'client' | 'category' | 'description'>;

export interface NewsRecord {
  id: string;
  title: string;
  cover_image: string;
  content: string;
  author: string;
  category: string;
  excerpt: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type NewsInput = Pick<NewsRecord, 'title' | 'cover_image' | 'content' | 'author' | 'category' | 'excerpt' | 'published_at'>;
