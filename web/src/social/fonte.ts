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
 */
import { readFileSync } from "node:fs";
import opentype from "opentype.js";
import type { Font } from "opentype.js";

let memo: Font | null = null;

export function fonteDoCard(): Font {
  if (memo) return memo;
  const bytes = readFileSync(new URL("./Inter-Bold.ttf", import.meta.url));
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  memo = opentype.parse(buffer);
  return memo;
}
