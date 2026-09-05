# Imagem otimizada no bloco 19 — plano de implementação

> **Para executores agênticos:** SUB-SKILL OBRIGATÓRIA: use
> superpowers:subagent-driven-development (recomendado) ou
> superpowers:executing-plans para executar tarefa a tarefa. Os passos usam
> caixa (`- [ ]`) para acompanhamento.

**Goal:** a figura do bloco 19 passa a sair otimizada, em formato moderno e com
`srcset`, e duas mentiras possíveis passam a quebrar a build: `src` que não
existe e `largura`/`altura` que não batem com o arquivo.

**Architecture:** um acervo em `web/src/imagens/` é varrido por
`import.meta.glob`, o que resolve a string que o bloco recebe para o
`ImageMetadata` do Astro; `getImage()` de `astro:assets` produz `srcset` e
`sizes`. A API do bloco não muda — `src` continua string —, só passa a
significar "caminho dentro do acervo" em vez de caminho livre.

**Tech Stack:** Astro 7.3.1 (`astro:assets`, que já traz sharp), TypeScript 6,
Vitest 3.

**Spec:** `docs/specs/2026-09-05-card-social-e-imagem-design.md`

## Global Constraints

- Português em tudo: doutrina, comentário, nome de arquivo e de variável.
- Este plano é independente do plano do card social. Os dois podem rodar em
  qualquer ordem, e nenhum importa nada do outro.
- **O caminho precisa ser exercitado.** Nenhum mock passa `src` hoje: toda
  figura está no estado de marcador. Sem uma imagem de verdade no acervo e uma
  figura do mock ligada nela, o módulo nasce como código morto — a mesma razão
  pela qual `nenhum` é o adaptador padrão de toda porta no chassi.
- O bloco 19 continua aceitando figura **sem** `src`: marcador é estado de
  prévia, não erro. Só `src` presente e inválido quebra.
- Rodar `cd web && npm test && npm run build` antes de cada commit.

---

### Task 1: `imagens.ts` — o acervo e as duas travas

**Files:**
- Create: `web/src/imagens.ts`, `web/src/imagens.test.ts`
- Create: `web/src/imagens/exemplo/medicao.png` (imagem real, ver passo 1)

**Interfaces:**
- Consumes: `getImage` de `astro:assets`.
- Produces:
  - `interface FiguraOtimizada { src: string; srcset: string; sizes: string; largura: number; altura: number }`
  - `otimizar(src: string, largura?: number, altura?: number): Promise<FiguraOtimizada>`

- [ ] **Passo 1: pôr uma imagem de verdade no acervo**

A imagem tem de ser raster, com dimensão conhecida, e servir de prova plausível
num artigo. Gere uma localmente para não depender de download:

```bash
cd web
mkdir -p src/imagens/exemplo
node -e '
const sharp = require("sharp");
const svg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540">` +
  `<rect width="960" height="540" fill="#e9e4da"/>` +
  `<rect x="60" y="380" width="120" height="100" fill="#c8622a"/>` +
  `<rect x="220" y="300" width="120" height="180" fill="#c8622a"/>` +
  `<rect x="380" y="180" width="120" height="300" fill="#c8622a"/>` +
  `<rect x="60" y="480" width="840" height="4" fill="#615a4e"/>` +
  `</svg>`
);
sharp(svg).png().toFile("src/imagens/exemplo/medicao.png").then(i =>
  console.log(i.width + "x" + i.height, i.size, "bytes"));
'
```
Esperado: `960x540`.

- [ ] **Passo 2: escrever o teste que falha**

```ts
// web/src/imagens.test.ts
import { describe, it, expect } from "vitest";
import { otimizar } from "./imagens";

describe("otimizar", () => {
  it("resolve o caminho do acervo e devolve srcset", async () => {
    const f = await otimizar("exemplo/medicao.png");
    expect(f.largura).toBe(960);
    expect(f.altura).toBe(540);
    expect(f.srcset.length).toBeGreaterThan(0);
    expect(f.sizes.length).toBeGreaterThan(0);
  });

  it("src fora do acervo quebra, com o caminho na mensagem", async () => {
    await expect(otimizar("nao/existe.png")).rejects.toThrow(/nao\/existe\.png/);
  });

  it("a mensagem diz onde o acervo mora, porque o erro tem de dar o proximo passo", async () => {
    await expect(otimizar("nao/existe.png")).rejects.toThrow(/src\/imagens/);
  });

  it("largura declarada divergente do arquivo quebra", async () => {
    await expect(otimizar("exemplo/medicao.png", 1024)).rejects.toThrow(/largura/i);
  });

  it("altura declarada divergente do arquivo quebra", async () => {
    await expect(otimizar("exemplo/medicao.png", 960, 480)).rejects.toThrow(/altura/i);
  });

  it("largura e altura corretas passam", async () => {
    const f = await otimizar("exemplo/medicao.png", 960, 540);
    expect(f.largura).toBe(960);
  });
});
```

- [ ] **Passo 3: rodar e ver falhar**

Rodar: `cd web && npx vitest run src/imagens.test.ts`
Esperado: FAIL, "Failed to resolve import ./imagens".

- [ ] **Passo 4: implementar**

```ts
// web/src/imagens.ts
/**
 * O acervo de imagens do site, e as duas travas que ele traz junto.
 *
 * A API do bloco 19 não muda: `src` continua string. O que muda é o
 * significado — passa a ser o caminho DENTRO de `src/imagens/`, e não um
 * caminho livre. Essa é a troca que permite `astro:assets` entrar sem que o
 * autor tenha de importar cada arquivo à mão.
 *
 * As duas travas existem pela mesma razão do `alt` igual à legenda quebrar a
 * build: são erros que ninguém revisa e que só aparecem em produção.
 *
 *   src que nao resolve  →  imagem quebrada na pagina publicada, em silencio
 *   largura declarada errada  →  o CLS que a largura existia para evitar
 *
 * `largura` e `altura` deixam de ser declaração de fé: o metadado do arquivo
 * tem as reais, e divergir passa a ser falha de build.
 */
import { getImage } from "astro:assets";

export interface FiguraOtimizada {
  src: string;
  srcset: string;
  sizes: string;
  largura: number;
  altura: number;
}

/** A varredura é eager porque o metadado é o que interessa, e ele é pequeno. */
const ACERVO = import.meta.glob<{ default: ImageMetadata }>(
  "/src/imagens/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true },
);

const RAIZ = "/src/imagens/";

const erro = (m: string) => {
  throw new Error(`[imagens] ${m}`);
};

export async function otimizar(
  src: string,
  largura?: number,
  altura?: number,
): Promise<FiguraOtimizada> {
  const chave = `${RAIZ}${src}`;
  const modulo = ACERVO[chave];

  if (!modulo) {
    const existentes = Object.keys(ACERVO)
      .map((k) => k.slice(RAIZ.length))
      .sort();
    erro(
      `"${src}" nao existe no acervo. As imagens moram em web/src/imagens/, e ` +
        `o src e o caminho a partir dali. Hoje existem: ` +
        `${existentes.length ? existentes.join(", ") : "(nenhuma)"}.`,
    );
  }

  const original = modulo!.default;

  if (largura !== undefined && largura !== original.width) {
    erro(
      `"${src}": largura declarada ${largura}, arquivo tem ${original.width}. ` +
        `Largura errada e o CLS que ela existia para evitar — apague a ` +
        `declaracao e deixe o arquivo responder.`,
    );
  }
  if (altura !== undefined && altura !== original.height) {
    erro(
      `"${src}": altura declarada ${altura}, arquivo tem ${original.height}.`,
    );
  }

  const larguras = [480, 768, 1024, 1440].filter((l) => l <= original.width);
  if (!larguras.includes(original.width)) larguras.push(original.width);

  const otimizada = await getImage({
    src: original,
    format: "webp",
    widths: larguras,
    sizes: "(max-width: 768px) 100vw, 768px",
  });

  return {
    src: otimizada.src,
    srcset: otimizada.srcSet.attribute,
    sizes: "(max-width: 768px) 100vw, 768px",
    largura: original.width,
    altura: original.height,
  };
}
```

- [ ] **Passo 5: rodar e ver passar**

Rodar: `cd web && npm test`
Esperado: PASS.

Se o Vitest não resolver `astro:assets` fora do build do Astro, criar
`web/vitest.config.ts` com o plugin do Astro:

```ts
import { getViteConfig } from "astro/config";
export default getViteConfig({ test: {} });
```

e rodar de novo. Registrar no arquivo o motivo de ele existir.

- [ ] **Passo 6: commitar**

```bash
git add web/src/imagens.ts web/src/imagens.test.ts web/src/imagens/ web/vitest.config.ts
git commit -m "feat(imagens): acervo varrido, com src inexistente e medida errada quebrando a build"
```

---

### Task 2: ligar o bloco 19 e exercitar o caminho

**Files:**
- Modify: `web/src/components/blocos/Figura.astro`
- Modify: `web/src/mock/artigos.ts` (uma figura passa a apontar para o acervo)

**Interfaces:**
- Consumes: `otimizar`, `FiguraOtimizada` (Task 1).
- Produces: nada novo — a `interface Props` do bloco 19 permanece igual.

- [ ] **Passo 1: usar o acervo no bloco**

Em `web/src/components/blocos/Figura.astro`, depois das travas de `alt` e
`legenda` que já existem, e antes do markup:

```ts
import { otimizar, type FiguraOtimizada } from "../../imagens";

/* Figura sem `src` continua saindo como marcador: prévia é estado legítimo,
   e o autor ainda vai produzir a imagem. O que não é legítimo é `src`
   apontando para o que não existe — isso vira imagem quebrada na página. */
const imagem: FiguraOtimizada | null = src ? await otimizar(src, largura, altura) : null;
```

E na tag `<img>` do bloco, trocar os atributos de origem e medida por:

```astro
    <img
      src={imagem!.src}
      srcset={imagem!.srcset}
      sizes={imagem!.sizes}
      width={imagem!.largura}
      height={imagem!.altura}
      alt={alt}
      loading={prioridade ? "eager" : "lazy"}
      fetchpriority={prioridade ? "high" : undefined}
      decoding="async"
    />
```

mantendo exatamente as classes e a estrutura de `<figure>`/`<figcaption>` que
já estão lá. O SVG inline pelo slot não muda em nada.

- [ ] **Passo 2: ligar uma figura do mock ao acervo**

Em `web/src/mock/artigos.ts`, achar a primeira figura de papel `prova` (busque
por `satisfies CamposFigura`) e trocar o estado de marcador por uma figura de
verdade, preservando os campos de legenda e fonte que já existirem:

```ts
{
  papel: "prova",
  src: "exemplo/medicao.png",
  alt: "Gráfico de barras com quatro medições crescentes de sinal por cômodo",
  legenda: "Sinal medido em quatro pontos da casa, do mais distante ao mais próximo do roteador.",
  fonte: "Medição própria, 2026-08-14",
} satisfies CamposFigura,
```

Apagar o campo `pendencia` dessa figura, que era o que a marcava como prévia,
e apagar `largura`/`altura` se estiverem declarados — o arquivo responde por
eles agora.

- [ ] **Passo 3: buildar e conferir que a imagem foi processada**

```bash
cd web && npm run build && ls dist/_astro/ | grep -i medicao
```
Esperado: pelo menos um arquivo derivado (`.webp`), e não a cópia do PNG
original.

- [ ] **Passo 4: conferir o HTML da figura**

Rodar: `cd web && grep -o 'srcset="[^"]\{0,80\}' dist/artigo-1/index.html | head -2`
Esperado: um `srcset` com mais de uma largura.

- [ ] **Passo 5: provar que a trava morde**

Trocar temporariamente o `src` do mock para `"exemplo/nao-existe.png"` e rodar
`cd web && npm run build`.
Esperado: build FALHA com `[imagens] "exemplo/nao-existe.png" nao existe no
acervo`, listando as imagens que existem. Desfazer a troca em seguida.

- [ ] **Passo 6: rodar a bateria inteira**

Rodar: `cd web && npm test && npm run check && npm run build`
Esperado: os três verdes.

- [ ] **Passo 7: commitar**

```bash
git add web/src/components/blocos/Figura.astro web/src/mock/artigos.ts
git commit -m "feat(bloco-figura): imagem sai do acervo, otimizada e com srcset"
```

---

## Auto-revisão

**Cobertura do spec:** a seção 4 do spec (`web/src/imagens.ts` e o bloco 19)
está inteira nas duas tarefas. O teste 4 da lista do spec — `src` fora do
acervo, largura divergente, `srcset` não vazio — está na Task 1, passo 2. A
exigência do spec de que o caminho seja exercitado por todo mundo está na Task
1 (imagem real) e na Task 2 (figura do mock ligada nela).

**Consistência de tipos:** `FiguraOtimizada` é definida na Task 1 com
`src`, `srcset`, `sizes`, `largura`, `altura`, e é consumida na Task 2 com
exatamente esses cinco campos. `otimizar(src, largura?, altura?)` é chamada na
Task 2 com essa ordem de argumentos.

**Riscos conhecidos:**

1. `astro:assets` pode não resolver dentro do Vitest sem o plugin do Astro. A
   Task 1, passo 5, traz o `vitest.config.ts` a criar se isso acontecer — e é
   o primeiro `vitest.config.ts` do repositório, hoje inexistente.
2. `src` do bloco 19 muda de significado. Custo zero hoje, porque nenhum
   consumidor passa `src`; se um dia passar, a mensagem de erro aponta o
   arquivo e lista o acervo.
