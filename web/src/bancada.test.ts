import { describe, expect, it } from "vitest";
import { conferirCobertura, idsDoGrupo, ordemDaBancada } from "./bancada";
import { CATALOGO, GRUPOS } from "./catalogo";
import type { Bloco, Grupo } from "./catalogo";

/* Um catálogo de brinquedo, para que os testes de regra não dependam do
   catálogo real — que muda a cada bloco novo e faria estes testes falharem por
   motivo errado. O catálogo real tem os seus próprios testes, no fim. */
const b = (id: Bloco["id"], estado: Bloco["estado"]): Bloco => ({
  id,
  estado,
  nome: `Bloco ${id}`,
  regra: "regra",
});

describe("idsDoGrupo", () => {
  it("preserva a ordem do catálogo, que é a de leitura e não a numérica", () => {
    /* O 19 lê entre o 10 e o 11, e o catálogo o declara ali. Uma versão que
       ordenasse por número devolveria 1, 10, 19 — e a bancada passaria a
       contradizer a doutrina que ela existe para mostrar. */
    const catalogo = [b(19, "ativo"), b(1, "ativo"), b(10, "ativo")];
    const grupo: Grupo = { rotulo: "No ar", estados: ["ativo"], nota: "" };
    expect(idsDoGrupo(catalogo, grupo)).toEqual([19, 1, 10]);
  });

  it("filtra por estado, e só por estado", () => {
    const catalogo = [b(1, "ativo"), b(2, "previsto"), b(3, "ativo")];
    const grupo: Grupo = { rotulo: "No ar", estados: ["ativo"], nota: "" };
    expect(idsDoGrupo(catalogo, grupo)).toEqual([1, 3]);
  });

  it("um grupo com dois estados leva os dois, sem reordenar", () => {
    const catalogo = [b(1, "ativo"), b(2, "previsto"), b(3, "derivado")];
    const grupo: Grupo = { rotulo: "x", estados: ["previsto", "derivado"], nota: "" };
    /* Na ordem do CATÁLOGO (2 depois 3), não na ordem em que os estados foram
       listados no grupo. Uma versão que iterasse `grupo.estados` por fora
       devolveria os previstos todos e depois os derivados todos — o que dá o
       mesmo resultado aqui por acaso, e o teste seguinte é o que separa. */
    expect(idsDoGrupo(catalogo, grupo)).toEqual([2, 3]);
  });

  it("estados intercalados saem intercalados, na ordem do catálogo", () => {
    /* Este é o teste que discrimina de verdade o de cima: aqui a ordem do
       catálogo e a ordem por estado divergem. Iterar `grupo.estados` por fora
       daria [2, 4, 3], e o catálogo diz [2, 3, 4]. */
    const catalogo = [b(1, "ativo"), b(2, "previsto"), b(3, "derivado"), b(4, "previsto")];
    const grupo: Grupo = { rotulo: "x", estados: ["previsto", "derivado"], nota: "" };
    expect(idsDoGrupo(catalogo, grupo)).toEqual([2, 3, 4]);
  });
});

describe("ordemDaBancada", () => {
  it("emenda os grupos na ordem em que GRUPOS os declara", () => {
    const catalogo = [b(1, "ativo"), b(2, "previsto"), b("A1", "atomo"), b(3, "ativo")];
    const grupos: Grupo[] = [
      { rotulo: "No ar", estados: ["ativo"], nota: "" },
      { rotulo: "Átomos", estados: ["atomo"], nota: "" },
      { rotulo: "Previstos", estados: ["previsto"], nota: "" },
    ];
    expect(ordemDaBancada(catalogo, grupos)).toEqual([1, 3, "A1", 2]);
  });
});

describe("conferirCobertura", () => {
  it("aceita quando todo estado usado tem exatamente um grupo", () => {
    const catalogo = [b(1, "ativo"), b(2, "previsto")];
    const grupos: Grupo[] = [
      { rotulo: "No ar", estados: ["ativo"], nota: "" },
      { rotulo: "Previstos", estados: ["previsto"], nota: "" },
    ];
    expect(() => conferirCobertura(catalogo, grupos)).not.toThrow();
  });

  it("recusa estado usado no catálogo que nenhum grupo cobre", () => {
    /* A armadilha inteira: sem esta trava o bloco derivado some do índice E da
       página sem erro nenhum, porque quem some é o filtro, não o filtrado. */
    const catalogo = [b(1, "ativo"), b(2, "derivado")];
    const grupos: Grupo[] = [{ rotulo: "No ar", estados: ["ativo"], nota: "" }];
    expect(() => conferirCobertura(catalogo, grupos)).toThrow(/derivado/);
  });

  it("recusa o mesmo estado em dois grupos", () => {
    const catalogo = [b(1, "ativo")];
    const grupos: Grupo[] = [
      { rotulo: "No ar", estados: ["ativo"], nota: "" },
      { rotulo: "Outro", estados: ["ativo"], nota: "" },
    ];
    expect(() => conferirCobertura(catalogo, grupos)).toThrow(/mais de um grupo/);
  });

  it("grupo declarando estado que o catálogo não usa é aceito", () => {
    /* Um grupo à frente do catálogo não quebra nada: ele só renderiza vazio, e
       é o estado normal enquanto o primeiro bloco daquele estado não chegou.
       Recusar isto obrigaria a escrever bloco e grupo no mesmo minuto. */
    const catalogo = [b(1, "ativo")];
    const grupos: Grupo[] = [
      { rotulo: "No ar", estados: ["ativo"], nota: "" },
      { rotulo: "Previstos", estados: ["previsto"], nota: "" },
    ];
    expect(() => conferirCobertura(catalogo, grupos)).not.toThrow();
  });
});

describe("o catálogo real", () => {
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

  it("o índice e a página leem a mesma ordem", () => {
    /* O índice do trilho filtra `CATALOGO` por grupo, exatamente como
       `idsDoGrupo`. Este teste é o que amarra os dois na mesma função: se um
       dos lados voltar a ser lista digitada, ele cai. */
    const doIndice = GRUPOS.flatMap((g) =>
      CATALOGO.filter((x) => g.estados.includes(x.estado)).map((x) => x.id)
    );
    expect(ordemDaBancada(CATALOGO, GRUPOS)).toEqual(doIndice);
  });
});
