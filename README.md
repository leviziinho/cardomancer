# Cardomancer

Uma aventura de fantasia em forma de jogo de tabuleiro 3D. O herói nasce por draft: o baralho oferece três cartas e você fica com uma. Uma trama secreta fica selada até ao fim, e só o objetivo é conhecido.

## Como jogar

Faça duplo clique em `index.html`. É preciso Internet para descarregar o motor 3D e as fontes (o navegador guarda-os em cache).

- Clique numa carta para a escolher, ou use as teclas `1` a `4`.
- Passe o rato por cima de uma carta para a ler de perto, incluindo as cartas pousadas nos lados da mesa.
- Clique numa poção da mochila para a beber. Um objeto usado fica virado no tabuleiro.
- Clique nos nomes a vermelho do livro para ler mais sobre eles.
- Na barra da direita, `Ficha` abre o equipamento, a mochila, as pistas e os talentos (tecla `C`). `Mapa` fecha o livro para ver o mapa, e `Ajuda` resume as regras.

## Regras

- **Testes:** d20 + atributo, contra o número indicado na carta. Um 20 natural é acerto crítico (+3 XP e +3 Ouro) e um 1 natural é falha crítica (-2 Vida).
- **Combate:** joga-se à vez, e quem tem mais Agilidade começa. O seu d20 mais o atributo tem de chegar à CA dele, e o d20 negro dele tem de chegar à sua CA (10 + metade da Agilidade + armadura). Quem acerta rola o dado de dano. Um 20 fere a dobrar. Cada arma usa o seu atributo: adaga, rapieira e arco usam Agilidade, o cajado usa Mente, e as restantes usam Força.
- **Chefe final:** tem PV para cerca de 5 rondas (6 + 2 por nível do herói) e duas ações por ronda: um efeito sem dado e um ataque. Não dá para fugir, e os trunfos da história baixam-lhe a CA. Antes do combate, o herói recupera metade da Vida, e o atraso deixa de pesar nos testes.
- **Subida de nível:** cada nível dá +10% de PV aos inimigos. A cada três níveis, os testes, a CA, o ataque e o dano deles sobem 1.
- **Magias e técnicas:** cada classe tem as suas, usadas uma vez por combate. Fora de combate, algumas aparecem como opção de cena.
- **Sorte da estrada:** dois d10 dão um número de 1 a 100, que cai em cima do mapa. Com a percentagem da carta ou menos, há encontro, e um d10 decide de que tipo é.
- **Tipos de carta:** Combate, Social, Habilidade, Investigação, Magia e Técnica, cada um com a sua cor.
- **Cartas raras:** cada partida esconde cartas de classe, raça e antecedente em pontos do mapa. Têm sucesso garantido, por isso vale a pena procurar o caminho certo.
- **Tempo:** a missão tem um prazo em dias, e cada viagem e cada noite gastam tempo. Nos últimos dias, os testes ficam mais difíceis. Quatro dias depois do prazo, a partida está perdida.
- **Vida:** a pressa e os falhanços gastam Vida, e recuperá-la gasta tempo. Durma numa estalagem, acampe na estrada (+35% de Vida, 1 dia e algum risco) ou guarde uma poção.
- **Pistas:** 3 revelam o caminho até ao chefe final. O olho vermelho no mapa marca a pista seguinte, sempre a 1 ou mais estradas. Cada ponto à volta do olho é um dia antes de ela esfriar. Lá chegado, é a carta vermelha A PISTA que a procura. Se escolher outra carta ou falhar, pode procurar outra vez por 1 dia, enquanto houver pontos. Se esfriar, a pista muda de sítio. Cada pista encontrada fica numa carta na mesa e na Ficha.
- **Mundos:** cada partida começa pela escolha do mundo. As Terras de Vésper e Daraan, o Império da Espada, têm mapa, missões, vilões e encontros próprios. Guerreiro, Feiticeiro, Monge e Druida existem nos dois, e Daraan tem ainda raça, antecedentes e objetos só seus.
- **Viagem:** o pino para a meio da estrada, e é aí que escolhe a postura e resolve o que aparecer. A Marcha Forçada gasta 1 dia e 2 de Vida, e pode ser apanhado de surpresa. Pelos Trilhos gasta 2 dias e pode ser você a surpreender. Só depois de resolver o encontro é que chega ao destino, por isso a carta da pista nunca aparece na estrada.
- **Tabuleiro:** cada carta do herói tem o seu lugar marcado, e os lugares vazios mostram o que falta.
- **Equipamento:** um objeto por espaço (arma, armadura, acessório) e 3 lugares na mochila. Um objeto substituído rende 1/4 do preço.
- **Melhorias:** o ferreiro do mercado aprimora o que traz no corpo, com um máximo de duas melhorias por objeto. O mercador secreto da estrada cobra menos 30%.
- **Estrada:** os encontros nem sempre são maus. Um d10 decide: 1 é um mestre raríssimo que oferece a evolução da classe (uma vez por partida), 2 e 3 são o mercador secreto, 4 e 5 são boa sorte, e o resto é perigo. Também há contratempos que custam um dia ou ouro.
- **Experiência:** os testes dão XP, mesmo fora do combate. Ao subir de nível, escolhe um talento quando sai da cena.
- **Aliados e reviravoltas:** os aliados ajudam nos testes do seu campo. Depois da segunda pista, a história pode mudar.
- **Vida 0:** a partida acaba, e a carta selada revela o que estava em jogo.

## Onde mexer

| Ficheiro | O que tem |
| --- | --- |
| `js/data.js` | Catálogo: classes, raças, antecedentes, objetos, talentos, aliados, lugares e estradas |
| `js/historia.js` | Histórias: objetivos, vilões, reviravoltas, encontros, surpresas, cartas raras e textos dos nomes clicáveis |
| `js/daraan.js` | O mundo de Daraan e as classes novas. No fim, `MUNDOS` junta os mundos e `ativarMundo` troca-os |
| `js/madeira.js` | O mundo da Madeira Negra, acrescentado a `MUNDOS` |
| `js/regras.js` | Regras puras: testes, chances, opções de cada cena |
| `js/partida.js` | Ordem da partida, sem nada de 3D |
| `js/ui.js` | Liga a partida à mesa e desenha o painel |
| `js/textures.js` | Desenho das cartas, páginas, mapa e dados |
| `js/imagem.js` | Acabamento da imagem (brilho das luzes, tons de filme) e níveis de qualidade |
| `js/scene.js` | Mesa 3D, luz, câmara, dados e animações |
| `tools/sim.js` | Simulador de partidas |

Para acrescentar um encontro, basta copiar um bloco de `ENCONTROS` em `js/historia.js`, ou de `ENCONTROS_DARAAN` em `js/daraan.js`, e alterar o texto.

## Testar o equilíbrio

A música é gerada em tempo real em `js/musica.js`, sem ficheiros de áudio.

O botão **Imagem** troca a qualidade entre alta, média e baixa, e a escolha fica guardada. Sem escolha, o jogo desce sozinho quando a máquina não aguenta.

Corre milhares de partidas com as regras do jogo e mostra as taxas de vitória por classe, raça, antecedente, vilão e reviravolta:

```bash
node tools/sim.js 3000
```
