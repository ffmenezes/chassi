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
            return subprocess.check_output([sys.executable, str(SCRIPT), str(post), query], text=True)

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

    def test_calculadora_nao_vira_prosa_longa(self):
        saida = self.medir("Consumo de energia", "consumo energia",
                           '\n:::calculadora{id="teste"}\n' +
                           'campo custo | ' + 'dado ' * 80 + '\n:::\n')
        self.assertRegex(saida, r"ok\s+frases acima de 45 palavras: 0")


if __name__ == "__main__":
    unittest.main()
