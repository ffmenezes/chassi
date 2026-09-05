import { describe, it, expect } from "vitest";
import { urlAbsoluta } from "./url";
import type { Site } from "./sites/tipos";

const site = (dominio: string): Site => ({
  slug: "s", nome: "S", dominio, estilo: "linho", modoPadrao: "claro",
  blocos: [], muroDeEmail: false, emailContato: "c@s.com",
  responsavel: { nome: "Nome Sobrenome", tipo: "pf" },
});

describe("urlAbsoluta", () => {
  it("monta https com o dominio do site", () => {
    expect(urlAbsoluta(site("exemplo.com.br"), "/sobre/")).toBe(
      "https://exemplo.com.br/sobre/",
    );
  });

  it("preserva a raiz", () => {
    expect(urlAbsoluta(site("exemplo.com.br"), "/")).toBe("https://exemplo.com.br/");
  });

  /* As regras do `dominio` moram em `sites/validacao.test.ts`: elas conferem
     configuração do participante, uma vez por site no import. Aqui fica só a
     asserção sobre a NOSSA chamada. */
  it("recusa caminho sem barra inicial, porque a chamada e nossa", () => {
    expect(() => urlAbsoluta(site("exemplo.com.br"), "sobre/")).toThrow(/barra inicial/i);
  });
});
