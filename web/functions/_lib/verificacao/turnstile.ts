/**
 * O Turnstile é quem decide se do outro lado tem gente.
 *
 * Ele foi escolhido em vez de confirmação de e-mail porque a moderação já é o
 * portão do que é publicado: confirmar e-mail não compraria segurança de
 * conteúdo, e cobraria uma cerimônia de dois passos de um leitor que chegou do
 * Google e não conhece o site.
 */

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Falha fechada, de propósito: Turnstile fora do ar recusa o comentário em vez
 * de deixar passar. Anti-spam que abre quando quebra não é anti-spam, e o custo
 * do lado errado aqui é a caixa de entrada inutilizável por semanas.
 */
export function verificarPeloTurnstile(segredo: string, fetchImpl: typeof fetch = fetch) {
  return async (token: string, ip: string | null): Promise<boolean> => {
    if (!token) return false;

    const corpo = new URLSearchParams({ secret: segredo, response: token });
    if (ip) corpo.set("remoteip", ip);

    try {
      const resposta = await fetchImpl(SITEVERIFY, { method: "POST", body: corpo });
      const dados = (await resposta.json()) as { success?: boolean };
      return dados.success === true;
    } catch {
      return false;
    }
  };
}
