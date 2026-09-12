# chassi

Esqueleto de blog de nicho, publicado no Cloudflare Pages: Astro estático, 32
blocos de artigo, 7 estilos visuais, auto-descoberta de site e de estilo com
validação que quebra a build, contrato HTTP com handler puro, portas de
e-mail/verificação humana/analytics/dados/erros, slot de anúncio, e as sete
páginas institucionais (inicial, quem somos, contato, privacidade, cookies,
termos, direitos autorais).

E o método de artigo: a skill `artigo` leva uma peça da ideia ao `post.md`
revisado em oito etapas, com apuração rastreável e estado em disco; a skill
`pitaco` põe a voz do autor na peça pronta; e três scripts medem higiene,
legibilidade, SEO on-page e links. Ver [Como escrever um
artigo](#como-escrever-um-artigo).

**O que não está aqui:**

- **A página a partir do `post.md`.** A skill `artigo` escreve a peça em
  `sites/<slug>/posts/<peça>/post.md`, com cada bloco marcado numa sintaxe
  própria (`.agents/skills/artigo/referencias/blocos.md`). O que falta é o
  parser que lê esse arquivo e monta a página com os blocos de verdade — o
  que o código chama de encanamento `post.md → blocos`. Hoje a rota de
  artigo lê um mock (`web/src/mock/artigos.ts`), e a rota `/exemplo/[estilo]`
  que você vai ver no ar é vitrine: blocos de verdade, com texto em lorem
  ipsum, em cada estilo — para julgar tipografia e ritmo. Até o parser
  chegar, a peça fica pronta em disco, e virar página é trabalho à mão.
- **Comentários ligados a um banco.** O componente `Comentarios.astro` existe
  e está inerte (mesmo comportamento de qualquer porta sem chave configurada);
  D1, schema e fila de moderação chegam depois, junto com a aula em que
  comentário for o assunto.
- **Manutenção de peça publicada e auditoria de voz.** O método vai até a
  peça pronta. Atualizar o dado vencido de uma peça que já está no ar ainda
  não tem etapa própria.

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

- **http://localhost:4321/inventario/** — os 32 blocos de artigo, etiquetados
  com número de catálogo, nome e a regra de cada um. Responde "quais blocos
  existem e qual a regra de cada um".
- **http://localhost:4321/exemplo/\<estilo\>/** — o mesmo artigo, em lorem
  ipsum, nos sete estilos (`caderno`, `ceu`, `circuito`, `concreto`, `linho`,
  `rabisco`, `vidro`). Responde "como fica o mesmo texto em cada estilo, para
  eu escolher o meu".

Sem essas duas rotas abertas, você tem 32 blocos e 7 estilos que ninguém te
contou que existem. Escolhido o estilo, ele vai no campo `estilo` do seu
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

1. Crie web/src/sites/<slug>.ts a partir do exemplo.ts. Escolha um dos
   estilos de web/src/styles/estilos/ e me diga por que esse antes de
   escrever. Depois apague o exemplo.ts.
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

## Como escrever um artigo

O chassi traz o método, não o texto. A skill `artigo`
(`.agents/skills/artigo/`) conduz uma peça da ideia ao `post.md` revisado em
oito etapas e guarda tudo em `sites/<seu-slug>/`: cada etapa lê arquivos e
escreve arquivos, nunca depende da conversa. É isso que deixa parar no meio,
retomar noutro dia, e rodar uma etapa por sessão num modelo pequeno.

**A regra que sustenta tudo: nenhum número entra no texto sem um bloco no
dossiê com fonte e data.** E toda peça carrega ao menos um dado seu, com data
e método — preço em duas lojas hoje, norma lida no texto oficial, simulador
rodado, medição.

**Antes da primeira peça**, `base/TERRITORIO.md` e `base/LEITOR.md` do seu
site precisam estar respondidos: com as perguntas do stub ainda visíveis, a
skill para e diz qual falta. A assinatura sai de `base/AUTOR.md`, e sem
pessoa real ali a peça não é entregue.

| # | Etapa | O que sai, dentro de `sites/<seu-slug>/` |
|---|---|---|
| 0 | Ideias | `pautas/_candidatas.md`, em lote, com o corte que eliminou cada uma |
| 1 | Pauta | `pautas/<peça>.md`, e a linha da peça em `estado/CLUSTER.md` |
| 2 | Dossiê | `pesquisa/<peça>/dossie.md`: cada dado com fonte e data |
| 3 | Esqueleto | `posts/<peça>/esqueleto.md`, que congela os números antes da prosa |
| 4 | Capítulos | `posts/<peça>/capitulos/NN-*.md`, um H2 por vez |
| 5 | Costura | `posts/<peça>/post.md` |
| 6 | Revisão | `posts/<peça>/revisao.md` e o `post.md` corrigido, até três rodadas |
| 7 | Entrega | status `pronto` no `CLUSTER.md`, o `links.md`, e a lista do que fica para você |

Toda etapa também deixa uma entrada em `posts/<peça>/diario.md`: o que foi
decidido, contra quais alternativas, e o que ficou para depois.

A skill descobre sozinha, lendo o disco, em que etapa cada peça está. No
Claude Code, basta pedir:

```text
ideias de artigo para o site <slug>
próxima etapa da peça <slug-da-peça>
```

Em qualquer outra ferramenta, o prompt equivalente:

```text
Leia .agents/skills/artigo/SKILL.md e execute só a próxima etapa da peça
<slug-da-peça> do site <slug>. Abra apenas o arquivo da etapa que for rodar.
```

**Onde o método para: em `pronto`.** Por dois motivos. O primeiro é o
`links.md`, com todo link do corpo e a coluna "decisão do dono" vazia —
manter, trocar por afiliado, trocar a fonte, remover. Afiliado, parceria e
fonte preferida são decisão sua, e a peça não vai a `publicado` antes de toda
linha ter resposta. O segundo é que `publicado` quer dizer página no ar, e o
`post.md` ainda não vira página sozinho (ver "O que não está aqui", no
topo). Quem marca `publicado` é você.

### O seu toque: a skill `pitaco`

A peça que sai do método se defende ponto a ponto contra o dossiê, mas não
tem você: a opinião, o caso que você viveu, a ressalva que só você sabe.
Depois de ler a peça, peça:

```text
adiciona meu pitaco em <slug-da-peça>: <o que você quer dizer, com as suas palavras>
```

A skill encaixa o pitaco no capítulo do assunto, nunca na abertura, nas
conclusões ou na FAQ. Número que você trouxer só entra com data e método, e
vira dado no dossiê. Se o pitaco contradiz o veredito da peça, ela avisa em
vez de deixar as duas coisas na página. E nunca inventa experiência que você
não contou.

### Os três scripts de texto

As etapas 5 a 7 rodam estes scripts, e você pode rodá-los à mão:

```bash
scripts/higiene-texto sites/<slug>/posts/<peça>/post.md
scripts/medir-texto   sites/<slug>/posts/<peça>/post.md "query-alvo"
scripts/listar-links  sites/<slug>/posts/<peça>/post.md > sites/<slug>/posts/<peça>/links.md
```

- **`higiene-texto`** tira, no lugar, o caractere invisível que sobra de
  colar texto de chat ou de editor (zero-width, soft hyphen, espaço exótico).
  Travessão ele só conta e aponta a linha: é defeito que a revisão corrige à
  mão. `--so-relatar` não escreve nada.
- **`medir-texto`** mede a legibilidade da prosa (palavras por frase, frases
  curtas e longas, Flesch adaptado ao português) e o SEO on-page que a
  revisão confere (tamanho de título e description, query no título e nas
  primeiras palavras, H2, perguntas na FAQ, link externo no corpo). Cada
  linha sai `ok` ou `REVER`, com a régua ao lado.
- **`listar-links`** gera a tabela do `links.md`, com o tipo de cada link
  deduzido por domínio — palpite para orientar, quem classifica é você.

`medir-texto` e `listar-links` precisam de Python 3.7 ou mais novo; acham o
interpretador sozinhos, no Windows inclusive. Sem Python, `npm test` pula as
suítes deles em vez de falhar.

**A régua é sua para mudar, no arquivo certo.** Os números de `medir-texto`
são os padrões do chassi. Se o seu nicho pede outro, declare em
`sites/<seu-slug>/base/REGUAS.json`, só com as chaves que mudam, e o porquê:

```json
{ "_porque": "description longa é o padrão do nicho", "descricao_min": 150 }
```

O relatório passa a cobrar o número de lá e diz, no topo, o que mudou. Chave
desconhecida ou valor que não é inteiro param o script — régua com erro de
digitação que passasse calada seria régua nenhuma. Não edite a régua em
`scripts/_lib/medir-texto.py`: aquele arquivo é do upstream, e régua mudada
ali vira CONFLITO na próxima atualização.

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

## As skills

Moram em `.agents/skills/`, e `.claude/skills` é um symlink para lá. No Claude
Code elas entram sozinhas quando o pedido combina; em outra ferramenta, mande
ler o `SKILL.md` da pasta.

| Skill | Para quê | Onde escreve |
|---|---|---|
| `artigo` | da ideia ao `post.md` revisado, em oito etapas | `sites/<slug>/` |
| `pitaco` | a sua voz numa peça já costurada ou pronta | `sites/<slug>/posts/<peça>/` |
| `atualizar-template` | puxar correção do upstream, arquivo por arquivo | onde o `scripts/atualizar` indicar |
| `novo-estilo` | um estilo visual novo, a partir de um DESIGN.md ou de prosa | `web/src/styles/estilos/` |
| `criar-componente` | um bloco novo no catálogo, ou chrome de site | `web/src/components/`, `catalogo.ts`, inventário, mock |

As duas últimas são as ferramentas com que o chassi cresce, e escrevem em
território do upstream. Estilo novo são dois arquivos novos, que a varredura
acha sozinha e a atualização não sobrescreve. Bloco novo edita arquivos
compartilhados (`catalogo.ts`, inventário), e esses param de receber correção
nossa — se o bloco serve a mais de um nicho, proponha lá em cima.

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
