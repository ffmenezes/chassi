"""Casos em que o relatório não pode aprovar metadados incorretos."""
from pathlib import Path
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).parent / "_lib" / "medir-texto.py"
LANCADOR = Path(__file__).with_name("medir-texto")


class MedicaoDeTexto(unittest.TestCase):
    def medir(self, titulo, query, extra="", comando=None, env=None):
        with tempfile.TemporaryDirectory() as pasta:
            post = Path(pasta) / "post.md"
            post.write_text(
                f'---\ntitulo: "{titulo}"\ndescricao: "Descrição do ensaio."\n---\n'
                ':::abertura\ncena: A conta chegou hoje.\n'
                'problema: O consumo de energia aumentou.\n:::\n'
                '## A conta\nVeja o consumo de energia no mês. A conta é sua.\n' + extra,
                encoding="utf-8")
            comando = comando or [sys.executable, str(SCRIPT)]
            return subprocess.check_output(comando + [str(post), query], text=True, encoding="utf-8", env=env)

    @unittest.skipUnless(shutil.which("bash"), "sem bash")
    def test_lancador_acha_o_python_sozinho(self):
        """`scripts/medir-texto` é o caminho que a documentação manda rodar, e
        ele não pode depender de o sistema chamar o Python de `python3`."""
        saida = self.medir("Consumo de energia", "consumo energia",
                           comando=[shutil.which("bash"), str(LANCADOR)])
        self.assertIn("Legibilidade", saida)

    @unittest.skipUnless(os.name == "posix" and shutil.which("bash"), "precisa de symlink e bash")
    def test_python3_que_nao_roda_nao_engana_o_lancador(self):
        """O `python3.exe` da Microsoft Store existe no PATH e só manda abrir a
        loja. O lançador tem que passar por ele e achar o `python` de verdade."""
        with tempfile.TemporaryDirectory() as bin_falso:
            falso = Path(bin_falso) / "python3"
            falso.write_text("#!/bin/sh\necho 'Python não encontrado; abra a Microsoft Store' >&2\nexit 9009\n")
            falso.chmod(0o755)
            (Path(bin_falso) / "python").symlink_to(sys.executable)
            env = dict(os.environ, PATH=os.pathsep.join([bin_falso, "/usr/bin", "/bin"]))
            saida = self.medir("Consumo de energia", "consumo energia",
                               comando=[shutil.which("bash"), str(LANCADOR)], env=env)
        self.assertIn("Legibilidade", saida)

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
