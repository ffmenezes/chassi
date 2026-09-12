"""Regressões de links que sumiam da decisão do dono. Sem dependências."""
import importlib.machinery
import importlib.util
from pathlib import Path
import unittest
import sys
import subprocess
import tempfile

sys.dont_write_bytecode = True

caminho = Path(__file__).with_name("listar-links")
loader = importlib.machinery.SourceFileLoader("listar_links", str(caminho))
spec = importlib.util.spec_from_loader(loader.name, loader)
links = importlib.util.module_from_spec(spec)
loader.exec_module(links)


class LinksDaPeca(unittest.TestCase):
    def test_codigo_inline_nao_e_link(self):
        self.assertEqual(links.extrair_links('Use `https://exemplo.org/a` e ``[exemplo](https://exemplo.org/b)``.'), [])

    def test_autolink_preserva_pontuacao_do_destino(self):
        self.assertEqual(links.extrair_links('<https://exemplo.org/b?q=teste!>'),
                         [('https://exemplo.org/b?q=teste!', 'https://exemplo.org/b?q=teste!', False)])

    def test_link_com_titulo_preserva_destino(self):
        self.assertEqual(links.extrair_links('[Outra peça](/outra-peca/ "Leia")'),
                         [('Outra peça', '/outra-peca/', False)])

    def test_imagem_clicavel_lista_destino_nao_src(self):
        self.assertEqual(links.extrair_links('[![Capa](https://img.example/capa.png)](https://example.org/artigo)'),
                         [('Capa', 'https://example.org/artigo', False)])

    def test_url_no_alt_nao_e_link(self):
        self.assertEqual(links.extrair_links('![https://site.example](https://img.example/foto.png)'), [])

    def test_referencias_markdown_listam_usos_nao_definicoes(self):
        with tempfile.TemporaryDirectory() as pasta:
            post = Path(pasta) / 'post.md'
            post.write_text('## Fontes\n[Fonte][Norma] e [Norma][] e [Norma].\n\n[norma]: /norma/ "Texto oficial"\n', encoding='utf-8')
            saida = subprocess.check_output([sys.executable, str(caminho), str(post)], text=True, encoding="utf-8")
        self.assertIn('| Fonte | /norma/ |', saida)
        self.assertIn('Total: 3 links.', saida)

    def test_link_em_h2_e_cerca_com_comprimento_diferente(self):
        with tempfile.TemporaryDirectory() as pasta:
            post = Path(pasta) / 'post.md'
            post.write_text('## [Fonte](https://exemplo.org/h2)\n````markdown\n```\nhttps://exemplo.org/codigo\n````\n', encoding='utf-8')
            saida = subprocess.check_output([sys.executable, str(caminho), str(post)], text=True, encoding="utf-8")
        self.assertIn('| Fonte | https://exemplo.org/h2 |', saida)
        self.assertNotIn('https://exemplo.org/codigo', saida)

    def test_preserva_parenteses_da_url_sem_duplicar(self):
        self.assertEqual(links.extrair_links(
            "Veja [a norma](https://exemplo.gov.br/Norma_(anexo)) e a fonte."),
            [("a norma", "https://exemplo.gov.br/Norma_(anexo)", False)])

    def test_url_literal_autolink_e_pendencia_sem_ancora(self):
        self.assertEqual(links.extrair_links(
            "https://exemplo.org/a. <https://exemplo.org/b> [LINK PENDENTE: outra-peca]"),
            [("https://exemplo.org/a", "https://exemplo.org/a", False),
             ("https://exemplo.org/b", "https://exemplo.org/b", False),
             ("outra-peca", "/outra-peca/ (pendente)", True)])

    def test_imagem_nao_e_link_mas_ancora_local_e(self):
        self.assertEqual(links.extrair_links(
            "![Prova](https://exemplo.org/foto.png) [Veja a conta](#a-conta)"),
            [("Veja a conta", "#a-conta", False)])
        self.assertEqual(links.tipo("#a-conta", "Veja", "Veja"), "âncora nesta peça")

    def test_ancora_da_pendencia_e_separador_na_tabela(self):
        self.assertEqual(links.extrair_links("[A | B][LINK PENDENTE: comparacao]"),
                         [("A | B", "/comparacao/ (pendente)", True)])
        self.assertEqual(links.celula("A | B"), "A &#124; B")


if __name__ == "__main__":
    unittest.main()
