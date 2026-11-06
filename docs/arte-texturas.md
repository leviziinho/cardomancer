# Texturas da mesa: prompts para o ChatGPT

Uma textura 3D é sempre uma imagem plana colada na superfície. O volume vem da luz do jogo e de um relevo que o código tira da própria imagem. Por isso cada pedido tem de ser:

- **visto de cima**, a direito, sem perspetiva;
- **sem sombras nem luz dirigida** (a luz põe-na o jogo);
- **contínuo nas bordas** (a imagem repete-se lado a lado sem se notar a costura);
- **quadrado**, 1024 × 1024 ou maior.

Depois de gerar, guardar na pasta `arte/` com o nome indicado e correr `python tools/arte.py`.

## 1. Tampo da mesa — `arte/mesa.png` (substitui a atual)

> Seamless tileable texture, top-down orthographic view of an old tavern table made of narrow dark oak planks running horizontally, about 8 planks across the image. Worn and aged: knife scratches, cup rings, faint candle-wax drips, darkened grain and nail heads. Muted deep brown, slightly cool, not orange. Flat even lighting, no shadows, no perspective, no objects. Hand-painted ink and watercolour style with fine detail, matching a dark medieval fantasy card game. Edges must tile seamlessly.

Notas: a atual tem tábuas largas e muito laranja. O jogo já a repete seis vezes, por isso uma imagem com 8 tábuas fica com tábuas estreitas.

## 2. Couro da pasta do mapa — `arte/couro.png` (nova)

> Seamless tileable texture, top-down orthographic view of old dark brown leather, like a well-used map case. Fine natural grain, scuffs, small creases and lighter worn patches, a few faint scratches. Dark chocolate brown with a hint of oxblood, not green, not orange. Flat even lighting, no shadows, no stitching, no edges, no objects. Hand-painted ink and watercolour style with fine detail. Edges must tile seamlessly.

O jogo já está preparado: se `arte/couro.png` existir, a pasta debaixo do mapa usa-a; se não, fica o castanho feito em código.

## 3. Como saber se ficou bem

- Abrir a imagem e imaginar quatro cópias lado a lado: não pode haver uma linha onde se juntam.
- Se tiver uma mancha muito marcada (um nó, uma queimadura), vai repetir-se e notar-se. Pedir de novo com "no large distinctive features".
- Se vier com sombra de um lado, pedir de novo com "completely flat lighting".
