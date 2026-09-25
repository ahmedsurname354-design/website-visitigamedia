export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  client: string;
  category: string;
  description: string;
  overview: string;
  challenge: string;
  solution: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export type PortfolioInput = Pick<Portfolio, 'title' | 'slug' | 'image_url' | 'client' | 'category' | 'description' | 'overview' | 'challenge' | 'solution' | 'seo_title' | 'seo_description'>;

export interface PortfolioSlugAlias {
  old_slug: string;
  portfolio_id: string;
}

export interface NewsRecord {
  id: string;
  slug: string;
  title: string;
  cover_image: string;
  content: string;
  author: string;
  category: string;
  excerpt: string;
  seo_title?: string;
  seo_description?: string;
  cover_alt?: string;
  target_keyword?: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type NewsInput = Pick<NewsRecord, 'title' | 'slug' | 'cover_image' | 'content' | 'author' | 'category' | 'excerpt' | 'seo_title' | 'seo_description' | 'cover_alt' | 'target_keyword' | 'published_at'>;

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

export interface ProductCatalogue {
  id: number;
  title: string;
  file_url: string;
  updated_at: string;
}

export interface ServiceCard {
  title: string;
  description: string;
  tags: string[];
  action: string;
}

export interface ServiceContent {
  id: number;
  eyebrow: string;
  heading: string;
  heading_accent: string;
  cards: ServiceCard[];
  showreel_eyebrow: string;
  showreel_heading: string;
  showreel_accent: string;
  showreel_description: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  video_webm_url: string;
  video_mp4_url: string;
  video_poster_url: string;
  updated_at: string;
}

export type ServiceContentInput = Omit<ServiceContent, 'id' | 'updated_at'>;

export type ServiceLandingSlug = 'led-indoor' | 'videotron-outdoor' | 'rental-led' | 'media-konvensional';

export interface ServiceLandingLocaleContent {
  eyebrow: string;
  title: string;
  description: string;
  intro_eyebrow: string;
  intro_title: string;
  intro: string;
  considerations_title: string;
  considerations: string[];
  process_eyebrow: string;
  process_title: string;
  process: string[];
  portfolio_eyebrow: string;
  portfolio_title: string;
  portfolio_link_text: string;
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  back_text: string;
}

export interface ServiceLandingContent {
  slug: ServiceLandingSlug;
  hero_image_url: string;
  content_id: ServiceLandingLocaleContent;
  content_en: ServiceLandingLocaleContent;
  seo_title_id: string;
  seo_description_id: string;
  seo_title_en: string;
  seo_description_en: string;
  related_portfolio_ids: string[];
  updated_at: string;
}

export type ServiceLandingInput = Omit<ServiceLandingContent, 'updated_at'>;

export type LeadStatus = 'new' | 'contacted' | 'completed' | 'spam';

export interface ContactLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: LeadStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}
