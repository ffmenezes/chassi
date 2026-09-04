import { describe, it, expect } from "vitest";
import {
  calcular,
  arredondarParaCima,
  formatar,
  validarCalculadora,
  type CampoCalculo,
  type SaidaCalculo,
} from "./calculo";

const campos: CampoCalculo[] = [
  { id: "pecas", rotulo: "Peças por mês", inicial: 100, origem: "premissa", unidade: "un" },
  { id: "caneca", rotulo: "Caneca crua", inicial: 10, origem: "duas lojas, ago/2026", unidade: "R$" },
  { id: "hora", rotulo: "Sua hora", inicial: 30, origem: "premissa", unidade: "R$" },
  { id: "minutos", rotulo: "Minutos por peça", inicial: 6, origem: "premissa", unidade: "min" },
];

const saidas: SaidaCalculo[] = [
  { id: "trabalho", rotulo: "Trabalho por peça", expr: "hora * minutos / 60", unidade: "R$" },
  { id: "custo", rotulo: "Custo por peça", expr: "caneca + trabalho", unidade: "R$" },
];

describe("avaliador de expressão", () => {
  it("resolve precedência sem parêntese", () => {
    const r = calcular(campos, [{ id: "x", rotulo: "x", expr: "2 + 3 * 4" }], {});
    expect(r[0].valor).toBe(14);
  });

  it("respeita parêntese", () => {
    const r = calcular(campos, [{ id: "x", rotulo: "x", expr: "(2 + 3) * 4" }], {});
    expect(r[0].valor).toBe(20);
  });

  it("aceita unário negativo", () => {
    const r = calcular(campos, [{ id: "x", rotulo: "x", expr: "-3 + 10" }], {});
    expect(r[0].valor).toBe(7);
  });

  it("encadeia saída anterior", () => {
    const r = calcular(campos, saidas, {});
    expect(r[0].valor).toBe(3); // 30 * 6 / 60
    expect(r[1].valor).toBe(13); // 10 + 3
  });

  it("usa o valor do leitor no lugar do de partida", () => {
    const r = calcular(campos, saidas, { hora: 60, caneca: 12 });
    expect(r[0].valor).toBe(6);
    expect(r[1].valor).toBe(18);
  });

  it("cai para o valor de partida quando o campo vem vazio", () => {
    const r = calcular(campos, saidas, { hora: NaN });
    expect(r[0].valor).toBe(3);
  });
});

describe("divisão por zero não vira zero", () => {
  it("devolve null e n/d", () => {
    const r = calcular(
      [{ id: "a", rotulo: "a", inicial: 0, origem: "premissa" }],
      [{ id: "x", rotulo: "x", expr: "10 / a" }],
      {}
    );
    expect(r[0].valor).toBeNull();
    expect(r[0].texto).toBe("n/d");
  });
});

describe("arredondamento sobe, item 7 de integridade da raiz", () => {
  it("sobe no centavo", () => {
    expect(arredondarParaCima(13.001, 2)).toBe(13.01);
    expect(arredondarParaCima(13.999, 2)).toBe(14);
  });

  it("não sobe um valor que já está exato", () => {
    expect(arredondarParaCima(13.5, 2)).toBe(13.5);
    expect(arredondarParaCima(0.1 + 0.2, 2)).toBe(0.3);
  });

  it("é o padrão da saída", () => {
    const r = calcular(
      [{ id: "a", rotulo: "a", inicial: 10, origem: "premissa" }],
      [{ id: "x", rotulo: "x", expr: "a / 3" }],
      {}
    );
    expect(r[0].valor).toBe(3.34); // 3.333… sobe, nunca desce
  });

  it("arredonda normal quando declarado", () => {
    const r = calcular(
      [{ id: "a", rotulo: "a", inicial: 10, origem: "premissa" }],
      [{ id: "x", rotulo: "x", expr: "a / 3", arredonda: "normal" }],
      {}
    );
    expect(r[0].valor).toBe(3.33);
  });
});

describe("formato", () => {
  // Átomo A1 do catálogo: "Número e unidade não se separam. Espaço não
  // separável". O teste afirma o U+00A0 pelo código, e não por um espaço
  // digitado, porque os dois são indistinguíveis lendo o arquivo e é assim que
  // a regra volta a se perder.
  const NBSP = "\u00A0";

  it("não separa número de unidade", () => {
    expect(formatar(1234.5, 2, "R$")).toBe(`R$${NBSP}1.234,50`);
    expect(formatar(6, 0, "min")).toBe(`6${NBSP}min`);
  });

  it("nunca usa espaço comum entre número e unidade", () => {
    expect(formatar(6, 0, "min")).not.toContain("\u0020");
    expect(formatar(1234.5, 2, "R$")).not.toContain("\u0020");
  });

  it("sem unidade, devolve só o número em pt-BR", () => {
    expect(formatar(1234.5, 2)).toBe("1.234,50");
  });
});

describe("travas que quebram a build", () => {
  it("recusa campo sem origem", () => {
    expect(() =>
      validarCalculadora([{ id: "a", rotulo: "Caneca", inicial: 1, origem: "" }], [
        { id: "x", rotulo: "x", expr: "a" },
      ])
    ).toThrow(/sem origem declarada/);
  });

  it("recusa calculadora sem campo", () => {
    expect(() => validarCalculadora([], [{ id: "x", rotulo: "x", expr: "1" }])).toThrow(
      /sem conta congelada/
    );
  });

  it("recusa saída que olha para a frente", () => {
    expect(() =>
      validarCalculadora(campos, [
        { id: "a", rotulo: "a", expr: "b + 1" },
        { id: "b", rotulo: "b", expr: "2" },
      ])
    ).toThrow(/não é campo nem saída anterior/);
  });

  it("recusa id repetido", () => {
    expect(() =>
      validarCalculadora(campos, [{ id: "caneca", rotulo: "x", expr: "1" }])
    ).toThrow(/id repetido/);
  });

  it("recusa percentual sem ressalva, item 10 de integridade", () => {
    expect(() =>
      validarCalculadora(campos, [{ id: "m", rotulo: "Margem", expr: "caneca", unidade: "%" }])
    ).toThrow(/percentual carrega a base/);
  });

  it("aceita percentual com ressalva", () => {
    expect(() =>
      validarCalculadora(campos, [
        { id: "m", rotulo: "Margem", expr: "caneca", unidade: "%", ressalva: "sobre o custo" },
      ])
    ).not.toThrow();
  });

  it("recusa caractere que não é aritmética", () => {
    expect(() =>
      validarCalculadora(campos, [{ id: "x", rotulo: "x", expr: "caneca ** 2" }])
    ).toThrow(/\[bloco 23\]/);
  });

  it("passa numa calculadora bem formada", () => {
    expect(() => validarCalculadora(campos, saidas)).not.toThrow();
  });
});
