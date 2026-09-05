/**
 * Achata uma página do build num único HTML self-contained.
 *
 * Existe só para publicar o inventário como artifact, que exige um arquivo sem
 * nenhuma requisição externa. Não faz parte do build dos sites.
 *
 *   node scripts/inline.mjs inventario > ../design-system/inventario.html
 */
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";

const pagina = process.argv[2] ?? "inventario";
const dist = new URL("../dist/", import.meta.url).pathname;
const arquivo = join(dist, pagina, "index.html");

let html = await readFile(arquivo, "utf8");

const ler = async (href) => readFile(join(dist, href.replace(/^\//, "")), "utf8");

// <link rel="stylesheet" href="/_astro/....css">
for (const m of [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g)]) {
  html = html.replace(m[0], `<style>${await ler(m[1])}</style>`);
}
// <script type="module" src="/_astro/....js">
for (const m of [...html.matchAll(/<script type="module" src="([^"]+)"[^>]*><\/script>/g)]) {
  html = html.replace(m[0], `<script type="module">${await ler(m[1])}</script>`);
}

const sobrou = [...html.matchAll(/(?:href|src)="(\/_astro\/[^"]+)"/g)].map((m) => m[1]);
if (sobrou.length) {
  console.error("Referências externas não inlinadas:", sobrou);
  process.exit(1);
}

// o artifact injeta doctype/head/body, então sai só o conteúdo
const corpo = html.replace(/^[\s\S]*?<head>/, "").replace(/<\/head>\s*<body[^>]*>/, "").replace(/<\/body>\s*<\/html>\s*$/, "");
process.stdout.write(corpo);
