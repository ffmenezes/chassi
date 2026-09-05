// web/src/social/fonte.ts
/**
 * A fonte do card — e ela é do CARD, não do site.
 *
 * Os cinco estilos declaram PILHA DE SISTEMA (`ui-sans-serif`, `system-ui`,
 * com `Inter` ou `Copernicus` só se a máquina do leitor tiver). O chassi não
 * embute webfont nenhuma, então o site já não tem tipografia determinística:
 * tem uma pilha. Qualquer fonte embutida aqui é a fonte do card, e é melhor
 * declarar isso do que fingir o contrário.
 *
 * Uma fonte, um peso. Restrição, não pobreza.
 *
 * O caminho é resolvido a partir de `process.cwd()`, não de
 * `new URL("./Inter-Bold.ttf", import.meta.url)` — a forma óbvia, e a
 * primeira tentada aqui. Ela funciona sob Vitest, mas o build de produção do
 * Astro empacota este módulo para dentro de `dist/.prerender/chunks/`, e
 * `import.meta.url` passa a apontar para lá — um diretório onde o `.ttf`
 * nunca é copiado. `npm run build` falhava com ENOENT nesse chunk. `cwd()`
 * não sofre esse deslocamento porque o processo de build sempre roda a
 * partir de `web/`. Não "simplifique" isto de volta para `import.meta.url`
 * sem antes rodar `npm run build` (não só os testes) e ver os PNGs saírem em
 * `dist/social/`.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import opentype from "opentype.js";
import type { Font } from "opentype.js";

let memo: Font | null = null;

export function fonteDoCard(): Font {
  if (memo) return memo;
  const bytes = readFileSync(path.join(process.cwd(), "src/social/Inter-Bold.ttf"));
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  memo = opentype.parse(buffer);
  return memo;
}
