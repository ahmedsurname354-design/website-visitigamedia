/**
 * Request a resized image from Supabase Storage while leaving local and
 * third-party URLs untouched. The original file remains the automatic
 * fallback if the URL is not from Supabase Storage.
 */
export function optimizedImageUrl(source: string, width: number, quality = 75): string {
  if (/^\/(portfolio|news|products)\/.+\.(png|jpe?g)$/i.test(source)) {
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

const responsiveWidths = [320, 640, 960];

function localVariantUrl(source: string, width: number): string {
  return source.replace(/(\.(?:png|jpe?g|webp))$/i, `-${width}.webp`);
}

export function responsiveImageSources(source: string, quality = 75) {
  const isLocalImage = /^\/(?:portfolio|news|products)\/.+\.(?:png|jpe?g|webp)$/i.test(source);
  if (isLocalImage) {
    const fallback = source.replace(/\.(?:png|jpe?g)$/i, '.webp');
    return {
      src: optimizedImageUrl(source, 960, quality),
      srcSet: responsiveWidths.map((width) => `${localVariantUrl(fallback, width)} ${width}w`).join(', '),
    };
  }

  if (source.includes('/storage/v1/object/public/')) {
    return {
      src: optimizedImageUrl(source, 960, quality),
      srcSet: responsiveWidths.map((width) => `${optimizedImageUrl(source, width, quality)} ${width}w`).join(', '),
    };
  }

  return { src: source, srcSet: undefined };
}

export function restoreOriginalImage(image: HTMLImageElement, source: string): void {
  if (image.src === source) return;
  image.onerror = null;
  // Clear responsive candidates before switching to the original URL.
  // Otherwise the browser may immediately select the failing Supabase
  // transform from srcset again.
  image.removeAttribute('srcset');
  image.removeAttribute('sizes');
  image.src = source;
}
