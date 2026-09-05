import { describe, expect, it } from "vitest";
import { conferirCategorias, conferirCobertura, idsDoGrupo, ordemDaBancada } from "./bancada";
import { CATALOGO, GRUPOS } from "./catalogo";
import type { Bloco, Categoria, Grupo } from "./catalogo";

/* Um catálogo de brinquedo, para que os testes de regra não dependam do
   catálogo real — que muda a cada bloco novo e faria estes testes falharem por
   motivo errado. O catálogo real tem os seus próprios testes, no fim. */
const b = (id: Bloco["id"], categoria: Categoria): Bloco => ({
  id,
  categoria,
  estado: "ativo",
  nome: `Bloco ${id}`,
  regra: "regra",
});

describe("idsDoGrupo", () => {
  it("preserva a ordem do catálogo, que é a de leitura e não a numérica", () => {
    /* O 19 lê entre o 10 e o 11, e o catálogo o declara ali. Uma versão que
       ordenasse por número devolveria 1, 10, 19 — e a bancada passaria a
       contradizer a doutrina que ela existe para mostrar. */
    const catalogo = [b(19, "dados"), b(1, "dados"), b(10, "dados")];
    const grupo: Grupo = { rotulo: "Dados e prova", categorias: ["dados"], nota: "" };
    expect(idsDoGrupo(catalogo, grupo)).toEqual([19, 1, 10]);
  });

  it("filtra por categoria, e só por categoria", () => {
    const catalogo = [b(1, "estrutura"), b(2, "conversao"), b(3, "estrutura")];
    const grupo: Grupo = { rotulo: "Estrutura do artigo", categorias: ["estrutura"], nota: "" };
    expect(idsDoGrupo(catalogo, grupo)).toEqual([1, 3]);
  });

  it("um grupo com duas categorias leva as duas, sem reordenar", () => {
    const catalogo = [b(1, "estrutura"), b(2, "conversao"), b(3, "midia")];
    const grupo: Grupo = { rotulo: "x", categorias: ["conversao", "midia"], nota: "" };
    /* Na ordem do CATÁLOGO (2 depois 3), não na ordem em que as categorias
       foram listadas no grupo. Uma versão que iterasse `grupo.categorias` por
       fora devolveria os de "conversao" todos e depois os de "midia" todos —
       o que dá o mesmo resultado aqui por acaso, e o teste seguinte é o que
       separa. */
    expect(idsDoGrupo(catalogo, grupo)).toEqual([2, 3]);
  });

  it("categorias intercaladas saem intercaladas, na ordem do catálogo", () => {
    /* Este é o teste que discrimina de verdade o de cima: aqui a ordem do
       catálogo e a ordem por categoria divergem. Iterar `grupo.categorias`
       por fora daria [2, 4, 3], e o catálogo diz [2, 3, 4]. */
    const catalogo = [b(1, "estrutura"), b(2, "conversao"), b(3, "midia"), b(4, "conversao")];
    const grupo: Grupo = { rotulo: "x", categorias: ["conversao", "midia"], nota: "" };
    expect(idsDoGrupo(catalogo, grupo)).toEqual([2, 3, 4]);
  });
});

describe("ordemDaBancada", () => {
  it("emenda os grupos na ordem em que GRUPOS os declara", () => {
    const catalogo = [b(1, "estrutura"), b(2, "conversao"), b("A1", "texto"), b(3, "estrutura")];
    const grupos: Grupo[] = [
      { rotulo: "Estrutura do artigo", categorias: ["estrutura"], nota: "" },
      { rotulo: "Texto e citação", categorias: ["texto"], nota: "" },
      { rotulo: "Capturar e converter", categorias: ["conversao"], nota: "" },
    ];
    expect(ordemDaBancada(catalogo, grupos)).toEqual([1, 3, "A1", 2]);
  });
});

describe("conferirCobertura", () => {
  it("aceita quando toda categoria usada tem exatamente um grupo", () => {
    const catalogo = [b(1, "estrutura"), b(2, "conversao")];
    const grupos: Grupo[] = [
      { rotulo: "Estrutura do artigo", categorias: ["estrutura"], nota: "" },
      { rotulo: "Capturar e converter", categorias: ["conversao"], nota: "" },
    ];
    expect(() => conferirCobertura(catalogo, grupos)).not.toThrow();
  });

  it("recusa categoria usada no catálogo que nenhum grupo cobre", () => {
    /* A armadilha inteira: sem esta trava o bloco daquela categoria some do
       índice E da página sem erro nenhum, porque quem some é o filtro, não o
       filtrado. */
    const catalogo = [b(1, "estrutura"), b(2, "midia")];
    const grupos: Grupo[] = [{ rotulo: "Estrutura do artigo", categorias: ["estrutura"], nota: "" }];
    expect(() => conferirCobertura(catalogo, grupos)).toThrow(/midia/);
  });

  it("recusa a mesma categoria em dois grupos", () => {
    const catalogo = [b(1, "estrutura")];
    const grupos: Grupo[] = [
      { rotulo: "Estrutura do artigo", categorias: ["estrutura"], nota: "" },
      { rotulo: "Outro", categorias: ["estrutura"], nota: "" },
    ];
    expect(() => conferirCobertura(catalogo, grupos)).toThrow(/mais de um grupo/);
  });

  it("grupo declarando categoria que o catálogo não usa é aceito", () => {
    /* Um grupo à frente do catálogo não quebra nada: ele só renderiza vazio, e
       é o estado normal enquanto o primeiro bloco daquela categoria não
       chegou. Recusar isto obrigaria a escrever bloco e grupo no mesmo
       minuto. */
    const catalogo = [b(1, "estrutura")];
    const grupos: Grupo[] = [
      { rotulo: "Estrutura do artigo", categorias: ["estrutura"], nota: "" },
      { rotulo: "Distribuir", categorias: ["distribuicao"], nota: "" },
    ];
    expect(() => conferirCobertura(catalogo, grupos)).not.toThrow();
  });
});

describe("conferirCategorias", () => {
  it("aceita quando todo bloco declara categoria", () => {
    const catalogo = [b(1, "estrutura"), b(2, "midia")];
    expect(() => conferirCategorias(catalogo)).not.toThrow();
  });

  it("recusa bloco sem categoria, nomeando o bloco", () => {
    const catalogo = [b(1, "estrutura"), { ...b(2, "midia"), categoria: undefined as unknown as Categoria }];
    expect(() => conferirCategorias(catalogo)).toThrow(/Bloco 2/);
  });
});

describe("o catálogo real", () => {
  it("todo bloco declara uma categoria", () => {
    expect(() => conferirCategorias(CATALOGO)).not.toThrow();
  });

  it("está inteiramente coberto por GRUPOS", () => {
    expect(() => conferirCobertura(CATALOGO, GRUPOS)).not.toThrow();
  });

  it("a bancada mostra todo bloco do catálogo, uma vez só", () => {
    /* A contagem que o commit 162ad1f consertou, agora como teste em vez de
       conferência manual do HTML: se um bloco cair fora de todo grupo, ou
       aparecer em dois, o número deixa de bater. */
    const ordem = ordemDaBancada(CATALOGO, GRUPOS);
    expect(ordem).toHaveLength(CATALOGO.length);
    expect(new Set(ordem).size).toBe(CATALOGO.length);
  });

  it("nenhum grupo fica vazio", () => {
    for (const g of GRUPOS) {
      expect(idsDoGrupo(CATALOGO, g).length, `grupo "${g.rotulo}" sem bloco nenhum`).toBeGreaterThan(0);
    }
  });

  it("o índice e a página leem a mesma ordem", () => {
    /* O índice do trilho filtra `CATALOGO` por grupo, exatamente como
       `idsDoGrupo`. Este teste é o que amarra os dois na mesma função: se um
       dos lados voltar a ser lista digitada, ele cai. */
    const doIndice = GRUPOS.flatMap((g) =>
      CATALOGO.filter((x) => g.categorias.includes(x.categoria)).map((x) => x.id)
    );
    expect(ordemDaBancada(CATALOGO, GRUPOS)).toEqual(doIndice);
  });
});
