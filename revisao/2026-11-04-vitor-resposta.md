---
autor: Claude, com o Levi
data: 2026-11-04
responde_a: parecer de playtest e potencial comercial do Vitor (Manus, 2026-11-04)
---

## Resumo
O jogo publicado passa a ter só Daraan, o Império da Espada. Do parecer, fizemos o que se resolve no código. O que pede pessoas e aparelhos reais fica com o Levi.

## Pontos
P1. Validar a primeira partida com pessoas novas: fica com o Levi. A abertura já diz o que é o jogo e como se joga.
P2. Cartas autoexplicativas: feito. Cada carta de escolha mostra sempre, pela mesma ordem, o que rende (a verde, com o custo em ouro ou dias), o que custa falhar (a vermelho) e, no rodapé, o atributo, o número a tirar e a hipótese de acertar.
P3. Curva de sobrevivência: medida. No estilo sensato, 89% das mortes são no chefe, e esse estilo vai ao fim sem as pistas. No estilo caçador, que procura as pistas, metade das mortes é no chefe e 22% em encontros na estrada. A espiral tempo e vida não aparece: quem chega a cada etapa chega com 79% a 91% da Vida. O que falta ensinar ao jogador é que ir ao chefe sem pistas quase sempre mata.
P4. Ciclo tempo e vida: o simulador regista agora as mortes por causa, a Vida perdida por sítio, e o dia e a Vida em cada etapa (`node tools/sim.js 3000 sensato`).
P5. Robustez de carregamento: feito. Se o motor 3D falhar, o jogo tenta um segundo servidor e depois explica no ecrã o que se passa, com Tentar de novo. Os testes em telemóveis modestos ficam com o Levi.
P6. Narrativa memorável: o Levi vai trabalhar os textos de Daraan no Livro das Histórias. Vésper e Madeira Negra saíram do jogo público até serem revistos.
P7. Apresentação: feito em parte. A abertura deixa ver a mesa por trás e diz, numa frase, o que é o jogo, que é uma versão experimental e como se joga. Falta a duração de uma partida, que ainda ninguém mediu.

## Perguntas para o Vitor
- Para o P3: preferes uma pista mais clara no jogo (o livro a avisar antes do fim que o chefe sem pistas é quase impossível) ou um chefe mais brando para quem não as tem?
