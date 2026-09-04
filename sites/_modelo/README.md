# _modelo

Este é o esqueleto de um site novo — pastas e stubs que espelham a doutrina de
site da holding, preenchidos como **perguntas** em vez de regras prontas.
Copie esta pasta, renomeie para o slug do seu site, e responda os stubs na
ordem abaixo.

> Nenhuma regra mora neste README. Cada arquivo em `base/` e `estado/` é dono
> único do seu domínio — por isso não existe precedência a resolver aqui: para
> saber a resposta de um domínio, vá direto ao arquivo dono dele, nunca a este
> índice.

## Índice — pergunta → arquivo

| Pergunta | Arquivo |
|---|---|
| Sobre o que é este site, e o que ele recusa cobrir? | `base/TERRITORIO.md` |
| Quem lê, o que já tentou, o que digita no Google? | `base/LEITOR.md` |
| Por que este site existe, o que seria fracasso? | `base/META.md` |
| Como o texto soa? | `base/TOM.md` |
| De que lugar o texto fala, em cada tipo de peça? | `base/POSTURAS.md` |
| Quem assina, com que autoridade? | `base/AUTOR.md` |
| Como o site se sustenta, o que ele nunca vende? | `base/MONETIZACAO.md` |
| Quem já ocupa o espaço, o que fazem mal? | `base/CONCORRENTES.md` |
| Que fontes primárias existem no nicho? (fonte, não regra) | `base/PROVAS.md` |
| O que o leitor levaria em troca do e-mail? | `base/ISCAS.md` |
| Como as imagens se parecem? | `base/ILUSTRACAO.md` |
| Por que este estilo visual, qual a postura? (prosa, não configuração) | `base/DESIGN.md` |
| O que o texto pode e não pode dizer? | `base/EDITORIAL.md` |
| O que precisa estar declarado ao leitor? | `base/DECLARACOES.md` |
| Que peças existem, com que slug e query-alvo? | `estado/CLUSTER.md` |
| Por que esse conjunto de peças vai funcionar? | `estado/TESE.md` |
| Quando cada peça sai? | `estado/CALENDARIO.md` |
| O que o funil já aprendeu? | `estado/APRENDIZADOS.md` |
| Como as métricas evoluem por peça? | `estado/METRICAS.csv` |

## Por que stubs, e não uma entrevista guiada

No workshop original essa entrevista seria conduzida por uma ferramenta de IA
que não vai para este repositório público. Os stubs são o roteiro que a
substitui — e substituem melhor: ficam versionados aqui, não viram slide que
ninguém acha depois. Responda cada arquivo como uma entrevista com você
mesmo; apague as perguntas quando a resposta estiver de pé.

## Layout

```
sites/<seu-site>/
  README.md
  base/       o que o artigo consulta antes de escrever
  estado/     o registro da operação (cluster, tese, calendário, métricas)
  pautas/     candidatas e a pauta de cada peça
  pesquisa/   apuração solta, antes de virar post
  posts/      um diretório por peça publicada
```
