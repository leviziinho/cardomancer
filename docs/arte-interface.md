# Assets da interface: prompts para o ChatGPT

Pedidos de 6 nov. Cada asset substitui uma peça hoje feita em código ou com o botão do menu repetido.

**Regras para todos**
- Mesmo estilo das cartas: tinta e aguarela pintada à mão, fantasia medieval sombria, **gasto** (riscos, cantos lascados, ouro baço).
- Fundo **branco liso** (o `tools/arte.py` torna-o transparente), salvo onde diz "contínuo".
- De frente ou visto de cima, sem perspetiva e sem sombra projetada.
- Sem texto, sem letras, sem números.
- Guardar em `arte/interface/` com o nome indicado e avisar: cada um precisa de uma pequena ligação no código.

Frase base para colar no fim de cada prompt:

> Hand-painted ink and watercolour, dark medieval fantasy card game style, worn and aged: scratches, chipped edges, tarnished matte gold. Front view, flat even lighting, no cast shadow, no text, no letters, no numbers, plain white background.

---

## A. Painéis e botões (hoje é tudo o botão do menu repetido)

| Ficheiro | Onde aparece | Prompt |
|---|---|---|
| `painel.png` | Caixas de texto: Missão, avisos, a pergunta por cima das cartas | Empty rectangular panel of deep burgundy velvet stretched inside a thin worn gold frame with small ornamental corners, wide landscape proportion 3:1, the middle plain so text can sit on it. |
| `botao.png` (substitui) | Botões da barra lateral (Ficha, Mapa, Ajuda…) | Small empty rectangular button, dark red leather with a narrow worn brass border and tiny rivets at the corners, proportion 3:1. |
| `barra.png` | Fundo da barra lateral direita | Tall narrow vertical strip of dark oiled wood with a worn brass edge on the left side, proportion 1:6. Seamless top to bottom. |
| `trilha.png` | Barra dos dias, em baixo | Long narrow horizontal strip of dark wood with a thin worn brass edge on top, proportion 10:1. Seamless left to right. |

## B. Mapa

| Ficheiro | Onde aparece | Prompt |
|---|---|---|
| `faixa.png` | Título "Daraan, o Império da Espada" | Empty horizontal parchment ribbon banner with folded red cloth tails at both ends, worn edges, small tears, proportion 6:1, the middle plain for a title. |
| `marca-pista.png` | Sítio da pista | Circular map marker drawn in dark ink: a dashed circle with three small empty round sockets evenly spaced on it (top, lower left, lower right). Centre empty. Square image. |
| `olho-mapa.png` | O olho por cima da pista | Round parchment medallion with a thick dark ink rim, a red painted eye in the centre, slightly worn. Square image. |
| `anel-missao.png` (pedido a 6 nov.) | O círculo à volta da cidade da missão | Circular map marker: a ring of worn gold with small engraved notches and a thin dark ink outline, a little thicker at four points like a compass ring. Centre empty. Square image. |
| `estrela-mapa.png` | A missão no mapa | Round parchment medallion with a thick dark ink rim and a gold eight-pointed star in the centre, slightly worn. Square image. |

A rosa dos ventos e a carta do Destino já existiam (`arte/icones/rosa.png` e `destino.png`), mas o gerador não as lia. Já está corrigido.

## C. Cartas

| Ficheiro | Onde aparece | Prompt |
|---|---|---|
| `medalhao.png` | Círculo do tipo da carta, ao centro | Empty round medallion frame: worn gold ring with a fine engraved border pattern and a recessed centre of aged parchment. Square image. |
| `selos-chance.png` | O selo da percentagem, no canto | Sheet of three small round wax-stamp badges side by side, worn and slightly uneven: one muted green, one amber, one dark red. Each with an empty pale centre. Proportion 3:1. |
| `olho-carta.png` | O olho vermelho no canto das cartas de pista | Small round dark red badge with a worn gold rim and a pale painted eye in the centre. Square image. |
| `mascaras.png` | A máscara ao fundo das cartas que mexem na tendência | Sheet of three theatre masks side by side, drawn as faint sepia engravings: a smiling mask, a weeping mask, a mask with closed tight lips. Proportion 3:1. |
| `verso.png` | O verso das cartas e o topo do baralho | Card back, portrait 5:7: very dark brown aged card stock, worn gold double border with small corner ornaments, scuffed corners, a plain empty dark centre (the logo goes there). |

## D. Objetos da mesa

| Ficheiro | Onde aparece | Prompt |
|---|---|---|
| `veludo.png` (substitui) | Fundo da caixa de dados | Seamless tileable texture, top-down, worn dark red velvet with crushed nap, faint dust and a few bald patches. Flat lighting. Edges tile seamlessly. |
| `lacre.png` | O disco vermelho na mesa (selo de lacre) | Top-down view of a single round red wax seal, irregular dripping edge, stamped emblem of a sword crossed with a quill, small cracks. Plain white background. |
| `tinteiro.png` | O tinteiro | Seamless texture of old dark green-black glass with dried ink drips and fine scratches, flat lighting, tile seamlessly. (Vai à volta do frasco.) |

---

**Ordem sugerida**, do que mais se nota para o que menos: A (painéis e botões), `verso.png`, `medalhao.png`, `selos-chance.png`, depois o mapa e os objetos.

---

## E. Tampo da mesa, de novo (pedido a 6 nov.)

A pintura atual (`mesa2.png`) tem só 1254 pontos e manchas de aguarela grandes: repetida pela mesa, fica mole e parece pixelada. A nova deve ter **detalhe fino e nítido** e ser **contínua** (os lados encaixam).

| Ficheiro | Prompt |
|---|---|
| `mesa3.png` | Seamless tileable texture, top-down orthographic view of an old tavern table top: 6 long dark oak planks running horizontally, each the full width of the image, with thin dark gaps between them. Crisp fine wood grain lines, a few small knots, shallow scratches, faint ring stains from cups, worn lighter edges on the planks. Rich dark brown with warm reddish tones, matte, even flat lighting, no shadows, no objects, no vignette. Sharp photographic detail, not blurry, not painterly blobs. Left and right edges and top and bottom edges tile seamlessly. Square 1:1, highest resolution. |

Guardar em `arte/mesa3.png`; o gerador usa-a no lugar da `mesa2.png`. Se o ChatGPT só der 1024 pontos, vale a pena passar por um ampliador (por ex. Upscayl, gratuito) para 2048 antes de guardar.
