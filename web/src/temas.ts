/**
 * Temas: o vocabulário fechado do site, e o que cada artigo faz com ele.
 *
 * Puro, sem Astro, pela razão de sempre: trava que só vive no frontmatter de
 * uma página não tem teste que discrimina. As páginas `/temas/` e a linha de
 * temas do cabeçalho do artigo só chamam o que está aqui.
 *
 * POR QUE VOCABULÁRIO FECHADO, E NÃO TAG LIVRE. Tag livre é o caminho de
 * menor esforço no dia de publicar e o de maior custo um ano depois: "wifi",
 * "wi-fi" e "rede sem fio" viram três páginas, cada uma com um artigo, e o
 * buscador lê as três como conteúdo fino. O site declara os temas uma vez, em
 * `web/src/sites/<slug>.ts`, com nome e descrição; o artigo só escolhe entre
 * eles. Tema fora da lista quebra a build e diz qual artigo e qual tema.
 *
 * POR QUE O TETO DE TRÊS POR ARTIGO. Artigo marcado com oito temas não está
 * classificado, está espalhado: aparece em toda página de tema e não
 * pertence a nenhuma. Três é o bastante para o artigo que cruza dois assuntos
 * e mais um recorte.
 *
 * A PÁGINA DO TEMA É A "BUSCA DE RELACIONADOS". O site é estático, sem busca
 * no servidor; a lista de artigos de um tema é gerada na build e mora numa
 * URL própria, que o crawler lê inteira e que qualquer link pode apontar.
 */
import type { Site, Tema } from "./sites/tipos";

export type { Tema };

export const TETO_DE_TEMAS_POR_ARTIGO = 3;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** O mínimo que um artigo precisa ter para ser classificado. */
export interface ArtigoComTemas {
  slug: string;
  /** Slugs de tema, na ordem em que o artigo quer exibi-los. */
  temas?: string[];
}

export const caminhoDoTema = (slug: string): string => `/temas/${slug}/`;
export const CAMINHO_DOS_TEMAS = "/temas/";

/** Roda no build, dentro de `validar` (`sites/validacao.ts`), uma vez por site. */
export function validarTemas(site: Site): void {
  if (site.temas === undefined) return;
  const onde = `Arrume em web/src/sites/${site.slug}.ts.`;
  if (site.temas.length === 0) {
    throw new Error(
      `[temas] ${site.slug} declara temas como lista vazia. Ou o site tem vocabulário, ou ` +
        `o campo nem existe — apague "temas" em vez de deixá-lo vazio.`,
    );
  }
  const slugs = new Set<string>();
  const nomes = new Set<string>();
  for (const t of site.temas) {
    if (!SLUG.test(t.slug)) {
      throw new Error(
        `[temas] ${site.slug} declara o tema "${t.slug}", e slug de tema vira URL: só ` +
          `minúsculas sem acento, números e hífen ("home-office"). ${onde}`,
      );
    }
    if (slugs.has(t.slug)) {
      throw new Error(`[temas] ${site.slug} declara o tema "${t.slug}" duas vezes. ${onde}`);
    }
    slugs.add(t.slug);
    if (!t.nome.trim()) {
      throw new Error(`[temas] ${site.slug}: o tema "${t.slug}" está sem nome. ${onde}`);
    }
    const nome = t.nome.trim().toLocaleLowerCase("pt-BR");
    if (nomes.has(nome)) {
      throw new Error(
        `[temas] ${site.slug} tem dois temas chamados "${t.nome}". Dois temas com o mesmo ` +
          `nome são um tema só em duas URLs. ${onde}`,
      );
    }
    nomes.add(nome);
    if (!t.descricao.trim()) {
      throw new Error(
        `[temas] ${site.slug}: o tema "${t.slug}" está sem descrição. Ela abre a página do ` +
          `tema e é o description dela; sem ela, a página é só uma lista de cards. ${onde}`,
      );
    }
  }
}

/**
 * Os temas de um artigo, já resolvidos contra o vocabulário, na ordem do
 * artigo. Site sem vocabulário devolve lista vazia: a taxonomia não existe
 * nele (ver `Site.temas`).
 */
export function temasDoArtigo(site: Site, artigo: ArtigoComTemas): Tema[] {
  if (!site.temas || !artigo.temas) return [];
  if (artigo.temas.length > TETO_DE_TEMAS_POR_ARTIGO) {
    throw new Error(
      `[temas] o artigo "${artigo.slug}" tem ${artigo.temas.length} temas, e o teto é ` +
        `${TETO_DE_TEMAS_POR_ARTIGO}. Artigo em todo tema não pertence a nenhum.`,
    );
  }
  const vistos = new Set<string>();
  return artigo.temas.map((slug) => {
    if (vistos.has(slug)) {
      throw new Error(`[temas] o artigo "${artigo.slug}" repete o tema "${slug}".`);
    }
    vistos.add(slug);
    const tema = site.temas!.find((t) => t.slug === slug);
    if (!tema) {
      throw new Error(
        `[temas] o artigo "${artigo.slug}" usa o tema "${slug}", que ${site.slug} não ` +
          `declara. Os que existem: ${site.temas!.map((t) => t.slug).join(", ")}. O ` +
          `vocabulário é fechado: declare o tema em web/src/sites/${site.slug}.ts ou ` +
          `troque o do artigo.`,
      );
    }
    return tema;
  });
}

/**
 * Cada tema com os artigos que o usam, na ordem em que o site declarou os
 * temas e na ordem em que os artigos chegaram. Tema sem artigo fica de fora:
 * página de tema vazia é página que só existe para o buscador achar fina.
 *
 * Classifica TODOS os artigos antes de devolver, então um artigo com tema
 * fora do vocabulário quebra a build aqui também — mesmo que nenhuma página
 * dele fosse gerada nesta chamada.
 */
export function artigosPorTema<A extends ArtigoComTemas>(
  site: Site,
  artigos: A[],
): { tema: Tema; artigos: A[] }[] {
  if (!site.temas) return [];
  const resolvidos = artigos.map((a) => ({ artigo: a, temas: temasDoArtigo(site, a) }));
  return site.temas
    .map((tema) => ({
      tema,
      artigos: resolvidos.filter((r) => r.temas.includes(tema)).map((r) => r.artigo),
    }))
    .filter((g) => g.artigos.length > 0);
}
