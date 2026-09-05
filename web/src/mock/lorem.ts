/**
 * O artigo de exemplo, em lorem ipsum.
 *
 * Por que este arquivo existe, separado de `mock/artigo.ts`: os dois mocks têm
 * trabalhos opostos e estavam sendo feitos pelo mesmo.
 *
 *   mock/artigo.ts   o INVENTÁRIO. Conteúdo verossímil, para provar que cada slot
 *                    da doutrina cabe: a ressalva ao lado do número, a lacuna
 *                    declarada, o conflito de interesse ao lado do nome.
 *   mock/lorem.ts    o ARTIGO DE EXEMPLO. Texto sem sentido de propósito, para
 *                    que o julgamento seja de tipografia, ritmo e densidade — e
 *                    não da história do inversor, que prende o olho no assunto.
 *
 * A regra de escrita aqui: **cada texto nomeia o próprio slot**, em português,
 * antes do lorem. "Ressalva — lorem ipsum" diz o que aquela linha cinza é. O
 * nome do componente fica na etiqueta, que é andaime da página; o nome do slot
 * fica no texto, que é o que o estilo tem que conseguir exibir.
 *
 * Os rótulos carregam acento e cedilha de propósito: lorem ipsum é latim e não
 * tem nenhum dos dois, e uma fonte que quebra em "ç" só se denuncia com eles.
 *
 * TODO NÚMERO AQUI É INVENTADO, como no outro mock, e não sai deste arquivo.
 */
import type { Conclusao } from "../components/blocos/CaixaConclusoes.astro";
import type { ItemSumario } from "../components/blocos/Sumario.astro";
import type { Celula } from "../components/blocos/_Tabela.astro";
import type { ItemCheck } from "../components/blocos/Checklist.astro";
import type { Pergunta } from "../components/blocos/Faq.astro";
import type { Slide } from "../components/blocos/Carrossel.astro";
import type { Slide as SlideDeDeck } from "../components/blocos/Slides.astro";
import type { Artigo } from "../components/blocos/GradeArtigos.astro";
import type { Comentario } from "../components/blocos/Comentarios.astro";
import type { Autor } from "../autor";
import type { Props as CamposFigura } from "../components/blocos/Figura.astro";
import type { Props as DadosDiagrama } from "../components/blocos/_DiagramaDemo.astro";
import type { Props as CamposCodigo } from "../components/blocos/Codigo.astro";
import type { Props as CamposAviso } from "../components/blocos/Aviso.astro";

export const titulo = "H1 — Lorem ipsum dolor sit amet, consectetur adipiscing elit";

/** `dateModified`, que é a data que a linha de meta mostra. Ver bloco 17. */
export const atualizado = "2026-08-09";

/** Minutos de leitura. Inventado, como todo número deste arquivo. */
export const minutos = 8;

export const abertura = {
  cena:
    "Cena — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  problema:
    "Problema, até a segunda frase — ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, excepteur sint occaecat cupidatat non proident.",
};

export const conclusoes: Conclusao[] = [
  {
    antes: "Conclusão com o número dentro dela — lorem ipsum dolor sit ",
    numero: "1.234 un",
    depois: ", consectetur adipiscing elit.",
    ressalva: "Ressalva — piso, premissa ou faixa com data. Lorem ipsum, 08/2026",
  },
  {
    antes: "Segunda conclusão, sed do eiusmod tempor incididunt ut ",
    numero: "R$ 4.100",
    depois: " labore et dolore magna aliqua.",
  },
  {
    antes: "Terceira, ut enim ad minim veniam quis nostrud ",
    numero: "42%",
    depois: " exercitation ullamco laboris.",
    ressalva: "Ressalva — lorem ipsum dolor sit amet, caso único apurado",
  },
];

/** Uma fonte só para heading e sumário: o sumário é derivado, nunca digitado. */
export interface Secao { id: string; texto: string; nivel: 2 | 3 }

export const secoes: Secao[] = [
  { id: "s1", texto: "H2 — Lorem ipsum dolor sit amet", nivel: 2 },
  { id: "s2", texto: "H2 — Consectetur adipiscing elit", nivel: 2 },
  { id: "s2a", texto: "H3 — Sed do eiusmod tempor incididunt", nivel: 3 },
  { id: "s2b", texto: "H3 — Ut labore et dolore magna", nivel: 3 },
  { id: "s3", texto: "H2 — Quis nostrud exercitation ullamco", nivel: 2 },
  { id: "s4", texto: "H2 — Duis aute irure dolor in reprehenderit", nivel: 2 },
];

export const sumario: ItemSumario[] = secoes.map((s) => ({
  texto: s.texto,
  href: `#${s.id}`,
  nivel: s.nivel,
}));

export const paragrafos = [
  "Parágrafo de corpo — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Segundo parágrafo — duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

export const panorama = {
  colunas: ["Lorem", "Ipsum", "Dolor", "Sit amet", "Consectetur"],
  linhas: [
    ["Lorem ipsum", "150 un", "8,0", "1,20 kg", { sim: "sim" }],
    ["Dolor sit amet", "750 un", "0,5", "0,38 kg", { sim: "sim" }],
    ["Consectetur elit", "2.500 un", "0,3", "0,75 kg", "não"],
    ["Sed do eiusmod", "60 un", "5,0", "0,30 kg", "não"],
    // a lacuna declarada é slot, e o estilo precisa conseguir mostrá-la
    ["Tempor incididunt", "120 un", "—", { vazio: "[sem dado confiável]" }, "não"],
  ] as Celula[][],
  fonte:
    "Fonte e data da tabela — lorem ipsum dolor sit amet, 08/2026. A linha de baixo declara a lacuna em vez de estimar.",
};

export const contraste = {
  colunas: ["", "Coluna A — antes", "Coluna B — depois"],
  linhas: [
    ["Lorem ipsum", "3.400 un", { sim: "1.850 un" }],
    ["Dolor sit amet", "−1.400 un", { sim: "+150 un" }],
    ["Consectetur elit", "4", { sim: "0" }],
    ["Sed do eiusmod", "—", { sim: "R$ 0" }],
  ] as Celula[][],
  fonte:
    "Fonte e data — as duas colunas saem da mesma base apurada. Lorem ipsum dolor sit amet, 08/2026.",
};

export const destaque =
  "Citação destacada — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.";

export const citacao = {
  texto:
    "“Citação literal de fonte nomeada — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.”",
  nome: "Nome da fonte",
  papel: "Papel — quem é a pessoa e por que a frase dela vale, na mesma respiração",
  conflito:
    "Conflito de interesse — lorem ipsum dolor sit amet: como foi apurado, em que data, e o que a fonte tem a ganhar com a conclusão.",
};

export const figuras: {
  prova: CamposFigura;
  spot: CamposFigura;
  diagrama: { figura: CamposFigura; dados: DadosDiagrama };
} = {
  prova: {
    papel: "prova",
    alt: "Alt — descreve o que está na imagem para quem não a vê: lorem ipsum dolor sit amet, consectetur adipiscing elit",
    legenda:
      "Legenda — diz por que a figura está ali, para quem a vê. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    fonte: "Fonte e data — lorem ipsum, 08/2026. Piso: lorem ipsum dolor sit amet.",
    pendencia: "Marcador — o arquivo ainda não existe, e isto descreve o que falta produzir.",
  },
  spot: {
    papel: "spot",
    alt: "Alt — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    legenda: "Legenda opcional da spot — amarra a cena ao argumento, e não descreve a imagem.",
  },
  diagrama: {
    figura: {
      papel: "diagrama",
      alt: "Alt de diagrama — descreve o que ele mostra, com os números: 3.400 contra 1.850, e o limite em 2.000",
      legenda: "Legenda do diagrama — lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      fonte: "Fonte e data — lorem ipsum, 08/2026. Vai também dentro do SVG, que circula recortado.",
    },
    dados: {
      titulo: "Título do diagrama — lorem ipsum dolor sit amet",
      serieA: { rotulo: "Série A", valor: 3400 },
      serieB: { rotulo: "Série B", valor: 1850 },
      limite: { rotulo: "linha de limite", valor: 2000 },
      unidade: "un",
      fonte: "Fonte dentro do desenho — lorem ipsum, 08/2026",
    },
  },
};

export const codigos: CamposCodigo[] = [
  {
    rotulo: "Rótulo do contexto — planilha, LibreOffice Calc",
    codigo: `=MÁXIMO(B2:B2017)
=SE(B2 > $F$1; "lorem"; "ipsum")`,
  },
  {
    rotulo: "Rótulo do contexto — terminal",
    aviso:
      "Aviso do comando — o que ele faz e o que não desfaz, em texto, antes do trecho. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    codigo: `lorem config --reset-factory --confirm
lorem log --export /tmp/ipsum.csv`,
  },
];

export const avisos: CamposAviso[] = [
  {
    tipo: "atencao",
    titulo: "Aviso do tipo atenção — risco que não se desfaz",
    texto:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    fonte: "Fonte do risco — norma, manual ou lei, com data. Lorem ipsum, 08/2026.",
  },
  {
    tipo: "nota",
    titulo: "Aviso do tipo nota — contexto lateral",
    texto:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. O que interromperia a frase se estivesse na prosa, e que não é essencial para quem pula a caixa.",
  },
];

export const atomos = {
  pico: "3.400 un",
  passos: [
    "Passo 1 — lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Passo 2 — sed do eiusmod tempor incididunt ut labore et dolore magna.",
    "Passo 3 — ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  ],
  conjunto: [
    "Item de conjunto — lorem ipsum dolor sit amet",
    "Outro item irmão — consectetur adipiscing elit",
  ],
  glossario: [
    {
      termo: "Termo do glossário — <dt>",
      definicao: "Definição — <dd>. Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
    },
    {
      termo: "Segundo termo",
      definicao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    },
  ],
};

export const carrossel: Slide[] = [
  { titulo: "Slide 1", legenda: "Legenda que funciona sozinha — lorem ipsum dolor sit amet.", fig: "figura 1" },
  { titulo: "Slide 2", legenda: "Consectetur adipiscing elit, sed do eiusmod tempor.", fig: "figura 2" },
  { titulo: "Slide 3", legenda: "Ut labore et dolore magna aliqua, ut enim ad minim.", fig: "figura 3" },
  { titulo: "Slide 4", legenda: "Quis nostrud exercitation ullamco laboris nisi ut aliquip.", fig: "figura 4" },
];

/**
 * Bloco 29 — o deck, ao lado da prateleira (13) de propósito: no artigo de
 * exemplo os dois aparecem em sequência, que é onde se vê que são peças
 * diferentes e não duas versões da mesma.
 *
 * Como no resto deste arquivo, cada texto nomeia o próprio slot antes do
 * lorem — e aqui isso tem função extra: "Título do slide 3" impresso na tela
 * é o que prova, de olho, que cada slide funciona sozinho.
 */
export const slides: SlideDeDeck[] = [
  {
    tipo: "texto",
    titulo: "Título do slide 1 — abre o deck",
    paragrafos: [
      "Parágrafo do slide — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Segundo parágrafo — ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    ],
  },
  {
    tipo: "texto",
    titulo: "Título do slide 2 — com lista",
    paragrafos: [
      "Parágrafo antes da lista — duis aute irure dolor in reprehenderit in voluptate velit esse.",
    ],
    lista: [
      "Item da lista — lorem ipsum dolor sit amet.",
      "Segundo item — consectetur adipiscing elit, sed do eiusmod.",
      "Terceiro item — tempor incididunt ut labore et dolore.",
    ],
  },
  {
    tipo: "imagem",
    titulo: "Título do slide 3 — este é de imagem",
    figura: {
      papel: "prova",
      alt: "Alt da figura — descreve o que está na imagem para quem não a vê, e nunca repete a legenda nem o título do slide.",
      legenda: "Legenda — diz por que a imagem está aqui, e é a frase que funciona sozinha para quem só viu este slide.",
      fonte: "Fonte e data — obrigatórias em prova, 09/08/2026.",
      pendencia: "Pendência — o que ainda falta produzir para esta figura sair do estado de marcador.",
    },
  },
  {
    tipo: "texto",
    titulo: "Título do slide 4 — fecha sem laço",
    paragrafos: [
      "Último parágrafo — excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
      "Aqui o botão “Próximo” não existe, e é assim que o leitor sabe que o deck acabou em vez de recomeçar sem perceber.",
    ],
  },
];


export const social = {
  embed: {
    autor: "Autor do post citado",
    handle: "@lorem",
    data: "09/08/2026",
    texto:
      "“Texto do post, transcrito literal fora do iframe — lorem ipsum dolor sit amet, consectetur adipiscing elit.”",
    nota: "Nota — o post pode sair do ar, então o texto vive no nosso HTML e a URL entra em citation.",
  },
  perfil: {
    titulo: "Card de perfil — o que o leitor encontra lá",
    motivo: "Motivo — lorem ipsum dolor sit amet, e não “siga a gente”.",
    ancora: "Âncora que diz o destino",
    href: "#n2",
  },
};

export const enquete = {
  pergunta: "Pergunta da enquete — lorem ipsum dolor sit amet?",
  opcoes: ["Opção A — lorem", "Opção B — ipsum", "Opção C — dolor", "Opção D — sit amet"],
  piso: 200,
};

export const checklist: ItemCheck[] = [
  { forte: "Item verificável", resto: "com resposta sim ou não — lorem ipsum dolor sit amet" },
  { forte: "Segundo item", resto: "consectetur adipiscing elit, sed do eiusmod tempor" },
  { forte: "Terceiro item", resto: "ut labore et dolore magna aliqua, ut enim ad minim veniam" },
  { forte: "Quarto item", resto: "quis nostrud exercitation ullamco laboris nisi" },
];

export const faq: Pergunta[] = [
  {
    pergunta: "Pergunta da FAQ — lorem ipsum dolor sit amet?",
    resposta:
      "Resposta — consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    aberto: true,
  },
  {
    pergunta: "Segunda pergunta — duis aute irure dolor?",
    resposta:
      "Resposta — in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, excepteur sint occaecat cupidatat non proident.",
  },
  {
    pergunta: "Terceira pergunta — sunt in culpa qui officia?",
    resposta: "Resposta — deserunt mollit anim id est laborum, lorem ipsum dolor sit amet.",
  },
];

export const fechamento = [
  "Fechamento, primeiro parágrafo — retoma o problema da abertura. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  "Segundo parágrafo — devolve o leitor ao caminho dele com um critério a mais. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
];

export const derivados = {
  audio: { duracao: "14 min" },
  mapa: {
    titulo: "Título do derivado — mapa mental",
    texto: "Texto — lorem ipsum dolor sit amet, com a URL e a data da última alteração dentro do arquivo.",
    ancora: "Âncora do download",
  },
  pdf: {
    titulo: "Título do derivado — PDF",
    texto: "Texto — mesmo conteúdo da página, nada exclusivo. Lorem ipsum dolor sit amet, consectetur.",
    ancora: "Âncora do download",
  },
};

export const overlay = {
  rotulo: "Rótulo do overlay",
  titulo: "Título — o leitor abriu isto por clique, nunca por tempo ou rolagem",
  texto:
    "Texto — lorem ipsum dolor sit amet: o que vai chegar, com que frequência, e como sair em um clique.",
  ancoraPrimaria: "Ação primária",
};

/**
 * O autor do bloco 22, nomeando os próprios slots como todo texto daqui.
 *
 * **Não é pessoa.** O byline real é o `sites/<site>/base/AUTOR.md`, e a foto abaixo é
 * um marcador SVG — que é justamente o que o `AUTOR.md` proíbe em produção. Ele
 * existe porque sem `image` o bloco não nasce, e a página de exemplo precisa
 * mostrar o bloco nos cinco estilos.
 *
 * Sem `perfil`, de propósito: a `/autores/{slug}` não está no ar em site nenhum,
 * e o estado sem link é o que os estilos precisam saber desenhar hoje.
 */
export const autor: Autor = {
  nome: "Nome do Autor",
  slug: "nome-do-autor",
  jobTitle: "Cargo — lorem ipsum dolor sit",
  description:
    "Credencial — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  image:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23cfc7ba'/%3E%3Ctext x='32' y='42' font-family='sans-serif' font-size='26' fill='%23615a4e' text-anchor='middle'%3ENA%3C/text%3E%3C/svg%3E",
  sameAs: [],
};

export const comentarios: Comentario[] = [
  {
    autor: "Autor do comentário",
    quando: "12/08/2026",
    texto:
      "Comentário — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    resposta: {
      quando: "13/08/2026",
      texto: "Resposta do autor do artigo — ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    },
  },
  {
    autor: "Segundo autor",
    quando: "11/08/2026",
    texto: "Comentário sem resposta — duis aute irure dolor in reprehenderit in voluptate velit esse.",
  },
];

export const irmas: Artigo[] = [
  {
    tituloFeed: "Título de feed — lorem ipsum dolor sit amet",
    descricao: "Descrição literal do meta.md — consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    atualizadoEm: "11/08/2026",
    href: "#irma-1",
  },
  {
    tituloFeed: "Segundo título de feed — ut labore et dolore magna",
    descricao: "Descrição — ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    atualizadoEm: "02/08/2026",
    href: "#irma-2",
  },
  {
    tituloFeed: "Terceiro título de feed — duis aute irure dolor",
    descricao: "Descrição — in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    atualizadoEm: "24/07/2026",
    href: "#irma-3",
  },
];
