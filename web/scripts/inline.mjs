/**
 * Achata uma página do build num único HTML self-contained.
 *
 * Existe só para publicar o inventário como artifact, que exige um arquivo sem
 * nenhuma requisição externa. Não faz parte do build dos sites.
 *
 *   node scripts/inline.mjs inventario > ../inventario.html
 *
 * CSS e JS viram texto embutido; imagem, vídeo e fonte viram `data:` URI. Os
 * binários entraram quando o bloco 32 (Vídeo) chegou: até ele, nenhum espécime
 * do inventário referenciava arquivo binário — as três figuras do bloco 19 são
 * marcador tracejado ou SVG inline —, e a trava do fim do arquivo só precisava
 * olhar `/_astro/`. O primeiro espécime com capa e com `.mp4` fez o script
 * falhar, que é exatamente o que a trava existe para fazer: barulho, nunca uma
 * página achatada com requisição escondida dentro.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const pagina = process.argv[2] ?? "inventario";
const dist = new URL("../dist/", import.meta.url).pathname;
const arquivo = join(dist, pagina, "index.html");

let html = await readFile(arquivo, "utf8");

const caminhoLocal = (href) => join(dist, href.split("?")[0].replace(/^\//, ""));
const ler = async (href) => readFile(caminhoLocal(href), "utf8");

// <link rel="stylesheet" href="/_astro/....css">
for (const m of [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g)]) {
  html = html.replace(m[0], `<style>${await ler(m[1])}</style>`);
}
// <script type="module" src="/_astro/....js">
for (const m of [...html.matchAll(/<script type="module" src="([^"]+)"[^>]*><\/script>/g)]) {
  html = html.replace(m[0], `<script type="module">${await ler(m[1])}</script>`);
}

/* Os binários. `srcset` entra junto porque uma imagem otimizada pelo
   `astro:assets` nunca chega sozinha: ela chega como `src` mais três ou
   quatro candidatos, e deixar os candidatos de fora deixaria a página
   buscando os mesmos bytes por trás do `src` já embutido. */
const TIPO = {
  webp: "image/webp",
  avif: "image/avif",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  woff2: "font/woff2",
};

const comoDados = new Map();
async function dados(href) {
  if (comoDados.has(href)) return comoDados.get(href);
  const ext = href.split("?")[0].split(".").pop().toLowerCase();
  const tipo = TIPO[ext];
  if (!tipo) return null;
  let bytes;
  try {
    bytes = await readFile(caminhoLocal(href));
  } catch {
    console.error(`Arquivo referenciado que não existe no build: ${href}`);
    process.exit(1);
  }
  const uri = `data:${tipo};base64,${bytes.toString("base64")}`;
  comoDados.set(href, uri);
  return uri;
}

/* Todo caminho absoluto do próprio build, venha ele de src, poster ou srcset.
   `href` fica de fora de propósito: link para outra página do site é
   navegação, não requisição de recurso, e trocá-lo por `data:` quebraria o
   link em vez de embutir alguma coisa. */
for (const m of [...html.matchAll(/(?:src|poster)="(\/[^"]+)"/g)]) {
  const uri = await dados(m[1]);
  if (uri) html = html.replaceAll(`"${m[1]}"`, `"${uri}"`);
}
for (const m of [...html.matchAll(/srcset="([^"]+)"/g)]) {
  const partes = await Promise.all(
    m[1].split(",").map(async (item) => {
      const [href, ...desc] = item.trim().split(/\s+/);
      if (!href.startsWith("/")) return item.trim();
      const uri = await dados(href);
      return [uri ?? href, ...desc].join(" ");
    }),
  );
  html = html.replace(m[0], `srcset="${partes.join(", ")}"`);
}

/* A trava. Ela olha o build inteiro, e não só `/_astro/`: o `.mp4` do bloco 32
   mora em `public/`, e a versão anterior desta linha o teria deixado passar em
   silêncio — página "self-contained" com uma requisição dentro. */
const sobrou = [
  ...new Set(
    [...html.matchAll(/(?:src|poster)="(\/[^"]+)"/g)]
      .map((m) => m[1])
      .filter((h) => !h.startsWith("data:")),
  ),
];
if (sobrou.length) {
  console.error("Referências externas não inlinadas:", sobrou);
  process.exit(1);
}

// o artifact injeta doctype/head/body, então sai só o conteúdo
const corpo = html
  .replace(/^[\s\S]*?<head>/, "")
  .replace(/<\/head>\s*<body[^>]*>/, "")
  .replace(/<\/body>\s*<\/html>\s*$/, "");
process.stdout.write(corpo);
