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

    def medir_no_site(self, reguas_json, relativo=False):
        """Mede uma peça dentro de sites/teste/, com o REGUAS.json dado. Com
        `relativo`, roda de dentro da pasta do site, como a etapa 6 manda."""
        with tempfile.TemporaryDirectory() as pasta:
            site = Path(pasta) / "sites" / "teste"
            (site / "base").mkdir(parents=True)
            (site / "base" / "REGUAS.json").write_text(reguas_json, encoding="utf-8")
            post = site / "posts" / "peca" / "post.md"
            post.parent.mkdir(parents=True)
            post.write_text('---\ntitulo: "Consumo de energia"\ndescricao: "Descrição do ensaio."\n---\n'
                            '## A conta\nVeja o consumo de energia no mês. A conta é sua.\n', encoding="utf-8")
            alvo = "posts/peca/post.md" if relativo else str(post)
            return subprocess.run([sys.executable, str(SCRIPT), alvo, "consumo energia"],
                                  capture_output=True, text=True, encoding="utf-8",
                                  cwd=site if relativo else None)

    def test_regua_do_site_vence_a_padrao(self):
        """A régua do site mora em sites/<slug>/base/REGUAS.json, território do
        dono, para que mudar um número nunca vire CONFLITO no scripts/atualizar."""
        for relativo in (False, True):
            with self.subTest(relativo=relativo):
                r = self.medir_no_site('{"_porque": "description curta é o padrão do nicho", "descricao_min": 20}',
                                       relativo=relativo)
                self.assertEqual(r.returncode, 0, r.stderr)
                self.assertRegex(r.stdout, r"ok\s+description: 20 caracteres\s+\(régua: 20 a 160\)")
                self.assertIn("descricao_min de 140 para 20", r.stdout)

    def test_regua_do_site_com_erro_para_o_script(self):
        """Régua com erro de digitação que passasse calada seria régua nenhuma."""
        for conteudo, culpado in (('{"descricao_minima": 20}', "descricao_minima"),
                                  ('{"faq_max": "8"}', "faq_max"),
                                  ('{"faq_max": true}', "faq_max"),
                                  ('[20]', "objeto"),
                                  ('{"faq_max": 8,}', "JSON inválido")):
            with self.subTest(conteudo=conteudo):
                r = self.medir_no_site(conteudo)
                self.assertNotEqual(r.returncode, 0)
                self.assertIn(culpado, r.stderr)


if __name__ == "__main__":
    unittest.main()
