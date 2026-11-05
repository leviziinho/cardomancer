# Arte do livro: regiões de Daraan

Cada página do livro tem uma janela de ilustração, mais larga do que alta.
Quando há uma pintura do lugar onde o herói está, o livro usa-a.
Se a cena se passar noutro terreno, por exemplo numa floresta perto de uma cidade, usa a pintura desse terreno.
Sem pintura nenhuma, fica o desenho antigo.

## Como gerar

1. No ChatGPT, anexe uma ilustração já feita (o Guerreiro, por exemplo) como referência de estilo.
2. Cole o **bloco de estilo** e depois a linha do lugar.
3. Peça formato **horizontal 3:2**. O jogo corta um pouco dos lados, por isso o importante deve ficar ao centro.
4. Guarde com o nome indicado:
   - lugares em `arte/regioes/`;
   - terrenos em `arte/terrenos/`.

## Bloco de estilo (colar sempre)

```
Ilustração de paisagem para um livro de aventuras de fantasia medieval,
no mesmo traço da imagem de referência: tinta e aguarela, muito detalhe, luz quente.
Formato horizontal 3:2, com o motivo principal ao centro.
Sem texto, sem letras, sem moldura.
Se aparecerem pessoas, são pequenas na paisagem e variadas em etnia, género e idade.
```

## Lugares de Daraan (`arte/regioes/`)

| Ficheiro | Lugar | Linha para o prompt |
|---|---|---|
| `tocairn.png` | Tocairn | Cidade fortificada dos guerreiros do Império, no norte. Quartéis, estandartes vermelhos e pretos, soldados a treinar no pátio. Cheira a ambição. |
| `mormon.png` | Mórmon | Cidade numa depressão entre montanhas, telhados de pedra e fumo das chaminés. Ainda há alguma paz. |
| `waleph.png` | Waleph | Cidade élfica junto a um lago-espelho que reflete o céu, entre bosques. Pontes leves e torres finas. |
| `narmer.png` | Narmer | O Porto Real, numa fenda entre falésias que leva à capital. Navios, cais de pedra e um rio que entra no mar. |
| `peream.png` | Peream | Cidade a ser engolida pela floresta: árvores a romper as ruas, raízes nas casas, musgo nas torres. |
| `abiad.png` | Abiad | Cidade rodeada de campos fartos, com um chafariz na praça. Às portas, tendas de um acampamento militar. |
| `feldon.png` | Feldon | Vila pequena e pouco visitada, ao pé de uma colina verde com entradas de grutas escondidas. |
| `kaluen.png` | Kaluen | A capital do Império, no ponto mais alto do continente. Palácio imponente sobre um monte, entre dois rios. |
| `mhari.png` | M'hari | Planícies e planaltos abertos que quase ninguém conhece, vento na erva alta e céu enorme. |
| `dentadas.png` | Montanhas Dentadas | Picos afiados que lembram os caninos de um animal enorme, neve, vento e um trilho estreito. |
| `templo.png` | Templo de Farlagg | Templo em ruínas do deus da viagem, com estátuas partidas e vitrais quebrados por onde entra o sol. |
| `pere.png` | Floresta de Pere | Floresta densa e traiçoeira, com árvores antigas, nevoeiro, e lá ao fundo uma biblioteca escondida entre as árvores. |
| `estrada.png` | Estrada de Abiad | Estrada pavimentada cheia de caravanas e carroças, com olhos escondidos nos arbustos à beira. |
| `mata.png` | Florestas de Abiad | Árvores tão altas que tapam o sol, e pequenos olhos de goblins a brilhar nos ramos. |
| `pantano.png` | Pântano Sombrio | Pântano escuro, com água parada, árvores mortas, nevoeiro e luzes estranhas ao longe. |
| `sangue.png` | Sangue Sombrio | Ilha vermelha amaldiçoada no mar, com um portão de pedra selado; criaturas de quatro asas voam lá no alto. |

## Terrenos, para cenas fora dos lugares (`arte/terrenos/`)

| Ficheiro | Linha para o prompt |
|---|---|
| `cidade.png` | Rua de uma cidade medieval com mercado, gente e ouvidos atentos. |
| `floresta.png` | Trilho numa floresta de sombra densa. |
| `estrada.png` | Estrada de terra aberta entre colinas, com um marco de pedra. |
| `montanha.png` | Passagem de montanha, ar frio e uma queda longa ao lado do trilho. |
| `pantano.png` | Margem de pântano com juncos e luzes enganadoras. |
| `ruina.png` | Ruínas antigas cobertas de hera. |
| `costa.png` | Costa rochosa com a maré a subir. |

Depois de guardar, corre-se `python tools/arte.py`.
