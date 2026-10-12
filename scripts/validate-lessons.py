import sys, re, glob, yaml

LESSONS_DIR = 'content/lessons'
PRICE_WHITELIST = {'08-primera-temporada/02-precios-y-clientes.mdx'}  # precios de Liliana, no cifras del IRS

errors = []
files = sorted(glob.glob(f'{LESSONS_DIR}/**/*.mdx', recursive=True))
for f in files:
    short = f.split('lessons/')[1]
    text = open(f, encoding='utf-8').read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.S)
    if not m:
        errors.append(f"{short}: no frontmatter block"); continue
    try:
        fm = yaml.safe_load(m.group(1))
    except Exception as e:
        errors.append(f"{short}: YAML error: {e}"); continue
    body = m.group(2)

    for k in ['id','module','lesson','slug','title','objective','duration_min','status','source','cifras','practice','demos','checklist','questions']:
        if k not in fm:
            errors.append(f"{short}: missing frontmatter key '{k}'")
    if fm.get('status') not in ('draft','review','approved'):
        errors.append(f"{short}: invalid status {fm.get('status')!r}")

    cl = fm.get('checklist') or []
    if not (5 <= len(cl) <= 8):
        errors.append(f"{short}: checklist has {len(cl)} items (need 5-8)")

    segs = re.findall(r'^## S(\d+) ·', body, re.M)
    nseg = len(segs)
    if not (5 <= nseg <= 7):
        errors.append(f"{short}: {nseg} segments (need 5-7)")
    if segs != [str(i) for i in range(1, nseg+1)]:
        errors.append(f"{short}: segment numbering off: {segs}")

    qs = fm.get('questions') or []
    if len(qs) != 10:
        errors.append(f"{short}: {len(qs)} questions (need 10)")
    for q in qs:
        qid = q.get('id','?')
        opts = q.get('options') or []
        if len(opts) != 3:
            errors.append(f"{short} {qid}: {len(opts)} options (need 3)")
        if sum(1 for o in opts if o.get('correct')) != 1:
            errors.append(f"{short} {qid}: need exactly 1 correct option")
        for o in opts:
            fb = o.get('feedback','')
            if o.get('correct') and not fb.startswith('Exacto.'):
                errors.append(f"{short} {qid} opt {o.get('id')}: correct feedback must start 'Exacto.'")
            if not o.get('correct') and not fb.startswith('Casi.'):
                errors.append(f"{short} {qid} opt {o.get('id')}: incorrect feedback must start 'Casi.'")
        aseg = q.get('after_segment')
        if not isinstance(aseg, int) or aseg < 1 or aseg > nseg:
            errors.append(f"{short} {qid}: after_segment={aseg} out of range 1..{nseg}")
        if not q.get('concept_tag'): errors.append(f"{short} {qid}: missing concept_tag")
        if not q.get('prompt'): errors.append(f"{short} {qid}: missing prompt")

    listed = set(fm.get('cifras') or [])
    used = set(re.findall(r'<Cifra concept="([^"]+)"', body))
    for c in used - listed:
        errors.append(f"{short}: <Cifra {c}> used in body but not in frontmatter cifras")
    if short not in PRICE_WHITELIST:
        for mm in re.finditer(r'\$[\d,]+', body):
            errors.append(f"{short}: dollar amount in body: {mm.group(0)}")
    if '[LILIANA' in body:
        errors.append(f"{short}: unfilled [LILIANA] gap remains")

print(f"{len(files)} files checked")
if errors:
    print(f"{len(errors)} ISSUES:")
    for e in errors: print(" -", e)
    sys.exit(1)
print("ALL PASS")
