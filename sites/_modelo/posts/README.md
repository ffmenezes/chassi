# posts/

**Um diretório por peça, nomeado com o slug dela** — o mesmo slug que está na
tabela do `estado/CLUSTER.md`. Se os dois divergirem, quem manda é o
`CLUSTER.md`, e o diretório é que está errado.

```
posts/
  como-configurar-o-roteador/
    comentarios.json      ← a build LÊ este
  quanto-gasta-um-ar-condicionado/
    comentarios.json
  vale-a-pena-trocar-de-plano/   ← sem comentário ainda, e isso é normal
```

## O único arquivo daqui que a build abre

`comentarios.json` é o que o **bloco 18** publica. O caminho é fixo e está em
`web/src/comentarios.ts`:

```
sites/<seu-slug>/posts/<slug-da-peça>/comentarios.json
```

O desenho, que é o ponto todo:

> **O banco serve a moderação. O repo serve o leitor.**

O leitor escreve num formulário que cai num banco. Nada aparece no site até
alguém aprovar — e **aprovar grava o arquivo aqui dentro**. A build lê o
arquivo, não o banco: comentário muda uma vez por semana, e consultar banco a
cada visita seria dez mil leituras idênticas. Assado no build, o comentário
sai no HTML inicial — que é o que o crawler de IA lê, porque ele não executa
JavaScript — sem custo por visita e sem o bloco crescer depois do load, que
seria CLS na página que vive de anúncio. De brinde: o que está publicado se
revisa em diff, e o histórico de moderação é o `git log`.

> A fila de moderação ainda não existe (D1, schema e studio chegam na aula de
> comentários). Até lá, este arquivo se escreve à mão — ou não existe, que é
> o estado normal de quase toda peça.

### O formato

```json
{
  "versao": 1,
  "itens": [
    {
      "id": "cmt_8f21c0",
      "autor": "Cleide",
      "em": "2026-08-11",
      "texto": "Segui o passo 3 e o sinal no quarto dos fundos subiu de 2 para 4 barras. O que eu não entendi foi a parte do canal fixo.",
      "resposta": {
        "em": "2026-08-12",
        "texto": "Canal fixo só vale se o vizinho não mudar o dele. Se voltar a cair, deixa em automático."
      }
    },
    {
      "id": "cmt_a304b7",
      "autor": "Jorge M.",
      "em": "2026-07-30",
      "texto": "Faltou dizer que em roteador de operadora essa tela vem bloqueada."
    }
  ]
}
```

- **`versao`** — `1`. É a versão do formato em disco, não do arquivo. Se um
  dia o formato mudar, é ela que faz a build reclamar em vez de publicar
  página capenga.
- **`id`** — o mesmo id da linha no banco, para a moderação reencontrar o que
  publicou. **Não aparece na página.**
- **`em`** — ISO `YYYY-MM-DD`. **Dia de calendário, não instante:** a data
  vira `11/08/2026` no build sem passar por fuso, que é o bug que faz dia 1º
  virar o último do mês anterior.
- **`resposta`** — opcional, a resposta da casa. Mesma forma, mesma data.
- **Ordem não importa.** O código ordena do mais recente para o mais antigo.

O que sai na página é **menor** que o que está no banco, de propósito: não
existe e-mail, não existe IP e não existe id no bloco. O que o leitor vê é
autor, data, texto e a resposta.

### O que quebra a build, e o que não

| Situação | O que acontece |
|---|---|
| Diretório sem `comentarios.json` | Lista vazia. É o normal, não é falha. |
| JSON inválido | **Build quebra**, com o slug da peça no erro. |
| `versao` diferente de `1` | **Build quebra**: o formato mudou embaixo. |

Publicar a página sem a conversa que já estava lá é pior que não publicar —
por isso arquivo ilegível derruba a build em vez de virar lista vazia
silenciosa.

## O resto da peça

O encanamento `post.md → blocos` **ainda não existe**. Enquanto ele não
chegar, o texto do artigo não tem forma definida aqui: escreva onde preferir
e não invente um formato que o upstream vai ter que contradizer depois.

O que já dá para deixar pronto neste diretório, e que nenhum código lê:
imagens da peça, prints da apuração que viraram figura, e o rascunho. Lembre
que toda figura de prova precisa de legenda, fonte e data (bloco 19), e é
mais barato anotar isso agora, do lado do arquivo, do que reencontrar seis
meses depois.
