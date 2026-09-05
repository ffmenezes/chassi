/**
 * O motor do quiz (bloco 30).
 *
 * Existe separado do componente pelo mesmo motivo que `calculo.ts`: as travas
 * do bloco são regra, e regra que mora dentro de um `.astro` não tem como ser
 * exercitada dos dois lados — o que passa e o que é recusado.
 *
 * Um quiz tem UM modo, e os dois caem na mesma máquina: cada pergunta vira um
 * número, a soma cai numa faixa.
 *
 *   diagnostico  o número é o `peso` da opção escolhida. Não há resposta certa.
 *   prova        o número é 1 (acertou o gabarito) ou 0. As faixas correm
 *                sobre acertos.
 *
 * O que muda entre os dois é a trava, não a conta:
 *
 *   - `prova` afirma que uma resposta é a correta, e afirmar isso é afirmar um
 *     fato. Então cada gabarito exige justificativa e fonte com ano — a mesma
 *     régua que o bloco 19 aplica a figura de prova. Sem isso a build quebra.
 *   - `diagnostico` exige peso em toda opção, e recusa gabarito: quiz que
 *     mistura as duas contabilidades não diz ao leitor qual das duas ele
 *     acabou de responder.
 *
 * **Peso é inteiro, de propósito.** É o que torna exata a trava mais
 * importante daqui — as faixas cobrem do piso ao teto possível, sem buraco e
 * sem sobreposição. Um quiz que pode terminar em "nenhuma faixa" mostraria
 * caixa vazia justamente para o leitor que respondeu tudo, e é o tipo de
 * defeito que só aparece na combinação rara de respostas que ninguém testou à
 * mão. Com peso fracionário, "sem buraco" viraria comparação de ponto
 * flutuante, e a trava passaria a mentir de vez em quando.
 *
 * Nada aqui pede e-mail, guarda resposta fora do navegador ou fala com
 * endpoint. Ver o comentário de `components/blocos/Quiz.astro` sobre isso.
 */

export type ModoQuiz = "diagnostico" | "prova";

/** `vf` é açúcar de `unica` com as duas opções fixas — ver `OPCOES_VF`. */
export type TipoPergunta = "unica" | "multipla" | "vf" | "escala";

/** O texto de uma alternativa de V/F. O componente nunca escreve isso à mão. */
export const OPCOES_VF = ["Verdadeiro", "Falso"] as const;

export interface OpcaoQuiz {
  /** Em `vf` ele é gerado, e declarar outro texto é erro de build. */
  texto?: string;
  /** Obrigatório no diagnóstico, inteiro. Ignorado na prova. */
  peso?: number;
}

export interface EscalaQuiz {
  min: number;
  max: number;
  /** Escala sem âncora nas duas pontas é escala que cada leitor lê de um
   *  jeito, e aí a soma não compara com a soma de mais ninguém. */
  ancoraMin: string;
  ancoraMax: string;
}

export interface PerguntaQuiz {
  /** Único na página. Vira o `name` dos campos e a âncora do slide. */
  id: string;
  enunciado: string;
  tipo: TipoPergunta;
  /** `unica` e `multipla` exigem duas ou mais. `vf` aceita as duas com peso. */
  opcoes?: OpcaoQuiz[];
  escala?: EscalaQuiz;
  /** Só na prova: índice, ou conjunto exato de índices na múltipla. */
  correta?: number | number[];
  /** Só na prova: por que essa é a correta. Aparece na tela, sempre. */
  porque?: string;
  /** Só na prova: de onde vem o fato, com ano. */
  fonte?: string;
}

export interface FaixaQuiz {
  /** Inclusive nas duas pontas. */
  de: number;
  ate: number;
  titulo: string;
  texto: string;
}

export interface QuizDeclarado {
  modo: ModoQuiz;
  perguntas: PerguntaQuiz[];
  faixas: FaixaQuiz[];
}

/** Índices marcados, por `id` de pergunta. Na escala, o valor escolhido. */
export type RespostasQuiz = Record<string, number[]>;

const erro = (m: string): never => {
  throw new Error(`[bloco 30] ${m}`);
};

const vazio = (s: unknown): boolean => typeof s !== "string" || s.trim() === "";

const inteiro = (n: unknown): boolean => typeof n === "number" && Number.isInteger(n);

/**
 * As opções como o componente as desenha.
 *
 * Em `vf` o texto vem de `OPCOES_VF` e os pesos declarados são preservados —
 * é isso que permite ao autor dar peso a Verdadeiro e a Falso sem redigitar as
 * duas palavras em todo quiz do site.
 */
export function opcoesDe(p: PerguntaQuiz): OpcaoQuiz[] {
  if (p.tipo === "escala") return [];
  if (p.tipo !== "vf") return p.opcoes ?? [];
  return OPCOES_VF.map((texto, i) => ({ ...(p.opcoes?.[i] ?? {}), texto }));
}

const corretas = (p: PerguntaQuiz): number[] =>
  p.correta === undefined ? [] : Array.isArray(p.correta) ? [...p.correta] : [p.correta];

/** O piso e o teto que a soma pode alcançar. É a base da cobertura de faixa. */
export function extremos(
  perguntas: readonly PerguntaQuiz[],
  modo: ModoQuiz,
): { min: number; max: number } {
  let min = 0;
  let max = 0;
  for (const p of perguntas) {
    if (modo === "prova") {
      max += 1;
      continue;
    }
    if (p.tipo === "escala") {
      min += p.escala?.min ?? 0;
      max += p.escala?.max ?? 0;
      continue;
    }
    const pesos = opcoesDe(p).map((o) => o.peso ?? 0);
    if (p.tipo === "multipla") {
      // marcar nada é resposta possível, então o piso da múltipla nunca é a
      // soma dos menores: é a soma só do que desconta.
      min += pesos.filter((x) => x < 0).reduce((a, b) => a + b, 0);
      max += pesos.filter((x) => x > 0).reduce((a, b) => a + b, 0);
      continue;
    }
    min += Math.min(...pesos, 0);
    max += Math.max(...pesos, 0);
  }
  return { min, max };
}

/** A soma. Mesmo caminho na build (para nada) e no cliente (para valer). */
export function pontuar(
  perguntas: readonly PerguntaQuiz[],
  modo: ModoQuiz,
  respostas: RespostasQuiz,
): number {
  let soma = 0;
  for (const p of perguntas) {
    const marcados = respostas[p.id] ?? [];
    if (modo === "prova") {
      const gabarito = corretas(p)
        .slice()
        .sort((a, b) => a - b);
      const dadas = marcados.slice().sort((a, b) => a - b);
      // conjunto exato: faltar uma correta não vale meio ponto, e sobrar uma
      // errada não é acerto parcial.
      const acertou =
        gabarito.length === dadas.length && gabarito.every((x, i) => x === dadas[i]);
      soma += acertou ? 1 : 0;
      continue;
    }
    if (p.tipo === "escala") {
      soma += marcados[0] ?? 0;
      continue;
    }
    const opcoes = opcoesDe(p);
    for (const i of marcados) soma += opcoes[i]?.peso ?? 0;
  }
  return soma;
}

/** A faixa que contém a soma, ou `null`. Nunca a primeira por descuido. */
export function faixaDe(faixas: readonly FaixaQuiz[], soma: number): FaixaQuiz | null {
  return faixas.find((f) => soma >= f.de && soma <= f.ate) ?? null;
}

/**
 * Um resumo curto do questionário, para o navegador saber se a resposta que
 * ele guardou ainda é resposta a ESTE quiz.
 *
 * É a doutrina de `consentimento.ts` e de `avisoBarra.ts` aplicada aqui:
 * guarda-se o conteúdo, nunca um booleano. O que o leitor guardou foi um
 * índice — "a segunda opção" —, e índice só quer dizer alguma coisa contra a
 * lista que estava na tela naquele dia. Trocar a ordem das perguntas, mexer
 * num peso ou acrescentar uma alternativa faz o índice velho apontar para
 * outra coisa, e o quiz passaria a mostrar um resultado que ninguém
 * respondeu. Versão nova, respostas velhas descartadas.
 *
 * As faixas ficam de fora de propósito: reescrever o texto de um resultado
 * não invalida a resposta de ninguém — a soma continua a mesma e recai na
 * faixa nova sozinha.
 */
export function versaoDe(perguntas: readonly PerguntaQuiz[]): string {
  const canonico = perguntas
    .map((p) =>
      [
        p.id,
        p.enunciado,
        p.tipo,
        opcoesDe(p)
          .map((o) => `${o.texto ?? ""}=${o.peso ?? ""}`)
          .join("|"),
        p.escala ? `${p.escala.min}..${p.escala.max}` : "",
        corretas(p).join(","),
        // Separador de controle, nunca virgula ou barra: se a fronteira
        // entre dois campos pudesse aparecer DENTRO de um deles, "ab" + "c"
        // resumiria igual a "a" + "bc", e duas versoes diferentes do quiz
        // passariam por uma versao so.
      ].join("\u0001"),
    )
    .join("\u0002");

  // FNV-1a de 32 bits. Não é criptografia e não precisa ser: o que está em
  // jogo é distinguir duas versões do nosso próprio texto, não resistir a
  // alguém tentando forjar colisão.
  let h = 0x811c9dc5;
  for (let i = 0; i < canonico.length; i++) {
    h ^= canonico.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/* -------------------------------------------------------------------------
   As travas. Quebram a build, não emitem aviso.
   ------------------------------------------------------------------------- */

function validarPergunta(p: PerguntaQuiz, modo: ModoQuiz): void {
  const onde = `pergunta ${JSON.stringify(p.id)}`;
  if (vazio(p.id)) erro(`pergunta sem id. O id vira o name do campo e a âncora do slide.`);
  if (vazio(p.enunciado)) erro(`${onde} sem enunciado.`);

  if (p.tipo === "escala") {
    const e = p.escala;
    if (!e) {
      erro(`${onde} é escala e não declara a escala.`);
    } else {
      if (!inteiro(e.min) || !inteiro(e.max))
        erro(
          `escala de ${onde} com ponta fracionária. A cobertura de faixa se conta em inteiro.`,
        );
      if (e.min >= e.max)
        erro(`escala de ${onde} com min ${e.min} maior ou igual ao max ${e.max}.`);
      if (vazio(e.ancoraMin) || vazio(e.ancoraMax))
        erro(
          `escala de ${onde} sem âncora nas duas pontas. Sem elas, cada leitor lê a escala de ` +
            `um jeito e a soma não compara com a de mais ninguém.`,
        );
    }
  } else {
    const opcoes = opcoesDe(p);
    if (p.tipo === "vf") {
      if (p.opcoes && p.opcoes.length !== 2)
        erro(`${onde} é V/F e declara ${p.opcoes.length} opções. São exatamente duas.`);
      p.opcoes?.forEach((o, i) => {
        if (o.texto !== undefined && o.texto !== OPCOES_VF[i])
          erro(
            `${onde} é V/F e reescreve o texto da opção ${i} como ${JSON.stringify(o.texto)}. ` +
              `V/F só diz Verdadeiro e Falso; texto próprio é escolha única, e o tipo é "unica".`,
          );
      });
    } else if (opcoes.length < 2) {
      erro(
        `${onde} tem ${opcoes.length} opção. Escolha com uma alternativa só não é escolha: ` +
          `são duas ou mais.`,
      );
    }

    if (modo === "diagnostico") {
      opcoes.forEach((o, i) => {
        if (o.peso === undefined)
          erro(
            `opção ${i} de ${onde} sem peso. No diagnóstico é o peso que faz o resultado existir.`,
          );
        else if (!inteiro(o.peso))
          erro(
            `peso ${o.peso} na opção ${i} de ${onde} não é inteiro. Ver o comentário de src/quiz.ts.`,
          );
      });
    }
  }

  if (modo === "diagnostico") {
    if (p.correta !== undefined)
      erro(
        `${onde} traz gabarito, e este quiz é diagnóstico. Um quiz tem um modo só: ou mede um ` +
          `perfil por peso, ou corrige contra gabarito. Misturar não diz ao leitor qual dos ` +
          `dois ele acabou de responder.`,
      );
    return;
  }

  /* Daqui para baixo, prova. */
  if (p.tipo === "escala")
    erro(
      `${onde} é escala num quiz de prova. Escala não tem resposta certa — se ela tem, é ` +
        `escolha única disfarçada de régua.`,
    );
  if (p.correta === undefined)
    erro(`${onde} sem resposta correta declarada, e este quiz é prova.`);
  const alvos = corretas(p);
  if (alvos.length === 0) erro(`${onde} com lista de correta vazia.`);
  const total = opcoesDe(p).length;
  for (const i of alvos)
    if (!inteiro(i) || i < 0 || i >= total)
      erro(`${onde} aponta a correta ${i}, e ela não existe entre as ${total} opções.`);
  if (vazio(p.porque))
    erro(
      `${onde} tem gabarito e não tem porquê. Dizer que uma resposta é a certa é afirmar um ` +
        `fato, e o leitor que errou merece saber por quê na mesma tela.`,
    );
  if (vazio(p.fonte) || !/\b\d{4}\b/.test(p.fonte!))
    erro(
      `${onde} tem fonte ${JSON.stringify(p.fonte ?? "")} sem ano. Fato afirmado sem data ` +
        `envelhece sem ninguém perceber — mesma régua do bloco 19.`,
    );
}

function validarFaixas(faixas: readonly FaixaQuiz[], min: number, max: number): void {
  if (faixas.length === 0)
    erro(`quiz sem faixa de resultado. A soma precisa cair em algum lugar.`);
  for (const f of faixas) {
    if (!inteiro(f.de) || !inteiro(f.ate))
      erro(`faixa ${JSON.stringify(f.titulo)} com ponta fracionária.`);
    if (f.de > f.ate)
      erro(`faixa ${JSON.stringify(f.titulo)} começa em ${f.de} e acaba em ${f.ate}.`);
    if (vazio(f.titulo)) erro(`faixa de ${f.de} a ${f.ate} sem título.`);
    if (vazio(f.texto))
      erro(
        `faixa ${JSON.stringify(f.titulo)} sem texto. Título sozinho não diz ao leitor o que fazer.`,
      );
  }

  // A ordem no arquivo é do autor; a cobertura se confere na ordem numérica.
  const ord = [...faixas].sort((a, b) => a.de - b.de);
  if (ord[0].de !== min)
    erro(
      `as faixas começam em ${ord[0].de}, e a soma mínima possível é ${min}. ` +
        `Quem tirar ${min} não cai em faixa nenhuma e vê caixa vazia.`,
    );
  if (ord[ord.length - 1].ate !== max)
    erro(
      `as faixas param em ${ord[ord.length - 1].ate}, e a soma máxima possível é ${max}. ` +
        `Quem tirar ${max} não cai em faixa nenhuma e vê caixa vazia.`,
    );
  for (let i = 1; i < ord.length; i++) {
    const anterior = ord[i - 1];
    const atual = ord[i];
    if (atual.de <= anterior.ate)
      erro(
        `sobreposição: ${JSON.stringify(anterior.titulo)} vai até ${anterior.ate} e ` +
          `${JSON.stringify(atual.titulo)} começa em ${atual.de}. Uma soma, um resultado.`,
      );
    if (atual.de !== anterior.ate + 1)
      erro(
        `buraco entre as faixas: ${JSON.stringify(anterior.titulo)} fecha em ${anterior.ate} ` +
          `e ${JSON.stringify(atual.titulo)} abre em ${atual.de}. Falta ${anterior.ate + 1}.`,
      );
  }
}

export function validarQuiz(quiz: QuizDeclarado): void {
  const { modo, perguntas, faixas } = quiz;
  if (!perguntas || perguntas.length === 0) erro(`quiz sem pergunta nenhuma.`);

  const vistos = new Set<string>();
  for (const p of perguntas) {
    if (vistos.has(p.id))
      erro(`id de pergunta repetido: ${JSON.stringify(p.id)}. Um id, uma pergunta.`);
    vistos.add(p.id);
    validarPergunta(p, modo);
  }

  const { min, max } = extremos(perguntas, modo);
  validarFaixas(faixas, min, max);
}
