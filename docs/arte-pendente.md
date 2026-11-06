# Arte que ainda falta

Revisão feita a 5 de novembro de 2026. Todas as cartas públicas (classes, raças, antecedentes, itens e aliados de Daraan) já têm ilustração. As cartas sem arte são de Madeira Negra e de Vesper, por isso ficam para quando esses mundos abrirem.

O que ainda é desenho feito pelo código, por ordem de impacto:

| Prioridade | O quê | Onde aparece | Guia |
|---|---|---|---|
| 1 | Retratos dos 6 vilões | Carta "A Verdade" e Capítulo Final | `docs/arte-retratos.md` |
| 2 | Retratos dos 12 inimigos | Página do livro em cada combate | `docs/arte-retratos.md` |
| 3 | Retratos dos 10 mestres | Encontro raríssimo | `docs/arte-retratos.md` |
| 4 | Verso da carta "O Destino" | A carta selada da missão, durante toda a partida | abaixo |
| 5 | Castelo das cidades | As 8 cidades no mapa | abaixo |
| 6 | Rosa dos ventos | Canto do mapa | abaixo |

O jogo já está preparado para todas: basta gravar o ficheiro com o nome indicado e correr `python tools/arte.py`.

Anexe sempre uma carta já feita como referência de estilo.

## Verso da carta "O Destino" (`arte/destino.png`)

O jogo escreve "O DESTINO" em cima e "Não abrir antes do fim" em baixo, por isso o centro e as pontas devem ficar livres de pormenor.

```
Verso de uma carta de jogo de fantasia medieval, formato vertical 5:7.
Fundo de carvão escuro e fosco, gasto nas bordas, com uma moldura fina de ouro velho.
Ao centro, um grande selo de lacre vermelho-escuro, rachado, com um olho gravado no meio.
O terço de cima e o terço de baixo ficam lisos e escuros, para pôr texto por cima.
Tinta e aguarela, no mesmo traço da imagem de referência. Sem texto, sem letras.
```

## Castelo das cidades (`arte/icones/castelo.png`)

```
Ícone de um pequeno castelo medieval de pedra clara, com duas torres e uma bandeira,
desenhado como num mapa antigo: contorno a tinta castanho-escura e sombreado a aguarela.
Visto de frente, ligeiramente de cima. Gasto, sem brilho.
Fundo branco liso e uniforme, sem sombra no chão, sem texto. Formato quadrado 1:1.
```

## Rosa dos ventos (`arte/rosa.png`)

O jogo escreve o "N" por cima, por isso a rosa não deve ter letras.

```
Rosa dos ventos de um mapa antigo de fantasia: estrela de oito pontas em ouro velho e tinta castanha,
com um anel fino à volta e pequenos ornamentos entre as pontas.
Desenhada a tinta e aguarela, gasta, como num pergaminho muito usado.
Fundo branco liso e uniforme, sem texto, sem letras. Formato quadrado 1:1.
```

## Já não precisa de arte

- **Moeda**: a face já usa a coroa pintada dos ícones.
- **Dados, latão, lacre e moedas**: ficaram foscos e riscados no código, sem precisar de imagem.
- **Caixa dos dados**: forrada com o veludo da placa dos botões.
- **Pergaminho enrolado**: usa o papel velho das cartas.
