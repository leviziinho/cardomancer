# Arte e animação — o conceito

Ideias do Levi (3 de novembro de 2026) para quando a mesa ganhar arte a sério.

## O livro conta a história animada

- A ilustração da página esquerda deixa de ser um desenho parado: o sítio onde a cena se passa mexe-se.
  Se chove, as gotas caem, a água escorre pelo chão e pelas pedras, as poças tremem. O mesmo vale para
  neve, vento nas árvores, fumo, tochas, nevoeiro, ondas.
- No combate, os lutadores aparecem dentro do quadro: o herói, os aliados e o inimigo, em silhueta ou
  com a cara que já têm nas cartas. Cada ação joga-se ali: o golpe avança, o alvo recua e pisca, a magia
  acende, o escudo trava, a fuga sai de cena.
- Assim o livro vai contando a partida, e a mesa fica mais viva.

## As cartas raras

- As cartas raras também mexem: brilho a correr na moldura, partículas, a figura com algum movimento.
- Raridade passa a ser um eixo de equilíbrio: uma classe ou raça mais forte pode existir se for mais
  rara (aparece menos no draft) e tiver um acabamento à altura.
- Raças angelicais, infernais e dracónicas podem ser míticas.
- O Levi vai marcar a raridade de cada carta nas notas da Balança das Cartas.

## Como se faz, sem custos

- A IA gera **imagens paradas**, separadas em camadas: fundo, meio, frente, e figuras com fundo
  transparente. Não se pede vídeo: um vídeo pesa, não repete bem e não reage ao jogo.
- O movimento faz-se no código do jogo, que já desenha tudo: chuva e neve como partículas, água e
  nevoeiro com um shader por cima das zonas certas, camadas com paralaxe leve, figuras animadas por
  movimento (avançar, recuar, piscar, tremer). É grátis, leve no telemóvel, e cada ação do combate
  pode ter a sua animação.
- Gerador: o ChatGPT no plano gratuito, com poucas imagens por dia (chega para ir aos poucos).
  Alternativa gratuita: Gemini. As imagens finais ficam em `arte/` em WebP leve.

## Estilo comum

Aguarela com traço de tinta, como gravura antiga sobre pergaminho: castanhos, ocres, verdes
apagados, vermelho-vinho nos detalhes. Sem texto nas imagens. Luz suave, contornos de tinta visíveis.

## Primeiro teste (pequeno)

Uma cena e um combate, para ver se o estilo serve e se a animação convence.
Guardar em `arte/teste/` com estes nomes, em PNG (eu converto):

1. `floresta-fundo.png` — paisagem completa, sem chuva desenhada.
2. `floresta-frente.png` — só a vegetação da frente, fundo transparente.
3. `heroi.png` — figura do herói, fundo transparente.
4. `lobo.png` — o inimigo, fundo transparente.

### Prompts

Começar cada conversa com o bloco de estilo e pedir uma imagem de cada vez, na mesma conversa,
para o estilo se manter.

**Estilo (colar primeiro):**
> Vou pedir-te várias imagens para um jogo de fantasia. Todas no mesmo estilo: aguarela com traço de
> tinta castanho-escuro, como uma gravura antiga pintada à mão sobre pergaminho envelhecido. Paleta de
> ocres, castanhos, verdes apagados e algum vermelho-vinho. Luz suave e difusa. Sem texto, sem
> molduras, sem assinaturas. Formato horizontal 3:2.

**1 — floresta-fundo:**
> Uma clareira numa floresta antiga ao fim da tarde, num dia de chuva: troncos altos e escuros ao fundo,
> um caminho de terra lamacento ao centro com poças grandes, pedras cobertas de musgo à direita, céu
> carregado entre as copas. O chão e as pedras estão molhados e brilham, mas NÃO desenhes gotas de chuva
> no ar. Deixa o primeiro plano mais vazio, só chão e caminho.

**2 — floresta-frente:**
> Na mesma floresta e no mesmo estilo: só a vegetação do primeiro plano, emoldurando a cena pelos lados
> e por baixo — fetos, raízes e um tronco grosso à esquerda, ervas altas à direita. O centro da imagem
> fica vazio. Fundo totalmente transparente (PNG com transparência).

**3 — heroi:**
> No mesmo estilo: um guerreiro de corpo inteiro, de perfil voltado para a direita, em posição de
> combate, com espada e capa curta. Pés assentes no chão, figura inteira sem cortes. Fundo totalmente
> transparente (PNG com transparência).

**4 — lobo:**
> No mesmo estilo: um lobo grande e magro, de corpo inteiro, de perfil voltado para a esquerda, a rosnar,
> pronto a saltar. Pés assentes no chão, figura inteira sem cortes. Fundo totalmente transparente (PNG
> com transparência).

Se a transparência não vier, pedir: "o mesmo, mas com o fundo totalmente branco liso" — eu recorto.

### Resultado do primeiro teste

O estilo serve: cenário e figuras combinam. Mas, como saíram com a mesma paleta e a mesma luz,
as figuras fundem-se com o fundo. No código já se resolve uma parte: o cenário fica um pouco mais
apagado e escuro e as figuras ganham um contorno de luz. Nos próximos pedidos, pede-se às figuras
mais contraste.

## Segunda leva: outra classe, outra arma, outro inimigo

Mesma conversa ou nova, colando primeiro o bloco de estilo. Depois, **antes das figuras**, colar:

> Para as figuras: contorno de tinta escuro e mais grosso que no cenário, cores um pouco mais vivas
> e quentes, e uma luz clara a bater de lado, a recortar a silhueta. Fundo totalmente transparente.
> Uma figura por imagem, de corpo inteiro, sem cortes, pés no chão.

Guardar em `arte/teste/` com estes nomes:

5. `arqueira.png` — classe e raça novas, arma à distância (a flecha vai ser animada a voar):
> Uma arqueira elfa, esguia, de orelhas longas e cabelo claro preso, com capa verde-escura e
> armadura leve de couro. De perfil voltada para a direita, a puxar a corda de um arco longo, com uma
> aljava às costas.

6. `mago.png` — o aliado mágico, para a magia sair de uma mão a sério:
> Um mago idoso de barba branca e manto azul-escuro gasto, com um cajado de madeira nodosa com uma
> pedra na ponta. De perfil voltado para a direita, com a mão livre erguida como quem lança um feitiço.

7. `esqueleto.png` — outro tipo de inimigo, pálido para contrastar com a floresta:
> Um guerreiro esqueleto, ossos amarelados e rachados, restos de cota de malha enferrujada e um elmo
> amolgado, com um machado velho numa mão e um escudo redondo partido na outra. De perfil voltado
> para a esquerda, a avançar.

### O que eu faço com elas

Uma página de teste fora do jogo: o quadro do livro com as camadas, chuva a cair, poças a tremer,
e o herói e o lobo a trocar golpes (avança, acerta, o outro pisca e recua). Vemos juntos, ajustamos
o estilo e os prompts, e só depois passamos para as outras paisagens, o combate e as cartas raras.
