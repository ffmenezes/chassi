/**
 * A porta escolhe o adaptador pelo que o SITE declara, não pelo ambiente:
 * analytics é decisão de conteúdo (qual site mede o quê), diferente de
 * e-mail e verificação, que a porta liga por variável disponível.
 *
 * O acoplamento que interessa: a página de cookies (Task 11) lê
 * `analyticsDoSite(site)` e monta a lista de cláusulas a partir do adaptador
 * ativo. Trocar o `analytics` do site atualiza a política sozinho — ligar
 * PostHog na aula 5 não deixa esquecer a cláusula nova, que é exatamente o
 * esquecimento que gera multa.
 */
import type { Site } from "../sites/tipos";
import { nenhum } from "./nenhum";
import { cloudflare } from "./cloudflare";
import { ga4 } from "./ga4";
import { posthog } from "./posthog";

export interface ClausulaDeCookie {
  nome: string;
  finalidade: string;
  duracao: string;
}

export interface AdaptadorDeAnalytics {
  id: string;
  /** Declara cláusula se e só se usa cookie — invariante coberta em teste. */
  usaCookie: boolean;
  clausulas: ClausulaDeCookie[];
  /** `null` quando falta o id da conta: sem conta, nenhum script entra na página. */
  script(idDaConta: string): string | null;
}

export const ADAPTADORES: Record<string, AdaptadorDeAnalytics> = {
  nenhum,
  cloudflare,
  ga4,
  posthog,
};

export function analyticsDoSite(site: Site): AdaptadorDeAnalytics {
  return ADAPTADORES[site.analytics ?? "nenhum"] ?? ADAPTADORES.nenhum;
}
