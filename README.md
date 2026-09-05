# chassi

Esqueleto de blog de nicho, publicado no Cloudflare Pages: Astro estático, 30
blocos de artigo, 5 estilos visuais, auto-descoberta de site e de estilo com
validação que quebra a build, contrato HTTP com handler puro, portas de
e-mail/verificação humana/analytics/dados/erros, slot de anúncio, e as sete
páginas institucionais (inicial, quem somos, contato, privacidade, cookies,
termos, direitos autorais).

**O que não está aqui:**

- **A renderização de artigo a partir de markdown.** O encanamento
  `post.md → blocos` ainda não existe. A rota `/exemplo/[estilo]` que você vai
  ver no ar é vitrine: os 30 blocos de verdade, com texto em lorem ipsum, nos
  cinco temas — para julgar tipografia e ritmo, não para publicar um artigo
  real ainda.
- **Comentários ligados a um banco.** O componente `Comentarios.astro` existe
  e está inerte (mesmo comportamento de qualquer porta sem chave configurada);
  D1, schema e fila de moderação chegam depois, junto com a aula em que
  comentário for o assunto.
- **As ferramentas de conteúdo** — geração de pauta, redação de artigo,
  auditoria de voz — que fazem parte do workshop não vêm neste repositório.
  Este repo é o chassi: a casa onde o conteúdo mora, não quem escreve o
  conteúdo.

Prometer o que não tem é a pior coisa que este README podia fazer, então está
dito sem rodeio.

## Como clonar

```bash
git clone https://github.com/ffmenezes/chassi.git meu-blog
cd meu-blog
git remote rename origin upstream
git remote add origin <repo-privado-do-participante>
./scripts/instalar
```

Por que **clone**, e não "Use this template" nem fork:

- **Fork de repositório público não vira privado.** O seu blog carrega
  conteúdo, pautas, métricas e a base do site — a maioria não quer isso
  público e listado como fork de `ffmenezes/chassi`.
- **"Use this template" cria história não relacionada.** `git log
  HEAD..upstream/main` — que é como você vê o que mudou lá em cima — deixa de
  funcionar sem ancestral comum.

O clone com histórico entrega repositório privado **e** "o que mudou desde que
eu clonei" de graça, porque o remote `upstream` continua enxergando a origem.

## Duas vitrines antes de escrever

Suba o servidor local:

```bash
cd web && npm run dev
```

- **http://localhost:4321/bancada/** — os 30 blocos de artigo, etiquetados
  com número de catálogo, nome e a regra de cada um. Responde "quais blocos
  existem e qual a regra de cada um".
- **http://localhost:4321/exemplo/\<estilo\>/** — o mesmo artigo, em lorem
  ipsum, nos cinco estilos (`ceu`, `circuito`, `concreto`, `linho`, `vidro`).
  Responde "como fica o mesmo texto em cada um dos cinco estilos, para eu
  escolher o meu".

Sem essas duas rotas abertas, você tem 30 componentes e 5 estilos que
ninguém te contou que existem.

## A fronteira

| | Do participante | Do upstream |
|---|---|---|
| cria e edita | `web/src/sites/<slug>.ts`, `sites/<slug>/**`, `web/src/meu/`, `web/src/pages/{index,sobre,contato}.astro` | — |
| nunca toca | — | blocos, layouts, estilos, functions, as quatro páginas jurídicas, `web/src/sites/index.ts` |

As três páginas de identidade — `index.astro`, `sobre.astro` e `contato.astro`
— nascem em branco, com um roteiro de perguntas embutido (comentário HTML,
sempre visível a quem abrir o código-fonte; também texto visível em `npm run
dev`, mas ausente do build de produção). A partir do clone, elas são **suas**,
para sempre — o upstream nunca mais escreve nelas.

**Identidade é sua porque identidade não se copia.** Vinte "quem somos" iguais
é o padrão que o revisor humano do AdSense reconhece na hora, e "quem somos" é
justamente a página que mais pesa em autoridade naquela análise. **As quatro
jurídicas (`privacidade`, `cookies`, `termos`, `direitos-autorais`) são nossas
pela razão oposta:** texto jurídico é igual para todo mundo, você nunca abre
esses arquivos — e é por nunca abri-los que eles continuam recebendo nossas
correções para sempre, sem conflitar com nada que você tenha feito.

> **Site sobrescreve token; site nunca escreve seletor.** Sua cara própria sai
> de até 6 tokens em `web/src/sites/<slug>.ts`. É essa regra que faz a
> atualização nunca conflitar com você — no minuto em que você editar um bloco
> `.astro`, aquele arquivo para de receber correção nossa, para sempre.

## Como atualizar

```bash
./scripts/atualizar
```

Não é `git merge`. É `git checkout upstream/main -- <arquivo>`, arquivo por
arquivo — o que não exige ancestral comum e não produz conflito, em troca de
sobrescrever em silêncio se você deixar. Por isso o script nunca aplica nada
sozinho: ele imprime três listas e você decide.

- **NOVOS** — arquivos que ainda não existem aqui. Puxar é sempre seguro.
- **SEGUROS** — mudaram lá, você nunca tocou. Puxar não perde nada.
- **CONFLITO** — mudaram lá **e** você mexeu aqui. Não puxe sem ver os dois
  lados: `git diff <base> HEAD -- <arquivo>` (o que você fez) contra `git diff
  <base> upstream/main -- <arquivo>` (o que o upstream fez).

A promessa: **arquivo que você tocou nunca é sobrescrito sem você ver os dois
lados.** `./scripts/atualizar --aplicar-seguros` só mexe no que está nas
listas NOVOS e SEGUROS. Se você tiver o Claude Code, a skill
`.agents/skills/atualizar-template/` conduz essa conversa por você.

## As portas

| Porta | Adaptadores | Estado no v0 | O que você precisa configurar |
|---|---|---|---|
| Transporte | contrato HTTP + `pages`, `worker` (inerte) | ativo (`pages`) | nada — já funciona no deploy do Cloudflare Pages |
| E-mail | `resend`, `cloudflare` (dormente), `nenhum` | ativo (`resend`) | `RESEND_API_KEY` e `EMAIL_CONTATO` via `wrangler pages secret put` |
| Verificação humana | `turnstile`, `nenhum` | ativo | `TURNSTILE_SECRET` (secret) e `PUBLIC_TURNSTILE_SITEKEY` (variável de **build**, painel do Pages) |
| Analytics | `ga4`, `cloudflare`, `posthog` (inerte), `nenhum` | ativo | `analytics` e `analyticsId` no seu `web/src/sites/<slug>.ts` |
| Dados | `d1`, `supabase`, `nenhum` | inerte | nada ainda — chega na aula de comentários |
| Erros | `nenhum` (log da Cloudflare) | inerte | nada — já funciona, sem SDK e sem conta |
| Anúncio (slot, não porta) | `adsense`, `nenhum` | inerte | `adsenseId` no seu `web/src/sites/<slug>.ts` |

**O chassi builda e publica com zero conta configurada.** Isso é feature, não
limitação: `nenhum` é o adaptador padrão de toda porta, e é ele que garante que
o caminho sem conta é de fato exercitado pelo `npm run build` de todo mundo, em
vez de ser código morto que ninguém rodou.

## O que fica inerte sem configuração

- **Sem `TURNSTILE_SECRET`:** o formulário de contato continua funcionando —
  mas sem verificação humana nenhuma. **Você vai receber spam.**
- **Sem `RESEND_API_KEY` e `EMAIL_CONTATO`:** o formulário responde **503**. Ele
  não finge que enviou.
- **Sem analytics configurado:** nenhum script de terceiro entra na página.
  Nem GA4, nem Cloudflare, nem PostHog — a página nasce limpa até você decidir.

## Aviso jurídico

> As páginas de privacidade, cookies, termos e direitos autorais são **ponto de
> partida, não parecer jurídico**. O controlador dos dados do seu site é
> **você**. Revise o texto — com um advogado, se operar com dados de terceiros
> além do básico de um formulário de contato — antes de publicar.

## Licença

MIT. Você pode usar comercialmente, modificar à vontade, e manter seu
repositório privado — nada aqui exige que o seu blog seja público.
