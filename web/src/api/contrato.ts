/**
 * A porta de transporte é o CONTRATO HTTP, não o runtime.
 *
 * A página fala com um caminho; quem atende pode ser Pages Functions hoje e um
 * Worker amanhã (a Cloudflare empurra Pages -> Workers com static assets), sem
 * que um componente mude. `PUBLIC_API_BASE` vazio significa mesma origem.
 */
export const CAMINHOS = {
  contato: "/api/contato",
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
