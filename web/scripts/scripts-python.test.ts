// As suítes de ../scripts (medir-texto, listar-links, réguas) são Python e
// rodam aqui para que `npm test` cubra o repositório inteiro. Um teste por
// arquivo teste-*.py: o vitest mostra qual quebrou, com a saída do unittest.
//
// O Python é achado como scripts/_lib/python acha: cada candidato é
// EXECUTADO, porque o python3.exe da Microsoft Store existe no PATH e só
// manda abrir a loja. Mudou a lista lá, muda aqui. O bash não é chamado
// daqui: no Windows, o `bash` que o Node encontra pode ser o do WSL.
//
// Sem Python nenhum, as suítes aparecem como puladas, e não como falha: quem
// só mexe no site não precisa de Python para testar o site.
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SCRIPTS = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "scripts");
const CANDIDATOS = [["python3"], ["python"], ["py", "-3"]];

function acharPython(): string[] | null {
  for (const [comando, ...args] of CANDIDATOS) {
    const r = spawnSync(comando, [...args, "-c", "import sys; sys.exit(sys.version_info < (3, 7))"], { stdio: "ignore" });
    if (r.status === 0) return [comando, ...args];
  }
  return null;
}

const python = acharPython();
const suites = readdirSync(SCRIPTS).filter((f) => /^teste-.*\.py$/.test(f)).sort();

describe.skipIf(!python)("scripts/ (Python)", () => {
  it("acha as suítes", () => {
    expect(suites.length).toBeGreaterThan(0);
  });

  for (const suite of suites) {
    it(suite, () => {
      const [comando, ...args] = python!;
      const r = spawnSync(comando, [...args, join(SCRIPTS, suite)], {
        encoding: "utf-8",
        env: { ...process.env, PYTHONUTF8: "1", PYTHONDONTWRITEBYTECODE: "1" },
      });
      expect(r.status, `${suite}\n${r.error ?? ""}${r.stdout}${r.stderr}`).toBe(0);
    }, 60_000);
  }
});
