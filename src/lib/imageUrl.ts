/**
 * Request a resized image from Supabase Storage while leaving local and
 * third-party URLs untouched. The original file remains the automatic
 * fallback if the URL is not from Supabase Storage.
 */
export function optimizedImageUrl(source: string, width: number, quality = 75): string {
  if (/^\/(portfolio|news)\/.+\.(png|jpe?g)$/i.test(source)) {
    return source.replace(/\.(png|jpe?g)$/i, '.webp');
  }
  if (!source.includes('/storage/v1/object/public/')) return source;

  try {
    const url = new URL(source);
    url.pathname = url.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    url.searchParams.set('width', String(width));
    url.searchParams.set('quality', String(quality));
    url.searchParams.set('resize', 'contain');
    return url.toString();
  } catch {
    return source;
  }
}

export function restoreOriginalImage(image: HTMLImageElement, source: string): void {
  if (image.src === source) return;
  image.onerror = null;
  image.src = source;
}
