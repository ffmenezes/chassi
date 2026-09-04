/**
 * Um arquivo por estilo. Ele importa o próprio CSS e declara os próprios
 * metadados — então criar um estilo é CRIAR DOIS ARQUIVOS, nunca editar um
 * arquivo compartilhado. É isso que faz `scripts/atualizar` não conflitar.
 */
import "./linho.css";
import type { MetaEstilo } from "./index";

const meta: MetaEstilo = {
  nome: "Linho",
  acento: "#cc785c",
  origem: "Tokens do sistema do Claude. Serifa é a voz de display; o corpo é sans humanista.",
};
export default meta;
