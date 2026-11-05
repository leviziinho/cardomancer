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
JANELA_CLASSE = (880, 880)
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
PASTAS = ['classes', 'racas', 'antecedentes', 'itens', 'aliados', 'regioes', 'terrenos']
# As páginas do livro têm uma janela mais larga do que alta (760 x 600).
JANELA = {'regioes': (960, 758), 'terrenos': (960, 758)}
dados = {'cartas': {}, 'papel': None, 'logo': None, 'mapa': None, 'capa': None, 'mesa': None, 'botao': None, 'botaoLiso': None, 'botaoOrn': None}
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
            dados['cartas'][k] = texto(recorta(apara(img, MARGEM['classes']), *JANELA.get(pasta, JANELA_CLASSE), FOCO_IMAGEM.get(k, FOCO.get(pasta, FOCO['classes']))), 74)
            print(k)
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
dados['miniaturas'] = {}
for real in pastas_reais.get('miniaturas', []):
    for f in imagens(real):
        nome = sem_acentos(os.path.splitext(f)[0])
        dados['miniaturas'][nome] = texto(justo(sem_fundo(Image.open(os.path.join(ARTE, real, f))), 512), 84)
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
    if os.path.splitext(f)[0].lower() == 'mesa':
        img = Image.open(os.path.join(ARTE, f)).convert('RGB')
        img.thumbnail((1536, 1536), Image.LANCZOS)
        dados['mesa'] = texto(img, 80)
        print('mesa')
    # A capa do livro, ao alto; o logótipo põe-se por cima no jogo.
    if os.path.splitext(f)[0].lower() == 'capa':
        img = Image.open(os.path.join(ARTE, f)).convert('RGB')
        img.thumbnail((1400, 1400), Image.LANCZOS)
        dados['capa'] = texto(img, 80)
        print('capa')
    # O mapa pintado: o jogo estica-o à proporção do mapa (1,4:1) e desenha os lugares por cima.
    if os.path.splitext(f)[0].lower() == 'mapa':
        img = Image.open(os.path.join(ARTE, f)).convert('RGB')
        img.thumbnail((1800, 1800), Image.LANCZOS)
        dados['mapa'] = texto(img, 82)
        print('mapa')

js = ('// Gerado por tools/arte.py a partir das imagens em arte/. Não editar à mão.\n'
      'const ARTE = ' + json.dumps(dados) + ';\n'
      '// As imagens descodificam-se logo ao abrir, muito antes da primeira carta.\n'
      'ARTE.img = {};\n'
      'Object.entries(ARTE.cartas).forEach(([k, s]) => { const i = new Image(); i.src = s; ARTE.img[k] = i; });\n'
      "if (ARTE.papel) { const i = new Image(); i.src = ARTE.papel; ARTE.img.papel = i; }\n"
      "['logo', 'mapa', 'capa', 'mesa', 'botao', 'botaoLiso', 'botaoOrn'].forEach(k => { if (ARTE[k]) { const i = new Image(); i.src = ARTE[k]; ARTE.img[k] = i; } });\n"
      "['icones', 'miniaturas'].forEach(g => Object.entries(ARTE[g] || {}).forEach(([k, s]) => { const i = new Image(); i.src = s; ARTE.img[g + '/' + k] = i; }));\n")
open(SAIDA, 'w', encoding='utf8', newline='\n').write(js)
print('js/arte.js', round(len(js) / 1024), 'KB')
