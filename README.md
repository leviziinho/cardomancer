# Cardomancer

Uma aventura de fantasia em forma de jogo de tabuleiro 3D. O herói nasce por draft: o baralho oferece três cartas e você fica com uma. Uma trama secreta fica selada até ao fim, e só o objetivo é conhecido.

## Como jogar

Faça duplo clique em `index.html`. É preciso Internet para descarregar o motor 3D e as fontes (o navegador guarda-os em cache).

- Clique numa carta para a escolher, ou use as teclas `1` a `4`.
- Passe o rato por cima de uma carta para a ler de perto, incluindo as cartas pousadas nos lados da mesa.
- Clique numa poção da mochila para a beber. Um objeto usado fica virado no tabuleiro.
- Clique nos nomes a vermelho do livro para ler mais sobre eles.
- Na barra da direita, `Ficha` abre o equipamento, a mochila, as pistas e os talentos (tecla `C`). `Mapa` fecha o livro para ver o mapa, e `Ajuda` resume as regras. `Letra` troca entre a letra legível (Andika, boa para quem tem dislexia, e a de origem) e a medieval (IM Fell English, letra de livro antigo, das Google Fonts; os algarismos vêm da EB Garamond, porque os da IM Fell descem abaixo da linha). A Andika vem com o jogo, em `fonts/`, com a licença OFL. A abertura tem Nova Partida, Partida Guiada, Configurações (imagem, música, som e letra) e Ajuda.
- **Partida guiada:** é o início de uma partida a sério com o Modo Tutorial ligado: uma moldura dourada à volta do ecrã, o selo "Modo Tutorial" com "Sair do tutorial", e uma dica de cada vez quando cada coisa aparece pela primeira vez (`DICAS_TUTORIAL` em `js/ui.js`). Começa com a classe, passa pela visita à mesa depois da missão, e acaba na segunda etapa ("Agora é consigo"). As dicas não bloqueiam nada e as escolhas são sempre do jogador. Sair desliga tudo de uma vez. Quem carrega em Nova Partida pela primeira vez também pode escolhê-la. A visita à mesa continua na Ajuda.

## Regras

- **Cartas de escolha:** dizem sempre o mesmo, pela mesma ordem. A verde o que rendem, com o custo em ouro ou dias, se houver. A vermelho o que se perde se falhar, já com a Vida que as falhas tiram a mais (vezes 1,5). No rodapé, o atributo, o número a tirar e a hipótese de acertar.
- **Se o motor 3D não carregar:** o jogo tenta um segundo servidor e, se também falhar, explica no ecrã que precisa de Internet e oferece Tentar de novo.
- **Testes:** d20 + atributo, contra o número indicado na carta. Um 20 natural é acerto crítico (+3 XP e +3 Ouro) e um 1 natural é falha crítica (-2 Vida).
- **Combate:** joga-se à vez, e quem tem mais Agilidade começa. O seu d20 mais o atributo tem de chegar à CA dele, e o d20 negro dele tem de chegar à sua CA (10 + metade da Agilidade + armadura). Quem acerta rola o dado de dano. Um 20 fere a dobrar. Cada arma usa o seu atributo: adaga, rapieira e arco usam Agilidade, o cajado usa Mente, e as restantes usam Força.
- **Jeitos de lutar:** cada inimigo comum tem um jeito, dito no início do combate e no rodapé. Fera: ataca e recua (CA +2 depois de acertar). Bruto: prepara o golpe uma ronda antes, e esse fere a dobrar (o escudo trava-o). Morto-vivo: levanta-se uma vez com um quarto dos PV. Feitiço: ronda sim, ronda não, amaldiçoa (-2 Vida e -2 no teste seguinte). Ladrão: rouba 2 de Ouro quando acerta. Duelista: responde logo quando o seu ataque falha. Soldado: o primeiro golpe que leva tira só metade. Bando: ataca duas vezes até perder metade dos PV.
- **Chefe final:** tem 22 PV, dano d8 e duas ações por ronda: um efeito sem dado e um golpe. O golpe varia: normal, partir a guarda (a sua CA desce 2), cansar o braço (o seu dano desce 2 por duas rondas), fechar-se na defesa (CA +3 até à vez seguinte) ou um golpe certeiro, sem dado e mais fraco. Não dá para fugir, e os trunfos da história baixam-lhe a CA. Nunca perde mais de 40% dos PV numa só ronda: o limite aplica-se no próprio golpe, e a página diz quanto dano ele aguentou. A luta dura sempre várias rondas. Cada vilão pode ter um `ajuste` (pv, ca, ataque) em `VILOES_DARAAN`; o Espadachim Santo tem CA +2. Traz um guarda por cada aliado do herói (até três; 7 PV, CA 11, ataque +2): enquanto houver um guarda de pé, os golpes do herói e dos aliados vão para ele, e a carta de ataque mostra a CA do guarda. Os guardas atacam os aliados. Antes do combate, o herói recupera metade da Vida, e o atraso deixa de pesar nos testes.
- **O mundo aperta pela história, não pelo nível:** a cada etapa da missão os inimigos ganham +10% de PV (até +30%). Na etapa final, os testes, a CA, o ataque e o dano deles sobem 1. Subir de nível torna-o mais forte de verdade, porque os inimigos não crescem consigo.
- **O que cada classe tem de seu:** a carta da classe no draft diz a habilidade. Bárbaro (lendária): a carta Fúria gasta a vez e dá, até ao fim do combate, +3 Força, um ataque a mais por ronda e -2 CA, e deixa de poder fugir. Ladino (rara): fora de combate, testes de Mente e Agilidade com dois d20, fica o melhor; nunca é apanhado de surpresa, e na estrada pode passar à larga. Bardo (rara, Vida 7): começa com um aliado de estrada, e os aliados somam o nível dele ao dano. Mago e Clérigo (incomuns): o Mago soma a Mente à CA; o Clérigo tem sempre Curar Feridas na mão, sem a gastar. Comuns: o Monge soma a Mente à CA; o Feiticeiro soma o Carisma à CA e tem Mísseis Mágicos (um d4 por nível, e mais um, sem teste; cada dardo rola o seu d4); o Guerreiro soma a Força ao dano da arma; o Patrulheiro começa com um Lobo, um Urso ou uma Águia, e o Druida com uma Cobra, uma Aranha ou um Corvo. Cada animal luta à sua maneira: a Águia tira 2 ao ataque do inimigo, a Cobra envenena (1 PV por ronda), a Aranha prende-o uma vez por combate, o Corvo protege. O prólogo apresenta o companheiro. A raridade da classe fica guardada para um draft futuro (uma rara, uma incomum e uma comum, com a lendária às vezes no lugar da rara).
- **Prelúdio:** depois do draft e antes da missão, o herói apresenta-se no livro, pela sua boca (`PRELUDIOS` em historia.js, um por classe e sem nomes de lugares, para servir em qualquer mundo). A página junta a raça e o antecedente (uma raça ou um antecedente podem ter o seu próprio `preludio`; sem ele usa-se a primeira frase da descrição) e resume o herói em fichas: Vida, CA, atributos, arma, o que leva e o companheiro.
- **Equilíbrio:** o alvo é cada classe ganhar entre 40% e 50% das partidas no estilo `cacador` do simulador (`node tools/sim.js 12000 cacador`). Os números aprovados estão em `tools/base-classes.json`: o simulador compara-se com eles e marca `SUBIU` quando uma classe passa a ganhar mais de 3 pontos acima. A skill `.claude/skills/balanco-classes` diz ao Claude para correr isto depois de cada mudança de regras e avisar antes de continuar. A base só muda com `--gravar-base`. Cada estilo mostra também as mortes por causa (onde estava o herói, e se foi em combate), a Vida perdida por partida em cada sítio, e o dia e a Vida com que se chega a cada etapa. Para estudar uma classe à parte: `SIM_CLASSE=barbaro node tools/sim.js 12000 cacador` (a classe vem sempre no draft). Para testar uma regra sem mexer no jogo: `SIM_JS=pasta` corre uma cópia alterada de `js/`.
- **Dados:** a caixa tem d4, d6, d8, d10, d12, d20 e d100, e rola vários do mesmo tipo de uma vez, em duas filas quando passam de três.
- **Magias e técnicas:** cada classe tem as suas, usadas uma vez por combate. Fora de combate, algumas aparecem como opção de cena.
- **Cor das cartas:** as cartas com teste têm um selo com a hipótese de acertar, e o papel puxa para a mesma cor: vermelho é difícil, âmbar é meio por meio, verde é quase certo (`hipotese` na carta, desenhado em `js/textures.js`).
- **Vantagem:** dois d20, que rolam juntos na caixa; o que conta fica a brilhar e o outro encolhe. Vem da classe (o Ladino, em Mente e Agilidade) ou da preparação: a Corda e Gancho dá vantagem num teste de Habilidade, a Lanterna Furta-Fogo num de Investigação. Os objetos só se gastam num teste difícil (menos de 80% sem eles). A carta mostra "2d20".
- **Aviso antes do fim:** quando a próxima viagem leva ao chefe, o jogo pergunta antes de partir, com as pistas que leva e o que isso quer dizer. Voltar atrás não gasta nenhum dia.
- **Tipos de carta:** Combate, Social, Habilidade, Investigação, Magia e Técnica, cada um com a sua cor.
- **Classes em tarô:** cada classe é um arcano maior, desenhado como uma carta de tarô.
- **Cartas raras:** as cartas amarelas são a sua classe, a sua raça, o seu antecedente, a classe aprimorada e os itens raros. No baralho de aventura há só uma de cada, e têm sucesso garantido. Se não a jogar, ela volta ao baralho e pode aparecer noutra cena.
- **Tempo:** a missão tem um prazo em dias, e cada viagem e cada noite gastam tempo. Nos últimos dias, os testes ficam mais difíceis. Quatro dias depois do prazo, a partida está perdida.
- **Vida:** a pressa e os falhanços gastam Vida, e recuperá-la gasta tempo. Durma numa estalagem, acampe na estrada (+35% de Vida, 1 dia e algum risco) ou guarde uma poção.
- **Missão:** a estrela dourada no mapa e o aviso "Agora" dizem sempre para onde ir, numa frase de ação com a cidade realçada ("Interrogue o suspeito em **Abiad**"). A história avança por três etapas, e os diálogos, os combates ganhos e os interrogatórios dão dicas do caminho.
- **Pistas:** são opcionais. O olho vermelho no mapa marca a próxima. Cada pista tem 3 fragmentos: ganha-se um com uma carta com olho, no sítio da pista. Até um combate pode ter o olho, por isso também se consegue uma pista à força. Se falhar a carta com olho, a pista muda de sítio mas o progresso fica. Quando a pista está na cidade onde se encontra, o menu da cidade tem "Ficar e Procurar": não precisa de sair para voltar. Cada pista completa enfraquece o chefe final no combate.
- **Mundos:** o jogo publicado é Daraan, o Império da Espada, com mapa, missões, vilões e encontros próprios, raça, antecedentes e objetos só seus. Outros mundos estão em preparação fora deste repositório: quando existem na pasta `js/` (ignorados pelo git), `MUNDOS_ABERTOS` em partida.js diz quais aparecem, e `?mundos=todos` no endereço abre-os para teste.
- **Viagem:** cada estrada custa 1 dia. Há 50% de encontro, decidido às escondidas, sem dados à vista. Se houver, o pino para a meio da estrada, um aviso diz o título do encontro, e só chega depois de o resolver. Um quarto dos encontros são contratempos (atrasos). Nos perigos, os talentos de alerta descem a chance de emboscada; os de trilho deixam passar à larga. Sem encontro, chega em segurança. A carta da pista nunca aparece na estrada. O ferreiro está desligado por agora (`FERREIRO = false` em data.js).
- **Tabuleiro:** cada carta do herói tem o seu lugar marcado, e os lugares vazios mostram o que falta. Por baixo, uma placa mostra os quatro atributos, e as moedas ao lado são o ouro. A Vida está só na barra da direita.
- **Pistas na trilha:** à direita da trilha dos dias há três olhos, cada um com três barras. Cada fragmento acende uma barra, com brilho e som; três barras completam o olho.
- **Cartas únicas:** quando se joga uma carta única da criação (classe, raça, antecedente), ela arde de baixo para cima e não volta ao baralho.
- **Armas e talentos:** a Espada de Família dá d8 e +1 CA; o Machado de Guerra dá d10. O talento Robusto tira 1 a cada golpe que o herói leva em combate (nunca abaixo de 1).
- **Música de combate:** além do tambor grave, tem um tambor de mão e um bombo de guerra, com rufos curtos.
- **Equipamento:** um objeto por espaço (arma, armadura, acessório) e 3 lugares na mochila. Um objeto substituído rende 1/4 do preço. Cada classe só usa as armas e armaduras do seu tipo: armas pesadas para Bárbaros e Guerreiros, focos mágicos para Magos, Feiticeiros, Clérigos, Druidas e Bardos, placas só para Guerreiros e Clérigos, e assim por diante. Adagas, cajados, capas, mantos e acessórios servem a todos. Os focos mágicos (Vara de Sabugueiro, Orbe de Cristal, Símbolo Sagrado, Grimório Proibido) são armas só para quem lança magia: Magos, Feiticeiros, Clérigos, Druidas e Bardos. O mercado só mostra o que a classe sabe usar, e uma recompensa que não serve vende-se por metade do preço.
- **Melhorias:** o ferreiro está desligado por agora (`FERREIRO = false` em `js/data.js`). Quando voltar, aprimora o que traz no corpo, com um máximo de duas melhorias por objeto.
- **Estrada:** os encontros nem sempre são maus. Um d10 escondido decide: 1 é um mestre raríssimo que oferece a evolução da classe, ou o nível máximo a quem recusa (uma vez por partida), 2 e 3 são o mercador secreto (por agora só vende), 4 e 5 são boa sorte, 6 a 9 são perigo, e 10 é um inimigo lendário: o mesmo bando, mas com o chefe deles à frente (o dobro dos PV, mais CA, ataque e dano), que paga a dobrar, dá XP e uma poção. Também há contratempos que custam um dia ou ouro.
- **Experiência:** só os testes dão XP (9, 21, 36, 54 e 75 para os níveis 2 a 6). As cartas especiais dão 1, e as escolhas sem teste não dão nada. Ao subir de nível, escolhe um talento quando sai da cena.
- **Telemóvel:** joga-se melhor deitado, com o livro à esquerda e as cartas à direita. De pé, o botão "Quero jogar na vertical" mostra a página como texto e as cartas por baixo. Toque numa carta para a ler, e toque de novo para a jogar. A imagem é mais leve no telemóvel, para não aquecer.
- **Primeira vez:** o jogo pergunta se é a primeira aventura e pode explicar a mesa, parte a parte. A explicação volta a estar na Ajuda.
- **Dados:** rolam dentro de uma caixa, sempre à vista.
- **Sem teste:** por mão aparece no máximo uma escolha comum sem teste (pagar, esperar, comprar). Sucesso garantido é só das cartas especiais e das magias de cura e proteção. Fugir de um combate é sempre um teste, e falhar gasta a vez.
- **Aliados e reviravoltas:** os aliados ajudam nos testes do seu campo e lutam a seu lado: cada um tem CA, PV e uma ação (atacar, curar ou proteger). O inimigo pode atacá-los, e um aliado que cai em combate perde-se. Em combate, a página fica aberta e a Vida e os PV mudam logo a seguir a cada golpe; os aliados e os guardas têm a sua barra de PV no livro. Cada ação é anunciada antes de os dados caírem: a sua, a de cada aliado, a do inimigo e a dos guardas. Depois da segunda etapa, a história pode mudar.
- **Vida 0:** a partida acaba, e a carta selada revela o que estava em jogo.
- **Tendência:** dois eixos escondidos, Bem/Mal (ajudar os Rebeldes do Opositor e o povo, ou servir o Império) e Ordem/Caos (a palavra dada, ou o truque). Cada carta escolhida mexe +1/-1, pelas palavras do título (`PALAVRAS_TEND` em `js/regras.js`) ou à mão (`TEND_CARTAS` em `js/daraan.js`, ou `tend` na própria carta). A partir de 3 num eixo, o nome muda; são nove: Leal Bom, Neutro Bom, Caótico Bom, Leal Neutro, Neutro, Caótico Neutro, Leal Mau, Neutro Mau, Caótico Mau. O jogador vê o nome na ficha, um aviso quando muda, e na página do resultado uma ficha "Pende para o Bem" (ou o Mal, a Ordem, o Caos) quando a escolha mexeu. As cartas de cena que mexem levam uma máscara em marca d'água (`desenharMascara` em `js/textures.js`): a que sorri puxa para o Bem, a que chora para o Mal, a de lábios cerrados só para a Ordem ou o Caos.
- **O chefe muda de lado:** quando o destino é revelado, quem chegou a Mau enfrenta um rival dos Rebeldes com o mesmo peso (`RIVAIS_DARAAN`): Ivan → Tiago, o Opositor; Khayn → Simony Lumiel; Tevish → Robert; o Espadachim Santo → Artas Lancaster; o Profeta → Zhenris Voranan; a Mestra → Geyser Punho Cego. Troca-se o nome e o motivo; o combate é o mesmo. Se o rival viajar consigo como aliado, deixa-o. Para testar sem jogar do lado do Império: `?tendencia=mau` no endereço.
- **Segunda oportunidade:** uma vez por partida, só na primeira etapa da missão e nunca contra o chefe, quem cai a 0 de Vida acorda deixado por morto: um terço da Vida, sem ouro, três dias depois (`SEGUNDA` em `js/regras.js`).
- **Música da abertura:** no ecrã inicial, a harpa improvisa em Si menor (Eólio em Si), a partir do primeiro toque, porque o navegador não deixa tocar antes.
- **Música do prelúdio:** na página do prelúdio, a música improvisa sobre um bordão no modo grego da classe (`MODO_DA_CLASSE` em `js/musica.js`): Clérigo Jônio; Patrulheiro e Druida Dórico; Monge Frígio; Mago e Feiticeiro Lídio; Bardo Mixolídio; Bárbaro e Guerreiro Eólio; Ladino Lócrio. As classes que partilham um modo distinguem-se no instrumento, no registo e no andamento.
- **Teclas:** 1 a 4 escolhem as cartas; C ficha, M mapa, B poção, H ajuda. Mudam-se em Configurações > Teclas, e ficam guardadas no aparelho.
- **Foco:** enquanto escolhe uma carta, a barra da direita, a trilha e o aviso "Agora" recuam.
- **Opinião:** o botão Opinião (e "Dar a sua opinião" na abertura) abre uma issue no GitHub do jogo só com o texto, a data e a hora. Sem conta no GitHub, copia-se o texto.

## Onde mexer

| Ficheiro | O que tem |
| --- | --- |
| `js/data.js` | Catálogo: classes, raças, antecedentes, objetos, talentos, aliados, lugares e estradas |
| `js/historia.js` | Histórias: objetivos, vilões, reviravoltas, encontros, surpresas, cartas raras e textos dos nomes clicáveis |
| `js/daraan.js` | O mundo de Daraan e as classes novas. No fim, `MUNDOS` junta os mundos e `ativarMundo` troca-os |
| `js/etapas.js` | O fio da história: as três etapas da missão e as dicas |
| `js/regras.js` | Regras puras: testes, chances, opções de cada cena |
| `js/partida.js` | Ordem da partida, sem nada de 3D |
| `js/ui.js` | Liga a partida à mesa e desenha o painel |
| `js/tarot.js` | As classes desenhadas como arcanos do tarô |
| `js/textures.js` | Desenho das cartas, páginas, mapa e dados |
| `js/imagem.js` | Acabamento da imagem (brilho das luzes, tons de filme) e níveis de qualidade |
| `js/scene.js` | Mesa 3D, luz, câmara, dados e animações |
| `tools/sim.js` | Simulador de partidas |
| `tools/textos.js` | Tira todos os textos de um mundo, com o caminho de cada um (`node tools/textos.js daraan`). Alimenta o Livro das Histórias, onde o Levi reescreve os textos |
| `revisao/` | Rondas de revisão do jogo, numa forma fácil de ler por pessoas e IAs (ver `revisao/LEIA-ME.md`) |

Para acrescentar um encontro, basta copiar um bloco de `ENCONTROS` em `js/historia.js`, ou de `ENCONTROS_DARAAN` em `js/daraan.js`, e alterar o texto.

## Testar o equilíbrio

A música é gerada em tempo real em `js/musica.js`, sem ficheiros de áudio.

O botão **Imagem** troca a qualidade entre alta, média e baixa, e a escolha fica guardada. Sem escolha, o jogo desce sozinho quando a máquina não aguenta.

Corre milhares de partidas com as regras do jogo e mostra as taxas de vitória por classe, raça, antecedente, vilão e reviravolta:

```bash
node tools/sim.js 3000
```

No fim de cada estilo, mostra também as escolhas dominantes (cartas de cena que ganham quase sempre que aparecem) e as esquecidas (quase nunca escolhidas). As cartas raras ficam de fora, porque ganham por desenho.
