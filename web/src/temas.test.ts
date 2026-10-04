import { describe, expect, it } from "vitest";
import { artigosPorTema, temasDoArtigo, validarTemas, TETO_DE_TEMAS_POR_ARTIGO } from "./temas";
import { validar } from "./sites/validacao";
import type { Site, Tema } from "./sites/tipos";

const t = (slug: string, nome = slug.toUpperCase()): Tema => ({
  slug, nome, descricao: `Sobre ${nome}.`,
});

// Sem `tokens`, de propósito: é o site que o `continue` de `validar` pulava.
const site = (temas?: Tema[]): Site => ({
  slug: "teste", nome: "Teste", dominio: "teste.com.br",
  estilo: "linho", modoPadrao: "claro", blocos: [1], muroDeEmail: false,
  emailContato: "oi@teste.com.br", responsavel: { nome: "Fulano", tipo: "pf" },
  temas,
});

describe("validarTemas", () => {
  it("aceita site sem vocabulário e site com vocabulário bem formado", () => {
    expect(() => validarTemas(site())).not.toThrow();
    expect(() => validarTemas(site([t("wi-fi"), t("home-office")]))).not.toThrow();
  });

  it("recusa lista vazia", () => {
    expect(() => validarTemas(site([]))).toThrow(/lista vazia/);
  });

  it("recusa slug que não serve de URL", () => {
    for (const ruim of ["Wi-Fi", "home office", "café", "-wifi", "wifi-"]) {
      expect(() => validarTemas(site([t(ruim)]))).toThrow(/vira URL/);
    }
  });

  it("recusa slug repetido e nome repetido, sem olhar caixa", () => {
    expect(() => validarTemas(site([t("a"), t("a")]))).toThrow(/duas vezes/);
    expect(() => validarTemas(site([t("a", "Rede"), t("b", "rede")]))).toThrow(/dois temas chamados/);
  });

  it("recusa nome ou descrição vazios", () => {
    expect(() => validarTemas(site([{ slug: "a", nome: " ", descricao: "x" }]))).toThrow(/sem nome/);
    expect(() => validarTemas(site([{ slug: "a", nome: "A", descricao: "" }]))).toThrow(/sem descrição/);
  });

  it("roda dentro de validar mesmo em site sem tokens", () => {
    // O erro 13 da skill criar-componente: checagem posta depois do
    // `if (!site.tokens) continue` passava verde sem checar nada.
    expect(() => validar([site([])], ["linho"])).toThrow(/lista vazia/);
  });
});

describe("temasDoArtigo", () => {
  const vocab = site([t("wi-fi", "Wi-Fi"), t("roteador", "Roteador"), t("pico"), t("fibra")]);

  it("resolve na ordem do artigo", () => {
    expect(temasDoArtigo(vocab, { slug: "a", temas: ["roteador", "wi-fi"] }).map((x) => x.nome))
      .toEqual(["Roteador", "Wi-Fi"]);
  });

  it("site sem vocabulário não tem taxonomia, traga o artigo o que trouxer", () => {
    expect(temasDoArtigo(site(), { slug: "a", temas: ["qualquer"] })).toEqual([]);
  });

  it("recusa tema fora do vocabulário, dizendo artigo, tema e os que existem", () => {
    expect(() => temasDoArtigo(vocab, { slug: "artigo-9", temas: ["wifi"] }))
      .toThrow(/"artigo-9" usa o tema "wifi"[\s\S]*wi-fi, roteador, pico, fibra/);
  });

  it("aceita o teto e recusa um acima dele", () => {
    expect(TETO_DE_TEMAS_POR_ARTIGO).toBe(3);
    expect(() => temasDoArtigo(vocab, { slug: "a", temas: ["wi-fi", "roteador", "pico"] })).not.toThrow();
    expect(() => temasDoArtigo(vocab, { slug: "a", temas: ["wi-fi", "roteador", "pico", "fibra"] }))
      .toThrow(/teto é 3/);
  });

  it("recusa tema repetido no mesmo artigo", () => {
    expect(() => temasDoArtigo(vocab, { slug: "a", temas: ["pico", "pico"] })).toThrow(/repete/);
  });
});

describe("artigosPorTema", () => {
  const vocab = site([t("wi-fi"), t("roteador"), t("fibra")]);
  const artigos = [
    { slug: "a1", temas: ["wi-fi"] },
    { slug: "a2", temas: ["roteador", "wi-fi"] },
    { slug: "a3" },
  ];

  it("agrupa na ordem do vocabulário e deixa de fora tema sem artigo", () => {
    const grupos = artigosPorTema(vocab, artigos);
    expect(grupos.map((g) => [g.tema.slug, g.artigos.map((a) => a.slug)])).toEqual([
      ["wi-fi", ["a1", "a2"]],
      ["roteador", ["a2"]],
    ]);
  });

  it("quebra se qualquer artigo usar tema fora do vocabulário", () => {
    expect(() => artigosPorTema(vocab, [...artigos, { slug: "a4", temas: ["nada"] }]))
      .toThrow(/"a4" usa o tema "nada"/);
  });

  it("site sem vocabulário não gera página de tema nenhuma", () => {
    expect(artigosPorTema(site(), artigos)).toEqual([]);
  });
});
