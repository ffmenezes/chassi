import { describe, expect, it } from "vitest";
import { validar, cssDoSite, TETO_DE_DESVIO } from "./validacao";
import type { Site } from "./tipos";

const base = (extra: Partial<Site> = {}): Site => ({
  slug: "teste", nome: "Teste", dominio: "teste.com.br",
  estilo: "linho", modoPadrao: "claro", blocos: [1, 2], muroDeEmail: false,
  emailContato: "oi@teste.com.br",
  responsavel: { nome: "Fulano", tipo: "pf" },
  ...extra,
});

const seis = ["--b-fundo", "--b-tinta", "--b-acento", "--b-linha", "--b-radius", "--b-borda"];

const comTokens = (nomes: string[]): Site =>
  base({ tokens: { claro: Object.fromEntries(nomes.map((t) => [t, "#000"])) } } as never);

describe("validar", () => {
  it("aceita site sem desvio nenhum", () => {
    expect(() => validar([base()], ["linho"])).not.toThrow();
  });

  it("recusa estilo que não existe, e diz quais existem", () => {
    expect(() => validar([base({ estilo: "marmore" })], ["linho", "vidro"]))
      .toThrow(/marmore[\s\S]*linho, vidro/);
  });

  it("recusa troca de familia tipografica", () => {
    expect(() => validar([comTokens(["--b-fonte-corpo"])], ["linho"]))
      .toThrow(/família tipográfica/);
  });

  it("aceita exatamente o teto de desvios", () => {
    expect(seis).toHaveLength(TETO_DE_DESVIO);
    expect(() => validar([comTokens(seis)], ["linho"])).not.toThrow();
  });

  it("recusa um desvio acima do teto", () => {
    expect(() => validar([comTokens([...seis, "--b-blur"])], ["linho"]))
      .toThrow(/teto é 6/);
  });

  it("conta o mesmo token nos dois modos uma vez so", () => {
    // Quatro tokens distintos, cada um nos dois modos: deduplicado dá 4
    // (abaixo do teto de 6, not.toThrow()); sem dedupe dá 8 (acima do teto),
    // e o teste falha. Um token só não prova nada, porque dobrado ainda cabe
    // no teto.
    const claro = {
      "--b-fundo": "#a1", "--b-tinta": "#a2", "--b-acento": "#a3", "--b-linha": "#a4",
    };
    const escuro = {
      "--b-fundo": "#b1", "--b-tinta": "#b2", "--b-acento": "#b3", "--b-linha": "#b4",
    };
    expect(() => validar([base({ tokens: { claro, escuro } } as never)], ["linho"])).not.toThrow();
  });

  it("recusa dois sites com o mesmo slug", () => {
    expect(() => validar([base(), base()], ["linho"])).toThrow(/slug repetido/);
  });
});

describe("cssDoSite", () => {
  it("devolve string vazia sem desvio", () => {
    expect(cssDoSite(base())).toBe("");
  });

  it("emite na camada site, com data-site e data-modo", () => {
    const css = cssDoSite(base({ tokens: { claro: { "--b-acento": "#c8622a" } } } as never));
    expect(css).toContain("@layer site{");
    expect(css).toContain('[data-site="teste"][data-modo="claro"]');
    expect(css).toContain("--b-acento:#c8622a");
  });
});
