/**
 * A ordem do inventário, calculada — nunca digitada.
 *
 * Por que isto existe. O inventário nasceu com uma lista de `<Palco id={N}>`
 * escrita à mão, e o índice ao lado agrupando por estado. Duas ordens, duas
 * fontes, e a divergência era questão de tempo: já aconteceu com os blocos 23
 * e 24, que sumiram do inventário sem sumir do catálogo (commit `162ad1f`).
 * `SITE_DEMO.blocos` deixou de ser digitado naquele conserto e virou
 * `CATALOGO.map(...)`; o que sobrou manual foi justamente a ORDEM da página, e
 * é ela que este arquivo tira das mãos de quem edita.
 *
 * A regra é uma frase: a página é o índice. Mesmo agrupamento, mesma ordem,
 * mesma fonte — `CATALOGO` para a sequência, `GRUPOS` para os cortes. O corte
 * em si mudou de eixo (`estado` → `categoria`, ver o comentário de `GRUPOS`
 * em `catalogo.ts`), mas o mecanismo é o mesmo de sempre: cada bloco declara
 * o que precisa, e ninguém mantém lista à parte.
 *
 * Funções puras e sem Astro, para rodarem no vitest: trava que só existe
 * dentro de um `.astro` não tem como falhar num teste, e trava sem teste que
 * discrimina é confiança falsa.
 */
import type { Bloco, BlocoId, Categoria, Grupo } from "./catalogo";

/**
 * Os blocos de um grupo, na ordem em que o catálogo os declara.
 *
 * A ordem do catálogo é a de LEITURA, não a numérica — o 19 lê entre o 10 e o
 * 11 — e é por isso que a função não ordena nada: ela filtra e preserva.
 */
export function idsDoGrupo(catalogo: readonly Bloco[], grupo: Grupo): BlocoId[] {
  return catalogo.filter((b) => grupo.categorias.includes(b.categoria)).map((b) => b.id);
}

/** A sequência inteira da página: grupo a grupo, e dentro de cada um a ordem
 *  de leitura do catálogo. */
export function ordemDoInventario(
  catalogo: readonly Bloco[],
  grupos: readonly Grupo[]
): BlocoId[] {
  return grupos.flatMap((g) => idsDoGrupo(catalogo, g));
}

/**
 * A trava de cobertura, e ela guarda uma armadilha específica.
 *
 * `GRUPOS` é uma lista de categorias por rótulo, escrita à mão. No dia em que
 * alguém acrescentar uma `Categoria` nova ao catálogo e esquecer de dar grupo
 * a ela, os blocos daquela categoria somem — do índice E da página — sem
 * nenhum erro, porque some quem filtra, não quem é filtrado. O sintoma seria
 * a contagem cair sem ninguém mexer em bloco nenhum.
 *
 * O contrário também quebra a build: a mesma categoria em dois grupos faria o
 * bloco aparecer duas vezes, com o mesmo `id` de âncora nos dois lugares — e
 * aí o link do índice passa a levar a um lugar arbitrário.
 */
export function conferirCobertura(
  catalogo: readonly Bloco[],
  grupos: readonly Grupo[]
): void {
  const contagem = new Map<Categoria, number>();
  for (const g of grupos) {
    for (const c of g.categorias) contagem.set(c, (contagem.get(c) ?? 0) + 1);
  }

  const categoriasUsadas = [...new Set(catalogo.map((b) => b.categoria))];

  const orfaos = categoriasUsadas.filter((c) => !contagem.has(c));
  if (orfaos.length) {
    throw new Error(
      `[inventario] a(s) categoria(s) ${orfaos.join(", ")} não pertence(m) a nenhum grupo de ` +
        `GRUPOS. Bloco de categoria sem grupo não some com erro: ele some em silêncio, do ` +
        `índice e da página, e a contagem cai sem ninguém ter mexido em bloco nenhum. ` +
        `Toda categoria nova em catalogo.ts ganha um grupo no mesmo commit.`
    );
  }

  const repetidos = [...contagem].filter(([, n]) => n > 1).map(([c]) => c);
  if (repetidos.length) {
    throw new Error(
      `[inventario] a(s) categoria(s) ${repetidos.join(", ")} aparece(m) em mais de um grupo ` +
        `de GRUPOS. O bloco nasceria duas vezes na página, as duas com o mesmo id de ` +
        `âncora — e o link do índice passaria a levar a um lugar arbitrário.`
    );
  }
}

/**
 * A trava do bloco sem categoria — a outra ponta da mesma doutrina.
 *
 * `conferirCobertura` pressupõe que todo bloco TEM uma `categoria` e checa se
 * ela tem grupo; esta função checa o passo anterior, que o tipo `Bloco` já
 * torna obrigatório em `npm run check` mas que só quebra `npm run build` de
 * verdade se houver uma trava em tempo de execução — a build do Astro não
 * type-checa `.ts` importado. Sem esta trava, um bloco sem `categoria`
 * simplesmente não bate com `includes` de grupo nenhum e some do inventário em
 * silêncio, do jeito exato que o estado sem grupo já sumia antes de
 * `conferirCobertura` existir.
 */
export function conferirCategorias(catalogo: readonly Bloco[]): void {
  const semCategoria = catalogo.filter((b) => !b.categoria);
  if (semCategoria.length) {
    throw new Error(
      `[inventario] bloco(s) sem categoria: ${semCategoria
        .map((b) => `${b.id} (${b.nome})`)
        .join(", ")}. Toda entrada de CATALOGO precisa de uma categoria de GRUPOS — sem ` +
        `ela o bloco não bate com o filtro de nenhum grupo e some do inventário em silêncio. ` +
        `Declare a categoria no mesmo commit que acrescenta o bloco.`
    );
  }
}
