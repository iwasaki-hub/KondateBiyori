import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { siteMetadata } from '../src/config/siteMetadata.ts';

const directory = resolve(process.argv[2] ?? 'dist');
const decode = value => value.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const expected = {
  description: siteMetadata.description,
  'og:type': 'website', 'og:site_name': siteMetadata.name,
  'og:title': siteMetadata.title, 'og:description': siteMetadata.description,
  'og:url': siteMetadata.url, 'og:image': siteMetadata.image,
  'og:image:width': '1200', 'og:image:height': '630',
  'og:image:alt': siteMetadata.imageAlt, 'og:locale': 'ja_JP',
  'twitter:card': 'summary_large_image', 'twitter:title': siteMetadata.title,
  'twitter:description': siteMetadata.description, 'twitter:image': siteMetadata.image,
};

for (const file of ['index.html', 'shopping.html', 'settings.html']) {
  const html = readFileSync(resolve(directory, file), 'utf8');
  assert.match(html, /<html\b[^>]*\blang="ja"/);
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, `${file}: head missing`);
  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/g)];
  assert.equal(titles.length, 1, `${file}: duplicate/missing title`);
  assert.equal(decode(titles[0][1]), siteMetadata.title);
  const metadata = new Map();
  for (const [tag] of head.matchAll(/<meta\b[^>]*>/g)) {
    const attributes = Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], decode(m[2])]));
    const key = attributes.property ?? attributes.name;
    if (key in expected) {
      assert.ok(!metadata.has(key), `${file}: duplicate ${key}`);
      metadata.set(key, attributes.content);
    }
  }
  for (const [key, value] of Object.entries(expected)) assert.equal(metadata.get(key), value, `${file}: ${key}`);
  assert.match(html, /<svg\b/);
  assert.match(head, /<style\b/);
  const assets = [...html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)].map(m => m[1]).filter(url => url.startsWith('/_expo/') || url.startsWith('/assets/'));
  assert.ok(assets.some(url => url.endsWith('.js')), `${file}: scripts missing`);
  for (const asset of assets) assert.ok(existsSync(resolve(directory, asset.slice(1))), `${file}: missing ${asset}`);
  console.log(`PASS ${file}: title, ${metadata.size} metadata, lang, SVG, CSS, ${assets.length} assets`);
}

const png = readFileSync(resolve(directory, 'og-kondate-biyori.png'));
assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
assert.equal(png[25], 2, 'OG image must be opaque RGB');
assert.ok(png.length < 1024 * 1024, 'OG image should be below 1 MiB');
console.log(`PASS OG image: 1200 x 630 opaque PNG, ${png.length} bytes`);
