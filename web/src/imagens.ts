/**
 * O acervo de imagens do site, e as duas travas que ele traz junto.
 *
 * A API do bloco 19 não muda: `src` continua string. O que muda é o
 * significado — passa a ser o caminho DENTRO de `src/imagens/`, e não um
 * caminho livre. Essa é a troca que permite `astro:assets` entrar sem que o
 * autor tenha de importar cada arquivo à mão.
 *
 * As duas travas existem pela mesma razão do `alt` igual à legenda quebrar a
 * build: são erros que ninguém revisa e que só aparecem em produção.
 *
 *   src que nao resolve  →  imagem quebrada na pagina publicada, em silencio
 *   largura declarada errada  →  o CLS que a largura existia para evitar
 *
 * `largura` e `altura` deixam de ser declaração de fé: o metadado do arquivo
 * tem as reais, e divergir passa a ser falha de build.
 */
import { getImage } from "astro:assets";

export interface FiguraOtimizada {
  src: string;
  srcset: string;
  sizes: string;
  largura: number;
  altura: number;
}

/** A varredura é eager porque o metadado é o que interessa, e ele é pequeno. */
const ACERVO = import.meta.glob<{ default: ImageMetadata }>(
  "/src/imagens/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true },
);

const RAIZ = "/src/imagens/";

/**
 * A coluna de leitura, em número: `.artigo` tem `max-width: 836px` menos a
 * `--b-sangria` dos dois lados (`pages/[artigo].astro`), o que dá ~756px de
 * conteúdo — e 768 é a aproximação de sempre para essa medida.
 *
 * Aproximação CONHECIDA, e declarada aqui para não virar surpresa: a partir de
 * 1180px, num artigo SEM sumário, a mesma coluna abre para `max-width: 1108px`
 * (~1028px de conteúdo) e este `sizes` continua dizendo 768. Nesse caso o
 * navegador escolhe o candidato de 768w para um espaço de ~1000px, e a imagem
 * sai um pouco mole. Trocar o número é decisão de layout que pede medição, não
 * palpite; até lá, o custo está escrito.
 */
const SIZES = "(max-width: 768px) 100vw, 768px";

/** Os candidatos do `srcset`, filtrados pelo que o arquivo original comporta. */
const LARGURAS = [480, 768, 1024, 1440];

const erro: (m: string) => never = (m: string) => {
  throw new Error(`[imagens] ${m}`);
};

export async function otimizar(
  src: string,
  largura?: number,
  altura?: number,
): Promise<FiguraOtimizada> {
  /* SVG não entra por aqui, e a mensagem tem de dizer isso: sem esta guarda o
     autor recebe "nao existe no acervo" e sai caçando um erro de digitação que
     não existe. Desenho é código — entra inline pelo slot da figura, com o
     contrato próprio dele. */
  if (/\.svgz?$/i.test(src)) {
    erro(
      `"${src}": SVG nao entra por \`src\`. Desenho e codigo — ele entra ` +
        `inline pelo slot da figura (<Figura ...><svg .../></Figura>), que e ` +
        `onde ele herda cor e tipografia do estilo. O acervo de \`src\` e so ` +
        `de raster (png, jpg, jpeg, webp, avif).`,
    );
  }

  const chave = `${RAIZ}${src}`;
  const modulo = ACERVO[chave];

  if (!modulo) {
    const existentes = Object.keys(ACERVO)
      .map((k) => k.slice(RAIZ.length))
      .sort();
    erro(
      `"${src}" nao existe no acervo. As imagens moram em web/src/imagens/, e ` +
        `o src e o caminho a partir dali. Hoje existem: ` +
        `${existentes.length ? existentes.join(", ") : "(nenhuma)"}.`,
    );
  }

  const original = modulo.default;

  if (largura !== undefined && largura !== original.width) {
    erro(
      `"${src}": largura declarada ${largura}, arquivo tem ${original.width}. ` +
        `Largura errada e o CLS que ela existia para evitar — apague a ` +
        `declaracao e deixe o arquivo responder.`,
    );
  }
  if (altura !== undefined && altura !== original.height) {
    erro(
      `"${src}": altura declarada ${altura}, arquivo tem ${original.height}.`,
    );
  }

  const larguras = LARGURAS.filter((l) => l <= original.width);
  if (!larguras.includes(original.width)) larguras.push(original.width);

  const otimizada = await getImage({
    src: original,
    format: "webp",
    widths: larguras,
    sizes: SIZES,
  });

  return {
    src: otimizada.src,
    srcset: otimizada.srcSet.attribute,
    sizes: SIZES,
    largura: original.width,
    altura: original.height,
  };
}
