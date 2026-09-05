/**
 * Varre `./*.ts` e monta o registro dos sites.
 *
 * Registrar um site é CRIAR UM ARQUIVO, nunca editar este. É essa diferença
 * que faz `scripts/atualizar` nunca conflitar: você e o upstream jamais
 * escrevem no mesmo arquivo.
 *
 * `validar` roda no import, ou seja, no build: estilo inexistente, slug
 * repetido, troca de fonte e estouro de teto QUEBRAM A BUILD. Não viram aviso.
 */
import type { Site } from "./tipos";
import { validar, cssDoSite, TETO_DE_DESVIO } from "./validacao";
import { nomesDeEstilo } from "../styles/estilos";
import { CATALOGO } from "../catalogo";

export type { Site, Modo, Estilo, TokenB, DesvioDeSite, Responsavel } from "./tipos";
export { cssDoSite, TETO_DE_DESVIO, validar };
export { ESTILOS, nomesDeEstilo } from "../styles/estilos";
export type { MetaEstilo } from "../styles/estilos";

/**
 * A exclusão dos módulos de infraestrutura é padrão negativo no próprio
 * glob, não filtro depois de importar: nenhum deles tem `export default`, e
 * um glob eager com `import: "default"` quebra a build na análise estática
 * do Rollup se tentar importar `default` de um módulo que não o exporta.
 */
const modulos = import.meta.glob(
  ["./*.ts", "!./index.ts", "!./tipos.ts", "!./validacao.ts", "!./validacao.test.ts"],
  { eager: true, import: "default" },
) as Record<string, Site | undefined>;

const descobertos: Site[] = Object.values(modulos).filter(
  (site): site is Site => Boolean(site && site.slug),
);

export const SITES: Record<string, Site> = Object.fromEntries(
  descobertos.map((s) => [s.slug, s]),
);

/** Site de demonstração do inventário: monta tudo, para o catálogo aparecer inteiro. */
export const SITE_DEMO: Site = {
  slug: "inventario",
  nome: "Inventário",
  dominio: "localhost",
  estilo: "vidro",
  modoPadrao: "escuro",
  // Derivado do catálogo, não escrito à mão: o inventário monta tudo por
  // definição, e uma lista digitada diverge do catálogo assim que alguém
  // acrescenta um bloco lá e esquece de repetir aqui. Já divergiu: faltavam
  // os blocos 23 e 24, e eles simplesmente não apareciam na página, sem
  // sinal nenhum de ausência.
  blocos: CATALOGO.map((b) => b.id),
  muroDeEmail: true,
  emailContato: "contato@localhost",
  responsavel: { nome: "Inventário", tipo: "pf" },
  analytics: "nenhum",
};

// SITE_DEMO escapa da varredura por não ser arquivo de site descoberto, mas
// usa estilo de verdade (`vidro`) e precisa da mesma garantia: se o estilo
// sumir de src/styles/estilos/, a build avisa aqui, não em runtime silencioso.
validar([...descobertos, SITE_DEMO], nomesDeEstilo());

export const listaDeSites = (): Site[] => Object.values(SITES);
