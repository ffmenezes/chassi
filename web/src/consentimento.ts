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

/**
 * A frase do banner de cookies. Mesmo espírito das constantes acima: guarda-se
 * a frase, nunca um booleano solto — a frase muda com o tempo, e o que a
 * pessoa aceitou (ou recusou) foi a frase daquele dia, gravada junto da data
 * em `localStorage` por `Consentimento.astro`.
 *
 * Mudou o texto aqui, muda a régua do que já foi respondido: quem já tinha
 * decidido sob a frase antiga não decidiu sob esta, e o banner volta a
 * aparecer — que é o correto, porque consentimento não se herda de um texto
 * para outro.
 */
export const CONSENTIMENTO_COOKIES =
  "Aceito o uso de cookies para medir a audiência deste site.";

/**
 * A chave do `localStorage` onde a escolha de cookies fica gravada. Mora
 * aqui, uma vez só, porque `Consentimento.astro` (quem grava) e
 * `Analytics.astro` (quem lê, antes de injetar o script de terceiro) têm de
 * concordar exatamente na mesma string — divergência de chave entre os dois
 * lados é o tipo de bug que não aparece em teste nenhum, só no navegador de
 * quem já tinha decidido antes.
 */
export const CHAVE_CONSENTIMENTO_COOKIES = "chassi:consentimento-cookies";

/**
 * O nome do evento que `Consentimento.astro` dispara ao gravar a escolha, e
 * que `Analytics.astro` escuta pra injetar o script sem esperar um reload da
 * página. Mesma razão da chave acima: um nome só, importado dos dois lados.
 */
export const EVENTO_CONSENTIMENTO_COOKIES = "chassi:consentimento-cookies:mudou";
