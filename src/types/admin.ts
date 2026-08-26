export interface Portfolio {
  id: string;
  title: string;
  image_url: string;
  client: string;
  category: string;
  description: string;
  overview: string;
  challenge: string;
  solution: string;
  created_at: string;
  updated_at: string;
}

export type PortfolioInput = Pick<Portfolio, 'title' | 'image_url' | 'client' | 'category' | 'description' | 'overview' | 'challenge' | 'solution'>;

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

export interface Product {
  id: string;
  name: string;
  image_url: string;
  category: string;
  description: string;
  label: string;
  color: string;
  accent: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductInput = Pick<Product, 'name' | 'image_url' | 'category' | 'description' | 'label' | 'color' | 'accent' | 'sort_order'>;
