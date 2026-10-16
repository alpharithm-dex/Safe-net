import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', 'dist');
const required = ['index.html', 'study.html', 'styles.css', 'app.js', 'sw.js', 'manifest.webmanifest', 'icon.svg', '_headers', '_redirects'];
for (const file of required) await access(resolve(root, file));

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const app = await readFile(resolve(root, 'app.js'), 'utf8');
const sw = await readFile(resolve(root, 'sw.js'), 'utf8');

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
  [app.includes("window.location.replace('study.html')"), 'quick exit replaces history entry'],
  [app.includes('crypto.getRandomValues'), 'demo references are generated locally'],
  [app.includes("connectionStep.hidden = false"), 'connection transition is scripted'],
  [app.includes("portalStep.hidden = false"), 'gateway reveal is scripted'],
  [sw.includes("'./index.html'"), 'main page is cached for offline access'],
  [sw.includes("'./study.html'"), 'neutral exit page is cached']
];

const failed = assertions.filter(([pass]) => !pass);
for (const [pass, label] of assertions) console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}`);
if (failed.length) process.exit(1);
console.log(`\n${assertions.length} checks passed.`);
