---
name: atualizar-template
description: Use quando o dono quiser trazer correções e novidades do chassi (o repositório público de origem) para o repositório dele — "atualizar o template", "puxar do upstream", "o que mudou no chassi", "tem versão nova?". Conduz arquivo por arquivo, e nunca sobrescreve trabalho local sem mostrar os dois lados.
---

# Atualizar a partir do chassi

O chassi é a origem deste repositório. Ele recebe correção de bloco, estilo
novo, adaptador novo e página nova ao longo do curso.

**A atualização não é merge.** É `git checkout upstream/main -- <arquivo>`,
arquivo por arquivo. Isso não conflita nunca — e por isso mesmo **sobrescreve
em silêncio**. Sua função é impedir que isso aconteça sem o dono saber.

## O procedimento

1. Rode `./scripts/atualizar`. Ele imprime os commits novos e três listas:
   `NOVOS`, `SEGUROS` e `CONFLITO`.
2. **NOVOS e SEGUROS:** diga quantos são, resuma em uma frase o que mudou (use
   as mensagens de commit) e ofereça `./scripts/atualizar --aplicar-seguros`.
   Não peça confirmação arquivo a arquivo aqui — é ruído.
3. **CONFLITO:** um de cada vez. Para cada arquivo, mostre os dois diffs:
   - `git diff <base> HEAD -- <arquivo>` — o que o dono fez
   - `git diff <base> upstream/main -- <arquivo>` — o que o upstream fez
   Diga o que se perde em cada escolha e **recomende**. Só então pergunte.
4. Depois de aplicar: `cd web && npm test && npm run build`. Se quebrar,
   conserte ou reverta antes de commitar.
5. Commit único, com a lista do que foi puxado no corpo da mensagem.

## O que o script já resolve sozinho, sem perguntar

`scripts/atualizar` nunca oferece para puxar os caminhos que são do dono:
`sites/**`, `web/src/meu/**`, o site dele em `web/src/sites/<slug>.ts`, e as
três páginas de identidade — `web/src/pages/{index,sobre,contato}.astro` —
que nascem em branco, com um roteiro de perguntas embutido, para ele
preencher. Identidade não se copia: o upstream entrega essas três uma vez
(igual a `exemplo.ts`) e a partir dali elas são do dono, para sempre. Se
aparecerem em CONFLITO ou SEGUROS mesmo assim, é bug no script, não decisão a
mediar aqui — não ofereça puxar, aponte o problema.

As quatro páginas jurídicas (`privacidade`, `cookies`, `termos`,
`direitos-autorais`) são o caso oposto e continuam vindo do upstream para
sempre: são alimentadas por configuração, o texto é igual para todo mundo, e
o dono nunca as abre.

## Quando aparecer conflito num arquivo do upstream

Isso quase sempre significa que o dono editou um arquivo que não é dele —
tipicamente um bloco `.astro`, para mudar visual. **Diga isso, e diga o
caminho certo:** a cara própria sai de até 6 tokens em
`web/src/sites/<slug>.ts`, e enquanto o desvio for valor de variável o
arquivo do upstream volta a ser puxável para sempre. Ofereça migrar a
customização para tokens.

## O que nunca fazer

- Nunca `git merge upstream/main`. As fronteiras deste repositório foram
  desenhadas para puxada por arquivo; merge traz de volta o conflito que o
  desenho evita.
- Nunca puxar um arquivo da lista `CONFLITO` sem mostrar os dois diffs antes.
- Nunca tocar em `sites/**`, `web/src/meu/**`, `web/src/sites/<slug>.ts` (o do
  dono) ou nas três páginas de identidade: o upstream não escreve neles, e o
  script já os exclui.
