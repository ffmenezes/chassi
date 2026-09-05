/**
 * Os três artigos de exemplo da rota `/[artigo]/`.
 *
 * O par de mocks já tem divisão de trabalho — ver o comentário no topo de
 * `mock/lorem.ts` — e este arquivo fica do lado do LOREM: título, descrição,
 * data e os títulos de seção são plausíveis (é isso que faz a página parecer
 * um blog de verdade), mas a prosa de dentro é lorem ipsum de propósito, para
 * que ninguém confunda estas três peças com conteúdo publicável. Tabela,
 * citação, aviso e código seguem a mesma regra: rótulo real, conteúdo latim.
 *
 * O autor é o de `mock/artigo.ts` ("Fulano de Tal"), e não o de `lorem.ts`
 * ("Nome do Autor") — os dois mocks não podem ter persona diferente, senão o
 * site de exemplo passa a ter dois autores fictícios em vez de um.
 *
 * Cada artigo é um roteiro de SLOTS, na ordem em que a página monta. O
 * sumário nunca é digitado à parte: `[artigo].astro` deriva ele filtrando os
 * slots do tipo "titulo" — é a mesma regra de `lorem.ts`, aplicada aqui a três
 * roteiros diferentes em vez de um só.
 *
 * Os três montam um conjunto de blocos DIFERENTE de propósito (ver a tabela no
 * relatório da tarefa): nenhum decide tabela, citação, código e aviso do
 * mesmo jeito, para que os três juntos mostrem repertório e não a mesma
 * página três vezes.
 *
 * TODO NÚMERO AQUI É INVENTADO, como nos outros dois mocks, e não sai deste
 * arquivo.
 */
import type { Conclusao } from "../components/blocos/CaixaConclusoes.astro";
import type { Celula } from "../components/blocos/_Tabela.astro";
import type { ItemCheck } from "../components/blocos/Checklist.astro";
import type { Pergunta } from "../components/blocos/Faq.astro";
import type { Props as CamposFigura } from "../components/blocos/Figura.astro";
import type { Props as CamposCodigo } from "../components/blocos/Codigo.astro";
import type { Props as CamposAviso } from "../components/blocos/Aviso.astro";
import type { Slide as SlideDeDeck } from "../components/blocos/Slides.astro";

export { autor } from "./artigo";

/**
 * Um item do roteiro. `nivel` só existe no slot "titulo" — é dali que o
 * sumário e os headings nascem, sempre da mesma lista.
 */
export type Slot =
  | { tipo: "titulo"; nivel: 2 | 3; id: string; texto: string }
  | { tipo: "paragrafo"; texto: string }
  /** Bloco A1 — um parágrafo com os átomos de prosa (forte, ênfase, código inline). */
  | { tipo: "prosa"; html: string }
  /** Bloco A2 — lista ordenada, só onde a ordem existe. */
  | { tipo: "lista"; itens: string[] }
  | { tipo: "tabelaPanorama"; colunas: string[]; linhas: Celula[][]; fonte: string }
  | { tipo: "tabelaContraste"; colunas: string[]; linhas: Celula[][]; fonte: string }
  | { tipo: "figura"; dados: CamposFigura }
  | { tipo: "citacaoDestacada"; texto: string }
  | { tipo: "citacaoFonte"; texto: string; nome: string; papel: string; conflito: string }
  | { tipo: "codigo"; dados: CamposCodigo }
  | { tipo: "aviso"; dados: CamposAviso }
  | { tipo: "checklist"; rotulo: string; itens: ItemCheck[] }
  | { tipo: "faq"; itens: Pergunta[] }
  /** Bloco 29 — o deck de um slide por vez. Só o artigo-1 monta: os três
   *  artigos existem para mostrar repertório diferente, não a mesma página
   *  três vezes. */
  | { tipo: "slides"; rotulo?: string; slides: SlideDeDeck[] }
  | { tipo: "fechamento"; paragrafos: string[] };

export interface DadosArtigo {
  slug: string;
  titulo: string;
  descricao: string;
  /** `dateModified`, YYYY-MM-DD. Dia de calendário, sem fuso — ver `data.ts`. */
  atualizado: string;
  minutos: number;
  selo: string;
  abertura: { cena: string; problema: string };
  /** Bloco 2. Só o primeiro e o terceiro artigo têm — o segundo mostra que o
   *  artigo continua de pé sem ela. */
  conclusoes?: { rotulo?: string; itens: Conclusao[] };
  slots: Slot[];
}

export const ARTIGOS: DadosArtigo[] = [
  // ---------------------------------------------------------------------
  // artigo-1 — tabela de panorama, citação destacada, prosa com átomos e o
  // deck do bloco 29.
  // Sem aviso e sem bloco de código.
  // ---------------------------------------------------------------------
  {
    slug: "artigo-1",
    titulo: "Por que a chamada de vídeo trava no horário de pico",
    descricao:
      "O plano contratado quase nunca é o problema. É a diferença entre consumo médio e pico simultâneo, e como enxergar essa diferença antes de contratar mais internet.",
    atualizado: "2026-07-18",
    minutos: 7,
    selo: "Guia — internet doméstica",
    abertura: {
      cena:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      problema:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat — o plano contratado tinha margem de sobra no papel, e mesmo assim não segurou a manhã. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    conclusoes: {
      itens: [
        {
          antes: "O gargalo é o pico simultâneo, não o consumo médio: ",
          numero: "lorem ipsum",
          depois: " ultrapassa o link contratado por poucos segundos.",
          ressalva: "faixa fictícia, apenas para ilustrar o slot",
        },
        {
          antes: "Reordenar os aparelhos custa ",
          numero: "R$ 0",
          depois: " e resolve a maior parte dos casos, sed do eiusmod tempor.",
        },
        {
          antes: "Trocar o roteador só compensa acima de ",
          numero: "6 aparelhos",
          depois: " simultâneos, consectetur adipiscing elit.",
          ressalva: "premissa do exemplo, não é dado apurado",
        },
      ],
    },
    slots: [
      { tipo: "titulo", nivel: 2, id: "s1", texto: "Consumo médio contra pico simultâneo" },
      {
        tipo: "paragrafo",
        texto:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        tipo: "tabelaPanorama",
        colunas: ["Aparelho", "Consumo", "Horas/dia", "Entra no pico"],
        linhas: [
          ["Notebook do home office", "lorem Mbps", "8,0", { sim: "sim" }],
          ["Backup na nuvem", "ipsum Mbps", "0,5", { sim: "sim" }],
          ["Streaming em 4K", "dolor Mbps", "0,3", { sim: "sim" }],
          ["Câmera de segurança", "sit Mbps", "5,0", "não"],
          // a lacuna é declarada, não preenchida — mesmo slot que os outros mocks exercem
          ["Smart TV", "—", "amet", { vazio: "[sem dado confiável]" }],
        ] as Celula[][],
        fonte: "Fonte e data fictícias — lorem ipsum, 07/2026. A linha da Smart TV declara a lacuna em vez de estimar.",
      },
      {
        tipo: "figura",
        dados: {
          papel: "prova",
          alt: "Alt fictício — tela de um monitor de rede com um pico de tráfego ultrapassando a linha do link contratado",
          legenda:
            "Legenda fictícia — o pico coincide com o horário em que dois aparelhos de maior consumo se encontram.",
          fonte: "Fonte e data fictícias — registro de exemplo, 07/2026.",
          pendencia: "Marcador — recorte de tela ainda não produzido para este exemplo.",
        } satisfies CamposFigura,
      },
      { tipo: "titulo", nivel: 2, id: "s2", texto: "O que muda quando você reordena os aparelhos" },
      {
        tipo: "paragrafo",
        texto:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      {
        /* O deck entra ANTES da citação destacada de propósito: ele percorre o
           passo a passo, e a citação é a conclusão que vem depois de ter
           percorrido. Deck no fim da seção seria o leitor clicando quatro
           vezes para chegar onde o parágrafo seguinte já o levaria. */
        tipo: "slides",
        rotulo: "A reordenação, passo a passo",
        slides: [
          {
            tipo: "texto",
            titulo: "1. Descubra quem acorda junto",
            paragrafos: [
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            ],
          },
          {
            tipo: "texto",
            titulo: "2. Separe o automático do que você usa",
            paragrafos: [
              "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            ],
            lista: [
              "Primeiro item da lista dentro do slide — lorem ipsum dolor.",
              "Segundo item — consectetur adipiscing elit, sed do eiusmod.",
            ],
          },
          {
            tipo: "imagem",
            titulo: "3. Confira no monitor",
            figura: {
              papel: "prova",
              alt: "Alt da figura dentro do slide — descreve o que está na imagem para quem não a vê, e nunca repete a legenda nem o título do slide.",
              legenda: "Legenda — diz por que a imagem está aqui, e funciona sozinha para quem só viu este slide.",
              fonte: "Fonte e data — obrigatórias em prova, 09/08/2026.",
              pendencia: "Pendência — o recorte da tela que ainda falta produzir.",
            },
          },
          {
            tipo: "texto",
            titulo: "4. Repita na semana seguinte",
            paragrafos: [
              "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
              "Neste último slide o botão “Próximo” não existe: sem laço, o leitor sabe que acabou em vez de recomeçar sem perceber.",
            ],
          },
        ],
      },
      {
        tipo: "citacaoDestacada",
        texto:
          "Chamada de vídeo que trava quase nunca é problema do plano. É problema de dois aparelhos que pedem banda no mesmo segundo.",
      },
      {
        tipo: "prosa",
        html:
          'Parágrafo com um de cada átomo — <strong>forte</strong> é o que o leitor não pode perder, <em>ênfase</em> é entonação, e o número anda colado na unidade, como em <span class="b-num">lorem Mbps</span>. O comando que se digita vai em <code class="b-code">lorem-ipsum.csv</code>, e a sigla se expande por escrito na primeira aparição — corrente contínua (<abbr class="b-abbr" title="corrente contínua">CC</abbr>) — porque o <code class="b-code">title</code> é reforço, nunca a expansão.',
      },
      { tipo: "titulo", nivel: 2, id: "s3", texto: "Quando vale a pena trocar de roteador" },
      {
        tipo: "paragrafo",
        texto:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      },
      {
        tipo: "checklist",
        rotulo: "Antes de contratar mais internet, confira",
        itens: [
          { forte: "Pico simultâneo medido", resto: "com um monitor de rede, lorem ipsum dolor sit amet, não estimado pela soma dos aparelhos." },
          { forte: "Consumo em segundo plano", resto: "do roteador, localizado na ficha técnica — consectetur adipiscing elit." },
          { forte: "Velocidade contratada", resto: "conferida na fatura, sed do eiusmod tempor incididunt." },
          { forte: "Dois aparelhos de maior consumo", resto: "testados em horários separados, ut labore et dolore magna aliqua." },
        ],
      },
      { tipo: "titulo", nivel: 2, id: "s4", texto: "O que a ficha técnica não diz" },
      {
        tipo: "paragrafo",
        texto:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      },
      {
        tipo: "faq",
        itens: [
          {
            pergunta: "Dá para saber o pico sem comprar instrumento?",
            resposta:
              "Dá, com erro grande — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            aberto: true,
          },
          {
            pergunta: "Trocar de plano resolve?",
            resposta:
              "Nem sempre — ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          },
          {
            pergunta: "O roteador aguenta um pico acima do contratado?",
            resposta:
              "Depende do que o fabricante chama de pico e por quanto tempo — duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
          },
        ],
      },
      {
        tipo: "fechamento",
        paragrafos: [
          "A chamada que travou não estava pedindo plano novo — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "O critério que fica é simples: meça o pico antes de contratar qualquer coisa. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // artigo-2 — tabela de contraste, citação de fonte nomeada, aviso de
  // atenção, e um H3 dentro de um H2 (o único dos três com subseção).
  // Sem caixa de conclusões e sem bloco de código.
  // ---------------------------------------------------------------------
  {
    slug: "artigo-2",
    titulo: "Como comparar dois planos de internet sem cair em pegadinha",
    descricao:
      "Velocidade anunciada e velocidade entregue raramente são o mesmo número. Um roteiro curto para comparar duas propostas na mesma base.",
    atualizado: "2026-06-02",
    minutos: 9,
    selo: "Guia — internet doméstica",
    abertura: {
      cena:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      problema:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt — as duas propostas prometiam o mesmo número, e mesmo assim uma custava bem mais caro.",
    },
    slots: [
      { tipo: "titulo", nivel: 2, id: "s1", texto: "Duas propostas, duas bases diferentes" },
      {
        tipo: "paragrafo",
        texto:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        tipo: "tabelaContraste",
        colunas: ["", "Proposta A", "Proposta B"],
        linhas: [
          ["Velocidade anunciada", "lorem Mbps", "ipsum Mbps"],
          ["Velocidade mínima garantida", "dolor Mbps", { sim: "sit Mbps" }],
          ["Fidelidade", "24 meses", { sim: "sem fidelidade" }],
          ["Instalação", "amet", { sim: "R$ 0" }],
        ] as Celula[][],
        fonte: "Fonte e data fictícias — as duas propostas comparadas na mesma base, 06/2026.",
      },
      { tipo: "titulo", nivel: 2, id: "s2", texto: "O número que o folheto não mostra" },
      {
        tipo: "paragrafo",
        texto:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      {
        tipo: "citacaoFonte",
        texto:
          "“Citação fictícia — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.”",
        nome: "Nome da fonte (fictício)",
        papel: "Papel fictício — quem é a pessoa e por que a frase dela vale, na mesma respiração",
        conflito:
          "Conflito de interesse fictício — lorem ipsum dolor sit amet: como foi apurado, em que data, e o que a fonte tem a ganhar com a conclusão.",
      },
      {
        tipo: "figura",
        dados: {
          papel: "diagrama",
          alt: "Alt fictício — duas barras comparando a velocidade mínima garantida das propostas A e B contra a velocidade anunciada",
          legenda: "Legenda fictícia — a velocidade mínima garantida é o número que decide, não o anunciado.",
          fonte: "Fonte e data fictícias — comparação de exemplo, 06/2026.",
          pendencia: "Marcador — diagrama ainda não produzido para este exemplo.",
        } satisfies CamposFigura,
      },
      { tipo: "titulo", nivel: 2, id: "s3", texto: "O que ler no contrato antes de assinar" },
      {
        tipo: "paragrafo",
        texto:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      },
      {
        tipo: "titulo",
        nivel: 3,
        id: "s3a",
        texto: "A cláusula de velocidade mínima",
      },
      {
        tipo: "paragrafo",
        texto:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt, neque porro quisquam est.",
      },
      {
        tipo: "aviso",
        dados: {
          tipo: "atencao",
          titulo: "Velocidade anunciada não é velocidade garantida",
          texto:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — a regulação fixa apenas o piso mínimo, e é ele que deve constar da comparação, não o número do folheto.",
          fonte: "Fonte fictícia — norma de exemplo, edição de 2024. Consultado em 06/2026.",
        } satisfies CamposAviso,
      },
      { tipo: "titulo", nivel: 2, id: "s4", texto: "O checklist antes de trocar de provedor" },
      {
        tipo: "paragrafo",
        texto:
          "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
      },
      {
        tipo: "checklist",
        rotulo: "Antes de assinar a proposta nova, confira",
        itens: [
          { forte: "Velocidade mínima garantida", resto: "escrita no contrato, lorem ipsum dolor sit amet, não só no folheto." },
          { forte: "Multa de fidelidade", resto: "da proposta atual, consectetur adipiscing elit, comparada ao ganho esperado." },
          { forte: "Prazo de instalação", resto: "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
          { forte: "Canal de suporte", resto: "testado antes de assinar — ut enim ad minim veniam, quis nostrud exercitation." },
          { forte: "Cláusula de rescisão", resto: "sem multa em caso de queda recorrente, ullamco laboris nisi ut aliquip." },
        ],
      },
      {
        tipo: "faq",
        itens: [
          {
            pergunta: "A velocidade mínima garantida é sempre metade da anunciada?",
            resposta:
              "Não necessariamente — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
            aberto: true,
          },
          {
            pergunta: "Vale a pena pagar fidelidade para ganhar desconto?",
            resposta:
              "Depende do horizonte de uso — duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          },
          {
            pergunta: "Dá para negociar a instalação gratuita?",
            resposta: "Na maioria dos casos sim — excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
          },
        ],
      },
      {
        tipo: "fechamento",
        paragrafos: [
          "A pegadinha raramente está no preço — está na base de comparação. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "Leve a cláusula de velocidade mínima para a mesa antes de assinar, e compare as duas propostas por ela, não pelo número do folheto. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // artigo-3 — tabela de panorama, bloco de código, aviso de nota, e uma
  // lista ordenada (A2). Sem citação nenhuma — a caixa de conclusões volta,
  // como no artigo-1, para mostrar o artigo com e sem ela.
  // ---------------------------------------------------------------------
  {
    slug: "artigo-3",
    titulo: "Guia rápido para organizar o home office antes da reunião",
    descricao:
      "Uma checagem de cinco minutos, antes de qualquer chamada importante, para não descobrir o problema durante a reunião.",
    atualizado: "2026-05-11",
    minutos: 6,
    selo: "Guia — home office",
    abertura: {
      cena:
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
      problema:
        "A reunião começava em cinco minutos e o áudio não pegava — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    conclusoes: {
      rotulo: "O que este roteiro resolve",
      itens: [
        {
          antes: "A checagem leva ",
          numero: "5 minutos",
          depois: ", lorem ipsum dolor sit amet, feita antes de qualquer chamada importante.",
        },
        {
          antes: "Reduz em ",
          numero: "lorem %",
          depois: " o risco de travar no meio da reunião, consectetur adipiscing elit.",
          ressalva: "número fictício, apenas para ilustrar o slot",
        },
      ],
    },
    slots: [
      { tipo: "titulo", nivel: 2, id: "s1", texto: "A checagem de cinco minutos" },
      {
        tipo: "paragrafo",
        texto:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        tipo: "lista",
        itens: [
          "Feche os aplicativos em segundo plano — lorem ipsum dolor sit amet.",
          "Confirme que o roteador está ligado há mais de um minuto — consectetur adipiscing elit.",
          "Teste o áudio e a câmera fora da chamada — sed do eiusmod tempor incididunt ut labore.",
          "Avise em casa o horário da reunião — ut enim ad minim veniam, quis nostrud exercitation.",
        ],
      },
      {
        tipo: "tabelaPanorama",
        colunas: ["Item", "Tempo", "Antes de", "Feito"],
        linhas: [
          ["Fechar aplicativos", "lorem min", "entrar na sala", { sim: "sim" }],
          ["Testar áudio e câmera", "ipsum min", "entrar na sala", { sim: "sim" }],
          ["Checar velocidade", "dolor min", "entrar na sala", "não"],
          ["Avisar em casa", "—", "início do expediente", { vazio: "[sem dado confiável]" }],
        ] as Celula[][],
        fonte: "Fonte e data fictícias — roteiro de exemplo, 05/2026.",
      },
      { tipo: "titulo", nivel: 2, id: "s2", texto: "Testando a velocidade sem sair do terminal" },
      {
        tipo: "paragrafo",
        texto:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      {
        tipo: "codigo",
        dados: {
          rotulo: "terminal — teste de velocidade, exemplo fictício",
          codigo: `teste-velocidade --host lorem.exemplo --formato csv
teste-velocidade --exportar /caminho/ipsum.csv`,
        } satisfies CamposCodigo,
      },
      {
        tipo: "aviso",
        dados: {
          tipo: "nota",
          titulo: "O teste de velocidade mede o link, não o Wi-Fi",
          texto:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit — rodar o teste por Wi-Fi soma a perda do rádio ao resultado, e o número deixa de responder pela mesma coisa que o contrato promete.",
        } satisfies CamposAviso,
      },
      { tipo: "titulo", nivel: 2, id: "s3", texto: "O que fazer quando o teste vem baixo" },
      {
        tipo: "paragrafo",
        texto:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      },
      {
        tipo: "figura",
        dados: {
          papel: "spot",
          alt: "Alt fictício — uma pessoa ajustando um roteador numa mesa de escritório em casa, com um notebook aberto ao lado",
          legenda: "A checagem de cinco minutos vale mais barato do que a reunião que trava.",
        } satisfies CamposFigura,
      },
      { tipo: "titulo", nivel: 2, id: "s4", texto: "O que levar para a próxima reunião" },
      {
        tipo: "paragrafo",
        texto:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      },
      {
        tipo: "checklist",
        rotulo: "Nos cinco minutos antes de entrar na sala",
        itens: [
          { forte: "Aplicativos em segundo plano fechados", resto: "lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          { forte: "Áudio e câmera testados", resto: "fora da chamada, sed do eiusmod tempor incididunt ut labore." },
          { forte: "Velocidade checada pelo terminal", resto: "ut enim ad minim veniam, quis nostrud exercitation." },
          { forte: "Horário avisado em casa", resto: "ullamco laboris nisi ut aliquip ex ea commodo consequat." },
        ],
      },
      {
        tipo: "faq",
        itens: [
          {
            pergunta: "Cinco minutos bastam mesmo?",
            resposta:
              "Para a maioria das causas comuns, sim — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
            aberto: true,
          },
          {
            pergunta: "Preciso repetir a checagem toda reunião?",
            resposta: "Só os itens de rede — duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
          },
          {
            pergunta: "O teste de velocidade pelo navegador serve?",
            resposta:
              "Serve como estimativa, mas soma variáveis do navegador ao resultado — excepteur sint occaecat cupidatat non proident.",
          },
        ],
      },
      {
        tipo: "fechamento",
        paragrafos: [
          "Nenhum item deste roteiro é sofisticado — lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
          "O ganho está na ordem: rodar a checagem antes, e não descobrir o problema durante a reunião. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        ],
      },
    ],
  },
];

export const artigoPorSlug = (slug: string): DadosArtigo | undefined =>
  ARTIGOS.find((a) => a.slug === slug);
