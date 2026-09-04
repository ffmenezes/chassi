/**
 * O motor da calculadora (bloco 23).
 *
 * A autoridade é `.claude/skills/artigo/referencias/arquitetura-pagina.md`, bloco
 * 23. Duas travas de lá viram código aqui, e é por isso que este arquivo existe
 * separado do componente:
 *
 *   1. "A fórmula do formulário é a mesma do corpo, literal." A expressão é dado
 *      declarativo, escrita uma vez no esqueleto congelado e lida pelos dois
 *      lados. Ninguém reescreve a conta em JavaScript.
 *   2. "Sem JavaScript, o formulário aparece com os valores de partida visíveis."
 *      O mesmo `calcular` roda na build, então o HTML inicial já sai com número
 *      certo. O script do cliente só recalcula.
 *
 * Não usa `eval` nem `new Function`. A expressão vem de dado nosso, e mesmo assim
 * um avaliador de 60 linhas custa menos que uma exceção de CSP descoberta em
 * produção.
 */

/** Um campo que o leitor troca. */
export interface CampoCalculo {
  /** Identificador usado nas expressões. Letras, dígitos e `_`. */
  id: string;
  rotulo: string;
  /** Valor de partida. É premissa, e `origem` diz de onde ele saiu. */
  inicial: number;
  /**
   * De onde veio o valor de partida, na tela, ao lado do campo.
   * Obrigatório: campo pré-preenchido com número plausível é a célula inventada
   * do bloco 4, com a agravante de o leitor levar o número embora.
   */
  origem: string;
  /** "R$", "un", "min", "%". Vai colado no campo, nunca separado dele. */
  unidade?: string;
  passo?: number;
  min?: number;
  max?: number;
}

/** Um número que a calculadora devolve. */
export interface SaidaCalculo {
  id: string;
  rotulo: string;
  /** Aritmética sobre os `id` dos campos e das saídas anteriores. */
  expr: string;
  unidade?: string;
  casas?: number;
  /**
   * "cima" é o padrão para o que decide gasto, pelo item 7 de integridade da
   * raiz: arredondamento em dimensionamento sobe, nunca desce. Calculadora que
   * arredonda para baixo entrega um preço que não paga o insumo do leitor.
   */
  arredonda?: "cima" | "normal";
  /** Piso, premissa, faixa com data. A ressalva viaja com o número. */
  ressalva?: string;
  /** Saída de apoio: entra na conta seguinte e não aparece na tela. */
  oculta?: boolean;
}

export interface SaidaCalculada {
  id: string;
  valor: number | null;
  texto: string;
}

const ID_VALIDO = /^[A-Za-z_][A-Za-z0-9_]*$/;

/* ---------------------------------------------------------------------------
   Avaliador. Precedência: (), depois * /, depois + -. Unário `-` aceito.
   --------------------------------------------------------------------------- */

type Token = { t: "num"; v: number } | { t: "id"; v: string } | { t: "op"; v: string };

function tokenizar(expr: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (c === " " || c === "\t" || c === "\n") {
      i++;
      continue;
    }
    if ("+-*/()".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
      continue;
    }
    if (c >= "0" && c <= "9") {
      let j = i;
      while (j < expr.length && ((expr[j] >= "0" && expr[j] <= "9") || expr[j] === ".")) j++;
      out.push({ t: "num", v: Number(expr.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < expr.length && /[A-Za-z0-9_]/.test(expr[j])) j++;
      out.push({ t: "id", v: expr.slice(i, j) });
      i = j;
      continue;
    }
    throw new Error(`caractere não permitido em expressão de cálculo: ${JSON.stringify(c)}`);
  }
  return out;
}

function avaliar(expr: string, escopo: Record<string, number>): number {
  const tk = tokenizar(expr);
  let p = 0;

  const espiar = () => tk[p];
  const comer = (v: string) => {
    const t = tk[p];
    if (!t || t.t !== "op" || t.v !== v) throw new Error(`esperava "${v}" em: ${expr}`);
    p++;
  };

  function primario(): number {
    const t = espiar();
    if (!t) throw new Error(`expressão truncada: ${expr}`);
    if (t.t === "op" && t.v === "-") {
      p++;
      return -primario();
    }
    if (t.t === "op" && t.v === "(") {
      p++;
      const v = soma();
      comer(")");
      return v;
    }
    if (t.t === "num") {
      p++;
      return t.v;
    }
    if (t.t === "id") {
      p++;
      if (!(t.v in escopo)) throw new Error(`"${t.v}" não é campo nem saída anterior`);
      return escopo[t.v];
    }
    throw new Error(`token inesperado em: ${expr}`);
  }

  function produto(): number {
    let v = primario();
    for (;;) {
      const t = espiar();
      if (t && t.t === "op" && (t.v === "*" || t.v === "/")) {
        p++;
        const d = primario();
        v = t.v === "*" ? v * d : v / d;
      } else return v;
    }
  }

  function soma(): number {
    let v = produto();
    for (;;) {
      const t = espiar();
      if (t && t.t === "op" && (t.v === "+" || t.v === "-")) {
        p++;
        const d = produto();
        v = t.v === "+" ? v + d : v - d;
      } else return v;
    }
  }

  const v = soma();
  if (p !== tk.length) throw new Error(`sobrou token em: ${expr}`);
  return v;
}

/* ------------------------------------------------------------------------- */

/** Arredonda para cima na casa pedida. Item 7 de integridade da raiz. */
export function arredondarParaCima(x: number, casas: number): number {
  const f = 10 ** casas;
  // a folga absorve o erro binário de 0.1 + 0.2, que senão sobe um centavo
  // inteiro por conta de 1e-16
  return Math.ceil(x * f - 1e-9) / f;
}

export function formatar(valor: number, casas: number, unidade?: string): string {
  const n = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
  if (!unidade) return n;
  // número e unidade não se separam: espaço não separável, item A1 do catálogo
  return unidade === "R$" ? `R$ ${n}` : `${n} ${unidade}`;
}

/**
 * Roda a conta. Mesmo caminho na build e no cliente.
 *
 * Valor não finito (divisão por zero, campo vazio) devolve `null` e o texto
 * "n/d". Não devolve zero: zero é um número, e número errado na tela é pior que
 * a ausência dele.
 */
export function calcular(
  campos: readonly CampoCalculo[],
  saidas: readonly SaidaCalculo[],
  valores: Record<string, number>
): SaidaCalculada[] {
  const escopo: Record<string, number> = {};
  for (const c of campos) {
    const v = valores[c.id];
    escopo[c.id] = Number.isFinite(v) ? v : c.inicial;
  }

  return saidas.map((s) => {
    const casas = s.casas ?? 2;
    let valor: number | null;
    try {
      const bruto = avaliar(s.expr, escopo);
      valor = Number.isFinite(bruto) ? bruto : null;
    } catch {
      valor = null;
    }
    if (valor !== null) {
      valor = s.arredonda === "normal" ? Number(valor.toFixed(casas)) : arredondarParaCima(valor, casas);
      escopo[s.id] = valor;
    }
    return {
      id: s.id,
      valor,
      texto: valor === null ? "n/d" : formatar(valor, casas, s.unidade),
    };
  });
}

/**
 * As travas do bloco 23 que quebram a build.
 *
 * Elas não são avisos. Um campo sem `origem` é o defeito central do bloco, e
 * descobri-lo em revisão manual é descobri-lo depois de publicado.
 */
export function validarCalculadora(campos: readonly CampoCalculo[], saidas: readonly SaidaCalculo[]): void {
  const erro = (m: string) => {
    throw new Error(`[bloco 23] ${m}`);
  };

  if (campos.length === 0) erro("calculadora sem campo. Calculadora sem conta congelada não nasce.");
  if (saidas.filter((s) => !s.oculta).length === 0) erro("calculadora sem saída visível.");

  const vistos = new Set<string>();
  for (const c of campos) {
    if (!ID_VALIDO.test(c.id)) erro(`id de campo inválido: ${JSON.stringify(c.id)}.`);
    if (vistos.has(c.id)) erro(`id repetido: ${c.id}.`);
    vistos.add(c.id);
    if (!c.origem?.trim()) {
      erro(
        `campo "${c.rotulo}" sem origem declarada. Todo valor de partida sai do esqueleto ` +
          `congelado e diz de onde veio, na tela. Campo pré-preenchido com número plausível ` +
          `é a célula inventada, com a agravante de o leitor levar o número embora.`
      );
    }
    if (!Number.isFinite(c.inicial)) erro(`campo "${c.rotulo}" com valor de partida não numérico.`);
  }

  for (const s of saidas) {
    if (!ID_VALIDO.test(s.id)) erro(`id de saída inválido: ${JSON.stringify(s.id)}.`);
    if (vistos.has(s.id)) erro(`id repetido: ${s.id}.`);
    // a expressão só pode olhar para trás: campo, ou saída já calculada
    try {
      avaliar(s.expr, Object.fromEntries([...vistos].map((k) => [k, 1])));
    } catch (e) {
      erro(`saída "${s.rotulo}": ${(e as Error).message}`);
    }
    vistos.add(s.id);
    if (/%/.test(s.unidade ?? "") && !s.ressalva) {
      erro(
        `saída "${s.rotulo}" em percentual sem ressalva. Item 10 de integridade da raiz: ` +
          `percentual carrega a base sobre a qual foi calculado, e a regra prática sai em ` +
          `reais por unidade.`
      );
    }
  }
}
