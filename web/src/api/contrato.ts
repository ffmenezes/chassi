/**
 * A porta de transporte é o CONTRATO HTTP, não o runtime.
 *
 * A página fala com um caminho; quem atende pode ser Pages Functions hoje e um
 * Worker amanhã (a Cloudflare empurra Pages -> Workers com static assets), sem
 * que um componente mude. `PUBLIC_API_BASE` vazio significa mesma origem.
 */
export const CAMINHOS = {
  contato: "/api/contato",
  enquete: "/api/enquete",
  avaliacao: "/api/avaliacao",
  checklist: "/api/checklist",
  newsletter: "/api/newsletter",
} as const;

const BASE = import.meta.env.PUBLIC_API_BASE ?? "";

export const urlDaApi = (caminho: string): string => BASE + caminho;

export interface PedidoDeContato {
  nome: string;
  email: string;
  mensagem: string;
  /** Slug do site, para o remetente sair do domínio certo. */
  site: string;
  /** Token do Turnstile. Vazio quando a verificação está inerte. */
  token: string;
}

/**
 * Bloco 11 — um voto de enquete.
 *
 * Nenhuma das três interfaces abaixo tem `token`: são feixes de dados de
 * segundo plano, não formulário que um humano preenche e um bot tenta imitar
 * — quem já barra o que importa é o piso de amostra da própria enquete.
 * A porta de dados está inerte (adaptador `nenhum`, nenhuma Function atende
 * este caminho ainda); o componente envia mesmo assim, por trás de uma
 * guarda que ignora silenciosamente a ausência de resposta. `localStorage`
 * já é a fonte da verdade no navegador de quem votou — isto aqui é só o que
 * falta para uma apuração de verdade existir, no dia em que a porta acordar.
 */
export interface PedidoDeVoto {
  site: string;
  slug: string;
  /** Nome/id da enquete na página, para quando houver mais de uma. */
  enquete: string;
  /** Índice da opção na lista publicada — texto muda com correção editorial,
   *  índice não. */
  opcao: number;
}

/** Bloco 12 — uma resposta de avaliação ("isso respondeu sua dúvida?"). */
export interface PedidoDeAvaliacao {
  site: string;
  slug: string;
  resposta: "sim" | "nao";
  /** Só existe quando `resposta` é "nao": é a saída mais valiosa do bloco,
   *  e mesmo assim opcional — "não" sozinho já é resposta completa. */
  comentario?: string;
}

/** Bloco 8 — um item de checklist marcado ou desmarcado. Um pedido por item,
 *  nunca a lista inteira: assim desmarcar não exige reconciliar array
 *  nenhum do lado de quem um dia atender esta porta. */
export interface PedidoDeChecklist {
  site: string;
  slug: string;
  /** Rótulo/id do checklist na página, para quando houver mais de um. */
  checklist: string;
  /** Índice do item na lista publicada. */
  item: number;
  marcado: boolean;
}

/**
 * Bloco 25 — uma assinatura de newsletter.
 *
 * `functions/api/newsletter.ts` ainda não existe neste repositório (só há
 * `functions/api/contato.ts`); o componente já fala com `CAMINHOS.newsletter`
 * mesmo assim, em prévia, para o dia em que a Function chegar não exigir
 * tocar em `Newsletter.astro`.
 */
export interface PedidoDeNewsletter {
  site: string;
  email: string;
  /** A frase aceita, não um booleano — mesmo motivo documentado em
   *  `consentimento.ts`: a frase muda com o tempo, e o que a pessoa aceitou
   *  foi a frase daquele dia. Precisa ser exatamente `CONSENTIMENTO_NEWSLETTER`
   *  no momento do envio, nunca reescrita aqui. */
  consentimento: string;
  /** Token do Turnstile. Vazio quando a verificação está inerte. */
  token: string;
}
