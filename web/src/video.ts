/**
 * Bloco 32 — Vídeo: os tipos, as travas e a montagem da URL, puros.
 *
 * Pela mesma razão de `slides.ts`, `quiz.ts` e `grafico.ts`: trava que só vive
 * no frontmatter de um `.astro` não tem teste que discrimina, e a suíte roda em
 * vitest, sem Astro. A regra é função aqui; `Video.astro` só chama e desenha.
 *
 * O QUE UM VÍDEO É, NESTE CHASSI. Um vídeo é ilustração em movimento, nunca
 * origem de fato. Crawler de IA não assiste vídeo, leitor de tela não assiste
 * vídeo, e quem lê no trem com o som desligado também não. Então a régua é a
 * mesma da figura de prova, endurecida: **o artigo continua inteiro sem o
 * vídeo**. Número que só aparece no vídeo não existe; conclusão que só aparece
 * no vídeo não foi publicada. O que o bloco cobra por escrito é a legenda —
 * ela diz o que o vídeo mostra e por que ele está ali, e é a única parte que
 * todo mundo recebe.
 *
 * DUAS ORIGENS, E A DIFERENÇA ENTRE ELAS É POLÍTICA, NÃO TÉCNICA.
 *
 *   arquivo   um `.mp4`/`.webm` nosso, servido pelo nosso domínio ou por um
 *             CDN nosso. Zero terceiro: nenhum script, nenhum cookie, nenhuma
 *             requisição para fora antes ou depois do play. É o padrão.
 *   youtube   o vídeo mora no YouTube, que é uma empresa de publicidade. O
 *             embed padrão do YouTube carrega script do Google e abre conexão
 *             com o domínio deles ANTES de o leitor decidir assistir, e isso
 *             acontece em toda visita, inclusive nas em que ninguém dá play.
 *
 * Por causa disso a variante `youtube` NÃO usa o embed padrão: ela usa
 * fachada (ver `Video.astro`). A capa é HTML nosso, e o `<iframe>` só nasce
 * no clique. Antes do clique não existe requisição nenhuma para o Google;
 * depois do clique existe, e o leitor foi avisado por escrito na própria capa
 * — é a mesma doutrina de `consentimento.ts`, aplicada a um embed em vez de a
 * um formulário: a frase aparece ANTES da ação que tem consequência.
 *
 * O QUE NÃO DÁ PARA TIRAR DO YOUTUBE, e por que está escrito aqui em vez de
 * prometido no comentário do componente (erro 4 da skill de bloco: comentário
 * que mente é pior que nenhum):
 *
 *   - `rel=0` NÃO desliga vídeos relacionados. Desligava até setembro de 2018;
 *     de lá para cá ele apenas restringe as sugestões ao MESMO canal. Não
 *     existe parâmetro que zere a tela final de sugestões.
 *   - `modestbranding=1` foi descontinuado em agosto de 2023 e hoje é ignorado.
 *     Não está na lista abaixo de propósito: parâmetro que não faz nada é
 *     ruído que o próximo leitor do código vai acreditar que faz.
 *   - `iv_load_policy=3` escondia anotações, e anotações acabaram em 2019.
 *     Mesma razão de estar fora.
 *   - A barra de título, o avatar do canal e o "Assistir no YouTube" continuam
 *     lá durante a reprodução, e levam para o YouTube ao clique. Não há
 *     parâmetro que remova.
 *
 * Ou seja: a poluição que dá para tirar é a de ANTES do play, e a fachada tira
 * ela inteira. A de durante e depois é do YouTube, e quem escolhe hospedar lá
 * escolhe junto. Quem não quer nenhuma delas usa `arquivo`, que é o padrão.
 */

/** Onde o vídeo mora. A escolha entre as duas está no topo deste arquivo. */
export type Origem =
  | {
      tipo: "arquivo";
      /**
       * URL do arquivo de vídeo. Diferente do `src` do bloco 19, este NÃO é
       * caminho dentro de um acervo: não existe acervo de vídeo neste
       * repositório, e onde o participante hospeda o dele é a mesma pergunta
       * em aberto que a das imagens (ver o CLAUDE.md). Aqui é URL livre —
       * caminho absoluto do próprio site (`/exemplo/medicao.mp4`) ou URL
       * completa de um CDN nosso.
       */
      src: string;
      /** Dimensões reais do arquivo. Servem para a proporção, e a proporção
       *  serve para não haver CLS — a mesma razão de `largura`/`altura` no
       *  bloco 19. Ausentes, o bloco assume 16/9. */
      largura?: number;
      altura?: number;
    }
  | {
      tipo: "youtube";
      /** O id de 11 caracteres, ou a URL de onde ele estiver: `youtu.be/…`,
       *  `watch?v=…`, `/embed/…` ou `/shorts/…`. `idDoYoutube` normaliza. */
      id: string;
    };

export interface DadosVideo {
  /** Nome acessível do player e texto da capa. É o que quem não vê o vídeo lê
   *  primeiro, então diz o que ele mostra — não "vídeo 1". */
  titulo: string;
  /** Por que o vídeo está ali. Funciona sozinha, como a legenda do bloco 19,
   *  e nunca repete o título. */
  legenda: string;
  /** Quanto tempo isso custa, escrito: "4 min 12 s". Obrigatória pela mesma
   *  razão do bloco 15: o leitor decide antes de gastar, não durante. */
  duracao: string;
  origem: Origem;
  /** Caminho dentro do acervo (`src/imagens/`) da imagem de capa. Opcional:
   *  sem ela a capa sai como superfície neutra com o título.
   *
   *  O que NUNCA acontece é a capa vir de `i.ytimg.com`: a miniatura do
   *  YouTube é uma requisição ao Google, e buscá-la na carga desfaria
   *  exatamente o que a fachada existe para fazer. */
  poster?: string;
  /** Quem produziu, quando a origem é de terceiro. Vídeo público não é vídeo
   *  livre — a mesma nota do `credito` do bloco 19. */
  credito?: string;
}

/**
 * A frase da capa do YouTube. Mora numa constante, e não solta no template,
 * pela mesma razão de `consentimento.ts`: é a frase que o leitor viu antes de
 * agir, e ela precisa ser uma só em toda a página, revisável num lugar.
 *
 * Ela é específica, e não genérica ("usamos cookies"): diz QUEM recebe (o
 * Google), O QUE recebe (o IP e o cookie) e QUANDO (só no play). Genérica não
 * dá ao leitor nada com que decidir.
 */
export const AVISO_YOUTUBE =
  "Este vídeo está no YouTube. Nada é carregado de lá até você tocar em play — " +
  "a partir daí o Google recebe seu IP e pode gravar cookie no seu navegador.";

/** O que a fachada mostra no lugar do play, para quem chegou sem JavaScript. */
export const ROTULO_SEM_JS = "Assistir no YouTube";

const erro: (m: string) => never = (m: string) => {
  throw new Error(`[bloco 32] ${m}`);
};

/** 11 caracteres do alfabeto de id do YouTube. */
const ID_CRU = /^[\w-]{11}$/;

/**
 * Aceita o id cru ou qualquer uma das quatro formas de URL em que ele
 * costuma chegar colado da barra de endereço.
 *
 * Isso é conveniência com trava junto: o autor cola o que tem, e o que não
 * for id de vídeo quebra a build aqui, com a lista do que é aceito — em vez
 * de virar um `<iframe>` apontando para uma página de canal, que renderiza
 * cinza e em silêncio.
 */
export function idDoYoutube(entrada: string): string {
  const bruto = entrada.trim();
  if (!bruto) {
    erro(`vídeo do YouTube sem id. Cole a URL do vídeo ou o id de 11 caracteres.`);
  }

  if (ID_CRU.test(bruto)) return bruto;

  let url: URL;
  try {
    url = new URL(bruto);
  } catch {
    erro(
      `"${bruto}" não é id nem URL de vídeo do YouTube. Vale o id de 11 ` +
        `caracteres, ou uma destas formas: youtu.be/ID, ` +
        `youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID.`,
    );
  }

  const host = url.hostname.replace(/^www\./, "");
  const partes = url.pathname.split("/").filter(Boolean);

  const candidato =
    host === "youtu.be"
      ? partes[0]
      : host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")
        ? url.searchParams.get("v") ??
          (partes[0] === "embed" || partes[0] === "shorts" || partes[0] === "live"
            ? partes[1]
            : undefined)
        : undefined;

  if (!candidato || !ID_CRU.test(candidato)) {
    erro(
      `"${bruto}" não aponta para um vídeo. O id tem 11 caracteres e sai de ` +
        `youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID ou ` +
        `youtube.com/shorts/ID — link de canal, de playlist ou de busca não serve.`,
    );
  }
  return candidato;
}

/** O link que a capa é enquanto ninguém tem JavaScript. */
export const urlDeAssistir = (id: string): string =>
  `https://www.youtube.com/watch?v=${id}`;

/**
 * A URL do `<iframe>` da fachada. Montada só no clique, e por isso recebe a
 * origem da página em vez de assumir uma: o chassi é estático e não sabe em
 * que domínio vai estar publicado.
 *
 * `autoplay=1` aqui NÃO é autoplay no sentido que os blocos 15 e 29 proíbem:
 * o iframe nasce do clique do leitor no play, e sem esse parâmetro ele teria
 * de clicar duas vezes na mesma coisa. Nada começa sozinho — o que existe é
 * um clique só em vez de dois.
 *
 * Cada parâmetro abaixo tem efeito real hoje. Os que não têm mais estão
 * nomeados no topo do arquivo, com a data em que pararam de ter, e ficam de
 * fora de propósito.
 */
export function urlDoEmbed(id: string, origem?: string): string {
  const p = new URLSearchParams({
    // o leitor já clicou no play; ver o parágrafo acima
    autoplay: "1",
    // não desliga sugestões (ver o topo), mas prende ao mesmo canal
    rel: "0",
    // no iPhone, toca dentro da página em vez de sequestrar a tela inteira
    playsinline: "1",
    // abre o canal de postMessage: é ele que faz um player pausar os outros
    enablejsapi: "1",
    // a barra de progresso sai branca em vez do vermelho da marca
    color: "white",
  });
  // `origin` é o que a documentação do YouTube pede junto de `enablejsapi`,
  // para o player recusar comandos vindos de outra página.
  if (origem) p.set("origin", origem);
  return `https://www.youtube-nocookie.com/embed/${id}?${p}`;
}

/** A origem que `urlDoEmbed` espera, e a que o ouvinte de mensagens confere. */
export const ORIGEM_DO_EMBED = "https://www.youtube-nocookie.com";

/** Extensões que um `<video>` sabe tocar. Página não é vídeo. */
const EXTENSAO_DE_VIDEO = /\.(mp4|webm|ogv|ogg|mov)(\?.*)?$/i;

/**
 * As travas do bloco, todas juntas e testáveis. Roda no frontmatter, antes de
 * qualquer marcação sair.
 */
export function conferirVideo(v: DadosVideo): void {
  if (!v.titulo.trim()) {
    erro(
      `vídeo sem título. O título é o nome acessível do player e o texto da ` +
        `capa: é o que lê quem não vai assistir, e é o que aparece antes de ` +
        `qualquer pixel carregar.`,
    );
  }
  if (!v.legenda.trim()) {
    erro(
      `vídeo sem legenda. Crawler não assiste, leitor de tela não assiste, e ` +
        `quem lê sem som também não: a legenda é a única parte do vídeo que ` +
        `todo mundo recebe. Sem ela o bloco entrega conteúdo para uma parte ` +
        `dos leitores e nada para o resto.`,
    );
  }
  if (v.legenda.trim() === v.titulo.trim()) {
    erro(
      `título e legenda com o mesmo texto. É o mesmo defeito do alt igual à ` +
        `legenda no bloco 19: a frase aparece duas vezes e o vídeo continua ` +
        `sem explicação. O título diz o que o vídeo mostra; a legenda diz por ` +
        `que ele está no artigo.`,
    );
  }
  if (!v.duracao.trim()) {
    erro(
      `vídeo sem duração. É a mesma trava do bloco 15: o leitor decide se vai ` +
        `gastar o tempo ANTES de dar play, e para isso precisa saber quanto é.`,
    );
  }

  if (v.origem.tipo === "arquivo") {
    const src = v.origem.src.trim();
    if (!src) {
      erro(`vídeo de arquivo sem \`src\`. É a URL do .mp4 ou .webm.`);
    }
    if (/youtu\.?be|vimeo\.com/i.test(src)) {
      erro(
        `\`origem: { tipo: "arquivo" }\` com um endereço de YouTube ou Vimeo ` +
          `em \`src\`. Um \`<video>\` não toca a PÁGINA de um serviço de ` +
          `vídeo, ele toca um arquivo. Para YouTube, use ` +
          `\`origem: { tipo: "youtube", id: "…" }\`, que é a variante com ` +
          `fachada e com o aviso de privacidade.`,
      );
    }
    if (!EXTENSAO_DE_VIDEO.test(src)) {
      erro(
        `"${src}" não termina em extensão de vídeo (.mp4, .webm, .ogv, .mov). ` +
          `URL de página vira player cinza e mudo na hora do play, e ninguém ` +
          `revisa isso depois que o artigo já subiu.`,
      );
    }
    const { largura, altura } = v.origem;
    if ((largura === undefined) !== (altura === undefined)) {
      erro(
        `largura e altura vêm em par, ou nenhuma das duas: uma sozinha não dá ` +
          `proporção, e proporção é o que evita o pulo do layout enquanto o ` +
          `vídeo carrega.`,
      );
    }
    if (largura !== undefined && altura !== undefined) {
      if (!Number.isFinite(largura) || !Number.isFinite(altura) || largura <= 0 || altura <= 0) {
        erro(`largura e altura precisam ser números positivos (recebi ${largura}×${altura}).`);
      }
    }
  } else {
    // normaliza e valida de uma vez; `idDoYoutube` já quebra com a mensagem certa
    idDoYoutube(v.origem.id);
  }
}

/**
 * Um identificador único por instância de vídeo renderizada.
 *
 * Mora AQUI, e não no frontmatter do componente, por uma razão que custou uma
 * medição no navegador para aparecer: o frontmatter de um `.astro` é o corpo
 * da função do componente, e roda inteiro A CADA instância. Um `let n = 0` lá
 * dentro não é contador — é uma variável que volta a zero toda vez, e os dois
 * vídeos da mesma página saíam os dois com `id="v1-aviso"`. Id duplicado
 * quebra exatamente o que ele existe para sustentar: o `aria-describedby` do
 * link da fachada passa a apontar para "o primeiro elemento com esse id", que
 * é o aviso do vídeo errado.
 *
 * Um módulo importado, esse sim, é avaliado uma vez por processo — então o
 * contador daqui de fato conta. Ele não reinicia entre páginas do mesmo
 * build; isso é de propósito, porque o que precisa ser único é o id DENTRO de
 * uma página, e um contador que só cresce garante isso sem coordenação
 * nenhuma. O custo é que os números não começam em 1 em toda página, e é um
 * custo que não aparece em lugar nenhum: ninguém lê estes ids.
 */
let contador = 0;
export const proximaMarca = (): string => `v${++contador}`;

/**
 * A proporção do quadro, como `aspect-ratio` do CSS.
 *
 * Não é token de estilo, e por isso não mora em `base.css`: ela é do
 * CONTEÚDO — sai das dimensões do arquivo, exatamente como `width`/`height`
 * saem do metadado da imagem no bloco 19. Estilo não tem opinião sobre a
 * forma do vídeo que o autor gravou.
 */
export function proporcaoDe(origem: Origem): string {
  if (origem.tipo === "arquivo" && origem.largura && origem.altura) {
    return `${origem.largura} / ${origem.altura}`;
  }
  return "16 / 9";
}
