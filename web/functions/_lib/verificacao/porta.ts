/**
 * A porta escolhe o adaptador pelo que existe no ambiente, nunca por uma
 * variável de "modo". Assim configurar anti-spam é ligar uma chave, não
 * editar código.
 */
import { verificarPorNenhum } from "./nenhum";
import { verificarPeloTurnstile } from "./turnstile";

export type Verificador = (token: string, ip: string | null) => Promise<boolean>;

export interface AmbienteDeVerificacao {
  /** Chave privada do Turnstile. Ausente = verificação inerte. */
  TURNSTILE_SECRET?: string;
}

export interface EscolhaDeVerificacao {
  verificar: Verificador;
  adaptador: "turnstile" | "nenhum";
}

export function escolherVerificador(
  env: AmbienteDeVerificacao,
  fetchImpl: typeof fetch = fetch,
): EscolhaDeVerificacao {
  if (env.TURNSTILE_SECRET) {
    return { verificar: verificarPeloTurnstile(env.TURNSTILE_SECRET, fetchImpl), adaptador: "turnstile" };
  }
  return { verificar: verificarPorNenhum, adaptador: "nenhum" };
}
