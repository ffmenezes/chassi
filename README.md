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
- **O método de artigo vem; o encanamento, ainda não.** A skill `artigo`
  (`.claude/skills/artigo/`) conduz da ideia à peça revisada em oito etapas,
  com estado em `sites/<slug>/`, e é o que escreve o `post.md`. O que não
  existe é o parser que transforma esse `post.md` na página: a sintaxe de
  bloco em `referencias/blocos.md` é o contrato dele, e até ele chegar a
  peça fica pronta em disco. Auditoria de voz e manutenção de peça
  publicada ficam para depois.

Prometer o que não tem é a pior coisa que este README podia fazer, então está
dito sem rodeio.

## Como clonar a primeira vez

Roda uma vez, e nunca mais. No fim destes seis passos você tem um repositório
privado seu, com um site que builda, publica e continua recebendo correção do
upstream.

**1. Clone, e troque os remotes de lugar.**

```bash
git clone https://github.com/ffmenezes/chassi.git meu-blog
cd meu-blog
git remote rename origin upstream          # a origem vira "upstream"
git remote add origin <repo-privado-do-participante>
git push -u origin main
```

O `upstream` é o que faz `./scripts/atualizar` existir. Apagou o remote,
acabou a atualização.

**2. Instale.**

```bash
./scripts/instalar
```

Roda uma vez, logo depois do clone. Existe por um motivo só: git guarda
symlink como modo `120000`, e num checkout nativo de Windows sem
`core.symlinks=true` o clone entrega um **arquivo de texto** com o caminho
dentro, em silêncio. Você não vê erro — só não tem skill nenhuma. O script
detecta e conserta copiando, e depois instala as dependências do `web/`.

**3. Crie o seu site — os dois lados.**

```bash
cp web/src/sites/exemplo.ts web/src/sites/<seu-slug>.ts   # a máquina
cp -r sites/_modelo sites/<seu-slug>                      # a doutrina
```

O `.ts` é o que a build lê: slug, nome, domínio, estilo, quais blocos o site
monta, as portas, e os até 6 desvios de token. A pasta `sites/<seu-slug>/` é o
que **você** lê antes de escrever — território, leitor, tom, autor, provas —
e cada subpasta dela abre com um README dizendo o que mora ali, com exemplo.
Da pasta inteira, a build abre um arquivo só: os comentários já aprovados de
cada peça. O slug é o mesmo dos dois lados de propósito, e é você que mantém
os dois iguais.

**4. Apague o modelo.**

```bash
rm web/src/sites/exemplo.ts
```

`exemplo.ts` é o único arquivo do upstream que você tem permissão de apagar —
e precisa apagar, senão você publica dois sites, um deles chamado "Blog de
Exemplo". A pasta `sites/_modelo/` é o contrário: **não apague e não
responda** nada dentro dela. Ela continua ali para o seu segundo site, e é de
lá que você puxa melhorias dos stubs.

**5. Veja no ar, e escolha o estilo.**

```bash
cd web && npm run dev
```

- **http://localhost:4321/inventario/** — os 30 blocos de artigo, etiquetados
  com número de catálogo, nome e a regra de cada um. Responde "quais blocos
  existem e qual a regra de cada um".
- **http://localhost:4321/exemplo/\<estilo\>/** — o mesmo artigo, em lorem
  ipsum, nos cinco estilos (`ceu`, `circuito`, `concreto`, `linho`, `vidro`).
  Responde "como fica o mesmo texto em cada um dos cinco estilos, para eu
  escolher o meu".

Sem essas duas rotas abertas, você tem 30 componentes e 5 estilos que ninguém
te contou que existem. Escolhido o estilo, ele vai no campo `estilo` do seu
`web/src/sites/<seu-slug>.ts`, e o **porquê** vai no seu
`sites/<seu-slug>/base/DESIGN.md`.

**6. Escreva as três páginas que são suas.**

`web/src/pages/{index,sobre,contato}.astro` nascem em branco, com um roteiro
de perguntas embutido. A partir do clone elas são suas, para sempre — o
upstream nunca mais escreve nelas. Depois:

```bash
cd web && npm test && npm run build
```

### Por que clone, e não "Use this template" nem fork

- **Fork de repositório público não vira privado.** O seu blog carrega
  conteúdo, pautas, métricas e a base do site — a maioria não quer isso
  público e listado como fork de `ffmenezes/chassi`.
- **"Use this template" cria história não relacionada.** `git log
  HEAD..upstream/main` — que é como você vê o que mudou lá em cima — deixa de
  funcionar sem ancestral comum.

O clone com histórico entrega repositório privado **e** "o que mudou desde que
eu clonei" de graça, porque o remote `upstream` continua enxergando a origem.

### Se você usa uma IA para isso

No Claude Code, os passos 3 a 6 cabem num prompt só. Ajuste as três primeiras
linhas e mande:

```text
Leia o AGENTS.md e o web/src/sites/exemplo.ts deste repositório.
Meu blog é sobre: <assunto, em uma frase>.
Slug: <slug>. Nome: <nome do site>. Domínio: <dominio.com.br>.

1. Crie web/src/sites/<slug>.ts a partir do exemplo.ts. Escolha um dos cinco
   estilos e me diga por que esse antes de escrever. Depois apague o
   exemplo.ts.
2. Copie sites/_modelo para sites/<slug>/ e me entreviste, um arquivo por
   vez, na ordem do README de lá: base/TERRITORIO.md, base/LEITOR.md,
   base/META.md. Escreva as respostas nos arquivos e apague as perguntas já
   respondidas. Não responda nada dentro de sites/_modelo/.
3. Preencha web/src/pages/{index,sobre,contato}.astro seguindo o roteiro que
   já está dentro delas, com o que eu responder no passo 2.
4. Não edite bloco, layout, estilo, function nem página jurídica. Se algo
   parecer exigir isso, me diga em vez de fazer.

No fim, rode `cd web && npm test && npm run build` e me mostre o resultado.
```

A quarta instrução é a que importa: é ela que mantém o seu repositório
recebendo correção nossa para sempre.

## Como atualizar

O chassi recebe correção de bloco, estilo novo, adaptador novo e página nova
ao longo do curso. Puxar isso é rotina de cinco minutos:

```bash
./scripts/atualizar
```

**Não é `git merge`.** É `git checkout upstream/main -- <arquivo>`, arquivo
por arquivo — o que não exige ancestral comum e não produz conflito, em troca
de sobrescrever em silêncio se você deixar. Por isso o script nunca aplica
nada sozinho: ele imprime os commits novos, três listas, e você decide.

- **NOVOS** — arquivos que ainda não existem aqui. Puxar é sempre seguro.
- **SEGUROS** — mudaram lá, você nunca tocou. Puxar não perde nada.
- **CONFLITO** — mudaram lá **e** você mexeu aqui. Não puxe sem ver os dois
  lados:

```bash
git diff <base> HEAD -- <arquivo>            # o que VOCÊ fez
git diff <base> upstream/main -- <arquivo>   # o que o UPSTREAM fez
```

Para aplicar só o que não tem risco, e depois conferir:

```bash
./scripts/atualizar --aplicar-seguros    # mexe apenas em NOVOS e SEGUROS
cd web && npm test && npm run build
```

A promessa: **arquivo que você tocou nunca é sobrescrito sem você ver os dois
lados.**

### O que o script nunca oferece

Estes caminhos são seus, e o script os ignora por inteiro — nem aparecem nas
três listas: `sites/**`, `web/src/meu/**`, o seu `web/src/sites/<slug>.ts`, e
as três páginas de identidade `web/src/pages/{index,sobre,contato}.astro`.

Isso inclui `sites/_modelo/`, que é do upstream mas mora dentro da sua
fronteira. Quando os stubs melhorarem lá em cima, a puxada é à mão:

```bash
git checkout upstream/main -- sites/_modelo
```

Seguro justamente porque você nunca edita `_modelo` — você copia.

### Se você usa uma IA para isso

No Claude Code, a skill `.agents/skills/atualizar-template/` já conduz a
conversa inteira. Basta:

```text
atualizar o template
```

Em qualquer outra ferramenta, o prompt equivalente:

```text
Rode ./scripts/atualizar neste repositório e conduza a atualização comigo.

- NOVOS e SEGUROS: diga quantos são, resuma em uma frase o que mudou (use as
  mensagens de commit) e ofereça `./scripts/atualizar --aplicar-seguros`. Não
  pergunte arquivo por arquivo aqui — é ruído.
- CONFLITO: um de cada vez. Mostre os dois diffs (o que eu fiz e o que o
  upstream fez), diga o que se perde em cada escolha, recomende, e só então
  pergunte.
- Nunca rode `git merge upstream/main`.

Depois de aplicar: `cd web && npm test && npm run build`. Se quebrar, conserte
ou reverta antes de commitar. Commit único, com a lista do que foi puxado no
corpo da mensagem.
```

## A fronteira

| | Do participante | Do upstream |
|---|---|---|
| cria e edita | `web/src/sites/<slug>.ts`, `sites/<slug>/**`, `web/src/meu/`, `web/src/pages/{index,sobre,contato}.astro` | — |
| nunca toca | — | blocos, layouts, estilos, functions, as quatro páginas jurídicas, `web/src/sites/index.ts`, `web/src/imagens/` (o acervo, hoje só com a imagem de exemplo) |

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
