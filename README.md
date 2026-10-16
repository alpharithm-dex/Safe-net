# SafeNet website prototype

A buildless, publicly deployed early functional prototype that presents SafeNet's offering and demonstrates the intended campus gateway, offline guidance, accessibility controls, quick exit and a consent-led support-routing journey.

- Production: https://safe-net.pages.dev/
- Repository: https://github.com/alpharithm-dex/Safe-net

## Safety boundary

This prototype intentionally accepts no free-text disclosure, sends no support request, uses no analytics and stores no personal information. The support journey is labelled as a simulation until host approval, qualified supervision, verified referral partners and privacy review are in place.

## Run locally

From this directory:

```powershell
python -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173`.

Service-worker offline behaviour requires localhost or HTTPS. Visit once while online, then use the browser's offline mode and reload to test the cached experience.

## Test

```powershell
npm test
```

The verification suite checks the demo boundary, network-to-gateway flow, quick exit, local-only reference generation, offline assets and internal links.

## Cloudflare Pages deployment

- Framework preset: None
- Build command: leave blank
- Build output directory: `dist`
- Root directory: this folder

The included `_headers` and `_redirects` files are recognised by Cloudflare Pages.

## Before live support deployment

1. Obtain written permission before showing partner names or logos.
2. Complete safeguarding, legal/privacy, security and accessibility review.
3. Replace general guidance with locally reviewed content and verified service routes.
4. Keep live support on a separately administered service; do not add disclosures to the static site or local gateway cache.

See [BRAND.md](BRAND.md) for the public voice and visual system, and [NOTICE.md](NOTICE.md) for ownership terms.
