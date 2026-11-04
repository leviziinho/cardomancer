---
autor: Claude, com o Levi
data: 2026-11-04
responde_a: as sugestões tiradas do parecer do Vitor (segunda ronda), aceites pelo Levi com observações dele
versao_avaliada: commit 2ab2ecc (site publicado a 2026-11-04)
---

## Resumo
Dos onze pontos desta ronda, oito estão feitos e publicados no commit 2ab2ecc. Faltam três: o tempo e os inimigos na Balança, a partida de demonstração e os traços de personalidade. A reputação passou a ser uma tendência em dois eixos, à maneira do D&D, e muda o chefe final de quem serve o Império. Os testes com pessoas novas, em telemóveis modestos, e a duração de uma partida continuam com o Levi.

## Pontos
P1. Aviso antes do chefe: feito (2ab2ecc). Quando a próxima viagem leva ao chefe, o jogo pergunta antes de partir. Diz quantas pistas leva e o que isso quer dizer. "Voltar Atrás" não gasta nenhum dia (`confirmarFinal` em `js/partida.js`).

P2. Foco na decisão: feito (2ab2ecc). Enquanto se escolhe uma carta, a barra da direita, a trilha dos dias e o aviso "Agora" recuam.

P3. Escolhas dominantes no simulador: feito (2ab2ecc). Cada estilo mostra as cartas de cena que ganham quase sempre (dominantes) e as quase nunca escolhidas (esquecidas). As raras ficam de fora, porque ganham por desenho. Visto na simulação: "Vendê-los" e "Ler os papéis" são dominantes, e "Atravessar a nado" e "Cortar pelos campos" são esquecidas.

P4. Teclado: feito (2ab2ecc). 1 a 4 escolhem cartas; C abre a ficha, M o mapa, B bebe uma poção e H abre a ajuda. As teclas mudam-se em Configurações > Teclas e ficam guardadas no aparelho.

P5. Vantagem por preparação: feito (2ab2ecc). A corda prepara para testes de habilidade e a lanterna para investigação. Gastam-se ao usar. Também têm vantagem: o Ladino, nos testes de Mente e Agilidade fora de combate. A carta diz "2d20". Os dois d20 rolam juntos: o melhor brilha e o pior encolhe. Para não ficar fácil demais, o objeto só é usado nos testes difíceis, em que a hipótese sem ele fica abaixo de 80% (`PREPARO_DIFICIL` em `js/regras.js`). Não se gasta no que já ia correr bem. Observado a jogar pelo Levi: o brilho só apareceu uma vez, numa rolagem em que os dois d20 deram 6.

P6. Saída para quem vai mal: feito (2ab2ecc), como segunda oportunidade. Uma vez por aventura, e só na primeira etapa, quem cai a 0 de Vida não morre. Acorda depois do combate (nunca a meio), com um terço da Vida, sem ouro e três dias mais tarde (`SEGUNDA` em `js/regras.js`). Na simulação, dá cerca de 3 pontos de vitória a todas as classes, e ao Bárbaro uns 2 a mais, porque com a Fúria não pode fugir.

P7. Tempo e inimigos na Balança das Cartas: ainda não. A Balança é o artefacto onde o Levi afina os números. Os dados dela estão desatualizados, e vai ser refeita a partir do código atual. Ganha também a configuração dos dias, dos inimigos e dos vilões. Por agora, cada vilão pode ser afinado à mão com `ajuste` (pv, ca, ataque) em `VILOES_DARAAN`, em `js/daraan.js`.

P8. Reputação: feito (2ab2ecc), como tendência em dois eixos escondidos.
- **Eixos:** Bem/Mal vai dos Rebeldes do Opositor e do povo até ao Império. Ordem/Caos vai da palavra dada e da lei até ao truque e à pressa.
- **Nomes:** a partir de 3 pontos num eixo, o nome muda. São nove, de Leal Bom a Caótico Mau.
- **O que o jogador vê:**
  - 75 das 230 cartas mexem na tendência.
  - Essas cartas levam uma máscara de teatro em marca d'água: sorri para o Bem, chora para o Mal, cerra os lábios para a Ordem ou o Caos.
  - A página do resultado diz "Pende para o Bem" (ou o Mal, a Ordem, o Caos).
  - A ficha mostra o nome da tendência.
- **O fim:** quem chegar ao fim do lado do Império enfrenta um rival dos Rebeldes com o mesmo peso (`RIVAIS_DARAAN`). Muda o nome e o motivo; o combate é igual. Se o rival viajar com o herói, deixa-o.
- **Onde se afina:** as marcações estão em `TEND_CARTAS`, em `js/daraan.js`. Para testar sem jogar do lado do Império, junta-se `?tendencia=mau` ao endereço.

P9. Partida de demonstração: ainda não. O mais próximo é o guia inicial. Agora, quando fala das cartas, traz cartas de exemplo (normais, especiais e com máscara) e abre o livro no passo dele.

P10. Simplificar sistemas: feito (2ab2ecc). A melhoria do ferreiro saiu (`FERREIRO = false`). A estrada ficou assim: cada viagem tem 50% de hipótese de encontro, sem rolagens à vista. Se houver encontro, o pino para a meio do caminho com o título do encontro. Se não, chega em segurança.

P11. Traços de personalidade: ainda não. Por agora, a tendência faz parte deste papel. Os traços próprios ficam para depois de vermos como a tendência se joga.

P12. Também feito nesta ronda (2ab2ecc), a partir das observações do Levi:
- o objetivo diz uma ação com a cidade realçada, por exemplo "Interrogue o suspeito em **Abiad**", numa caixa mais destacada;
- cada carta tem um selo que vai de vermelho (difícil) a verde (fácil), com a percentagem;
- Ouro, XP e Vida aparecem com moeda, estrela e coração;
- o botão Opinião abre uma issue no GitHub só com o texto, a data e a hora;
- o chefe aguenta no máximo 40% dos PV por ronda, e a página diz quanto dano lhe foi poupado;
- Santo, o Espadachim, tem CA +2;
- os aliados do Bardo somam o nível dele ao dano (o dobro era forte demais);
- a abertura tem música em Si menor, e o prelúdio improvisa no modo grego da classe.

## Perguntas para o Vitor
- P8: a tendência mostra-se o suficiente (máscara, ficha no resultado, nome na ficha), ou é demais e tira o mistério às escolhas?
- P9: para a partida de demonstração, preferes uma partida curta jogada sozinha, para ver, ou uma primeira missão guiada, em que o jogador joga com dicas?
- P3: das escolhas dominantes, "Vendê-los" ganha quase sempre. É um problema de equilíbrio, ou faz sentido o caminho do Império ser tentador?

## Perguntas para o Levi
- P7: a Balança das Cartas nova pode ser a próxima coisa a fazer?
