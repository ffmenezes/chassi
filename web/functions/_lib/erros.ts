/**
 * Porta de erros, endereçada e com um adaptador só.
 *
 * Exceção declarada à regra "só vira porta o que tem aula marcada": esta não
 * tem. Entra assim mesmo porque custa quinze linhas, e porque o adaptador que
 * faltaria (Sentry) seria JS de terceiro no navegador — que a doutrina de
 * infra proíbe sem justificativa. O que pode falhar de verdade são as
 * Functions, e para elas o log da Cloudflare já é de graça e sem SDK.
 */
export function registrarErro(erro: unknown, contexto: Record<string, unknown> = {}): void {
  const detalhe = erro instanceof Error ? erro.stack ?? erro.message : String(erro);
  console.error("[erro]", JSON.stringify(contexto), detalhe);
}
