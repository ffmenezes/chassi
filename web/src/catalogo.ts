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
 *   categoria   a família de FUNÇÃO de um bloco — o eixo que agrupa a
 *               bancada. Todo bloco declara a própria, e é isso que faz
 *               `GRUPOS` (abaixo) não precisar ser lembrado a cada bloco novo.
 */

/** Blocos de artigo levam número; navegação leva `N`, e átomo leva `A`. */
export type BlocoId =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25
  | 26 | 27 | 28 | 29 | 30
  | "N1" | "N2" | "N3" | "N4" | "N5"
  | "A1" | "A2" | "A3";

export type Estado =
  /** HTML que qualquer build entrega hoje, sem uma variável de ambiente configurada. */
  | "ativo"
  /** O componente existe e renderiza aqui; o que falta é a infra que ele
   *  consome — o endpoint está nomeado no comentário de cada um, abaixo. Até
   *  lá cada um nasce inerte e visível, nunca um formulário que engole o dado
   *  em silêncio. Não confundir com `derivado`: aquele não espera infra
   *  nenhuma — a distinção existe porque "Previstos" já cobriu os dois juntos
   *  e isso fazia a bancada anunciar como esperando infra três blocos (15,
   *  16, 17) que já renderizavam. */
  | "previsto"
  /** Reembala o artigo já publicado — áudio, mapa mental, PDF. Regenera na
   *  fase 9 ou sai do ar. Não é `previsto`: não depende de nenhuma infra que
   *  falte, ele já roda hoje sobre o artigo pronto. */
  | "derivado"
  /** Chrome de site. Nunca entra no campo ARQUITETURA. */
  | "navegacao"
  /** O que a prosa usa sem escolher. Também nunca entra em ARQUITETURA. */
  | "atomo";

/**
 * A família de função de um bloco — o eixo que agrupa a bancada.
 *
 * `estado` responde "isso depende de infra que ainda não existe?", uma
 * pergunta SOBRE um bloco; `categoria` responde "isso faz o quê?", a
 * pergunta de quem procura um bloco no inventário. Com 38 blocos, achar "como
 * eu mostro uma tabela?" varrendo grupos de estado obriga a olhar cinco
 * gavetas; por categoria é uma.
 */
export type Categoria =
  | "estrutura"
  | "texto"
  | "dados"
  | "ressalva"
  | "midia"
  | "pergunta"
  | "conversao"
  | "distribuicao"
  | "chrome";

export interface Bloco {
  id: BlocoId;
  nome: string;
  /** Explícito, e não deduzido da faixa numérica: faixa é armadilha na primeira
   *  vez que um bloco novo entra fora de ordem. */
  estado: Estado;
  /** Também explícita, e pela mesma razão do campo acima: é o que faz
   *  `GRUPOS` sobreviver a bloco novo sem precisar de edição em dois lugares.
   *  `conferirCategorias` (`src/bancada.ts`) quebra a build se faltar. */
  categoria: Categoria;
  /** A trava, resumida. Texto integral no arquivo de doutrina. */
  regra: string;
}

export const CATALOGO: readonly Bloco[] = [
  { id: 1, estado: "ativo", categoria: "estrutura", nome: "Abertura", regra: "Cena permitida como veículo, desde que o problema esteja enunciado até a segunda frase." },
  { id: 2, estado: "ativo", categoria: "estrutura", nome: "Caixa de conclusões", regra: "Uma linha por conclusão, com o número dentro dela, e a ressalva viaja junto com o número." },
  { id: 3, estado: "ativo", categoria: "estrutura", nome: "Sumário", regra: "Gerado dos headings. Inline no celular é o mínimo; o trilho fixo no desktop é o extra. Nunca só no desktop." },
  { id: 4, estado: "ativo", categoria: "dados", nome: "Tabela de panorama", regra: "A coluna existe se todas as células saírem do esqueleto congelado. Célula sem dado derruba a coluna." },
  { id: 5, estado: "ativo", categoria: "dados", nome: "Tabela de contraste", regra: "As duas colunas precisam ser apuradas na mesma base. Lado medido contra lado imaginado é defeito." },
  { id: 6, estado: "ativo", categoria: "texto", nome: "Citação destacada", regra: "Conclusão nossa, no máximo duas por artigo. Nunca aforismo, nunca frase de terceiro." },
  { id: 7, estado: "ativo", categoria: "texto", nome: "Citação de fonte nomeada", regra: "Literal, com quem é a pessoa na mesma respiração e o conflito ao lado do nome. Citação não é origem de número." },
  { id: 8, estado: "ativo", categoria: "pergunta", nome: "Checklist", regra: "Item verificável com sim ou não. Recapitula, nunca introduz. Caixa desabilitada enquanto não houver estado." },
  { id: 9, estado: "ativo", categoria: "pergunta", nome: "FAQ em acordeão", regra: "<details>/<summary> nativo, zero JS. A resposta existe no HTML mesmo fechada, então o crawler lê tudo." },
  { id: 10, estado: "ativo", categoria: "estrutura", nome: "Fechamento", regra: "Retoma o problema da abertura e devolve o leitor ao caminho dele com um critério a mais." },
  // 19 entre 10 e 11 porque a ordem aqui é a de leitura, e o número é histórico:
  // a figura nasceu depois. O estado é declarado, e é por isso que não se deduz
  // faixa numérica — ver o comentário do campo `estado`.
  { id: 19, estado: "ativo", categoria: "dados", nome: "Figura", regra: "Alt sempre, e nunca igual à legenda. Prova e diagrama sem legenda com fonte e data não nascem. Número da figura aparece também em texto." },
  { id: 20, estado: "ativo", categoria: "dados", nome: "Bloco de código", regra: "Literal e reproduzível, com rótulo do contexto. Sem $ colável no começo da linha. Realce, existindo, é gerado na build." },
  { id: 21, estado: "ativo", categoria: "ressalva", nome: "Aviso", regra: "Só risco que o leitor não desfaz, com a fonte da norma e a data. Urgência comercial não é aviso, e nada essencial mora aqui." },
  // 22 depois de 21 porque a ordem aqui é a de leitura, e o card do autor fecha o
  // que nós assinamos. Ele é ATIVO: não depende de infra nenhuma, só do
  // base/AUTOR.md preenchido — e enquanto não estiver, ele não nasce, que é a
  // trava dele.
  { id: 22, estado: "ativo", categoria: "estrutura", nome: "Autor", regra: "Byline no topo e card no fim leem o mesmo base/AUTOR.md. Campo vazio ou com placeholder, e o bloco não nasce. Coletivo não assina, e o card tem uma saída só: a página do autor." },
  // 23 é ATIVO e 24 é PREVISTO, e é a mesma régua que separa os dois: bloco
  // ativo é bloco cuja dependência está no ar, não bloco sem dependência
  // nenhuma. A calculadora exige JavaScript no cliente, e só isso — o artigo
  // continua inteiro sem ela, então a dependência está satisfeita por
  // construção. A oferta de isca exige um endpoint (`functions/api/isca.ts`),
  // e este repositório não o tem: chega junto com a aula de iscas do
  // workshop. Até lá, 24 é previsto, igual a qualquer outro bloco esperando
  // a infra dele — e nenhum site declara 24, então `OfertaIsca.astro` não
  // nasce.
  { id: 23, estado: "ativo", categoria: "dados", nome: "Calculadora", regra: "A conta que o corpo já fez por extenso, com as variáveis abertas. Todo campo diz de onde veio o valor de partida, a fórmula é a mesma do texto, e ela não pede e-mail, não esconde resultado e não projeta faturamento." },
  { id: 24, estado: "previsto", categoria: "conversao", nome: "Oferta de isca", regra: "No fechamento, uma por artigo. Promessa literal com número, o que chega e como sair na mesma tela. Sem contagem de downloads, sem escassez, e o arquivo não carrega nada que a página não tenha." },
  // 25 é PREVISTO pela mesma régua do 24: falta o endpoint. `functions/api/
  // newsletter.ts` não existe neste repositório — só há `functions/api/
  // contato.ts`. Os dois vizinhos não cobrem a captura de e-mail para os
  // próximos artigos: a Oferta de isca (24) troca e-mail por arquivo, com
  // consentimento próprio; Comentários (18) só chega a quem comenta, com a
  // caixa embutida no formulário dele. Este é o bloco que falta para quem
  // só quer assinar.
  { id: 25, estado: "previsto", categoria: "conversao", nome: "Newsletter", regra: "Um por página. Promessa do que chega e a saída na mesma tela, vindas de src/consentimento.ts. Sem contagem de assinantes, sem escassez, e a caixa de consentimento nunca nasce marcada." },
  { id: 11, estado: "previsto", categoria: "pergunta", nome: "Enquete", regra: "Pergunta e opções no HTML inicial. Voto não fica atrás de e-mail. Resultado só vira fato com n, data e amostra rotulada." },
  { id: 12, estado: "previsto", categoria: "pergunta", nome: "Avaliação", regra: "“Isso respondeu sua dúvida?”, e o não abre campo livre. Nunca emite AggregateRating." },
  // 13 e 14 são ATIVOS pela mesma régua do 23 contra o 24, escrita acima:
  // bloco ativo é bloco cuja dependência está no ar NESTE repositório. Os dois
  // ficaram anos marcados como previstos por herança da extração, e nenhum dos
  // dois espera infra nenhuma — o sintoma era a bancada anunciar "previsto" em
  // cima de um espécime que renderiza inteiro ali do lado. O carrossel é
  // rolagem em CSS com arraste de mouse como enriquecimento; some o JS e ele
  // continua rolando por dedo, roda e teclado.
  { id: 13, estado: "ativo", categoria: "midia", nome: "Carrossel", regra: "Rolagem em CSS, todos os slides no HTML inicial. Cada legenda funciona sozinha. Só para sequência visual. É PRATELEIRA — vários à vista de uma vez, sem avançar nem retroceder; o deck de um por vez é o 29." },
  // O card de rede social não carrega iframe nem SDK: é exatamente a doutrina
  // do bloco — o texto citado vive no NOSSO HTML, fora do embed — que o deixa
  // sem dependência externa. Marcação estática, entregue por qualquer build.
  { id: 14, estado: "ativo", categoria: "midia", nome: "Card de rede social", regra: "O embed é fonte, e o texto citado vive no nosso HTML fora do iframe. O card de perfil não conta seguidores." },
  { id: 15, estado: "derivado", categoria: "midia", nome: "Escute em áudio", regra: "Locução da prosa, sem autoplay, sem transcrição embaixo. Voz sintética se declara, e este bloco nunca tem muro." },
  { id: 16, estado: "derivado", categoria: "conversao", nome: "Baixe o mapa mental", regra: "Gerado dos headings e do esqueleto. Número não entra em nó de mapa, porque nó não tem lugar para a ressalva." },
  { id: 17, estado: "derivado", categoria: "conversao", nome: "Baixe em PDF", regra: "O artigo inteiro, com fontes e disclosure. O muro de e-mail fica aqui, nunca no artigo, e o botão fica no fim." },
  // Comentários entra em "Perguntar ao leitor" mesmo sendo a versão livre —
  // sem opções fechadas — do que o FAQ, o checklist e a enquete fazem com
  // opções fechadas: abrir espaço para a resposta de quem lê, moderada antes
  // de publicar.
  { id: 18, estado: "previsto", categoria: "pergunta", nome: "Comentários", regra: "Comentário não é fonte. Separado do artigo, link com rel=\"nofollow ugc\", e moderação antes de publicar ou o bloco não nasce." },
  // 26 é ATIVO: nenhum endpoint por trás, só navigator.share() e
  // navigator.clipboard, os dois já funcionando com a infra de hoje.
  { id: 26, estado: "ativo", categoria: "distribuicao", nome: "Compartilhar", regra: "navigator.share() no celular onde existir; senão, destinos explícitos com WhatsApp primeiro. Copiar link reusa copiarLink.ts. Zero script de terceiro: cada destino é URL montada, nunca SDK de rede social. Sem JS, todo destino continua um link que funciona." },
  // 27 é ATIVO: HTML e CSS puros, sem um script sequer.
  { id: 27, estado: "ativo", categoria: "midia", nome: "Passos com detalhe", regra: "O detalhe mora sempre no HTML, nunca injetado por JS. Revela no hover e no foco em tela larga; sempre visível em tela estreita — celular não tem hover, crawler não roda JS. Cada passo é alcançável só de teclado." },
  // 28 é ATIVO: HTML e dados fornecidos pelo esqueleto, sem endpoint nenhum.
  { id: 28, estado: "ativo", categoria: "pergunta", nome: "Verificação", regra: "Introduz, nunca recapitula: auditoria contra um critério, distinta do Checklist. Três estados (atendido, parcial, não atendido) e um nível de importância, os dois em texto — ícone e cor nunca carregam o significado sozinhos. Cada item diz contra qual critério foi avaliado; o bloco não soma nem emite selo, a mesma trava do bloco 12 contra AggregateRating." },
  // 29 é ATIVO: HTML e CSS puros. Os controles são âncoras — `<a href="#s3">` —,
  // e é o navegador que rola o trilho, sem um script sequer. O JS do arquivo é
  // enriquecimento declarado, não dependência.
  { id: 29, estado: "ativo", categoria: "midia", nome: "Slides", regra: "Um slide por vez esconde conteúdo por desenho, então todos nascem no HTML e cada um funciona sozinho: título próprio e a posição em texto (\"2 de 5\"), nunca só um ponto aceso. Avança e retrocede só por gesto do leitor — sem autoplay, e sem laço: o último não volta ao primeiro. Slide é texto OU imagem, nunca os dois; o texto usa a tipografia base e nada mais. Teto de 10, e acima disso é artigo escondido dentro de um carrossel." },
  // 30 é ATIVO, e a régua é a mesma que separou 23 de 24: bloco ativo é bloco
  // cuja dependência está no ar. A dele é JavaScript no cliente, e só — sem
  // endpoint, sem conta, sem env var. É por isso que ele NÃO pede e-mail e não
  // esconde o resultado: as faixas precisam estar no HTML inicial de qualquer
  // forma (crawler não roda JS), então um muro sobre elas seria um
  // `display:none` que Ctrl+U atravessa. Muro de e-mail é assunto do 17 e do
  // 24, cada um com o endpoint e o consentimento próprios, e nenhum dos dois
  // no meio do artigo. O trilho é o do bloco 29, pela mesma razão escrita lá:
  // slide fora da vez tem posição, nunca supressão.
  // Categoria "pergunta": o quiz pergunta, o leitor responde, e a resposta
  // vira faixa ou gabarito — a mesma família de função da Enquete e da
  // Avaliação, só que com mais de uma pergunta por vez.
  { id: 30, estado: "ativo", categoria: "pergunta", nome: "Quiz", regra: "Um modo por quiz: diagnóstico (peso por opção, sem resposta certa) ou prova (gabarito). Na prova, afirmar que uma resposta é a certa é afirmar um fato, então cada gabarito traz o porquê e a fonte com ano, ou a build quebra — e escala não entra em prova, porque escala não tem resposta certa. As faixas cobrem do piso ao teto possível, sem buraco e sem sobreposição: quiz que pode terminar em \"nenhuma faixa\" não nasce. Não pede e-mail, não esconde resultado e não manda resposta a lugar nenhum. Sem JavaScript, faltam só a soma e a faixa apontada — todo o resto, gabarito e faixas inclusive, está no HTML inicial." },
  { id: "N1", estado: "navegacao", categoria: "chrome", nome: "Paginação", regra: "URL própria por página, canônica apontando para ela mesma, sem noindex, e link é <a href>." },
  { id: "N2", estado: "navegacao", categoria: "chrome", nome: "Card de artigo", regra: "Título de feed, description do meta.md, dateModified visível. O que está no grid não conta como link tecido." },
  { id: "N3", estado: "navegacao", categoria: "chrome", nome: "Toast de aviso", regra: "Resposta a uma ação do leitor, nada mais. Toast com número não existe. Erro se diz por inteiro e não some sozinho." },
  { id: "N4", estado: "navegacao", categoria: "chrome", nome: "Overlay de tela cheia", regra: "Recipiente de uma ação que o leitor começou. Nunca abre por entrada, tempo, rolagem ou saída do mouse." },
  { id: "N5", estado: "navegacao", categoria: "chrome", nome: "Barra de progresso", regra: "Mede o artigo, não o documento. E não dispara nada: gatilho de rolagem é o que o N4 proíbe." },
  { id: "A1", estado: "atomo", categoria: "texto", nome: "Prosa e seus átomos", regra: "Forte é o que não se pode perder; código inline é o literal que se digita; tecla é kbd; sigla se expande por escrito; número não se separa da unidade." },
  { id: "A2", estado: "atomo", categoria: "texto", nome: "Listas", regra: "Ordenada só onde a ordem existe. Conclusão não mora em lista, e glossário é <dl>. Dois níveis no máximo." },
  // Categoria "texto": o botão não é prosa, mas é o mesmo tipo de peça que A1
  // e A2 — um átomo que a prosa usa sem escolher, nunca uma entrada própria
  // em ARQUITETURA. Separá-lo dos outros dois átomos criaria uma gaveta de
  // um item só pelo motivo errado (por não ser texto), quando o motivo certo
  // de agrupar os três é o que eles TÊM em comum: nenhum se seleciona.
  { id: "A3", estado: "atomo", categoria: "texto", nome: "Botões", regra: "Rótulo descreve a ação, nunca \"clique aqui\". Um botão forte por tela. Botão que navega é link, não <button>." },
] as const;

export const estadoDe = (id: BlocoId): Estado => blocoPorId(id).estado;

export const categoriaDe = (id: BlocoId): Categoria => blocoPorId(id).categoria;

export const ROTULO_ESTADO: Record<Estado, string> = {
  ativo: "ativo",
  previsto: "previsto",
  derivado: "derivado",
  navegacao: "navegação",
  atomo: "átomo",
};

/**
 * O corte da bancada: um grupo por FUNÇÃO, e é ele que ordena TANTO o índice
 * QUANTO a página (ver `src/bancada.ts`). Antes o corte era por `estado`
 * ("No ar", "Previstos", "Derivados"...), e com 38 blocos esse eixo virou o
 * errado: `estado` responde "isso depende de infra que ainda não existe?",
 * uma pergunta SOBRE um bloco, e como divisória ela obriga quem procura "como
 * eu mostro uma tabela?" a varrer cinco grupos atrás de blocos que fazem a
 * mesma coisa. `estado` continua existindo — é a etiqueta de cada bloco,
 * lida em `Palco.astro` — só deixou de ser o corte.
 *
 * Todo `Categoria` do catálogo tem que cair em exatamente um grupo, e
 * `conferirCobertura` quebra a build se não cair: categoria sem grupo não
 * some com erro, some em silêncio — a mesma armadilha que já existia com
 * `estado`, herdada para o eixo novo. `conferirCategorias` cobre a outra
 * ponta: bloco sem `categoria` nenhuma.
 */
export interface Grupo {
  rotulo: string;
  categorias: Categoria[];
  /** Uma linha dizendo PARA QUE SERVE aquela família de blocos — a página a
   *  imprime no corte. Nota de função, não de estado: o que era "esperando
   *  infra" ou "reembala o artigo" agora mora no comentário do campo
   *  `estado`, que é onde essa pergunta continua fazendo sentido. */
  nota: string;
}

export const GRUPOS: readonly Grupo[] = [
  {
    rotulo: "Estrutura do artigo",
    categorias: ["estrutura"],
    nota: "O esqueleto que todo artigo compartilha: onde ele começa, como se sumariza, o que conclui, como termina, e quem assina.",
  },
  {
    rotulo: "Texto e citação",
    categorias: ["texto"],
    nota: "Os átomos que a prosa usa sem escolher — negrito, lista, botão — mais os dois jeitos de trazer a voz de outra pessoa para dentro do texto. Átomo nunca entra no campo ARQUITETURA de um artigo: ele simplesmente existe onde a prosa precisar.",
  },
  {
    rotulo: "Dados e prova",
    categorias: ["dados"],
    nota: "Onde o número e a evidência ganham forma — tabela, figura, código, calculadora. Cada um carrega a própria trava contra número sem origem.",
  },
  {
    rotulo: "Ressalva",
    categorias: ["ressalva"],
    // Grupo de um bloco só, de propósito: ver a nota abaixo.
    nota: "Um grupo de um bloco só, e é proposital: o Aviso é o único cuja função inteira é carregar um risco que o leitor não desfaz sozinho, com a fonte da norma e a data. Misturá-lo em 'Dados e prova' esconderia a única peça do catálogo que existe por obrigação, não por escolha editorial.",
  },
  {
    rotulo: "Mídia e sequência",
    categorias: ["midia"],
    nota: "Conteúdo que se consome em sequência ou em outro formato: carrossel e slides avançam por gesto do leitor, os passos revelam detalhe, o áudio e o card de rede social trazem outro meio para dentro da página.",
  },
  {
    rotulo: "Perguntar ao leitor",
    categorias: ["pergunta"],
    nota: "Blocos que abrem espaço para a resposta de quem lê — estruturada (checklist, FAQ, enquete, avaliação, verificação, quiz) ou livre (comentário, sempre moderado antes de publicar). Nenhum deles emite selo ou nota agregada.",
  },
  {
    rotulo: "Capturar e converter",
    categorias: ["conversao"],
    nota: "Troca declarada: o leitor dá e-mail ou clique e sai da tela sabendo exatamente o que chega. Oferta de isca e Newsletter pedem e-mail; os dois downloads (mapa mental, PDF) entregam o arquivo. Nenhum esconde o resultado nem projeta número que a página não pode provar.",
  },
  {
    rotulo: "Distribuir",
    categorias: ["distribuicao"],
    // Também um grupo de um bloco só, pelo motivo simétrico ao da Ressalva:
    nota: "Também um grupo de um bloco só: Compartilhar é a única peça do catálogo cuja função é levar o artigo para FORA da página, não fazer algo acontecer dentro dela. Zero SDK de terceiro — cada destino é URL montada.",
  },
  {
    rotulo: "Navegação e chrome",
    categorias: ["chrome"],
    nota: "Chrome de página, não de artigo: serve o site inteiro e nunca entra no campo ARQUITETURA de um artigo — a mesma trava dos átomos, por um motivo diferente: aqui é porque o bloco é do site, lá é porque o bloco é da prosa.",
  },
];

export const blocoPorId = (id: BlocoId): Bloco => {
  const b = CATALOGO.find((x) => x.id === id);
  if (!b) throw new Error(`Bloco ${id} não existe no catálogo`);
  return b;
};

/** Rótulo curto para o chip de numeração: 01, 02, ..., N1. */
export const numeroDe = (id: BlocoId): string =>
  typeof id === "string" ? id : String(id).padStart(2, "0");
