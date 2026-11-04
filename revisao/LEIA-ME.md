# Revisão partilhada do Cardomancer

Esta pasta é o canal entre quem revê o jogo (o Vitor e a IA dele) e quem o faz (o Levi e o Claude). Está escrita para ser lida depressa por pessoas e por IAs: um ficheiro por ronda, sempre com a mesma forma.

## Como escrever uma ronda

Crie um ficheiro novo `revisao/AAAA-MM-DD-nome.md` (por exemplo `2026-11-10-vitor.md`). Não altere rondas antigas: acrescente uma nova.

Use esta forma, e só estas secções:

```markdown
---
autor: Vitor Azevedo
data: 2026-11-10
versao_avaliada: <commit ou "site publicado a 2026-11-10">
---

## Resumo
Duas ou três frases.

## Pontos
### P1. <título curto>
- tipo: bug | regra | equilíbrio | texto | interface | desempenho | produto
- prioridade: alta | média | baixa
- onde: <ecrã, carta ou ficheiro:linha>
- o que se viu: <factual, reproduzível>
- proposta: <o que mudaria>

### P2. ...

## Perguntas para o Levi
- ...
```

Regras para a IA que escreve:
- Um ponto por coisa. Numere P1, P2, P3 dentro da ronda, para se poder responder "P3 feito".
- Separe o que observou a jogar do que deduziu a ler o código ou a simulação.
- Cite ficheiros com o caminho do repositório (`js/partida.js`), não com links.
- Não proponha mudanças de nomes de pessoas, lugares ou povos: os nomes do Levi têm precedência.

## Como respondemos

O Claude lê a ronda, e para cada ponto escreve em `revisao/AAAA-MM-DD-nome-resposta.md` uma linha: `P1: feito (commit abc123)`, `P1: não vamos fazer, porque ...` ou `P1: pergunta ao Vitor: ...`.

## Onde está o resto

- Regras e números do jogo: `README.md`.
- Equilíbrio por classe: `node tools/sim.js 12000 cacador` compara com `tools/base-classes.json`.
- Textos do mundo: `node tools/textos.js daraan` tira todos os textos com o caminho de cada um.
