/**
 * O MODELO. Copie este arquivo para `<seu-slug>.ts`, edite, e depois APAGUE
 * este — ele é o único arquivo do upstream que você tem permissão de apagar.
 *
 * Um site escolhe UM estilo e declara QUAIS blocos do catálogo ele monta.
 * Bloco fora daqui não existe na página.
 *
 *   SITE SOBRESCREVE TOKEN. SITE NUNCA ESCREVE SELETOR.
 *
 * O teto é 6 tokens, e estourar quebra a build. Não é implicância: é o que
 * garante que `scripts/atualizar` nunca vá conflitar com você, porque a sua
 * cara própria mora AQUI e não dentro de um componente.
 */
import type { Site, BlocoId } from "./tipos";

/** Os ativos: HTML que qualquer build entrega hoje. Os átomos vêm junto porque
 *  não se escolhe usá-los — a prosa usa. */
const TODOS_DE_ARTIGO: BlocoId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, "A1", "A2", "A3"];

const site: Site = {
  slug: "exemplo",
  nome: "Blog de Exemplo",
  dominio: "exemplo.com.br",
  estilo: "linho",
  modoPadrao: "claro",
  blocos: [...TODOS_DE_ARTIGO],
  muroDeEmail: false,

  emailContato: "contato@exemplo.com.br",
  responsavel: { nome: "Seu Nome", tipo: "pf" },

  // "nenhum" é o padrão de toda porta: o site builda e publica sem conta
  // nenhuma configurada. Troque quando tiver o identificador em mãos.
  analytics: "nenhum",

  // Desvio declarado sobre o estilo. Até 6 tokens, contados uma vez por token
  // mesmo aparecendo nos dois modos. Descomente e ajuste:
  // tokens: {
  //   claro: { "--b-acento": "#c8622a" },
  //   escuro: { "--b-acento": "#f0a05a" },
  // },
};

export default site;
