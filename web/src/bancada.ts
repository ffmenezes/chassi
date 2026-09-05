/**
 * A ordem da bancada, calculada — nunca digitada.
 *
 * Por que isto existe. A bancada nasceu com uma lista de `<Palco id={N}>`
 * escrita à mão, e o índice ao lado agrupando por estado. Duas ordens, duas
 * fontes, e a divergência era questão de tempo: já aconteceu com os blocos 23
 * e 24, que sumiram da bancada sem sumir do catálogo (commit `162ad1f`).
 * `SITE_DEMO.blocos` deixou de ser digitado naquele conserto e virou
 * `CATALOGO.map(...)`; o que sobrou manual foi justamente a ORDEM da página, e
 * é ela que este arquivo tira das mãos de quem edita.
 *
 * A regra é uma frase: a página é o índice. Mesmo agrupamento, mesma ordem,
 * mesma fonte — `CATALOGO` para a sequência, `GRUPOS` para os cortes.
 *
 * Funções puras e sem Astro, para rodarem no vitest: trava que só existe
 * dentro de um `.astro` não tem como falhar num teste, e trava sem teste que
 * discrimina é confiança falsa.
 */
import type { Bloco, BlocoId, Estado, Grupo } from "./catalogo";

/**
 * Os blocos de um grupo, na ordem em que o catálogo os declara.
 *
 * A ordem do catálogo é a de LEITURA, não a numérica — o 19 lê entre o 10 e o
 * 11 — e é por isso que a função não ordena nada: ela filtra e preserva.
 */
export function idsDoGrupo(catalogo: readonly Bloco[], grupo: Grupo): BlocoId[] {
  return catalogo.filter((b) => grupo.estados.includes(b.estado)).map((b) => b.id);
}

/** A sequência inteira da página: grupo a grupo, e dentro de cada um a ordem
 *  de leitura do catálogo. */
export function ordemDaBancada(
  catalogo: readonly Bloco[],
  grupos: readonly Grupo[]
): BlocoId[] {
  return grupos.flatMap((g) => idsDoGrupo(catalogo, g));
}

/**
 * A trava de cobertura, e ela guarda uma armadilha específica.
 *
 * `GRUPOS` é uma lista de estados por rótulo, escrita à mão. No dia em que
 * alguém acrescentar um `Estado` novo ao catálogo e esquecer de dar grupo a
 * ele, os blocos daquele estado somem — do índice E da página — sem nenhum
 * erro, porque some quem filtra, não quem é filtrado. O sintoma seria a
 * contagem cair sem ninguém mexer em bloco nenhum.
 *
 * O contrário também quebra a build: o mesmo estado em dois grupos faria o
 * bloco aparecer duas vezes, com o mesmo `id` de âncora nos dois lugares — e
 * aí o link do índice passa a levar a um lugar arbitrário.
 */
export function conferirCobertura(
  catalogo: readonly Bloco[],
  grupos: readonly Grupo[]
): void {
  const contagem = new Map<Estado, number>();
  for (const g of grupos) {
    for (const e of g.estados) contagem.set(e, (contagem.get(e) ?? 0) + 1);
  }

  const estadosUsados = [...new Set(catalogo.map((b) => b.estado))];

  const orfaos = estadosUsados.filter((e) => !contagem.has(e));
  if (orfaos.length) {
    throw new Error(
      `[bancada] o(s) estado(s) ${orfaos.join(", ")} não pertence(m) a nenhum grupo de ` +
        `GRUPOS. Bloco de estado sem grupo não some com erro: ele some em silêncio, do ` +
        `índice e da página, e a contagem cai sem ninguém ter mexido em bloco nenhum. ` +
        `Todo estado novo em catalogo.ts ganha um grupo no mesmo commit.`
    );
  }

  const repetidos = [...contagem].filter(([, n]) => n > 1).map(([e]) => e);
  if (repetidos.length) {
    throw new Error(
      `[bancada] o(s) estado(s) ${repetidos.join(", ")} aparece(m) em mais de um grupo ` +
        `de GRUPOS. O bloco nasceria duas vezes na página, as duas com o mesmo id de ` +
        `âncora — e o link do índice passaria a levar a um lugar arbitrário.`
    );
  }
}
