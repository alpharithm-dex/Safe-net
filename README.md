# SafeNet website prototype

A buildless, Cloudflare Pages-ready prototype that presents SafeNet's offering and demonstrates the intended campus gateway, offline guidance, accessibility controls, quick exit and a consent-led support-routing journey.

## Safety boundary

This prototype intentionally accepts no free-text disclosure, sends no support request, uses no analytics and stores no personal information. The support journey is labelled as a simulation until host approval, qualified supervision, verified referral partners and privacy review are in place.

## Run locally

From this directory:

```powershell
python -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173`.

Service-worker offline behaviour requires localhost or HTTPS. Visit once while online, then use the browser's offline mode and reload to test the cached experience.

## Deploy to Cloudflare Pages later

- Framework preset: None
- Build command: leave blank
- Build output directory: `dist`
- Root directory: this folder

The included `_headers` and `_redirects` files are recognised by Cloudflare Pages.

## Before public deployment

1. Replace the prototype partnership modal with a verified team contact channel.
2. Obtain written permission before showing partner names or logos.
3. Complete safeguarding, legal/privacy, security and accessibility review.
4. Replace general guidance with locally reviewed content and verified service routes.
5. Keep live support on a separately administered service; do not add disclosures to the static site or local gateway cache.
