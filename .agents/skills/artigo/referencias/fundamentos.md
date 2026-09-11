# De onde vêm as decisões, e o que elas não provam

Consulte ao revisar o método ou explicar sua origem; não é leitura
obrigatória por artigo. Conferido em 2026-09-11. O acervo de pesquisa é
privado e não acompanha esta skill; aqui ficam as decisões generalistas.

## Política pública e escolha editorial

A [política de spam do Google](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content)
define abuso em escala pelo propósito de manipular rankings e pelo pouco
valor para o leitor. O método de produção, humano ou automatizado, não
resolve essa avaliação sozinho. A política prevê perda de visibilidade;
não publica um número seguro de artigos por mês nem um veto isolado a H2
recorrentes.

A [orientação sobre IA generativa](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
admite usos úteis da ferramenta e pede exatidão, qualidade e relevância.
A orientação de [conteúdo útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
recomenda clareza sobre quem produziu, como e por quê, incluindo método
de teste e contexto de automação quando cabível.

O [Dashboard oficial registra uma atualização em agosto de 2026](https://status.search.google.com/incidents/LEubPCm2octf2uMqCFKE).
Esse registro confirma o evento, não a causa das quedas de sites narradas
por operadores. Depoimentos e análises locais motivaram cautela com escala,
mas não são experimento causal nem descrição dos sistemas internos.

Dado próprio em toda peça, assinatura de pessoa real, esqueleto não
intercambiável, meta semanal, proporção de frases curtas e tamanho de
description são escolhas editoriais do chassi. Não são condições
suficientes para rankear, nem cotas publicadas pelo Google.

## Destilação do acervo

| Origem | Decisão absorvida | Onde executar |
|---|---|---|
| Skill de artigo do projeto de origem | Número rastreável, dossiê separado da prosa, esqueleto congelado, correção cirúrgica | etapas 2, 3, 4 e 6 |
| Will Binder, workshop de conteúdo | Obsessões do leitor, ganho por eixo de valor, pilar que merece existir, voz reconhecível | etapas 0 e 1; TOM na etapa 4 |
| Luana França, relatos de produção | Promessa que a página entrega, vocabulário de busca, execução e aprendizado pelo publicado | etapas 0, 3 e 6; estado/APRENDIZADOS.md quando houver resultado real |
| Bruno Faggion, conteúdo e mercado | Crença concorrente como ideia; explicitar o que a peça melhora frente às alternativas | gerador 3 e comparação das finalistas na etapa 0; pauta |
| Filipe Boni, aula sobre tese e apuração | Tese verificável, três ataques, contraditório forte, descarte documentado | etapas 1, 2 e 6; diário |
| Luide, histórias de trabalho real | Relato com experiência demonstrável, consequências e limites; nunca inventar dificuldade | planta relato; skill pitaco para contribuição real do autor |

As seis plantas adaptam esses materiais para artigo de busca. Ritmo mensal
de pilar/veredito vem do cruzamento editorial dos materiais, não de uma lei
de SEO. Formatos de vídeo, suspense, thumbnail, cotas de palavras e lavagem
por tradução ficaram de fora. A contribuição do autor não autoriza inventar
biografia ou experiência.

## Limite da validação

Uma nota 9 do agente prova somente os critérios executados no ensaio e
descritos em seu relatório. Nota do método e nota da peça são separadas:
um procedimento corrigido não melhora retroativamente um artigo antigo.
Não inferir ranking, receita ou sustentabilidade da cadência de um site
que ainda não foi publicado.

Os scripts são auxiliares, não leitores semânticos. A lista de palavras
vazias de `medir-texto`, por exemplo, não distingue a preposição "das" da
sigla "DAS" em toda query composta. Confira a intenção e as siglas também
à mão: relatório verde não prova que a promessa do título está completa.

O circuito contínuo de métricas, manutenção e consolidação ainda precisa
de operação publicada: dados reais entram em `estado/METRICAS.csv` e
conclusões em `estado/APRENDIZADOS.md`; sem dados, registre a ausência.
Isso pode informar novas candidatas, sem inventar campeões ou crescimento.
O método presente entrega até `pronto` e registra quando reapurar.

Continuam em aberto: parser `post.md → blocos`, lugar das imagens do
participante e bloco que acople calculadora a gráfico. Uma prévia de
validação não implementa essas três decisões no produto.
