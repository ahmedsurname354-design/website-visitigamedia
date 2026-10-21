export async function onRequestGet({ request, params }) {
  return Response.redirect(new URL(`/en/news/${params.slug}/`, request.url), 301);
}
