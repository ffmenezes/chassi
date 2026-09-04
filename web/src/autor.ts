/**
 * Quem assina o artigo, e quando o bloco 22 tem direito de nascer.
 *
 * A fonte é o `sites/<site>/base/AUTOR.md`, congelado. Este módulo não lê o arquivo:
 * ele guarda a **forma** dele e o julgamento sobre ela, para que o gate Autor da
 * fase 8 exista também em tempo de render.
 *
 *   O GATE DA FASE 8 BLOQUEIA A PUBLICAÇÃO. ESTE MÓDULO IMPEDE A PÁGINA.
 *
 * A diferença importa porque as duas coisas falham em momentos diferentes. Um
 * campo com `[DEFINIR]` que escapa da revisão do dono não pode virar byline de
 * placeholder na tela do leitor: byline meia-boca é pior que byline nenhum,
 * porque a página passa a afirmar autoria que ela não tem.
 *
 * Por isso o julgamento devolve **a pendência escrita**, e não um booleano: quem
 * for consertar precisa saber qual campo falta, e o booleano perde exatamente
 * essa informação.
 */

/** Os campos são os do `base/AUTOR.md`, com os mesmos nomes, de propósito. */
export interface Autor {
  /** Nome e sobrenome reais. */
  nome: string;
  /** Sai do nome. Vira `/autores/{slug}` e o `@id` do nó `Person`. */
  slug: string;
  /** O que a pessoa faz, de verdade. */
  jobTitle: string;
  /** Duas ou três frases de credencial ligada ao nicho. */
  description: string;
  /** Foto real. Avatar gerado, banco de imagem e logo não valem — e isso é o
   *  olho de quem revisa, não código: aqui só se verifica que existe caminho. */
  image: string;
  /** Perfis públicos verificáveis. Lista vazia é uma resposta; ausente é pendência. */
  sameAs: string[];
  /**
   * A URL da página do autor, quando ela existir. Enquanto a `/autores/{slug}`
   * não estiver no ar em site nenhum, o nome sai como texto — link para 404 é
   * pior que ausência de link.
   */
  perfil?: string;
}

/** Os campos sem os quais não há byline. `sameAs` é tratado à parte: lá o que
 *  se cobra é a declaração, e a lista vazia já é uma. */
const OBRIGATORIOS = ["nome", "slug", "jobTitle", "description", "image"] as const;

/** O que "Equipe" e "Redação" têm em comum: não são pessoa. Sem acento e em
 *  minúsculas, porque `A REDAÇÃO` e `Redacao` são a mesma tentativa. */
const COLETIVOS = ["equipe", "redacao", "time", "staff", "editorial", "colaboradores"];

const semAcento = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** O placeholder do `AUTOR.md`, na forma em que ele aparece por lá. */
const ehPlaceholder = (v: string) => v.includes("[DEFINIR");

/**
 * A pendência que impede este autor de assinar, escrita, ou `null` se ele pode.
 *
 * Uma por vez, na ordem dos campos: quem conserta conserta uma e roda de novo,
 * e a lista inteira de uma vez só é ruído quando o `AUTOR.md` acabou de nascer
 * com todos os campos em branco.
 */
export function pendenciaDoAutor(a?: Autor | null): string | null {
  if (!a) return "não há autor: preencha o base/AUTOR.md do site.";

  for (const campo of OBRIGATORIOS) {
    const valor = a[campo];
    if (typeof valor !== "string" || valor.trim() === "") {
      return `${campo} vazio no AUTOR.md.`;
    }
    if (ehPlaceholder(valor)) {
      return `${campo} ainda com placeholder no AUTOR.md.`;
    }
  }

  const palavras = a.nome.trim().split(/\s+/);
  if (palavras.some((p) => COLETIVOS.includes(semAcento(p)))) {
    return "nome não é pessoa real: byline é quem escreveu, não o coletivo.";
  }
  if (palavras.length < 2) {
    return "nome sem sobrenome: byline é pessoa inteira.";
  }

  if (!Array.isArray(a.sameAs)) {
    return "sameAs não declarado no AUTOR.md: lista vazia é uma resposta, ausência não.";
  }

  return null;
}

/** O mesmo julgamento na forma que o componente usa, guardando o tipo. */
export function autorAssina(a?: Autor | null): a is Autor {
  return pendenciaDoAutor(a) === null;
}
