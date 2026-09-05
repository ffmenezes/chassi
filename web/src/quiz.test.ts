import { describe, it, expect } from "vitest";
import {
  validarQuiz,
  pontuar,
  extremos,
  faixaDe,
  opcoesDe,
  versaoDe,
  OPCOES_VF,
  type PerguntaQuiz,
  type FaixaQuiz,
} from "./quiz";

/* ---------------------------------------------------------------------------
   Insumos. Nada de nicho, domínio ou persona real: o repositório é público
   (erro 10 da skill), e `mock/artigo.ts` já é sobre roteador e Wi-Fi.
   --------------------------------------------------------------------------- */

const diagnostico: PerguntaQuiz[] = [
  {
    id: "provedor",
    enunciado: "O roteador que você usa veio do provedor?",
    tipo: "unica",
    opcoes: [
      { texto: "Sim, o que veio na instalação", peso: 0 },
      { texto: "Não, comprei o meu", peso: 2 },
    ],
  },
  {
    id: "cuidados",
    enunciado: "O que você já fez no aparelho?",
    tipo: "multipla",
    opcoes: [
      { texto: "Troquei a senha de administrador", peso: 2 },
      { texto: "Desliguei o WPS", peso: 1 },
      { texto: "Deixei a senha que veio na etiqueta", peso: -1 },
    ],
  },
  {
    id: "firmware",
    enunciado: "Firmware desatualizado é problema de segurança.",
    tipo: "vf",
    opcoes: [{ peso: 1 }, { peso: 0 }],
  },
  {
    id: "confianca",
    enunciado: "Quanta confiança você tem na sua rede hoje?",
    tipo: "escala",
    escala: { min: 0, max: 3, ancoraMin: "nenhuma", ancoraMax: "total" },
  },
];

/* extremos: unica 0..2, multipla -1..3, vf 0..1, escala 0..3  =>  -1..9 */
const faixasDiag: FaixaQuiz[] = [
  { de: -1, ate: 2, titulo: "Exposta", texto: "A rede está aberta ao vizinho." },
  { de: 3, ate: 6, titulo: "Razoável", texto: "Falta o básico do básico." },
  { de: 7, ate: 9, titulo: "Cuidada", texto: "Dá para dormir tranquilo." },
];

const prova: PerguntaQuiz[] = [
  {
    id: "wps",
    enunciado: "Deixar o WPS ligado aumenta o risco da rede?",
    tipo: "vf",
    correta: 0,
    porque: "O PIN de 8 dígitos do WPS é quebrável por força bruta em horas.",
    fonte: "US-CERT VU#723755, 2011",
  },
  {
    id: "cifra",
    enunciado: "Qual cifra você deve preferir hoje?",
    tipo: "unica",
    opcoes: [{ texto: "WEP" }, { texto: "WPA2" }, { texto: "WPA3" }],
    correta: 2,
    porque: "WPA3 substitui a troca de chaves que deixou o WPA2 vulnerável ao KRACK.",
    fonte: "Wi-Fi Alliance, 2018",
  },
];

const faixasProva: FaixaQuiz[] = [
  { de: 0, ate: 0, titulo: "Comece pelo começo", texto: "Vale reler a abertura." },
  { de: 1, ate: 1, titulo: "Quase lá", texto: "Faltou uma." },
  { de: 2, ate: 2, titulo: "Passou", texto: "As duas certas." },
];

const quizDiag = { modo: "diagnostico" as const, perguntas: diagnostico, faixas: faixasDiag };
const quizProva = { modo: "prova" as const, perguntas: prova, faixas: faixasProva };

/** Clona fundo para que o caso de recusa não contamine o vizinho. */
const menos = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

/* =========================================================================
   Extremos: a base de toda a cobertura de faixa.
   ========================================================================= */

describe("extremos", () => {
  it("soma o menor e o maior de cada pergunta no diagnóstico", () => {
    expect(extremos(diagnostico, "diagnostico")).toEqual({ min: -1, max: 9 });
  });

  it("na múltipla, o piso é a soma dos pesos negativos e o teto a dos positivos", () => {
    /* Dois pesos de cada sinal, de propósito: com um só negativo, "soma dos
       negativos" e "o menor peso" dão o mesmo número, e o teste passaria
       verde contra as duas contas — foi o que aconteceu na primeira versão
       deste arquivo. Aqui a soma dá -3 e o menor dá -2; a soma dá 5 e o maior
       dá 3. Agora o teste tem para onde cair. */
    const so: PerguntaQuiz[] = [
      {
        id: "m",
        enunciado: "O que você já mexeu no aparelho?",
        tipo: "multipla",
        opcoes: [
          { texto: "Troquei a senha", peso: 3 },
          { texto: "Desliguei o WPS", peso: 2 },
          { texto: "Deixei o acesso remoto aberto", peso: -1 },
          { texto: "Deixei a senha da etiqueta", peso: -2 },
        ],
      },
    ];
    expect(extremos(so, "diagnostico")).toEqual({ min: -3, max: 5 });
  });

  it("na prova, cada pergunta vale 0 ou 1, seja qual for o tipo", () => {
    expect(extremos(prova, "prova")).toEqual({ min: 0, max: 2 });
  });
});

/* =========================================================================
   Pontuação.
   ========================================================================= */

describe("pontuar no diagnóstico", () => {
  it("soma o peso da opção escolhida, dos marcados e o valor da escala", () => {
    const soma = pontuar(diagnostico, "diagnostico", {
      provedor: [1], // 2
      cuidados: [0, 1], // 2 + 1
      firmware: [0], // 1
      confianca: [2], // 2
    });
    expect(soma).toBe(8);
  });

  it("múltipla sem nada marcado contribui zero, não o piso dela", () => {
    const soma = pontuar(diagnostico, "diagnostico", {
      provedor: [0],
      cuidados: [],
      firmware: [1],
      confianca: [0],
    });
    expect(soma).toBe(0);
  });

  it("peso negativo desconta de verdade", () => {
    const soma = pontuar([diagnostico[1]], "diagnostico", { cuidados: [0, 2] });
    expect(soma).toBe(1); // 2 + (-1)
  });
});

describe("pontuar na prova", () => {
  it("conta um por acerto", () => {
    expect(pontuar(prova, "prova", { wps: [0], cifra: [2] })).toBe(2);
    expect(pontuar(prova, "prova", { wps: [0], cifra: [1] })).toBe(1);
    expect(pontuar(prova, "prova", { wps: [1], cifra: [0] })).toBe(0);
  });

  it("na múltipla, acerto é o conjunto exato: faltar uma correta não vale meio ponto", () => {
    const p: PerguntaQuiz[] = [
      {
        id: "m",
        enunciado: "Quais dessas protegem a rede?",
        tipo: "multipla",
        opcoes: [{ texto: "a" }, { texto: "b" }, { texto: "c" }],
        correta: [0, 1],
        porque: "As duas primeiras fecham o acesso administrativo.",
        fonte: "Documentação do fabricante, 2025",
      },
    ];
    expect(pontuar(p, "prova", { m: [0, 1] })).toBe(1);
    expect(pontuar(p, "prova", { m: [1, 0] })).toBe(1); // ordem não importa
    expect(pontuar(p, "prova", { m: [0] })).toBe(0);
    expect(pontuar(p, "prova", { m: [0, 1, 2] })).toBe(0);
  });
});

/* =========================================================================
   Faixa.
   ========================================================================= */

describe("faixaDe", () => {
  it("acha a faixa que contém a soma, incluindo as duas pontas", () => {
    expect(faixaDe(faixasDiag, -1)!.titulo).toBe("Exposta");
    expect(faixaDe(faixasDiag, 2)!.titulo).toBe("Exposta");
    expect(faixaDe(faixasDiag, 3)!.titulo).toBe("Razoável");
    expect(faixaDe(faixasDiag, 9)!.titulo).toBe("Cuidada");
  });

  it("devolve null fora de todas as faixas, nunca a primeira por descuido", () => {
    expect(faixaDe(faixasDiag, 10)).toBeNull();
  });
});

/* =========================================================================
   Travas. Cada uma tem os DOIS lados: o que passa e o que recusa (erro 13).
   ========================================================================= */

describe("validarQuiz aceita os dois modos bem formados", () => {
  it("aceita o diagnóstico", () => {
    expect(() => validarQuiz(quizDiag)).not.toThrow();
  });

  it("aceita a prova", () => {
    expect(() => validarQuiz(quizProva)).not.toThrow();
  });
});

describe("trava: cobertura de faixa", () => {
  it("recusa buraco entre uma faixa e a seguinte", () => {
    const q = menos(quizDiag);
    q.faixas[1].de = 4; // a anterior fecha em 2; 3 fica órfão
    expect(() => validarQuiz(q)).toThrow(/buraco|3/);
  });

  it("recusa sobreposição entre faixas", () => {
    const q = menos(quizDiag);
    q.faixas[1].de = 2; // 2 cai em duas faixas
    expect(() => validarQuiz(q)).toThrow(/sobrep/i);
  });

  it("recusa faixa que não alcança o teto possível", () => {
    const q = menos(quizDiag);
    q.faixas[2].ate = 8; // o máximo é 9
    expect(() => validarQuiz(q)).toThrow(/9/);
  });

  it("recusa faixa que não começa no piso possível", () => {
    const q = menos(quizDiag);
    q.faixas[0].de = 0; // o mínimo é -1
    expect(() => validarQuiz(q)).toThrow(/-1/);
  });

  it("aceita faixas fora de ordem no arquivo, desde que cubram tudo", () => {
    const q = menos(quizDiag);
    q.faixas = [q.faixas[2], q.faixas[0], q.faixas[1]];
    expect(() => validarQuiz(q)).not.toThrow();
  });

  it("recusa faixa sem título ou sem texto", () => {
    const q = menos(quizDiag);
    q.faixas[0].texto = "  ";
    expect(() => validarQuiz(q)).toThrow(/texto/i);
  });
});

describe("trava: gabarito de prova afirma fato, e fato tem fonte", () => {
  it("recusa pergunta de prova sem resposta correta declarada", () => {
    const q = menos(quizProva);
    delete q.perguntas[0].correta;
    expect(() => validarQuiz(q)).toThrow(/correta/i);
  });

  it("recusa gabarito sem justificativa", () => {
    const q = menos(quizProva);
    q.perguntas[1].porque = "";
    expect(() => validarQuiz(q)).toThrow(/porqu/i);
  });

  it("recusa fonte sem ano", () => {
    const q = menos(quizProva);
    q.perguntas[1].fonte = "Wi-Fi Alliance";
    expect(() => validarQuiz(q)).toThrow(/data|ano/i);
  });

  it("recusa índice de correta que não existe entre as opções", () => {
    const q = menos(quizProva);
    q.perguntas[1].correta = 7;
    expect(() => validarQuiz(q)).toThrow(/correta/i);
  });

  it("recusa escala em prova: escala não tem resposta certa", () => {
    const q = menos(quizProva);
    q.perguntas.push({
      id: "e",
      enunciado: "Quanto você confia?",
      tipo: "escala",
      escala: { min: 0, max: 3, ancoraMin: "nada", ancoraMax: "muito" },
    });
    q.faixas.push({ de: 3, ate: 3, titulo: "x", texto: "y" });
    expect(() => validarQuiz(q)).toThrow(/escala/i);
  });
});

describe("trava: peso de diagnóstico", () => {
  it("recusa opção sem peso", () => {
    const q = menos(quizDiag);
    delete q.perguntas[0].opcoes![1].peso;
    expect(() => validarQuiz(q)).toThrow(/peso/i);
  });

  it("recusa peso fracionário: a cobertura de faixa se conta em inteiro", () => {
    const q = menos(quizDiag);
    q.perguntas[0].opcoes![1].peso = 1.5;
    expect(() => validarQuiz(q)).toThrow(/inteiro/i);
  });

  it("recusa gabarito dentro de um diagnóstico", () => {
    const q = menos(quizDiag);
    q.perguntas[0].correta = 1;
    expect(() => validarQuiz(q)).toThrow(/diagn/i);
  });
});

describe("trava: forma das perguntas", () => {
  it("recusa quiz sem pergunta nenhuma", () => {
    expect(() => validarQuiz({ ...quizDiag, perguntas: [] })).toThrow(/pergunta/i);
  });

  it("recusa id repetido", () => {
    const q = menos(quizDiag);
    q.perguntas[1].id = "provedor";
    expect(() => validarQuiz(q)).toThrow(/provedor/);
  });

  it("recusa escolha única com menos de duas opções", () => {
    const q = menos(quizDiag);
    q.perguntas[0].opcoes = [{ texto: "só essa", peso: 0 }];
    expect(() => validarQuiz(q)).toThrow(/duas/i);
  });

  it("recusa escala sem âncora nas duas pontas", () => {
    const q = menos(quizDiag);
    q.perguntas[3].escala!.ancoraMax = "";
    expect(() => validarQuiz(q)).toThrow(/âncora|ancora/i);
  });

  it("recusa escala com min maior ou igual ao max", () => {
    const q = menos(quizDiag);
    q.perguntas[3].escala!.max = 0;
    expect(() => validarQuiz(q)).toThrow(/escala/i);
  });

  it("recusa V/F com texto próprio: aí não é V/F, é escolha única", () => {
    const q = menos(quizDiag);
    q.perguntas[2].opcoes![0].texto = "Com certeza";
    expect(() => validarQuiz(q)).toThrow(/verdadeiro|falso/i);
  });
});

/* =========================================================================
   opcoesDe: o V/F que o componente desenha vem daqui, nunca de literal solto
   espalhado pelo template.
   ========================================================================= */

describe("opcoesDe", () => {
  it("dá texto de Verdadeiro e Falso ao V/F, preservando os pesos declarados", () => {
    const o = opcoesDe(diagnostico[2]);
    expect(o.map((x) => x.texto)).toEqual([...OPCOES_VF]);
    expect(o.map((x) => x.peso)).toEqual([1, 0]);
  });

  it("dá V/F mesmo quando a prova não declara opção nenhuma", () => {
    expect(opcoesDe(prova[0]).map((x) => x.texto)).toEqual([...OPCOES_VF]);
  });

  it("devolve as opções como estão nos outros tipos", () => {
    expect(opcoesDe(prova[1]).map((x) => x.texto)).toEqual(["WEP", "WPA2", "WPA3"]);
  });
});

/* =========================================================================
   versaoDe: o que faz a resposta guardada no navegador expirar.

   Mesma doutrina de `avisoBarra.ts` — guarda-se o CONTEÚDO, não um booleano.
   Quiz editado é quiz novo, e resposta velha não volta para ele.
   ========================================================================= */

describe("versaoDe", () => {
  it("é a mesma para a mesma declaração", () => {
    expect(versaoDe(diagnostico)).toBe(versaoDe(JSON.parse(JSON.stringify(diagnostico))));
  });

  it("muda quando um enunciado muda", () => {
    const outro = menos(diagnostico);
    outro[0].enunciado = "O roteador é seu ou alugado?";
    expect(versaoDe(outro)).not.toBe(versaoDe(diagnostico));
  });

  it("muda quando um peso muda, mesmo com todo o texto igual", () => {
    const outro = menos(diagnostico);
    outro[0].opcoes![1].peso = 3;
    expect(versaoDe(outro)).not.toBe(versaoDe(diagnostico));
  });

  it("muda quando uma opção é acrescentada", () => {
    const outro = menos(diagnostico);
    outro[1].opcoes!.push({ texto: "Troquei o aparelho", peso: 2 });
    expect(versaoDe(outro)).not.toBe(versaoDe(diagnostico));
  });

  it("muda quando as perguntas trocam de ordem: o índice guardado aponta para outra coisa", () => {
    const outro = menos(diagnostico);
    [outro[0], outro[1]] = [outro[1], outro[0]];
    expect(versaoDe(outro)).not.toBe(versaoDe(diagnostico));
  });
});
