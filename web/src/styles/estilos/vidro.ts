/**
 * Um arquivo por estilo. Ele importa o próprio CSS e declara os próprios
 * metadados — então criar um estilo é CRIAR DOIS ARQUIVOS, nunca editar um
 * arquivo compartilhado. É isso que faz `scripts/atualizar` não conflitar.
 */
import "./vidro.css";
import type { MetaEstilo } from "./index";

const meta: MetaEstilo = {
  nome: "Vidro",
  acento: "#00e5cc",
  origem: "Tokens da ibe.ia.br. Superfície translúcida sobre aurora, blur com saturação.",
};
export default meta;
