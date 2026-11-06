# Arte: retratos da história

Os retratos entram em três sítios:

- **Carta "A Verdade"**, a carta selada que se revela no fim: mostra o vilão da partida.
- **Página do livro no Capítulo Final**: o vilão, no lugar da paisagem.
- **Página do livro do Encontro raríssimo**: o mestre da sua classe.

Enquanto um retrato não existir, fica a paisagem ou o desenho de antes.

## Como gerar

1. No ChatGPT, anexe uma ilustração de classe já feita (o Guerreiro, por exemplo) como referência de estilo.
2. Cole o **bloco de estilo** e depois a linha da personagem.
3. Guarde em `arte/retratos/` com o nome indicado.
4. No fim, corra `python tools/arte.py`.

O jogo corta a mesma imagem de duas maneiras: quadrada para a carta e mais larga para o livro. Por isso a cara deve ficar no terço de cima, ao centro, com algum espaço à volta.

## Bloco de estilo (colar sempre)

```
Retrato de uma personagem de fantasia medieval, no mesmo traço da imagem de referência:
tinta e aguarela, muito detalhe, luz dramática e quente.
A personagem da cintura para cima, de frente ou a três quartos, ao centro,
com a cara no terço de cima da imagem e espaço à volta.
Ao fundo, um pouco do lugar onde está, desfocado.
Formato quadrado 1:1. Sem texto, sem letras, sem moldura.
```

## Vilões (6)

| Ficheiro | Personagem | Linha para o prompt |
|---|---|---|
| `khayn.png` | General Khayn Ludrione | General imperial impiedoso e arrogante, de bigode bem aparado e uma cicatriz de queimadura no rosto. Armadura preta e vermelha do Império. Saca uma espada que se acende em chamas. Ao fundo, um templo em ruínas com vitrais partidos. |
| `profeta.png` | O Profeta | Elfo antigo de manto branco e vermelho, sereno e inquietante. Segura um cajado com a caveira de um dragão filhote na ponta e usa um anel que brilha em vermelho. Uma esfera azulada envolve-o. Ao fundo, um portão de pedra numa ilha vermelha, com criaturas de quatro asas no céu. |
| `espadachim.png` | O Espadachim Santo | Parece um rapaz jovem, de uniforme, de olhos fechados e rosto calmo, com uma espada fina. À volta dele, um rasto de luz branca como um raio. Folhas cortadas ao meio caem no ar. Ao fundo, uma clareira numa floresta densa. |
| `tevish.png` | Tevish Szar | Monge de roupa negra e faixa vermelha. Grande parte do corpo parece metal, com um gume ao longo da lateral dos braços, e olhos incandescentes. Pose de luta. Ao fundo, picos de montanha afiados e vento. |
| `ivan.png` | Imperador Ivan Galonadel | Elfo altaneiro de linhagem nobre, Imperador, chamado Cavaleiro Negro. Rosto descarnado, sorriso de orelha a orelha, olhos cor de esmeralda. Armadura negra com crânios de dragão nos ombros. Empunha uma espada lendária cujo pomo tem cinco cabeças de dragão, e a lâmina reluz em várias cores. Ao fundo, o paço real no alto de um monte, à chuva. |
| `mestra.png` | A Mestra | Mulher de expressão imóvel e olhar fixo, em postura de ataque, de mãos nuas. O vento enrola-se à volta dela e o fogo não a queima. Ao fundo, planícies abertas sem uma árvore. |

## Mestres das classes (10)

| Ficheiro | Mestre | Linha para o prompt |
|---|---|---|
| `mestre-guerreiro.png` | O Mestre dos Arremessos | Halfling mestre de armas, seguro de si, com adagas nas mãos e nas mangas. Atrás dele, três adagas cravadas num tronco. |
| `mestre-feiticeiro.png` | Um Velho Salazar | Velho de vestes reluzentes, a aquecer as mãos numa fogueira sem lenha. Chove à volta, mas a chuva não lhe toca. |
| `mestre-monge.png` | O Mestre de Olhos Fechados | Monge idoso, de olhos fechados, sentado num muro de pedra, calmo e atento. |
| `mestre-druida.png` | A Clareira que Respira | Anciã Saybaff no meio de uma clareira, com um urso a dormir aos pés e as árvores a abrir-se à volta. |
| `mestre-mago.png` | A Torre Flutuante | Mulher misteriosa à janela de uma torre estreita que flutua sobre um descampado, a sorrir com ironia. |
| `mestre-barbaro.png` | O Último da Tribo | Velho enorme, com inúmeras cicatrizes, de punhos cerrados e riso feroz, a bloquear um caminho. |
| `mestre-ladino.png` | A Mão Sem Rasto | Figura de capuz meio na sombra, a rodar uma bolsa de moedas entre os dedos, com um sorriso de quem já sabe tudo. |
| `mestre-patrulheiro.png` | A Guardiã da Clareira | Mulher a sair de trás de uma árvore, com um arco pendurado num ramo e um lobo sentado ao lado. |
| `mestre-clerigo.png` | O Eremita da Encruzilhada | Homem de hábito rasgado, entre dois pequenos altares numa encruzilhada, com um sorriso de pena. |
| `mestre-bardo.png` | A Canção Sem Autor | Velho com um alaúde, sentado à beira da estrada, a tocar de olhos meio fechados. |

Nos mestres, varie a etnia e a idade de forma natural, como nas cartas de classe.

## Inimigos dos combates (`inimigo-<nome>.png`)

Aparecem na página do livro durante o combate, no lugar da paisagem. Para grupos, peça o grupo inteiro, com quem lidera à frente.
Troque no bloco de estilo "A personagem da cintura para cima" por "Em pose de ataque, virados para quem olha".

| Ficheiro | Inimigo | Linha para o prompt |
|---|---|---|
| `inimigo-soldados-imperiais.png` | Os Soldados Imperiais | Três soldados do Império em armadura preta e vermelha, lanças e escudos com o brasão, num caminho de terra. |
| `inimigo-tres-soldados.png` | Os Três Soldados | Três soldados imperiais cansados e mal-encarados à porta de uma taberna, a puxar das espadas. |
| `inimigo-goblins.png` | Goblins | Bando de goblins magros e ágeis, de olhos brilhantes, com facas e fundas, a saltar dos ramos. |
| `inimigo-goblins-da-estrada.png` | Os Goblins da Estrada | Goblins a atacar uma carroça numa estrada pavimentada, com sacos de saque. |
| `inimigo-goblins-da-azagaia.png` | Os Goblins da Azagaia | Goblins com azagaias (lanças curtas de arremesso), em formação desordenada numa floresta escura. |
| `inimigo-lobos-de-pere.png` | Os Lobos de Pere | Alcateia de lobos cinzentos e magros, de dentes à mostra, no nevoeiro de uma floresta antiga. |
| `inimigo-pantera-deslocadora.png` | A Pantera Deslocadora | Besta mágica como uma pantera negra, mas com seis patas e dois tentáculos com farpas nos ombros, tão rápida que a imagem fica tremida. |
| `inimigo-demonio-da-areia.png` | O Demónio da Areia | Criatura de escamas e muitos dentes a sair da água numa praia de areia que brilha em várias cores; ao longe, uma ilha vermelha. |
| `inimigo-patrulha-do-pantano.png` | A Patrulha do Pântano | Soldados imperiais com lama até aos joelhos, tochas e redes, num pântano escuro com nevoeiro. |
| `inimigo-barbaros-das-terras-selvagens.png` | Bárbaros das Terras Selvagens | Guerreiros de peles e pinturas de guerra, machados e escudos redondos, a gritar ao ataque. |
| `inimigo-enviados-de.png` | Enviados do vilão | Figuras encapuzadas de manto cinzento, rostos na sombra, com lâminas curvas e um brilho vermelho nos olhos. |
| `inimigo-simony-lumiel.png` | Simony Lumiel (quando luta contra si) | Use a mesma personagem da carta de aliada da Simony, em pose de duelo com espada longa e adaga. |
| `inimigo-homem-da-cicatriz.png` | O Homem da Cicatriz (etapa da missão) | Homem magro e nervoso numa taberna escura, com uma cicatriz ainda aberta na cara, a levantar-se de faca na mão. |
| `inimigo-queimador-de-papeis.png` | O Queimador de Papéis (etapa da missão) | Escrivão de mangas arregaçadas numa casa de janelas tapadas, a atirar papéis para a lareira, apanhado de surpresa. |
| `inimigo-capataz.png` | O Capataz (procura da pista) | Capataz corpulento de avental de couro, num armazém, com um gancho de carga na mão e dois ajudantes atrás. |
| `inimigo-apagador.png` | O Apagador (procura da pista) | Figura de capuz ágil e calma, com um pano molhado numa mão e uma faca curta na outra, a apagar marcas numa parede. |

Os Soldados do Império usam o retrato dos Soldados Imperiais, Os Vigias usam o dos Três Soldados e "Simony, a brincar" usa o da Simony (ver `RETRATO_IGUAL` em `js/regras.js`). Se quiser pinturas próprias, grave `inimigo-soldados-do-imperio.png`, `inimigo-vigias.png` ou `inimigo-simony-a-brincar.png` e retire a linha correspondente.
