# Etapa 6 — Revisão

Caminhos: `sites/`, `web/` e `scripts/` partem da raiz do checkout do
chassi; `referencias/` parte de `.agents/skills/artigo/`. `base/`,
`estado/`, `pautas/`, `pesquisa/` e `posts/` abreviados partem de
`sites/<slug>/`. Rode scripts da raiz, com o caminho completo da peça.
Site novo exige o par de cópias descrito em `sites/_modelo/README.md`.

Três passes sobre o `post.md`, nesta ordem: rastreabilidade (todo número e
toda afirmação voltam ao dossiê), texto de máquina (a lista de
`referencias/antipadroes.md`, com o freio), e leitor cético (a peça de pé
sob ataque). O resultado é um `revisao.md` com veredito e uma lista de
correções cirúrgicas, aplicadas uma a uma.

**Quem escreveu não revisa.** Se der para despachar outra sessão ou outro
agente, faça isso: ele recebe só esta etapa, o `post.md`, o dossiê e o
`CLUSTER.md`. Se não der, a regra de substituição é: leia o dossiê antes
do texto, e escreva a lista inteira de defeitos antes de corrigir o
primeiro.

## Leia só isto

- `sites/<slug>/posts/<peça>/post.md`.
- `sites/<slug>/pesquisa/<peça>/dossie.md`.
- `sites/<slug>/posts/<peça>/esqueleto.md` — números e contas congeladas.
- `sites/<slug>/posts/<peça>/diario.md` — papéis reais na produção.
- `sites/<slug>/base/DECLARACOES.md` — declarações obrigatórias.
- `sites/<slug>/pautas/<peça>.md` — query-alvo para a medição.
- `sites/<slug>/estado/CLUSTER.md` — status dos slugs linkados.
- `referencias/antipadroes.md` — inteiro, no passe 2.
- `sites/<slug>/base/TOM.md` — o "nunca faz" e o "sempre faz".
- `sites/<slug>/posts/<peça>/revisao.md`, se existe: a rodada atual é a
  anterior mais um.

## Escreva só isto

`sites/<slug>/posts/<peça>/revisao.md` (append por rodada) e o `post.md`
corrigido. Ao aprovar, status no `CLUSTER.md` vira `revisado`.

```markdown
# Revisão — <slug da peça>

## Rodada 1 — 2026-09-12
**revisor:** outra sessão (ou: mesma sessão, dossiê lido antes do texto)

### Passe 1 — rastreabilidade
| # | linha | trecho | problema | correção |
|---|---|---|---|---|
| 1 | 42 | "R$ 0,92/kWh" | dossiê D1 diz R$ 0,89 | trocar por R$ 0,89 |
| 2 | 77 | "[estudos mostram]" | afirmação sem D | cortar a frase |

### Passe 2 — texto de máquina
| # | linha | trecho | padrão | correção |
|---|---|---|---|---|
| 3 | 12 | "garantindo economia" | gerúndio de análise falsa | ponto; "A economia aparece na segunda conta." |

### Passe 3 — leitor cético
| # | ataque | o texto aguenta? | correção |
|---|---|---|---|
| 4 | "E se eu configurar 20 °C?" | não: C2 diz que depende e não diz quanto | acrescentar a faixa de D2 para 20 °C (está no dossiê) |

### Higiene e medição
`scripts/higiene-texto post.md`: 0 caracteres invisíveis, 0 travessões.
`scripts/medir-texto post.md "<query>"`: Legibilidade 5 ok; SEO 7 ok.

### Correções aplicadas
1, 2, 3, 4 — uma por edição, na ordem.

### Grep do valor antigo
`grep -n "0,92" post.md` → nada.

**VEREDITO: aprovado** (ou `reprovado: <motivo>`, ou `devolvido à etapa N`)
```

## Passe 1 — rastreabilidade

Para cada número, data, nome de norma, preço e citação do `post.md`:

1. Existe um D no dossiê com esse valor exato, ou uma conta em "Contas
   refeitas" do esqueleto que chega nele? Não existe: defeito. Número
   arredondado na prosa ("uns 9 reais", "quase 12") é aceito quando o
   `TOM.md` (pergunta 6) manda arredondar e o exato está na tabela ou na
   calculadora da mesma peça; o arredondamento não pode trocar a ordem de
   grandeza nem o lado da comparação. Conclusões e preço que o leitor paga
   seguem o que o `TOM.md` diz para eles.
2. A marca bate? Texto afirma como fato o que o dossiê tem como
   `[ESTIMATIVA]`: defeito. Texto diz "apurei" sobre `[HERDADO]` de outra
   peça: defeito.
3. A ressalva do D ("o que este dado NÃO diz") aparece onde o número é
   usado de um jeito que a ressalva limita? Não aparece: defeito.
4. Afirmação sem número mas com fonte implícita ("a norma exige",
   "o fabricante recomenda"): tem D? Não tem: cortar, ou rebaixar para
   "não encontrei a regra; o que encontrei foi X".
5. Todo link interno aponta para slug `publicado` no `CLUSTER.md`. Os
   outros estão como `[LINK PENDENTE: slug]`. Link inventado: defeito.
6. Todo link externo é URL do dossiê. Confira que abre (`curl -sIL`
   quando possível); 404 é defeito, 403 de bloqueio é ressalva. **A fonte
   mais forte está linkada no corpo, na frase em que é usada**, não só
   na lista Fontes: fonte que só aparece no rodapé é fonte que o leitor
   e o buscador não veem sustentando a afirmação.
7. A description e as conclusões prometem só o que o corpo entrega.
   Description que diz "duas lojas" sobre tabela de uma: defeito.
8. As duas seções fixas existem: `## Fontes` e `## Como esta peça foi
   feita`, esta com o dado próprio (método e data) e o que
   `base/DECLARACOES.md` manda. Ausente: defeito, antes de qualquer
   leitura de conteúdo.
   Os papéis declarados correspondem ao que aconteceu? IA que apurou
   não vira apenas ajuda de redação; assinatura do autor não autoriza
   afirmar que ele conferiu fontes ou contas. Confira o diário da peça
   se houver dúvida e declare a conferência humana pendente quando for o caso.

Afirmação órfã (fonte caiu) não se reancora na fonte vizinha. Ou acha
fonte nova (volta ao dossiê), ou rebaixa a afirmação, ou corta.

Número certo que só não virou D (veio de página já aberta e registrada em
"Fontes abertas", mas ficou fora dos blocos): não é defeito do texto, é
registro incompleto. O revisor **acrescenta** o D ao dossiê (append, com a
URL, as datas e a frase literal) e a conta a "Contas refeitas" do
esqueleto, anota isso na tabela do passe 1 como item numerado (coluna
"correção": "D9 acrescentado ao dossiê; conta 11 ao esqueleto") e no
diário, e segue. É a
única escrita fora de `revisao.md` e `post.md` que esta etapa autoriza, e
só em append: valor existente nunca muda aqui.

## Passe 2 — texto de máquina

Abra `referencias/antipadroes.md`. Rode primeiro os greps da lista dura
(zero tolerância: travessão, emoji, vocabulário banido, atribuição vaga,
sobra de chat). Depois leia o texto inteiro uma vez procurando a lista de
julgamento (gerúndio de análise falsa, fuga da cópula, tríade, "não é X, é
Y", fecho de efeito, personalidade só nas pontas, monotonia).

A **segunda ordem** não se resolve por grep, e por isso tem procedimento
próprio, obrigatório: liste, uma embaixo da outra, a primeira frase de
cada capítulo (`grep -A2 '^## ' post.md`) e a última; leia as duas listas.
Três aberturas com a mesma construção, ou a mesma fórmula de fecho ("isso
dá R$ X por Y") repetida, é defeito mesmo que nenhuma linha da lista de
julgamento bata sozinha. Registre na tabela do passe 2 como "segunda
ordem: aberturas". O alcance da correção é o mínimo que desfaz o
aglomerado: com três aberturas iguais, reescreva duas e deixe uma; com
duas, uma. Não reescreva as três "por simetria": é o que produz o
aglomerado seguinte.

O freio, que vale mais que a lista: **um sinal isolado não é defeito**.
Corrija aglomerado (dois ou mais no mesmo parágrafo, ou o mesmo padrão
três vezes na peça). Não marque prosa seca, frase curta de ênfase,
vocabulário técnico, nem palavra banida dentro de citação literal. Detalhe
difícil de inventar, resultado negativo, sentimento misto e parêntese de
autocorreção são sinais de gente escrevendo: ficam. Em empate entre
corrigir e deixar, deixa.

Rode `scripts/medir-texto posts/<peça>/post.md "<query-alvo>"` e registre
os dois blocos. Legibilidade fora da régua sem motivo anotado pela costura
volta à etapa 5. No bloco SEO, cada `REVER` é defeito desta rodada: título,
description, H2, FAQ, query nas primeiras 100 palavras, link no corpo.

O "nunca faz" de `base/TOM.md` é lista dura deste site: corrige sempre,
mesmo isolado. O freio vale para a lista de julgamento, não para a régua
que o dono escreveu.

Rode `scripts/higiene-texto posts/<peça>/post.md` e registre a saída.

## Passe 3 — leitor cético

Cinco ataques, sempre estes, com a resposta por escrito:

1. **"E se o meu caso for diferente?"** A variável que mais muda a resposta
   está nomeada, com o quanto muda?
2. **"Quem disse?"** A fonte mais forte do texto está nomeada no corpo, não
   só na lista de fontes?
3. **"Isso é de quando?"** Todo número perecível tem mês e ano visíveis
   perto dele?
4. **"E o que você ganha com isso?"** O que `base/DECLARACOES.md` manda
   declarar está na seção "Como esta peça foi feita", e o dado próprio
   está lá com método e data?
5. **"E aí, o que eu faço?"** O fechamento dá um primeiro passo que dá
   para fazer hoje?

Ataque que o texto não aguenta e o dossiê responde: correção. Ataque que
nem o dossiê responde: `devolvido à etapa 2`, com o item.

Depois dos cinco ataques gerais, confronte os três ataques específicos
da pauta com "Ataque à tese" do dossiê. Registre, para cada um, o trecho
final que preserva a resposta ou a limitação. A objeção que quase derrubou
a tese não pode desaparecer na costura. Faltou ressalva já apurada:
correção cirúrgica; faltou dado: devolva à etapa 2 para aquele item.

## Aplicar as correções

- Uma por edição, na ordem da lista. Nunca "aproveita e melhora".
- Corrija a classe, não a ocorrência: se o valor errado aparece em três
  lugares, os três entram na mesma correção.
- Depois de aplicar, `grep` do valor antigo e do trecho antigo. Sobrou:
  a rodada não fecha.
- Correção dentro do frontmatter obedece ao YAML, não à prosa: valor com
  dois-pontos, aspas ou `#` vai entre aspas duplas. Depois de qualquer
  correção nas linhas entre os `---`, valide:
  `python3 -c 'import yaml,sys; yaml.safe_load(sys.stdin.read().split("---")[1])' < post.md`.
- Corrigido o `post.md`, os capítulos em `capitulos/` ficam como estão.
  São histórico.

## Rodadas

Rodada fecha com veredito. `reprovado` abre a rodada seguinte, com a lista
nova. **Três rodadas é o teto**: na terceira reprovação, o veredito é
`reprovado: diagnóstico` e a lista vai para o dono como está, sem quarta
tentativa. Quase sempre o que não fecha em três rodadas é dossiê ou
esqueleto, não texto.

## E no diário

Acrescente a entrada da etapa 6 em `posts/<peça>/diario.md` (gabarito
no fim do SKILL.md): feito, decidido (com a alternativa que perdeu),
descartado, adiado, travou em, tempo. Uma entrada por rodada, apontando para a rodada em `revisao.md`; o que
vale registrar é a correção que foi considerada e não feita, e por quê.

Gabarito desta entrada (acrescente ao diário; não substitua entradas):

```markdown
## <data> · etapa 6 · revisao
**feito:** <arquivos e resultado>
**decidido:** <escolha, critério e alternativa que perdeu>
**descartado:** <item e motivo, ou nada>
**adiado:** <item e destino/condição, ou nada>
**travou em:** <obstáculo e encaminhamento, ou nada>
**tempo:** <duração medida, estimativa declarada ou não medido>
```

## Checagem antes de fechar

- [ ] Entrada desta etapa no `diario.md`, com os seis campos.
- [ ] Os três passes têm tabela, mesmo vazia ("nenhum defeito"), e o passe
      2 tem a linha "segunda ordem: aberturas" com o resultado.
- [ ] `## Fontes` e `## Como esta peça foi feita` existem no `post.md`.
- [ ] Frontmatter continua YAML válido depois das correções.
- [ ] Higiene e medição rodaram e as saídas estão registradas; nenhum
      `REVER` no bloco SEO.
- [ ] Toda correção listada foi aplicada e o grep do valor antigo está
      vazio.
- [ ] Nenhum `[ESTIMATIVA]`, `[PISO`, `[PREMISSA]`, `[LIGAR` no `post.md`.
- [ ] Veredito escrito em uma das três formas.
- [ ] Se aprovado: status no `CLUSTER.md` mudou para `revisado`.

## Se travar

- O revisor discorda do dossiê (acha o dado errado, não o texto): não
  corrige o texto; `devolvido à etapa 2` com o D e o motivo.
- O texto inteiro soa de máquina e a lista de julgamento marca tudo: não
  reescreva. Pegue o parágrafo de amostra do `TOM.md`, escolha os três
  parágrafos piores, reescreva só esses, e reprove a rodada com a
  observação de que a etapa 4 precisa da amostra no topo.
