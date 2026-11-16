import { describe, expect, it } from 'vitest';
import { optimizedImageUrl, responsiveImageSources } from '@/lib/imageUrl';

const storageImage = 'https://example.supabase.co/storage/v1/object/public/website-media/news/article.webp';

describe('image URL resolution', () => {
  it('keeps public Supabase Storage URLs unchanged', () => {
    expect(optimizedImageUrl(storageImage)).toBe(storageImage);
    expect(optimizedImageUrl(storageImage)).not.toContain('/storage/v1/render/image/public/');
  });

  it('does not advertise unavailable Supabase transformation variants', () => {
    expect(responsiveImageSources(storageImage)).toEqual({ src: storageImage, srcSet: undefined });
  });

  it('keeps local WebP optimization and responsive variants', () => {
    const sources = responsiveImageSources('/portfolio/indoor/indoor-9.jpg');
    expect(sources.src).toBe('/portfolio/indoor/indoor-9.webp');
    expect(sources.srcSet).toContain('/portfolio/indoor/indoor-9-320.webp 320w');
  });
});
