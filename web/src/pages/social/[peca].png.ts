// web/src/pages/social/[peca].png.ts
/**
 * O card social de cada peça, assado no build.
 *
 * A JUNTA é o `getStaticPaths`: hoje ele lê os artigos de `mock/artigos.ts`,
 * exatamente como `pages/[artigo].astro`, e é só isso que muda quando a
 * renderização a partir de markdown chegar. A rota não muda.
 *
 * `padrao` é o card das institucionais e leva o NOME DO SITE como título — não
 * uma frase inventada, porque o nome é o que a home de fato afirma.
 */
import type { APIRoute } from "astro";
import sharp from "sharp";
import { siteInstitucional } from "../../institucional/dados";
import { ARTIGOS } from "../../mock/artigos";
import { svgDoCard } from "../../social/arte";

export function getStaticPaths() {
  const site = siteInstitucional();
  return [
    { params: { peca: "padrao" }, props: { titulo: site.nome } },
    ...ARTIGOS.map((a) => ({ params: { peca: a.slug }, props: { titulo: a.titulo } })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const svg = svgDoCard(siteInstitucional(), (props as { titulo: string }).titulo);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
