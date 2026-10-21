export async function onRequestGet({ request, params }) {
  return Response.redirect(new URL(`/en/portfolio/${params.slug}/`, request.url), 301);
}
