/**
 * Um arquivo por estilo. Ele importa o próprio CSS e declara os próprios
 * metadados — então criar um estilo é CRIAR DOIS ARQUIVOS, nunca editar um
 * arquivo compartilhado. É isso que faz `scripts/atualizar` não conflitar.
 */
import "./caderno.css";
import type { MetaEstilo } from "./index";

const meta: MetaEstilo = {
  nome: "Caderno",
  acento: "#5645d4",
  origem: "Tokens do Notion. Neutro quente e hairline; o roxo só chama a ação. O escuro é a faixa navy da capa esticada — a referência é só clara.",
};
export default meta;
