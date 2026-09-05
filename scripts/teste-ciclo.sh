#!/usr/bin/env bash
# O GATE do mecanismo de atualização.
#
# scripts/atualizar vai ser demonstrado ao vivo na aula 3. Este script prova,
# num diretório temporário, que o ciclo completo funciona: clone de
# participante -> instalação -> mudança no upstream -> puxada. Cobre os seis
# casos que decidem se o mecanismo pode ser anunciado:
#
#   1. clone de participante (instalar + primeiro site + build)
#   2. caso limpo    (upstream muda um arquivo que o participante não tocou)
#   3. caso sujo     (upstream e participante mudam o MESMO arquivo)
#   4. arquivo novo  (upstream cria estilo novo, dois arquivos)
#   5. território do participante (site alheio e página institucional
#      editada dos dois lados não podem ser oferecidos)
#   6. limpeza       (a origem volta a ficar exatamente como estava)
#
# Não depende de rede nem do GitHub: clona `/home/filipe/projects/chassi`
# pelo caminho local. Roda em cima do checkout real deste repositório —
# por isso o cuidado de registrar o SHA antes e conferir depois.
set -euo pipefail

CHASSI="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$CHASSI"

# Ignora o próprio scripts/teste-ciclo.sh: é normal ele ainda estar
# untracked na primeira vez que este gate roda, antes do commit final.
SUJEIRA_INICIAL="$(git status --porcelain | grep -v ' scripts/teste-ciclo\.sh$' || true)"
if [ -n "$SUJEIRA_INICIAL" ]; then
  echo "ERRO: $CHASSI está com mudanças não commitadas. Aborto sem tocar em nada." >&2
  echo "$SUJEIRA_INICIAL" >&2
  exit 1
fi

SHA_ORIGINAL="$(git rev-parse HEAD)"
TMP=""

limpar() {
  local status=$?
  cd "$CHASSI" 2>/dev/null || return "$status"
  git reset --hard "$SHA_ORIGINAL" >/dev/null 2>&1 || true
  [ -n "$TMP" ] && rm -rf "$TMP"
  return "$status"
}
trap limpar EXIT

falhar() {
  echo >&2
  echo "CASO QUE QUEBROU: $1" >&2
  echo "--- detalhe ---" >&2
  echo "$2" >&2
  exit 1
}

# Extrai as linhas de uma seção (NOVOS/SEGUROS/CONFLITO) da saída de
# `scripts/atualizar`, lida via stdin. Para de coletar na primeira linha em
# branco depois do cabeçalho da seção.
secao() {
  local nome="$1" dentro=0 linha
  while IFS= read -r linha; do
    if [ "$dentro" = 1 ]; then
      if [ -z "$linha" ]; then
        dentro=0
      else
        printf '%s\n' "$linha"
      fi
    else
      case "$linha" in
        "$nome ("*) dentro=1 ;;
      esac
    fi
  done
}

# tem <caminho>  — lê uma seção já extraída via stdin e diz se o caminho está lá.
tem() { grep -qxF "  $1"; }

# esta_em_alguma_secao <saida-do-atualizar> <caminho>
esta_em_alguma_secao() {
  local saida="$1" caminho="$2" s
  for s in NOVOS SEGUROS CONFLITO; do
    if secao "$s" <<<"$saida" | tem "$caminho"; then
      return 0
    fi
  done
  return 1
}

# roda `npm run build` em $1; repete uma vez se a primeira falhar, porque
# outro agente pode estar mexendo na máquina por motivo alheio ao ciclo.
rodar_build() {
  local dir="$1" saida
  if saida=$(cd "$dir" && npm run build 2>&1); then
    return 0
  fi
  echo "  primeira tentativa de build falhou — repetindo, pode ser motivo alheio..." >&2
  if saida=$(cd "$dir" && npm run build 2>&1); then
    return 0
  fi
  echo "$saida" >&2
  return 1
}

TMP="$(mktemp -d)"
CLONE="$TMP/participante"

echo "SHA de origem antes de começar: $SHA_ORIGINAL"

# ---------------------------------------------------------------------------
echo
echo "== caso 1: clone de participante =="
git clone --quiet "$CHASSI" "$CLONE" || falhar "1 (clone)" "git clone de $CHASSI falhou"
cd "$CLONE"
git remote rename origin upstream || falhar "1 (remote rename)" "git remote rename origin upstream falhou"
# identidade do "participante" nesta máquina de teste — não existe global
# nem local por padrão num clone novo, e os casos 3 e 5 precisam commitar
# como ele.
git config user.name "Participante Teste"
git config user.email "participante@teste.local"

INSTALAR_LOG=$(./scripts/instalar 2>&1) || falhar "1 (instalar)" "$INSTALAR_LOG"

cp web/src/sites/exemplo.ts web/src/sites/meublog.ts
sed -i \
  -e 's/slug: "exemplo"/slug: "meublog"/' \
  -e 's/nome: "Blog de Exemplo"/nome: "Meu Blog"/' \
  -e 's/dominio: "exemplo.com.br"/dominio: "meublog.com.br"/' \
  -e 's/contato@exemplo.com.br/contato@meublog.com.br/' \
  web/src/sites/meublog.ts
rm web/src/sites/exemplo.ts

rodar_build "$CLONE/web" || falhar "1 (build do participante)" "npm run build falhou com meublog.ts no lugar de exemplo.ts"
echo "caso 1 OK: instalar + site novo a partir de exemplo.ts + build"

# ---------------------------------------------------------------------------
echo
echo "== caso 2: caso limpo =="
cd "$CHASSI"
sed -i '/ele quebra a build em vez de virar aviso/a * (marcador teste-ciclo: caso limpo)' \
  web/src/components/blocos/Figura.astro
git add web/src/components/blocos/Figura.astro
git commit --quiet -m "test: linha de comentario em Figura.astro (caso limpo)"

cd "$CLONE"
SAIDA_2=$(./scripts/atualizar) || falhar "2 (atualizar)" "scripts/atualizar falhou"
secao "SEGUROS" <<<"$SAIDA_2" | tem "web/src/components/blocos/Figura.astro" \
  || falhar "2 (SEGUROS)" "Figura.astro não apareceu em SEGUROS. Saída completa:
$SAIDA_2"
secao "CONFLITO" <<<"$SAIDA_2" | tem "web/src/components/blocos/Figura.astro" \
  && falhar "2 (CONFLITO indevido)" "Figura.astro apareceu em CONFLITO sem que o participante o tivesse tocado. Saída completa:
$SAIDA_2"

./scripts/atualizar --aplicar-seguros >/dev/null || falhar "2 (--aplicar-seguros)" "scripts/atualizar --aplicar-seguros falhou"
grep -qF "marcador teste-ciclo: caso limpo" web/src/components/blocos/Figura.astro \
  || falhar "2 (linha não chegou)" "a linha do caso limpo não apareceu em Figura.astro depois de --aplicar-seguros"
echo "caso 2 OK: mudança do upstream em arquivo intocado apareceu em SEGUROS e chegou com --aplicar-seguros"

# ---------------------------------------------------------------------------
echo
echo "== caso 3: caso sujo (o mais importante) =="
cd "$CLONE"
sed -i '/vagas", e é por isso que aqui ela tem tipo fechado e fonte obrigatória./a * (edição do participante: caso sujo)' \
  web/src/components/blocos/Aviso.astro
ANTES_DO_PARTICIPANTE=$(cat web/src/components/blocos/Aviso.astro)
git add web/src/components/blocos/Aviso.astro
git commit --quiet -m "test: participante edita Aviso.astro (caso sujo)"

cd "$CHASSI"
sed -i '/vagas", e é por isso que aqui ela tem tipo fechado e fonte obrigatória./a * (edição do upstream: caso sujo, depois do participante)' \
  web/src/components/blocos/Aviso.astro
git add web/src/components/blocos/Aviso.astro
git commit --quiet -m "test: upstream edita Aviso.astro (caso sujo)"

cd "$CLONE"
SAIDA_3=$(./scripts/atualizar) || falhar "3 (atualizar)" "scripts/atualizar falhou"
secao "CONFLITO" <<<"$SAIDA_3" | tem "web/src/components/blocos/Aviso.astro" \
  || falhar "3 (CONFLITO)" "Aviso.astro não apareceu em CONFLITO com edição dos dois lados. Saída completa:
$SAIDA_3"
secao "SEGUROS" <<<"$SAIDA_3" | tem "web/src/components/blocos/Aviso.astro" \
  && falhar "3 (SEGUROS indevido)" "Aviso.astro apareceu em SEGUROS apesar do conflito. Saída completa:
$SAIDA_3"

./scripts/atualizar --aplicar-seguros >/dev/null || falhar "3 (--aplicar-seguros)" "scripts/atualizar --aplicar-seguros falhou"
DEPOIS_DO_APLICAR=$(cat web/src/components/blocos/Aviso.astro)
[ "$ANTES_DO_PARTICIPANTE" = "$DEPOIS_DO_APLICAR" ] \
  || falhar "3 (edição local perdida)" "Aviso.astro mudou depois de --aplicar-seguros mesmo estando em CONFLITO. Isso destruiria trabalho do participante em silêncio."
grep -qF "edição do upstream: caso sujo" web/src/components/blocos/Aviso.astro \
  && falhar "3 (upstream vazou)" "a edição do upstream apareceu em Aviso.astro apesar do conflito"
echo "caso 3 OK: CONFLITO detectado, --aplicar-seguros não tocou a edição do participante"

# ---------------------------------------------------------------------------
echo
echo "== caso 4: arquivo novo (estilo inteiro) =="
cd "$CHASSI"
cat > web/src/styles/estilos/marmore.css <<'CSS'
/* ============================================================
   MÁRMORE — estilo de teste do scripts/teste-ciclo.sh.
   Não é um estilo real do catálogo: existe só para provar que
   um arquivo novo do upstream chega em NOVOS e funciona depois
   de puxado.
   ============================================================ */
[data-estilo="marmore"] {
  --b-raio: 0;
}

[data-estilo="marmore"][data-modo="claro"] {
  --b-acento: #7a7a7a;
  --b-fundo: #f4f4f2;
  --b-texto: #262625;
}

[data-estilo="marmore"][data-modo="escuro"] {
  --b-acento: #b8b8b5;
  --b-fundo: #1c1c1b;
  --b-texto: #e8e8e6;
}
CSS
cat > web/src/styles/estilos/marmore.ts <<'TS'
/**
 * Estilo de teste do scripts/teste-ciclo.sh (caso "arquivo novo").
 * Segue o mesmo padrão de um arquivo por estilo: importa o próprio CSS e
 * declara os próprios metadados.
 */
import "./marmore.css";
import type { MetaEstilo } from "./index";

const meta: MetaEstilo = {
  nome: "Mármore",
  acento: "#7a7a7a",
  origem: "Estilo de teste do ciclo de atualização, não faz parte do catálogo real.",
};
export default meta;
TS
git add web/src/styles/estilos/marmore.css web/src/styles/estilos/marmore.ts
git commit --quiet -m "test: estilo novo marmore (caso arquivo novo)"

cd "$CLONE"
SAIDA_4=$(./scripts/atualizar) || falhar "4 (atualizar)" "scripts/atualizar falhou"
secao "NOVOS" <<<"$SAIDA_4" | tem "web/src/styles/estilos/marmore.css" \
  || falhar "4 (NOVOS: css)" "marmore.css não apareceu em NOVOS. Saída completa:
$SAIDA_4"
secao "NOVOS" <<<"$SAIDA_4" | tem "web/src/styles/estilos/marmore.ts" \
  || falhar "4 (NOVOS: ts)" "marmore.ts não apareceu em NOVOS. Saída completa:
$SAIDA_4"

./scripts/atualizar --aplicar-seguros >/dev/null || falhar "4 (--aplicar-seguros)" "scripts/atualizar --aplicar-seguros falhou"
[ -f web/src/styles/estilos/marmore.css ] || falhar "4 (css não chegou)" "marmore.css não existe no clone depois de --aplicar-seguros"
[ -f web/src/styles/estilos/marmore.ts ] || falhar "4 (ts não chegou)" "marmore.ts não existe no clone depois de --aplicar-seguros"

sed -i 's/estilo: "linho"/estilo: "marmore"/' web/src/sites/meublog.ts
rodar_build "$CLONE/web" || falhar "4 (build com marmore)" "npm run build falhou usando o estilo marmore recém-chegado — o estilo não está de fato registrado"
echo "caso 4 OK: dois arquivos novos apareceram em NOVOS, chegaram com --aplicar-seguros e o estilo funciona de verdade"

# ---------------------------------------------------------------------------
echo
echo "== caso 5: território do participante =="
cd "$CHASSI"
cat > web/src/sites/outro.ts <<'TS'
/** Site de OUTRO participante — nunca deveria ser oferecido a ninguém mais. */
import type { Site } from "./tipos";

const site: Site = {
  slug: "outro",
  nome: "Site de Outro Participante",
  dominio: "outro-participante.com.br",
  estilo: "linho",
  modoPadrao: "claro",
  blocos: [1, 2, 3],
  muroDeEmail: false,
  emailContato: "contato@outro-participante.com.br",
  responsavel: { nome: "Outro Participante", tipo: "pf" },
  analytics: "nenhum",
};

export default site;
TS
git add web/src/sites/outro.ts
git commit --quiet -m "test: site de outro participante (caso territorio)"

printf '\n<!-- upstream tocou esta linha (caso territorio) -->\n' >> web/src/pages/sobre.astro
git add web/src/pages/sobre.astro
git commit --quiet -m "test: upstream edita sobre.astro (caso territorio)"

cd "$CLONE"
printf '\n<!-- participante tocou esta linha (caso territorio) -->\n' >> web/src/pages/sobre.astro
git add web/src/pages/sobre.astro
git commit --quiet -m "test: participante edita sobre.astro (caso territorio)"

SAIDA_5=$(./scripts/atualizar) || falhar "5 (atualizar)" "scripts/atualizar falhou"
esta_em_alguma_secao "$SAIDA_5" "web/src/sites/outro.ts" \
  && falhar "5 (outro.ts ofertado)" "web/src/sites/outro.ts apareceu numa das seções. Saída completa:
$SAIDA_5"
esta_em_alguma_secao "$SAIDA_5" "web/src/pages/sobre.astro" \
  && falhar "5 (sobre.astro ofertado)" "web/src/pages/sobre.astro apareceu numa das seções mesmo editado dos dois lados. Saída completa:
$SAIDA_5"
echo "caso 5 OK: site de outro participante e página institucional editada dos dois lados não foram ofertados"

# ---------------------------------------------------------------------------
echo
echo "== caso 6: limpeza =="
cd "$CHASSI"
git reset --hard "$SHA_ORIGINAL" >/dev/null
rm -rf "$TMP"
TMP=""

SHA_FINAL="$(git rev-parse HEAD)"
[ "$SHA_FINAL" = "$SHA_ORIGINAL" ] || falhar "6 (SHA não voltou)" "SHA final ($SHA_FINAL) difere do original ($SHA_ORIGINAL)"
# mesma exceção do início: o próprio scripts/teste-ciclo.sh fica untracked
# até o commit final deste gate — não é sujeira deixada pelo teste.
SUJEIRA_FINAL="$(git status --porcelain | grep -v ' scripts/teste-ciclo\.sh$' || true)"
[ -z "$SUJEIRA_FINAL" ] || falhar "6 (status sujo)" "git status --porcelain não está vazio depois da limpeza:
$SUJEIRA_FINAL"
echo "caso 6 OK: origem de volta ao SHA $SHA_FINAL, git status limpo"

echo
echo "CICLO OK"
