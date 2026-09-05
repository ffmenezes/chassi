# Card social e imagem otimizada

**Data:** 2026-09-05
**Estado:** desenho aprovado, implementação não iniciada
**Origem:** análise do vídeo "Astro vs. WordPress" (Promovaweb) contra a
arquitetura do chassi. Dos quatro aditivos levantados, este spec cobre os dois
que não dependem do encanamento `post.md → blocos`: o card social e a
otimização de imagem. Os outros dois — dados com validade, e link interno
validado contra o `CLUSTER.md` — ficam para specs próprios.

## O problema, com a evidência

1. `web/src/layouts/Base.astro` emite quatro `<meta>`: charset, viewport,
   description e robots. **Nenhuma `og:`, nenhuma `twitter:`, nenhum
   `canonical`.** O bloco 26 (Compartilhar) está *ativo* desde `8c36dff`: o
   chassi convida o leitor a compartilhar e entrega um card em branco.
2. O favicon está fixo no layout — `🧱` em data URI. **Todo site publicado a
   partir do chassi sai com o tijolinho do chassi na aba do leitor.**
3. `astro.config.mjs` não declara `site:`, e nada no repositório sabe montar
   uma URL absoluta. `og:url` e `og:image` exigem uma.
4. O bloco 19 aceita `src?: string` com `largura`/`altura` declarados à mão, e
   não existe pipeline de imagem: nem `astro:assets`, nem `sharp` no caminho de
   render. Nenhum mock passa `src` hoje — toda figura está no estado de
   marcador —, e não existem `web/src/imagens/` nem `web/public/`.

## O que está fora deste spec

- Dados com validade (`sites/<slug>/dados/*.json`) e link interno validado.
- Qualquer mudança em bloco existente que não seja o 19.
- Qualquer coisa que exija conta, chave ou serviço de terceiro. O card se
  gera na máquina que builda, como tudo mais no chassi.

## Decisões, e o que as sustenta

### O card é gerado no build, uma peça por página

Card único por site é o que a maioria dos blogs pequenos faz, e é o que faz
todo artigo compartilhado parecer o mesmo link. Gerar por peça custa um
gerador que já teremos de escrever de qualquer jeito.

### O texto vira `<path>`, não fonte

**Spike executado em 2026-09-05.** `sharp` (0.35.4, libvips 8.18.6) rasteriza
SVG com texto, mas usa a fonte **do sistema**: um `@font-face` com a fonte
embutida em data URI foi **ignorado** pelo librsvg — o teste embutiu uma
serifada e a saída veio em sans. Consequência: com sharp puro, o card sairia
diferente na máquina do dono e no build da Cloudflare.

A saída escolhida é converter os glifos em contorno com **opentype.js** (JS
puro, MIT) e entregar ao sharp um SVG que **não tem texto** — só `<path>`.
Não existe resolução de fonte na rasterização, então o PNG é igual em qualquer
máquina. A alternativa (`@resvg/resvg-js`, que aceita `fontBuffers`) foi
recusada por acrescentar um segundo binário nativo com prebuild por
plataforma, incluindo o participante de Windows.

### O card não usa "a fonte do site", porque o site não tem uma

Os cinco estilos declaram **pilha de sistema** (`ui-sans-serif`, `system-ui`,
com `Inter` ou `Copernicus` só se a máquina do leitor tiver). O chassi não
embute webfont nenhuma. Logo a tipografia do site já não é determinística, e
qualquer fonte que o card embuta é a fonte **do card**. Isso fica declarado no
código em vez de disfarçado: **uma fonte, um peso.**

### O que carrega a identidade no card é o acento, não a tipografia

`ESTILOS[estilo].acento` está disponível em tempo de build (`MetaEstilo`), e o
desvio declarado do site (`site.tokens[modo]["--b-acento"]`) vence quando
existe. Fundo e tinta **não** são legíveis a partir do TypeScript — moram no
CSS dos estilos —, então saem de duas constantes por modo, declaradas no
`arte.ts` com esse motivo escrito. Ler os tokens reais exigiria alargar
`MetaEstilo`, e isso é refinamento posterior, não requisito.

## Os módulos

### 1. `web/src/url.ts` — a junta que falta

```ts
export function urlAbsoluta(site: Site, caminho: string): string;
```

Devolve `https://<dominio><caminho>`. O domínio sai de
`web/src/sites/<slug>.ts` e daqui só — a mesma doutrina de
`institucional/dados.ts`, que é o que faz o participante nunca abrir uma
página jurídica.

Quebra a build (mensagem prefixada com `[url]`) quando:

- `dominio` vazio, com espaço, com esquema (`http://`, `https://`) ou com
  barra final. `og:url` relativo é card que não abre, e é melhor falhar no
  build do que descobrir no WhatsApp.
- `caminho` não começa com `/`. A chamada é nossa; caminho torto é bug nosso.

A barra final que `build.format: "directory"` produz é preservada como está.

### 2. `web/src/layouts/Base.astro` — o `<head>`

Props novas, ambas opcionais: `tipo?: "website" | "article"` (padrão
`"website"`) e `imagemCard?: string` (padrão `/social/padrao.png`).

Emite, **apenas quando `site` existe**:

- `<link rel="canonical">` com `urlAbsoluta(site, Astro.url.pathname)`.
- `og:title`, `og:description`, `og:url`, `og:site_name`, `og:type`,
  `og:image` (absoluta), `og:image:width`/`height` (1200/630),
  `twitter:card=summary_large_image`.

Em página `noindex`, **nenhuma tag de OG sai**: página de serviço não se
anuncia. O `canonical` também não.

Favicon: `Site` ganha `icone?: string` — um emoji. Presente, sai no mesmo data
URI de hoje. **Ausente, nenhuma tag de ícone sai.** O tijolinho `🧱` passa a
valer só quando `site` é ausente — bancada e vitrine de estilo, que são a
vitrine do chassi. O chassi carimba a própria vitrine e nunca o site do
participante.

### 3. `web/src/social/` — o gerador

| Arquivo | Responsabilidade | Puro? |
|---|---|---|
| `fonte.ts` | Lê e memoiza o TTF com `opentype.parse`. | não (I/O) |
| `texto.ts` | Mede, quebra em linhas, elipsa, e devolve o `d` do `<path>`. | sim |
| `arte.ts` | `(site, titulo) → string` SVG de 1200×630, texto já em path. | sim |
| `pages/social/[peca].png.ts` | `getStaticPaths` + `sharp(svg).png()`. | não |

`texto.ts` é onde mora a matemática e onde ficam os testes:

```ts
export interface Linha { texto: string; largura: number }
export function quebrar(
  fonte: Font, texto: string, tamanho: number,
  larguraMax: number, maxLinhas: number,
): Linha[];
export function caminhoDe(
  fonte: Font, texto: string, x: number, y: number, tamanho: number,
): string;
```

`quebrar` decide as linhas; `caminhoDe` desenha **uma** linha. Quem compõe é
o `arte.ts`, chamando `caminhoDe` por linha com o `y` avançando pela entrelinha
— assim a medida e o desenho ficam testáveis separados.

Regras: quebra por palavra; palavra que sozinha estoura a largura é cortada
com `…`; ao passar de `maxLinhas`, a última linha termina em `…`; título vazio
é erro, não card em branco.

Peças enumeradas pelo `getStaticPaths`: `padrao` mais uma por artigo. O
`padrao` é o card das institucionais e leva `site.nome` como título — não uma
frase inventada, porque o nome do site é o que a home de fato afirma. Os
artigos vêm da **mesma junta** que `[artigo].astro` usa hoje
(`mock/artigos.ts`) e que troca para a coleção de markdown depois — sem tocar
neste arquivo, pela mesma promessa que já está escrita lá.

A fonte: **Inter Bold**, TTF estático, licença OFL, um arquivo, um peso, com a
licença junto no diretório.

### 4. `web/src/imagens.ts` e o bloco 19

A API do bloco não muda: `src` continua string. O que muda é o significado —
`src` passa a ser o caminho dentro do acervo `web/src/imagens/`, e não um
caminho livre.

```ts
export interface FiguraOtimizada {
  src: string; srcset: string; sizes: string; largura: number; altura: number;
}
export async function otimizar(
  src: string, largura?: number, altura?: number,
): Promise<FiguraOtimizada>;
```

Um `import.meta.glob` eager sobre `/src/imagens/**/*.{png,jpg,jpeg,webp,avif}`
resolve a string para `ImageMetadata`, e `getImage()` devolve `srcset` e
`sizes` em formato moderno.

Duas travas novas, na mesma régua do `alt` igual à legenda:

- **`src` que não resolve no acervo quebra a build.** Hoje viraria imagem
  quebrada em produção, em silêncio.
- **`largura`/`altura` divergentes do arquivo quebram a build.** Elas deixam
  de ser declaração de fé: o metadado tem as reais.

SVG inline pelo slot continua exatamente como está. Figura sem `src` continua
saindo como marcador — é estado de prévia, não erro.

**O caminho precisa ser exercitado.** Nenhum mock passa `src` hoje. Junto com
o módulo entra **uma imagem raster de verdade** no acervo e **uma figura do
mock ligada a ela**, para que `npm run build` de todo mundo passe pelo
pipeline em vez de deixá-lo como código morto — a mesma razão pela qual
`nenhum` é o adaptador padrão de toda porta.

## Testes

Antes do código, e nesta ordem:

1. `url.test.ts` — domínio com esquema, com barra final, vazio e com espaço
   quebram; caminho sem barra inicial quebra; raiz devolve `https://d/`.
2. `social/texto.test.ts` — quebra por palavra; acento não conta como dois
   caracteres na medida; palavra única maior que a caixa é cortada com `…`;
   estouro de `maxLinhas` elipsa a última; título vazio é erro.
3. `social/arte.test.ts` — o SVG não contém `<text`; contém o acento do estilo;
   o desvio de token do site vence o acento do estilo; 1200×630.
4. `imagens.test.ts` — `src` fora do acervo quebra com o caminho na mensagem;
   `largura` divergente quebra; acerto devolve `srcset` não vazio.

O endpoint e o `Base.astro` são verificados pelo `npm run build`, que é o que
de fato os executa.

## Riscos aceitos

- **~300KB de fonte no repositório.** É o preço do card determinístico. Um
  arquivo, um peso, licença junto.
- **`src` do bloco 19 muda de significado** (caminho livre → caminho no
  acervo). Custo zero hoje, porque nenhum consumidor passa `src`; se um dia
  passar, a build aponta o arquivo.
- **Fundo e tinta do card são constantes, não tokens.** Um site que desvie
  muito o fundo terá card com fundo do estilo, não do site. Aceito no v0;
  alargar `MetaEstilo` resolve depois, sem mexer em nada disto.

## Fora de escopo, deliberadamente

Não entra `site:` no `astro.config.mjs`. O domínio é do participante e mora no
arquivo dele; a configuração do Astro é do upstream. Misturar os dois é criar
conflito onde o desenho do repositório existe para não ter nenhum.
