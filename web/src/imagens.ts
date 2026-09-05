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

const erro = (m: string) => {
  throw new Error(`[imagens] ${m}`);
};

export async function otimizar(
  src: string,
  largura?: number,
  altura?: number,
): Promise<FiguraOtimizada> {
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

  const original = modulo!.default;

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

  const larguras = [480, 768, 1024, 1440].filter((l) => l <= original.width);
  if (!larguras.includes(original.width)) larguras.push(original.width);

  const otimizada = await getImage({
    src: original,
    format: "webp",
    widths: larguras,
    sizes: "(max-width: 768px) 100vw, 768px",
  });

  return {
    src: otimizada.src,
    srcset: otimizada.srcSet.attribute,
    sizes: "(max-width: 768px) 100vw, 768px",
    largura: original.width,
    altura: original.height,
  };
}
