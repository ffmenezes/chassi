/**
 * PostHog. Existe no mapa, mas INERTE no v0: nenhum site do chassi o declara.
 *
 * Não é o padrão do dia 1 por dois motivos: o peso do seu JS de funil contra
 * a restrição de HTML inicial (`infra.md` exige corpo e JSON-LD sem depender
 * de script), e porque na aula 2 não existe funil de leitura para medir —
 * ele chega a fazer sentido só a partir da aula 5 (iscas e microferramentas),
 * quando há isca para funilar.
 *
 * Concatenação com `+`, nunca template literal — ver o comentário em `ga4.ts`.
 * O carregador oficial do PostHog é minificado; aqui vai só o essencial
 * (import do array.js e o init com a chave do projeto), suficiente para o
 * dia em que este adaptador deixar de ser inerte.
 */
import type { AdaptadorDeAnalytics } from "./porta";

export const posthog: AdaptadorDeAnalytics = {
  id: "posthog",
  usaCookie: true,
  clausulas: [
    { nome: "ph_<projeto>_posthog", finalidade: "Medir o funil de leitura até a isca", duracao: "1 ano" },
  ],
  script(idDaConta: string): string | null {
    if (!idDaConta) return null;
    return (
      '<script async src="https://app.posthog.com/static/array.js"></script>' +
      "<script>" +
      "window.posthog = window.posthog || [];" +
      "window.posthog.init('" + idDaConta + "', { api_host: 'https://app.posthog.com' });" +
      "</script>"
    );
  },
};
