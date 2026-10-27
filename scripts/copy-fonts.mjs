// Copies the self-hosted woff2 files (and their OFL licences) out of the
// pinned @fontsource-variable packages into fonts/.
import { copyFileSync, mkdirSync } from 'node:fs';

const fonts = [
  ['inter', 'inter-latin-wght-normal.woff2'],
  ['sora', 'sora-latin-wght-normal.woff2'],
];

mkdirSync('fonts', { recursive: true });
for (const [pkg, file] of fonts) {
  const dir = `node_modules/@fontsource-variable/${pkg}`;
  copyFileSync(`${dir}/files/${file}`, `fonts/${file}`);
  copyFileSync(`${dir}/LICENSE`, `fonts/${pkg}-OFL.txt`);
  console.log(`fonts/${file}`);
}
