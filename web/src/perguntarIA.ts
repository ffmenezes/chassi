/**
 * Bloco 33 — Perguntar à IA: o pedido, as travas e os destinos, puros.
 *
 * Pela mesma razão de `video.ts` e `slides.ts`: trava que só vive no
 * frontmatter de um `.astro` não tem teste que discrimina. A regra é função
 * aqui; `PerguntarIA.astro` só chama e desenha.
 *
 * O bloco é primo do 26 (Compartilhar): cada destino é um `<a href>` com o
 * texto já codificado na query string, zero script de terceiro, e nada do
 * serviço carrega antes do clique. A diferença é o que viaja — lá um link,
 * aqui um PEDIDO, e o pedido é texto nosso falando em nome do leitor. Daí as
 * três regras que o 26 não precisa ter:
 *
 *   1. O pedido é NEUTRO. Ele pede resumo e as ressalvas que o próprio artigo
 *      faz. Não pede à IA que diga "o que o leitor perde por não ler", nem
 *      nada que faça a resposta trabalhar de vendedor do artigo — isso é a
 *      urgência comercial que o catálogo inteiro recusa (ver o bloco 21).
 *   2. O pedido manda a IA DIZER quando não conseguiu abrir a página. Serviço
 *      sem navegação, ou página bloqueada, é a hora em que o modelo resume o
 *      título e inventa o resto; a frase existe para trocar a invenção por um
 *      "não consegui".
 *   3. O pedido está no HTML, legível ANTES do clique. Ninguém manda texto em
 *      nome do leitor sem que ele possa ler o que vai.
 *
 * OS DEEPLINKS NÃO SÃO API PÚBLICA. Cada serviço aceita `?q=` hoje porque
 * quer, e pode deixar de aceitar amanhã sem aviso. Nenhum dos quatro foi
 * testado contra o serviço real a partir deste repositório: a forma veio da
 * documentação informal e do que outros sites usam. Quando um quebrar, o
 * conserto é uma linha em `DESTINOS_IA` — e "Copiar o pedido", no bloco, é o
 * caminho que continua de pé para qualquer IA, inclusive as que não estão
 * na lista. O Gemini ficou de fora por isso: não há parâmetro conhecido que
 * preencha a caixa de entrada.
 */

/**
 * O teto do pedido codificado, em caracteres. URL longa é cortada em silêncio
 * por servidor e proxy pelo caminho — e pedido cortado no meio é pior que
 * pedido nenhum, porque chega sem a frase do "diga se não conseguiu abrir".
 * 2000 é o limite prático que todo navegador e CDN aceita.
 */
export const TETO_DO_PEDIDO = 2000;

export interface DestinoIA {
  nome: string;
  /** O prefixo da URL; o pedido codificado entra logo depois. */
  prefixo: string;
}

/**
 * A ordem é a de uso no Brasil: ChatGPT primeiro, pelo mesmo motivo de o
 * WhatsApp abrir a lista do bloco 26. O resto é ordem alfabética.
 */
export const DESTINOS_IA: readonly DestinoIA[] = [
  { nome: "ChatGPT", prefixo: "https://chatgpt.com/?q=" },
  { nome: "Claude", prefixo: "https://claude.ai/new?q=" },
  { nome: "Grok", prefixo: "https://grok.com/?q=" },
  { nome: "Perplexity", prefixo: "https://www.perplexity.ai/search?q=" },
];

function erro(msg: string): never {
  throw new Error(`[bloco 33] ${msg}`);
}

/** O texto que vai para a IA, exatamente o que o leitor lê no bloco. */
export function montarPedido(url: string, titulo: string): string {
  if (!titulo.trim()) {
    erro("título vazio. O pedido nomeia o artigo para a IA saber o que procurar na página.");
  }
  if (!/^https:\/\/[^\s/]+\.[^\s/]+\//.test(url)) {
    erro(
      `URL "${url}" não é absoluta com https. A IA abre a página por fora do site: ` +
        "caminho relativo não leva a lugar nenhum.",
    );
  }
  return (
    `Leia o artigo "${titulo.trim()}", em ${url}, e me ajude a entendê-lo. ` +
    "Resuma os pontos principais e diga quais ressalvas e limites o próprio artigo apresenta. " +
    "Depois responda às minhas perguntas usando o artigo como fonte. " +
    "Se não conseguir abrir a página, diga isso em vez de supor o conteúdo."
  );
}

/** Os destinos com a URL pronta. Quebra a build se o pedido passar do teto. */
export function destinosDoPedido(pedido: string): { nome: string; href: string }[] {
  const codificado = encodeURIComponent(pedido);
  if (codificado.length > TETO_DO_PEDIDO) {
    erro(
      `o pedido codificado tem ${codificado.length} caracteres, e o teto é ${TETO_DO_PEDIDO}. ` +
        "URL longa é cortada em silêncio pelo caminho; encurte o título do artigo.",
    );
  }
  return DESTINOS_IA.map((d) => ({ nome: d.nome, href: d.prefixo + codificado }));
}
