# Cardomancer

Uma aventura de fantasia em forma de jogo de tabuleiro 3D. Tudo é decidido por draft: o baralho oferece três cartas e você fica com uma. Uma trama secreta fica selada até ao fim.

## Como jogar

Faça duplo clique em `index.html`. É preciso Internet para descarregar o motor 3D e as fontes (o navegador guarda-os em cache).

- Clique numa carta para a escolher, ou use as teclas `1` a `4`.
- Passe o rato por cima de uma carta para a aproximar.
- Na barra de baixo, `Mapa` e `Ficha` deixam espreitar a mesa. Clique de novo para voltar.

## Regras

- **Testes:** 2 dados + atributo, contra o número indicado na carta.
- **Cartas especiais:** só certa classe, raça, antecedente ou objeto as pode usar. As restantes aparecem bloqueadas, com o símbolo de quem as pode jogar.
- **Vida 0:** a partida acaba, e a carta selada revela o que estava em jogo.
- **Pistas:** cada uma baixa em 1 a dificuldade das opções do capítulo final, até um máximo de 3. Com 2 ou mais, abre-se uma opção extra.

## Onde mexer

| Ficheiro | O que tem |
| --- | --- |
| `js/data.js` | Todo o conteúdo: classes, raças, objetos, lugares, encontros e tramas |
| `js/game.js` | Regras e ordem da partida |
| `js/textures.js` | Desenho das cartas, páginas e mapa |
| `js/scene.js` | Mesa 3D, luz, câmara e animações |

Para acrescentar um encontro, basta copiar um bloco de `ENCONTROS` em `js/data.js` e alterar o texto.
