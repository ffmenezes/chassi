import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { paraBloco, carregarComentarios, ARQUIVO } from "./comentarios";
import type { ArquivoDeComentarios } from "./comentarios";

const arq = (itens: ArquivoDeComentarios["itens"]): ArquivoDeComentarios => ({ versao: 1, itens });

describe("paraBloco", () => {
  it("formata a data ISO no formato que o leitor brasileiro lê", () => {
    const [c] = paraBloco(arq([{ id: "a", autor: "Jorge M.", em: "2026-08-12", texto: "Medi 2.900 W de pico aqui." }]));
    expect(c.quando).toBe("12/08/2026");
  });

  it("não desloca a data por fuso: 1º do mês não vira o último do mês anterior", () => {
    // `new Date("2026-08-01")` é meia-noite UTC, e em UTC-3 isso é 31/07.
    // Data de comentário é um dia de calendário, não um instante.
    const [c] = paraBloco(arq([{ id: "a", autor: "N", em: "2026-08-01", texto: "texto do comentário" }]));
    expect(c.quando).toBe("01/08/2026");
  });

  it("ordena do mais recente para o mais antigo", () => {
    const itens = paraBloco(
      arq([
        { id: "a", autor: "Antigo", em: "2026-08-10", texto: "primeiro comentário" },
        { id: "b", autor: "Novo", em: "2026-08-14", texto: "segundo comentário" },
      ]),
    );
    expect(itens.map((c) => c.autor)).toEqual(["Novo", "Antigo"]);
  });

  it("leva a resposta da casa junto, com a data dela também formatada", () => {
    const [c] = paraBloco(
      arq([
        {
          id: "a",
          autor: "Jorge M.",
          em: "2026-08-12",
          texto: "Faz sentido considerar a partida do motor?",
          resposta: { em: "2026-08-13", texto: "Faz, e é o erro mais comum." },
        },
      ]),
    );
    expect(c.resposta).toEqual({ quando: "13/08/2026", texto: "Faz, e é o erro mais comum." });
  });

  it("não vaza campo nenhum além do que o bloco mostra", () => {
    // O e-mail e o IP moram no banco, nunca no arquivo publicado. Este teste
    // trava o formato: se alguém acrescentar um campo ao JSON, ele não passa
    // para o HTML por acidente.
    const [c] = paraBloco(arq([{ id: "a", autor: "N", em: "2026-08-12", texto: "texto do comentário" }]));
    expect(Object.keys(c).sort()).toEqual(["autor", "quando", "texto"]);
  });
});

describe("carregarComentarios", () => {
  let raiz: string;

  beforeEach(() => {
    raiz = mkdtempSync(join(tmpdir(), "comentarios-"));
  });
  afterEach(() => {
    rmSync(raiz, { recursive: true, force: true });
  });

  const gravar = (site: string, slug: string, conteudo: string) => {
    const dir = join(raiz, "sites", site, "posts", slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, ARQUIVO), conteudo);
  };

  it("lê o arquivo do post e devolve os itens prontos para o bloco", () => {
    gravar(
      "exemplo",
      "como-configurar-o-roteador",
      JSON.stringify(arq([{ id: "a", autor: "Cleide", em: "2026-08-11", texto: "texto do comentário" }])),
    );
    const itens = carregarComentarios("exemplo", "como-configurar-o-roteador", raiz);
    expect(itens).toEqual([{ autor: "Cleide", quando: "11/08/2026", texto: "texto do comentário" }]);
  });

  it("post sem arquivo devolve lista vazia, e não erro", () => {
    // O normal é o post não ter comentário nenhum. Isso não é falha de build.
    expect(carregarComentarios("exemplo", "post-novo", raiz)).toEqual([]);
  });

  it("arquivo corrompido quebra a build em vez de publicar página capenga", () => {
    gravar("exemplo", "post-torto", "{ isso não é json");
    expect(() => carregarComentarios("exemplo", "post-torto", raiz)).toThrow(/post-torto/);
  });

  it("versão desconhecida quebra a build, porque o formato mudou embaixo", () => {
    gravar("exemplo", "post-futuro", JSON.stringify({ versao: 2, itens: [] }));
    expect(() => carregarComentarios("exemplo", "post-futuro", raiz)).toThrow(/versão/i);
  });
});
