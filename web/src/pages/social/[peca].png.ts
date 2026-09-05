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
import type { APIRoute, InferGetStaticPropsType } from "astro";
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

export const GET: APIRoute<InferGetStaticPropsType<typeof getStaticPaths>> = async ({ props }) => {
  const svg = svgDoCard(siteInstitucional(), props.titulo);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      /*
       * NÃO `immutable`: a URL de cada peça não é endereçada por conteúdo —
       * `/social/<slug>.png` continua o mesmo caminho depois que o título do
       * artigo muda. `immutable` diria a todo CDN e a toda rede social que
       * faz scraping de OG image para nunca mais revalidar essa URL, e o
       * card velho ficaria preso em cache por até um ano depois de o
       * participante editar o título. Uma hora de cache é o bastante para
       * absorver carga sem travar a correção de um título.
       */
      "Cache-Control": "public, max-age=3600",
    },
  });
};
