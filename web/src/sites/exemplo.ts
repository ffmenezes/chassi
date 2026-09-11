/**
 * O MODELO. Copie este arquivo para `<seu-slug>.ts`, edite, e depois APAGUE
 * este — ele é o único arquivo do upstream que você tem permissão de apagar.
 *
 * Um site escolhe UM estilo e declara QUAIS blocos do catálogo ele monta.
 * Bloco fora daqui não existe na página.
 *
 *   SITE SOBRESCREVE TOKEN. SITE NUNCA ESCREVE SELETOR.
 *
 * O teto é 6 tokens, e estourar quebra a build. Não é implicância: é o que
 * garante que `scripts/atualizar` nunca vá conflitar com você, porque a sua
 * cara própria mora AQUI e não dentro de um componente.
 */
import type { Site, BlocoId } from "./tipos";

/**
 * Blocos ATIVOS que este site monta — uma seleção deles, não todos: o catálogo
 * tem ativo que este site de exemplo escolheu não montar (13 prateleira, 14
 * card de rede social, 23 calculadora, 27 passos, 28 verificação), e essa
 * escolha é o que a lista existe para registrar. Os átomos vêm junto porque
 * não se escolhe usá-los — a prosa usa.
 *
 * A ordem é a do catálogo, com duas leituras dentro dela:
 *
 *   26 Compartilhar — DEPOIS do card do autor, fechando a lista: é o último
 *                     ato do leitor que terminou o texto, não conteúdo do
 *                     corpo.
 *   29 Slides       — DENTRO, e no corpo. O deck é reforço do argumento, e
 *                     por isso ele exige que exista argumento em volta: só o
 *                     artigo-1 monta um, no meio da seção que ele percorre
 *                     (ver `mock/artigos.ts`). Declarar aqui é o que faz
 *                     `[artigo].astro` poder montá-lo — bloco fora desta
 *                     lista não existe na página, e a recíproca também vale:
 *                     declarar sem ter roteiro de slot é declaração inerte.
 */
const TODOS_DE_ARTIGO: BlocoId[] = [1, 2, 3, 4, 5, 31, 6, 7, 8, 9, 10, 19, 20, 21, 22, 26, 29, "A1", "A2", "A3"];

/**
 * Navegação (N1–N5) é chrome de site, não conteúdo de artigo — por isso nunca
 * entra em ARQUITETURA (ver `catalogo.ts`) e por isso mesmo pede a mesma
 * decisão dos outros: bloco a bloco, com o porquê de cada exclusão. Nenhum
 * dos cinco entra por entrar; cada um só monta se `[artigo].astro` tiver de
 * fato o que ele serve.
 *
 *   N1 Paginação    — FORA. Serve URL própria por página de uma LISTAGEM
 *                     (a página de índice do blog, que este chassi ainda não
 *                     tem). Um artigo é uma página só; não existe "página 2"
 *                     dele para paginar.
 *   N2 Card de artigo — DENTRO. "Continue por aqui" ao final do artigo: a
 *                     mesma peça que a home usa (GradeArtigos), aqui com as
 *                     irmãs do artigo atual. Não depende de nenhum outro
 *                     bloco existir, e é o que mantém o leitor no site
 *                     depois do fechamento.
 *   N3 Toast        — FORA. É resposta a uma ação do leitor — envio de
 *                     formulário, erro de validação. Nenhum bloco montado
 *                     aqui hoje pede essa resposta: Comentários (18) e
 *                     Newsletter (25) são PREVISTOS, e o botão de copiar do
 *                     bloco de código já tem o próprio retorno visual (rótulo
 *                     que vira "Copiado", em `copiarLink.ts`), sem Toast.
 *                     Entra no dia em que um desses formulários entrar.
 *   N4 Overlay      — FORA. É o recipiente de uma ação que o leitor começou
 *                     clicando em algo. Os dois gatilhos do catálogo — Baixe
 *                     em PDF (17) com muro de e-mail, e Oferta de isca (24) —
 *                     não estão montados aqui. Overlay sem gatilho é elemento
 *                     morto no HTML.
 *   N5 Barra de progresso — DENTRO. Mede o <article>, não o documento, e não
 *                     dispara nada — só informa. Não depende de mais nada:
 *                     todo artigo tem começo, meio e fim para medir.
 */
const NAVEGACAO_DE_ARTIGO: BlocoId[] = ["N2", "N5"];

const site: Site = {
  slug: "exemplo",
  nome: "Blog de Exemplo",
  dominio: "exemplo.com.br",
  estilo: "linho",
  modoPadrao: "claro",
  blocos: [...TODOS_DE_ARTIGO, ...NAVEGACAO_DE_ARTIGO],
  muroDeEmail: false,

  emailContato: "contato@exemplo.com.br",
  responsavel: { nome: "Seu Nome", tipo: "pf" },

  // O emoji da aba. TROQUE PELO SEU: é a marca do seu site no navegador do
  // leitor, e o chassi nunca carimba a dele aqui. Apagando a linha, o site
  // nasce sem favicon nenhum — o que ainda é melhor que herdar o tijolo do
  // chassi, mas é uma aba anônima.
  icone: "📡",

  // "nenhum" é o padrão de toda porta: o site builda e publica sem conta
  // nenhuma configurada. Troque quando tiver o identificador em mãos.
  analytics: "nenhum",

  // Desvio declarado sobre o estilo. Até 6 tokens, contados uma vez por token
  // mesmo aparecendo nos dois modos. Descomente e ajuste:
  // tokens: {
  //   claro: { "--b-acento": "#c8622a" },
  //   escuro: { "--b-acento": "#f0a05a" },
  // },
};

export default site;
