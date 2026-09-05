// web/src/social/tags.test.ts
import { describe, it, expect } from "vitest";
import { tagsSociais } from "./tags";
import type { PaginaSocial, TagSocial } from "./tags";
import type { Site } from "../sites/tipos";

const site: Site = {
  slug: "exemplo", nome: "Blog de Exemplo", dominio: "exemplo.com.br",
  estilo: "linho", modoPadrao: "claro", blocos: [], muroDeEmail: false,
  emailContato: "c@exemplo.com.br",
  responsavel: { nome: "Nome Sobrenome", tipo: "pf" },
};

const pagina = (extra: Partial<PaginaSocial> = {}): PaginaSocial => ({
  site,
  caminho: "/artigo-1/",
  titulo: "Por que a chamada trava",
  descricao: "Uma descricao.",
  tipo: "article",
  imagemCard: "/social/artigo-1.png",
  ...extra,
});

/** O que o `<head>` de fato anuncia, no formato em que dá para conferir. */
const chaves = (tags: TagSocial[]): string[] =>
  tags.map((t) => (t.tag === "link" ? `rel:${t.rel}` : t.nome));

const valor = (tags: TagSocial[], nome: string): string | undefined =>
  tags.find((t): t is Extract<TagSocial, { tag: "meta" }> => t.tag === "meta" && t.nome === nome)
    ?.conteudo;

describe("tagsSociais", () => {
  it("pagina com site e sem noindex anuncia o conjunto inteiro", () => {
    expect(chaves(tagsSociais(pagina()))).toEqual([
      "rel:canonical",
      "og:type",
      "og:title",
      "og:description",
      "og:url",
      "og:site_name",
      "og:image",
      "og:image:width",
      "og:image:height",
      "twitter:card",
    ]);
  });

  it("pagina noindex COM site nao anuncia nada: pagina de servico nao se anuncia", () => {
    expect(tagsSociais(pagina({ noindex: true }))).toEqual([]);
  });

  it("pagina sem site nao anuncia nada: bancada e vitrine sao do chassi", () => {
    expect(tagsSociais(pagina({ site: undefined }))).toEqual([]);
  });

  it("og:image sai absoluta, que e a unica forma que rede social abre", () => {
    expect(valor(tagsSociais(pagina()), "og:image")).toBe(
      "https://exemplo.com.br/social/artigo-1.png",
    );
  });

  it("og:url e canonical sao a mesma URL absoluta do caminho da pagina", () => {
    const tags = tagsSociais(pagina());
    const canonical = tags.find((t) => t.tag === "link");
    expect(valor(tags, "og:url")).toBe("https://exemplo.com.br/artigo-1/");
    expect(canonical).toEqual({
      tag: "link", rel: "canonical", href: "https://exemplo.com.br/artigo-1/",
    });
  });

  it("og:title leva o titulo cru, e a marca sai so uma vez, em og:site_name", () => {
    const tags = tagsSociais(pagina());
    expect(valor(tags, "og:title")).toBe("Por que a chamada trava");
    expect(valor(tags, "og:site_name")).toBe("Blog de Exemplo");
  });

  it("sem descricao a tag nem nasce, em vez de nascer vazia", () => {
    expect(chaves(tagsSociais(pagina({ descricao: undefined })))).not.toContain("og:description");
  });
});
