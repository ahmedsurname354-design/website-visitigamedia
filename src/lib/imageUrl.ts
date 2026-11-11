/**
 * Request a resized image from Supabase Storage while leaving local and
 * third-party URLs untouched.
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
    throw new Error('Invalid media URL.');
  }
}

const responsiveWidths = [320, 640, 960];

function localVariantUrl(source: string, width: number): string {
  return source.replace(/(\.(?:png|jpe?g|webp))$/i, `-${width}.webp`);
}

export function responsiveImageSources(source: string, quality = 75) {
  const isLocalImage = /^\/(?:portfolio|news|products)\/.+\.(?:png|jpe?g|webp)$/i.test(source);
  if (isLocalImage) {
    return {
      src: optimizedImageUrl(source, 960, quality),
      srcSet: responsiveWidths.map((width) => `${localVariantUrl(source, width)} ${width}w`).join(', '),
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
