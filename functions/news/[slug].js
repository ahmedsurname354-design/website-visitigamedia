export async function onRequestGet({ request, params }) {
  return Response.redirect(new URL(`/id/news/${params.slug}/`, request.url), 301);
}
