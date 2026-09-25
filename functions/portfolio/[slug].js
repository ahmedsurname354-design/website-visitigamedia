export async function onRequestGet({ request, params }) {
  return Response.redirect(new URL(`/id/portfolio/${params.slug}/`, request.url), 301);
}
