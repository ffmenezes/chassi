/**
 * Dados fictícios, para testar layout.
 *
 * TODO NÚMERO AQUI É INVENTADO e nunca sai deste arquivo. O que é real é a
 * FORMA: cada mock preenche os slots que a doutrina exige — a ressalva ao lado
 * do número, a lacuna declarada em vez de estimada, o conflito de interesse ao
 * lado do nome, a data no card. Estilo que não consegue exibir esses slots é
 * estilo reprovado, e é para isso que estes dados existem.
 */
import type { Conclusao } from "../components/blocos/CaixaConclusoes.astro";
import type { ItemSumario } from "../components/blocos/Sumario.astro";
import type { Celula } from "../components/blocos/_Tabela.astro";
import type { ItemCheck } from "../components/blocos/Checklist.astro";
import type { Pergunta } from "../components/blocos/Faq.astro";
import type { Slide } from "../components/blocos/Carrossel.astro";
import type { Props as CamposFigura } from "../components/blocos/Figura.astro";
import type { Props as DadosDiagrama } from "../components/blocos/_DiagramaDemo.astro";
import type { Props as CamposCodigo } from "../components/blocos/Codigo.astro";
import type { Props as CamposAviso } from "../components/blocos/Aviso.astro";
import type { Artigo } from "../components/blocos/GradeArtigos.astro";
import type { Comentario } from "../components/blocos/Comentarios.astro";
import type { Props as CamposCalculadora } from "../components/blocos/Calculadora.astro";
import type { Props as CamposOfertaIsca } from "../components/blocos/OfertaIsca.astro";
import type { Autor } from "../autor";

export const abertura = {
  cena: "Às seis e vinte da manhã a chamada de vídeo travou sozinha e o roteador piscou três vezes na sala.",
  problema:
    "O plano de internet tinha 300 Mbps contratados e mesmo assim não aguentou a manhã. Isso quase nunca é defeito do provedor: é dimensionamento feito sobre consumo médio, quando quem derruba a chamada é o pico simultâneo.",
};

export const conclusoes: Conclusao[] = [
  {
    antes: "O gargalo é o pico simultâneo, não o consumo médio: ",
    numero: "340 Mbps",
    depois: " num link contratado para 300 Mbps.",
    ressalva: "piso: exclui o backup na nuvem",
  },
  {
    antes: "Reordenar dois aparelhos resolve sem contratar nada e derruba o pico para ",
    numero: "180 Mbps",
    depois: ".",
  },
  {
    antes: "Trocar o roteador custa ",
    numero: "R$ 420",
    depois: " e só se paga acima de 6 dispositivos simultâneos.",
    ressalva: "faixa apurada em 08/2026",
  },
  {
    antes: "O consumo em segundo plano come ",
    numero: "8 Mbps",
    depois: " por hora o dia inteiro.",
    ressalva: "premissa do exemplo, não é dado de catálogo",
  },
];

/**
 * As seções, e esta é a ÚNICA fonte: o artigo renderiza os headings daqui, e o
 * sumário sai da mesma lista.
 *
 * Antes eram duas listas, e elas divergiram exatamente como o bloco 3 avisa:
 * o sumário tinha `#s2a` e `#s2b` para dois H3 que nunca foram renderizados, e
 * o clique naqueles dois níveis não fazia nada. Nada quebrou, ninguém percebeu.
 * Sumário se gera dos headings; não se digita ao lado deles.
 */
export interface Secao { id: string; texto: string; nivel: 2 | 3 }

export const secoes: Secao[] = [
  { id: "s1", texto: "Por que a chamada não atravessa a reunião", nivel: 2 },
  { id: "s2", texto: "Consumo médio contra pico simultâneo", nivel: 2 },
  { id: "s2a", texto: "Como medir o seu pico sem instrumento", nivel: 3 },
  { id: "s2b", texto: "Os dois aparelhos que quase sempre coincidem", nivel: 3 },
  { id: "s3", texto: "Quando trocar o roteador compensa", nivel: 2 },
  { id: "s4", texto: "O que a ficha técnica não diz", nivel: 2 },
];

/** O sumário é derivado, nunca escrito à mão. */
export const sumario: ItemSumario[] = secoes.map((s) => ({
  texto: s.texto,
  href: `#${s.id}`,
  nivel: s.nivel,
}));

export const panorama = {
  colunas: ["Aparelho", "Consumo", "Horas/dia", "Tráfego", "Entra no pico"],
  linhas: [
    ["Notebook do home office", "15 Mbps", "8,0", "1,20 GB", { sim: "sim" }],
    ["Backup na nuvem", "40 Mbps", "0,5", "0,38 GB", { sim: "sim" }],
    ["Streaming em 4K", "25 Mbps", "0,3", "0,75 GB", { sim: "sim" }],
    ["Câmera de segurança", "2 Mbps", "5,0", "0,30 GB", "não"],
    ["Roteador em espera", "1 Mbps", "24,0", "0,72 GB", "não"],
    // a lacuna é declarada, não preenchida: é o item 3 de integridade na tabela
    ["Smart TV", "2 Mbps", "—", { vazio: "[sem dado confiável]" }, "não"],
  ] as Celula[][],
  fonte:
    "Medições próprias com um monitor de rede, 04 a 11/08/2026. A linha da Smart TV declara a lacuna em vez de estimar.",
};

export const contraste = {
  colunas: ["", "Ordem atual", "Aparelhos reordenados"],
  linhas: [
    ["Pico simultâneo", "340 Mbps", { sim: "180 Mbps" }],
    ["Folga do link", "−40 Mbps", { sim: "+120 Mbps" }],
    ["Quedas em 7 dias", "4", { sim: "0" }],
    ["Custo da mudança", "—", { sim: "R$ 0" }],
  ] as Celula[][],
  fonte:
    "As duas colunas vêm da mesma casa, mesmo roteador e mesma semana. Sem isso a tabela não nasce.",
};

export const destaque =
  "Chamada de vídeo que trava quase nunca é problema do provedor. É problema de dois aparelhos que puxam banda ao mesmo tempo.";

export const citacao = {
  texto:
    "“A gente vê muito link dimensionado pelo consumo do mês. O roteador não satura por mês, ele satura por segundo, e é no segundo que a chamada cai.”",
  nome: "Rita Amorim",
  papel: "técnica de redes, 11 anos configurando link doméstico no interior da Bahia",
  conflito:
    "Entrevista por telefone em 12/08/2026, com autorização de uso. Ela vende projeto de configuração de rede, e portanto tem interesse na conclusão acima.",
};

export const checklist: ItemCheck[] = [
  { forte: "Pico simultâneo medido", resto: "com um monitor de rede, não estimado pela soma dos aparelhos" },
  { forte: "Consumo em segundo plano", resto: "do roteador localizado na ficha técnica do seu modelo" },
  { forte: "Velocidade contratada", resto: "conferida, e a conversão de GB feita por ela, não pela do plano antigo" },
  { forte: "Dois aparelhos de maior consumo", resto: "testados em horários separados por sete dias" },
  { forte: "Registro das quedas", resto: "com data e hora, para comparar depois" },
];

export const faq: Pergunta[] = [
  {
    pergunta: "Dá para saber o pico sem comprar instrumento?",
    resposta:
      "Dá, com erro grande: some o consumo dos aparelhos que você consegue usar ao mesmo tempo e acrescente a sincronização do backup, que chega a três vezes o consumo nominal por alguns segundos. Serve para decidir se vale medir de verdade, não para dimensionar.",
    aberto: true,
  },
  {
    pergunta: "Trocar o plano resolve?",
    resposta:
      "Não, quando a queda acontece com o link ainda com margem. Plano maior aguenta mais tempo de uso e continua não aguentando o pico, porque quem derruba é o roteador.",
  },
  {
    pergunta: "O roteador de 300 Mbps aguenta 340 Mbps por alguns segundos?",
    resposta:
      "Depende do que o fabricante chama de pico e por quanto tempo. Procure “burst speed” na ficha técnica com a duração ao lado: sem a duração, o número não significa nada.",
  },
];

export const fechamento = [
  "A chamada que travou às seis e vinte não estava pedindo plano novo. Estava avisando que dois aparelhos se encontraram num segundo em que ninguém estava olhando.",
  "O critério que você leva daqui é simples: antes de contratar qualquer coisa, meça o pico e compare com a folga do link. Se a folga for negativa, nenhum plano novo conserta, porque o problema é ordem e não tamanho.",
];

export const enquete = {
  pergunta: "A sua chamada já travou com o link ainda com margem?",
  opcoes: ["Já, mais de uma vez", "Já, uma vez só", "Nunca aconteceu", "Não sei dizer, não acompanho"],
  piso: 200,
};

export const carrossel: Slide[] = [
  { titulo: "1. Monitor no roteador principal", legenda: "Entre o modem e o roteador, nunca num repetidor só.", fig: "foto 1" },
  { titulo: "2. Modo tráfego em tempo real", legenda: "A escala tem que cobrir 500 Mbps, senão o pico satura a leitura.", fig: "foto 2" },
  { titulo: "3. Ligue o maior aparelho", legenda: "Anote o valor de sincronização, que dura poucos segundos.", fig: "foto 3" },
  { titulo: "4. Multiplique pelo plano", legenda: "300 Mbps no link deste exemplo, não os 100 Mbps do plano antigo.", fig: "foto 4" },
];

/**
 * As três figuras, uma por papel.
 *
 * O que estes dados testam é o par alt/legenda: o alt diz o que está na imagem,
 * a legenda diz por que ela está ali, e os dois nunca são o mesmo texto — o
 * componente quebra a build se forem. A spot não tem fonte porque não é prova de
 * nada; prova e diagrama não existem sem fonte e data.
 *
 * Sem `src`, o componente sai no estado de marcador, que é o que a fase 6 grava
 * no corpo enquanto a imagem não foi produzida.
 */
export const figuras: {
  prova: CamposFigura;
  spot: CamposFigura;
  diagrama: { figura: CamposFigura; dados: DadosDiagrama };
} = {
  prova: {
    papel: "prova",
    alt: "Tela do monitor de rede com um pico de 340 Mbps às 6h18, ultrapassando a linha tracejada de 300 Mbps",
    legenda:
      "A queda das 6h18. O backup entrou com o notebook já em chamada, e o pico passou 40 Mbps acima do que o link entrega.",
    fonte:
      "Registro do monitor da própria casa, 09/08/2026. Piso: o log amostra a cada 5 s, então o pico real é igual ou maior.",
    pendencia: "Recorte da tela entre 6h10 e 6h30, com o rótulo do eixo legível.",
  },
  spot: {
    papel: "spot",
    alt: "Uma pessoa de lanterna diante do roteador de madrugada, com a tela do notebook aberta ao fundo",
    legenda: "A hora em que a rede decide é sempre a hora em que ninguém está olhando.",
  },
  diagrama: {
    figura: {
      papel: "diagrama",
      alt: "Duas barras comparando o pico simultâneo: 340 Mbps na ordem atual e 180 Mbps com os aparelhos reordenados, contra o limite de 300 Mbps do link",
      legenda:
        "Reordenar dois aparelhos derruba o pico de 340 Mbps para 180 Mbps e devolve 120 Mbps de folga, sem contratar nada.",
      fonte:
        "Medições próprias com um monitor de rede, 04 a 11/08/2026. A fonte e a data também vão dentro do desenho, porque ele circula recortado.",
    },
    dados: {
      /* os mesmos números da tabela de contraste: o link é o de 300 Mbps que a
         caixa de conclusões declara, e a folga de 120 Mbps sai daí */
      titulo: "Pico simultâneo antes e depois de reordenar os aparelhos",
      serieA: { rotulo: "Ordem atual", valor: 340 },
      serieB: { rotulo: "Reordenados", valor: 180 },
      limite: { rotulo: "limite do link", valor: 300 },
      unidade: "Mbps",
      fonte: "Medições próprias, 04 a 11/08/2026",
    },
  },
};

/**
 * Bloco 20 — os dois blocos de código.
 *
 * O primeiro é fórmula, e não altera nada. O segundo altera estado, e por isso
 * traz o que ele faz e o que não desfaz ANTES do trecho, em texto. Nenhum dos
 * dois abre linha com `$`: o cifrão viaja na cópia e quebra o comando.
 */
export const codigos: CamposCodigo[] = [
  {
    rotulo: "planilha — coluna do pico, LibreOffice Calc",
    codigo: `=MÁXIMO(B2:B2017)
=SE(B2 > $F$1; "acima do link"; "dentro")`,
  },
  {
    rotulo: "terminal do roteador",
    aviso:
      "Apaga o histórico de tráfego e devolve os parâmetros ao padrão de fábrica, inclusive o canal fixo do Wi-Fi. Não desfaz, e o histórico não é exportado antes.",
    codigo: `router config --reset-factory --confirm
router log --export /cartao/log-antes.csv`,
  },
];

/** Bloco 21 — os dois tipos, e só dois. */
export const avisos: CamposAviso[] = [
  {
    tipo: "atencao",
    titulo: "O monitor errado na porta WAN vira falso pico",
    texto:
      "Monitor de tráfego LAN não mede a porta WAN, e ler a interface errada conta tráfego interno como se fosse externo. O instrumento tem que apontar para a porta WAN, e a medição é feita com o cabo conectado direto no roteador.",
    fonte: "Manual do fabricante do monitor, edição de 2024, seção de configuração. Consultado em 12/08/2026.",
  },
  {
    tipo: "nota",
    titulo: "Por que 300 Mbps e não 100 Mbps",
    texto:
      "A conversão de GB para Mbps usa a velocidade contratada, e não a do plano antigo. O exemplo inteiro está em 300 Mbps; num plano de 100 Mbps todos os números de tráfego caem para um terço, e os de tempo de download triplicam.",
  },
];

/** A1 e A2 — os espécimes de átomo. Texto de forma, nunca de conteúdo. */
export const atomos = {
  pico: "340 Mbps",
  passos: [
    "Feche os aplicativos em segundo plano e confirme que o roteador está ligado.",
    "Conecte o monitor na porta WAN, entre o modem e o roteador.",
    "Ligue o maior aparelho e anote o valor de sincronização, que dura poucos segundos.",
    "Multiplique pela velocidade contratada, que aqui é 300 Mbps.",
  ],
  conjunto: [
    "Monitor com leitura de tráfego em tempo real até 500 Mbps",
    "Caderno, porque o pico dura menos que o tempo de achar o celular",
  ],
  glossario: [
    {
      termo: "Pico simultâneo",
      definicao: "O maior tráfego que a rede usa num instante, com todos os aparelhos que se conectaram juntos. É o número que derruba a chamada.",
    },
    {
      termo: "Burst speed",
      definicao: "A velocidade acima da contratada que o roteador aguenta por alguns segundos. Sem a duração ao lado, o valor não significa nada.",
    },
    {
      termo: "Consumo em segundo plano",
      definicao: "O que o roteador gasta ligado e sem aparelho nenhum conectado, o dia inteiro.",
    },
  ],
};

export const social = {
  embed: {
    autor: "Cooperativa de Internet do Vale",
    handle: "@internetdovale",
    data: "09/08/2026",
    texto:
      "“Retiramos o aviso de 500 Mbps do folheto. O valor era de pico e não de regime, e estava induzindo contratação errada.”",
    nota: "Texto transcrito literal fora do iframe, porque o post pode sair do ar. Entra em citation no schema.",
  },
  perfil: {
    titulo: "Portal técnico do fabricante",
    motivo: "É o único lugar onde a ficha técnica com a duração do burst é publicada.",
    ancora: "Ver as fichas técnicas por modelo",
    href: "#n2",
  },
};

export const irmas: Artigo[] = [
  {
    tituloFeed: "A conta que ninguém faz antes de contratar internet",
    descricao: "Três somas que mudam o resultado do dimensionamento, com os números refeitos em agosto.",
    atualizadoEm: "11/08/2026",
    href: "#irma-1",
  },
  {
    tituloFeed: "Por que o roteador trava antes de cair",
    descricao: "O aviso vem do lado do tráfego, não do consumo do link, e dá para agir nos segundos que ele dura.",
    atualizadoEm: "02/08/2026",
    href: "#irma-2",
  },
  {
    tituloFeed: "Home office em casa pequena: o que sobra e o que falta",
    descricao: "Uma rede real acompanhada por seis meses, com os erros de projeto que apareceram no caminho.",
    atualizadoEm: "24/07/2026",
    href: "#irma-3",
  },
];

export const toasts = [
  {
    tipo: "ok" as const,
    titulo: "Voto registrado",
    texto: "Some em quatro segundos, porque não há nada a fazer.",
  },
  {
    tipo: "erro" as const,
    titulo: "O PDF não foi gerado",
    texto:
      "O arquivo está sendo reconstruído depois de uma correção no artigo. Tente de novo em alguns minutos, ou peça pelo formulário de contato. Fica na tela até você fechar.",
  },
];

export const overlay = {
  rotulo: "Você pediu o PDF",
  titulo: "Para onde eu mando o arquivo?",
  texto:
    "Vai o artigo inteiro, igual ao da página, mais um aviso quando os números forem reapurados. Sai da lista em um clique, e o endereço não vai para outro lugar.",
  ancoraPrimaria: "Receber o PDF",
};

export const derivados = {
  audio: { duracao: "14 min" },
  mapa: {
    titulo: "Mapa mental deste artigo",
    texto:
      "Estrutura e conclusões, em arquivo editável mais imagem. Traz a URL e a data da última alteração dentro do arquivo.",
    ancora: "Baixar o mapa",
  },
  pdf: {
    titulo: "Leve este artigo em PDF",
    texto:
      "Mesmo conteúdo da página, nada exclusivo. Deixe seu e-mail e receba o arquivo mais um aviso quando os números forem reapurados. Sai da lista em um clique.",
    ancora: "Receber o PDF",
  },
};

/**
 * O autor do bloco 22. **Fulano de Tal não existe** — mesmo placeholder que
 * `src/autor.test.ts` usa, e de propósito: um nome plausível como "Marina
 * Vasques" é exatamente o tipo de coisa que um participante copia sem
 * perceber, e num repositório-template isso vira autor de verdade no blog de
 * alguém. O byline de verdade é o `sites/<site>/base/AUTOR.md`, e o
 * `VISION.md` da raiz não permite inventar pessoa em página publicada.
 *
 * O que ele testa é a FORMA: nome com sobrenome, cargo que descreve a relação
 * com o nicho, e uma credencial de duas frases que cabe no card sem estourar a
 * coluna. Estilo que não consegue exibir esses três slots é estilo reprovado.
 *
 * A foto é um marcador SVG, e é justamente o que o `AUTOR.md` proíbe em
 * produção: avatar gerado não vale foto. Aqui ele existe porque sem `image` o
 * bloco não nasce, e a página de exemplo precisa mostrar o bloco.
 *
 * Sem `perfil`, de propósito: a `/autores/{slug}` não está no ar em site nenhum,
 * e o estado sem link é o que os cinco estilos precisam saber desenhar hoje.
 */
export const autor: Autor = {
  nome: "Fulano de Tal",
  slug: "fulano-de-tal",
  jobTitle: "Técnico de redes, 12 anos configurando internet doméstica",
  description:
    "Configura e mede redes domésticas no interior do estado desde 2014. Atende hoje dezenas de casas com home office, e os números deste artigo saíram do monitor dele.",
  image:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23cfc7ba'/%3E%3Ctext x='32' y='42' font-family='sans-serif' font-size='26' fill='%23615a4e' text-anchor='middle'%3EFT%3C/text%3E%3C/svg%3E",
  sameAs: [],
};

export const comentarios: Comentario[] = [
  {
    autor: "Jorge M.",
    quando: "12/08/2026",
    texto:
      "Medi aqui e deu 290 Mbps de pico, com o backup e o streaming juntos. O que me pegou foi a sincronização do notebook, que eu nem contava. Faz sentido considerar isso na soma?",
    resposta: {
      quando: "13/08/2026",
      texto:
        "Faz, e é o erro mais comum. A sincronização do backup chega a três vezes o consumo nominal por alguns segundos, e é nesse instante que o roteador decide. Vou medir isso com instrumento e publicar o número, porque hoje só tenho a estimativa.",
    },
  },
  {
    autor: "Cleide",
    quando: "11/08/2026",
    texto:
      "Meu provedor disse que o problema era o roteador e trocou por um novo. Continuou caindo igual. Depois de ler isso reorganizei os horários e parou.",
  },
  {
    autor: "Anderson R.",
    quando: "10/08/2026",
    texto:
      "Vocês têm algum artigo sobre como escolher o cabo entre modem e roteador? A perda de sinal ali também não atrapalha na hora do pico?",
  },
];

/**
 * Bloco 23 — a mesma conta da tabela de contraste, com as variáveis abertas.
 * O link contratado e o pico medido são os dois números que a caixa de
 * conclusões já declara; a folga é a subtração dos dois, e fica negativa
 * quando o pico passa do link — que é exatamente o caso do exemplo.
 */
export const calculadora: CamposCalculadora = {
  id: "calc-pico",
  titulo: "Sua folga no pico simultâneo",
  descricao: "A mesma conta do texto, com os números trocados pelos seus.",
  campos: [
    { id: "link", rotulo: "Link contratado", inicial: 300, unidade: "Mbps", origem: "plano contratado, da fatura do provedor" },
    { id: "pico", rotulo: "Pico medido", inicial: 340, unidade: "Mbps", origem: "medido com monitor de rede, 09/08/2026" },
  ],
  saidas: [
    {
      id: "folga",
      rotulo: "Folga no pico",
      expr: "link - pico",
      unidade: "Mbps",
      arredonda: "normal",
      ressalva: "negativo é queda garantida no próximo pico igual a este",
    },
  ],
  ancoraDaConta: "#s2",
};

/**
 * Bloco 24 — a oferta de isca. `site` e `isca` aqui são de mentira, como todo
 * o resto deste arquivo: sem `PUBLIC_ISCA_HABILITADA`, o componente já sai em
 * modo prévia sozinho, então estes valores nunca chegam a um `action` de
 * verdade.
 */
export const ofertaIsca: CamposOfertaIsca = {
  isca: "checklist-pico",
  site: "bancada",
  titulo: "Checklist de 5 passos para medir seu pico",
  promessa: "PDF de 1 página, chega em até 5 minutos por e-mail.",
  ancora: "Quero o checklist",
};
