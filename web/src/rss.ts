/**
 * O feed RSS do site, montado à mão, puro.
 *
 * À mão, e não com `@astrojs/rss`: RSS 2.0 é meia dúzia de elementos, e uma
 * dependência a mais é uma coisa a mais para `scripts/atualizar` levar a todo
 * clone. O que tem de estar certo — escapar o texto, data no formato da RFC
 * 822, URL absoluta — está aqui e tem teste.
 *
 * O feed é de ARTIGOS, não do site inteiro: página jurídica, contato e página
 * de tema não entram. Ordem do mais recente para o mais antigo.
 *
 * A DATA. O artigo só tem `atualizado` (o `dateModified`), não data de
 * publicação, e é ela que vai em `pubDate` — o leitor de feed mostra o
 * artigo revisado como novidade, o que é verdade. Ela é dia de calendário sem
 * fuso (ver `data.ts`), e a RFC 822 exige hora: sai meio-dia em GMT, que cai
 * no mesmo dia em todo fuso do Brasil.
 */
import type { Site } from "./sites/tipos";
import { urlAbsoluta } from "./url";
import { LANG_HTML } from "./idioma";

export const CAMINHO_DO_FEED = "/rss.xml";

export interface ItemDoFeed {
  slug: string;
  titulo: string;
  descricao: string;
  /** YYYY-MM-DD. */
  atualizado: string;
}

const escapar = (t: string): string =>
  t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const DIAS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MESES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** `2026-07-18` → `Sat, 18 Jul 2026 12:00:00 GMT`. Nomes em inglês: é a RFC. */
export function dataRfc822(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`[rss] data "${iso}" não está em YYYY-MM-DD.`);
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const semana = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();
  return `${DIAS[semana]}, ${m[3]} ${MESES[mes - 1]} ${ano} 12:00:00 GMT`;
}

export function montarRss(site: Site, artigos: ItemDoFeed[]): string {
  const ordenados = [...artigos].sort((a, b) => b.atualizado.localeCompare(a.atualizado));
  const itens = ordenados.map((a) => {
    const link = urlAbsoluta(site, `/${a.slug}/`);
    return [
      "<item>",
      `<title>${escapar(a.titulo)}</title>`,
      `<link>${link}</link>`,
      `<guid isPermaLink="true">${link}</guid>`,
      `<description>${escapar(a.descricao)}</description>`,
      `<pubDate>${dataRfc822(a.atualizado)}</pubDate>`,
      "</item>",
    ].join("");
  });
  const ultimo = ordenados[0] ? `<lastBuildDate>${dataRfc822(ordenados[0].atualizado)}</lastBuildDate>` : "";
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>` +
    `<title>${escapar(site.nome)}</title>` +
    `<link>${urlAbsoluta(site, "/")}</link>` +
    `<description>${escapar(`Artigos de ${site.nome}`)}</description>` +
    `<language>${LANG_HTML}</language>` +
    ultimo +
    `<atom:link href="${urlAbsoluta(site, CAMINHO_DO_FEED)}" rel="self" type="application/rss+xml"/>` +
    itens.join("") +
    `</channel></rss>\n`
  );
}
