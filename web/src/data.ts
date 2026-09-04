/**
 * Dia de calendário, e só isso.
 *
 * Mora fora de `comentarios.ts` porque não é assunto de comentário: a data de
 * `dateModified` no cabeçalho do artigo pede a mesma conversão, e a alternativa
 * era a segunda cópia da regra de fuso — que é onde ela sempre se perde.
 */

/**
 * `2026-08-01` → `01/08/2026`, na mão.
 *
 * `new Date("2026-08-01")` é meia-noite **UTC**, e formatado em UTC-3 vira
 * 31/07. Dia de calendário não tem fuso: então nunca passa por `Date`.
 */
export function dataBR(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`data "${iso}" não está em YYYY-MM-DD.`);
  return `${m[3]}/${m[2]}/${m[1]}`;
}
