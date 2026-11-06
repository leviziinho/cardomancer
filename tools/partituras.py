# Gera as partituras da música do jogo a partir de js/musica.js (PECAS e MODOS).
# Saída em revisao/musica/: MusicXML (MuseScore, Sibelius, Finale; dá para fazer tablatura),
# MIDI (qualquer DAW) e ABC (a página partituras.html desenha-as e imprime em PDF).
# Correr de novo sempre que a melodia mudar:  python tools/partituras.py
import json, os, struct, subprocess

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, 'revisao', 'musica')
os.makedirs(SAIDA, exist_ok=True)

# Tira MODOS e PECAS do código do jogo, para a partitura ser sempre a mesma música que se ouve.
JS = r"""
const fs = require('fs');
const s = fs.readFileSync(process.argv[1], 'utf8');
const corta = (ini, fim) => { const a = s.indexOf(ini); return s.slice(a + ini.length - 2, s.indexOf(fim, a)); };
const MODOS = eval('(' + corta('const MODOS = {', '\n  };\n') + '\n})');
const PECAS = eval('(' + corta('const PECAS = {', '\n  };\n') + '\n})');
PECAS.calma.seccoes.D = { ...PECAS.calma.seccoes.A, energia: .45, oitava: -1 };
PECAS.chefe.seccoes.D = { ...PECAS.chefe.seccoes.A, energia: .5, oitava: -1 };
console.log(JSON.stringify({ MODOS, PECAS }));
"""
dados = json.loads(subprocess.run(['node', '-e', JS, os.path.join(RAIZ, 'js', 'musica.js')], capture_output=True, text=True, check=True).stdout)
MODOS, PECAS = dados['MODOS'], dados['PECAS']

ESCALAS = {
    'jonio': [0, 2, 4, 5, 7, 9, 11], 'dorico': [0, 2, 3, 5, 7, 9, 10], 'frigio': [0, 1, 3, 5, 7, 8, 10],
    'lidio': [0, 2, 4, 6, 7, 9, 11], 'mixolidio': [0, 2, 4, 5, 7, 9, 10], 'eolio': [0, 2, 3, 5, 7, 8, 10],
    'locrio': [0, 1, 3, 5, 6, 8, 10],
}
LETRAS = 'CDEFGAB'
NATURAL = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
NOMES_PT = {'C': 'Dó', 'D': 'Ré', 'E': 'Mi', 'F': 'Fá', 'G': 'Sol', 'A': 'Lá', 'B': 'Si'}
MODO_PT = {'jonio': 'jónio', 'dorico': 'dórico', 'frigio': 'frígio', 'lidio': 'lídio', 'mixolidio': 'mixolídio', 'eolio': 'eólio', 'locrio': 'lócrio'}

PECA_INFO = {
    'calma': ('A Estrada', 'Balada da viagem, igual para todas as classes; muda só o arranjo.'),
    'combate': ('O Combate', 'Tema de luta, com ostinato e tambores a cavalgar.'),
    'chefe': ('O Chefe', 'Lento e pesado, com coro por baixo.'),
}


def letra_da_raiz(raiz):
    # As raízes usadas (Ré, Lá, Sol, Mi, Fá, Si) são todas naturais.
    pc = raiz % 12
    return next(l for l, v in NATURAL.items() if v == pc)


def soletra(raiz, escala, grau):
    """Nome da nota do grau (letra, alteração, oitava científica, midi), soletrado na escala."""
    notas = ESCALAS[escala]
    midi = raiz + 12 * (grau // 7) + notas[grau % 7]
    l0 = LETRAS.index(letra_da_raiz(raiz))
    letra = LETRAS[(l0 + grau % 7) % 7]
    alt = (midi - NATURAL[letra]) % 12
    alt = alt - 12 if alt > 6 else alt
    oitava = (midi - alt - NATURAL[letra]) // 12 - 1
    return letra, alt, oitava, midi


def acorde(raiz, escala, grau):
    g = grau % 7
    notas = ESCALAS[escala]
    terca = (notas[(g + 2) % 7] - notas[g]) % 12
    quinta = (notas[(g + 4) % 7] - notas[g]) % 12
    qual = '' if terca == 4 else ('dim' if quinta == 6 else 'm')
    letra, alt, _, _ = soletra(raiz, escala, g)
    return letra, alt, qual


def nome_acorde(a, pt=False):
    letra, alt, qual = a
    base = NOMES_PT[letra] if pt else letra
    return base + {-1: 'b', 1: '#', 0: ''}[alt] + qual


def armacao(raiz, escala):
    """Quantos sustenidos (+) ou bemóis (-) tem a armação de clave desta escala."""
    alts = [soletra(raiz, escala, g)[1] for g in range(7)]
    return sum(alts)


def eventos(peca):
    """A peça inteira, na forma em que toca: lista de secções com compassos de notas."""
    m = MODOS[peca]
    P = PECAS[peca]
    raiz, escala, comp = m['raiz'], m['escala'], m['compasso']
    secs = []
    for nome in P['forma']:
        s = P['seccoes'][nome]
        om = s.get('oitava', 0)
        total = sum(d for _, d in s['melodia'])
        assert total == comp * len(s['acordes']), (peca, nome, total, comp * len(s['acordes']))
        notas = []
        for g, d in s['melodia']:
            notas.append((None if g is None else soletra(raiz + 12 * (1 + om), escala, g), d))
        secs.append({'nome': nome, 'notas': notas, 'acordes': [acorde(raiz, escala, k) for k in s['acordes']], 'energia': s['energia'], 'oitava': om})
    return secs


def compassos(notas, comp):
    """Parte as notas pelos compassos, com ligaduras quando uma nota passa a barra."""
    barras, atual, livre = [], [], comp
    for n, d in notas:
        primeira = True
        while d > 0:
            parte = min(d, livre)
            d -= parte
            atual.append((n, parte, not primeira, d > 0 and n is not None))
            primeira = False
            livre -= parte
            if livre == 0:
                barras.append(atual); atual, livre = [], comp
    assert not atual
    return barras


# ---------- MusicXML ----------
TIPOS = {1: ('eighth', 0), 2: ('quarter', 0), 3: ('quarter', 1), 4: ('half', 0), 6: ('half', 1), 8: ('whole', 0), 7: ('half', 2), 12: ('whole', 1)}


def partes_de(d):
    if d in TIPOS: return [d]
    if d == 5: return [4, 1]
    if d == 9: return [8, 1]
    if d == 10: return [8, 2]
    if d == 11: return [8, 3]
    raise ValueError(d)


def musicxml(peca):
    m = MODOS[peca]
    titulo, _ = PECA_INFO[peca]
    comp = m['compasso']
    beats, beat_type = (6, 8) if comp == 6 else (4, 4)
    fifths = armacao(m['raiz'], m['escala'])
    escala_nome = f"{NOMES_PT[letra_da_raiz(m['raiz'])]} {MODO_PT[m['escala']]}"
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">',
           '<score-partwise version="4.0">',
           f'<work><work-title>Cardomancer: {titulo}</work-title></work>',
           f'<identification><creator type="composer">Levi Constancio e Claude</creator><rights>Cardomancer</rights><encoding><software>tools/partituras.py</software></encoding></identification>',
           '<part-list><score-part id="P1"><part-name>Melodia</part-name><score-instrument id="P1-I1"><instrument-name>Flauta</instrument-name></score-instrument>'
           '<midi-instrument id="P1-I1"><midi-channel>1</midi-channel><midi-program>74</midi-program></midi-instrument></score-part></part-list>',
           '<part id="P1">']
    nbar = 0
    for s in eventos(peca):
        barras = compassos(s['notas'], comp)
        for bi, barra in enumerate(barras):
            nbar += 1
            out.append(f'<measure number="{nbar}">')
            if nbar == 1:
                out.append(f'<attributes><divisions>2</divisions><key><fifths>{fifths}</fifths></key><time><beats>{beats}</beats><beat-type>{beat_type}</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>')
                # Em 6/8 conta-se à semínima com ponto (dois terços do andamento da semínima).
                batida = '<beat-unit>quarter</beat-unit><beat-unit-dot/>' if comp == 6 else '<beat-unit>quarter</beat-unit>'
                por_minuto = m['bpm'] * 2 // 3 if comp == 6 else m['bpm']
                out.append(f'<direction placement="above"><direction-type><metronome>{batida}<per-minute>{por_minuto}</per-minute></metronome></direction-type>'
                           f'<direction-type><words>{escala_nome}</words></direction-type><sound tempo="{m["bpm"]}"/></direction>')
            if bi == 0:
                rot = s['nome'] + (' (8va abaixo)' if s['oitava'] else '')
                out.append(f'<direction placement="above"><direction-type><rehearsal>{rot}</rehearsal></direction-type></direction>')
            a = s['acordes'][bi]
            out.append(f'<harmony><root><root-step>{a[0]}</root-step>' + (f'<root-alter>{a[1]}</root-alter>' if a[1] else '') + '</root>'
                       f'<kind text="{a[2]}">{ {"": "major", "m": "minor", "dim": "diminished"}[a[2]] }</kind></harmony>')
            for n, d, liga_antes, liga_depois in barra:
                ps = partes_de(d)
                for pi, p in enumerate(ps):
                    tipo, pontos = TIPOS[p]
                    ta = liga_antes or pi > 0
                    td = liga_depois or pi < len(ps) - 1
                    if n is None:
                        out.append(f'<note><rest/><duration>{p}</duration><type>{tipo}</type>' + '<dot/>' * pontos + '</note>')
                        continue
                    letra, alt, oit, _ = n
                    lig = ('<tie type="stop"/>' if ta else '') + ('<tie type="start"/>' if td else '')
                    notacoes = ('<tied type="stop"/>' if ta else '') + ('<tied type="start"/>' if td else '')
                    out.append(f'<note><pitch><step>{letra}</step>' + (f'<alter>{alt}</alter>' if alt else '') + f'<octave>{oit}</octave></pitch>'
                               f'<duration>{p}</duration>{lig}<type>{tipo}</type>' + '<dot/>' * pontos
                               + (f'<notations>{notacoes}</notations>' if notacoes else '') + '</note>')
            out.append('</measure>')
    out[-1] = '<barline location="right"><bar-style>light-heavy</bar-style></barline></measure>'
    out += ['</part>', '</score-partwise>']
    return '\n'.join(out)


# ---------- MIDI ----------
def vlq(n):
    b = [n & 0x7f]
    n >>= 7
    while n:
        b.insert(0, (n & 0x7f) | 0x80); n >>= 7
    return bytes(b)


def faixa(evs, nome):
    evs.sort(key=lambda e: (e[0], e[1]))
    dados, t0 = bytearray(), 0
    nb = nome.encode('utf-8')
    dados += vlq(0) + b'\xff\x03' + vlq(len(nb)) + nb
    for t, _, msg in evs:
        dados += vlq(t - t0) + msg; t0 = t
    dados += vlq(0) + b'\xff\x2f\x00'
    return b'MTrk' + struct.pack('>I', len(dados)) + bytes(dados)


def midi(peca):
    m = MODOS[peca]
    tpq = 480
    colcheia = tpq // 2
    comp = m['compasso']
    mel, aco = [], []
    t = 0
    tempo = 60000000 // m['bpm']
    mel.append((0, 0, b'\xff\x51\x03' + tempo.to_bytes(3, 'big')))
    num, den = (6, 3) if comp == 6 else (4, 2)
    mel.append((0, 0, bytes([0xff, 0x58, 4, num, den, 24, 8])))
    mel.append((0, 0, bytes([0xc0, 73])))  # flauta
    aco.append((0, 0, bytes([0xc1, 48])))  # cordas
    for s in eventos(peca):
        mel.append((t, 0, b'\xff\x06' + vlq(len(s['nome'])) + s['nome'].encode()))
        for n, d in s['notas']:
            dur = d * colcheia
            if n is not None:
                vel = int(70 + 40 * s['energia'])
                mel.append((t, 1, bytes([0x90, n[3], vel])))
                mel.append((t + dur - 10, 0, bytes([0x80, n[3], 0])))
            t += dur
        # acordes: tríade na oitava da raiz, um por compasso
        tb = t - comp * colcheia * len(s['acordes'])
        for k, a in enumerate(PECAS[peca]['seccoes'][s['nome']]['acordes']):
            for i in (0, 2, 4):
                nota = soletra(m['raiz'], m['escala'], (a % 7) + i)[3]
                aco.append((tb, 1, bytes([0x91, nota, 52])))
                aco.append((tb + comp * colcheia - 10, 0, bytes([0x81, nota, 0])))
            tb += comp * colcheia
    cab = b'MThd' + struct.pack('>IHHH', 6, 1, 2, tpq)
    return cab + faixa(mel, 'Melodia') + faixa(aco, 'Acordes')


# ---------- ABC (para a página que desenha a partitura) ----------
def abc_nota(n, d, armadura):
    if n is None:
        return f'z{d if d != 1 else ""}'
    letra, alt, oit, _ = n
    # Só se escreve o acidente quando foge da armação de clave (nesta música, nunca).
    acid = '' if alt == armadura.get(letra, 0) else {1: '^', -1: '_', 0: '='}[alt]
    if oit >= 5:
        s = letra.lower() + "'" * (oit - 5)
    else:
        s = letra + ',' * (4 - oit)
    return f'{acid}{s}{d if d != 1 else ""}'


def abc(peca, ix):
    m = MODOS[peca]
    titulo, sub = PECA_INFO[peca]
    comp = m['compasso']
    raiz_l = letra_da_raiz(m['raiz'])
    modo_abc = {'dorico': 'dor', 'eolio': 'min', 'frigio': 'phr', 'jonio': 'maj', 'lidio': 'lyd', 'mixolidio': 'mix', 'locrio': 'loc'}[m['escala']]
    linhas = [f'X:{ix}', f'T:{titulo}', f'C:Cardomancer', f'M:{"6/8" if comp == 6 else "4/4"}', 'L:1/8',
              (f'Q:3/8={m["bpm"] * 2 // 3}' if comp == 6 else f'Q:1/4={m["bpm"]}'), f'%%MIDI program 73', f'K:{raiz_l}{modo_abc}']
    armadura = {}
    for g in range(7):
        l, al, _, _ = soletra(m['raiz'], m['escala'], g)
        armadura[l] = al
    vistas = set()
    for s in eventos(peca):
        if s['nome'] in vistas or s['nome'] == 'D':
            continue
        vistas.add(s['nome'])
        barras = compassos(s['notas'], comp)
        corpo = []
        for bi, barra in enumerate(barras):
            ac = '"' + nome_acorde(s['acordes'][bi]) + '"'
            txt = ''
            for n, d, _, liga in barra:
                txt += abc_nota(n, d, armadura) + ('-' if liga else '') + ' '
            corpo.append(ac + txt.strip())
        linhas.append(f'P:{s["nome"]}')
        # quatro compassos por linha
        for i in range(0, len(corpo), 4):
            linhas.append(' | '.join(corpo[i:i + 4]) + (' |]' if i + 4 >= len(corpo) else ' |'))
    return '\n'.join(linhas)


resumo = []
abcs = []
for i, peca in enumerate(['calma', 'combate', 'chefe'], 1):
    nome = {'calma': '1-estrada', 'combate': '2-combate', 'chefe': '3-chefe'}[peca]
    open(os.path.join(SAIDA, nome + '.musicxml'), 'w', encoding='utf-8').write(musicxml(peca))
    open(os.path.join(SAIDA, nome + '.mid'), 'wb').write(midi(peca))
    abcs.append((peca, abc(peca, i)))
    m = MODOS[peca]
    nb = sum(len(PECAS[peca]['seccoes'][s]['acordes']) for s in PECAS[peca]['forma'])
    seg = nb * m['compasso'] * 30 / m['bpm']
    resumo.append(f"{nome}: {nb} compassos, {seg:.0f} s, forma {' '.join(PECAS[peca]['forma'])}")
print('\n'.join(resumo))


# ---------- Página que desenha as partituras (abre no navegador; Ctrl+P guarda em PDF) ----------
pecas_html = []
for p, a in abcs:
    m = MODOS[p]
    info = PECA_INFO[p]
    pecas_html.append({'id': p, 'abc': a, 'titulo': info[0], 'sub': info[1], 'forma': ' → '.join(PECAS[p]['forma']),
                       'tom': f"{NOMES_PT[letra_da_raiz(m['raiz'])]} {MODO_PT[m['escala']]}", 'bpm': m['bpm'],
                       'compasso': '6/8' if m['compasso'] == 6 else '4/4'})
HTML = """<!doctype html>
<html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cardomancer: partituras</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/abcjs@6.4.4/abcjs-audio.css">
<style>
 body { margin: 0 auto; max-width: 980px; padding: 24px 16px 60px; font: 16px/1.5 Georgia, serif; color: #1e1208; background: #f4ead2; }
 h1 { margin: 0 0 4px; font-size: 30px; } h2 { margin: 40px 0 2px; font-size: 24px; border-bottom: 2px solid #6e4a1e; }
 .meta { margin: 0 0 6px; color: #5a3d1c; } .nota { font-size: 14px; color: #5a3d1c; }
 .pauta { background: #fffaf0; border: 1px solid #c9b48a; padding: 8px; overflow-x: auto; }
 .tocar { margin: 6px 0 10px; }
 @media print { .tocar, .nota-ecra { display: none; } h2 { break-before: page; } h2:first-of-type { break-before: auto; } body { background: #fff; } .pauta { border: 0; } }
</style></head><body>
<h1>Cardomancer: a música escrita</h1>
<p class="meta">A mesma melodia para todas as classes: cada classe toca-a com os seus instrumentos (ver <b>ideias-e-prompts.md</b>).
Melodia em altura real, cifras por cima (um acorde por compasso). As secções aparecem uma vez; a ordem em que tocam está em "Forma".
A secção D é a melodia de A uma oitava abaixo, em voz baixa.</p>
<p class="nota nota-ecra">Para guardar em PDF: Ctrl+P → Guardar como PDF. O botão de tocar usa sons de piano/flauta da Internet, só para ouvir as notas.</p>
<div id="pecas"></div>
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.4.4/dist/abcjs-basic-min.js"></script>
<script>
const PECAS = __PECAS__;
const raiz = document.getElementById('pecas');
for (const p of PECAS) {
  const s = document.createElement('section');
  s.innerHTML = `<h2>${p.titulo}</h2><p class="meta">${p.sub}<br>Tom: <b>${p.tom}</b> · Compasso: <b>${p.compasso}</b> · <b>${p.compasso === '6/8' ? 'Semínima com ponto = ' + Math.round(p.bpm * 2 / 3) : 'Semínima = ' + p.bpm}</b> · Forma: <b>${p.forma}</b></p>
    <div class="tocar" id="t-${p.id}"></div><div class="pauta" id="p-${p.id}"></div>`;
  raiz.appendChild(s);
  const vis = ABCJS.renderAbc('p-' + p.id, p.abc, { responsive: 'resize', add_classes: true, paddingtop: 0 })[0];
  if (ABCJS.synth.supportsAudio()) {
    const ctl = new ABCJS.synth.SynthController();
    ctl.load('#t-' + p.id, null, { displayPlay: true, displayProgress: true, displayRestart: true });
    ctl.setTune(vis, false, { program: 73 }).catch(() => {});
  }
}
</script></body></html>"""
open(os.path.join(SAIDA, 'partituras.html'), 'w', encoding='utf-8').write(HTML.replace('__PECAS__', json.dumps(pecas_html, ensure_ascii=False)))
