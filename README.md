# Cardomancer

Uma aventura de fantasia em forma de jogo de tabuleiro 3D. O herói nasce por draft: o baralho oferece três cartas e você fica com uma. Uma trama secreta fica selada até ao fim, e só o objetivo é conhecido.

## Como jogar

Faça duplo clique em `index.html`. É preciso Internet para descarregar o motor 3D e as fontes (o navegador guarda-os em cache).

- Clique numa carta para a escolher, ou use as teclas `1` a `4`.
- Passe o rato por cima de uma carta para a ler de perto, incluindo as cartas pousadas nos lados da mesa.
- Clique numa poção da mochila para a beber. Um objeto usado fica virado no tabuleiro.
- Clique nos nomes a vermelho do livro para ler mais sobre eles.
- Na barra da direita, `Ficha` abre o equipamento, a mochila, as pistas e os talentos (tecla `C`). `Mapa` fecha o livro para ver o mapa, e `Ajuda` resume as regras. `Letra` troca entre a letra legível (Andika, boa para quem tem dislexia, e a de origem) e a clássica.

## Regras

- **Testes:** d20 + atributo, contra o número indicado na carta. Um 20 natural é acerto crítico (+3 XP e +3 Ouro) e um 1 natural é falha crítica (-2 Vida).
- **Combate:** joga-se à vez, e quem tem mais Agilidade começa. O seu d20 mais o atributo tem de chegar à CA dele, e o d20 negro dele tem de chegar à sua CA (10 + metade da Agilidade + armadura). Quem acerta rola o dado de dano. Um 20 fere a dobrar. Cada arma usa o seu atributo: adaga, rapieira e arco usam Agilidade, o cajado usa Mente, e as restantes usam Força.
- **Jeitos de lutar:** cada inimigo comum tem um jeito, dito no início do combate e no rodapé. Fera: ataca e recua (CA +2 depois de acertar). Bruto: prepara o golpe uma ronda antes, e esse fere a dobrar (o escudo trava-o). Morto-vivo: levanta-se uma vez com um quarto dos PV. Feitiço: ronda sim, ronda não, amaldiçoa (-2 Vida e -2 no teste seguinte). Ladrão: rouba 2 de Ouro quando acerta. Duelista: responde logo quando o seu ataque falha. Soldado: o primeiro golpe que leva tira só metade. Bando: ataca duas vezes até perder metade dos PV.
- **Chefe final:** tem 22 PV, dano d8 e duas ações por ronda: um efeito sem dado e um golpe. O golpe varia: normal, partir a guarda (a sua CA desce 2), cansar o braço (o seu dano desce 2 por duas rondas), fechar-se na defesa (CA +3 até à vez seguinte) ou um golpe certeiro, sem dado e mais fraco. Não dá para fugir, e os trunfos da história baixam-lhe a CA. Nunca perde mais de 40% dos PV numa só ronda, por isso a luta dura sempre várias rondas. Traz um guarda por cada aliado do herói (até três): os aliados que atacam têm de derrubar os guardas antes de lhe chegar, e os guardas atacam os aliados. Antes do combate, o herói recupera metade da Vida, e o atraso deixa de pesar nos testes.
- **O mundo aperta pela história, não pelo nível:** a cada etapa da missão os inimigos ganham +10% de PV (até +30%). Na etapa final, os testes, a CA, o ataque e o dano deles sobem 1. Subir de nível torna-o mais forte de verdade, porque os inimigos não crescem consigo.
- **Magias e técnicas:** cada classe tem as suas, usadas uma vez por combate. Fora de combate, algumas aparecem como opção de cena.
- **Sorte da estrada:** dois d10 dão um número de 1 a 100, que cai em cima do mapa. Com a percentagem da carta ou menos, há encontro, e um d10 decide de que tipo é.
- **Tipos de carta:** Combate, Social, Habilidade, Investigação, Magia e Técnica, cada um com a sua cor.
- **Classes em tarô:** cada classe é um arcano maior, desenhado como uma carta de tarô.
- **Cartas raras:** as cartas amarelas são a sua classe, a sua raça, o seu antecedente, a classe aprimorada e os itens raros. No baralho de aventura há só uma de cada, e têm sucesso garantido. Se não a jogar, ela volta ao baralho e pode aparecer noutra cena.
- **Tempo:** a missão tem um prazo em dias, e cada viagem e cada noite gastam tempo. Nos últimos dias, os testes ficam mais difíceis. Quatro dias depois do prazo, a partida está perdida.
- **Vida:** a pressa e os falhanços gastam Vida, e recuperá-la gasta tempo. Durma numa estalagem, acampe na estrada (+35% de Vida, 1 dia e algum risco) ou guarde uma poção.
- **Missão:** a estrela dourada no mapa e o aviso "Agora" dizem sempre para onde ir. A história avança por três etapas, e os diálogos, os combates ganhos e os interrogatórios dão dicas do caminho.
- **Pistas:** são opcionais. O olho vermelho no mapa marca a próxima. Cada pista tem 3 fragmentos: ganha-se um com uma carta com olho, no sítio da pista. Até um combate pode ter o olho, por isso também se consegue uma pista à força. Se falhar a carta com olho, a pista muda de sítio mas o progresso fica. Quando a pista está na cidade onde se encontra, o menu da cidade tem "Ficar e Procurar": não precisa de sair para voltar. Cada pista completa enfraquece o chefe final no combate.
- **Mundos:** cada partida começa pela escolha do mundo. As Terras de Vésper e Daraan, o Império da Espada, têm mapa, missões, vilões e encontros próprios. Guerreiro, Feiticeiro, Monge e Druida existem nos dois, e Daraan tem ainda raça, antecedentes e objetos só seus.
- **Viagem:** o pino para a meio da estrada, e é aí que escolhe a postura e resolve o que aparecer. A Marcha Forçada gasta 1 dia e tem 50% de encontro, que o apanha de surpresa. Pelos Trilhos gasta 2 dias e tem 25%, e se der com alguém escolhe se vai ver ou se segue. Explorar o Caminho gasta 3 dias e tem sempre encontro. Os perigos da estrada começam logo em combate. Só depois de resolver o encontro é que chega ao destino, por isso a carta da pista nunca aparece na estrada.
- **Tabuleiro:** cada carta do herói tem o seu lugar marcado, e os lugares vazios mostram o que falta.
- **Equipamento:** um objeto por espaço (arma, armadura, acessório) e 3 lugares na mochila. Um objeto substituído rende 1/4 do preço. Cada classe só usa as armas e armaduras do seu tipo: armas pesadas para Bárbaros e Guerreiros, focos mágicos para Magos, Feiticeiros, Clérigos, Druidas e Bardos, placas só para Guerreiros e Clérigos, e assim por diante. Adagas, cajados, capas, mantos e acessórios servem a todos. O mercado só mostra o que a classe sabe usar, e uma recompensa que não serve vende-se por metade do preço.
- **Melhorias:** o ferreiro do mercado aprimora o que traz no corpo, com um máximo de duas melhorias por objeto. O mercador secreto da estrada cobra menos 30%.
- **Estrada:** os encontros nem sempre são maus. Um d10 decide: 1 é um mestre raríssimo que oferece a evolução da classe, ou o nível máximo a quem recusa (uma vez por partida), 2 e 3 são o mercador secreto, 4 e 5 são boa sorte, 6 a 9 são perigo, e 10 é um inimigo lendário: o mesmo bando, mas com o chefe deles à frente (o dobro dos PV, mais CA, ataque e dano), que paga a dobrar, dá XP e uma poção. Também há contratempos que custam um dia ou ouro.
- **Experiência:** só os testes dão XP (9, 21, 36, 54 e 75 para os níveis 2 a 6). As cartas especiais dão 1, e as escolhas sem teste não dão nada. Ao subir de nível, escolhe um talento quando sai da cena.
- **Telemóvel:** joga-se melhor deitado, com o livro à esquerda e as cartas à direita. De pé, o botão "Quero jogar na vertical" mostra a página como texto e as cartas por baixo. Toque numa carta para a ler, e toque de novo para a jogar. A imagem é mais leve no telemóvel, para não aquecer.
- **Primeira vez:** o jogo pergunta se é a primeira aventura e pode explicar a mesa, parte a parte. A explicação volta a estar na Ajuda.
- **Dados:** rolam dentro de uma caixa, sempre à vista.
- **Sem teste:** por mão aparece no máximo uma escolha comum sem teste (pagar, esperar, comprar). Sucesso garantido é só das cartas especiais e das magias de cura e proteção. Fugir de um combate é sempre um teste, e falhar gasta a vez.
- **Aliados e reviravoltas:** os aliados ajudam nos testes do seu campo e lutam a seu lado: cada um tem CA, PV e uma ação (atacar, curar ou proteger). O inimigo pode atacá-los, e um aliado que cai em combate perde-se. Em combate, a página fica aberta e a Vida e os PV mudam logo a seguir a cada golpe. Cada ação é anunciada antes de os dados caírem: a sua, a de cada aliado, a do inimigo e a dos guardas. Depois da segunda etapa, a história pode mudar.
- **Vida 0:** a partida acaba, e a carta selada revela o que estava em jogo.

## Onde mexer

| Ficheiro | O que tem |
| --- | --- |
| `js/data.js` | Catálogo: classes, raças, antecedentes, objetos, talentos, aliados, lugares e estradas |
| `js/historia.js` | Histórias: objetivos, vilões, reviravoltas, encontros, surpresas, cartas raras e textos dos nomes clicáveis |
| `js/daraan.js` | O mundo de Daraan e as classes novas. No fim, `MUNDOS` junta os mundos e `ativarMundo` troca-os |
| `js/madeira.js` | O mundo da Madeira Negra, acrescentado a `MUNDOS` |
| `js/etapas.js` | O fio da história: as três etapas da missão e as dicas |
| `js/regras.js` | Regras puras: testes, chances, opções de cada cena |
| `js/partida.js` | Ordem da partida, sem nada de 3D |
| `js/ui.js` | Liga a partida à mesa e desenha o painel |
| `js/tarot.js` | As classes desenhadas como arcanos do tarô |
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
