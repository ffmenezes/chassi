/**
 * A porta escolhe o adaptador pelo que existe no ambiente, nunca por uma
 * variável de "modo". Assim a aula 6 é ligar uma chave, não editar código.
 */
import type { MensagemDeContato } from "../contato";
import { enviarPorNenhum } from "./nenhum";
import { enviarPelaResend } from "./resend";
import { enviarPelaCloudflare } from "./cloudflare";

export type Enviador = (msg: MensagemDeContato) => Promise<boolean>;

export interface AmbienteDeEmail {
  RESEND_API_KEY?: string;
  /** Binding `send_email` do Pages/Workers, quando configurado. */
  EMAIL_BINDING?: unknown;
  EMAIL_CONTATO?: string;
  /** Remetente do adaptador Cloudflare. Precisa ser do domínio do site. */
  EMAIL_REMETENTE?: string;
}

export interface EscolhaDeEmail {
  enviar: Enviador;
  destino: string | null;
  adaptador: "resend" | "cloudflare" | "nenhum";
}

export function escolherEnviador(
  env: AmbienteDeEmail,
  fetchImpl: typeof fetch = fetch,
): EscolhaDeEmail {
  const destino = env.EMAIL_CONTATO ?? null;

  if (env.RESEND_API_KEY && destino) {
    return { enviar: enviarPelaResend(env.RESEND_API_KEY, fetchImpl), destino, adaptador: "resend" };
  }
  if (env.EMAIL_BINDING && destino) {
    const remetente = env.EMAIL_REMETENTE ?? destino;
    return {
      enviar: enviarPelaCloudflare(env.EMAIL_BINDING as never, remetente),
      destino,
      adaptador: "cloudflare",
    };
  }
  return { enviar: enviarPorNenhum, destino: null, adaptador: "nenhum" };
}
