/**
 * Onde o ambiente vira portas. É o único lugar que lê `env`, e por isso o
 * único que não é testável sem runtime — de propósito: tudo o que decide algo
 * mora nas funções puras que ele chama.
 */
import type { PortasDeContato } from "./contato";
import { escolherEnviador } from "./email/porta";

export interface Env {
  /** Chave privada do Turnstile. Ausente = verificação inerte. */
  TURNSTILE_SECRET?: string;
  /** Chave da Resend. Ausente = tenta o binding da Cloudflare. */
  RESEND_API_KEY?: string;
  /** Para onde vai o formulário de contato. Ausente = porta de e-mail inerte. */
  EMAIL_CONTATO?: string;
  /** Binding `send_email` do Pages/Workers, quando configurado. */
  EMAIL_BINDING?: unknown;
  /** Remetente do adaptador Cloudflare. Precisa ser do domínio do site. */
  EMAIL_REMETENTE?: string;
}

export function portasDeContato(env: Env, _request: Request): PortasDeContato {
  const email = escolherEnviador(env);
  return {
    verificar: async () => true, // a Task 7 substitui
    enviar: email.enviar,
    destino: email.destino,
  };
}
