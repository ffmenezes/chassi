/**
 * Bloco 31 — Gráfico: os tipos, as travas e a geometria, puros.
 *
 * Pela mesma razão de `slides.ts` e `quiz.ts`: trava que só vive no
 * frontmatter de um `.astro` não tem teste que discrimina, e a suíte roda em
 * vitest, sem Astro. A regra é função aqui; `Grafico.astro` só chama e
 * desenha.
 *
 * O que um gráfico é, neste chassi: uma tabela desenhada. Ele nunca
 * substitui a tabela nem o texto — todo número que ele mostra existe no
 * esqueleto, e a tabela com os mesmos números viaja dentro do bloco, em
 * `<details>`, para quem não vê o desenho (leitor de tela, crawler, print em
 * preto e branco). Três formas, e só três, porque cada uma responde a uma
 * pergunta diferente e a quarta seria enfeite:
 *
 *   barra   quanto cada um tem, lado a lado (comparação entre categorias)
 *   linha   como um valor mudou ao longo de uma sequência (tempo, faixa)
 *   pizza   que parte de um todo cada fatia é (partes que somam 100%)
 */

export type TipoGrafico = "barra" | "linha" | "pizza";

export interface Serie {
  /** Vai para a legenda e para o cabeçalho da tabela. */
  nome: string;
  /** Um valor por categoria, na mesma ordem. `null` é lacuna declarada:
   *  a barra não nasce e a célula sai como "[sem dado]", nunca zero. */
  valores: (number | null)[];
}

export interface DadosGrafico {
  tipo: TipoGrafico;
  /** O que o gráfico mostra, com a unidade: "Preço à vista por modelo, R$". */
  titulo: string;
  /** Eixo das categorias (barra e linha) ou nome das fatias (pizza). */
  categorias: string[];
  /** Pizza aceita exatamente uma série; barra e linha, até TETO_DE_SERIES. */
  series: Serie[];
  /** Vai colada ao número: "R$", "kWh", "%". Pizza é sempre "%" na leitura. */
  unidade?: string;
  /** Casas decimais na formatação. Padrão 0. */
  decimais?: number;
  /** Obrigatória: de onde saíram os números, com data. Sem fonte, gráfico
   *  não nasce — é a mesma trava da figura de prova. */
  fonte: string;
}

export const TETO_DE_SERIES = 4;
export const TETO_DE_CATEGORIAS = 12;
export const TETO_DE_FATIAS = 6;
export const PISO_DE_PONTOS_NA_LINHA = 3;

const erro = (msg: string): never => {
  throw new Error(`[bloco 31] ${msg}`);
};

/** Lança com o porquê. O componente chama antes de desenhar. */
export function conferirGrafico(d: DadosGrafico): void {
  if (!d.titulo?.trim()) erro("gráfico sem título. O título diz o que o desenho mede, com a unidade; sem ele o leitor vê barras e não sabe de quê.");
  if (!d.fonte?.trim()) erro("gráfico sem fonte. Número desenhado é número publicado, e número publicado carrega de onde veio e de quando é — a mesma trava da figura de prova.");
  if (!d.categorias?.length) erro("gráfico sem categorias. Não há o que comparar.");
  if (!d.series?.length) erro("gráfico sem série. Não há o que desenhar.");
  if (d.categorias.length > TETO_DE_CATEGORIAS)
    erro(`${d.categorias.length} categorias; o teto é ${TETO_DE_CATEGORIAS}. Acima disso o rótulo não cabe e o gráfico vira tabela ruim — use a tabela.`);
  for (const s of d.series) {
    if (!s.nome?.trim()) erro("série sem nome. A legenda e a tabela precisam dele.");
    if (s.valores.length !== d.categorias.length)
      erro(`a série "${s.nome}" tem ${s.valores.length} valores para ${d.categorias.length} categorias. Um valor por categoria, na mesma ordem; lacuna é null, nunca omissão.`);
    for (const v of s.valores) {
      if (v !== null && !Number.isFinite(v)) erro(`a série "${s.nome}" tem um valor que não é número. O esqueleto congelou números; o gráfico não inventa.`);
    }
  }
  if (d.tipo === "pizza") {
    if (d.series.length !== 1) erro("pizza com mais de uma série. A pizza responde 'que parte do todo é cada fatia'; duas séries são duas pizzas, ou uma barra.");
    if (d.categorias.length > TETO_DE_FATIAS)
      erro(`pizza com ${d.categorias.length} fatias; o teto é ${TETO_DE_FATIAS}. Acima disso as fatias pequenas viram fio e ninguém compara; use barra.`);
    const vals = d.series[0].valores;
    if (vals.some((v) => v === null)) erro("pizza com lacuna. Fatia sem valor não é 'sem dado', é um todo que não fecha; use barra, que aguenta lacuna.");
    if (vals.some((v) => (v as number) < 0)) erro("pizza com valor negativo. Parte de um todo não é negativa.");
    if (vals.every((v) => v === 0)) erro("pizza com todas as fatias em zero. Não há todo para dividir.");
  } else {
    if (d.series.length > TETO_DE_SERIES)
      erro(`${d.series.length} séries; o teto é ${TETO_DE_SERIES}. Quatro já é o limite do que hachura e cor distinguem; acima disso, dois gráficos.`);
    if (d.tipo === "linha" && d.categorias.length < PISO_DE_PONTOS_NA_LINHA)
      erro(`linha com ${d.categorias.length} pontos; o piso é ${PISO_DE_PONTOS_NA_LINHA}. Dois pontos são uma barra de contraste, não uma tendência.`);
  }
}

/** Formata no padrão brasileiro, com a unidade colada como o texto faz:
 *  "R$ 1.899" (moeda antes), "12 kWh" (unidade depois), "38%" (sem espaço). */
export function formatar(v: number | null, unidade = "", decimais = 0): string {
  if (v === null) return "[sem dado]";
  const n = v.toLocaleString("pt-BR", { minimumFractionDigits: decimais, maximumFractionDigits: decimais });
  if (!unidade) return n;
  if (unidade === "%") return `${n}%`;
  if (/^[A-Z]{1,3}\$$/.test(unidade)) return `${unidade} ${n}`;
  return `${n} ${unidade}`;
}

/**
 * A escala do eixo de valor: de zero até um teto "redondo" logo acima do
 * maior valor, com quatro marcas. Zero sempre entra — barra que não começa
 * no zero mente sobre a proporção, e é o truque mais velho do gráfico
 * enganoso. Valor negativo desce o piso do mesmo jeito.
 */
export interface Escala {
  min: number;
  max: number;
  marcas: number[];
}

export function escala(valores: (number | null)[], marcas = 4): Escala {
  const nums = valores.filter((v): v is number => v !== null);
  const maior = Math.max(0, ...nums);
  const menor = Math.min(0, ...nums);
  const bruto = (maior - menor) / marcas || 1;
  const pot = Math.pow(10, Math.floor(Math.log10(bruto)));
  const frac = bruto / pot;
  const passo = (frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 2.5 ? 2.5 : frac <= 5 ? 5 : 10) * pot;
  const max = Math.ceil(maior / passo) * passo;
  const min = Math.floor(menor / passo) * passo;
  const lista: number[] = [];
  for (let m = min; m <= max + passo / 2; m += passo) lista.push(Number(m.toFixed(10)));
  return { min, max: max === min ? min + passo : max, marcas: lista };
}

/**
 * As fatias da pizza: cada uma com a fração do todo e o caminho SVG do
 * setor, num círculo de raio `r` centrado em (cx, cy). Começa no topo e anda
 * no sentido horário, como se lê um relógio.
 */
export interface Fatia {
  indice: number;
  valor: number;
  fracao: number;
  caminho: string;
  /** Ponto no meio da fatia, a 60% do raio, para ancorar o rótulo. */
  rotuloX: number;
  rotuloY: number;
}

export function fatias(valores: number[], cx: number, cy: number, r: number): Fatia[] {
  const total = valores.reduce((a, b) => a + b, 0);
  let ang = -Math.PI / 2;
  return valores.map((v, i) => {
    const frac = total ? v / total : 0;
    const fim = ang + frac * 2 * Math.PI;
    const x1 = cx + r * Math.cos(ang), y1 = cy + r * Math.sin(ang);
    const x2 = cx + r * Math.cos(fim), y2 = cy + r * Math.sin(fim);
    const grande = frac > 0.5 ? 1 : 0;
    const meio = (ang + fim) / 2;
    const caminho =
      frac >= 0.999999
        ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`
        : `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${grande} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    const f = { indice: i, valor: v, fracao: frac, caminho, rotuloX: cx + 0.6 * r * Math.cos(meio), rotuloY: cy + 0.6 * r * Math.sin(meio) };
    ang = fim;
    return f;
  });
}

/** O texto que o `<desc>` do SVG carrega: os números por extenso, para quem
 *  ouve a página sair com o dado, não com a forma. */
export function descrever(d: DadosGrafico): string {
  const u = d.unidade ?? "";
  if (d.tipo === "pizza") {
    const vals = d.series[0].valores as number[];
    const total = vals.reduce((a, b) => a + b, 0);
    return d.categorias
      .map((c, i) => `${c}: ${formatar(vals[i], u, d.decimais)} (${formatar(total ? (100 * vals[i]) / total : 0, "%", 0)})`)
      .join("; ");
  }
  return d.series
    .map((s) => `${s.nome}: ` + d.categorias.map((c, i) => `${c} ${formatar(s.valores[i], u, d.decimais)}`).join(", "))
    .join(". ");
}
