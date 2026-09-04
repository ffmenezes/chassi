/**
 * Um arquivo por estilo. Ele importa o próprio CSS e declara os próprios
 * metadados — então criar um estilo é CRIAR DOIS ARQUIVOS, nunca editar um
 * arquivo compartilhado. É isso que faz `scripts/atualizar` não conflitar.
 */
import "./concreto.css";
import type { MetaEstilo } from "./index";

const meta: MetaEstilo = {
  nome: "Concreto",
  acento: "#7c4dee",
  origem: "Tokens da certfique.com.br. Borda 2px, sombra dura 4px 4px 0, hover que desloca.",
};
export default meta;
