/**
 * Bloco 29 — os tipos e as travas do deck, puros.
 *
 * Por que isto não mora dentro de `Slides.astro`, como as travas da Figura e
 * do Aviso moram nos delas: trava que só existe no frontmatter de um `.astro`
 * só é exercida montando o componente, e a suíte deste repositório roda em
 * vitest, sem Astro nem Vite. O resultado prático seria uma trava sem teste
 * que discrimina — e teste que não pode falhar é confiança falsa, que é pior
 * que teste nenhum. Mesma escolha de `avisoBarra.ts` e `consentimento.ts`:
 * a regra é função pura aqui, o componente só chama.
 *
 * O componente continua sendo o dono do PORQUÊ: cada mensagem abaixo explica
 * a razão da trava, não só o que ela barrou.
 */
import type { Props as CamposFigura } from "./components/blocos/Figura.astro";

/** Texto formatado, e formatado é a tipografia base: título, parágrafos e uma
 *  lista. Nada de HTML solto — o slide não é lugar de desenho próprio, e
 *  aceitar marcação aqui abriria a porta que o `--b-*` fecha. */
export interface SlideTexto {
  tipo: "texto";
  titulo: string;
  paragrafos: string[];
  lista?: string[];
}

/** Imagem é o bloco 19 inteiro, delegado: alt obrigatório, alt nunca igual à
 *  legenda, prova e diagrama sem legenda com fonte e data não nascem, `src`
 *  fora do acervo ou `largura`/`altura` divergente do arquivo quebram a
 *  build. Nenhuma dessas travas é reescrita aqui — elas chegam de graça e
 *  continuam iguais em qualquer lugar do artigo. */
export interface SlideImagem {
  tipo: "imagem";
  titulo: string;
  figura: CamposFigura;
}

/**
 * A união é, sozinha, a trava de "texto OU imagem, nunca os dois": não existe
 * objeto que satisfaça os dois lados, então isso falha no type check e nem
 * chega a precisar de `throw`. Trava estrutural é melhor que trava em runtime,
 * porque ela avisa antes de a build começar.
 */
export type Slide = SlideTexto | SlideImagem;

/**
 * O teto. Acima disso não é reforço do artigo: é artigo escondido dentro de um
 * carrossel, e quem não clicar dez vezes não leu o que estava lá. Mesma
 * natureza do `TETO_DE_DESVIO` dos sites — existe para incomodar antes de o
 * problema aparecer, não depois.
 */
export const TETO_DE_SLIDES = 10;

/** O piso: um slide só é um card, e card não pede controle de avançar. */
export const PISO_DE_SLIDES = 2;

/**
 * Roda no frontmatter do componente, ou seja, na build. Estourar quebra a
 * build — não vira aviso que ninguém lê.
 */
export function conferirSlides(slides: Slide[]): void {
  const erro = (m: string): never => {
    throw new Error(`[bloco 29] ${m}`);
  };

  if (slides.length < PISO_DE_SLIDES) {
    erro(
      `deck com ${slides.length} slide(s). Um slide só não é um deck: é um card, ` +
        `e card não pede controle de avançar. Use o bloco que couber, ou escreva ` +
        `o segundo slide.`
    );
  }
  if (slides.length > TETO_DE_SLIDES) {
    erro(
      `deck com ${slides.length} slides, e o teto é ${TETO_DE_SLIDES}. Passou disso ` +
        `não é reforço do artigo: é artigo escondido dentro de um carrossel, onde ` +
        `quem não clicar ${slides.length} vezes não leu.`
    );
  }

  /* O laço percorre TODOS, e isso é o ponto: a versão que checa só o primeiro
     slide passa em qualquer mock bem escrito e falha no artigo real, onde o
     descuido está sempre no último. */
  slides.forEach((slide, i) => {
    const onde = `slide ${i + 1} de ${slides.length}`;

    if (!slide.titulo.trim()) {
      erro(
        `${onde} sem título. Cada slide funciona sozinho: quem cai no meio do deck ` +
          `por um link não leu os anteriores, e sem título não sabe do que este trata.`
      );
    }

    if (slide.tipo === "texto") {
      if (!slide.paragrafos.some((p) => p.trim())) {
        erro(
          `${onde} é de texto e não tem texto. Slide com título e nada embaixo é um ` +
            `clique cobrado do leitor por uma tela vazia.`
        );
      }
      return;
    }

    /* No slide de imagem há três textos com três trabalhos, e a mesma confusão
       que `Figura` já barra entre alt e legenda reaparece aqui com o título do
       slide no meio. */
    const titulo = slide.titulo.trim();
    if (titulo === slide.figura.alt.trim()) {
      erro(
        `${onde} tem título igual ao alt da figura. O alt é para quem NÃO vê a ` +
          `imagem e diz o que está nela; o título diz o que este slide defende. ` +
          `Repetidos, quem usa leitor de tela ouve a frase duas vezes e a imagem ` +
          `continua não descrita.`
      );
    }
    if (slide.figura.legenda && titulo === slide.figura.legenda.trim()) {
      erro(
        `${onde} tem título igual à legenda da figura. A legenda diz por que a ` +
          `imagem está ali, com fonte e data; o título abre o slide. Se os dois são ` +
          `a mesma frase, um dos dois é que está sobrando.`
      );
    }
  });
}
