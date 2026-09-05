# chassi

Esqueleto de blog de nicho: Astro estático, 30 blocos, 5 estilos, páginas
institucionais. Escrito em português — doutrina, comentários, nomes de arquivo
e de variável. Mantenha assim.

## A fronteira

Você edita: `web/src/sites/<slug>.ts`, `web/src/meu/**`, `sites/**`, e as três
páginas de identidade `web/src/pages/{index,sobre,contato}.astro` (nascem em
branco, com roteiro embutido — a partir do clone são suas, para sempre).

O upstream edita: todo o resto, inclusive as quatro páginas jurídicas
(`privacidade`, `cookies`, `termos`, `direitos-autorais`) — alimentadas por
configuração, texto igual para todo mundo, você nunca as abre, e é por isso
que continuam recebendo correção nossa para sempre, sem conflito.

O acervo `web/src/imagens/` é do upstream hoje, e o que mora nele é a imagem de
exemplo. Onde ficam as imagens do participante é pergunta em aberto: ela se
decide quando chegar o pipeline de `post.md → blocos`, que ainda não existe —
e sem ele ninguém publica figura própria de qualquer jeito.

Cara própria sai de **até 6 tokens** em `web/src/sites/<slug>.ts`, nunca de
editar um `.astro`. É essa regra que faz `scripts/atualizar` nunca conflitar:
no minuto em que você editar um bloco `.astro`, aquele arquivo para de receber
correção nossa.

**Nunca rode `git merge upstream/main`.** As fronteiras deste repositório
foram desenhadas para puxada arquivo por arquivo (`git checkout upstream/main
-- <caminho>`); merge traz de volta o conflito que o desenho evita.

## Estrutura

```
AGENTS.md                              arquivo real
CLAUDE.md               → symlink →    AGENTS.md
.agents/skills/atualizar-template/     arquivos reais
.claude/skills          → symlink →    ../.agents/skills
LICENSE                                MIT
README.md
scripts/instalar                       roda uma vez, após o clone
scripts/atualizar                      puxada por arquivo, nunca merge
web/src/sites/<slug>.ts                ← o site do participante (só este)
web/src/sites/index.ts                 ← varre e valida. Nunca editado à mão.
web/src/sites/exemplo.ts               ← o modelo. Único arquivo do upstream que se apaga
web/src/api/contrato.ts                ← a porta de transporte: caminhos + tipos
web/src/url.ts                         ← URL absoluta a partir do domínio do site. Só formatação
web/src/social/                        ← o card social: fonte, quebra de linha, SVG e tags de <head>
web/src/imagens/                       ← o acervo: o `src` do bloco 19 é o caminho a partir daqui
web/src/{components,layouts,styles,mock,pages}/
web/src/meu/                           ← estilo próprio, blocos próprios. Upstream nunca escreve
web/functions/{api,_lib}/              ← Pages Functions: adaptador fino + lógica pura em _lib
web/worker/                            ← adaptadores de runtime Worker, inertes
sites/_modelo/{base,estado,pautas,pesquisa,posts}/
```

`sites/_modelo/base/*.md` não nasce vazio nem preenchido: cada arquivo é o
roteiro de perguntas que ele responde. É o que substitui uma skill de conteúdo
neste repositório público.

## As três camadas de token

```css
@layer contrato, estilo, modo, site;

[data-estilo]              forma e tipografia. Nenhuma cor.
[data-estilo][data-modo]   cor. Nenhuma medida.
[data-site][data-modo]     desvio declarado do site (até 6 tokens). Vence sempre.
```

A ordem vem de `@layer`, não de especificidade — é isso que evita a armadilha
de `[data-site]` sozinho (especificidade 0,1,0) perder para
`[data-estilo][data-modo]` (0,2,0). Todo bloco fala só `--b-*`; nenhum
componente conhece cor, fonte ou medida literal.

## Validações que quebram a build (não são avisos)

- **slug repetido** — um slug, um arquivo, um site.
- **estilo inexistente** — o site declara um `estilo` que não existe em
  `web/src/styles/estilos/`.
- **troca de família tipográfica** — `--b-fonte-titulo`, `--b-fonte-corpo` e
  `--b-fonte-meta` não entram no desvio de site. Isso não é personalização, é
  estilo novo se escondendo dentro de outro.
- **`TETO_DE_DESVIO = 6`** — mais de 6 tokens sobrescritos por site não é
  desvio, é estilo novo usando o de baixo como atalho.
- **`dominio` do site** — vazio, com esquema (`https://`), com barra final ou
  com espaço. Só o host (`exemplo.com.br`): é dele que saem `canonical`,
  `og:url` e `og:image`, e link relativo é card que não abre.
- **Card social** — título vazio. Card em branco circula igual a card cheio, e
  é pior que card nenhum.
- **Figura (bloco 19)** — `alt` vazio, `alt` igual à legenda, prova ou
  diagrama sem legenda ou sem fonte e data, `src` que não existe no acervo
  (imagem quebrada na página publicada, em silêncio), `largura`/`altura`
  que diverge do arquivo (o CLS que a declaração existia para evitar), SVG
  inline junto com `src`, SVG apontado por `src` (desenho é código: entra
  inline pelo slot, nunca pelo acervo).
- **Código (bloco 20)** — sem rótulo de contexto, linha abrindo com `$`, `#`
  ou `>` (não colável).
- **Aviso (bloco 21)** — tipo `atencao` sem `fonte`.

## A regra das portas

`nenhum` é o adaptador padrão de toda porta, e o chassi builda e publica com
ele em todo lugar — zero conta configurada. Um arquivo por adaptador. **Porta
nova nunca edita arquivo existente**: `escolherX(env)` em `porta.ts` cresce um
`if`, o adaptador novo chega como arquivo novo — é isso que faz
`scripts/atualizar` entregá-lo sem conflito.

## Comandos

    ./scripts/instalar        uma vez, após o clone
    ./scripts/atualizar       o que mudou no upstream x o que você tocou
    cd web && npm run dev     Astro em 4321
    cd web && npm run build
    cd web && npm test
    cd web && npm run check           astro check (tipos de src/)
    cd web && npm run check:functions tsc -p functions (Functions ficam fora do tsconfig de src/)
