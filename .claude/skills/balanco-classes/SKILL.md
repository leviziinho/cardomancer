---
name: balanco-classes
description: Cardomancer — usar sempre que uma mudança possa mexer no equilíbrio do jogo (classes, atributos, Vida, armas, armaduras, talentos, manobras, aliados, inimigos, chefe, regras de combate ou de viagem, encontros). Corre o simulador contra a base aprovada e avisa o Levi quando alguma classe passa a ganhar mais.
---

# Aviso de balanço por classe

O Levi aprovou um equilíbrio: cada classe ganha entre 40% e 50% das partidas no estilo `cacador` do simulador. Os números aprovados estão em `tools/base-classes.json`. O objetivo desta skill é não desfazer esse trabalho sem ele saber.

## Quando usar

Depois de qualquer mudança que possa alterar quem ganha e quem perde, mesmo que pareça pequena ou que o pedido não fale em balanço. Por exemplo:

- números de classes, raças, antecedentes, armas, armaduras, acessórios, talentos, manobras, aliados ou companheiros;
- inimigos, jeitos de lutar, chefe, guardas, subida por etapa;
- regras de combate, de testes, de viagem, de encontros, de descanso ou de pistas.

Mudanças só de aspeto (letra, cores, animações, som, textos que não mudam regras) não precisam.

## Como fazer

1. Faça a mudança.
2. Corra o simulador com amostra grande, só no estilo que conta:

   ```bash
   node tools/sim.js 12000 cacador
   ```

   Com menos de 12000 partidas cada classe varia até 8 pontos de corrida para corrida, e o resultado não serve para decidir.
3. Leia o bloco "Comparação com a base" no fim. Cada classe aparece como `SUBIU`, `igual` ou `desceu`; a folga de 3 pontos é o ruído. Se alguma subir, corra outra vez para confirmar: só conta a subida que aparece nas duas corridas.
4. Se alguma classe aparecer como `SUBIU`, **avise o Levi antes de continuar** ou de publicar: diga que classes subiram, de quanto para quanto, e que mudança é a causa provável. Não corrija sozinho para a fazer descer, nem esconda o aviso no meio de outras notícias: ponha-o à vista na resposta.
5. Se só houver descidas, diga também, mas sem bloquear. Uma classe abaixo de 40% merece ser apontada.
6. Nunca grave uma nova base sem o acordo explícito do Levi. Quando ele aprovar os números novos:

   ```bash
   node tools/sim.js 12000 cacador --gravar-base
   ```

## Como contar ao Levi

Em português, curto, numa tabela: classe, base, agora, diferença. Diga a causa provável de cada subida e uma ou duas maneiras de a desfazer, e pergunte se aceita a subida ou se prefere corrigir.
