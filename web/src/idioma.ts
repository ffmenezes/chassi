/**
 * Um lugar só para o idioma.
 *
 * O site é PT-BR e o idioma padrão vai SEM PREFIXO: `/sobre` continua
 * `/sobre`. Isso não é adiar o multi-idioma, é preservá-lo: com
 * `prefixDefaultLocale: false`, `/en/sobre` nasce depois sem quebrar nenhuma
 * URL já indexada. Publicar em `/pt/` hoje é que fecharia a porta.
 */
export const IDIOMA_PADRAO = "pt-br";

/** O que vai no atributo `lang` do `<html>`. */
export const LANG_HTML = "pt-BR";
