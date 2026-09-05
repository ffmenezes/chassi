# Card social — plano de implementação

> **Para executores agênticos:** SUB-SKILL OBRIGATÓRIA: use
> superpowers:subagent-driven-development (recomendado) ou
> superpowers:executing-plans para executar tarefa a tarefa. Os passos usam
> caixa (`- [ ]`) para acompanhamento.

**Goal:** toda página do site passa a ter `canonical`, tags OG/Twitter e uma
imagem de card 1200×630 gerada no build, determinística em qualquer máquina.

**Architecture:** uma função pura monta a URL absoluta a partir do domínio que
mora no arquivo do participante; um módulo puro quebra o título em linhas e
converte glifos em contorno com opentype.js; um endpoint estático rasteriza o
SVG resultante com sharp. Como o SVG entregue ao sharp **não contém `<text>`**,
não existe resolução de fonte na rasterização e o PNG é idêntico em qualquer
máquina.

**Tech Stack:** Astro 7.3.1 (`output: "static"`), TypeScript 6, Vitest 3,
opentype.js 1.3.4, sharp 0.35.4, Inter Bold (OFL).

**Spec:** `docs/specs/2026-09-05-card-social-e-imagem-design.md`

## Global Constraints

- Português em tudo: doutrina, comentário, nome de arquivo e de variável.
- Nenhuma tarefa toca bloco existente, estilo, function ou página jurídica.
- `sharp` passa a ser **dependência declarada** de `web/package.json`. Hoje ela
  só existe transitivamente, via `astro:assets`; importar direto o que não está
  declarado é dependência escondida que quebra no dia em que o Astro trocar.
- Versões exatas: `opentype.js@1.3.4`, `@types/opentype.js@1.3.10`,
  `sharp@0.35.4`. A 2.0.0 do opentype.js **não publica `.d.ts`** e o `@types`
  disponível é da linha 1.3 — por isso a 1.3.4, e não a mais nova.
- Fonte: `Inter-Bold.ttf`, 410 KB, extraída de `Inter-4.1.zip` (rsms/inter),
  licença OFL commitada ao lado.
- Card: 1200×630. Título em no máximo **3 linhas**, 64px, margem de 80px.
- Rodar `cd web && npm test` antes de cada commit; `npm run build` nas tarefas
  4 e 5, que são as que só o build exercita.
- **`git add` é sempre seletivo, nunca varredura.** Nomeie cada caminho que
  você mesmo editou. Nunca `git add -A`, `git add .`, `git add <diretório>`
  nem `git commit -a`, mesmo quando o `git status` parece ter só as suas
  mudanças — o arquivo alheio que entra junto credita a pessoa errada no
  histórico e não se separa depois. Antes de commitar, rode
  `git status --porcelain` e compare com a lista do que você tocou; o que não
  for seu fica de fora e é relatado.

---

### Task 1: `url.ts` — a URL absoluta

**Files:**
- Create: `web/src/url.ts`
- Test: `web/src/url.test.ts`

**Interfaces:**
- Consumes: `Site` de `web/src/sites/tipos.ts` (campos obrigatórios: `slug`,
  `nome`, `dominio`, `estilo`, `modoPadrao`, `blocos`, `muroDeEmail`,
  `responsavel`, `emailContato`).
- Produces: `urlAbsoluta(site: Site, caminho: string): string`

- [ ] **Passo 1: escrever o teste que falha**

```ts
// web/src/url.test.ts
import { describe, it, expect } from "vitest";
import { urlAbsoluta } from "./url";
import type { Site } from "./sites/tipos";

const site = (dominio: string): Site => ({
  slug: "s", nome: "S", dominio, estilo: "linho", modoPadrao: "claro",
  blocos: [], muroDeEmail: false, emailContato: "c@s.com",
  responsavel: { nome: "Nome Sobrenome", tipo: "pf" },
});

describe("urlAbsoluta", () => {
  it("monta https com o dominio do site", () => {
    expect(urlAbsoluta(site("exemplo.com.br"), "/sobre/")).toBe(
      "https://exemplo.com.br/sobre/",
    );
  });

  it("preserva a raiz", () => {
    expect(urlAbsoluta(site("exemplo.com.br"), "/")).toBe("https://exemplo.com.br/");
  });

  it("recusa dominio com esquema: og:url sairia dobrado", () => {
    expect(() => urlAbsoluta(site("https://exemplo.com.br"), "/")).toThrow(/esquema/i);
  });

  it("recusa dominio com barra final", () => {
    expect(() => urlAbsoluta(site("exemplo.com.br/"), "/")).toThrow(/barra final/i);
  });

  it("recusa dominio vazio, que e configuracao incompleta", () => {
    expect(() => urlAbsoluta(site("   "), "/")).toThrow(/vazio/i);
  });

  it("recusa dominio com espaco no meio", () => {
    expect(() => urlAbsoluta(site("exemplo .com.br"), "/")).toThrow(/espaco|espaço/i);
  });

  it("recusa caminho sem barra inicial, porque a chamada e nossa", () => {
    expect(() => urlAbsoluta(site("exemplo.com.br"), "sobre/")).toThrow(/barra inicial/i);
  });
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `cd web && npx vitest run src/url.test.ts`
Esperado: FAIL, "Failed to resolve import ./url".

- [ ] **Passo 3: implementar o mínimo**

```ts
// web/src/url.ts
/**
 * A URL absoluta de uma página deste site.
 *
 * O domínio sai de `web/src/sites/<slug>.ts` e daqui só — a mesma doutrina de
 * `institucional/dados.ts`, que é o que faz o participante nunca precisar
 * abrir uma página jurídica. Por isso `astro.config.mjs` continua SEM `site:`:
 * a configuração do Astro é do upstream, o domínio é do participante, e juntar
 * os dois cria conflito exatamente onde o desenho do repositório existe para
 * não ter nenhum.
 *
 * Falha em vez de emendar: `og:url` relativo é card que não abre, e descobrir
 * isso no WhatsApp é caro demais perto de descobrir no build.
 */
import type { Site } from "./sites/tipos";

const erro = (m: string) => {
  throw new Error(`[url] ${m}`);
};

export function urlAbsoluta(site: Site, caminho: string): string {
  const d = site.dominio.trim();

  if (!d) erro("dominio vazio em web/src/sites/<slug>.ts. Sem ele nao existe og:url.");
  if (/^[a-z]+:\/\//i.test(d)) {
    erro(`dominio com esquema ("${d}"). Escreva so o host: "exemplo.com.br".`);
  }
  if (d.endsWith("/")) {
    erro(`dominio com barra final ("${d}"). A barra vem do caminho, nao do host.`);
  }
  if (/\s/.test(d)) erro(`dominio com espaco ("${d}").`);
  if (!caminho.startsWith("/")) {
    erro(`caminho sem barra inicial ("${caminho}"). A chamada e nossa: passe "/sobre/".`);
  }

  return `https://${d}${caminho}`;
}
```

- [ ] **Passo 4: rodar e ver passar**

Rodar: `cd web && npm test`
Esperado: PASS, com 7 testes novos.

- [ ] **Passo 5: commitar**

```bash
git add web/src/url.ts web/src/url.test.ts
git commit -m "feat(url): URL absoluta a partir do dominio do participante"
```

---

### Task 2: a fonte vendorizada e `social/texto.ts`

**Files:**
- Create: `web/src/social/Inter-Bold.ttf`, `web/src/social/LICENSE-Inter.txt`,
  `web/src/social/fonte.ts`, `web/src/social/texto.ts`
- Test: `web/src/social/texto.test.ts`
- Modify: `web/package.json` (dependências)

**Interfaces:**
- Consumes: nada de tarefas anteriores.
- Produces:
  - `fonteDoCard(): Font` — memoizada, de `fonte.ts`
  - `quebrar(fonte: Font, texto: string, tamanho: number, larguraMax: number, maxLinhas: number): Linha[]`
  - `caminhoDe(fonte: Font, texto: string, x: number, y: number, tamanho: number): string`
  - `interface Linha { texto: string; largura: number }`

- [ ] **Passo 1: instalar as dependências**

```bash
cd web
npm i opentype.js@1.3.4 sharp@0.35.4
npm i -D @types/opentype.js@1.3.10
```

- [ ] **Passo 2: vendorizar a fonte**

Trocar `RAIZ` pelo caminho absoluto do repositório.

```bash
cd /tmp
curl -L -o inter.zip https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip
mkdir -p RAIZ/web/src/social
unzip -p inter.zip extras/ttf/Inter-Bold.ttf > RAIZ/web/src/social/Inter-Bold.ttf
unzip -p inter.zip LICENSE.txt > RAIZ/web/src/social/LICENSE-Inter.txt
ls -la RAIZ/web/src/social/Inter-Bold.ttf
```

Esperado: `Inter-Bold.ttf` com aproximadamente 410 KB.

- [ ] **Passo 3: escrever `fonte.ts`**

```ts
// web/src/social/fonte.ts
/**
 * A fonte do card — e ela é do CARD, não do site.
 *
 * Os cinco estilos declaram PILHA DE SISTEMA (`ui-sans-serif`, `system-ui`,
 * com `Inter` ou `Copernicus` só se a máquina do leitor tiver). O chassi não
 * embute webfont nenhuma, então o site já não tem tipografia determinística:
 * tem uma pilha. Qualquer fonte embutida aqui é a fonte do card, e é melhor
 * declarar isso do que fingir o contrário.
 *
 * Uma fonte, um peso. Restrição, não pobreza.
 */
import { readFileSync } from "node:fs";
import opentype from "opentype.js";
import type { Font } from "opentype.js";

let memo: Font | null = null;

export function fonteDoCard(): Font {
  if (memo) return memo;
  const bytes = readFileSync(new URL("./Inter-Bold.ttf", import.meta.url));
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  memo = opentype.parse(buffer);
  return memo;
}
```

- [ ] **Passo 4: escrever o teste que falha**

```ts
// web/src/social/texto.test.ts
import { describe, it, expect } from "vitest";
import { fonteDoCard } from "./fonte";
import { quebrar, caminhoDe } from "./texto";

const f = fonteDoCard();

describe("quebrar", () => {
  it("nao quebra o que cabe numa linha", () => {
    const l = quebrar(f, "Titulo curto", 64, 1040, 3);
    expect(l).toHaveLength(1);
    expect(l[0].texto).toBe("Titulo curto");
    expect(l[0].largura).toBeGreaterThan(0);
  });

  it("quebra por palavra, sem estourar a largura", () => {
    const l = quebrar(f, "Quanto gasta um ar-condicionado por mes a conta com a tarifa", 64, 1040, 3);
    expect(l.length).toBeGreaterThan(1);
    for (const linha of l) expect(linha.largura).toBeLessThanOrEqual(1040);
  });

  it("mede acento sem contar caractere: e circunflexo nao vale por dois", () => {
    const semAcento = quebrar(f, "mes", 64, 1040, 3)[0].largura;
    const comAcento = quebrar(f, "mês", 64, 1040, 3)[0].largura;
    expect(Math.abs(comAcento - semAcento)).toBeLessThan(semAcento * 0.15);
  });

  it("elipsa quando passa do maximo de linhas", () => {
    const l = quebrar(f, "palavra ".repeat(60).trim(), 64, 1040, 3);
    expect(l).toHaveLength(3);
    expect(l[2].texto.endsWith("…")).toBe(true);
  });

  it("corta a palavra unica que sozinha estoura a caixa", () => {
    const l = quebrar(f, "Pindamonhangabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 64, 400, 3);
    expect(l[0].texto.endsWith("…")).toBe(true);
    expect(l[0].largura).toBeLessThanOrEqual(400);
  });

  it("titulo vazio e erro, nao card em branco", () => {
    expect(() => quebrar(f, "   ", 64, 1040, 3)).toThrow(/vazio/i);
  });
});

describe("caminhoDe", () => {
  it("devolve dados de path, e nunca uma tag de texto", () => {
    const d = caminhoDe(f, "Teste", 80, 250, 64);
    expect(d.length).toBeGreaterThan(10);
    expect(d).not.toContain("<text");
  });
});
```

- [ ] **Passo 5: rodar e ver falhar**

Rodar: `cd web && npx vitest run src/social/texto.test.ts`
Esperado: FAIL, "Failed to resolve import ./texto".

- [ ] **Passo 6: implementar**

```ts
// web/src/social/texto.ts
/**
 * A matemática do card: medir, quebrar, elipsar, desenhar.
 *
 * Puro de propósito. `quebrar` decide as linhas, `caminhoDe` desenha UMA, e
 * quem compõe é o `arte.ts` — assim a medida e o desenho se testam separados.
 *
 * O texto vira contorno porque o librsvg (que o sharp usa) IGNORA `@font-face`
 * embutido em data URI: com `<text>` no SVG, o card sairia com a fonte da
 * máquina que buildou, e diferente entre o dono e a Cloudflare. Sem `<text>`
 * não há resolução de fonte, e o PNG é o mesmo em qualquer lugar.
 */
import type { Font } from "opentype.js";

export interface Linha {
  texto: string;
  largura: number;
}

const ELIPSE = "…";

const medir = (fonte: Font, texto: string, tamanho: number): number =>
  fonte.getAdvanceWidth(texto, tamanho);

/** Corta caractere a caractere até a palavra com elipse caber na caixa. */
function cortar(fonte: Font, palavra: string, tamanho: number, larguraMax: number): string {
  let corte = palavra;
  while (corte.length > 1 && medir(fonte, corte + ELIPSE, tamanho) > larguraMax) {
    corte = corte.slice(0, -1);
  }
  return corte + ELIPSE;
}

export function quebrar(
  fonte: Font,
  texto: string,
  tamanho: number,
  larguraMax: number,
  maxLinhas: number,
): Linha[] {
  const limpo = texto.trim().replace(/\s+/g, " ");
  if (!limpo) {
    throw new Error("[social] titulo vazio. Card em branco e pior que card nenhum.");
  }

  const linhas: string[] = [];
  let atual = "";

  for (const palavra of limpo.split(" ")) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (medir(fonte, tentativa, tamanho) <= larguraMax) {
      atual = tentativa;
      continue;
    }
    if (atual) linhas.push(atual);
    atual = medir(fonte, palavra, tamanho) > larguraMax
      ? cortar(fonte, palavra, tamanho, larguraMax)
      : palavra;
    if (atual.endsWith(ELIPSE)) {
      linhas.push(atual);
      atual = "";
    }
  }
  if (atual) linhas.push(atual);

  const visiveis = linhas.slice(0, maxLinhas);
  if (linhas.length > maxLinhas) {
    const ultima = visiveis[maxLinhas - 1].replace(/\s+\S*$/, "");
    visiveis[maxLinhas - 1] = (ultima || visiveis[maxLinhas - 1]) + ELIPSE;
  }

  return visiveis.map((t) => ({ texto: t, largura: medir(fonte, t, tamanho) }));
}

export function caminhoDe(
  fonte: Font,
  texto: string,
  x: number,
  y: number,
  tamanho: number,
): string {
  /* 2 casas decimais: o SVG do card cai de ~54KB para ~30KB sem diferença
     visível a 1200×630. */
  return fonte.getPath(texto, x, y, tamanho).toPathData(2);
}
```

- [ ] **Passo 7: rodar e ver passar**

Rodar: `cd web && npm test`
Esperado: PASS.

- [ ] **Passo 8: commitar**

```bash
git add web/package.json web/package-lock.json web/src/social/
git commit -m "feat(social): fonte do card e a matematica de quebra de linha"
```

---

### Task 3: `social/arte.ts` — o SVG

**Files:**
- Create: `web/src/social/arte.ts`
- Test: `web/src/social/arte.test.ts`

**Interfaces:**
- Consumes: `quebrar`, `caminhoDe`, `Linha` (Task 2); `fonteDoCard` (Task 2);
  `ESTILOS` de `web/src/styles/estilos/index.ts` — um `Record<string, MetaEstilo>`
  em que `MetaEstilo` é `{ nome: string; acento: string; origem: string }`.
- Produces: `svgDoCard(site: Site, titulo: string): string`

- [ ] **Passo 1: escrever o teste que falha**

```ts
// web/src/social/arte.test.ts
import { describe, it, expect } from "vitest";
import { svgDoCard } from "./arte";
import type { Site } from "../sites/tipos";

const base: Site = {
  slug: "s", nome: "Blog de Exemplo", dominio: "exemplo.com.br",
  estilo: "linho", modoPadrao: "escuro", blocos: [], muroDeEmail: false,
  emailContato: "c@s.com", responsavel: { nome: "Nome Sobrenome", tipo: "pf" },
};

describe("svgDoCard", () => {
  it("tem a medida que as plataformas esperam", () => {
    const svg = svgDoCard(base, "Titulo");
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
  });

  it("nunca emite tag de texto: e isso que torna o PNG igual em toda maquina", () => {
    expect(svgDoCard(base, "Titulo com acentuacao: cao, e, a")).not.toContain("<text");
  });

  it("desenha o titulo e o rodape como path", () => {
    const svg = svgDoCard(base, "Titulo");
    expect(svg.split("<path").length - 1).toBeGreaterThanOrEqual(2);
  });

  it("o desvio de token do site vence o acento do estilo", () => {
    const desviado: Site = {
      ...base,
      tokens: { escuro: { "--b-acento": "#ff0099" } },
    };
    expect(svgDoCard(desviado, "Titulo")).toContain("#ff0099");
  });

  it("estilo inexistente quebra, em vez de sair sem cor", () => {
    expect(() => svgDoCard({ ...base, estilo: "nao-existe" }, "T")).toThrow(/estilo/i);
  });
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `cd web && npx vitest run src/social/arte.test.ts`
Esperado: FAIL, "Failed to resolve import ./arte".

- [ ] **Passo 3: implementar**

```ts
// web/src/social/arte.ts
/**
 * O desenho do card, em SVG, com o texto já em contorno.
 *
 * O que carrega a identidade aqui é o ACENTO, não a tipografia: ele está
 * disponível em tempo de build (`ESTILOS[estilo].acento`) e o desvio declarado
 * do site vence quando existe, pela mesma ordem que vale na página.
 *
 * Fundo e tinta são constantes por modo, e isso é limitação declarada, não
 * esquecimento: os tokens reais (`--b-fundo`, `--b-tinta`) moram no CSS dos
 * estilos e não são legíveis a partir daqui. Alargar `MetaEstilo` resolve
 * depois, sem mexer em nada disto.
 */
import type { Site } from "../sites/tipos";
import { ESTILOS } from "../styles/estilos";
import { fonteDoCard } from "./fonte";
import { quebrar, caminhoDe } from "./texto";

const LARGURA = 1200;
const ALTURA = 630;
const MARGEM = 80;
const CAIXA = LARGURA - MARGEM * 2;
const TAMANHO_TITULO = 64;
const ENTRELINHA = 82;
const MAX_LINHAS = 3;
const TAMANHO_RODAPE = 28;

const NEUTROS = {
  claro: { fundo: "#f7f5f1", tinta: "#17150f" },
  escuro: { fundo: "#141210", tinta: "#f5f0e8" },
} as const;

/** O acento do estilo, com o desvio declarado do site vencendo. */
function acentoDoSite(site: Site): string {
  const estilo = ESTILOS[site.estilo];
  if (!estilo) {
    throw new Error(
      `[social] estilo "${site.estilo}" nao existe. Os que existem: ` +
        `${Object.keys(ESTILOS).sort().join(", ")}.`,
    );
  }
  return site.tokens?.[site.modoPadrao]?.["--b-acento"] ?? estilo.acento;
}

export function svgDoCard(site: Site, titulo: string): string {
  const acento = acentoDoSite(site);
  const { fundo, tinta } = NEUTROS[site.modoPadrao];
  const fonte = fonteDoCard();

  const linhas = quebrar(fonte, titulo, TAMANHO_TITULO, CAIXA, MAX_LINHAS);
  const alturaTexto = linhas.length * ENTRELINHA;
  const topo = (ALTURA - alturaTexto) / 2 + TAMANHO_TITULO * 0.7;

  const desenho = linhas
    .map((l, i) => {
      const d = caminhoDe(fonte, l.texto, MARGEM, topo + i * ENTRELINHA, TAMANHO_TITULO);
      return `<path d="${d}" fill="${tinta}"/>`;
    })
    .join("");

  const rodape = caminhoDe(
    fonte,
    `${site.dominio} · ${site.nome}`,
    MARGEM,
    ALTURA - MARGEM + 12,
    TAMANHO_RODAPE,
  );

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LARGURA}" height="${ALTURA}" ` +
    `viewBox="0 0 ${LARGURA} ${ALTURA}">` +
    `<rect width="${LARGURA}" height="${ALTURA}" fill="${fundo}"/>` +
    `<rect width="${LARGURA}" height="12" fill="${acento}"/>` +
    desenho +
    `<path d="${rodape}" fill="${acento}"/>` +
    `</svg>`
  );
}
```

- [ ] **Passo 4: rodar e ver passar**

Rodar: `cd web && npm test`
Esperado: PASS.

- [ ] **Passo 5: commitar**

```bash
git add web/src/social/arte.ts web/src/social/arte.test.ts
git commit -m "feat(social): o desenho do card, com o acento do estilo e sem texto"
```

---

### Task 4: o endpoint que emite o PNG

**Files:**
- Create: `web/src/pages/social/[peca].png.ts`

**Interfaces:**
- Consumes: `svgDoCard` (Task 3); `siteInstitucional()` de
  `web/src/institucional/dados.ts`; `ARTIGOS` de `web/src/mock/artigos.ts`.
- Produces: as rotas `/social/padrao.png` e `/social/<slug>.png`.

- [ ] **Passo 1: conferir os campos reais de `ARTIGOS`**

Rodar: `cd web && grep -n "slug\|titulo" src/mock/artigos.ts | head -20`
Esperado: confirmar que cada artigo tem `slug` e `titulo`. Se os nomes forem
outros, usar os reais no `getStaticPaths` do passo seguinte — e só nele.

- [ ] **Passo 2: escrever o endpoint**

```ts
// web/src/pages/social/[peca].png.ts
/**
 * O card social de cada peça, assado no build.
 *
 * A JUNTA é o `getStaticPaths`: hoje ele lê os artigos de `mock/artigos.ts`,
 * exatamente como `pages/[artigo].astro`, e é só isso que muda quando a
 * renderização a partir de markdown chegar. A rota não muda.
 *
 * `padrao` é o card das institucionais e leva o NOME DO SITE como título — não
 * uma frase inventada, porque o nome é o que a home de fato afirma.
 */
import type { APIRoute } from "astro";
import sharp from "sharp";
import { siteInstitucional } from "../../institucional/dados";
import { ARTIGOS } from "../../mock/artigos";
import { svgDoCard } from "../../social/arte";

export function getStaticPaths() {
  const site = siteInstitucional();
  return [
    { params: { peca: "padrao" }, props: { titulo: site.nome } },
    ...ARTIGOS.map((a) => ({ params: { peca: a.slug }, props: { titulo: a.titulo } })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const svg = svgDoCard(siteInstitucional(), (props as { titulo: string }).titulo);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
```

- [ ] **Passo 3: buildar e conferir que os PNGs saíram**

```bash
cd web && npm run build && ls -la dist/social/
```
Esperado: `padrao.png` mais um arquivo por artigo, cada um com algumas dezenas
de KB.

Se o build falhar ao ler a fonte, trocar o corpo de `fonteDoCard` por
`readFileSync(path.join(process.cwd(), "src/social/Inter-Bold.ttf"))` e
registrar o motivo no comentário do módulo.

- [ ] **Passo 4: olhar um card com o olho**

Rodar: `cd web && cp dist/social/padrao.png /tmp/card-padrao.png`
Esperado: 1200×630, faixa de acento no topo, título centrado verticalmente,
rodapé com domínio e nome do site. Acentuação desenhada corretamente.

- [ ] **Passo 5: commitar**

```bash
git add "web/src/pages/social/[peca].png.ts"
git commit -m "feat(social): endpoint que assa o card de cada peca no build"
```

---

### Task 5: o `<head>` — canonical, OG e o favicon do participante

**Files:**
- Modify: `web/src/sites/tipos.ts`, `web/src/layouts/Base.astro`,
  `web/src/layouts/Artigo.astro`, `web/src/layouts/Institucional.astro`,
  `web/src/pages/[artigo].astro`, `web/src/sites/exemplo.ts`

**Interfaces:**
- Consumes: `urlAbsoluta` (Task 1); as rotas de card (Task 4).
- Produces: `Site.icone?: string`; props novas em `Base`, `Artigo` e
  `Institucional`: `tipo?: "website" | "article"` e `imagemCard?: string`.

- [ ] **Passo 1: acrescentar `icone` ao tipo**

Em `web/src/sites/tipos.ts`, dentro de `interface Site`, depois de `adsenseId`:

```ts
  /**
   * O emoji do favicon. Ausente, NENHUMA tag de icone sai — em vez de
   * carimbar a marca do template na aba do leitor de outra pessoa. O tijolo
   * do chassi vale so onde nao ha site: bancada e vitrine de estilo.
   */
  icone?: string;
```

E em `web/src/sites/exemplo.ts`, junto dos outros campos, comentado:

```ts
  // O emoji da aba. Sem ele, o site nasce sem favicon — e isso e melhor que
  // herdar o tijolo do chassi.
  // icone: "📡",
```

- [ ] **Passo 2: props novas no `Base.astro`**

Em `web/src/layouts/Base.astro`, acrescentar ao `interface Props`:

```ts
  /** Artigo ou pagina. Decide o og:type. */
  tipo?: "website" | "article";
  /** Caminho do card desta pagina. O padrao serve as institucionais. */
  imagemCard?: string;
```

Trocar a linha do destructuring por:

```ts
const {
  titulo, descricao, lang = LANG_HTML, noindex = false, site,
  tipo = "website", imagemCard = "/social/padrao.png",
} = Astro.props;
const url = site ? urlAbsoluta(site, Astro.url.pathname) : null;
```

E acrescentar no topo do frontmatter: `import { urlAbsoluta } from "../url";`

- [ ] **Passo 3: o `<head>` propriamente**

Substituir o `<link rel="icon">` de hoje pelo bloco abaixo, colocado logo
depois da linha do `noindex`:

```astro
    {/* Canonical e OG so existem quando ha site: a bancada e a vitrine de
        estilo nao sao site, nao tem dominio, e nao se anunciam. Em pagina
        noindex tambem nao sai nada — pagina de servico nao se anuncia. */}
    {url && !noindex && (
      <>
        <link rel="canonical" href={url} />
        <meta property="og:type" content={tipo} />
        <meta property="og:title" content={titulo} />
        {descricao && <meta property="og:description" content={descricao} />}
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={site!.nome} />
        <meta property="og:image" content={urlAbsoluta(site!, imagemCard)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </>
    )}
    {site?.icone && (
      <link rel="icon" href={iconeEmoji(site.icone)} />
    )}
    {!site && <link rel="icon" href={iconeEmoji("🧱")} />}
```

E no frontmatter, a função que monta o data URI uma vez só:

```ts
const iconeEmoji = (e: string) =>
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>` +
  `<text y='14' font-size='14'>${e}</text></svg>`;
```

- [ ] **Passo 4: repassar as props nos dois layouts**

Em `web/src/layouts/Artigo.astro` e `web/src/layouts/Institucional.astro`:
acrescentar `tipo?: "website" | "article"` e `imagemCard?: string` ao
`interface Props`, incluí-los no destructuring de `Astro.props`, e repassá-los
na tag `<Base ...>` como `tipo={tipo} imagemCard={imagemCard}`.

- [ ] **Passo 5: o artigo aponta para o card dele**

Em `web/src/pages/[artigo].astro`, na chamada do layout `Artigo`, acrescentar
as duas props, usando o nome de campo confirmado na Task 4, passo 1:

```astro
  tipo="article"
  imagemCard={`/social/${artigo.slug}.png`}
```

- [ ] **Passo 6: buildar e conferir o HTML**

```bash
cd web && npm run build
grep -o 'og:[a-z:_]*' dist/index.html | sort -u
grep -c 'og:' dist/bancada/index.html
```
Esperado: a home lista `og:type`, `og:title`, `og:url`, `og:site_name`,
`og:image`, `og:image:width`, `og:image:height`; a bancada devolve `0`.

- [ ] **Passo 7: rodar a bateria inteira**

Rodar: `cd web && npm test && npm run check && npm run build`
Esperado: os três verdes.

- [ ] **Passo 8: commitar**

```bash
git add web/src/sites/tipos.ts web/src/sites/exemplo.ts \
  web/src/layouts/Base.astro web/src/layouts/Artigo.astro \
  web/src/layouts/Institucional.astro "web/src/pages/[artigo].astro"
git commit -m "feat(head): canonical, OG e o favicon que e do participante"
```

---

## Auto-revisão

**Cobertura do spec:** `url.ts` → Task 1. `<head>` e favicon → Task 5.
`social/{fonte,texto,arte}.ts` e o endpoint → Tasks 2, 3, 4. Os testes 1 a 3 da
lista do spec → Tasks 1, 2, 3. O teste 4 (`imagens.test.ts`) pertence ao plano
`2026-09-05-imagem-otimizada.md`.

**Consistência de tipos:** `Linha` é definida na Task 2 e consumida na Task 3;
`quebrar` e `caminhoDe` mantêm a mesma assinatura nos dois lugares;
`svgDoCard(site, titulo)` é definida na Task 3 e chamada nessa ordem na Task 4;
`urlAbsoluta(site, caminho)` é definida na Task 1 e chamada nessa ordem na
Task 5.

**Risco conhecido:** `new URL("./Inter-Bold.ttf", import.meta.url)` depende de
o Vite manter `import.meta.url` apontando para a fonte durante o build SSR do
Astro. A Task 4, passo 3, é o que detecta isso, e traz a troca a fazer se
falhar.
