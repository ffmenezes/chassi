// web/src/social/tags.ts
/**
 * Quais tags de `<head>` esta página anuncia — e, antes disso, SE ela anuncia.
 *
 * A decisão mora aqui, e não no `.astro`, pela mesma doutrina de
 * `functions/_lib`: lógica pura de um lado, adaptador fino do outro. O gate é
 * o que mais tem a perder com uma regressão silenciosa — basta alguém
 * acrescentar uma `og:` fora dele para o chassi passar a anunciar
 * `contato-recebido` e `404` ao mundo —, e um gate dentro do template não tem
 * como ser fixado por teste. Aqui tem.
 *
 * `Base.astro` só mapeia o que sai daqui para elemento, e nada mais.
 */
import type { Site } from "../sites/tipos";
import { urlAbsoluta } from "../url";

/** Um elemento de `<head>`, ainda como dado — o template é quem vira HTML. */
export type TagSocial =
  | { tag: "link"; rel: string; href: string }
  | { tag: "meta"; atributo: "property" | "name"; nome: string; conteudo: string };

export interface PaginaSocial {
  /** Ausente no inventário e na vitrine de estilo: espécime não é site. */
  site?: Site;
  /** `Astro.url.pathname`, já com a barra final que o build de diretório dá. */
  caminho: string;
  /** O título SEM a marca: quem repete a marca é `og:site_name`, e só ele. */
  titulo: string;
  descricao?: string;
  noindex?: boolean;
  tipo: "website" | "article";
  imagemCard: string;
}

const LARGURA_CARD = "1200";
const ALTURA_CARD = "630";

const og = (nome: string, conteudo: string): TagSocial =>
  ({ tag: "meta", atributo: "property", nome, conteudo });

export function tagsSociais(pagina: PaginaSocial): TagSocial[] {
  const { site, caminho, titulo, descricao, noindex, tipo, imagemCard } = pagina;

  /*
   * O gate, inteiro, em um lugar só.
   *
   * Sem `site` não há domínio, e sem domínio não existe URL absoluta:
   * inventário e vitrine de estilo são a vitrine do chassi, não um site que
   * se anuncia.
   * Em página `noindex` também não sai nada — página de serviço
   * (`contato-recebido`, `404`) não se anuncia, e um `canonical` nela apontaria
   * para uma URL que ninguém deveria compartilhar.
   */
  if (!site || noindex) return [];

  const url = urlAbsoluta(site, caminho);

  const tags: TagSocial[] = [
    { tag: "link", rel: "canonical", href: url },
    og("og:type", tipo),
    og("og:title", titulo),
  ];
  if (descricao) tags.push(og("og:description", descricao));
  tags.push(
    og("og:url", url),
    og("og:site_name", site.nome),
    og("og:image", urlAbsoluta(site, imagemCard)),
    og("og:image:width", LARGURA_CARD),
    og("og:image:height", ALTURA_CARD),
    { tag: "meta", atributo: "name", nome: "twitter:card", conteudo: "summary_large_image" },
  );
  return tags;
}
