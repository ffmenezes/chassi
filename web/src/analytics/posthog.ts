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
 *
 * O carregador oficial do PostHog é um stub minificado que enfileira chamadas
 * feitas ANTES do `array.js` terminar de carregar (`window.posthog` nasce
 * objeto com fila de métodos, não array — um array não tem `.init`, e chamar
 * `.init` nele estoura `TypeError` de forma síncrona no `<head>`). Reproduzir
 * esse stub à mão é frágil — foi o que quebrou na primeira versão deste
 * arquivo.
 *
 * Em vez disso, `onload`: o `<script async>` só chama `posthog.init(...)`
 * depois que `array.js` já definiu `window.posthog` de verdade. Isso é
 * SUFICIENTE aqui porque nada mais nesta página chama `posthog` fora deste
 * bloco — não há janela em que algo dispare um evento antes do load. Este
 * carregador NÃO enfileira eventos disparados antes do `array.js` carregar;
 * se o site um dia passar a emitir eventos próprios (ex.: em outro
 * componente, fora deste `<head>`), a fila do stub oficial deixa de ser
 * opcional e este arquivo precisa voltar a usá-la.
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
      '<script async src="https://us-assets.i.posthog.com/static/array.js" ' +
      "onload=\"posthog.init('" + idDaConta + "', {api_host:'https://us.i.posthog.com'})\"></script>"
    );
  },
};
