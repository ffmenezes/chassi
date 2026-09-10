import { describe, expect, it } from "vitest";
import {
  conferirGrafico,
  descrever,
  escala,
  fatias,
  formatar,
  TETO_DE_CATEGORIAS,
  TETO_DE_FATIAS,
  TETO_DE_SERIES,
} from "./grafico";
import type { DadosGrafico } from "./grafico";

/* Fábrica curta: um gráfico válido, e cada teste muda só o que exercita. */
const barra = (over: Partial<DadosGrafico> = {}): DadosGrafico => ({
  tipo: "barra",
  titulo: "Preço à vista por modelo, R$",
  categorias: ["Modelo A", "Modelo B", "Modelo C"],
  series: [{ nome: "Loja 1", valores: [1899, 2049, 1650] }],
  unidade: "R$",
  fonte: "Preço apurado em duas lojas, 10/09/2026",
  ...over,
});

describe("conferirGrafico — o que todo gráfico precisa ter", () => {
  it("aceita um gráfico completo", () => {
    expect(() => conferirGrafico(barra())).not.toThrow();
  });
  it("recusa sem fonte, porque número desenhado é número publicado", () => {
    expect(() => conferirGrafico(barra({ fonte: " " }))).toThrow(/sem fonte/);
  });
  it("recusa sem título", () => {
    expect(() => conferirGrafico(barra({ titulo: "" }))).toThrow(/sem título/);
  });
  it("recusa série com contagem de valores diferente das categorias", () => {
    expect(() =>
      conferirGrafico(barra({ series: [{ nome: "Loja 1", valores: [1, 2] }] }))
    ).toThrow(/2 valores para 3 categorias/);
  });
  it("aceita lacuna declarada como null, e recusa NaN", () => {
    expect(() =>
      conferirGrafico(barra({ series: [{ nome: "Loja 1", valores: [1, null, 3] }] }))
    ).not.toThrow();
    expect(() =>
      conferirGrafico(barra({ series: [{ nome: "Loja 1", valores: [1, NaN, 3] }] }))
    ).toThrow(/não é número/);
  });
  it("recusa acima do teto de categorias", () => {
    const n = TETO_DE_CATEGORIAS + 1;
    expect(() =>
      conferirGrafico(
        barra({
          categorias: Array.from({ length: n }, (_, i) => `c${i}`),
          series: [{ nome: "s", valores: Array(n).fill(1) }],
        })
      )
    ).toThrow(/teto é/);
  });
  it("recusa acima do teto de séries em barra e linha", () => {
    const series = Array.from({ length: TETO_DE_SERIES + 1 }, (_, i) => ({
      nome: `s${i}`,
      valores: [1, 2, 3],
    }));
    expect(() => conferirGrafico(barra({ series }))).toThrow(/séries; o teto/);
  });
});

describe("conferirGrafico — o que muda por tipo", () => {
  it("linha exige três pontos: dois é contraste, não tendência", () => {
    expect(() =>
      conferirGrafico(
        barra({ tipo: "linha", categorias: ["jan", "fev"], series: [{ nome: "s", valores: [1, 2] }] })
      )
    ).toThrow(/piso é 3/);
    expect(() => conferirGrafico(barra({ tipo: "linha" }))).not.toThrow();
  });
  it("pizza aceita uma série só", () => {
    expect(() =>
      conferirGrafico(
        barra({ tipo: "pizza", series: [{ nome: "a", valores: [1, 2, 3] }, { nome: "b", valores: [1, 2, 3] }] })
      )
    ).toThrow(/mais de uma série/);
  });
  it("pizza recusa lacuna, negativo, todas em zero e mais fatias que o teto", () => {
    expect(() =>
      conferirGrafico(barra({ tipo: "pizza", series: [{ nome: "a", valores: [1, null, 3] }] }))
    ).toThrow(/lacuna/);
    expect(() =>
      conferirGrafico(barra({ tipo: "pizza", series: [{ nome: "a", valores: [1, -2, 3] }] }))
    ).toThrow(/negativo/);
    expect(() =>
      conferirGrafico(barra({ tipo: "pizza", series: [{ nome: "a", valores: [0, 0, 0] }] }))
    ).toThrow(/zero/);
    const n = TETO_DE_FATIAS + 1;
    expect(() =>
      conferirGrafico(
        barra({
          tipo: "pizza",
          categorias: Array.from({ length: n }, (_, i) => `f${i}`),
          series: [{ nome: "a", valores: Array(n).fill(1) }],
        })
      )
    ).toThrow(/fatias; o teto/);
  });
});

describe("formatar — a unidade colada como o texto faz", () => {
  it("moeda antes, unidade depois, porcentagem sem espaço, lacuna declarada", () => {
    expect(formatar(1899, "R$")).toBe("R$ 1.899");
    expect(formatar(12.5, "kWh", 1)).toBe("12,5 kWh");
    expect(formatar(38, "%")).toBe("38%");
    expect(formatar(null, "R$")).toBe("[sem dado]");
  });
});

describe("escala — zero sempre entra, teto redondo", () => {
  it("cobre o maior valor com marcas redondas a partir do zero", () => {
    const e = escala([1899, 2049, 1650]);
    expect(e.min).toBe(0);
    expect(e.max).toBeGreaterThanOrEqual(2049);
    expect(e.marcas[0]).toBe(0);
    expect(e.marcas[e.marcas.length - 1]).toBe(e.max);
  });
  it("desce o piso quando há negativo, e ignora lacuna", () => {
    const e = escala([-30, null, 40]);
    expect(e.min).toBeLessThanOrEqual(-30);
    expect(e.max).toBeGreaterThanOrEqual(40);
  });
  it("não colapsa quando todos os valores são zero", () => {
    const e = escala([0, 0]);
    expect(e.max).toBeGreaterThan(e.min);
  });
});

describe("fatias — as frações fecham o todo", () => {
  it("soma das frações é 1 e cada fatia tem caminho", () => {
    const f = fatias([25, 25, 50], 100, 100, 80);
    expect(f.map((x) => x.fracao).reduce((a, b) => a + b, 0)).toBeCloseTo(1);
    expect(f.every((x) => x.caminho.startsWith("M "))).toBe(true);
    expect(f[2].caminho).toContain(" 0 1 "); // metade exata não é arco grande
  });
  it("fatia acima de meio usa o arco grande", () => {
    const f = fatias([70, 30], 100, 100, 80);
    expect(f[0].caminho).toContain(" 1 1 ");
  });
});

describe("descrever — o <desc> diz os números", () => {
  it("lista categoria e valor, e a porcentagem na pizza", () => {
    expect(descrever(barra())).toContain("Modelo A R$ 1.899");
    const d = descrever(barra({ tipo: "pizza", series: [{ nome: "a", valores: [1, 1, 2] }] }));
    expect(d).toContain("50%");
  });
});
