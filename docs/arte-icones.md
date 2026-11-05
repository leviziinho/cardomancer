# Arte: ícones, miniaturas e mesa

Tudo isto entra sozinho no jogo depois de correr `python tools/arte.py`. Enquanto uma imagem não existir, fica o desenho antigo.

## 1. Ícones: 4 folhas de 3 × 3 (`arte/icones/folha1.png` … `folha4.png`)

Anexe uma carta já feita como referência de estilo e cole:

```
Folha de 9 ícones para um jogo de cartas de fantasia medieval, numa grelha regular de 3 x 3,
cada ícone centrado na sua casa, bem separados, todos do mesmo tamanho.
Estilo: objetos de metal dourado envelhecido e gasto, com contorno de tinta castanho-escura
e sombreado a aguarela, como gravuras num grimório antigo. Desgastados, riscados, nada brilhante.
Fundo branco liso e uniforme, sem sombras no chão, sem molduras, sem texto, sem letras.
Formato quadrado 1:1.
Os 9 ícones, linha a linha, da esquerda para a direita:
```

e acrescente a lista da folha:

| Folha | Os 9 ícones, por esta ordem |
|---|---|
| `folha1.png` | espada · machado · adaga · arco com flecha · escudo · martelo · punho fechado · chama · coração |
| `folha2.png` | estrela de quatro pontas · sol · lua crescente · olho · folha · pena · gota de água · pico de montanha · torre |
| `folha3.png` | pergaminho enrolado · nota musical · balão de fala · busto de uma pessoa · coroa · selo de lacre · runa gravada em pedra · cadeado · placa de madeira num poste |
| `folha4.png` | moeda de ouro · bolsa de couro · ampulheta · punho fechado de pele (Força) · dois pés com asas nos calcanhares (Agilidade) · cérebro azul (Mente) · lábios sorridentes com batom (Carisma) · chave antiga · vela acesa |

**Antes de guardar, confirme:**
- são 9 ícones, numa grelha regular, pela ordem da lista;
- o fundo é branco liso.

## 2. Miniaturas do herói (`arte/miniaturas/<classe>.png`)

O pino no mapa passa a ser uma miniatura pintada da classe, de pé na sua base.
Anexe **a ilustração da própria classe**, em `arte/cartas/classes/`, para a miniatura ser a mesma personagem:

```
Miniatura de jogo de tabuleiro, esculpida em metal e pintada à mão, da personagem da imagem anexa:
a mesma pessoa, a mesma roupa e as mesmas cores.
De corpo inteiro, de pé, em pose heroica, sobre uma base redonda de pedra pintada.
Vista de frente, ligeiramente de cima. Pintura gasta, com a tinta lascada nas arestas
e o metal à vista em alguns pontos, como uma miniatura muito jogada.
Fundo branco liso, sem sombra no chão, sem texto. Formato vertical 2:3.
```

| Ficheiro | Classe |
|---|---|
| `guerreiro.png` | Guerreiro |
| `barbaro.png` | Bárbaro |
| `ladino.png` | Ladino |
| `bardo.png` | Bardo |
| `mago.png` | Mago |
| `clerigo.png` | Clérigo |
| `patrulheiro.png` | Patrulheiro |
| `druida.png` | Druida |
| `monge.png` | Monge |
| `feiticeiro.png` | Feiticeiro |

## 3. Tampo da mesa (`arte/mesa.png`)

```
Textura de madeira de carvalho escuro, vista exatamente de cima, de um tampo de mesa de taberna muito antigo:
tábuas largas, veios, nós, riscos, queimaduras de vela, manchas de vinho e de cera, cantos gastos.
Luz uniforme, sem sombras, sem objetos em cima, sem perspetiva.
Textura contínua, sem costuras, que se possa repetir lado a lado. Formato quadrado 1:1.
```
