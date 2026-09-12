#!/usr/bin/env python3
"""Mede legibilidade e SEO on-page de um post.md, sem dependência externa.

Uso:
    scripts/medir-texto sites/<slug>/posts/<peça>/post.md ["query-alvo"]

Legibilidade (só a prosa: ignora headings, diretivas, tabelas e listas):
  - palavras por frase (média), % de frases curtas e de frases longas,
    frases acima do teto, frases por parágrafo;
  - Flesch adaptado ao português (Martins et al., 1996):
    248,835 - 1,015 x (palavras por frase) - 84,6 x (sílabas por palavra).
  Fora da régua não é erro de fato, é sinal de que a costura ainda não fez
  o passo 6 (ritmo).

SEO on-page (o que a etapa 6 confere): tamanho do título e query nele;
tamanho da description; H2 antes de "Fontes"; perguntas na FAQ; query nas
primeiras palavras (abertura incluída); ao menos um link externo no corpo
(não só na lista de fontes); figuras.

Os números de cada régua estão em REGUAS, no topo do código, e saem
impressos em cada linha do relatório.
"""
import re, sys, unicodedata

# As réguas, num lugar só. As skills do método (etapas 3, 5 e 6, blocos.md,
# quando-cada-bloco.md) repetem estes números por escrito, porque quem monta o
# esqueleto precisa vê-los antes de ter texto para medir. scripts/teste-reguas.py
# reprova a suíte quando uma skill diverge daqui, e diz qual: mudou um número,
# rode o teste e corrija o que ele listar.
REGUAS = {
    # Legibilidade, vinda de newsletters medidas e do TOM.md.
    "palavras_por_frase_max": 20,   # média
    "frase_curta_ate": 10,          # palavras
    "frases_curtas_min_pct": 30,
    "frase_longa_desde": 21,        # palavras
    "frases_longas_max_pct": 25,
    "frase_teto": 45,               # nenhuma frase acima disto
    "flesch_min": 55,
    # SEO on-page.
    "titulo_abaixo_de": 60,         # caracteres
    "query_no_titulo_ate": 40,      # posição do primeiro termo, em caracteres
    # A faixa da description era 150 a 160. Medida contra um acervo de 269
    # artigos publicados, ela reprovava 28% deles por description de 140 a 149,
    # tamanho que o buscador não trunca e que não é defeito. Abaixo de 140 sobra
    # espaço no resultado; acima de 160 corta no meio. Com 140 a 160 a
    # reprovação cai para 5%, e o que sobra são casos reais.
    "descricao_min": 140,
    "descricao_max": 160,
    "h2_min": 4,                    # senão o sumário não nasce
    # O teto da FAQ existe para pegar a seção que virou um segundo artigo. Sete
    # perguntas bem feitas não são isso, e cortar a sétima é perder resposta que
    # a busca faz.
    "faq_min": 3,
    "faq_max": 8,
    "query_nas_primeiras": 100,     # palavras, abertura incluída
}


def frontmatter(texto):
    partes = texto.split("---")
    if len(partes) < 3:
        return {}, texto
    fm = {}
    for ln in partes[1].splitlines():
        if ":" in ln:
            k, v = ln.split(":", 1)
            fm[k.strip()] = v.strip().strip('"').strip("'")
    return fm, "---".join(partes[2:])

# Fim de frase: ponto, interrogação ou exclamação, com ou sem aspas e
# parêntese de fechamento em cima. Sem a segunda alternativa, a citação
# terminada em `?"` não fechava frase e colava na seguinte: um parágrafo
# comum de duas frases aparecia como uma de 43 palavras, com Flesch 36.
FIM_DE_FRASE = re.compile(r"""(?<=[.!?])\s+|(?<=[.!?][\"'”’)\]])\s+""")


def silabas(w):
    w = unicodedata.normalize("NFC", w.lower())
    return max(1, len(re.findall(r"[aeiouáéíóúâêôãõàü]+", w)))

def main():
    # No Windows a locale do console é cp1252: sem isto o acento sai
    # quebrado no terminal e o `>` grava um arquivo que não é UTF-8.
    sys.stdout.reconfigure(encoding="utf-8", newline="\n")
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    r = REGUAS
    texto = open(sys.argv[1], encoding="utf-8").read()
    fm, corpo = frontmatter(texto)
    query = sys.argv[2].lower() if len(sys.argv) > 2 else ""

    # corpo até "## Fontes": o rodapé não é prosa nem capítulo
    corpo_util = re.split(r"^## Fontes\s*$", corpo, flags=re.M)[0]
    h2 = re.findall(r"^## (.+)$", corpo_util, re.M)
    faq = 0
    if ":::faq" in corpo_util:
        faq = len(re.findall(r"^### ", corpo_util.split(":::faq")[1].split(":::")[0], re.M))
    links_corpo = re.findall(r"\]\((https?://[^)]+)\)", corpo_util)
    figuras = len(re.findall(r"^:::figura", corpo_util, re.M))
    pendentes = len(re.findall(r"LINK PENDENTE", corpo_util))

    # A prosa é medida PARÁGRAFO A PARÁGRAFO, e não como um texto corrido. A
    # razão: linha que não fecha com ponto (a que termina em dois-pontos antes
    # de uma lista, por exemplo) colava no parágrafo seguinte, e nascia uma
    # "frase" de 50 ou 60 palavras que ninguém escreveu. Fim de parágrafo
    # fecha frase, que é o que o leitor enxerga.
    paragrafos, abertura, atual = [], [], []
    # dentro destas diretivas não há prosa: são dado (linhas `campo`/`saida`,
    # tabela, código, atributos). O texto delas não entra na conta de frases.
    SEM_PROSA = ("calculadora", "grafico", "codigo", "figura", "tabela-panorama", "tabela-contraste", "slides", "quiz", "verificacao")
    dentro = None

    def fecha():
        if atual:
            paragrafos.append(" ".join(atual))
            atual.clear()

    for ln in corpo_util.splitlines():
        t = ln.strip()
        m = re.match(r"^:::([a-z-]+)", t)
        if m and dentro is None:
            fecha()
            if m.group(1) in SEM_PROSA:
                dentro = m.group(1)
            continue
        if dentro is not None:
            if t == ":::":
                dentro = None
            continue
        if t.startswith(("cena:", "problema:")):
            fecha()
            abertura.append(t.split(":", 1)[1].strip()); continue
        if not t or t.startswith(("#", ":::", "|", "- ", "* ")):
            fecha()
            continue
        atual.append(t)
    fecha()
    paragrafos = abertura + paragrafos
    junto = " ".join(paragrafos)
    def limpa(p):
        p = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", p)
        return p.replace("**", "")

    paragrafos = [limpa(p) for p in paragrafos]
    junto = limpa(junto)
    frases = [f for p in paragrafos for f in FIM_DE_FRASE.split(p)
              if len(f.split()) >= 2]
    tam = [len(f.split()) for f in frases]
    palavras = re.findall(r"[\wÀ-ÿ'-]+", junto)
    if not tam or not palavras:
        print("sem prosa para medir"); sys.exit(1)
    asl = sum(tam) / len(tam)
    asw = sum(silabas(p) for p in palavras) / len(palavras)
    flesch = 248.835 - 1.015 * asl - 84.6 * asw
    curtas = 100 * sum(1 for t in tam if t <= r["frase_curta_ate"]) / len(tam)
    longas = 100 * sum(1 for t in tam if t >= r["frase_longa_desde"]) / len(tam)
    acima_do_teto = [f for f in frases if len(f.split()) > r["frase_teto"]]
    pars = [p for p in re.split(r"\n\s*\n", corpo_util) if p.strip() and not p.strip().startswith(("#", ":::", "|", "-"))]
    fpp = sum(len([x for x in re.split(r"(?<=[.!?])\s+", p) if x.strip()]) for p in pars) / max(1, len(pars))
    primeiras = " ".join(palavras[:r["query_nas_primeiras"]]).lower()
    vazias = {"a","o","as","os","de","do","da","dos","das","em","no","na","nos","nas","um","uma","e","ou","que","com","por","para","pra","se","ao","à","é","eu","meu","minha","qual","quais","como","quanto","quanta","onde","mais","seu","sua"}
    todos = re.findall(r"\w+", query)
    # tira as palavras vazias; se a query inteira é feita delas ("das" é a
    # guia do MEI, não o artigo), mantém todas e busca por palavra inteira
    termos = [t for t in todos if t not in vazias] or todos
    def sem_acento(s):
        return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    def tem(t, texto):
        return re.search(r"\b" + re.escape(sem_acento(t)) + r"\b", sem_acento(texto)) is not None
    kw_inicio = bool(termos) and all(tem(t, primeiras) for t in termos)
    titulo = fm.get("titulo", ""); desc = fm.get("descricao", "")
    m = re.search(r"\b" + re.escape(sem_acento(termos[0])) + r"\b", sem_acento(titulo.lower())) if termos else None
    pos = m.start() if m else -1
    query_titulo = bool(termos) and 0 <= pos < r["query_no_titulo_ate"] and all(tem(t, titulo.lower()) for t in termos)

    def ok(cond): return "ok " if cond else "REVER"
    print(f"medir-texto: {sys.argv[1]}")
    print("\nLegibilidade")
    print(f"  {ok(asl <= r['palavras_por_frase_max'])}  palavras por frase (média): {asl:.1f}  (régua: <= {r['palavras_por_frase_max']})")
    print(f"  {ok(curtas >= r['frases_curtas_min_pct'])}  frases curtas, até {r['frase_curta_ate']} palavras: {curtas:.0f}%  (régua: >= {r['frases_curtas_min_pct']}%)")
    print(f"  {ok(longas <= r['frases_longas_max_pct'])}  frases longas, {r['frase_longa_desde']} ou mais: {longas:.0f}%  (régua: <= {r['frases_longas_max_pct']}%)")
    print(f"  {ok(not acima_do_teto)}  frases acima de {r['frase_teto']} palavras: {len(acima_do_teto)}")
    print(f"  {ok(flesch >= r['flesch_min'])}  Flesch-PT: {flesch:.0f}  (régua: >= {r['flesch_min']}; 75+ é muito fácil, abaixo de 50 é difícil)")
    print(f"        frases por parágrafo: {fpp:.1f}   frases: {len(tam)}   palavras de prosa: {len(palavras)}")
    for f in acima_do_teto:
        print(f"        > {f[:120]}...")
    print("\nSEO on-page")
    print(f"  {ok(bool(titulo.strip()) and len(titulo) < r['titulo_abaixo_de'])}  título: {len(titulo)} caracteres  (régua: 1 a {r['titulo_abaixo_de'] - 1})")
    print(f"  {ok(query_titulo)}  query no título: posição {pos}  (régua: termos presentes, primeiro nos primeiros {r['query_no_titulo_ate']})" if termos else "        query não informada; passe como segundo argumento")
    print(f"  {ok(r['descricao_min'] <= len(desc) <= r['descricao_max'])}  description: {len(desc)} caracteres  (régua: {r['descricao_min']} a {r['descricao_max']})")
    print(f"  {ok(len(h2) >= r['h2_min'])}  H2 antes de Fontes: {len(h2)}  (régua: >= {r['h2_min']}, senão o sumário não nasce)")
    print(f"  {ok(r['faq_min'] <= faq <= r['faq_max'])}  perguntas na FAQ: {faq}  (régua: {r['faq_min']} a {r['faq_max']})")
    if termos:
        print(f"  {ok(kw_inicio)}  query nas primeiras {r['query_nas_primeiras']} palavras: {'sim' if kw_inicio else 'não'}")
    print(f"  {ok(len(links_corpo) >= 1)}  links externos no corpo (fora da lista Fontes): {len(set(links_corpo))}  (régua: a fonte mais forte linkada onde é usada)")
    print(f"        links internos pendentes: {pendentes}   figuras: {figuras}")

if __name__ == "__main__":
    main()
