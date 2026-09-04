/**
 * O catálogo, em código.
 *
 * A autoridade é `.claude/skills/artigo/referencias/arquitetura-pagina.md`.
 * Este arquivo é a projeção dele: mesma numeração, mesmos estados, mesma regra
 * resumida. Componente novo nasce lá, com regra e trava, e só depois entra aqui.
 *
 * Vocabulário (a tabela está no topo do arquivo de doutrina):
 *   bloco       um tipo de peça, com regra própria. Classe, nunca instância.
 *   catálogo    a lista fechada dos blocos que existem. É este arquivo.
 *   arquitetura a seleção e a ordem dos blocos DE UM ARTIGO.
 *   esqueleto   os fatos congelados que preenchem os slots.
 */

/** Blocos de artigo levam número; navegação leva `N`, e átomo leva `A`. */
export type BlocoId =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24
  | "N1" | "N2" | "N3" | "N4" | "N5"
  | "A1" | "A2";

export type Estado =
  /** HTML que qualquer build entrega hoje. */
  | "ativo"
  /** Depende de infra que nenhum site tem ainda. */
  | "previsto"
  /** Reembala o artigo publicado. Regenera na fase 9 ou sai do ar. */
  | "derivado"
  /** Chrome de site. Nunca entra no campo ARQUITETURA. */
  | "navegacao"
  /** O que a prosa usa sem escolher. Também nunca entra em ARQUITETURA. */
  | "atomo";

export interface Bloco {
  id: BlocoId;
  nome: string;
  /** Explícito, e não deduzido da faixa numérica: faixa é armadilha na primeira
   *  vez que um bloco novo entra fora de ordem. */
  estado: Estado;
  /** A trava, resumida. Texto integral no arquivo de doutrina. */
  regra: string;
}

export const CATALOGO: readonly Bloco[] = [
  { id: 1, estado: "ativo", nome: "Abertura", regra: "Cena permitida como veículo, desde que o problema esteja enunciado até a segunda frase." },
  { id: 2, estado: "ativo", nome: "Caixa de conclusões", regra: "Uma linha por conclusão, com o número dentro dela, e a ressalva viaja junto com o número." },
  { id: 3, estado: "ativo", nome: "Sumário", regra: "Gerado dos headings. Inline no celular é o mínimo; o trilho fixo no desktop é o extra. Nunca só no desktop." },
  { id: 4, estado: "ativo", nome: "Tabela de panorama", regra: "A coluna existe se todas as células saírem do esqueleto congelado. Célula sem dado derruba a coluna." },
  { id: 5, estado: "ativo", nome: "Tabela de contraste", regra: "As duas colunas precisam ser apuradas na mesma base. Lado medido contra lado imaginado é defeito." },
  { id: 6, estado: "ativo", nome: "Citação destacada", regra: "Conclusão nossa, no máximo duas por artigo. Nunca aforismo, nunca frase de terceiro." },
  { id: 7, estado: "ativo", nome: "Citação de fonte nomeada", regra: "Literal, com quem é a pessoa na mesma respiração e o conflito ao lado do nome. Citação não é origem de número." },
  { id: 8, estado: "ativo", nome: "Checklist", regra: "Item verificável com sim ou não. Recapitula, nunca introduz. Caixa desabilitada enquanto não houver estado." },
  { id: 9, estado: "ativo", nome: "FAQ em acordeão", regra: "<details>/<summary> nativo, zero JS. A resposta existe no HTML mesmo fechada, então o crawler lê tudo." },
  { id: 10, estado: "ativo", nome: "Fechamento", regra: "Retoma o problema da abertura e devolve o leitor ao caminho dele com um critério a mais." },
  // 19 entre 10 e 11 porque a ordem aqui é a de leitura, e o número é histórico:
  // a figura nasceu depois. O estado é declarado, e é por isso que não se deduz
  // faixa numérica — ver o comentário do campo `estado`.
  { id: 19, estado: "ativo", nome: "Figura", regra: "Alt sempre, e nunca igual à legenda. Prova e diagrama sem legenda com fonte e data não nascem. Número da figura aparece também em texto." },
  { id: 20, estado: "ativo", nome: "Bloco de código", regra: "Literal e reproduzível, com rótulo do contexto. Sem $ colável no começo da linha. Realce, existindo, é gerado na build." },
  { id: 21, estado: "ativo", nome: "Aviso", regra: "Só risco que o leitor não desfaz, com a fonte da norma e a data. Urgência comercial não é aviso, e nada essencial mora aqui." },
  // 22 depois de 21 porque a ordem aqui é a de leitura, e o card do autor fecha o
  // que nós assinamos. Ele é ATIVO: não depende de infra nenhuma, só do
  // base/AUTOR.md preenchido — e enquanto não estiver, ele não nasce, que é a
  // trava dele.
  { id: 22, estado: "ativo", nome: "Autor", regra: "Byline no topo e card no fim leem o mesmo base/AUTOR.md. Campo vazio ou com placeholder, e o bloco não nasce. Coletivo não assina, e o card tem uma saída só: a página do autor." },
  // 23 é ATIVO e 24 é PREVISTO, e é a mesma régua que separa os dois: bloco
  // ativo é bloco cuja dependência está no ar, não bloco sem dependência
  // nenhuma. A calculadora exige JavaScript no cliente, e só isso — o artigo
  // continua inteiro sem ela, então a dependência está satisfeita por
  // construção. A oferta de isca exige um endpoint (`functions/api/isca.ts`),
  // e este repositório não o tem: chega junto com a aula de iscas do
  // workshop. Até lá, 24 é previsto, igual a qualquer outro bloco esperando
  // a infra dele — e nenhum site declara 24, então `OfertaIsca.astro` não
  // nasce.
  { id: 23, estado: "ativo", nome: "Calculadora", regra: "A conta que o corpo já fez por extenso, com as variáveis abertas. Todo campo diz de onde veio o valor de partida, a fórmula é a mesma do texto, e ela não pede e-mail, não esconde resultado e não projeta faturamento." },
  { id: 24, estado: "previsto", nome: "Oferta de isca", regra: "No fechamento, uma por artigo. Promessa literal com número, o que chega e como sair na mesma tela. Sem contagem de downloads, sem escassez, e o arquivo não carrega nada que a página não tenha." },
  { id: 11, estado: "previsto", nome: "Enquete", regra: "Pergunta e opções no HTML inicial. Voto não fica atrás de e-mail. Resultado só vira fato com n, data e amostra rotulada." },
  { id: 12, estado: "previsto", nome: "Avaliação", regra: "“Isso respondeu sua dúvida?”, e o não abre campo livre. Nunca emite AggregateRating." },
  { id: 13, estado: "previsto", nome: "Carrossel", regra: "Rolagem em CSS, todos os slides no HTML inicial. Cada legenda funciona sozinha. Só para sequência visual." },
  { id: 14, estado: "previsto", nome: "Card de rede social", regra: "O embed é fonte, e o texto citado vive no nosso HTML fora do iframe. O card de perfil não conta seguidores." },
  { id: 15, estado: "derivado", nome: "Escute em áudio", regra: "Locução da prosa, sem autoplay, sem transcrição embaixo. Voz sintética se declara, e este bloco nunca tem muro." },
  { id: 16, estado: "derivado", nome: "Baixe o mapa mental", regra: "Gerado dos headings e do esqueleto. Número não entra em nó de mapa, porque nó não tem lugar para a ressalva." },
  { id: 17, estado: "derivado", nome: "Baixe em PDF", regra: "O artigo inteiro, com fontes e disclosure. O muro de e-mail fica aqui, nunca no artigo, e o botão fica no fim." },
  { id: 18, estado: "previsto", nome: "Comentários", regra: "Comentário não é fonte. Separado do artigo, link com rel=\"nofollow ugc\", e moderação antes de publicar ou o bloco não nasce." },
  { id: "N1", estado: "navegacao", nome: "Paginação", regra: "URL própria por página, canônica apontando para ela mesma, sem noindex, e link é <a href>." },
  { id: "N2", estado: "navegacao", nome: "Card de artigo", regra: "Título de feed, description do meta.md, dateModified visível. O que está no grid não conta como link tecido." },
  { id: "N3", estado: "navegacao", nome: "Toast de aviso", regra: "Resposta a uma ação do leitor, nada mais. Toast com número não existe. Erro se diz por inteiro e não some sozinho." },
  { id: "N4", estado: "navegacao", nome: "Overlay de tela cheia", regra: "Recipiente de uma ação que o leitor começou. Nunca abre por entrada, tempo, rolagem ou saída do mouse." },
  { id: "N5", estado: "navegacao", nome: "Barra de progresso", regra: "Mede o artigo, não o documento. E não dispara nada: gatilho de rolagem é o que o N4 proíbe." },
  { id: "A1", estado: "atomo", nome: "Prosa e seus átomos", regra: "Forte é o que não se pode perder; código inline é o literal que se digita; tecla é kbd; sigla se expande por escrito; número não se separa da unidade." },
  { id: "A2", estado: "atomo", nome: "Listas", regra: "Ordenada só onde a ordem existe. Conclusão não mora em lista, e glossário é <dl>. Dois níveis no máximo." },
] as const;

export const estadoDe = (id: BlocoId): Estado => blocoPorId(id).estado;

export const ROTULO_ESTADO: Record<Estado, string> = {
  ativo: "ativo",
  previsto: "previsto",
  derivado: "derivado",
  navegacao: "navegação",
  atomo: "átomo",
};

export const GRUPOS: readonly { rotulo: string; estados: Estado[] }[] = [
  { rotulo: "No ar", estados: ["ativo"] },
  { rotulo: "Átomos", estados: ["atomo"] },
  { rotulo: "Previstos", estados: ["previsto", "derivado"] },
  { rotulo: "Navegação", estados: ["navegacao"] },
];

export const blocoPorId = (id: BlocoId): Bloco => {
  const b = CATALOGO.find((x) => x.id === id);
  if (!b) throw new Error(`Bloco ${id} não existe no catálogo`);
  return b;
};

/** Rótulo curto para o chip de numeração: 01, 02, ..., N1. */
export const numeroDe = (id: BlocoId): string =>
  typeof id === "string" ? id : String(id).padStart(2, "0");
