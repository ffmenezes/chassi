/**
 * O template futuro de cada site.
 *
 * Um site escolhe **um estilo** e declara **quais blocos do catálogo ele monta**.
 * Nada aqui é por artigo: é a decisão de site que o `infra.md` e o `DESIGN.md`
 * do site guardam. Muro de e-mail que aparece num artigo e não no outro é o
 * leitor descobrindo a regra por tentativa.
 */
import type { BlocoId } from "../catalogo";

/**
 * Antes era união de literais. A varredura de pasta (`styles/estilos/index.ts`)
 * descobre o conjunto só em tempo de build, então a união deixou de ser
 * sustentável aqui. A perda de type check é consciente: a validação equivalente
 * (estilo inexistente quebra a build) entra como checagem em tempo de build.
 */
export type Estilo = string;
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

/**
 * Pessoa física e jurídica se comportam diferente na página jurídica: CNPJ é
 * registro público e é o que Ads e Meta esperam; CPF exposto em página
 * indexada é convite a fraude e não é exigido por lei nenhuma para
 * identificar controlador. Ver `institucional/dados.ts` para as duas funções
 * que leem este tipo.
 */
export interface Responsavel {
  nome: string;
  tipo: "pf" | "pj";
  /** CPF ou CNPJ. Só o CNPJ é renderizado, e só onde a regra abaixo permitir. */
  documento?: string;
  /**
   * CNPJ é registro público, mas também é chave de busca: quem consulta na
   * Receita recebe de volta o endereço registrado da empresa, que para MEI ou
   * empresa de uma pessoa só é quase sempre a casa do dono. Mostrar o CNPJ no
   * rodapé de toda página é publicar esse endereço em toda página, com um
   * passo de indireção. Por isso o padrão é NÃO mostrar ali — a LGPD exige
   * identificar o controlador e dar canal de contato, e nome e e-mail bastam,
   * sem documento nenhum. Ligue este campo quando o site vende (identificação
   * do fornecedor em lugar visível passa a ser exigida) ou quando o dono
   * quer o sinal de legitimidade, que é convenção forte no Brasil. A página
   * jurídica não usa este campo: lá o documento aparece sempre que for PJ,
   * porque é a página que existe para essa identificação. Ausente = desligado,
   * e pessoa física nunca estampa documento, aqui ligado ou não.
   */
  mostrarDocumentoNoRodape?: boolean;
}

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
  /** Quem responde pelo site. Alimenta as páginas jurídicas. */
  responsavel: Responsavel;
  /** Para onde vai a mensagem do formulário de contato. */
  emailContato: string;
  /** Qual adaptador de analytics este site usa. Decide a página de cookies. */
  analytics?: "ga4" | "cloudflare" | "posthog" | "nenhum";
  /** Identificador da conta de analytics (G-XXXX, chave do PostHog, etc.). */
  analyticsId?: string;
  /** Conta do AdSense. Ausente = o slot de anúncio não renderiza nada. */
  adsenseId?: string;
  /**
   * O emoji do favicon. Ausente, NENHUMA tag de icone sai — em vez de
   * carimbar a marca do template na aba do leitor de outra pessoa. O tijolo
   * do chassi vale so onde nao ha site: bancada e vitrine de estilo.
   */
  icone?: string;
  /**
   * Recado curto e passageiro no topo de toda página: aviso, evento,
   * promoção, mudança de regra. Ausente = a barra não existe no HTML —
   * clonar o chassi não pode herdar propaganda de ninguém por engano.
   *
   * Quem fecha não vê de novo o MESMO texto (guardado no navegador de quem
   * fechou — ver `avisoBarra.ts`). Trocar `texto` é publicar um aviso novo:
   * quem já tinha fechado o anterior volta a ver este, porque fechar um
   * recado não é fechar todos os que vierem depois dele.
   */
  avisoBarra?: {
    texto: string;
    /** Os dois juntos, ou nenhum: link sem texto não tem o que o leitor vê. */
    linkHref?: string;
    linkTexto?: string;
  };
}

export type { BlocoId } from "../catalogo";
