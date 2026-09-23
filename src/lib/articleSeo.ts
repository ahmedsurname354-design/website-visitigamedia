export function normalizeArticleHeadings(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html');
  document.body.querySelectorAll('h1').forEach((heading) => {
    const replacement = document.createElement('h2');
    for (const attribute of heading.attributes) replacement.setAttribute(attribute.name, attribute.value);
    replacement.append(...Array.from(heading.childNodes));
    heading.replaceWith(replacement);
  });
  return document.body.innerHTML;
}
