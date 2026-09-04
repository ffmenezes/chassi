/**
 * Um arquivo por estilo. Ele importa o próprio CSS e declara os próprios
 * metadados — então criar um estilo é CRIAR DOIS ARQUIVOS, nunca editar um
 * arquivo compartilhado. É isso que faz `scripts/atualizar` não conflitar.
 */
import "./circuito.css";
import type { MetaEstilo } from "./index";

const meta: MetaEstilo = {
  nome: "Circuito",
  acento: "#bbf451",
  origem: "Tokens da cofounder.co. Tinta por opacidade, e o lime só preenche, nunca vira texto.",
};
export default meta;
