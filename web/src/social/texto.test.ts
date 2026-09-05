import { describe, it, expect } from "vitest";
import { fonteDoCard } from "./fonte";
import { quebrar, caminhoDe } from "./texto";

const f = fonteDoCard();

describe("quebrar", () => {
  it("nao quebra o que cabe numa linha", () => {
    const l = quebrar(f, "Titulo curto", 64, 1040, 3);
    expect(l).toHaveLength(1);
    expect(l[0].texto).toBe("Titulo curto");
    expect(l[0].largura).toBeGreaterThan(0);
  });

  it("quebra por palavra, sem estourar a largura", () => {
    const l = quebrar(f, "Quanto gasta um ar-condicionado por mes a conta com a tarifa", 64, 1040, 3);
    expect(l.length).toBeGreaterThan(1);
    for (const linha of l) expect(linha.largura).toBeLessThanOrEqual(1040);
  });

  it("mede acento sem contar caractere: e circunflexo nao vale por dois", () => {
    const semAcento = quebrar(f, "mes", 64, 1040, 3)[0].largura;
    const comAcento = quebrar(f, "mês", 64, 1040, 3)[0].largura;
    expect(Math.abs(comAcento - semAcento)).toBeLessThan(semAcento * 0.15);
  });

  it("elipsa quando passa do maximo de linhas", () => {
    const l = quebrar(f, "palavra ".repeat(60).trim(), 64, 1040, 3);
    expect(l).toHaveLength(3);
    expect(l[2].texto.endsWith("…")).toBe(true);
  });

  it("corta a palavra unica que sozinha estoura a caixa", () => {
    const l = quebrar(f, "Pindamonhangabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 64, 400, 3);
    expect(l[0].texto.endsWith("…")).toBe(true);
    expect(l[0].largura).toBeLessThanOrEqual(400);
  });

  it("titulo vazio e erro, nao card em branco", () => {
    expect(() => quebrar(f, "   ", 64, 1040, 3)).toThrow(/vazio/i);
  });
});

describe("caminhoDe", () => {
  it("devolve dados de path, e nunca uma tag de texto", () => {
    const d = caminhoDe(f, "Teste", 80, 250, 64);
    expect(d.length).toBeGreaterThan(10);
    expect(d).not.toContain("<text");
  });
});
