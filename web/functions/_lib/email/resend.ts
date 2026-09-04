import type { MensagemDeContato } from "../contato";

const API = "https://api.resend.com/emails";

/**
 * O remetente sai do domínio do SITE, não do domínio da ferramenta de envio.
 * E-mail sobre o blog chegando de um domínio que o leitor nunca viu é o
 * caminho curto para a caixa de spam.
 *
 * Enquanto o domínio não estiver verificado na Resend, use o remetente de
 * onboarding — ele só entrega para o e-mail do dono da conta, que é
 * exatamente o caso do formulário de contato.
 */
export function enviarPelaResend(chave: string, fetchImpl: typeof fetch = fetch) {
  return async (msg: MensagemDeContato): Promise<boolean> => {
    try {
      const r = await fetchImpl(API, {
        method: "POST",
        headers: {
          authorization: "Bearer " + chave,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: "Contato <onboarding@resend.dev>",
          to: [msg.para],
          reply_to: msg.responderPara,
          subject: msg.assunto,
          text: msg.corpo,
        }),
      });
      return r.ok;
    } catch {
      return false;
    }
  };
}
