/**
 * A frase do consentimento, num lugar só.
 *
 * O formulário mostra exatamente esta frase, e o banco guarda exatamente esta
 * frase junto do lead. É isto que prova o consentimento depois — e é por isso
 * que se guarda a frase, e não um booleano: a frase muda com o tempo, e o que
 * a pessoa aceitou foi a frase daquele dia.
 *
 * Mudou o texto aqui, mudou nos dois lados no mesmo commit, e quem já estava na
 * lista continua com a frase antiga gravada, que é o correto.
 */
export const CONSENTIMENTO_NEWSLETTER = "Quero receber os próximos artigos por e-mail.";

/**
 * A frase do campo de e-mail. Ela é obrigatória e é honesta na mesma medida:
 * diz o que o e-mail faz e o que ele não faz, antes de a pessoa digitar.
 *
 * É "quando", e não "se". O condicional abria duas dúvidas numa frase só — se
 * eu respondo, e se eu aviso —, e quem lê antes de digitar o e-mail está
 * decidindo exatamente isso. "Quando" fecha as duas e vira compromisso.
 */
export const PROMESSA_DO_EMAIL = "Não aparece no site. Serve para eu te avisar quando eu responder.";

/**
 * O consentimento do bloco 24, a oferta de isca. É outro texto porque é outro
 * consentimento: quem baixa uma planilha não pediu newsletter, e tratar os dois
 * como a mesma coisa é o que transforma uma lista em reclamação de spam.
 *
 * A frase promete **um** e-mail, e é isso que o `base/ISCAS.md` do site autoriza
 * hoje, porque não existe cadência definida. Existindo cadência depois, ela é
 * anunciada antes do primeiro envio, para quem já está na lista — e esta
 * constante muda no mesmo commit, com quem entrou antes guardando a frase antiga,
 * que é o correto.
 */
export const CONSENTIMENTO_ISCA =
  "Quero receber a planilha por e-mail. Sei que chega um e-mail só, e que saio em um clique.";

/**
 * A frase que aparece embaixo do campo, antes de a pessoa digitar. Diz o que
 * chega, quantas vezes, e como sair, que é o que o bloco 24 exige na mesma tela.
 */
export const PROMESSA_DA_ISCA =
  "Um e-mail, com o arquivo. Nada mais é enviado, e a saída é um clique no rodapé dele.";
