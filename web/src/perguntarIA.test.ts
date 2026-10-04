import { describe, expect, it } from "vitest";
import { DESTINOS_IA, TETO_DO_PEDIDO, destinosDoPedido, montarPedido } from "./perguntarIA";

const URL_OK = "https://exemplo.com.br/artigo-1/";

describe("montarPedido", () => {
  it("leva o título e a URL, e manda dizer quando não abriu a página", () => {
    const p = montarPedido(URL_OK, "Por que a chamada trava");
    expect(p).toContain('"Por que a chamada trava"');
    expect(p).toContain(URL_OK);
    expect(p).toMatch(/não conseguir abrir a página/);
  });

  it("segue a estrutura do Akita: busca na web, depois quatro passos numerados", () => {
    const p = montarPedido(URL_OK, "Título");
    expect(p).toMatch(/^Por favor, abra esta URL com busca na web/);
    expect(p).toMatch(/\n1\) Resuma os 5 pontos[^\n]*\n2\) [^\n]*\n3\) [^\n]*\n4\) Sugira/);
  });

  it("não vende o artigo", () => {
    // A frase do pedido que a gente recusou de propósito: a IA de vendedora.
    expect(montarPedido(URL_OK, "Título")).not.toMatch(/perdendo|curios/i);
  });

  it("recusa título vazio", () => {
    expect(() => montarPedido(URL_OK, "   ")).toThrow(/\[bloco 33\] título vazio/);
  });

  it("recusa URL relativa e URL sem https", () => {
    expect(() => montarPedido("/artigo-1/", "Título")).toThrow(/não é absoluta/);
    expect(() => montarPedido("http://exemplo.com.br/a/", "Título")).toThrow(/não é absoluta/);
  });
});

describe("destinosDoPedido", () => {
  it("um link por destino, com o pedido inteiro codificado na query", () => {
    const pedido = montarPedido(URL_OK, "Wi-Fi & pico: 50% do tempo?");
    const destinos = destinosDoPedido(pedido);
    expect(destinos.map((d) => d.nome)).toEqual(DESTINOS_IA.map((d) => d.nome));
    for (const d of destinos) {
      const q = new URL(d.href).searchParams.get("q");
      // `&`, `?` e `%` no título não podem partir a query: volta idêntico.
      expect(q).toBe(pedido);
    }
  });

  it("aceita título comum e recusa o que estoura o teto", () => {
    // O título longo leva o pedido codificado para cima do teto; o curto fica
    // bem abaixo. Sem a trava, o segundo expect falha.
    expect(() => destinosDoPedido(montarPedido(URL_OK, "a".repeat(200)))).not.toThrow();
    const longo = montarPedido(URL_OK, "a".repeat(TETO_DO_PEDIDO));
    expect(() => destinosDoPedido(longo)).toThrow(/teto é 2000/);
  });
});
