/**
 * Google Analytics 4. Usa cookie de primeira parte para distinguir visitante
 * e sessão — por isso a política de cookies precisa das cláusulas abaixo
 * sempre que este for o adaptador ativo.
 *
 * Concatenação com `+`, nunca template literal: esta máquina corrompe
 * `${...}`/`$(...)` mesmo dentro de heredoc com delimitador entre aspas, e um
 * script de analytics mutilado não quebra build nem teste — só para de medir,
 * em silêncio.
 */
import type { AdaptadorDeAnalytics } from "./porta";

export const ga4: AdaptadorDeAnalytics = {
  id: "ga4",
  usaCookie: true,
  clausulas: [
    { nome: "_ga", finalidade: "Distinguir visitantes para medir audiência", duracao: "2 anos" },
    { nome: "_ga_<ID>", finalidade: "Manter o estado da sessão", duracao: "2 anos" },
  ],
  script(idDaConta: string): string | null {
    if (!idDaConta) return null;
    return (
      '<script async src="https://www.googletagmanager.com/gtag/js?id=' + idDaConta + '"></script>' +
      "<script>" +
      "window.dataLayer = window.dataLayer || [];" +
      "function gtag(){dataLayer.push(arguments);}" +
      "gtag('js', new Date());" +
      "gtag('config', '" + idDaConta + "');" +
      "</script>"
    );
  },
};
