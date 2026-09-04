import type { MensagemDeContato } from "../contato";

/**
 * ADAPTADOR DORMENTE NESTE RUNTIME.
 *
 * O binding `send_email` do Cloudflare Email Routing NÃO EXISTE em Pages
 * Functions — só em Workers standalone. Confirmado em quatro fontes antes de
 * escrever este arquivo. Por isso o v0 do chassi liga o adaptador Resend
 * (`resend.ts`), e este aqui nunca é escolhido em produção enquanto o site
 * rodar em Pages: `escolherEnviador`, em `porta.ts`, só chega até aqui se
 * `EMAIL_BINDING` vier preenchido no `Env`, e nada no Pages de hoje preenche
 * essa chave.
 *
 * O código abaixo não é morto: é o par de `worker/contato.ts`, o adaptador de
 * runtime que a Task 5 deixou pronto e igualmente inerte. No dia em que a
 * Cloudflare empurrar a migração Pages -> Workers com static assets, ligar
 * e-mail vira configurar o binding no `wrangler.toml` e trocar de adaptador
 * aqui — não reescrever handler nem reabrir este arquivo.
 */
interface BindingDeEmail {
  send(mensagem: unknown): Promise<void>;
}

/**
 * MIME cru, montado à mão de propósito: são quinze linhas contra uma
 * dependência nova num projeto cuja doutrina cobra justificativa para cada
 * coisa que entra.
 */
function mime(msg: MensagemDeContato, remetente: string): string {
  return [
    "From: " + remetente,
    "To: " + msg.para,
    "Reply-To: " + msg.responderPara,
    "Subject: " + msg.assunto,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="utf-8"',
    "",
    msg.corpo,
  ].join("\r\n");
}

export function enviarPelaCloudflare(binding: BindingDeEmail, remetente: string) {
  return async (msg: MensagemDeContato): Promise<boolean> => {
    try {
      const { EmailMessage } = await import("cloudflare:email");
      await binding.send(new EmailMessage(remetente, msg.para, mime(msg, remetente)));
      return true;
    } catch {
      return false;
    }
  };
}
