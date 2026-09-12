"""As réguas do medir-texto e as skills que as citam não podem divergir.

As etapas do método escrevem os números por extenso ("description de 140 a
160"), porque quem monta o esqueleto precisa vê-los antes de ter texto para
medir. O número de verdade mora em REGUAS, em _lib/medir-texto.py. Este teste
monta a partir de REGUAS cada frase que as skills deveriam conter e aponta o
arquivo em que ela não está: mudou a régua e esqueceu uma skill, ou mudou a
skill e esqueceu a régua. Foi assim que seis menções ficaram para trás no #2.

Citação nova de régua numa skill entra em CITACOES.
"""
import importlib.machinery
import importlib.util
from pathlib import Path
import re
import sys
import unittest

sys.dont_write_bytecode = True

ARTIGO = Path(__file__).resolve().parent.parent / ".agents" / "skills" / "artigo"

caminho = Path(__file__).parent / "_lib" / "medir-texto.py"
loader = importlib.machinery.SourceFileLoader("medir_texto", str(caminho))
spec = importlib.util.spec_from_loader(loader.name, loader)
medir = importlib.util.module_from_spec(spec)
loader.exec_module(medir)

# O texto das skills escreve número pequeno por extenso ("quatro H2").
EXTENSO = {2: "dois", 3: "três", 4: "quatro", 5: "cinco", 6: "seis", 7: "sete",
           8: "oito", 9: "nove", 10: "dez"}

# (arquivo em .agents/skills/artigo/, frase com {régua} ou {régua_extenso})
CITACOES = [
    ("etapas/03-esqueleto.md", "**description ({descricao_min} a {descricao_max}):**"),
    ("etapas/03-esqueleto.md", "{faq_min_extenso} a {faq_max_extenso} perguntas literais do dossiê"),
    ("etapas/03-esqueleto.md", "menos de {titulo_abaixo_de} caracteres; query nos primeiros {query_no_titulo_ate};"),
    ("etapas/03-esqueleto.md", "menos de {titulo_abaixo_de} caracteres e a query nos primeiros "
                               "{query_no_titulo_ate}; description tem {descricao_min} a {descricao_max}."),
    ("etapas/05-costura.md", 'descricao: "<{descricao_min} a {descricao_max} caracteres, a do esqueleto>"'),
    ("etapas/05-costura.md", "média de até {palavras_por_frase_max} palavras por frase; ao menos "
                             "{frases_curtas_min_pct}% de frases curtas (até {frase_curta_ate} palavras); "
                             "no máximo {frases_longas_max_pct}% de frases longas ({frase_longa_desde} ou mais); "
                             "nenhuma acima de {frase_teto}; Flesch-PT de {flesch_min} para cima."),
    ("etapas/05-costura.md", "nas primeiras {query_nas_primeiras} palavras"),
    ("etapas/05-costura.md", "description entre {descricao_min} e {descricao_max}"),
    ("etapas/05-costura.md", "{h2_min_extenso} H2"),
    ("etapas/06-revisao.md", "query nas primeiras {query_nas_primeiras} palavras"),
    ("referencias/blocos.md", 'titulo: "<menos de {titulo_abaixo_de} caracteres>"'),
    ("referencias/blocos.md", 'descricao: "<{descricao_min} a {descricao_max} caracteres>"'),
    ("referencias/blocos.md", "resposta, {faq_min} a {faq_max} |"),
    ("referencias/quando-cada-bloco.md", "{faq_min_extenso} a {faq_max_extenso} perguntas literais do leitor"),
]


def achatar(texto):
    """Quebra de linha e recuo do Markdown não contam, nem maiúscula de início de frase."""
    return re.sub(r"\s+", " ", texto).lower()


class ReguasNasSkills(unittest.TestCase):
    def test_toda_citacao_bate_com_REGUAS(self):
        valores = dict(medir.REGUAS)
        valores.update({f"{k}_extenso": EXTENSO[v] for k, v in medir.REGUAS.items() if v in EXTENSO})
        divergentes = []
        for arquivo, molde in CITACOES:
            esperado = molde.format(**valores)
            if achatar(esperado) not in achatar((ARTIGO / arquivo).read_text(encoding="utf-8")):
                divergentes.append(f"  {arquivo}: esperava «{esperado}»")
        if divergentes:
            self.fail("skill diverge de REGUAS em scripts/_lib/medir-texto.py:\n" + "\n".join(divergentes))


if __name__ == "__main__":
    unittest.main()
