export interface Portfolio {
  id: string;
  title: string;
  image_url: string;
  client: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface NewsArticleRecord {
  id: string;
  title: string;
  cover_image: string;
  content: string;
  author: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductInput = Pick<Product, 'name' | 'price' | 'image_url' | 'category' | 'description'>;
