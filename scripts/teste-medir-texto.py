"""Casos em que o relatório não pode aprovar metadados incorretos."""
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("medir-texto")


class MedicaoDeTexto(unittest.TestCase):
    def medir(self, titulo, query, extra=""):
        with tempfile.TemporaryDirectory() as pasta:
            post = Path(pasta) / "post.md"
            post.write_text(
                f'---\ntitulo: "{titulo}"\ndescricao: "Descrição do ensaio."\n---\n'
                ':::abertura\ncena: A conta chegou hoje.\n'
                'problema: O consumo de energia aumentou.\n:::\n'
                '## A conta\nVeja o consumo de energia no mês. A conta é sua.\n' + extra,
                encoding="utf-8")
            return subprocess.check_output([sys.executable, str(SCRIPT), str(post), query], text=True, encoding="utf-8")

    def test_primeiro_termo_sozinho_nao_aprova_query_inteira(self):
        saida = self.medir("Consumo mensal da casa", "consumo energia")
        self.assertRegex(saida, r"REVER\s+query no título:")

    def test_aceita_termos_com_acentos_e_ordem_natural(self):
        saida = self.medir("Energia: o consumo da casa", "consumo energia")
        self.assertRegex(saida, r"ok\s+query no título:")

    def test_titulo_vazio_nao_passa(self):
        self.assertRegex(self.medir("", "consumo"), r"REVER\s+título:")

    def test_titulo_so_com_espacos_nao_passa(self):
        self.assertRegex(self.medir("   ", "consumo"), r"REVER\s+título:")

    def test_linha_terminada_em_dois_pontos_nao_cola_no_paragrafo_seguinte(self):
        """A linha que abre uma lista não fecha com ponto. Se a medição junta o
        texto todo numa string, ela emenda no parágrafo seguinte e inventa uma
        frase de 40 e poucas palavras que o autor não escreveu."""
        saida = self.medir("Consumo de energia", "consumo energia",
                           "\nOs itens que entram na conta são estes:\n\n"
                           "- bandeira\n- imposto\n\n"
                           + "palavra " * 40 + "no fim.\n")
        self.assertRegex(saida, r"ok\s+frases acima de 45 palavras: 0")

    def test_citacao_terminada_em_interrogacao_fecha_a_frase(self):
        """Aspas em cima do ponto de interrogação também fecham a frase. Sem
        isso, duas frases viram uma, e um parágrafo comum aparece com 43
        palavras por frase e Flesch 36."""
        saida = self.medir("Consumo de energia", "consumo energia",
                           '\nO vizinho perguntou: "isso foi erro meu?" '
                           + "palavra " * 40 + "no fim.\n")
        self.assertRegex(saida, r"ok\s+frases acima de 45 palavras: 0")

    def test_calculadora_nao_vira_prosa_longa(self):
        saida = self.medir("Consumo de energia", "consumo energia",
                           '\n:::calculadora{id="teste"}\n' +
                           'campo custo | ' + 'dado ' * 80 + '\n:::\n')
        self.assertRegex(saida, r"ok\s+frases acima de 45 palavras: 0")


if __name__ == "__main__":
    unittest.main()
