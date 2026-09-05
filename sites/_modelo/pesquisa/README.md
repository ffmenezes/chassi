# pesquisa/

**O material bruto, antes de virar texto.** Link aberto, número anotado,
print, PDF baixado, transcrição de conversa — o que sustenta uma afirmação
depois, quando você não lembrar mais de onde ela veio.

Nada nesta pasta é lido por código nenhum, e nada daqui é publicável do jeito
que está. É o caderno, não o artigo.

```
pesquisa/
  tarifa-de-energia-2026.md          por assunto, quando serve a várias peças
  como-configurar-o-roteador/        por peça, quando só serve a ela
    medicao-sala-quarto.md
    print-painel-roteador.png
```

## A regra única: fonte e data, na hora

Um número sem fonte e sem data não vira prova depois — vira uma afirmação que
você não consegue defender e que o `base/EDITORIAL.md` não deixa publicar.
Anotar isso custa dez segundos agora e é impossível de reconstruir seis meses
depois.

```markdown
## Tarifa média residencial — Bandeira verde

**valor:** R$ 0,74 / kWh
**fonte:** ANEEL, tabela de tarifas homologadas (link direto para o PDF, não
para a home do órgão)
**consultado em:** 2026-08-14
**muda quando:** revisão tarifária anual — reabrir todo trimestre
**onde já foi usado:** posts/quanto-gasta-um-ar-condicionado/

> Citação literal do trecho que sustenta o número, para não ter que reabrir
> o PDF de 80 páginas na próxima vez.

**o que este dado NÃO diz:** é média nacional; não vale para quem tem tarifa
branca nem para bandeira vermelha.
```

Esse último campo é o que separa apuração de achismo. Todo dado tem um limite,
e quem anotou o limite na hora é quem não vai extrapolá-lo no texto.

## Print e imagem

Se o print vai virar figura no artigo, ele já nasce com o que o **bloco 19**
vai cobrar — legenda, fonte e data — anotados num `.md` do lado. Prova ou
diagrama sem isso não passa na build, e descobrir na hora de publicar é
descobrir tarde.

## Quando isto vira post

Quando a pauta em `pautas/` já não tem "o que ainda falta descobrir". Aí a
pesquisa fica: ela não se apaga depois de usada — é ela que responde
"de onde saiu esse número?" quando um leitor perguntar, ou quando o dado
mudar e você precisar saber quais peças reapurar.
