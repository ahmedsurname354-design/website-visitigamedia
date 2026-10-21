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
  content_id?: PortfolioLocaleContent;
  content_en?: PortfolioLocaleContent;
}

export interface PortfolioLocaleContent { title: string; client: string; category: string; description: string; overview: string; challenge: string; solution: string; seo_title: string; seo_description: string; }

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
  content_id?: NewsLocaleContent;
  content_en?: NewsLocaleContent;
}

export interface NewsLocaleContent { title: string; content: string; author: string; category: string; excerpt: string; seo_title: string; seo_description: string; cover_alt: string; target_keyword: string; }

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
  content_id?: ProductLocaleContent;
  content_en?: ProductLocaleContent;
}

export interface ProductLocaleContent { name: string; category: string; description: string; label: string; }

export type ProductInput = Pick<Product, 'name' | 'image_url' | 'category' | 'description' | 'label' | 'color' | 'accent' | 'sort_order'>;

export interface HomepageStat { value: string; label: string; }
export interface HomepageServiceCard { title: string; description: string; tags: string[]; action: string; }
export interface HomepageLocaleContent {
  hero: { eyebrow: string; trustNotice: string; titleLine1: string; titleLine2: string; titleLine3: string; subtitle: string; viewServices: string; viewPortfolio: string };
  stats: HomepageStat[];
  services: { sectionLabel: string; heading: string; linkLabel: string; cards: HomepageServiceCard[] };
  about: { sectionLabel: string; heading: string; subtitle: string; features: string[]; buttonLabel: string; clientProofLabel: string };
  cta: { title: string; subtitle: string; callNow: string; emailUs: string; phoneInfo: string; emailInfo: string; locationInfo: string };
}

export interface HomepageContent {
  id: number;
  hero_image_url: string;
  about_image_url: string;
  content_id: HomepageLocaleContent;
  content_en: HomepageLocaleContent;
  featured_portfolio_ids: string[];
  updated_at: string;
}

export type HomepageContentInput = Omit<HomepageContent, 'id' | 'updated_at'>;

export interface ProductCatalogue {
  id: number;
  title: string;
  file_url: string;
  updated_at: string;
  title_id?: string;
  title_en?: string;
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
  content_id?: ServiceContentLocale;
  content_en?: ServiceContentLocale;
}

export interface ServiceContentLocale { eyebrow: string; heading: string; heading_accent: string; cards: ServiceCard[]; showreel_eyebrow: string; showreel_heading: string; showreel_accent: string; showreel_description: string; primary_button_text: string; secondary_button_text: string; }

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
