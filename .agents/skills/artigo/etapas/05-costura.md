# Etapa 5 — Costura

Caminhos: `sites/`, `web/` e `scripts/` partem da raiz do checkout do
chassi; `referencias/` parte de `.agents/skills/artigo/`. `base/`,
`estado/`, `pautas/`, `pesquisa/` e `posts/` abreviados partem de
`sites/<slug>/`. Rode scripts da raiz, com o caminho completo da peça.
Site novo exige o par de cópias descrito em `sites/_modelo/README.md`.

Junta os capítulos num `post.md` só, com abertura, conclusões, FAQ,
fechamento e fontes, e liga as partes: transição, repetição entre
capítulos, sigla, nome do objeto, marca que vira frase. A costura mexe em
forma. **Não muda fato, número, nem ordem de capítulo.**

## Leia só isto

- `sites/<slug>/posts/<peça>/esqueleto.md` — título, description, selo,
  abertura, conclusões, FAQ, fechamento, e a ordem dos capítulos.
- `sites/<slug>/posts/<peça>/capitulos/*.md` — todos, na ordem do NN.
- `referencias/blocos.md` — a seção "O arquivo `post.md`", para o
  frontmatter e os blocos fixos.
- `sites/<slug>/pesquisa/<peça>/dossie.md` — fontes, dado próprio, marcas
  e validade; leitura para preservar fatos, sem nova apuração.
- `sites/<slug>/base/DECLARACOES.md` — o que declarar na seção de método.
- `sites/<slug>/base/TOM.md` e `pautas/<peça>.md` — voz, precisão e query.
- `sites/<slug>/posts/<peça>/revisao.md`, se existir — devoluções pendentes.
- `sites/<slug>/posts/<peça>/diario.md` — quem executou cada parte.

## Escreva só isto

`sites/<slug>/posts/<peça>/post.md`. Os capítulos ficam onde estão; a
etapa 6 corrige o `post.md`, não eles.

```markdown
---
titulo: "Quanto gasta um ar-condicionado ligado a noite toda em 2026"
descricao: "<150 a 160 caracteres, a do esqueleto>"
slug: quanto-gasta-ar-condicionado-noite
publicado: 2026-09-12
atualizado: 2026-09-12
minutos: 7
selo: "Guia de consumo"
---

:::abertura
cena: <uma frase>
problema: <uma frase com dado verificável ou lacuna que a peça resolve>
:::

:::conclusoes{rotulo="O essencial em 4 pontos"}
- Ligado 8 h por noite, o split de 9.000 BTU inverter custa **R$ 24 a R$ 37 por mês** em SP. (setembro de 2026, bandeira verde)
- ...
:::

## <H2 do capítulo 1>
<prosa do capítulo 1>

## <H2 do capítulo 2>
...

:::faq
### <pergunta literal>
<resposta em 50 a 100 palavras>
:::

:::fechamento
<um a dois parágrafos: o critério que o leitor leva e o primeiro passo>
:::

## Fontes
- ANEEL, tabela de tarifas homologadas, julho de 2026: <URL de D1>
- Ficha técnica <modelo>, <fabricante>: <URL de D5>

## Como esta peça foi feita
Dois a quatro parágrafos curtos: o dado próprio (o que foi feito, quando,
como), o que `base/DECLARACOES.md` manda declarar (uso de IA, afiliado,
produto da casa), quem apurou, redigiu e revisou de fato, e a data em que
os números perecíveis vencem. Se a IA executou essas funções, nomeie-as;
conferência humana só é declarada quando o dono a realizou.
```

`minutos` é o total de palavras do corpo dividido por 200, arredondado
para cima. `publicado` e `atualizado` nascem iguais, no dia da entrega;
aqui entram com a data de hoje e a etapa 7 confere.

## O que a costura faz, nesta ordem

1. **Monta.** Frontmatter do esqueleto, abertura, conclusões, capítulos na
   ordem, FAQ, fechamento, fontes (só as URLs `[FONTE]` que o leitor abriria:
   órgão, norma, ficha técnica, loja; não a bibliografia inteira) e a seção
   fixa "Como esta peça foi feita", com o dado próprio do dossiê e o que
   `base/DECLARACOES.md` manda declarar. Ela não conta como H2 do sumário.
   A assinatura não prova revisão humana. Compare a declaração com o
   diário: agente que abriu fontes, escolheu dados ou refez contas usou
   IA também na apuração, não só na redação. Se o stub atribui essas
   ações ao editor mas elas não ocorreram, registre a pendência e diga
   que a conferência humana ainda não foi realizada.
2. **Resolve as marcas.** `[ESTIMATIVA]` vira frase ("estimativa sobre a
   ficha técnica, não medição"); `[PISO: exclui X]` vira "sem contar X";
   `[PREMISSA]` vira "no exemplo, com <valor>; o seu está em <onde>";
   `[LIGAR: Cn]` vira uma frase de ponte ou some. Nenhuma marca sobrevive
   no `post.md`, exceto `[LINK PENDENTE: slug]`.
3. **Liga.** Onde um capítulo termina e outro começa sem ponte, uma frase
   de ponte no fim do anterior, nunca no início do seguinte (o primeiro
   parágrafo continua respondendo o H2).
4. **Poda repetição.** O mesmo dado explicado em dois capítulos: fica no
   capítulo dono (o que tem o D em `dados:`), o outro cita em uma frase.
   Sigla expandida na primeira aparição do texto, só nela. Três
   parágrafos que abrem igual: reescreva dois.
5. **Um objeto, um nome, no texto inteiro.** O que era "o split" no C1
   não vira "o aparelho" no C4.
6. **Ritmo, medido.** Rode `scripts/medir-texto posts/<peça>/post.md
   "<query-alvo>"` e olhe o bloco Legibilidade. As réguas: média de até
   20 palavras por frase; ao menos 30% de frases curtas (até 10
   palavras); no máximo 25% de frases longas (21 ou mais); nenhuma acima
   de 45; Flesch-PT de 55 para cima. Fora da régua, o remédio é sempre o
   mesmo: a frase longa vira duas e a enumeração vira lista quando isso
   facilita a leitura. Não acrescente frase vazia ou repita um número só
   para atingir a proporção de curtas. Não conte só as
   acima de 45: a primeira validação desta skill passou nessa conta com
   78% das frases acima de 20 palavras e 5% curtas.
   O bloco SEO do mesmo script cobra o que a busca lê: query no título e
   nas primeiras 100 palavras (é assim que a página diz do que trata),
   description entre 150 e 160 (é o que aparece no resultado), quatro H2
   (sumário), FAQ com as perguntas literais, e a fonte mais forte linkada
   na frase em que é usada (fonte só no rodapé é fonte que leitor e
   buscador não veem sustentando a afirmação). Um `REVER` que some quando
   você isola um bloco de diretiva e roda de novo é do script, não do
   texto: anote em `revisao.md` e siga.
7. **Contradição de número.** Extraia todos os números do `post.md` e
   confira que o mesmo dado tem o mesmo valor em toda ocorrência,
   inclusive nas conclusões e na FAQ:

   ```
   grep -noE 'R\$ ?[0-9][0-9.,]*|[0-9][0-9.,]*\s*(%|°C|kWh|W|BTU|h|dias|meses|anos)' post.md
   ```

   Valor divergente é erro de costura só se um dos dois não está no
   esqueleto; se os dois estão, o esqueleto tem dois valores para o mesmo
   dado e isso volta à etapa 3.
8. **Conta os H2.** Quatro ou mais, ou o sumário não nasce. Nenhum H4.
   Nenhum nível pulado.
9. **Ressalva não evapora.** Cada ressalva que um capítulo faz sobre um
   número aparece também onde o número reaparece (conclusões, FAQ).
10. **Estima `minutos`** e fecha o frontmatter.

## Regras

1. **Costura não cria fato.** Frase de ponte não tem número novo. Se para
   ligar dois capítulos você precisa de um dado, a ligação é "o próximo
   capítulo" e nada mais.
2. **Costura não muda a ordem.** A planta decidiu. Se a ordem parece
   errada lendo inteiro, anote em `revisao.md` como observação para a
   etapa 3 da próxima peça, e siga.
3. **Abertura e conclusões vêm do esqueleto, palavra por palavra nos
   números.** Pode melhorar a frase, não o valor.
4. **Fechamento não resume.** Devolve o critério e o primeiro passo.
   "Em resumo" é sinal de que o fechamento está repetindo as conclusões.
5. **FAQ não repete capítulo.** Se a resposta é o que o C3 já diz, a
   resposta são duas frases e o link para a âncora do C3.

## E no diário

Acrescente a entrada da etapa 5 em `posts/<peça>/diario.md` (gabarito
no fim do SKILL.md): feito, decidido (com a alternativa que perdeu),
descartado, adiado, travou em, tempo. Registre o bloco que virou prosa, a repetição podada e o `REVER` de
legibilidade que ficou com motivo.

Gabarito desta entrada (acrescente ao diário; não substitua entradas):

```markdown
## <data> · etapa 5 · costura
**feito:** <arquivos e resultado>
**decidido:** <escolha, critério e alternativa que perdeu>
**descartado:** <item e motivo, ou nada>
**adiado:** <item e destino/condição, ou nada>
**travou em:** <obstáculo e encaminhamento, ou nada>
**tempo:** <duração medida, estimativa declarada ou não medido>
```

## Checagem antes de fechar

- [ ] Entrada desta etapa no `diario.md`, com os seis campos.
- [ ] Frontmatter completo: titulo, descricao, slug, publicado,
      atualizado, minutos, selo; os três campos de texto entre aspas
      duplas, e `python3 -c 'import yaml,sys; yaml.safe_load(sys.stdin.read().split("---")[1])' < post.md`
      sem erro.
- [ ] `slug` igual ao nome da pasta e à linha do `CLUSTER.md`.
- [ ] Blocos `abertura`, `conclusoes`, `faq`, `fechamento` presentes, na
      sintaxe de `referencias/blocos.md`.
- [ ] Quatro ou mais H2, todos idênticos aos do esqueleto, na mesma ordem.
- [ ] Todo bloco listado em `bloco:` no esqueleto aparece como `:::` no
      `post.md`. Bloco que virou prosa solta volta para o capítulo (etapa
      4), ou o esqueleto registra por que saiu.
- [ ] Nenhuma marca `[ESTIMATIVA]`, `[PISO`, `[PREMISSA]`, `[LIGAR` sobrou.
- [ ] O grep de números não mostra o mesmo dado com dois valores.
- [ ] `scripts/medir-texto` sem `REVER` no bloco Legibilidade, ou cada
      `REVER` com o motivo anotado em `revisao.md` (texto jurídico com
      citação literal longa é motivo; preguiça não é).
- [ ] Seção Fontes só com URLs que existem no dossiê.
- [ ] Seção "Como esta peça foi feita" com o dado próprio e as declarações
      de `base/DECLARACOES.md`.

## Se travar

- Dois capítulos dizem coisas incompatíveis (não é número, é afirmação):
  a costura não decide. Anote os dois trechos em
  `posts/<peça>/revisao.md` sob "Para a etapa 3" e siga sem ligar os dois.
  A etapa 6 vai devolver.
- O texto costurado ficou com menos de quatro H2 porque o esqueleto tinha
  quatro e um capítulo saiu vazio: o capítulo vazio é falha da etapa 4;
  volte lá.
