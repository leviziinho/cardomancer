# Cardomancer

Uma aventura de fantasia em forma de jogo de tabuleiro 3D. O herói nasce por draft: o baralho oferece três cartas e você fica com uma. Uma trama secreta fica selada até ao fim, e só o objetivo é conhecido.

## Como jogar

Faça duplo clique em `index.html`. É preciso Internet para descarregar o motor 3D e as fontes (o navegador guarda-os em cache).

- Clique numa carta para a escolher, ou use as teclas `1` a `4`.
- Passe o rato por cima de uma carta para a aproximar.
- Clique nos nomes a vermelho do livro para ler mais sobre eles.
- Na barra da direita, `Ficha` abre o equipamento, a mochila e os talentos (tecla `C`). `Mapa` e `Mesa` deixam espreitar a mesa.

## Regras

- **Testes:** d20 + atributo, contra o número indicado na carta. Um 20 natural passa sempre e um 1 natural falha sempre.
- **Combate:** além do d20, a arma rola o seu próprio dado contra a resistência do inimigo.
- **Sorte da estrada:** dois d10 dão uma percentagem, usada nas surpresas das viagens.
- **Tipos de carta:** Combate, Social, Habilidade e Investigação, cada um com a sua cor.
- **Cartas raras:** cada partida esconde cartas de classe, raça e antecedente em pontos do mapa. Têm sucesso garantido, por isso vale a pena procurar o caminho certo.
- **Tempo:** a missão tem um prazo em dias, e cada viagem e cada noite gastam tempo. Nos últimos dias, os testes ficam mais difíceis. Quatro dias depois do prazo, a partida está perdida.
- **Pistas:** 3 revelam o caminho até ao confronto final. Para o vencer são precisos 2 sucessos.
- **Viagem:** a Marcha Forçada gasta 1 dia, mas pode ser apanhado de surpresa. Pelos Trilhos gasta 2 dias e pode ser você a surpreender.
- **Equipamento:** um objeto por espaço (arma, armadura, acessório) e 3 lugares na mochila. Um objeto substituído rende 1/4 do preço.
- **Experiência:** os testes dão XP, mesmo fora do combate. Ao subir de nível, escolhe um talento quando sai da cena.
- **Aliados e reviravoltas:** os aliados ajudam nos testes do seu campo. Depois da segunda pista, a história pode mudar.
- **Vida 0:** a partida acaba, e a carta selada revela o que estava em jogo.

## Onde mexer

| Ficheiro | O que tem |
| --- | --- |
| `js/data.js` | Catálogo: classes, raças, antecedentes, objetos, talentos, aliados, lugares e estradas |
| `js/historia.js` | Histórias: objetivos, vilões, reviravoltas, encontros, surpresas, cartas raras e textos dos nomes clicáveis |
| `js/regras.js` | Regras puras: testes, chances, opções de cada cena |
| `js/partida.js` | Ordem da partida, sem nada de 3D |
| `js/ui.js` | Liga a partida à mesa e desenha o painel |
| `js/textures.js` | Desenho das cartas, páginas, mapa e dados |
| `js/scene.js` | Mesa 3D, luz, câmara, dados e animações |
| `tools/sim.js` | Simulador de partidas |

Para acrescentar um encontro, basta copiar um bloco de `ENCONTROS` em `js/historia.js` e alterar o texto.

## Testar o equilíbrio

Corre milhares de partidas com as regras do jogo e mostra as taxas de vitória por classe, raça, antecedente, vilão e reviravolta:

```bash
node tools/sim.js 3000
```
