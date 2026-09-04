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

validar(descobertos, nomesDeEstilo());

export const SITES: Record<string, Site> = Object.fromEntries(
  descobertos.map((s) => [s.slug, s]),
);

/** Site de demonstração da bancada: monta tudo, para o catálogo aparecer inteiro. */
export const SITE_DEMO: Site = {
  slug: "bancada",
  nome: "Bancada",
  dominio: "localhost",
  estilo: "vidro",
  modoPadrao: "escuro",
  blocos: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    "N1", "N2", "N3", "N4", "N5", "A1", "A2",
  ],
  muroDeEmail: true,
  emailContato: "contato@localhost",
  responsavel: { nome: "Bancada", tipo: "pf" },
  analytics: "nenhum",
};

export const listaDeSites = (): Site[] => Object.values(SITES);
