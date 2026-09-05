// web/src/social/texto.ts
/**
 * A matemática do card: medir, quebrar, elipsar, desenhar.
 *
 * Puro de propósito. `quebrar` decide as linhas, `caminhoDe` desenha UMA, e
 * quem compõe é o `arte.ts` — assim a medida e o desenho se testam separados.
 *
 * O texto vira contorno porque o librsvg (que o sharp usa) IGNORA `@font-face`
 * embutido em data URI: com `<text>` no SVG, o card sairia com a fonte da
 * máquina que buildou, e diferente entre o dono e a Cloudflare. Sem `<text>`
 * não há resolução de fonte, e o PNG é o mesmo em qualquer lugar.
 */
import type { Font } from "opentype.js";

export interface Linha {
  texto: string;
  largura: number;
}

const ELIPSE = "…";

const medir = (fonte: Font, texto: string, tamanho: number): number =>
  fonte.getAdvanceWidth(texto, tamanho);

/** Corta caractere a caractere até a palavra com elipse caber na caixa. */
function cortar(fonte: Font, palavra: string, tamanho: number, larguraMax: number): string {
  let corte = palavra;
  while (corte.length > 1 && medir(fonte, corte + ELIPSE, tamanho) > larguraMax) {
    corte = corte.slice(0, -1);
  }
  return corte + ELIPSE;
}

export function quebrar(
  fonte: Font,
  texto: string,
  tamanho: number,
  larguraMax: number,
  maxLinhas: number,
): Linha[] {
  const limpo = texto.trim().replace(/\s+/g, " ");
  if (!limpo) {
    throw new Error("[social] titulo vazio. Card em branco e pior que card nenhum.");
  }

  const linhas: string[] = [];
  let atual = "";

  for (const palavra of limpo.split(" ")) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (medir(fonte, tentativa, tamanho) <= larguraMax) {
      atual = tentativa;
      continue;
    }
    if (atual) linhas.push(atual);
    atual = medir(fonte, palavra, tamanho) > larguraMax
      ? cortar(fonte, palavra, tamanho, larguraMax)
      : palavra;
    if (atual.endsWith(ELIPSE)) {
      linhas.push(atual);
      atual = "";
    }
  }
  if (atual) linhas.push(atual);

  const visiveis = linhas.slice(0, maxLinhas);
  if (linhas.length > maxLinhas) {
    const ultima = visiveis[maxLinhas - 1].replace(/\s+\S*$/, "");
    visiveis[maxLinhas - 1] = (ultima || visiveis[maxLinhas - 1]) + ELIPSE;
  }

  return visiveis.map((t) => ({ texto: t, largura: medir(fonte, t, tamanho) }));
}

export function caminhoDe(
  fonte: Font,
  texto: string,
  x: number,
  y: number,
  tamanho: number,
): string {
  /* 2 casas decimais: o SVG do card cai de ~54KB para ~30KB sem diferença
     visível a 1200×630. */
  return fonte.getPath(texto, x, y, tamanho).toPathData(2);
}
