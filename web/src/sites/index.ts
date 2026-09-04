/**
 * O template futuro de cada site.
 *
 * Um site escolhe **um estilo** e declara **quais blocos do catálogo ele monta**.
 * Nada aqui é por artigo: é a decisão de site que o `infra.md` e o `DESIGN.md`
 * do site guardam. Muro de e-mail que aparece num artigo e não no outro é o
 * leitor descobrindo a regra por tentativa.
 */
import type { BlocoId } from "../catalogo";

export type Estilo = "linho" | "concreto" | "vidro" | "circuito" | "ceu";
export type Modo = "claro" | "escuro";

/**
 * Os tokens que um site pode sobrescrever. A união existe para que um typo
 * (`--b-acent`) falhe no type check em vez de virar CSS morto.
 */
export type TokenB =
  | "--b-fundo" | "--b-superficie"
  | "--b-tinta" | "--b-corpo" | "--b-tinta-2"
  | "--b-linha" | "--b-linha-forte"
  | "--b-acento" | "--b-acento-tinta" | "--b-acento-forte" | "--b-acento-fraco"
  | "--b-sobre-acento" | "--b-sombra-cor" | "--b-erro"
  | "--b-radius" | "--b-borda" | "--b-sombra" | "--b-sombra-hover" | "--b-lift"
  | "--b-blur" | "--b-medida" | "--b-aurora"
  | "--b-peso-titulo" | "--b-titulo-track" | "--b-track-rotulo" | "--b-caixa-rotulo";

export type DesvioDeSite = Partial<Record<Modo, Partial<Record<TokenB, string>>>>;

export interface Site {
  slug: string;
  nome: string;
  dominio: string;
  /** Forma e tipografia. A cor vem do modo. */
  estilo: Estilo;
  /** Ponto de partida. O leitor troca, e a escolha dele vence. */
  modoPadrao: Modo;
  /** Os blocos que este site monta. Bloco fora daqui não existe na página. */
  blocos: BlocoId[];
  /**
   * Muro de e-mail nos derivados que saem como arquivo (16 e 17).
   * Nunca vale para o artigo nem para o áudio: ver a seção do muro na doutrina.
   */
  muroDeEmail: boolean;
  /**
   * Desvio declarado sobre o estilo. Dois sites podem usar `vidro` e divergir
   * só nisto.
   *
   *   SITE SOBRESCREVE TOKEN. SITE NUNCA ESCREVE SELETOR.
   *
   * No minuto em que um site mirar o interior de um componente
   * (`.b-card .fig { ... }`), o template quebrou para o próximo site, porque
   * passou a existir CSS que conhece a estrutura de um bloco. Enquanto o
   * desvio for só valor de variável, o site novo nasce limpo por construção.
   */
  tokens?: DesvioDeSite;
}

/**
 * Os ativos: HTML que qualquer build entrega hoje, figura, código e aviso
 * inclusive. Os átomos A1 e A2 vêm junto porque não se escolhe usá-los — a
 * prosa usa, e o site que não os entrega bem entrega prosa mal formatada.
 */
const TODOS_DE_ARTIGO: BlocoId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, "A1", "A2"];

/**
 * Site único do chassi: vitrine mínima para o build e a bancada funcionarem.
 * Cada participante do workshop troca isto pelo site dele em `web/src/sites/`.
 */
export const SITES: Record<string, Site> = {
  exemplo: {
    slug: "exemplo",
    nome: "Blog de Exemplo",
    dominio: "exemplo.com.br",
    estilo: "linho",
    modoPadrao: "claro",
    blocos: [...TODOS_DE_ARTIGO],
    muroDeEmail: false,
  },
};

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
};

export const ESTILOS: Record<Estilo, { nome: string; acento: string; origem: string }> = {
  linho: {
    nome: "Linho",
    acento: "#cc785c",
    origem: "Tokens do sistema do Claude. Serifa é a voz de display; o corpo é sans humanista.",
  },
  concreto: {
    nome: "Concreto",
    acento: "#7c4dee",
    origem: "Tokens da certfique.com.br. Borda 2px, sombra dura 4px 4px 0, hover que desloca.",
  },
  vidro: {
    nome: "Vidro",
    acento: "#00e5cc",
    origem: "Tokens da ibe.ia.br. Superfície translúcida sobre aurora, blur com saturação.",
  },
  circuito: {
    nome: "Circuito",
    acento: "#bbf451",
    origem: "Tokens da cofounder.co. Tinta por opacidade, e o lime só preenche, nunca vira texto.",
  },
  ceu: {
    nome: "Céu",
    acento: "#006aff",
    origem: "Tokens do Bluesky. Zero sombra, hairline de 1px, e o rótulo é peso — nunca caixa alta.",
  },
};

/**
 * O teto, e ele existe para ser incômodo antes de o problema aparecer.
 *
 * Site que sobrescreve acento E superfícies E fontes não é "vidro com uma
 * personalização": é um estilo novo usando vidro como atalho. Sem teto, daqui a
 * um ano existem três vidros irreconhecíveis entre si e nenhum deles é o vidro.
 */
export const TETO_DE_DESVIO = 6;

const FAMILIA_TIPOGRAFICA: string[] = ["--b-fonte-titulo", "--b-fonte-corpo", "--b-fonte-meta"];

/** Roda no build. Estourar o teto quebra a build, não vira aviso ignorado. */
function validarDesvios(sites: Record<string, Site>): void {
  for (const site of Object.values(sites)) {
    if (!site.tokens) continue;
    const usados = new Set<string>();
    for (const modo of Object.keys(site.tokens) as Modo[]) {
      for (const token of Object.keys(site.tokens[modo] ?? {})) {
        usados.add(token);
        if (FAMILIA_TIPOGRAFICA.includes(token)) {
          throw new Error(
            `[sites] ${site.slug} troca ${token}. Troca de família tipográfica não é ` +
              `desvio: vire um estilo próprio em src/styles/estilos/.`
          );
        }
      }
    }
    if (usados.size > TETO_DE_DESVIO) {
      throw new Error(
        `[sites] ${site.slug} sobrescreve ${usados.size} tokens, e o teto é ${TETO_DE_DESVIO}. ` +
          `Passou disso não é desvio sobre "${site.estilo}": é um estilo novo usando ` +
          `"${site.estilo}" como atalho. Crie src/styles/estilos/<nome>.css.`
      );
    }
  }
}

validarDesvios(SITES);

/** Vira o `<style>` que o layout emite, na camada `site`, que vence sempre. */
export function cssDoSite(site: Site): string {
  if (!site.tokens) return "";
  const regras: string[] = [];
  for (const modo of Object.keys(site.tokens) as Modo[]) {
    const decls = Object.entries(site.tokens[modo] ?? {})
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
    if (!decls) continue;
    /* @layer site vence [data-estilo][data-modo] sem depender de especificidade */
    regras.push(`[data-site="${site.slug}"][data-modo="${modo}"]{${decls}}`);
  }
  return regras.length ? `@layer site{${regras.join("")}}` : "";
}

export const listaDeSites = (): Site[] => Object.values(SITES);
