import { PRICES, TIER_COOKIE, formatPrice, isPetCount, isProductSlug, isTier, tierForCountry, type Tier } from '../src/data/pricing';

// Localises every HTML page per request: picks the visitor's tier (cookie, else
// country), then rewrites each [data-price="slug:petCount"] and the currency
// switcher's pressed state. Pages ship static with DEFAULT_TIER prices baked in.

function resolveTier(request: Request): Tier {
  const cookie = request.headers.get('Cookie') ?? '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${TIER_COOKIE}=([^;]+)`));
  const fromCookie = match?.[1];
  if (isTier(fromCookie)) return fromCookie;
  const country = (request as Request & { cf?: IncomingRequestCfProperties }).cf?.country;
  return tierForCountry(typeof country === 'string' ? country : null);
}

export const onRequest: PagesFunction = async (context) => {
  // Drop validators so the asset server never answers 304: the browser's cached
  // copy may hold another currency's prices.
  const upstream = new Request(context.request);
  upstream.headers.delete('If-None-Match');
  upstream.headers.delete('If-Modified-Since');
  const response = await context.next(upstream);
  const type = response.headers.get('Content-Type') ?? '';
  if (!type.includes('text/html')) return response;

  const tier = resolveTier(context.request);

  const rewritten = new HTMLRewriter()
    .on('[data-price]', {
      element(el) {
        const [slug, count] = (el.getAttribute('data-price') ?? '').split(':');
        const petCount = Number(count);
        if (!isProductSlug(slug) || !isPetCount(petCount)) return;
        el.setInnerContent(formatPrice(PRICES[slug][tier][petCount], tier));
      },
    })
    .on('button[data-tier]', {
      element(el) {
        el.setAttribute('aria-pressed', el.getAttribute('data-tier') === tier ? 'true' : 'false');
      },
    })
    .transform(response);

  // The body now depends on cookie and country, so no shared caching.
  const headers = new Headers(rewritten.headers);
  headers.set('Cache-Control', 'private, no-cache');
  headers.delete('ETag');
  headers.delete('Last-Modified');
  headers.append('Vary', 'Cookie');
  return new Response(rewritten.body, { status: rewritten.status, statusText: rewritten.statusText, headers });
};
