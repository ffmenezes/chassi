/**
 * A régua que decide se a barra de aviso do topo já foi fechada.
 *
 * Guarda-se o TEXTO que a pessoa fechou, nunca um booleano solto — mesma
 * razão de `consentimento.ts` para o banner de cookies: o texto muda (o
 * evento acabou, a promoção é outra, a regra mudou de novo), e "eu já fechei
 * isso" só vale para o texto que estava na tela naquele clique. Texto novo é
 * aviso novo: reaparece, e é o correto — o oposto seria o leitor perder um
 * aviso importante porque fechou outro, de meses atrás, sem relação nenhuma
 * com o de hoje. Dono do site não precisa gerenciar id nem versão: trocar a
 * frase já basta para o aviso valer como novo.
 *
 * Função pura separada do componente para poder ser testada sem DOM: é ela
 * que prova a régua, não o clique simulado nem o `localStorage` de verdade.
 */

export interface RegistroAvisoBarra {
  texto: string;
  /** Dia de calendário, YYYY-MM-DD — mesma convenção de data do resto do chassi. */
  data: string;
}

/** Chave única: um site do chassi é um domínio próprio, e `localStorage` já
 *  isola por origem — não precisa levar o slug do site dentro da chave. */
export const CHAVE_AVISO_BARRA = "chassi:aviso-barra";

/** Puro. Dado o que está gravado (ou nada) e o texto de hoje, diz se a barra
 *  deveria nascer fechada. */
export function foiFechada(
  armazenado: RegistroAvisoBarra | null,
  textoAtual: string,
): boolean {
  return armazenado !== null && armazenado.texto === textoAtual;
}

/** Lê o registro do `localStorage`, tolerando ausência, JSON corrompido e o
 *  storage indisponível (navegação privada, política do navegador) — nos
 *  três casos o resultado é `null`, que `foiFechada` já trata como "nunca
 *  fechou". Só existe no navegador: chamar isto fora dele (build) é erro do
 *  chamador, não deste módulo. */
export function lerRegistro(): RegistroAvisoBarra | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE_AVISO_BARRA);
    if (!bruto) return null;
    const obj = JSON.parse(bruto);
    if (typeof obj?.texto === "string" && typeof obj?.data === "string") return obj;
    return null;
  } catch {
    return null;
  }
}

/** Grava a escolha de fechar. Falha em silêncio sem storage: sem persistir,
 *  a barra volta na próxima visita, que é o comportamento seguro, não um bug. */
export function gravarRegistro(texto: string): void {
  try {
    const registro: RegistroAvisoBarra = {
      texto,
      data: new Date().toISOString().slice(0, 10),
    };
    window.localStorage.setItem(CHAVE_AVISO_BARRA, JSON.stringify(registro));
  } catch {
    /* localStorage indisponível: melhor esforço, sem quebrar o fechamento
       em si — o `display:none` via CSS já aconteceu antes desta função
       rodar, então a experiência desta visita continua correta. */
  }
}
