/**
 * Onde o ambiente vira portas. É o único lugar que lê `env`, e por isso o
 * único que não é testável sem runtime — de propósito: tudo o que decide algo
 * mora nas funções puras que ele chama.
 */
import type { PortasDeContato } from "./contato";

export interface Env {
  /** Chave privada do Turnstile. Ausente = verificação inerte. */
  TURNSTILE_SECRET?: string;
  /** Chave da Resend. Ausente = tenta o binding da Cloudflare. */
  RESEND_API_KEY?: string;
  /** Para onde vai o formulário de contato. Ausente = porta de e-mail inerte. */
  EMAIL_CONTATO?: string;
}

export function portasDeContato(_env: Env, _request: Request): PortasDeContato {
  // Preenchido pelas Tasks 6 (e-mail) e 7 (verificação humana).
  return { verificar: async () => true, enviar: async () => false, destino: null };
}
