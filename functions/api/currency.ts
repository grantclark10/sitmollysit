import { TIER_COOKIE, isTier } from '../../src/data/pricing';

const ONE_YEAR = 60 * 60 * 24 * 365;

// POST tier=US|UK|EU from the header switcher. Stores the choice in a cookie
// and sends the visitor back to the page they were on (same origin only).
export const onRequestPost: PagesFunction = async ({ request }) => {
  const form = await request.formData().catch(() => null);
  const tier = form?.get('tier');
  if (!isTier(tier)) return new Response('Unknown currency', { status: 400 });

  const url = new URL(request.url);
  let back = '/';
  const referer = request.headers.get('Referer');
  if (referer && URL.canParse(referer)) {
    const ref = new URL(referer);
    if (ref.origin === url.origin) back = ref.pathname + ref.search;
  }

  const secure = url.protocol === 'https:' ? '; Secure' : '';
  return new Response(null, {
    status: 303,
    headers: {
      Location: back,
      'Set-Cookie': `${TIER_COOKIE}=${tier}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax; HttpOnly${secure}`,
      'Cache-Control': 'no-store',
    },
  });
};
