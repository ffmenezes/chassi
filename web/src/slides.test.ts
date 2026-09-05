import { describe, expect, it } from "vitest";
import { conferirSlides, PISO_DE_SLIDES, TETO_DE_SLIDES } from "./slides";
import type { Slide } from "./slides";

/* Fábricas curtas, para que cada teste mostre só o que ele está exercitando —
   o resto do slide sai daqui, válido, e não polui a leitura. */
const texto = (n: number): Slide => ({
  tipo: "texto",
  titulo: `Título do slide ${n}`,
  paragrafos: [`Parágrafo do slide ${n}.`],
});

const deck = (quantos: number): Slide[] =>
  Array.from({ length: quantos }, (_, i) => texto(i + 1));

const imagem = (over: {
  titulo?: string;
  alt?: string;
  legenda?: string;
}): Slide => ({
  tipo: "imagem",
  titulo: over.titulo ?? "Onde a chamada caiu",
  figura: {
    papel: "spot",
    alt: over.alt ?? "Gráfico com uma linha subindo até cruzar o limite do link",
    ...(over.legenda === undefined ? {} : { legenda: over.legenda }),
  },
});

describe("conferirSlides — o tamanho do deck", () => {
  it("aceita o piso e o teto exatos", () => {
    /* As duas fronteiras, e não um valor confortável no meio: é onde um `<`
       trocado por `<=` se esconde. */
    expect(() => conferirSlides(deck(PISO_DE_SLIDES))).not.toThrow();
    expect(() => conferirSlides(deck(TETO_DE_SLIDES))).not.toThrow();
  });

  it("recusa um slide só — isso é um card, não um deck", () => {
    expect(() => conferirSlides(deck(1))).toThrow(/não é um deck/);
  });

  it("recusa um passo acima do teto", () => {
    expect(() => conferirSlides(deck(TETO_DE_SLIDES + 1))).toThrow(/o teto é 10/);
  });
});

describe("conferirSlides — cada slide funciona sozinho", () => {
  it("aceita um deck em que todo slide tem título e conteúdo", () => {
    expect(() => conferirSlides(deck(4))).not.toThrow();
  });

  it("recusa título vazio", () => {
    const slides = deck(3);
    slides[1] = { ...texto(2), titulo: "" };
    expect(() => conferirSlides(slides)).toThrow(/sem título/);
  });

  it("recusa título só de espaço em branco", () => {
    const slides = deck(3);
    slides[1] = { ...texto(2), titulo: "   " };
    /* Sem o `.trim()` na checagem, `"   "` é truthy e passa — e um título de
       três espaços é exatamente tão inútil para quem cai no slide 2 quanto
       nenhum título. */
    expect(() => conferirSlides(slides)).toThrow(/sem título/);
  });

  it("O DEFEITO NO ÚLTIMO SLIDE também é pego", () => {
    /* Este é o teste que existe por causa do erro 13 da skill: a checagem por
       slide foi escrita como laço, e um laço que na verdade só olhasse o
       primeiro item (`slides[0]` em vez de `forEach`) passaria em todos os
       testes acima — em todos eles o defeito está no meio ou no começo. No
       artigo real o descuido está sempre no último slide, que é o que foi
       escrito com pressa. Quebrando o laço de propósito para checar só
       `slides[0]`, ESTE teste é o único que fica vermelho. */
    const slides = deck(5);
    slides[4] = { ...texto(5), titulo: "" };
    expect(() => conferirSlides(slides)).toThrow(/slide 5 de 5/);
  });
});

describe("conferirSlides — slide de texto", () => {
  it("recusa slide de texto sem nenhum parágrafo", () => {
    const slides = deck(3);
    slides[1] = { tipo: "texto", titulo: "Título", paragrafos: [] };
    expect(() => conferirSlides(slides)).toThrow(/não tem texto/);
  });

  it("recusa slide cujos parágrafos são todos espaço em branco", () => {
    const slides = deck(3);
    slides[1] = { tipo: "texto", titulo: "Título", paragrafos: ["", "  ", "\n"] };
    expect(() => conferirSlides(slides)).toThrow(/não tem texto/);
  });

  it("aceita quando UM parágrafo tem texto, ainda que outro esteja vazio", () => {
    /* A régua é `some`, não `every`: um parágrafo vazio no meio é desleixo de
       edição, não um slide vazio. Trocar `some` por `every` faz este teste
       cair, e é para isso que ele existe ao lado dos dois de cima. */
    const slides = deck(3);
    slides[1] = { tipo: "texto", titulo: "Título", paragrafos: ["", "Tem texto aqui."] };
    expect(() => conferirSlides(slides)).not.toThrow();
  });
});

describe("conferirSlides — slide de imagem", () => {
  it("aceita título, alt e legenda como três frases diferentes", () => {
    const slides: Slide[] = [
      texto(1),
      imagem({
        titulo: "Onde a chamada caiu",
        alt: "Gráfico com uma linha subindo até 340 Mbps e cruzando a tracejada de 300",
        legenda: "O pico passou 40 Mbps acima do que o link entrega, e a chamada caiu.",
      }),
    ];
    expect(() => conferirSlides(slides)).not.toThrow();
  });

  it("aceita imagem sem legenda — quem exige legenda é o papel, no bloco 19", () => {
    /* Esta trava não reescreve as da Figura: papel `spot` não pede legenda, e
       negar aqui seria uma segunda doutrina sobre o mesmo campo. */
    const slides: Slide[] = [texto(1), imagem({ legenda: undefined })];
    expect(() => conferirSlides(slides)).not.toThrow();
  });

  it("recusa título igual ao alt", () => {
    const mesma = "Gráfico do pico das 6h18 cruzando o limite do link";
    const slides: Slide[] = [texto(1), imagem({ titulo: mesma, alt: mesma })];
    expect(() => conferirSlides(slides)).toThrow(/igual ao alt/);
  });

  it("recusa título igual ao alt mesmo com espaço em volta DOS DOIS", () => {
    /* O espaço sobra nos DOIS lados de propósito. A primeira versão deste
       teste só sujava o título, e por isso não discriminava nada do lado do
       alt: derrubar `.trim()` do alt deixava a suíte inteira verde, porque o
       alt já estava limpo. Sujando os dois, qualquer um dos dois `.trim()`
       que sumir faz este teste cair — e é o único que cai. Espaço não se
       pronuncia: para quem usa leitor de tela as duas frases são a mesma. */
    const slides: Slide[] = [
      texto(1),
      imagem({ titulo: "  Gráfico do pico das 6h18 ", alt: " Gráfico do pico das 6h18   " }),
    ];
    expect(() => conferirSlides(slides)).toThrow(/igual ao alt/);
  });

  it("recusa título igual à legenda, com espaço em volta dos dois", () => {
    /* Mesma razão do teste do alt logo acima: sem sujeira dos dois lados, o
       `.trim()` da legenda ficaria sem nada que o exercite. */
    const mesma = "O pico passou 40 Mbps acima do que o link entrega";
    const slides: Slide[] = [
      texto(1),
      imagem({
        titulo: `  ${mesma}`,
        alt: "Gráfico com uma linha cruzando a tracejada do limite",
        legenda: `${mesma}  `,
      }),
    ];
    expect(() => conferirSlides(slides)).toThrow(/igual à legenda/);
  });
});
