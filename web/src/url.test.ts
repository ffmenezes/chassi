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

  it("recusa dominio com esquema: og:url sairia dobrado", () => {
    expect(() => urlAbsoluta(site("https://exemplo.com.br"), "/")).toThrow(/esquema/i);
  });

  it("recusa dominio com barra final", () => {
    expect(() => urlAbsoluta(site("exemplo.com.br/"), "/")).toThrow(/barra final/i);
  });

  it("recusa dominio vazio, que e configuracao incompleta", () => {
    expect(() => urlAbsoluta(site("   "), "/")).toThrow(/vazio/i);
  });

  it("recusa dominio com espaco no meio", () => {
    expect(() => urlAbsoluta(site("exemplo .com.br"), "/")).toThrow(/espaco|espaço/i);
  });

  it("recusa caminho sem barra inicial, porque a chamada e nossa", () => {
    expect(() => urlAbsoluta(site("exemplo.com.br"), "sobre/")).toThrow(/barra inicial/i);
  });
});
