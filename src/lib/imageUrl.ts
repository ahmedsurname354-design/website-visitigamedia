/**
 * Resolve an image URL while keeping public Supabase Storage objects on their
 * original URL. Image transformation is disabled for this project because
 * the render endpoint is not available on the configured storage setup.
 */
export function optimizedImageUrl(source: string): string {
  if (/^\/(portfolio|news|products)\/.+\.(png|jpe?g)$/i.test(source)) {
    return source.replace(/\.(png|jpe?g)$/i, '.webp');
  }
  return source;
}

const responsiveWidths = [320, 640, 960];

function localVariantUrl(source: string, width: number): string {
  return source.replace(/(\.(?:png|jpe?g|webp))$/i, `-${width}.webp`);
}

export function responsiveImageSources(source: string) {
  const isLocalImage = /^\/(?:portfolio|news|products)\/.+\.(?:png|jpe?g|webp)$/i.test(source);
  if (isLocalImage) {
    // News covers currently ship with one optimized WebP file, not generated
    // width variants. Do not advertise missing srcset candidates to the browser.
    if (/^\/news\//i.test(source)) {
      return { src: optimizedImageUrl(source), srcSet: undefined };
    }
    return {
      src: optimizedImageUrl(source),
      srcSet: responsiveWidths.map((width) => `${localVariantUrl(source, width)} ${width}w`).join(', '),
    };
  }

  if (source.includes('/storage/v1/object/public/')) {
    return { src: source, srcSet: undefined };
  }

  return { src: source, srcSet: undefined };
}
