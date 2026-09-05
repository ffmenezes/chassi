// web/src/social/arte.ts
/**
 * O desenho do card, em SVG, com o texto já em contorno.
 *
 * O que carrega a identidade aqui é o ACENTO, não a tipografia: ele está
 * disponível em tempo de build (`ESTILOS[estilo].acento`) e o desvio declarado
 * do site vence quando existe, pela mesma ordem que vale na página.
 *
 * Fundo e tinta são constantes por modo, e isso é limitação declarada, não
 * esquecimento: os tokens reais (`--b-fundo`, `--b-tinta`) moram no CSS dos
 * estilos e não são legíveis a partir daqui. Alargar `MetaEstilo` resolve
 * depois, sem mexer em nada disto.
 */
import type { Site } from "../sites/tipos";
import { ESTILOS } from "../styles/estilos";
import { fonteDoCard } from "./fonte";
import { quebrar, caminhoDe } from "./texto";

const LARGURA = 1200;
const ALTURA = 630;
const MARGEM = 80;
const CAIXA = LARGURA - MARGEM * 2;
const TAMANHO_TITULO = 64;
const ENTRELINHA = 82;
const MAX_LINHAS = 3;
const TAMANHO_RODAPE = 28;

const NEUTROS = {
  claro: { fundo: "#f7f5f1", tinta: "#17150f" },
  escuro: { fundo: "#141210", tinta: "#f5f0e8" },
} as const;

/** O acento do estilo, com o desvio declarado do site vencendo. */
function acentoDoSite(site: Site): string {
  const estilo = ESTILOS[site.estilo];
  /*
   * Defesa DECLARADAMENTE redundante, e fica: `sites/validacao.ts` já recusa
   * estilo inexistente no import, então nenhum site que chega ao build passa
   * por aqui com estilo torto. Isto existe para o dia em que esta função pura
   * for chamada de fora dessa garantia (um teste, uma ferramenta, um módulo
   * novo) — aí ela falha alto em vez de devolver um card sem cor.
   */
  if (!estilo) {
    throw new Error(
      `[social] estilo "${site.estilo}" nao existe. Os que existem: ` +
        `${Object.keys(ESTILOS).sort().join(", ")}.`,
    );
  }
  return site.tokens?.[site.modoPadrao]?.["--b-acento"] ?? estilo.acento;
}

export function svgDoCard(site: Site, titulo: string): string {
  const acento = acentoDoSite(site);
  const { fundo, tinta } = NEUTROS[site.modoPadrao];
  const fonte = fonteDoCard();

  const linhas = quebrar(fonte, titulo, TAMANHO_TITULO, CAIXA, MAX_LINHAS);
  const alturaTexto = linhas.length * ENTRELINHA;
  const topo = (ALTURA - alturaTexto) / 2 + TAMANHO_TITULO * 0.7;

  const desenho = linhas
    .map((l, i) => {
      const d = caminhoDe(fonte, l.texto, MARGEM, topo + i * ENTRELINHA, TAMANHO_TITULO);
      return `<path d="${d}" fill="${tinta}"/>`;
    })
    .join("");

  /*
   * O rodape passa por `quebrar` antes de virar path: sem isso, um nome de
   * site comprido produz path para o texto inteiro e corre pra fora dos
   * 1200px do card. `maxLinhas = 1` reaproveita a mesma elipse ja testada em
   * texto.test.ts, em vez de este arquivo inventar um segundo truncamento.
   */
  const [linhaRodape] = quebrar(fonte, `${site.dominio} · ${site.nome}`, TAMANHO_RODAPE, CAIXA, 1);
  const rodape = caminhoDe(fonte, linhaRodape.texto, MARGEM, ALTURA - MARGEM + 12, TAMANHO_RODAPE);

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LARGURA}" height="${ALTURA}" ` +
    `viewBox="0 0 ${LARGURA} ${ALTURA}">` +
    `<rect width="${LARGURA}" height="${ALTURA}" fill="${fundo}"/>` +
    `<rect width="${LARGURA}" height="12" fill="${acento}"/>` +
    desenho +
    `<path d="${rodape}" fill="${acento}"/>` +
    `</svg>`
  );
}
