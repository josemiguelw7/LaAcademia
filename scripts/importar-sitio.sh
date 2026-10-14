#!/usr/bin/env bash
# Trae el sitio de presentación (rama main) a public/ para servirlo en la misma dirección que la plataforma.
# Se corre una vez; después el sitio se edita directo en public/.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
git fetch -q origin main
for f in index.html precios.html style.css favicon.ico; do git show "origin/main:$f" > "public/$f"; done
for d in css images js lib webfonts; do
  git ls-tree -r --name-only origin/main "$d" | while read -r p; do mkdir -p "public/$(dirname "$p")"; git show "origin/main:$p" > "public/$p"; done
done
python3 - <<'PY'
import re
for p in ["public/index.html", "public/precios.html"]:
    s = open(p).read()
    s = s.replace("https://la-academia-eta.vercel.app/entrar", "/entrar")
    if 'rel="manifest"' not in s:
        s = s.replace("</head>", '  <link rel="manifest" href="/manifest.webmanifest">\n  <link rel="apple-touch-icon" href="/app/apple-touch-icon.png">\n  <meta name="theme-color" content="#F4F1EC">\n</head>', 1)
    if p.endswith("index.html"):
        s = s.replace('<a href="/entrar" target="_blank" rel="noopener">\n              <div class="icon-wrap"><div class="icon-effects parallax-wrap"><div class="button-icon parallax-element"><i class="fa-solid fa-arrow-right"></i></div></div></div>\n              <div class="text-wrap"><div class="button-text"><span data-hover="Entra a tu curso">Entra a tu curso</span></div></div>',
                      '<a href="/demo">\n              <div class="icon-wrap"><div class="icon-effects parallax-wrap"><div class="button-icon parallax-element"><i class="fa-solid fa-arrow-right"></i></div></div></div>\n              <div class="text-wrap"><div class="button-text"><span data-hover="Ve una clase gratis">Ve una clase gratis</span></div></div>')
    open(p, "w").write(s)
PY
echo "sitio importado: $(grep -c 'href="/demo"' public/index.html) enlace a la clase gratis"
