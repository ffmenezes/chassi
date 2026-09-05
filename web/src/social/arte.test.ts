// web/src/social/arte.test.ts
import { describe, it, expect } from "vitest";
import { svgDoCard } from "./arte";
import { quebrar, caminhoDe } from "./texto";
import { fonteDoCard } from "./fonte";
import type { Site } from "../sites/tipos";

const base: Site = {
  slug: "s", nome: "Blog de Exemplo", dominio: "exemplo.com.br",
  estilo: "linho", modoPadrao: "escuro", blocos: [], muroDeEmail: false,
  emailContato: "c@s.com", responsavel: { nome: "Nome Sobrenome", tipo: "pf" },
};

describe("svgDoCard", () => {
  it("tem a medida que as plataformas esperam", () => {
    const svg = svgDoCard(base, "Titulo");
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
  });

  it("nunca emite tag de texto: e isso que torna o PNG igual em toda maquina", () => {
    expect(svgDoCard(base, "Titulo com acentuacao: cao, e, a")).not.toContain("<text");
  });

  it("desenha o titulo e o rodape como path", () => {
    const svg = svgDoCard(base, "Titulo");
    expect(svg.split("<path").length - 1).toBeGreaterThanOrEqual(2);
  });

  it("o desvio de token do site vence o acento do estilo", () => {
    const desviado: Site = {
      ...base,
      tokens: { escuro: { "--b-acento": "#ff0099" } },
    };
    expect(svgDoCard(desviado, "Titulo")).toContain("#ff0099");
  });

  it("estilo inexistente quebra, em vez de sair sem cor", () => {
    expect(() => svgDoCard({ ...base, estilo: "nao-existe" }, "T")).toThrow(/estilo/i);
  });

  it("rodape com nome de site longo demais sai truncado, nao estourando a caixa", () => {
    // O defeito do plano: o rodape era desenhado direto, sem medir. Um nome
    // de site comprido produzia um path para o texto inteiro, correndo pra
    // fora dos 1200px do card. A correcao passa o rodape por `quebrar` antes
    // de desenhar — mesma garantia (nunca largura > CAIXA) que o titulo ja
    // tem. Aqui a gente computa, com as MESMAS funcoes ja testadas em
    // texto.test.ts, qual e o path CORRETO (ja truncado) e confere que e
    // exatamente esse path que sai dentro do SVG — nao o do texto inteiro.
    const fonte = fonteDoCard();
    const nomeLongo: Site = {
      ...base,
      nome: "Um Nome De Site Absurdamente Longo Que Ultrapassa A Largura Disponivel Na Faixa Do Rodape Inteira",
    };
    const textoRodape = `${nomeLongo.dominio} · ${nomeLongo.nome}`;
    const CAIXA = 1200 - 80 * 2; // LARGURA - MARGEM*2, ver arte.ts
    const [linhaEsperada] = quebrar(fonte, textoRodape, 28, CAIXA, 1);

    expect(linhaEsperada.largura).toBeLessThanOrEqual(CAIXA);
    expect(linhaEsperada.texto.endsWith("…")).toBe(true);

    const pathEsperado = caminhoDe(fonte, linhaEsperada.texto, 80, 630 - 80 + 12, 28);
    expect(svgDoCard(nomeLongo, "Titulo")).toContain(pathEsperado);
  });
});
