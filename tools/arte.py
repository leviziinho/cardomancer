# Passa a arte gerada (em arte/) para o jogo, em js/arte.js.
#
# Cada imagem é recortada à medida do sítio onde vai, reduzida, gravada em WebP
# e embutida no ficheiro como texto. Assim o jogo abre com duplo clique no
# index.html: o navegador não deixa o WebGL usar imagens soltas vindas de file://.
#
# Onde pôr as imagens (PNG, JPG ou WebP, com qualquer tamanho):
#   arte/cartas/<pasta>/<chave>.png    ilustração da carta; pastas: classes, racas,
#                                      antecedentes, itens, aliados (a chave é a do jogo)
#   arte/cartas/papel.png              papel velho e gasto, ao alto
#   arte/logo.png, arte/mapa.png, arte/capa.png
#   arte/regioes/<lugar>.png, arte/terrenos/<terreno>.png   páginas do livro
#   arte/icones/<nome>.png ou folhaN.png (3 x 3)            ícones, fundo liso
#   arte/miniaturas/<classe>.png                            pino do herói, fundo liso
#   arte/retratos/<vilao>.png, arte/retratos/mestre-<classe>.png   carta do vilão e páginas do livro
#
# Correr:  python tools/arte.py
import base64, io, json, os, sys
from PIL import Image, ImageEnhance

# O papel perde cor e ganha luz, para não competir com a ilustração (que já vem quente).
PAPEL_COR, PAPEL_LUZ = .45, 1.12

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTE = os.path.join(RAIZ, 'arte')
SAIDA = os.path.join(RAIZ, 'js', 'arte.js')
EXT = ('.png', '.jpg', '.jpeg', '.webp')

# Medidas finais, em pontos da carta (1024 x 1434). A janela da ilustração das
# classes tem 800 x 800, quadrada como as imagens geradas; grava-se um pouco maior para ficar nítida ao aproximar.
JANELA_CLASSE = (800, 800)
# Qualidade das ilustrações (WebP). 64 mantém a pintura nítida e deixa o arte.js bem abaixo dos 50 MB do GitHub.
QUALIDADE = 64
PAPEL = (1024, 1434)

# Onde fica o centro do recorte, de 0 a 1 (x, y). A cara costuma estar em cima.
FOCO = {'classes': (.5, .3), 'regioes': (.5, .5), 'terrenos': (.5, .5)}
# Ajustes por imagem, quando a cara fica muito em cima ou de lado: 'pasta/chave': (x, y).
FOCO_IMAGEM = {'racas/elfosombrio': (.5, 0)}

# Quanto cortar de cada lado antes de recortar à medida (0 a 1). O gerador
# costuma pintar uma moldura ou uma margem de papel à volta da ilustração.
MARGEM = {'classes': 0, 'papel': .012}


def apara(img, m):
    dx, dy = round(img.width * m), round(img.height * m)
    return img.crop((dx, dy, img.width - dx, img.height - dy))


def sem_branco(img):
    # O fundo branco que fica nos rasgões passa a castanho de papel queimado.
    img = img.convert('RGB')
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b = px[x, y]
            if min(r, g, b) > 205 and max(r, g, b) - min(r, g, b) < 40:
                px[x, y] = (92, 58, 28)
    return img


def recorta(img, w, h, foco=(.5, .5)):
    img = img.convert('RGB')
    escala = max(w / img.width, h / img.height)
    nw, nh = round(img.width * escala), round(img.height * escala)
    img = img.resize((nw, nh), Image.LANCZOS)
    x = round((nw - w) * foco[0]); y = round((nh - h) * foco[1])
    return img.crop((x, y, x + w, y + h))


def texto(img, q):
    b = io.BytesIO()
    img.save(b, 'WEBP', quality=q, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()


def imagens(pasta):
    p = os.path.join(ARTE, pasta)
    if not os.path.isdir(p):
        return []
    return sorted(f for f in os.listdir(p) if f.lower().endswith(EXT))


# Todas as cartas com ilustração usam a mesma janela; a chave no jogo é "pasta/nome", por ex. "racas/elfo".
PASTAS = ['classes', 'racas', 'antecedentes', 'itens', 'aliados', 'regioes', 'terrenos', 'retratos']
# As páginas do livro têm uma janela mais larga do que alta (760 x 600).
JANELA = {"regioes": (760, 600), "terrenos": (760, 600)}
dados = {'cartas': {}, 'papel': None, 'logo': None, 'mapa': None, 'capa': None, 'mesa': None, 'couro': None, 'botao': None, 'botaoLiso': None, 'botaoOrn': None, 'veludo': None, 'rosa': None, 'destino': None}
import unicodedata
def sem_acentos(t):
    return ''.join(c for c in unicodedata.normalize('NFD', t.lower()) if unicodedata.category(c) != 'Mn')
# As pastas podem ter acentos ("raças"); o jogo usa a chave sem acentos ("racas").
# Procura-as em arte/cartas/<pasta> e também em arte/<pasta>, para não importar onde ficaram.
pastas_reais = {}
for base in ('', 'cartas'):
    raiz = os.path.join(ARTE, base)
    for p in os.listdir(raiz):
        if os.path.isdir(os.path.join(raiz, p)):
            pastas_reais.setdefault(sem_acentos(p), []).append(os.path.join(base, p))
for pasta in PASTAS:
    for real in pastas_reais.get(pasta, []):
        for f in imagens(real):
            k = pasta + '/' + sem_acentos(os.path.splitext(f)[0])
            img = Image.open(os.path.join(ARTE, real, f))
            dados['cartas'][k] = texto(recorta(apara(img, MARGEM['classes']), *JANELA.get(pasta, JANELA_CLASSE), FOCO_IMAGEM.get(k, FOCO.get(pasta, FOCO['classes']))), QUALIDADE)
            print(k)
# As pinturas das regiões servem também nas cartas de cidade (quadradas): 'cidades/<lugar>'.
for real in pastas_reais.get('regioes', []):
    for f in imagens(real):
        k = 'cidades/' + sem_acentos(os.path.splitext(f)[0])
        dados['cartas'][k] = texto(recorta(Image.open(os.path.join(ARTE, real, f)), *JANELA_CLASSE, (.5, .5)), QUALIDADE)
        print(k)
# Os retratos servem na carta (quadrada, já feita acima) e na página do livro (mais larga): 'retratosLivro/<nome>'.
for real in pastas_reais.get('retratos', []):
    for f in imagens(real):
        k = 'retratosLivro/' + sem_acentos(os.path.splitext(f)[0])
        dados['cartas'][k] = texto(recorta(Image.open(os.path.join(ARTE, real, f)), *JANELA['regioes'], FOCO['classes']), QUALIDADE)
        print(k)
# Quando há duas versões de um retrato, fica a escolhida; a outra é ignorada.
ESCOLHIDOS = {'mestre-mago2': 'mestre-mago', 'mestre-mago1': None}
for pre in ('retratos/', 'retratosLivro/'):
    for de, para in ESCOLHIDOS.items():
        img = dados['cartas'].pop(pre + de, None)
        if img and para:
            dados['cartas'][pre + para] = img
# Enquanto não houver retrato próprio, o inimigo usa a pintura da carta de aliado.
SUBSTITUTOS = {'inimigo-simony-lumiel': 'simony'}
for retrato, aliado in SUBSTITUTOS.items():
    if 'retratosLivro/' + retrato in dados['cartas']:
        continue
    for real in pastas_reais.get('aliados', []):
        for f in imagens(real):
            if sem_acentos(os.path.splitext(f)[0]) == aliado:
                dados['cartas']['retratosLivro/' + retrato] = texto(recorta(apara(Image.open(os.path.join(ARTE, real, f)), MARGEM['classes']), *JANELA['regioes'], FOCO['classes']), QUALIDADE)
                print('retratosLivro/' + retrato, '(da carta de aliado)')
# Ícones e miniaturas vêm num fundo liso; o fundo que toca nas bordas fica transparente.
from PIL import ImageDraw, ImageChops, ImageFilter
def sem_fundo(img, neutros=False):
    if img.mode == 'RGBA' and img.getextrema()[3][0] < 250:
        return img
    rgb = img.convert('RGB')
    if neutros:
        # Nos ícones (todos dourados ou de cor), qualquer claro sem cor é fundo: apanha o branco
        # preso dentro do cadeado ou da chave, e o xadrez que o gerador às vezes pinta por trás.
        import numpy as np
        a = np.asarray(rgb).astype(int)
        claro_neutro = (a.min(axis=2) > 170) & (a.max(axis=2) - a.min(axis=2) < 22)
        m = Image.fromarray(np.where(claro_neutro, 0, 255).astype('uint8'))
        m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
        out = img.convert('RGBA'); out.putalpha(m)
        return out
    w, h = rgb.size
    marca = (255, 0, 254)
    for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if rgb.getpixel(p) != marca and min(rgb.getpixel(p)) > 190:
            ImageDraw.floodfill(rgb, p, marca, thresh=48)
    alfa = ImageChops.difference(rgb, Image.new('RGB', (w, h), marca)).convert('L').point(lambda v: 255 if v > 0 else 0)
    alfa = alfa.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    out = img.convert('RGBA'); out.putalpha(alfa)
    return out

# O fundo preso dentro da figura (entre as pernas, dentro do arco) não toca nas bordas e ficava branco.
# Cada mancha grande de branco sem cor passa a transparente; as pequenas (brilhos, água) ficam.
def sem_buracos(img):
    import numpy as np
    a = np.asarray(img.convert('RGB')).astype(int)
    alfa = np.asarray(img.getchannel('A'))
    claro = (a.min(axis=2) > 222) & (a.max(axis=2) - a.min(axis=2) < 16) & (alfa > 0)
    h, w = claro.shape
    base = Image.fromarray((claro * 255).astype('uint8')).copy()
    minimo = w * h * 0.0015
    tira = np.zeros_like(claro)
    for y in range(0, h, 6):
        for x in range(0, w, 6):
            if base.getpixel((x, y)) != 255:
                continue
            m = base.copy()
            ImageDraw.floodfill(m, (x, y), 128)
            reg = np.asarray(m) == 128
            ImageDraw.floodfill(base, (x, y), 64)
            if reg.sum() >= minimo:
                tira |= reg
    al = alfa.copy()
    al[tira] = 0
    out = img.copy()
    out.putalpha(Image.fromarray(al).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1)))
    return out

def justo(img, lado):
    img = img.crop(img.getchannel('A').getbbox())
    img.thumbnail((lado, lado), Image.LANCZOS)
    return img

# Os ícones podem vir em folhas de 3 x 3 (arte/icones/folhaN.png), lidas linha a linha por esta ordem.
FOLHAS = {
    'folha1': ['sword', 'axe', 'dagger', 'bow', 'shield', 'hammer', 'fist', 'flame', 'heart'],
    'folha2': ['star', 'sun', 'moon', 'eye', 'leaf', 'feather', 'drop', 'peak', 'tower'],
    'folha3': ['scroll', 'note', 'speech', 'person', 'crown', 'seal', 'rune', 'lock', 'sign'],
    'folha4': ['coin', 'bag', 'hourglass', 'punho', 'pesAlados', 'cerebro', 'labios', 'chave', 'vela'],
}
dados['icones'] = {}
for real in pastas_reais.get('icones', []):
    for f in imagens(real):
        nome = os.path.splitext(f)[0]
        if nome.lower() in ('rosa', 'destino'):
            continue  # têm tratamento próprio, mais abaixo
        img = sem_fundo(Image.open(os.path.join(ARTE, real, f)), neutros=True)
        if nome in FOLHAS:
            w, h = img.size
            for i, n in enumerate(FOLHAS[nome]):
                cel = img.crop((w * (i % 3) // 3, h * (i // 3) // 3, w * (i % 3 + 1) // 3, h * (i // 3 + 1) // 3))
                if cel.getchannel('A').getbbox():
                    dados['icones'][n] = texto(justo(cel, 256), 84)
        else:
            dados['icones'][nome] = texto(justo(img, 256), 84)
print('ícones:', len(dados['icones']))
# A rosa dos ventos e o verso do Destino podem estar na raiz de arte/ ou em arte/icones/.
for real in [''] + pastas_reais.get('icones', []):
    for f in imagens(real):
        n = os.path.splitext(f)[0].lower()
        if n == 'rosa' and not dados['rosa']:
            dados['rosa'] = texto(justo(sem_buracos(sem_fundo(Image.open(os.path.join(ARTE, real, f)))), 512), 86)  # o branco entre a estrela e o aro também sai
            print('rosa')
        if n == 'destino' and not dados['destino']:
            dados['destino'] = texto(recorta(Image.open(os.path.join(ARTE, real, f)), 1024, 1434), 80)
            print('destino')
dados['miniaturas'] = {}
for real in pastas_reais.get('miniaturas', []):
    for f in imagens(real):
        nome = sem_acentos(os.path.splitext(f)[0])
        dados['miniaturas'][nome] = texto(justo(sem_buracos(sem_fundo(Image.open(os.path.join(ARTE, real, f)))), 512), 84)
print('miniaturas:', len(dados['miniaturas']))

# A placa dos botões (arte/botao.png, 1536 x 1024) parte-se em peças, para servir botões de qualquer largura:
#   botao     pontas com a flor-de-lis + faixa lisa no meio (estica sem deformar as pontas)
#   botaoOrn  o ornamento do centro, que sai por cima e por baixo da moldura (só nos botões grandes)
#   botaoLiso só a faixa lisa, para os botões estreitos da barra
for f in imagens(''):
    if os.path.splitext(f)[0].lower() == 'botao':
        img = sem_fundo(Image.open(os.path.join(ARTE, f)))
        Y0, Y1 = 322, 690
        esq, dir_ = img.crop((0, Y0, 240, Y1)), img.crop((img.width - 240, Y0, img.width, Y1))
        faixa = img.crop((260, Y0, 480, Y1))
        comp = Image.new('RGBA', (240 + 220 + 240, Y1 - Y0))
        comp.paste(esq, (0, 0)); comp.paste(faixa, (240, 0)); comp.paste(dir_, (460, 0))
        dados['botao'] = texto(comp.resize((comp.width // 2, comp.height // 2), Image.LANCZOS), 86)
        # A placa lisa: a faixa com a moldura de cima rodada para fazer os lados (9 fatias de 44 pontos).
        liso = faixa.copy()
        lado = faixa.crop((0, 4, 220, 48)).rotate(90, expand=True)
        liso.alpha_composite(lado, (0, 0)); liso.alpha_composite(lado.transpose(Image.FLIP_LEFT_RIGHT), (220 - lado.width, 0))
        liso.alpha_composite(faixa.crop((0, 0, 220, 48)), (0, 0)); liso.alpha_composite(faixa.crop((0, 310, 220, 368)), (0, 310))
        dados['botaoLiso'] = texto(liso.resize((110, 184), Image.LANCZOS), 86)
        # O ornamento esbate-se nos lados, para não se ver a costura sobre o veludo.
        orn = img.crop((490, 252, 1046, 740))
        a = orn.getchannel('A'); m = Image.new('L', orn.size, 255); d = ImageDraw.Draw(m)
        for i in range(40):
            v = round(255 * i / 40); d.line([(i, 0), (i, orn.height)], v); d.line([(orn.width - 1 - i, 0), (orn.width - 1 - i, orn.height)], v)
        orn.putalpha(ImageChops.multiply(a, m))
        dados['botaoOrn'] = texto(orn.resize((278, 244), Image.LANCZOS), 86)
        # Um pedaço de veludo liso (sem moldura nem ornamentos), para forrar a caixa dos dados.
        dados['veludo'] = texto(img.crop((1060, 390, 1280, 610)).convert('RGB'), 84)
        print('botão')
for f in imagens('cartas'):
    if os.path.splitext(f)[0].lower() == 'papel':
        img = sem_branco(apara(Image.open(os.path.join(ARTE, 'cartas', f)), MARGEM['papel']))
        img = ImageEnhance.Brightness(ImageEnhance.Color(img).enhance(PAPEL_COR)).enhance(PAPEL_LUZ)
        dados['papel'] = texto(recorta(img, *PAPEL), 80)
        print('papel')
# O logótipo guarda a transparência: serve no ecrã inicial e no verso das cartas.
for f in imagens(''):
    if os.path.splitext(f)[0].lower() == 'logo':
        img = Image.open(os.path.join(ARTE, f)).convert('RGBA')
        img.thumbnail((1200, 1200), Image.LANCZOS)
        dados['logo'] = texto(img, 84)
        print('logo')
    # O tampo da mesa, quadrado e contínuo; repete-se no jogo.
    # Conta a versão mais nova que houver: mesa3.png, depois mesa2.png, depois mesa.png.
    mesa_atual = next((n for n in ('mesa3', 'mesa2', 'mesa') if os.path.exists(os.path.join(ARTE, n + '.png'))), None)
    if os.path.splitext(f)[0].lower() == mesa_atual:
        img = Image.open(os.path.join(ARTE, f)).convert('RGB')
        img.thumbnail((2048, 2048), Image.LANCZOS)
        # A pintura é suave e, repetida na mesa inteira, parecia desfocada: um pouco de nitidez nos veios.
        img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=90, threshold=2))
        dados['mesa'] = texto(img, 88)
        print('mesa')
    # O couro da pasta do mapa, quadrado e contínuo; repete-se no jogo.
    if os.path.splitext(f)[0].lower() == 'couro':
        img = Image.open(os.path.join(ARTE, f)).convert('RGB')
        img.thumbnail((1254, 1254), Image.LANCZOS)
        img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))
        dados['couro'] = texto(img, 86)
        print('couro')
    # A capa do livro, ao alto; o logótipo põe-se por cima no jogo.
    if os.path.splitext(f)[0].lower() == 'capa':
        img = Image.open(os.path.join(ARTE, f)).convert('RGB')
        img.thumbnail((1400, 1400), Image.LANCZOS)
        dados['capa'] = texto(img, 80)
        print('capa')
    # A rosa dos ventos do mapa, em fundo branco que fica transparente.
    if os.path.splitext(f)[0].lower() == 'rosa':
        dados['rosa'] = texto(justo(sem_fundo(Image.open(os.path.join(ARTE, f))), 512), 86)
        print('rosa')
    # O verso da carta selada "O Destino", à medida da carta.
    if os.path.splitext(f)[0].lower() == 'destino':
        dados['destino'] = texto(recorta(Image.open(os.path.join(ARTE, f)), 1024, 1434), 80)
        print('destino')
    # O mapa pintado: o jogo estica-o à proporção do mapa (1,4:1) e desenha os lugares por cima.
    if os.path.splitext(f)[0].lower() == 'mapa':
        img = Image.open(os.path.join(ARTE, f)).convert('RGB')
        img.thumbnail((1800, 1800), Image.LANCZOS)
        dados['mapa'] = texto(img, 82)
        print('mapa')

# Os assets da interface (arte/interface/): placas, botões, marcas do mapa, selos das cartas e texturas dos objetos.
# 'alfa': fundo branco fica transparente e corta-se à figura; 'opaco': textura sem transparência.
INTERFACE = {
    'painel': ('alfa', 1100), 'botao': ('alfa', 700), 'faixa': ('alfa', 1400), 'verso': ('alfa', 1200),
    'estrela-mapa': ('alfa', 400), 'anel-missao': ('alfa', 400), 'olho-mapa': ('alfa', 400), 'marca-pista': ('alfa', 600), 'lacre': ('alfa', 512),
    'medalhao': ('alfa', 512), 'olho-carta': ('alfa', 256),
    'barra': ('opaco', 720), 'veludo': ('opaco', 1024), 'tinteiro': ('opaco', 1024),
}
dados['interface'] = {}
for real in pastas_reais.get('interface', []):
    for f in imagens(real):
        nome = sem_acentos(os.path.splitext(f)[0]).lower()
        img = Image.open(os.path.join(ARTE, real, f))
        if nome in INTERFACE:
            modo, lado = INTERFACE[nome]
            if modo == 'alfa':
                img = justo(sem_buracos(sem_fundo(img)), lado)
            else:
                img = img.convert('RGB'); img.thumbnail((lado, lado), Image.LANCZOS)
            dados['interface'][nome] = texto(img, 86)
        elif nome == 'trilha':
            # Veio quadrada: serve só a faixa de cima, com a orla de latão.
            img = img.convert('RGB'); img = img.crop((0, 0, img.width, img.height // 4)); img.thumbnail((1280, 1280), Image.LANCZOS)
            dados['interface']['trilha'] = texto(img, 84)
        elif nome == 'selos-chance':
            # Três selos lado a lado: verde (fácil), âmbar e vermelho (difícil).
            img = sem_fundo(img); w = img.width
            for i, cor in enumerate(['verde', 'ambar', 'vermelho']):
                dados['interface']['selo-' + cor] = texto(justo(img.crop((w * i // 3, 0, w * (i + 1) // 3, img.height)), 256), 86)
        elif nome == 'mascaras':
            # Três máscaras sobre pergaminho: entram no jogo a multiplicar, e o pergaminho some sobre a carta.
            img = img.convert('RGB'); w = img.width
            for i, k in enumerate(['bom', 'mau', 'neutro']):
                c = img.crop((w * i // 3, 0, w * (i + 1) // 3, img.height)); c.thumbnail((512, 512), Image.LANCZOS)
                dados['interface']['mascara-' + k] = texto(c, 84)
print('interface:', sorted(dados['interface']))

js = ('// Gerado por tools/arte.py a partir das imagens em arte/. Não editar à mão.\n'
      'const ARTE = ' + json.dumps(dados) + ';\n'
      '// As imagens descodificam-se logo ao abrir, muito antes da primeira carta.\n'
      'ARTE.img = {};\n'
      'Object.entries(ARTE.cartas).forEach(([k, s]) => { const i = new Image(); i.src = s; ARTE.img[k] = i; });\n'
      "if (ARTE.papel) { const i = new Image(); i.src = ARTE.papel; ARTE.img.papel = i; }\n"
      "['logo', 'mapa', 'capa', 'mesa', 'couro', 'botao', 'botaoLiso', 'botaoOrn', 'veludo', 'rosa', 'destino'].forEach(k => { if (ARTE[k]) { const i = new Image(); i.src = ARTE[k]; ARTE.img[k] = i; } });\n"
      "['icones', 'miniaturas', 'interface'].forEach(g => Object.entries(ARTE[g] || {}).forEach(([k, s]) => { const i = new Image(); i.src = s; ARTE.img[g + '/' + k] = i; }));\n")
open(SAIDA, 'w', encoding='utf8', newline='\n').write(js)
print('js/arte.js', round(len(js) / 1024), 'KB')
