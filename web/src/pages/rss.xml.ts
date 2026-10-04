/**
 * O feed RSS, em `/rss.xml`. A montagem é `../rss.ts`, pura e testada; aqui
 * só se escolhe a fonte e se devolve o XML.
 *
 * A JUNTA é a mesma de `[artigo].astro` e de `social/[peca].png.ts`: hoje a
 * fonte é `mock/artigos.ts`, e é só ela que troca quando o markdown chegar.
 */
import type { APIRoute } from "astro";
import { ARTIGOS } from "../mock/artigos";
import { siteInstitucional } from "../institucional/dados";
import { montarRss } from "../rss";

export const GET: APIRoute = () =>
  new Response(montarRss(siteInstitucional(), ARTIGOS), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
