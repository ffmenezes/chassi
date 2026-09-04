/**
 * Um arquivo por estilo. Ele importa o próprio CSS e declara os próprios
 * metadados — então criar um estilo é CRIAR DOIS ARQUIVOS, nunca editar um
 * arquivo compartilhado. É isso que faz `scripts/atualizar` não conflitar.
 */
import "./ceu.css";
import type { MetaEstilo } from "./index";

const meta: MetaEstilo = {
  nome: "Céu",
  acento: "#006aff",
  origem: "Tokens do Bluesky. Zero sombra, hairline de 1px, e o rótulo é peso — nunca caixa alta.",
};
export default meta;
