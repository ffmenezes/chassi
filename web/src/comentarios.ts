/**
 * O que o bloco 18 publica, e de onde isso vem.
 *
 * O leitor escreve num formulário que cai num banco. Nada do que ele escreveu
 * aparece no site até alguém aprovar na fila do studio, e **aprovar grava um
 * arquivo aqui dentro do repo**. Este módulo lê esse arquivo no build.
 *
 * A consequência de desenho, que é o ponto todo:
 *
 *   O BANCO SERVE A MODERAÇÃO. O REPO SERVE O LEITOR.
 *
 * Comentário só muda quando a moderação aprova, então consultar banco a cada
 * visita seria fazer dez mil leituras idênticas de um dado que mudou uma vez na
 * semana. Assado no build, o comentário sai no HTML inicial — que é o que o
 * crawler de IA lê, porque ele não executa JavaScript —, sem custo por visita e
 * sem o bloco crescer depois do load, que seria CLS na página que vive de
 * anúncio.
 *
 * Vem de graça junto: o que está publicado se revisa em diff, e o histórico de
 * moderação é o `git log`.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { dataBR } from "./data";

/** web/src/ → raiz do repo */
const RAIZ = fileURLToPath(new URL("../../", import.meta.url));

export const ARQUIVO = "comentarios.json";

/** A versão do formato em disco. Muda quando o formato muda, e a build reclama. */
export const VERSAO = 1;

export interface RespostaPublicada {
  /** ISO `YYYY-MM-DD`. Dia de calendário, não instante. */
  em: string;
  texto: string;
}

export interface ComentarioPublicado {
  /** O mesmo id da linha no banco, para a moderação reencontrar o que publicou. */
  id: string;
  autor: string;
  em: string;
  texto: string;
  resposta?: RespostaPublicada;
}

export interface ArquivoDeComentarios {
  versao: number;
  itens: ComentarioPublicado[];
}

/**
 * O que o bloco recebe. É deliberadamente menor que o que está no banco: aqui
 * não existe e-mail, não existe IP e não existe id.
 */
export interface Comentario {
  autor: string;
  quando: string;
  texto: string;
  resposta?: { texto: string; quando: string };
}

/** Do formato em disco para o que o bloco monta. Puro, e é onde a data vira BR. */
export function paraBloco(arquivo: ArquivoDeComentarios): Comentario[] {
  return arquivo.itens
    .slice()
    /* mais recente primeiro; ISO ordena como string */
    .sort((a, b) => (a.em < b.em ? 1 : a.em > b.em ? -1 : 0))
    .map((c) => ({
      autor: c.autor,
      quando: dataBR(c.em),
      texto: c.texto,
      ...(c.resposta ? { resposta: { texto: c.resposta.texto, quando: dataBR(c.resposta.em) } } : {}),
    }));
}

/**
 * Os comentários aprovados de um post. Sem arquivo, lista vazia — o normal é o
 * post não ter comentário nenhum, e isso não é falha de build.
 *
 * O que **é** falha de build: arquivo ilegível ou de versão desconhecida.
 * Publicar a página sem a conversa que já estava lá é pior que não publicar.
 */
export function carregarComentarios(site: string, slug: string, raiz: string = RAIZ): Comentario[] {
  const arquivo = path.join(raiz, "sites", site, "posts", slug, ARQUIVO);

  let cru: string;
  try {
    cru = readFileSync(arquivo, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  let dados: ArquivoDeComentarios;
  try {
    dados = JSON.parse(cru) as ArquivoDeComentarios;
  } catch (err) {
    throw new Error(`[comentarios] ${site}/${slug}: ${ARQUIVO} não é JSON válido (${(err as Error).message}).`);
  }

  if (dados.versao !== VERSAO) {
    throw new Error(
      `[comentarios] ${site}/${slug}: versão ${dados.versao} do ${ARQUIVO}, e esta build lê ${VERSAO}.`,
    );
  }

  return paraBloco(dados);
}
