import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', 'dist');
const required = ['index.html', 'study.html', 'privacy.html', 'sources.html', '404.html', 'styles.css', 'app.js', 'sw.js', 'manifest.webmanifest', 'icon.svg', 'robots.txt', 'sitemap.xml', '_headers', '_redirects'];
for (const file of required) await access(resolve(root, file));

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const app = await readFile(resolve(root, 'app.js'), 'utf8');
const sw = await readFile(resolve(root, 'sw.js'), 'utf8');
const privacy = await readFile(resolve(root, 'privacy.html'), 'utf8');
const sources = await readFile(resolve(root, 'sources.html'), 'utf8');

const localPages = new Map([
  ['index.html', html],
  ['privacy.html', privacy],
  ['sources.html', sources],
  ['study.html', await readFile(resolve(root, 'study.html'), 'utf8')],
  ['404.html', await readFile(resolve(root, '404.html'), 'utf8')]
]);

for (const [pageName, page] of localPages) {
  const links = [...page.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const link of links) {
    if (/^(?:https?:|mailto:|#)/.test(link)) continue;
    const [target, fragment] = link.split('#');
    const cleanTarget = target.split('?')[0] || pageName;
    await access(resolve(root, cleanTarget));
    if (fragment && cleanTarget.endsWith('.html')) {
      const targetHtml = localPages.get(cleanTarget) ?? await readFile(resolve(root, cleanTarget), 'utf8');
      if (!targetHtml.includes(`id="${fragment}"`)) throw new Error(`Broken fragment ${link} in ${pageName}`);
    }
  }
}

const assertions = [
  [html.includes('accepts no free-text disclosure'), 'demo boundary is visible'],
  [html.includes('id="wifi-step"'), 'network selection starts the demo'],
  [html.includes('id="connect-network"'), 'network connection control exists'],
  [html.includes('id="portal-step"'), 'gateway appears after connection'],
  [!html.includes('prototype-strip'), 'top disclaimer strip is removed'],
  [!html.includes('No live support is provided through this demonstration'), 'footer disclaimer is removed'],
  [html.includes('id="demo"'), 'interactive demo section exists'],
  [html.includes('id="quick-exit"'), 'quick exit exists'],
  [html.includes('id="support-dialog"'), 'support simulation exists'],
  [!html.includes('<textarea'), 'no free-text disclosure field exists'],
  [!html.includes('type="email"'), 'no personal email collection exists'],
  [html.includes('Early functional prototype'), 'stage is stated consistently'],
  [html.includes('privacy.html') && html.includes('sources.html'), 'public evidence and privacy links exist'],
  [!html.includes('will be added'), 'no unfinished public contact wording remains'],
  [app.includes("window.location.replace('study.html')"), 'quick exit replaces history entry'],
  [app.includes('crypto.getRandomValues'), 'demo references are generated locally'],
  [app.includes("connectionStep.hidden = false"), 'connection transition is scripted'],
  [app.includes("portalStep.hidden = false"), 'gateway reveal is scripted'],
  [sw.includes("'./index.html'"), 'main page is cached for offline access'],
  [sw.includes("'./study.html'"), 'neutral exit page is cached'],
  [sw.includes("'./privacy.html'") && sw.includes("'./sources.html'"), 'evidence and privacy pages are cached']
];

const failed = assertions.filter(([pass]) => !pass);
for (const [pass, label] of assertions) console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}`);
if (failed.length) process.exit(1);
console.log(`\n${assertions.length} checks passed.`);
