# Arte das cartas — guia e prompts

Primeira peça (feita): a carta de classe do **Guerreiro** (VII · O Carro), com ilustração a sério e papel velho.
Se o resultado agradar, este guia fixa o estilo para as outras classes, raças, antecedentes, itens e aliados.

## Como fazer

1. Abrir uma conversa nova no **ChatGPT** (o Levi preferiu o traço dele ao do Gemini, a 5 nov.).
2. Colar primeiro o **bloco de estilo**, e depois o prompt da peça. Uma imagem de cada vez, na mesma conversa.
3. Gerar até gostar. Pedir ajustes na mesma conversa ("mais escuro", "a cara mais visível", ...).
4. Guardar a imagem com o nome indicado, na pasta indicada. Qualquer tamanho serve; PNG ou JPG.
5. Avisar-me. Eu corro `python tools/arte.py`, que recorta, reduz e põe a imagem no jogo.

## Bloco de estilo (colar sempre primeiro)

> Vou pedir-te várias ilustrações para as cartas de um jogo de fantasia sombria, todas no mesmo estilo.
> Estilo: pintura a óleo e aguarela com traço de tinta, como as ilustrações de um baralho de tarô antigo
> pintado à mão, com riqueza de detalhe nas armaduras, nos tecidos e nas caras. Luz dramática, de lado,
> como ao fim da tarde, com sombras profundas. Paleta quente e envelhecida: ocres, castanhos, dourados
> gastos, vermelho-vinho, verdes e azuis apagados. Figuras com contorno escuro e bem recortadas do fundo.
> Sem texto, sem letras, sem molduras, sem bordas, sem assinaturas. Formato quadrado 1:1.
> A cara e o essencial ficam no meio e em cima; deixa margem à volta, porque as bordas vão ser cortadas.

## 1 — Guerreiro

Guardar como `arte/cartas/classes/guerreiro.png`.

> Ilustração do arcano VII, O Carro, para a carta do Guerreiro. Um guerreiro veterano de meia-idade, de
> pé num carro de guerra de madeira escura com ferragens de bronze, visto de frente, ligeiramente de
> baixo. Barba curta grisalha, cicatrizes na cara, olhar calmo e seguro de quem já venceu muitas lutas.
> Armadura de placas gasta e amolgada sobre cota de malha, capa vermelho-vinho rasgada na ponta, elmo
> aberto com uma pluma vermelha. Na mão direita, uma espada longa erguida; à cintura e nas costas, outras
> armas: um machado, uma lança, um escudo redondo riscado de golpes. Por cima dele, um dossel azul-escuro
> com estrelas douradas bordadas, sobre dois postes. O carro é puxado por duas feras sentadas, uma branca
> e uma negra, de frente para nós. Ao fundo, uma planície ao pôr do sol com estandartes rasgados e fumo
> de uma batalha que acabou.

Se o gerador recusar ou baralhar o tarô, tirar a primeira frase e começar em "Um guerreiro veterano".

## 2 — Papel velho

Guardar como `arte/cartas/papel.png`. Serve para **todas** as cartas, por baixo e por cima da moldura.

> Agora uma textura, sem desenho nenhum: uma folha de pergaminho grosso muito antiga, vista de cima
> e iluminada por igual, a ocupar a imagem inteira, como uma digitalização. Cor de creme a ocre, com
> manchas de humidade e de chá, pontinhos castanhos de bolor, marcas de dedos, uma dobra leve a meio,
> riscos finos, as margens mais escuras e gastas e os cantos roídos e esfiapados. Sem texto, sem
> desenhos, sem molduras, sem objetos por cima, sem sombras. Formato vertical 2:3.

## 3 — As outras nove classes

Cada classe é um arcano do tarô, como o Guerreiro é O Carro. Os prompts seguem a imagem do arcano e
dão-lhe a cara da classe. Para o estilo não fugir:

- Na mesma conversa do ChatGPT, **anexar a imagem do Guerreiro** e escrever antes do bloco de estilo:
  "Usa esta imagem como referência de estilo, de traço e de cor para todas as próximas."
- Pedir uma de cada vez, em **formato quadrado 1:1**.
- Guardar cada uma em `arte/cartas/classes/` com o nome indicado (o nome é a chave da classe no jogo).
- Pode mandar-me várias de uma vez; eu ponho todas no jogo e mostro-as lado a lado.

Se uma sair com texto, número do arcano ou moldura pintada, pedir: "o mesmo, sem texto e sem moldura".

### `bardo.png` — 0 · O Louco

> Ilustração do arcano 0, O Louco, para a carta do Bardo. Um bardo jovem e despreocupado, de capa
> verde e chapéu com uma pena comprida, a caminhar à beira de um precipício de olhos no céu, a cantar.
> Leva um alaúde de madeira trabalhada às costas e uma trouxa num pau ao ombro; na outra mão, uma flor
> branca. Um cão pequeno salta-lhe aos pés, a avisá-lo. Ao fundo, montanhas e um sol claro e alto.

### `mago.png` — I · O Mago

> Ilustração do arcano I, O Mago, para a carta do Mago. Um mago de meia-idade, de túnica vermelha sobre
> branco, de pé atrás de uma mesa de pedra, com uma varinha erguida na mão direita a apontar ao céu e a
> esquerda a apontar à terra. Sobre a mesa: uma taça, uma espada curta, uma moeda de ouro e um bastão,
> e livros abertos com runas. Por cima da cabeça, um símbolo do infinito feito de luz. À volta, rosas e
> lírios. Interior de uma torre de pedra, com luz a entrar por uma janela alta.

### `druida.png` — III · A Imperatriz

> Ilustração do arcano III, A Imperatriz, para a carta da Druida. Uma druida de cabelo comprido, coroa
> de doze estrelas pequenas entrançada com folhas, vestido verde e castanho com bordados de ramos,
> sentada num trono de raízes vivas, no meio de um campo de trigo maduro à beira de uma floresta. Tem
> um cajado de madeira com folhas a brotar. A seus pés, uma cobra enrolada; no ombro, um corvo; numa teia
> entre os ramos, uma aranha. Um riacho corre atrás dela. Luz dourada de fim de tarde.

### `clerigo.png` — V · O Hierofante

> Ilustração do arcano V, O Hierofante, para a carta do Clérigo. Um clérigo idoso e sereno, de vestes
> vermelhas e brancas e uma mitra alta de três coroas, sentado entre duas colunas de pedra, uma clara e
> uma escura, num templo antigo. Ergue a mão direita a abençoar, e dela sai uma luz quente que cura;
> na esquerda, um báculo de ouro com três travessas. Aos seus pés, duas chaves cruzadas e dois fiéis
> ajoelhados, um deles com uma ligadura no braço.

### `barbaro.png` — VIII · A Força

> Ilustração do arcano VIII, A Força, para a carta do Bárbaro. Um bárbaro enorme e musculado, de cabelo
> comprido e entrançado, pinturas de guerra na pele e peles de animal nos ombros, com um machado de duas
> mãos às costas. De mãos nuas, abre as mandíbulas a um leão enorme, sem esforço e quase a sorrir. Por
> cima da cabeça, um símbolo do infinito ténue no céu. Ao fundo, uma estepe fria com montanhas nevadas
> e um sol baixo e vermelho.

### `monge.png` — XIV · A Temperança

> Ilustração do arcano XIV, A Temperança, para a carta do Monge. Um monge descalço e calmo, de cabeça
> rapada e túnica cinzenta e cor de açafrão, com um pé num lago de água parada e o outro em terra firme.
> Verte água de uma taça para a outra, e a água corre no ar em arco, sem cair. Ao fundo, um caminho sobe
> até um mosteiro na montanha, com um sol a nascer entre dois picos. Íris amarelas à beira da água.

### `feiticeiro.png` — XVI · A Torre

> Ilustração do arcano XVI, A Torre, para a carta da Feiticeira. Uma feiticeira jovem, de cabelo ruivo
> solto ao vento e olhos a brilhar, no alto de um rochedo, de braços abertos, sem cajado nem livro: a
> magia sai-lhe das mãos e das veias, que brilham em fogo. À frente dela, uma torre de pedra é partida
> por um raio, a coroa do topo a cair, e chamas saem das janelas. Duas figuras pequenas caem da torre.
> Céu negro de tempestade.

### `patrulheiro.png` — XVII · A Estrela

> Ilustração do arcano XVII, A Estrela, para a carta do Patrulheiro. Um patrulheiro de capa verde-escura
> com capuz para trás, armadura leve de couro e uma aljava às costas, de joelho em terra à beira de um
> lago, a apontar um arco longo. Por cima, uma estrela grande e brilhante rodeada de sete mais pequenas,
> num céu de fim de noite. Ao seu lado, um lobo cinzento atento; num ramo, uma águia; ao longe, entre as
> árvores, um urso. Um trilho de terra entra pela floresta.

### `ladino.png` — XVIII · A Lua

> Ilustração do arcano XVIII, A Lua, para a carta do Ladino. Uma figura esguia de capuz e capa escura,
> de cara meio escondida e olhar atento, a passar em silêncio por um caminho entre duas torres de vigia,
> com uma adaga curva na mão e uma bolsa de moedas à cintura. Dois cães, um de cada lado, uivam para uma
> lua cheia enorme e pálida, sem o ver. Do lago à frente sai um lagostim. Noite azul e prateada, com
> nevoeiro baixo.

## 4 — Raças, antecedentes, aliados e objetos

Estas cartas deixam o medalhão com o símbolo e passam a ter a mesma janela grande das classes, assim
que houver imagem para elas. Sem imagem, ficam como estão.

**Inclusão.** Queremos que qualquer pessoa se reveja no jogo. A diversidade está espalhada pelas cartas
como parte de quem a personagem é: etnias, géneros, idades, corpos, deficiências e casais diferentes.
Nunca como enfeite nem como piada, e sem repetir a mesma ideia em todas.

**Como pedir.** Na mesma conversa, com a imagem do Guerreiro anexada como referência de estilo. Formato
quadrado 1:1. Estas não são arcanos: são retratos e cenas. Antes da primeira, colar:

> Agora outra série, no mesmo estilo, traço e cor. Já não são arcanos do tarô: são retratos de
> personagens num momento que diz quem são, de meio corpo ou de corpo inteiro, com o rosto bem visível
> e o cenário atrás. Sem texto, sem números, sem molduras. Formato quadrado 1:1.

### Raças — guardar em `arte/cartas/racas/`

**`humano.png`**
> Uma mulher humana negra, de meia-idade, com tranças compridas presas num lenço cor de vinho e argolas
> de ouro, a rir de mãos abertas no meio de um mercado cheio, a conversar ao mesmo tempo com um vendedor
> e com um soldado. Uma bolsa de moedas à cintura e um mapa dobrado no cinto: vai a caminho de qualquer
> sítio, e já conhece toda a gente.

**`elfo.png`**
> Uma pessoa élfica de traços andróginos, pele morena-clara, cabelo prateado comprido e orelhas longas,
> de olhos fechados e mão encostada ao tronco de uma árvore antiga, a ouvir a floresta. É noite, mas os
> olhos, quando os abre, brilham levemente. Roupa de viagem verde e cinzenta, um arco curto às costas.
> Pirilampos à volta.

**`anao.png`**
> Uma anã robusta de barba ruiva entrançada com anéis de ferro, avental de couro de ferreira, a bater
> numa bigorna dentro de uma mina iluminada por uma forja. Tem a perna esquerda substituída por uma
> prótese de ferro forjado com runas, feita por ela mesma, e está assente firme no chão. Olhar teimoso,
> sorriso de lado.

**`halfling.png`**
> Um halfling de pele castanha e caracóis escuros, numa cadeira de rodas de madeira pequena e bem
> trabalhada, com rodas de raios de latão, a passar despercebido por baixo de uma mesa de jogo numa
> taberna, a apanhar uma moeda que caiu. Sorriso de quem tem sorte. Os pés descalços e peludos assentes
> no apoio da cadeira.

**`meioorc.png`**
> Uma meio-orc alta e musculada, pele verde-acinzentada, presas pequenas, cabeça rapada de um lado e
> cabelo preto do outro, braços cruzados à frente de uma ponte de portagem com a cancela partida no
> chão. O cobrador da portagem foge ao fundo. Armadura de couro gasta, um machado à cintura, e um ar
> mais divertido do que zangado.

**`elfosombrio.png`**
> Um elfo sombrio de pele cinzento-escura como obsidiana, cabelo branco comprido preso numa trança,
> olhos vermelhos que brilham no escuro e orelhas longas com argolas de prata. Armadura leve negra com
> desenhos de teias em prata, duas lâminas curvas à cintura. Sai de uma gruta funda para a luz de uma
> cidade à superfície, e as pessoas param para olhar. Ar elegante e frio.

### Antecedentes — guardar em `arte/cartas/antecedentes/`

**`soldado.png`**
> Uma veterana de guerra, mulher de cabelo grisalho curto e cicatriz na sobrancelha, sentada num muro
> de pedra a olhar para um campo de batalha antigo coberto de erva. O braço direito acaba no cotovelo,
> com a manga dobrada e presa; na mão esquerda, um elmo velho amolgado. Ao lado, uma espada espetada na
> terra com uma fita desbotada. Ar sereno, de quem sobreviveu.

**`erudito.png`**
> Um jovem erudito de pele escura e óculos redondos de aros de latão, sentado no chão de uma biblioteca
> proibida, rodeado de pilhas de livros e pergaminhos, a ler à luz de uma vela um livro acorrentado que
> brilha com runas verdes. Olhar fascinado e um pouco assustado.

**`criminoso.png`**
> Uma figura magra de capuz, de traços do sul da Ásia, encostada à parede num beco à noite, a trocar
> uma bolsa de moedas com alguém de quem só se vê a mão. Dedos cheios de anéis, uma gazua no bolso,
> e um gato preto em cima de um barril. Luz de lanterna ao fundo.

**`nobre.png`**
> Dois homens de meia-idade, um casal, numa estalagem modesta, com roupas nobres antigas já gastas e
> remendadas, à mesa com uma toalha branca impecável que trouxeram de casa. Um serve vinho barato num
> cálice de prata, o outro sorri e brinda. À parede, pendurado, o brasão da família. Perderam as terras,
> mas não as maneiras.

**`eremita.png`**
> Uma eremita idosa de pele morena e cabelo branco comprido, sentada à entrada de uma gruta na montanha,
> enrolada num manto de lã crua, com um cajado e uma lanterna acesa ao lado. Um cão velho dorme-lhe aos
> pés. Neve a cair, e ela calma, de olhos fechados.

**`marinheiro.png`**
> Uma marinheira de traços do leste asiático, cabelo preto curto ao vento, de pé ao leme de um navio à
> noite, com um astrolábio na mão e as estrelas por cima, cordas e nós a toda a volta. Casaco de oleado,
> uma faca no cinto. Ondas altas, e ela segura e a sorrir.

**`rebelde.png`**
> Um rebelde jovem, de pele morena, com a marca do Opositor no rosto: um círculo vermelho vivo, irregular,
> pintado com quatro dedos à volta do olho direito. Roupa comum, sem armadura, uma espada simples à cintura.
> Dentro de uma caverna no pântano, iluminada por fogueiras, rodeado de outros rebeldes de idades e origens
> diferentes, todos com a mesma marca. Mapas na rocha. Olhar decidido.

**`recrutado.png`**
> Um artesão jovem, de traços do norte de África, ainda com o avental de carpinteiro e serradura no
> cabelo, a receber uma espada das mãos de um oficial de armadura preta e vermelha, numa praça de uma
> cidade com fontes. Atrás dele, a oficina com as ferramentas. Ar de quem não pediu nada disto.

**`sentinela.png`**
> Uma sentinela de floresta, mulher de pele clara e sardas, de capa verde-musgo, agachada num ramo
> alto a observar o chão, onde se vê uma armadilha de laço escondida entre as folhas. Arco curto na
> mão, uma corneta de chifre à cintura. Floresta densa, raios de luz entre as copas.

### Aliados — guardar em `arte/cartas/aliados/`

**`mira.png`** — Mira das Sombras
> Mira, uma ladra jovem e esguia de pele escura e cabelo rapado, de capa cinzenta, num telhado à noite.
> Não fala: está a fazer um sinal com as mãos, em língua gestual, a quem vem atrás dela. Uma gazua entre
> os dentes, uma adaga na bota.

**`bram.png`** — Bram, o Ferreiro
> Bram, um ferreiro enorme, de pele escura e barba grisalha curta, de avental de couro e braços como
> troncos, a partir com as mãos uma corrente pesada. A perna direita é uma prótese de ferro que ele
> mesmo forjou. Forja acesa atrás, faíscas no ar. Cara bondosa.

**`odel.png`** — Irmã Odel
> A Irmã Odel, uma curandeira idosa de hábito simples cor de terra, pele com manchas de vitiligo no rosto
> e nas mãos, a ligar a ferida de um soldado ferido numa enfermaria de campanha. Ervas e frascos à volta,
> uma bengala encostada à cama. Mãos firmes e olhar doce.

**`tome.png`** — Tomé, o Noviço
> Tomé, um rapaz noviço de uns doze anos, albino, de cabelo branco e óculos de lentes grossas, de hábito
> castanho grande demais para ele, sentado no alto de uma escada de biblioteca, a apontar uma passagem
> num livro antigo a um monge adulto que o olha espantado.

**`grumm.png`** — Grumm, o Ogro
> Grumm, um ogro enorme e gentil, de pele cinzenta e roupa remendada, sentado no chão de pernas cruzadas,
> com uma pequena lousa nas mãos onde acabou de escrever, com letra torta, uma palavra. Uma criança
> humana ao lado aplaude. Um tronco que usa como clava encostado atrás.

**`sela.png`** — Sela, a Mercadora
> Sela, uma mercadora de meia-idade, de pele morena e lenço colorido na cabeça, atrás de uma banca cheia
> de tecidos, especiarias e mapas, a cumprimentar um cliente pelo nome. Ao lado, a mulher dela, de avental,
> conta moedas e ri-se. Mercado movimentado, toldos às riscas.

**Os companheiros** (`lobo.png`, `urso.png`, `aguia.png`, `cobra.png`, `aranha.png`, `corvo.png`):
> Um [lobo cinzento grande / urso castanho enorme / águia-real / cobra verde e dourada / aranha grande
> de patas listradas / corvo negro de olhos inteligentes], sozinho, em pose de companheiro leal de um
> aventureiro, no seu ambiente natural, de frente para nós e com os olhos bem visíveis.

### Aliados de Daraan — também em `arte/cartas/aliados/`

O que está nos livros vem tal e qual. O que os livros não dizem está marcado *(sugestão)*: o Levi
confirma ou corrige antes de gerar.

**`simony.png`** — Simony Lumiel
> Simony Lumiel, jovem humana, bela e forte, de pele morena e cabelo comprido entrançado, com o círculo
> vermelho dos rebeldes à volta do olho direito. Última da sua família, filha do antigo rei da capital, e
> braço direito do Opositor. Empunha uma espada longa numa mão e uma adaga na outra. De pé num rochedo do
> Pântano Sombrio, a falar a uma multidão de soldados cercados, com os rebeldes atrás dela.

**`geyser.png`** — Geyser Punho Cego
> Geyser Punho Cego, um monge poderoso, de mãos nuas, a meio de um salto mortal sobre os telhados de
> umas guaritas de madeira. É cego: perdeu a vista numa luta contra um dos Andarilhos Fantasmas, e luta a
> sentir a energia de quem tem à frente. *(Sugestão: olhos brancos e baços sem venda, cabeça rapada, pele
> castanha, túnica de monge com o símbolo de Heironeus, o deus do heroísmo, onde treinou.)*

**`artas.png`** — Artas Lancaster
> Artas Lancaster, um halfling mestre de armas brancas, que treinou a maioria dos soldados de Peream. Tem
> adagas escondidas nas mangas e acabou de lançar três de uma vez. Atrás dele, o grande portão de Peream,
> com as catapultas e as engrenagens que ele mesmo construiu. *(Sugestão: pele clara com sardas, cabelo
> castanho encaracolado, barba curta, colete de couro cheio de bainhas.)*

**`aaron.png`** — Aaron Bak
> Aaron Bak, príncipe de Peream e sentinela da cidade, filho do rei que antes guardava a biblioteca
> sagrada de Pere. De espada larga erguida em guarda, à frente das muralhas de madeira da cidade na
> floresta. *(Sugestão: jovem de pele negra e cabelo curto, armadura de sentinela verde-escura com uma
> capa curta, ar nobre que tenta esconder.)*

**`crunch.png`** — Crunch
> Crunch, um meio-orc bárbaro de força imensa, o último da sua tribo, com um machado grande e cortante.
> Ao lado dele, o amigo Zhenris, um elfo magro, de quem ele cuida desde que Zhenris lhe salvou a vida em
> criança. Crunch ri-se com o braço por cima do ombro do amigo. *(Sugestão: pele verde-acinzentada,
> cabeça rapada, presas, cicatrizes, tatuagens tribais no peito.)*

**`zhenris.png`** — Zhenris Voranan
> Zhenris Voranan, feiticeiro elfo da família Voranan, de Abiad. Pele clara, cabelo preto comprido, liso
> e sedoso, olhos verde-claros, altura mediana e magro. Veste a sua robe élfica, um manto branco e
> vermelho com adornos de prata. Segura entre os dedos uns pedaços de pedra vermelha e deles nasce
> fogo; na outra mão, um pequeno orbe de fogo do tamanho de um punho. Ao fundo, a praça de Abiad com o
> chafariz.

**`montblanc.png`** — Montblanc
> Montblanc, um bardo halfling e escritor, cujas palavras são respeitadas. Sentado num banco de taberna,
> a escrever com pena e tinta num pergaminho, com um alaúde ao lado e pessoas à volta a ouvir o que lê.
> *(Sugestão: idoso, cabelo branco comprido, óculos, roupa colorida e remendada.)*

**`darien.png`** — Darién Brilho da Lua
> Darién Brilho da Lua, nobre elfo, regente de Mórmon, uma cidade pequena numa depressão entre montanhas,
> onde vivem sobretudo elfos e halflings. De pé no salão do seu castelo, a receber com um abraço uma
> família de elfos que foge do Império. Ar compassivo e cansado de quem ficou no posto para proteger o que
> ainda há. *(Sugestão: elfo de pele morena, cabelo prateado, coroa fina de regente, manto azul-noite.)*

### Objetos — guardar em `arte/cartas/itens/`

Para os objetos, colar antes:

> Agora uma série de objetos, no mesmo estilo, traço e cor. Cada imagem mostra um só objeto, grande e
> ao centro, pousado ou pendurado num sítio que lhe diz respeito (uma mesa de madeira, uma bancada,
> uma pedra), com luz de vela de lado. Sem pessoas, sem texto, sem molduras. Formato quadrado 1:1.

Depois, um de cada vez, com o nome do ficheiro e a descrição:

| Ficheiro | Objeto |
|---|---|
| `adaga.png` | uma adaga curva de lâmina fina e cabo de osso, sobre um mapa |
| `cajado.png` | um cajado de freixo direito, com runas gravadas e uma fita de couro no punho |
| `vara.png` | uma vara de sabugueiro torcida, com folhas pequenas ainda a brotar |
| `orbe.png` | uma orbe de cristal num suporte de bronze, com névoa a rodar lá dentro |
| `simbolo.png` | um símbolo sagrado de prata, um sol, pendurado num fio de contas |
| `grimorio.png` | um grimório negro preso com correntes, com um olho gravado na capa |
| `espada.png` | uma espada de família velha, com o fio gasto e o brasão quase apagado no punho |
| `rapieira.png` | uma rapieira de duelo com guarda de laços de prata, sobre uma luva de veludo |
| `arco.png` | um arco longo de teixo, com a aljava de flechas de penas brancas |
| `machado.png` | um machado de guerra pesado, de lâmina larga, cravado num cepo |
| `montante.png` | um montante enorme, de duas mãos, encostado a uma parede de pedra |
| `gibao.png` | um gibão de couro curtido, com fivelas, num cabide de madeira |
| `cota.png` | uma cota de malha pesada, a cair dobrada sobre um banco |
| `capa.png` | uma capa cinzenta com capuz, pendurada num prego, quase a desaparecer na sombra |
| `manto.png` | um manto de escriba cheio de bolsos, com penas e frascos de tinta a sair deles |
| `amuleto.png` | um amuleto de prata com uma pedra pálida, a brilhar ao lado de um crânio |
| `anel.png` | um anel de sinete de ouro, com o brasão impresso em lacre vermelho ao lado |
| `diario.png` | um diário de couro aberto, com páginas cifradas, desenhos e uma pena |
| `bracal.png` | um braçal de ferro com rebites, amolgado de golpes |
| `pocao.png` | um frasco de vidro com líquido vermelho a brilhar, rolha de cortiça e etiqueta em branco |
| `corda.png` | um rolo de corda grossa com um gancho de ferro de três pontas |
| `lanterna.png` | uma lanterna de ferro furta-fogo, com a portinhola a deixar sair um feixe só |

Os objetos de Daraan, pelos livros:

| Ficheiro | Objeto |
|---|---|
| `lach.png` | uns pedaços de pedra vermelha numa mão aberta, com chamas pequenas a nascer deles (o feitiço "Lach" dos Voranan) |
| `lua.png` | um par de armas, uma espada longa e uma adaga, cruzadas, com crescentes de lua gravados (o estilo de Simony) |
| `larga.png` | uma espada larga imperial, tirada a um soldado, com o brasão do Império no punho *(sugestão de brasão: uma espada negra sobre fundo vermelho)* |
| `robe.png` | uma robe élfica, um manto branco e vermelho com adornos de prata, dobrada sobre uma arca |
| `imperial.png` | uma armadura imperial completa, preta e vermelha, muito pesada, num suporte |
| `varinha.png` | uma pequena varinha de levitar, a flutuar um palmo acima de uma mesa |
| `pedra.png` | uma pedra dos goblins a emanar energia, a vibrar e a fazer barulho |

## O que eu faço com elas

- A ilustração entra na janela em arco da carta, por baixo do título; a moldura, o arcano e o texto
  continuam desenhados pelo jogo, nítidos em qualquer tamanho.
- O papel fica por baixo de tudo e volta por cima em transparência, para as manchas e o desgaste
  apanharem também a moldura e a faixa.
- Depois de vermos o Guerreiro no jogo, ajustamos o bloco de estilo e seguimos para as outras classes.

## Medidas, para quem gera

- A janela da ilustração é quadrada (800 x 800): uma imagem 1:1 entra inteira. Imagens ao alto (2:3)
  também servem: o recorte fica com a parte de cima, onde costuma estar a cara.
- Se o recorte cortar algo importante, muda-se `FOCO` em `tools/arte.py`.
- Se houver duas imagens com o mesmo nome (por ex. `.jpg` e `.png`), vale a última por ordem alfabética.
