/**
 * Um arquivo por estilo. Ele importa o próprio CSS e declara os próprios
 * metadados — então criar um estilo é CRIAR DOIS ARQUIVOS, nunca editar um
 * arquivo compartilhado. É isso que faz `scripts/atualizar` não conflitar.
 */
import "./rabisco.css";
import type { MetaEstilo } from "./index";

const meta: MetaEstilo = {
  nome: "Rabisco",
  /* O azul da caneta, e não o amarelo do `--b-acento`: é o azul que resume o
     estilo, e o card social desenha o rodapé em `acento` sobre fundo claro —
     em amarelo ele sairia a 1,4:1, ilegível. */
  acento: "#1018ad",
  origem:
    "Tokens medidos no CSS publicado de rabisco.net (Distrito Rabisco): caneta esferográfica em caderno pautado. Letra Patrick Hand (OFL), auto-hospedada. O modo escuro é derivação declarada, do mapa NIGHT do jogo.",
};
export default meta;
