// Daraan, o Império da Espada: o segundo mundo, adaptado de "Sobre Espadas e Dragões".
// Primeiro vem o que este mundo acrescenta ao catálogo, depois as peças da trama.
// No fim, MUNDOS junta os dois mundos e ativarMundo troca as peças em cada partida.

// ---------- Classes novas, nos dois mundos ----------

Object.assign(CLASSES, {
  feiticeiro: { nome: 'Feiticeiro', glyph: 'flame', cor: 0xc8481a, vida: 10, attrs: { carisma: 3, mente: 1 }, desc: 'A magia corre-lhe no sangue, sem livros nem cajados. Cada feitiço cobra-se ao corpo.' },
  monge: { nome: 'Monge', glyph: 'fist', cor: 0x5a6a78, vida: 12, attrs: { agilidade: 3, mente: 1 }, desc: 'Luta de mãos vazias, e sente a energia de quem tem à frente, mesmo de olhos fechados.' },
  druida: { nome: 'Druida', glyph: 'leaf', cor: 0x4f7a2c, vida: 12, attrs: { mente: 2, forca: 1, carisma: 1 }, desc: 'Os Saybaff tiram a força da terra. Onde houver plantas e animais, nunca está sozinho.' },
  guerreiro: { nome: 'Guerreiro', glyph: 'sword', cor: 0x7a5a24, vida: 14, attrs: { forca: 2, agilidade: 2 }, desc: 'Mestre de armas brancas. Treinou muitos, e os poucos que o venceram ainda o elogiam.' },
});

Object.assign(MANOBRAS, {
  feiticeiro: [
    { id: 'orbe', t: 'Orbe de Fogo', d: 'Do tamanho de um punho, até chegar ao alvo.', magia: true, a: 'carisma', dado: 'd10', custo: 1, glyph: 'flame' },
    { id: 'lach', t: 'Lach', d: 'A palavra que os pais lhe ensinaram. Um vórtice de chamas, e o corpo paga.', magia: true, a: 'carisma', dado: 'd12', mais: 2, custo: 3, glyph: 'flame' },
    { id: 'barreira', t: 'Barreira de Fogo', d: 'O próximo golpe dele não passa.', magia: true, escudo: true, custo: 1, glyph: 'shield' },
    { id: 'tele', t: 'Telecinésia', d: 'Arranca-lhe a guarda à distância. Baixa-lhe a Defesa em 3.', magia: true, a: 'carisma', enfraquece: 3, glyph: 'eye' },
  ],
  monge: [
    { id: 'rajada', t: 'Rajada de Golpes', d: 'Chutes e socos, mais depressa do que se conta.', a: 'agilidade', dado: 'd8', facil: 1, glyph: 'fist' },
    { id: 'giro', t: 'Chute Giratório', d: 'Salta por cima da guarda. Mais difícil de acertar.', a: 'agilidade', dado: 'd12', dificil: 2, glyph: 'fist' },
    { id: 'sentir', t: 'Sentir a Energia', d: 'Sabe de onde vem o golpe antes de ele o decidir. Não lhe acerta.', escudo: true, glyph: 'eye' },
    { id: 'vazio', t: 'Respiração Vazia', d: 'Um instante de silêncio, e o corpo recompõe-se.', cura: 5, glyph: 'moon' },
  ],
  druida: [
    { id: 'lobos', t: 'Chamar os Lobos', d: 'A matilha já estava à espera do sinal.', magia: true, a: 'mente', dado: 'd10', glyph: 'leaf' },
    { id: 'urso', t: 'Rugido do Urso', d: 'Algo enorme sai do mato. Baixa-lhe a Defesa em 3.', magia: true, a: 'mente', enfraquece: 3, glyph: 'peak' },
    { id: 'falcao', t: 'Falcão aos Olhos', d: 'O próximo golpe dele sai às cegas.', magia: true, escudo: true, glyph: 'feather' },
    { id: 'seiva', t: 'Seiva de Obad-hai', d: 'A terra cobra pouco a quem a respeita.', magia: true, cura: 6, glyph: 'drop' },
  ],
  guerreiro: [
    { id: 'duplo_golpe', t: 'Golpe Duplo', d: 'Duas lâminas de tamanhos diferentes, e a guarda dele só serve para uma.', a: 'forca', dado: 'd10', dificil: 1, glyph: 'sword' },
    { id: 'mangas', t: 'Adagas da Manga', d: 'Ninguém lhe viu as mãos. Fácil de acertar.', a: 'agilidade', dado: 'd8', facil: 2, glyph: 'dagger' },
    { id: 'aparar', t: 'Aparar', d: 'Lâmina contra lâmina. O próximo golpe dele não lhe acerta.', escudo: true, glyph: 'shield' },
    { id: 'desarmar', t: 'Desarmar', d: 'Um toque no sítio certo. Baixa-lhe a Defesa em 3.', a: 'agilidade', enfraquece: 3, glyph: 'hammer' },
  ],
});

Object.assign(TATICAS, {
  feiticeiro: [{ t: 'Parede de Chamas', d: 'Um risco de fogo no chão, e ninguém passa.', tipo: 'magia', glyph: 'flame', roll: { a: 'carisma', dc: 11 }, ok: { txt: 'O fogo sobe até à altura dos ombros, e do outro lado ninguém tem vontade de atravessar.', fx: { xp: 3 } }, ko: { txt: 'A chama foge-lhe das mãos, e leva-lhe as sobrancelhas e as forças.', fx: { vida: -3 } } }],
  monge: [{ t: 'Ouvir a Sala', d: 'Fechar os olhos, e contar quantos corações há aqui.', tipo: 'tecnica', glyph: 'eye', roll: { a: 'mente', dc: 10 }, ok: { txt: 'Sabe quem está com medo, e quem está a fingir. O resto é fácil.', fx: { xp: 3, vida: 1 } }, ko: { txt: 'Há demasiado ruído hoje, e um vulto apanha-o distraído.', fx: { vida: -2 } } }],
  druida: [{ t: 'Pedir à Terra', d: 'As raízes sabem por onde passaram todos.', tipo: 'magia', glyph: 'leaf', roll: { a: 'mente', dc: 10 }, ok: { txt: 'O chão abre-lhe um caminho, e as ervas fecham-no atrás de si. Sai com os bolsos cheios de raízes que valem ouro.', fx: { ouro: 4, xp: 2 } }, ko: { txt: 'Nada responde. Por aqui, a terra já foi demasiado maltratada.', fx: { vida: -2 } } }],
  guerreiro: [{ t: 'Mostrar a Lâmina', d: 'Um único gesto, e toda a gente percebe com quem está a falar.', tipo: 'tecnica', glyph: 'sword', roll: { a: 'forca', dc: 11 }, ok: { txt: 'Ninguém tem pressa de ser o primeiro. Ainda lhe oferecem de beber.', fx: { ouro: 3, xp: 2 } }, ko: { txt: 'Alguém ali tinha mais pressa do que juízo, e é você quem sangra.', fx: { vida: -3 } } }],
});

Object.assign(EVOLUCOES, {
  feiticeiro: [
    { id: 'ultimo', nome: 'Último dos Voranan', glyph: 'flame', attrs: { carisma: 2 }, vida: 2, resumo: '+2 Carisma  ·  +2 Vida', desc: 'Traz a fúria de uma família inteira, e o cajado vira serpente à sua voz.',
      manobra: { id: 'vibora', t: 'A Víbora do Cajado', d: 'O cajado amolece e dá o bote. Dano d10, e baixa-lhe a Defesa em 3.', magia: true, a: 'carisma', dado: 'd10', enfraqueceJunto: 3, glyph: 'sword' } },
    { id: 'dragao', nome: 'Sangue de Dragão', glyph: 'crown', attrs: { carisma: 1, forca: 1 }, vida: 3, dano: 1, resumo: '+1 Carisma  ·  +1 Força  ·  +3 Vida  ·  +1 dano', desc: 'Afinal, os boatos sobre os feiticeiros eram verdadeiros.',
      manobra: { id: 'bafo', t: 'Bafo de Dragão', d: 'A chama vem de muito fundo. Dano d12+3, e custa-lhe 2 de Vida.', magia: true, a: 'carisma', dado: 'd12', mais: 3, custo: 2, glyph: 'flame' } },
  ],
  monge: [
    { id: 'punhocego', nome: 'Punho Cego', glyph: 'eye', attrs: { agilidade: 2 }, dano: 1, resumo: '+2 Agilidade  ·  +1 dano', desc: 'Já não precisa dos olhos. Os outros é que continuam a precisar dos deles.',
      manobra: { id: 'semolhos', t: 'Golpe Sem Olhos', d: 'Vai direto à energia vital. Fácil de acertar. Dano d12.', a: 'agilidade', dado: 'd12', facil: 3, glyph: 'fist' } },
    { id: 'metal', nome: 'Monge de Metal', glyph: 'shield', attrs: { forca: 1, agilidade: 1 }, vida: 5, resumo: '+1 Força  ·  +1 Agilidade  ·  +5 Vida', desc: 'Grande parte do corpo já não é carne, e os braços têm gume.',
      manobra: { id: 'gume', t: 'Braço de Gume', d: 'Parte espadas, e o resto. Dano d12+2.', a: 'forca', dado: 'd12', mais: 2, glyph: 'fist' } },
  ],
  druida: [
    { id: 'saybaff', nome: 'Saybaff Ancião', glyph: 'leaf', attrs: { mente: 2 }, vida: 2, resumo: '+2 Mente  ·  +2 Vida', desc: 'Guarda os pergaminhos mais antigos de Pere. A floresta conhece-lhe o nome.',
      manobra: { id: 'furia_obad', t: 'Fúria de Obad-hai', d: 'Toda a floresta se levanta. Dano d12, e recupera 3 de Vida.', magia: true, a: 'mente', dado: 'd12', curaJunto: 3, glyph: 'leaf' } },
    { id: 'urso_forma', nome: 'Forma de Urso', glyph: 'peak', attrs: { forca: 2 }, vida: 4, resumo: '+2 Força  ·  +4 Vida', desc: 'Às vezes, a melhor conversa com o Império é ter o triplo do tamanho.',
      manobra: { id: 'patada', t: 'A Patada', d: 'Sem magia nenhuma. Dano d12+2.', a: 'forca', dado: 'd12', mais: 2, glyph: 'peak' } },
  ],
  guerreiro: [
    { id: 'mestre_armas', nome: 'Mestre de Armas', glyph: 'sword', attrs: { agilidade: 1, forca: 1 }, dano: 1, vida: 2, resumo: '+1 Agilidade  ·  +1 Força  ·  +2 Vida  ·  +1 dano', desc: 'Lua crescente: uma lâmina longa, outra curta, e ninguém sabe qual esperar.',
      manobra: { id: 'lua_crescente', t: 'Estilo Lua Crescente', d: 'A diferença entre as lâminas apanha-o desprevenido. Fácil de acertar. Dano d12.', a: 'agilidade', dado: 'd12', facil: 3, glyph: 'moon' } },
    { id: 'campeao', nome: 'Campeão de Heironeus', glyph: 'sun', attrs: { forca: 1, carisma: 1 }, vida: 5, resumo: '+1 Força  ·  +1 Carisma  ·  +5 Vida', desc: 'O deus do heroísmo escolheu-o, e já não pode dizer que foi por engano.',
      manobra: { id: 'juramento', t: 'O Juramento', d: 'Diz-se em voz alta, e as feridas fecham.', magia: true, cura: 9, glyph: 'sun' } },
  ],
});
Object.assign(D20_DA_EVOLUCAO, { ultimo: 'fogo', dragao: 'dragao', punhocego: 'raio', metal: 'metal', saybaff: 'veneno', urso_forma: 'lua', mestre_armas: 'metal', campeao: 'ouro' });

Object.assign(TALENTOS, {
  feiticeiro: [
    { id: 'sangue_quente', nome: 'Sangue Quente', desc: '+3 Vida máxima.', vidaMax: 3 },
    { id: 'pedras', nome: 'Pedras Vermelhas', desc: '+2 em testes de Magia e Combate com fogo.', tipo: { combate: 2 } },
    { id: 'fundo', nome: 'Poço Sem Fundo', req: 'sangue_quente', desc: 'Recupera 2 de Vida ao vencer um Combate.', curaCombate: 2 },
    { id: 'chama_viva', nome: 'Chama Viva', req: 'pedras', desc: '+2 no dano.', dano: 2 },
  ],
  monge: [
    { id: 'monasterio', nome: 'Monastério de Heironeus', desc: '+2 em testes de Habilidade.', tipo: { habilidade: 2 } },
    { id: 'pele', nome: 'Pele Dura', desc: '+4 Vida máxima.', vidaMax: 4 },
    { id: 'instinto', nome: 'Instinto', req: 'monasterio', desc: 'Menos 20% de encontros surpresa contra si.', alerta: 20 },
    { id: 'mao_vazia', nome: 'Mãos Vazias', req: 'pele', desc: '+2 no dano.', dano: 2 },
  ],
  druida: [
    { id: 'raizes', nome: 'Falar com as Raízes', desc: '+2 em Investigação.', tipo: { investigacao: 2 } },
    { id: 'colheita', nome: 'Colheita', desc: 'Recupera 1 de Vida em cada cena.', curaCena: 1 },
    { id: 'trilho_verde', nome: 'Trilho Verde', req: 'raizes', desc: 'Viajar sorrateiro só custa 1 dia.', trilho: true },
    { id: 'matilha', nome: 'Matilha', req: 'colheita', desc: '+2 em testes de Combate.', tipo: { combate: 2 } },
  ],
  guerreiro: [
    { id: 'treino', nome: 'Treino de Guarda', desc: '+2 em testes de Combate.', tipo: { combate: 2 } },
    { id: 'guarita', nome: 'Noites de Guarita', desc: '+4 Vida máxima.', vidaMax: 4 },
    { id: 'gume_fino', nome: 'Gume Fino', req: 'treino', desc: '+2 no dano.', dano: 2 },
    { id: 'veterano_guerra', nome: 'Veterano da Traição', req: 'guarita', desc: 'Recupera 2 de Vida ao vencer um Combate.', curaCombate: 2 },
  ],
});

Object.assign(MENTORES, {
  feiticeiro: { titulo: 'O Velho Salazar', texto: 'Um velho de vestes reluzentes aquece as mãos numa fogueira sem lenha, e a chuva não lhe toca. "O teu sangue conhece coisas que tu ainda não sabes", diz, sem o olhar. "Há um débito a pagar. Escolhe de quem o queres herdar: de uma família, ou de um dragão."' },
  monge: { titulo: 'O Mestre de Olhos Fechados', texto: 'Um monge sentado num muro vira a cara para si antes de você fazer barulho. "Andas com os olhos abertos, e não vês nada", diz. "Posso tirar-te os olhos. Ou posso tirar-te a carne. Os dois caminhos doem."' },
  druida: { titulo: 'A Clareira que Respira', texto: 'As árvores afastam-se sem barulho, e uma anciã Saybaff espera-o no meio da clareira, com um urso a dormir aos pés. "A floresta pediu-me para olhar para ti", diz. "Podes guardar o que ela sabe, ou podes ser o que ela teme."' },
  guerreiro: { titulo: 'O Halfling das Adagas', texto: 'Três adagas cravam-se no tronco, à volta da sua cabeça. Um halfling sai de trás da pedra, sem pressa nenhuma. "Tens boa guarda, e maus pés. Há duas escolas: uma ensina-te a lutar melhor, e a outra ensina-te porque lutas. Qual queres?"' },
});

Object.assign(CARTAS_UNICAS.cls, {
  feiticeiro: { t: 'Está no Sangue', d: 'Só o Feiticeiro. Não precisa de palavras, hoje.', tipo: 'magia', ok: { txt: 'O fogo sai-lhe dos dedos antes de o pensar. Tudo se resolve, e o corpo mal se queixa.', fx: { xp: 4, ouro: 3 } } },
  monge: { t: 'De Olhos Fechados', d: 'Só o Monge. Os olhos, afinal, só atrapalhavam.', tipo: 'habilidade', ok: { txt: 'Passa pelo meio de tudo sem tocar em nada, e sai do outro lado a respirar devagar.', fx: { vida: 4, xp: 3 } } },
  druida: { t: 'A Terra Responde', d: 'Só o Druida. Um gesto, e as raízes levantam-se.', tipo: 'magia', ok: { txt: 'O chão abre-se, os bichos vêm, e o problema já não é seu. A floresta ainda lhe deixa frutos e moedas de viajantes antigos.', fx: { vida: 3, ouro: 4, xp: 2 } } },
  guerreiro: { t: 'Guarda Perfeita', d: 'Só o Guerreiro. Já viu este golpe mil vezes.', tipo: 'combate', ok: { txt: 'Lâmina contra lâmina, um passo para o lado, e quem o atacava está no chão a perguntar o que aconteceu.', fx: { ouro: 5, xp: 3 } } },
});

// ---------- Só em Daraan ----------

RACAS.tiefling.foraDe = ['daraan'];
Object.assign(RACAS, {
  elfosombrio: { nome: 'Elfo Sombrio', mundo: 'daraan', glyph: 'moon', attrs: { agilidade: 1, carisma: 1 }, desc: 'Como o Imperador, e toda a gente repara. +1 Agilidade, +1 Carisma.' },
});
Object.assign(CARTAS_UNICAS.raca, {
  elfosombrio: { t: 'A Cara do Imperador', d: 'Só Elfos Sombrios. Ninguém se atreve a perguntar de que lado está.', tipo: 'social', ok: { txt: 'Os soldados afastam-se e baixam os olhos. Ninguém sabe quem é, e ninguém quer ser o primeiro a errar.', fx: { ouro: 5, xp: 3 } } },
});

Object.assign(ANTECEDENTES, {
  rebelde: { nome: 'Rebelde do Opositor', mundo: 'daraan', glyph: 'seal', attrs: { carisma: 1 }, vida: 1, desc: 'Traz a tintura no rosto, e amigos em cavernas. +1 Carisma, +1 Vida.' },
  recrutado: { nome: 'Recrutado de Abiad', mundo: 'daraan', glyph: 'hammer', attrs: { forca: 1 }, ouro: 3, desc: 'Era artesão até lhe darem uma espada. +1 Força, +3 Ouro.' },
  sentinela: { nome: 'Sentinela de Peream', mundo: 'daraan', glyph: 'eye', attrs: { agilidade: 1 }, xp: 3, desc: 'Conhece as florestas e as armadilhas. +1 Agilidade e começa com 3 XP.' },
});
Object.assign(CARTAS_UNICAS.bg, {
  rebelde: { t: 'Pelo Opositor!', d: 'Requer Rebelde do Opositor. Basta dizê-lo no sítio certo.', tipo: 'social', ok: { txt: 'Alguém responde em voz baixa, e de repente há portas abertas, pão e uma bolsa que ninguém lhe pede de volta.', fx: { ouro: 6, vida: 2 } } },
  recrutado: { t: 'Todos Temos um Ofício', d: 'Requer Recrutado de Abiad. O que sabia fazer ainda serve.', tipo: 'habilidade', ok: { txt: 'Aquilo que aprendeu antes da guerra resolve o que nenhuma espada resolvia. Pagam-lhe bem por isso.', fx: { ouro: 8 } } },
  sentinela: { t: 'Mire na Terceira Árvore', d: 'Requer Sentinela de Peream. Já ouviu os passos.', tipo: 'investigacao', ok: { txt: 'Levanta a mão, faz sinal, e o espião cai do ramo antes de saber que foi visto.', fx: { xp: 5, ouro: 2 } } },
});

Object.assign(ITENS, {
  lach: { nome: 'Pedras Vermelhas', mundo: 'daraan', slot: 'arma', preco: 16, dado: 'd8', a: 'carisma', glyph: 'flame', desc: 'Ataca com Carisma. Componente dos Voranan. Dado d8.' },
  lua: { nome: 'Par da Lua Crescente', mundo: 'daraan', slot: 'arma', preco: 18, dado: 'd8', a: 'agilidade', attrs: { forca: 1 }, glyph: 'moon', desc: 'Ataca com Agilidade. Espada longa e adaga, ao estilo de Simony. Dado d8, +1 Força.' },
  larga: { nome: 'Espada Larga Imperial', mundo: 'daraan', slot: 'arma', preco: 24, dado: 'd10', a: 'forca', attrs: { carisma: 1 }, glyph: 'sword', desc: 'Ataca com Força. Tirada a um soldado, e o brasão ainda assusta. Dado d10, +1 Carisma.' },
  robe: { nome: 'Robe Élfica', mundo: 'daraan', slot: 'armadura', preco: 16, ca: 1, attrs: { mente: 1, carisma: 1 }, glyph: 'scroll', desc: 'Branca e vermelha, com adornos de prata. +1 CA, +1 Mente, +1 Carisma.' },
  imperial: { nome: 'Armadura Imperial', mundo: 'daraan', slot: 'armadura', preco: 26, ca: 5, attrs: { agilidade: -2 }, glyph: 'shield', desc: 'Preta e vermelha, e muito pesada. +5 CA, -2 Agilidade.' },
  varinha: { nome: 'Varinha de Levitar', mundo: 'daraan', slot: 'acessorio', preco: 14, attrs: { agilidade: 1 }, glyph: 'feather', desc: 'Simony dá destas a quem confia. +1 Agilidade.' },
  pedra: { nome: 'Pedra Energizada', mundo: 'daraan', slot: 'mochila', preco: 6, glyph: 'star', desc: 'Dos goblins. Ao agitá-la, faz um barulho ensurdecedor.' },
});

Object.assign(ALIADOS, {
  simony: { nome: 'Simony Lumiel', desc: 'O braço direito do Opositor. +2 em Combate.', tipo: { combate: 2 } },
  geyser: { nome: 'Geyser Punho Cego', desc: 'Monge cego, e vê mais do que todos. +2 em Habilidade.', tipo: { habilidade: 2 } },
  artas: { nome: 'Artas Lancaster', desc: 'Halfling mestre de adagas. +1 em Combate, +2 Vida máxima.', tipo: { combate: 1 }, vidaMax: 2 },
  aaron: { nome: 'Aaron Bak', desc: 'Príncipe de Peream, e sentinela. +1 em Investigação, +3 Vida máxima.', tipo: { investigacao: 1 }, vidaMax: 3 },
  crunch: { nome: 'Crunch', desc: 'Crunch esmaga. +2 em Combate.', tipo: { combate: 2 } },
  zhenris: { nome: 'Zhenris Voranan', desc: 'Feiticeiro de Abiad, e tem contas a ajustar. +1 em Social e Investigação.', tipo: { social: 1, investigacao: 1 } },
  montblanc: { nome: 'Montblanc', desc: 'Bardo halfling, e as suas palavras são respeitadas. +2 em Social.', tipo: { social: 2 } },
  darien: { nome: 'Darién Brilho da Lua', desc: 'Regente de Mórmon. +2 Vida máxima, +1 em Social.', tipo: { social: 1 }, vidaMax: 2 },
});

// ---------- O mapa de Daraan ----------

const LUGARES_DARAAN = {
  tocairn: { nome: 'Tocairn', x: .47, y: .11, terreno: 'cidade', cidade: true, desc: 'Cidade dos guerreiros do Império, cheira a ambição. Começa no norte.' },
  mormon: { nome: 'Mórmon', x: .27, y: .17, terreno: 'cidade', cidade: true, desc: 'Numa depressão entre montanhas, e ainda com alguma paz. Começa no noroeste.' },
  waleph: { nome: 'Waleph', x: .29, y: .42, terreno: 'cidade', cidade: true, desc: 'Junto ao lago-espelho, entre bosques e elfos. Começa no oeste.' },
  narmer: { nome: 'Narmer', x: .81, y: .44, terreno: 'cidade', cidade: true, desc: 'O Porto Real, na fenda que leva à capital. Começa no leste.' },
  peream: { nome: 'Peream', x: .55, y: .61, terreno: 'cidade', cidade: true, desc: 'A floresta está a engolir a cidade, rua a rua. Começa no centro.' },
  abiad: { nome: 'Abiad', x: .73, y: .76, terreno: 'cidade', cidade: true, desc: 'Campos fartos, um chafariz e um general à porta. Começa no sudeste.' },
  feldon: { nome: 'Feldon', x: .28, y: .80, terreno: 'cidade', cidade: true, desc: 'Vila pouco visitada pelo Império, e com uma colina cheia de segredos. Começa no sudoeste.' },
  kaluen: { nome: 'Kaluen', x: .53, y: .38, terreno: 'cidade', cidade: true, semInicio: true, desc: 'A capital, no ponto mais alto do continente.' },
  mhari: { nome: "M'hari", x: .75, y: .19, terreno: 'estrada', desc: 'Planícies e planaltos que quase ninguém conhece.' },
  dentadas: { nome: 'Montanhas Dentadas', x: .11, y: .37, terreno: 'montanha', desc: 'Lembram os caninos de um grande animal.' },
  templo: { nome: 'Templo de Farlagg', x: .10, y: .63, terreno: 'ruina', desc: 'O deus da viagem já não recebe muitas visitas.' },
  pere: { nome: 'Floresta de Pere', x: .39, y: .58, terreno: 'floresta', desc: 'Densa e traiçoeira, é dos Saybaff.' },
  estrada: { nome: 'Estrada de Abiad', x: .70, y: .60, terreno: 'estrada', desc: 'Pavimentada, cheia de caravanas e de quem as espreita.' },
  mata: { nome: 'Florestas de Abiad', x: .50, y: .79, terreno: 'floresta', desc: 'Árvores que tapam o sol, e goblins em cada ramo.' },
  pantano: { nome: 'Pântano Sombrio', x: .62, y: .90, terreno: 'pantano', desc: 'Os soldados imperiais evitam-no, e por boas razões.' },
  sangue: { nome: 'Sangue Sombrio', x: .90, y: .84, terreno: 'costa', desc: 'A ilha amaldiçoada pelos deuses, com o seu portão selado.' },
};

const ESTRADAS_DARAAN = [
  ['tocairn', 'mormon'], ['tocairn', 'mhari'], ['tocairn', 'kaluen'], ['mormon', 'dentadas'], ['mormon', 'waleph'],
  ['waleph', 'dentadas'], ['waleph', 'kaluen'], ['waleph', 'pere'], ['dentadas', 'templo'], ['templo', 'waleph'], ['templo', 'feldon'],
  ['kaluen', 'pere'], ['kaluen', 'narmer'], ['kaluen', 'estrada'], ['mhari', 'narmer'], ['mhari', 'kaluen'], ['narmer', 'estrada'],
  ['estrada', 'abiad'], ['estrada', 'peream'], ['peream', 'pere'], ['peream', 'mata'], ['pere', 'feldon'], ['mata', 'abiad'],
  ['mata', 'feldon'], ['mata', 'pantano'], ['abiad', 'pantano'], ['pantano', 'feldon'], ['pantano', 'sangue'], ['narmer', 'sangue'],
];

const MAPA_DARAAN = {
  titulo: 'Daraan, o Império da Espada', tituloX: .22,
  mar: [[.34, 0], [.36, .04], [.46, .05], [.58, .06], [.70, .08], [.84, .10], [.92, .20], [.93, .34], [.90, .42], [.92, .50], [.89, .62], [.85, .70], [.81, .84], [.75, .90], [.72, 1], [1, 1], [1, 0]],
  ilhas: [{ x: .90, y: .83, rx: .058, ry: .075, cor: 'rgba(120,45,32,.72)' }],
  lagos: [{ x: .41, y: .47, rx: .04, ry: .028 }],
  rios: [[[.53, .38], [.62, .43], [.72, .41], [.81, .44], [.90, .42]], [[.53, .38], [.51, .26], [.48, .13], [.46, .05]]],
  serras: [{ x: .02, w: .18, y: .12, h: .44, n: 60 }, { x: .12, w: .24, y: .03, h: .08, n: 24 }, { x: .49, w: .10, y: .22, h: .07, n: 12 }],
  florestas: [{ x: .40, y: .62, rx: .09, ry: .09, n: 120 }, { x: .51, y: .75, rx: .08, ry: .06, n: 90 }, { x: .37, y: .30, rx: .05, ry: .05, n: 28 }],
  pantanos: [{ x: .62, y: .85, rx: .08, ry: .045, n: 140 }],
};

// ---------- A trama ----------

const OBJETIVOS_DARAAN = {
  embaixador: { titulo: 'Capture o embaixador Quatur', glyph: 'person', desc: 'Simony precisa dele vivo, como moeda de troca pelos rebeldes presos. A caravana muda de rota, e o tempo é pouco.',
    vitoria: 'Quatur vai amarrado na carroça, a jurar que o Imperador nunca pagará por ele. Pela primeira vez, alguns presos voltam a casa, e ele fica a saber quanto vale.' },
  resgate: { titulo: 'Salve {refem}', glyph: 'seal', desc: 'O Império decretou o fim dos Voranan e de quem os ajudar. Encontre o paradeiro antes que o tirem do mapa.',
    vitoria: '{refem} sai dali pelo próprio pé, a tremer de fúria. Daraan ainda não acabou com esse nome, e o Opositor ganha mais um motivo.' },
  exilados: { titulo: 'Liberte os exilados de Sangue Sombrio', glyph: 'lock', desc: 'Os heróis de Daraan apodrecem num portão selado, entre eles o bardo Montblanc. Há quem saiba desfazer o selo.',
    vitoria: 'O selo dissolve-se. Dos que saem, muitos já não sabem andar, e Montblanc pede logo pena e tinta. Em breve, Daraan voltará a ouvir falar deles.' },
  esconderijo: { titulo: 'Proteja o esconderijo de Feldon', glyph: 'shield', desc: 'Os rebeldes estão nas cavernas dos anões, e falta a proteção prometida. Alguém os vendeu, e o Império já marcha.',
    vitoria: 'Os batedores voltam a sorrir, as fogueiras acendem-se, e o Império continua sem saber o que há naquela colina. A Força Rebelde respira mais um inverno.' },
  reliquia: { titulo: 'Encontre {reliquia}', glyph: 'star', desc: 'O Opositor precisa disso antes de o Império lhe pôr a mão. Siga as pistas, e não confie em quem lhe oferece ajuda.',
    vitoria: 'Regressa a Feldon com {reliquia} debaixo da capa. O velho nem pergunta como foi. Limita-se a mudar uma agulha de sítio no mapa.' },
};
const RELIQUIAS_DARAAN = ['o Cajado dos Voranan', 'o Pergaminho de Montblanc', 'o Livro dos Saybaff', 'o Selo do Pacto de Aramon'];
const REFENS_DARAAN = ['Malaren Voranan', 'Narcisa Voranan', 'Malakir Voranan', 'o último primo Voranan'];

const VILOES_DARAAN = {
  khayn: { nome: 'o General Khayn Ludrione', destino: 'templo', glyph: 'flame', fraqueza: ['feiticeiro', 'bardo', 'ladino'],
    efeitos: [{ t: 'A lâmina inflama-se, e o fogo passa-lhe a um palmo do rosto.', tipo: 'dreno', v: 2 }, { t: 'O sargento Kalof cobre-lhe o flanco.', tipo: 'ca', v: 1 }],
    motivos: ['Traz uma cicatriz na cara, e jurou lavá-la com o sangue de quem o humilhou.', 'Voltou de Sangue Sombrio, e já não tem medo de nada que caiba neste mundo.', 'Se trouxer as cabeças certas, os Andarilhos deixam-no continuar vivo.'],
    pistas: [
      'Em cada praça se repete o discurso: um general de voz rouca, uma execução, e todos os homens convocados à força.',
      'Quem o viu de perto fala de uma cicatriz de queimadura, e de uma espada que acende quando é sacada.',
      'Um soldado ferido confessa: o general subiu às Montanhas Dentadas, e espera no Templo de Farlagg.',
    ],
    finalTexto: 'O altar está desfeito, e os raios de sol caem pelos vitrais partidos. {vilao} passeia entre as estátuas, tocando em cada uma. A espada acende-se, e a voz rouca enche o templo. "Corajoso, para subir até aqui. Hoje, o Imperador recebe a sua cabeça."',
    ronda: { combate: 'A armadura cede num ponto cego, e ele recua um passo.', social: 'Lembra-lhe o pântano, a queimadura e a fuga. A mão da espada hesita.', habilidade: 'Roda para o lado cego do ataque, e a lâmina parte o chão.', investigacao: 'Sabe onde estão as juntas da armadura, e onde a poção lhe falta.' } },
  profeta: { nome: 'o Profeta', destino: 'sangue', glyph: 'eye', fraqueza: ['clerigo', 'mago', 'druida'],
    efeitos: [{ t: 'A esfera azulada fecha-se à volta dele, e nada o molha.', tipo: 'ca', v: 1 }, { t: 'O anel pulsa em vermelho, e parte de si já quer estar noutro lugar.', tipo: 'fraco', v: 3 }],
    motivos: ['Quer abrir o portal da ilha, para saber o que há do outro lado.', 'Colecionou os últimos de cada família rara. Precisa de estudar, diz ele.', 'Foi ele quem fez o Imperador, e ninguém sabe ainda para quê.'],
    pistas: [
      'Há quem desapareça em plena rua, envolto numa luz vermelha. A única coisa que fica é o cheiro a queimado.',
      'Um conselheiro bêbado fala de um elfo de manto branco que a chuva não molha, e que dá ordens ao próprio Imperador.',
      'Nos registos do castelo há listas de exilados, cada um com uma nota: "vivo. Para estudo." Todos foram enviados para a ilha.',
    ],
    finalTexto: 'O portão de Sangue Sombrio está aberto, e o chão pulsa em cores a cada passo. Coisas com quatro asas rondam lá em cima, sem se aproximarem. {vilao} levanta os olhos do cajado com a caveira de dragão. "Que exemplar maravilhoso", diz. "Sugiro que não se mexa."',
    ronda: { combate: 'A esfera racha, e pela primeira vez a chuva toca-lhe.', social: 'Pergunta-lhe o que Ivan fará dele no fim, e ele demora a responder.', habilidade: 'Salta os selos do chão, um a um, até ao alcance do cajado.', investigacao: 'Reconhece no anel o selo da prisão, e sabe desfazê-lo.' } },
  espadachim: { nome: 'o Espadachim', destino: 'pere', glyph: 'sword', fraqueza: ['monge', 'patrulheiro', 'guerreiro'],
    efeitos: [{ t: 'Um feixe branco abre-lhe o ombro. Ele nem se mexeu.', tipo: 'dreno', v: 2 }, { t: 'Já não está onde estava, e os seus olhos não o encontram.', tipo: 'fraco', v: 3 }],
    motivos: ['Parece uma criança, e já matou mais do que a peste. O Imperador pediu-lhe a biblioteca de Pere.', 'Nunca encontrou quem o visse mover-se. Procura alguém que valha a pena.', 'Decretou a morte de uma família inteira, e agora quer ver como ela termina.'],
    pistas: [
      'Soldados inteiros aparecem cortados sem que ninguém tenha visto a lâmina. Falam de um raio branco.',
      'Uma testemunha jura que foi um rapaz de uniforme que saltou para o céu e desapareceu. Ninguém acredita, e todos têm medo.',
      'Os Saybaff mandam dizer: o rapaz entrou em Pere, e as árvores estão a abrir caminho a quem não devia.',
    ],
    finalTexto: 'Na clareira diante da biblioteca, as folhas caem cortadas ao meio, sem vento nenhum. Um rapaz de uniforme olha para o céu, de olhos fechados. {vilao} não se vira. "Ainda não está tudo bem", diz. "Mas vai ficar."',
    ronda: { combate: 'Um golpe às cegas encontra carne, e ele abre os olhos, surpreendido.', social: 'Pergunta-lhe há quanto tempo não tem a idade que aparenta, e o raio falha.', habilidade: 'Deixa de tentar vê-lo, e começa a ouvir o ar.', investigacao: 'Percebe o padrão: o feixe sai sempre um instante depois da respiração dele.' } },
  tevish: { nome: 'Tevish Szar', destino: 'dentadas', glyph: 'fist', fraqueza: ['barbaro', 'monge', 'mago'],
    efeitos: [{ t: 'O metal do corpo fecha-se por cima da ferida.', tipo: 'cura', v: 4 }, { t: 'A resistência dele desvia tudo o que vem de longe.', tipo: 'ca', v: 1 }],
    motivos: ['Os outros Andarilhos falam. Ele só parte portas, e ninguém sabe o que ainda tem de carne.', 'Cegou um monge por desporto, e quer voltar ao monastério acabar o resto.', 'Caçou um rei até às montanhas, e tomou-lhe o gosto.'],
    pistas: [
      'Há portas de carvalho partidas em três golpes, sempre com a marca de um punho muito liso.',
      'Um sobrevivente fala de um monge de roupa negra, com olhos incandescentes e um gume na lateral dos braços.',
      'Os pastores de Ratti descem a serra: alguém anda a arrancar pedra às Montanhas Dentadas, e faz disto um templo.',
    ],
    finalTexto: 'No alto das Montanhas Dentadas, o vento uiva entre pedras partidas à mão. Uma figura de faixa vermelha cai do céu, a rodopiar, e o chão racha debaixo dela. {vilao} levanta os olhos incandescentes. "Isso é inútil", diz, antes de você ter feito alguma coisa.',
    ronda: { combate: 'Encontra a junta entre o metal e o que ainda é carne.', social: 'Fala-lhe de quem ele foi antes de o metal. Pela primeira vez, ele para.', habilidade: 'Passa-lhe por baixo das pernas, como ele fez a tantos outros.', investigacao: 'A resistência mágica tem um limite, e sabe agora qual é.' } },
  ivan: { nome: 'o Imperador Ivan Galonadel', destino: 'kaluen', glyph: 'crown', fraqueza: ['clerigo', 'guerreiro', 'feiticeiro'],
    efeitos: [{ t: 'A lâmina branca reluz, e por um instante não consegue ver nada.', tipo: 'fraco', v: 3 }, { t: 'O fluxo alaranjado sobe pela lâmina, e a ferida dele fecha.', tipo: 'cura', v: 4 }],
    motivos: ['Conquistou com sangue, traição e luxúria, e ainda não lhe chega.', 'Tem problemas em esquecer as coisas, e você entrou na lista.', 'Sabe o que diz a profecia de Montblanc, e está a poupar tempo.'],
    pistas: [
      'Em todas as cidades, os antigos senhores são agora reis, e todos pagam em ouro a mesma pessoa.',
      'Caik Bak, o velho Protetor do Reino, serve à mesa no Paço. Quem o viu diz que não levanta os olhos.',
      'Os guardas do Paço foram dobrados. O Imperador vai à varanda todas as noites, e está à espera de alguém.',
    ],
    finalTexto: 'Chove sobre o Paço Real, e é possível ver toda Daraan, trezentos e sessenta graus. {vilao} está de costas, de braços cruzados, com os crânios de dragão nos ombros. Vira-se devagar, e o sorriso vai de uma orelha à outra. "Cumprimentei o bardo pelo estilo antes de o mandar para a ilha", diz, a desembainhar a lâmina. "Vamos ver o seu."',
    ronda: { combate: 'A cicatriz no olho esquerdo sangra de novo.', social: 'Grita-lhe o Pacto de Aramon, e até os guardas levantam a cabeça.', habilidade: 'Corta-lhe a visão, e você aprende a não precisar dela.', investigacao: 'A lâmina foi feita pelos deuses, e sabe o que lhe falta: a bainha.' } },
};

const REVIRAVOLTAS_DARAAN = {
  vendido: { nome: 'O Senhor Vendido', resumo: 'Quem o ajudava já tinha aceitado o ouro de {vilao}.',
    titulo: 'Promessas de Riqueza',
    texto: 'O nobre que lhe deu abrigo fecha a porta à chave, e já não lhe chama amigo. Lá fora, ouve-se o passo pesado dos soldados de armadura vermelha. "Compreenda", diz, sem olhar para si. "Prometeram-me uma cidade inteira. {vilao} paga sempre."',
    opcoes: [
      { t: 'Fazê-lo mudar de ideias', d: 'Toda a gente em Daraan já viu o que acontece aos vendidos.', tipo: 'social', roll: { a: 'carisma', dc: 13 },
        ok: { txt: 'Lembra-lhe a cabeça do rei Caik, no salão dos reis caídos. Ele abre a porta de trás, e passa a contar a {vilao} só o que você quiser.', fx: { xp: 3, marca: 'traidorvirado' } },
        ko: { txt: 'Ele chama os guardas mais depressa. Sai pela janela, e deixa sangue no parapeito.', fx: { vida: -4, dia: 1 } } },
      { t: 'Sair pela força', d: 'Eles são muitos. Você tem pressa.', tipo: 'combate', roll: { a: 'forca', dc: 13, pv: 7, ini: 'Os Soldados Imperiais' },
        ok: { txt: 'Passa por cima da guarda. O nobre fica para trás, a explicar-se a {vilao}.', fx: { xp: 2, ouro: 3 } },
        ko: { txt: 'São superiores em tudo, menos em conhecer as vielas.', fx: { vida: -4 } } },
      { t: 'Deixar-lhe uma pista falsa', d: 'Fingir que não percebeu, e mentir sobre o caminho.', tipo: 'habilidade', roll: { a: 'mente', dc: 14 },
        ok: { txt: 'Fala de um esconderijo em Mórmon, com muitos pormenores. {vilao} vai mandar soldados a uma cave vazia.', fx: { marca: 'enganou', xp: 3 } },
        ko: { txt: 'Ele já sabia a verdade. Perde um dia a despistar quem o segue.', fx: { dia: 1, vida: -2 } } },
    ] },
  andarilhos: { nome: 'Três Dias', resumo: 'Os Andarilhos partiram antes do previsto.',
    titulo: 'Se Ivan Enviou os Andarilhos',
    texto: 'Um batedor das colinas chega a cair do cavalo. "Saíram da capital. Não são três dias, são muito menos." Olha para trás, como se alguém já pudesse estar a ouvir. Em Feldon, o Opositor manda levantar o acampamento.',
    opcoes: [
      { t: 'Refazer as contas com o batedor', d: 'Saber exatamente quanto tempo resta.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 },
        ok: { txt: 'Traça as rotas na terra com um pau. São dois dias a menos, mas agora sabe quais.', fx: { prazo: -2, xp: 3 } },
        ko: { txt: 'Discutem até de madrugada, e ninguém fica com certezas.', fx: { prazo: -3 } } },
      { t: 'Partir já', d: 'Dormir fica para depois.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 10 },
        ok: { txt: 'Sai a meio da noite, e ganha às estradas parte do que perdeu.', fx: { prazo: -1, xp: 2 } },
        ko: { txt: 'Parte exausto, e o cavalo cai antes do cansaço.', fx: { prazo: -2, vida: -3 } } },
    ] },
  profecia: { nome: 'A Letra do Conselheiro', resumo: 'Foi {vilao} quem lhe pôs a missão nas mãos.',
    titulo: 'O Mesmo Pergaminho',
    texto: 'Ao comparar os papéis, o estômago dá-lhe uma volta. O pedido que o trouxe até aqui foi escrito no mesmo pergaminho, com o mesmo selo, das ordens que tirou aos soldados. Foi {vilao} quem o enviou. Para o usar, ou para o seguir até ao Opositor?',
    opcoes: [
      { t: 'Continuar a fingir', d: 'E escrever de volta, como quem nada sabe.', tipo: 'social', roll: { a: 'carisma', dc: 13 },
        ok: { txt: 'A resposta traz-lhe um salvo-conduto com o brasão do Império, e ouro para a viagem.', fx: { ouro: 8, marca: 'enganou', xp: 3 } },
        ko: { txt: 'A resposta vem numa flecha, e por pouco não lhe acerta.', fx: { vida: -3 } } },
      { t: 'Queimar tudo', d: 'E seguir sem que ninguém saiba por onde.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 },
        ok: { txt: 'Muda de caminho e de nome. Pela primeira vez em dias, ninguém o segue.', fx: { xp: 2 } },
        ko: { txt: 'Perde um dia às voltas, sem saber se despistou alguém.', fx: { dia: 1 } } },
      { t: 'Avisar os rebeldes', d: 'Um pombo para Feldon, antes de mais nada.', tipo: 'investigacao', roll: { a: 'mente', dc: 13 },
        ok: { txt: 'O aviso chega a tempo, e Simony muda o plano. No final, isso vai contar muito.', fx: { marca: 'enganou', xp: 4 } },
        ko: { txt: 'O pombo não chega. Fica com a dúvida, e com a dor de cabeça.', fx: { vida: -1 } } },
    ] },
  debito: { nome: 'O Débito Está Pago', resumo: 'Alguém pagou por si uma dívida muito antiga.',
    titulo: 'Diga a Ele que o Débito Está Pago',
    texto: 'Uma bola de fogo atravessa a parede e acerta nos soldados que o cercavam. Na poeira, está um velho de vestes reluzentes, com um cajado na mão. "Vá, depressa", diz. "O meu sobrenome é Salazar. Diga ao Opositor que o débito está pago."',
    opcoes: [
      { t: 'Levar a mensagem', d: 'E pedir a ajuda que ele oferecer.', tipo: 'social', roll: { a: 'carisma', dc: 9 },
        ok: { txt: 'Foge com um amigo de Peream que o velho mandou à frente. Pela primeira vez, não está sozinho nisto.', fx: { aliado: 'aaron', xp: 3, marca: 'ajudado' } },
        ko: { txt: 'O velho não tem tempo para mais nada. Atira-lhe uma bolsa, e empurra-o porta fora.', fx: { ouro: 6, vida: 2 } } },
      { t: 'Só pedir o caminho', d: 'Sem arrastar mais ninguém.', ok: { txt: 'Mostra-lhe uma passagem que nem no mapa do Opositor vem, e volta-se para a poeira.', fx: { dia: -1, xp: 1 } } },
    ] },
  nome: { nome: 'O Nome Gritado', resumo: 'O seu nome chegou aos ouvidos de {vilao}.',
    titulo: 'O Decreto',
    texto: 'Num palanque, um arauto desenrola um pergaminho e lê o seu nome, o da sua família e o da sua terra. Alguém disse aquilo à frente dos soldados errados. Quem o carregar em Daraan, diz o decreto, "carregará também as consequências". A assinatura é de {vilao}.',
    opcoes: [
      { t: 'Descobrir quem falou', d: 'Mesmo que custe tempo.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 },
        ok: { txt: 'Custa-lhe um dia, mas agora sabe o que {vilao} deseja de si, e o que mais teme.', fx: { dia: 1, marca: 'sangue', xp: 4 } },
        ko: { txt: 'Perde o dia, e só fica com mais medo.', fx: { dia: 1 } } },
      { t: 'Rasgar o decreto', d: 'À frente de toda a gente.', ok: { txt: 'O papel cai em pedaços, e ouve alguém a dizer baixinho: "pelo Opositor". O nó na garganta fica, mas continua a andar.', fx: { vida: 2, xp: 1 } } },
    ] },
};

const GANCHOS_DARAAN = {
  embaixador: [
    { titulo: 'O Recado de Simony', terreno: 'cidade',
      texto: 'Uma mulher de tranças e rosto tingido senta-se à sua frente, numa taberna de {cidade}, sem pedir licença. "O embaixador de Ivan vai cruzar as estradas com pouca escolta. Quero-o vivo", diz, e deixa um mapa em cima da mesa. "Simony Lumiel agradece. O Império não vai agradecer."',
      fundo: 'Quatur é o rosto simpático do Império, e anda a medir a confiança do povo em cada cidade. Dizem que ninguém o conhece bem, e que substituí-lo não custaria nada. Simony prefere acreditar que os presos valem essa aposta.',
      opcoes: [
        { t: 'Estudar o mapa', d: 'As agulhas marcam algo mais do que estradas.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'As marcas seguem o traçado das rotas comerciais, e há uma paragem que ainda não foi riscada.', fx: { xp: 1 } }, ko: { txt: 'A tinta é fresca, e fica-lhe toda nos dedos.', fx: {} } },
        { t: 'Segui-la até à saída', d: 'Quem a viu entrar também sabe alguma coisa.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Dois batedores falam com ela à porta, e dizem o sítio em voz alta.', fx: {} }, ko: { txt: 'Quem o apanha é o espião dela, e tem os punhos bem treinados.', fx: { vida: -2 } } },
        { t: 'Falar com os carroceiros', d: 'Eles sabem quem pagou escolta.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Com uma rodada paga, sai um nome de estalagem e a hora a que os cavalos foram mudados.', fx: {} }, ko: { txt: 'Fica sem resposta, e com a conta da rodada.', fx: { ouro: -2 } } },
        { t: 'Preparar-se primeiro', d: 'Ninguém captura um embaixador de mãos vazias.', ok: { txt: 'Ela paga-lhe um adiantamento, e diz-lhe onde gastá-lo.', fx: { mercado: true } } },
      ] },
    { titulo: 'O Discurso da Praça', terreno: 'cidade',
      texto: 'Na praça de {cidade}, um homem de robes caras promete pão e segurança em nome do Imperador. É Quatur, o embaixador. Quando acaba, os soldados fazem-no desaparecer numa carruagem, e alguém lhe sussurra ao ouvido, atrás de si: "Quem o apanhar, tira cem rebeldes da prisão."',
      fundo: 'A população aplaude com os olhos no chão, porque os soldados contam quem não aplaude. O embaixador leva um livro onde aponta tudo. Depois de cada visita, há sempre alguém na cidade que deixa de aparecer.',
      opcoes: [
        { t: 'Roubar-lhe uma página', d: 'O livro fica aberto na mesa, por um instante.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Na página arrancada está o itinerário, com a próxima paragem sublinhada.', fx: {} }, ko: { txt: 'Um soldado vê-lhe a mão, e não a larga logo.', fx: { vida: -2 } } },
        { t: 'Ler as marcas da carruagem', d: 'Rodas com aros imperiais não enganam.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'O peso e a lama mostram por que porta saiu, e para que estrada.', fx: { xp: 1 } }, ko: { txt: 'Passaram dez carroças em cima das marcas.', fx: {} } },
        { t: 'Aplaudir e perguntar', d: 'Um cidadão entusiasmado pode falar com o secretário.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'O secretário adora ser ouvido, e diz-lhe para onde vão a seguir, sem se dar conta.', fx: {} }, ko: { txt: 'O secretário aponta o seu nome no livro. Paga para que o risque.', fx: { ouro: -2 } } },
        { t: 'Aproveitar a multidão', d: 'Enquanto os soldados vigiam a praça, o mercado está livre.', ok: { txt: 'Os mercadores vendem depressa, antes que venham cobrar a taxa do Imperador.', fx: { mercado: true } } },
      ] },
  ],
  resgate: [
    { titulo: 'A Família Decretada', terreno: 'cidade',
      texto: 'Os soldados afixam o decreto em {cidade}: quem tiver o sangue dos Voranan tem os dias contados. Uma elfa encapuzada agarra-lhe o braço, com a voz a falhar. "Levaram {refem}. Só me resta você. Enquanto respirar, ainda há quem salvar."',
      fundo: 'Os Voranan foram sempre feiticeiros, e muitos serviam o Império como soldados de elite. Bastou um rapaz gritar o nome da família às portas de Abiad para que os matassem a todos. Os boatos dizem que é contra os elfos. Não é. É só para que os outros vejam.',
      opcoes: [
        { t: 'Ler os registos do castelo', d: 'O general pediu as moradas por escrito.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'Há uma lista de casas, e ao lado de uma delas a palavra "vivo", e um destino.', fx: { xp: 1 } }, ko: { txt: 'Só encontra nomes já riscados, e custa-lhe olhar para eles.', fx: {} } },
        { t: 'Seguir as cinzas', d: 'Queimaram a casa há pouco. Alguém fugiu pelo estábulo.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Três cavalos saíram a galope, e as ferraduras apontam para fora da cidade.', fx: {} }, ko: { txt: 'A viga cai perto de mais.', fx: { vida: -2 } } },
        { t: 'Falar com o dono do estábulo', d: 'Ele deve um favor a muita gente.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Fecha a porta, e conta-lhe em voz baixa quem levou quem, e por que portão.', fx: {} }, ko: { txt: 'Tem demasiado medo, e pede-lhe dinheiro para esquecer que o viu.', fx: { ouro: -2 } } },
        { t: 'Reunir o que for preciso', d: 'Há armas escondidas em casas que já não têm dono.', ok: { txt: 'A elfa dá-lhe as chaves de um armazém, e não quer saber o que leva.', fx: { mercado: true } } },
      ] },
    { titulo: 'A Mensagem Azul', terreno: 'cidade',
      texto: 'Um pergaminho entra pela janela de uma estalagem de {cidade}, feito de energia azul, e cai-lhe em cima da mesa antes de se apagar. É um pedido de socorro por magia, de {refem}, para alguém que já não está vivo para o ler. Agora, quem o leu foi você.',
      fundo: 'Só os Voranan fazem voar os recados desta maneira. O pergaminho procura sempre a mão de quem foi amado, e quando não a encontra, vai ter à mão mais próxima. Nenhuma lei obriga a responder. Quase toda a gente queima-o, e fecha a janela.',
      opcoes: [
        { t: 'Ler o resto da magia', d: 'O pergaminho sabe de onde veio.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'O brilho que resta aponta numa direção, e esse é o seu próximo passo.', fx: { xp: 1 } }, ko: { txt: 'O pergaminho arde-lhe nos dedos, e só deixa a queimadura.', fx: { vida: -1 } } },
        { t: 'Correr atrás do rasto azul', d: 'Ainda se vê no ar, por cima dos telhados.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Dos telhados, vê-o sumir na direção de uma estrada.', fx: {} }, ko: { txt: 'As telhas de {cidade} são mais velhas do que parecem.', fx: { vida: -2 } } },
        { t: 'Perguntar quem conhece o nome', d: 'Com muito cuidado.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Um velho chora ao ouvir o nome, e diz-lhe onde o viu pela última vez.', fx: {} }, ko: { txt: 'Toda a sala se cala, e dois homens saem, com pressa.', fx: {} } },
        { t: 'Armar-se antes de sair', d: 'Vai enfrentar soldados de elite.', ok: { txt: 'Sai para o mercado com o pergaminho apagado na bota.', fx: { mercado: true } } },
      ] },
  ],
  exilados: [
    { titulo: 'As Palavras de Montblanc', terreno: 'cidade',
      texto: 'Em {cidade}, uma cópia suja corre de mão em mão: "Alguns sonhos não deveriam se realizar." É o texto do bardo Montblanc, o que o levou de rastos ao Paço Real. No verso, alguém escreveu: "Está em Sangue Sombrio, e não está sozinho. O selo tem quem o desfaça."',
      fundo: 'As palavras do bardo halfling eram das mais respeitadas do reino. Ivan podia tê-lo morto, mas é rancoroso. Mandou-o para a ilha, com os campeões que ainda o enfrentaram, e o selo protege os prisioneiros dos demónios tanto como os demónios dos prisioneiros.',
      opcoes: [
        { t: 'Reconhecer a letra', d: 'Quem copia à mão deixa sempre um hábito.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'É a letra de um escriba que costumava trabalhar noutra terra, e sabe qual.', fx: { xp: 1 } }, ko: { txt: 'Toda a gente copia mal, hoje em dia.', fx: {} } },
        { t: 'Apanhar quem a distribui', d: 'Um rapaz de bolsos cheios.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Quando o alcança, ele jura que só vai buscar as folhas, e diz-lhe aonde.', fx: {} }, ko: { txt: 'Os soldados vêem-no a correr, e não perguntam atrás de quem.', fx: { vida: -2 } } },
        { t: 'Cantar os versos na taberna', d: 'Alguém há de os completar.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Uma voz, lá do fundo, canta a última linha, e depois faz-lhe sinal.', fx: {} }, ko: { txt: 'Alguém lhe atira um copo, e o taberneiro cobra-lho.', fx: { ouro: -2 } } },
        { t: 'Procurar quem venda', d: 'Para ir à ilha, é preciso estar preparado.', ok: { txt: 'Os mercadores começam a baixar a voz, e os preços também.', fx: { mercado: true } } },
      ] },
    { titulo: 'O Prisioneiro que Voltou', terreno: 'cidade',
      texto: 'Um homem nu entra em {cidade} ao amanhecer, com a pele marcada por uma luz vermelha. Era comandante, e foi exilado há anos. Não sabe como saiu. Só repete, a tremer: "Há um portão. Eles ainda estão vivos. Abram o portão."',
      fundo: 'Dizem que dentro de Sangue Sombrio há um portal que liga a terra ao inferno, e que os monstros não conseguem sair da ilha. Ninguém sabe se também é verdade para os homens. Se este voltou, é porque alguém o deixou voltar. O Andarilho que faz isto não costuma ter pena.',
      opcoes: [
        { t: 'Examinar-lhe as marcas', d: 'A magia ainda se lê na pele.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'A marca tem a forma de um anel, e conhece um sítio onde estes anéis são feitos.', fx: { xp: 1 } }, ko: { txt: 'Quando lhe toca, ele grita, e a dor passa para os seus dedos.', fx: { vida: -1 } } },
        { t: 'Refazer o caminho dele', d: 'Os pés descalços deixam marcas fundas.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Segue as marcas até à saída da cidade, e vê para onde ele vinha a olhar.', fx: {} }, ko: { txt: 'A guarda corta-lhe o caminho e dá-lhe uma lição.', fx: { vida: -2 } } },
        { t: 'Fazê-lo falar', d: 'Com muita calma, e com uma manta.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Bebe sopa, e no meio dos nomes dos mortos diz um nome de lugar.', fx: {} }, ko: { txt: 'Ele esconde-se debaixo da mesa, e já não sai de lá.', fx: {} } },
        { t: 'Vestir-se para a viagem', d: 'Lá onde vai, o chão pulsa.', ok: { txt: 'Compra o que pode, com os gritos dele atrás de si.', fx: { mercado: true } } },
      ] },
  ],
  esconderijo: [
    { titulo: 'A Agulha Vermelha', terreno: 'cidade',
      texto: 'Um velho sem sinais de velhice senta-se ao seu lado em {cidade}, e pousa em cima da mesa uma agulha de ponta vermelha. "Feldon não tem proteção, e alguém sabe disso", diz. "Chamam-me o Opositor, o que é uma besteira. Descubra quem falou, e quem vem aí. É tudo o que lhe peço."',
      fundo: 'O Opositor é um nome que anda de boca em boca, e a maior parte das pessoas nunca lhe viu a cara. Ele diz que não é mais do que uma ideia. A caverna de Feldon foi trabalhada há séculos por anões, cheia de caminhos e salas, e guarda centenas de rebeldes que ainda mal sabem pegar numa espada.',
      opcoes: [
        { t: 'Estudar a marca da agulha', d: 'Ele trouxe-a de propósito.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'Há uma linha riscada na ponta, igual às cartas dos batedores, e ela aponta para um lugar.', fx: { xp: 1 } }, ko: { txt: 'Só serve para picar os dedos.', fx: { vida: -1 } } },
        { t: 'Vigiar quem o seguiu', d: 'Se o sabem aqui, alguém o seguiu.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Apanha o espião a escrever. No papel há um destino, e não é Feldon.', fx: {} }, ko: { txt: 'O espião é mais rápido, e leva-lhe a bolsa.', fx: { ouro: -2 } } },
        { t: 'Perguntar aos recém-chegados', d: 'Os que fugiram de Peream viram muita coisa.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Uma família diz-lhe quem andou a fazer perguntas pelo caminho, e para onde foi depois.', fx: {} }, ko: { txt: 'Têm medo de si, e têm razão em ter.', fx: {} } },
        { t: 'Reunir mantimentos', d: 'Os rebeldes vão precisar, e você também.', ok: { txt: 'O velho paga-lhe uma parte, e diz-lhe que não é preciso prestar contas.', fx: { mercado: true } } },
      ] },
    { titulo: 'Os Batedores das Colinas', terreno: 'cidade',
      texto: 'Um batedor rebelde está a morrer no estábulo de {cidade}, com o rosto tingido e uma flecha imperial no ombro. Agarra-se a si. "Sabem de Feldon", diz. "Alguém foi apanhado, e falou. Diga a Simony. Encontre quem os guia, ou não sobra ninguém."',
      fundo: 'Os rebeldes pintam o rosto, cada um à sua maneira, e isso já chegou para muita gente ir parar à forca. Da última vez, alguém foi torturado até dizer o nome do esconderijo, e tiveram de levar centenas para longe em dois dias. Não há outra caverna destas em Daraan.',
      opcoes: [
        { t: 'Olhar para a flecha', d: 'Cada companhia imperial marca as suas.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'A marca é de uma companhia que devia estar longe daqui, e já sabe onde foi vista.', fx: { xp: 1 } }, ko: { txt: 'Uma flecha é uma flecha.', fx: {} } },
        { t: 'Refazer o caminho dele', d: 'Pela lama, e pelo sangue.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Dá com o sítio onde o emboscaram, e com um mapa caído no chão.', fx: {} }, ko: { txt: 'A patrulha ainda ali está, e não gosta de quem olha para o chão.', fx: { vida: -2 } } },
        { t: 'Falar com o estalajadeiro', d: 'Ele deu de beber aos soldados.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Os soldados bebem, e os soldados falam. Diz-lhe o nome do sítio.', fx: {} }, ko: { txt: 'Quer ser pago primeiro, e depois não se lembra.', fx: { ouro: -2 } } },
        { t: 'Ficar com as coisas dele', d: 'Ele já não vai precisar, e pediu-lhe que continuasse.', ok: { txt: 'Fecha-lhe os olhos, e vende o que não consegue levar.', fx: { ouro: 3, mercado: true } } },
      ] },
  ],
  reliquia: [
    { titulo: 'A Sala das Agulhas', terreno: 'cidade',
      texto: 'Um mensageiro leva-o a uma cave de {cidade}. Numa mesa está um mapa de Daraan, cheio de agulhas, e um bilhete do Opositor: há anos que procura {reliquia}, e os homens do Império acabam de passar a procurar também. "Quem encontrar primeiro muda esta guerra. Parta hoje."',
      fundo: 'Ninguém sabe ao certo o que Thiago Raizobak pensa, nem há quanto tempo o faz. Quem lhe pergunta sobre os planos recebe uma pergunta de volta. "A curiosidade leva às descobertas", costuma dizer, "e quanto mais se conhece, menos se é enganado".',
      opcoes: [
        { t: 'Ler as agulhas', d: 'Vermelho, verde, e uma de cor nenhuma.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'A que não tem cor foi mudada há pouco, e deixa um furo no mapa.', fx: { xp: 1 } }, ko: { txt: 'Deita a mesa abaixo, com grande barulho.', fx: {} } },
        { t: 'Seguir o último enviado', d: 'As botas dele ainda estão molhadas.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Apanha-o no cais, a contar as moedas, e ele diz-lhe aonde o mandaram.', fx: {} }, ko: { txt: 'Ele julga que é do Império, e defende-se.', fx: { vida: -2 } } },
        { t: 'Pedir aos velhos', d: 'Os mais velhos lembram-se de ver a relíquia passar.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Uma avó lembra-se do tempo de Aramon, e de quem levou a coisa, e para onde.', fx: {} }, ko: { txt: 'Lembram-se, sobretudo, de quanto você não lhes pagou.', fx: { ouro: -2 } } },
        { t: 'Passar pelo mercado', d: 'A cave tem amigos.', ok: { txt: 'O mensageiro apresenta-o a quem não faz perguntas.', fx: { mercado: true } } },
      ] },
    { titulo: 'O Leilão do Rei Caído', terreno: 'cidade',
      texto: 'Em {cidade}, os novos reis vendem os tesouros dos antigos senhores. O lote seguinte é uma simples caixa, e no catálogo está escrito que leva a {reliquia}. O leiloeiro olha duas vezes para a porta. Antes de abrirem as licitações, a caixa já foi levada por soldados de armadura vermelha.',
      fundo: 'Depois da Guerra da Traição Real, os senhores corruptos passaram a chamar-se reis, e descobriram que governar custa dinheiro. Tudo o que tinha valor em Daraan foi parar a estas salas. Para os que perderam tudo, assistir é uma forma de ainda estar em casa.',
      opcoes: [
        { t: 'Ler o catálogo', d: 'Quem o escreveu sabe mais do que parece.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'Há uma anotação a lápis, com o sítio de onde a caixa veio.', fx: { xp: 1 } }, ko: { txt: 'Um criado tira-lhe o catálogo das mãos, e diz-lhe que custa dinheiro.', fx: { ouro: -2 } } },
        { t: 'Seguir os soldados', d: 'Armaduras daquelas não se movem em silêncio.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Vai atrás deles até à carroça, e lê o destino na ordem de marcha.', fx: {} }, ko: { txt: 'Eles também sabem olhar para trás.', fx: { vida: -2 } } },
        { t: 'Consolar o antigo dono', d: 'Está sentado ao fundo, e ninguém lhe fala.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Fala-lhe da família, e no fim diz-lhe onde o avô escondeu o que importava.', fx: {} }, ko: { txt: 'Não quer saber. Só quer que o deixem em paz.', fx: {} } },
        { t: 'Ficar para os outros lotes', d: 'Com a sala distraída, os preços caem.', ok: { txt: 'Compra o que quer, enquanto toda a gente discute o que aconteceu.', fx: { mercado: true } } },
      ] },
  ],
};

// ---------- Encontros por terreno ----------

const ENCONTROS_DARAAN = [
  { id: 'd_palanque', terreno: 'cidade', titulo: 'A Convocação',
    texto: 'Os soldados imperiais distribuem armas na praça a todos os que julgam maiores de idade. Artesãos, cozinheiros e bibliotecários seguram espadas ao contrário. Um sargento já olha para si, com uma espada a mais na mão.',
    fundo: 'É assim que o Império faz os seus exércitos: quando precisa, tira-os das oficinas. Na guerra de Abiad, isso custou-lhe caro. Os homens que recrutou à força levantaram a mão, um a um, quando alguém do outro lado lhes ofereceu escolha.',
    opcoes: [
      { t: 'Ensinar-lhes a pegar nisso', d: 'Só o Guerreiro. Dez minutos, e ficam menos perigosos para si próprios.', tipo: 'social', req: { cls: 'guerreiro' }, ok: { txt: 'O sargento olha para si com respeito, e não lhe volta a pedir nada. Os homens agradecem-lhe com o que têm.', fx: { ouro: 5, xp: 3, marca: 'recrutas' } } },
      { t: 'É dos nossos', d: 'Requer Recrutado de Abiad. Conhece estas caras.', tipo: 'social', req: { bg: 'recrutado' }, ok: { txt: 'Faz sinal, e metade da fila desaparece pelas vielas antes de o sargento acabar de contar.', fx: { xp: 4, marca: 'recrutas' } } },
      { t: 'Convencer os homens a fugir', d: 'À frente dos soldados, com muita lata.', tipo: 'social', roll: { a: 'carisma', dc: 13 }, ok: { txt: 'Bastam meia dúzia de palavras certas. A fila dissolve-se e, no caos, sai a salvo.', fx: { xp: 3, marca: 'recrutas' } }, ko: { txt: 'O sargento tem bons ouvidos, e um bom bastão.', fx: { vida: -3 } } },
      { t: 'Escapar por entre a multidão', d: 'Antes que lhe ponham a espada na mão.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 10 }, ok: { txt: 'Fica para trás uma manga da sua roupa, e nada mais.', fx: { xp: 1 } }, ko: { txt: 'Dois soldados agarram-no, e perde um dia a marchar antes de conseguir fugir.', fx: { dia: 1, vida: -1 } } },
      { t: 'Subornar o sargento', d: 'Custa 4 de Ouro.', ok: { txt: 'Ele vê a moeda, e deixa de o ver a si.', fx: { ouro: -4 } } },
    ] },
  { id: 'd_taberna', terreno: 'cidade', titulo: 'O Elfo e o Meio-Orc',
    texto: 'Numa taberna, um meio-orc enorme discute com três soldados imperiais, e um elfo magro de robe branca e vermelha tenta, sem sucesso, puxá-lo pela manga. "Crunch não gosta de como vocês falam com Zen!", grita, e a mesa já vai a caminho do tecto.',
    fundo: 'Crunch é o último da sua tribo, e deve a vida a Zhenris Voranan desde criança. Quando perde o controlo, é melhor não estar por perto. Zhenris passa metade do tempo a pedir desculpa por ele, e a outra metade a agradecer-lhe.',
    opcoes: [
      { t: 'Saltar para a confusão', d: 'Do lado deles.', tipo: 'combate', roll: { a: 'forca', dc: 12, pv: 6, ini: 'Os Três Soldados' }, ok: { txt: 'No fim, Crunch abraça-o até as costelas protestarem. "Crunch gosta deste. Este vem connosco!" Zhenris suspira, e encolhe os ombros.', fx: { aliado: 'crunch' } }, ko: { txt: 'Sai pela janela, e não foi por escolha. Crunch ainda lhe acena.', fx: { vida: -3 } } },
      { t: 'Falar a língua dele', d: 'Só Meio-Orcs. Crunch escuta os seus.', tipo: 'social', req: { raca: 'meioorc' }, ok: { txt: 'Duas palavras, e ele para com a mesa no ar. Daí em diante, chama-lhe irmão.', fx: { aliado: 'crunch', xp: 2 } } },
      { t: 'Ajudar o feiticeiro', d: 'Só o Feiticeiro. Ele reconhece-lhe as mãos.', tipo: 'social', req: { cls: 'feiticeiro' }, ok: { txt: 'Uma barreira de fogo, os dois ao mesmo tempo. Zhenris olha para si, a sorrir pela primeira vez em muito tempo.', fx: { aliado: 'zhenris', xp: 2 } } },
      { t: 'Distrair os soldados', d: 'Com um brinde ao Imperador, em voz bem alta.', tipo: 'social', roll: { a: 'carisma', dc: 11 }, ok: { txt: 'Os soldados viram-se para brindar, e os dois somem pela cozinha. O elfo deixa-lhe uma bolsa na mesa.', fx: { ouro: 6, xp: 1 } }, ko: { txt: 'Quem bebe e olha para si é o maior dos três, e não gostou do tom.', fx: { vida: -2 } } },
      { t: 'Beber em paz', d: 'Hoje, não.', ok: { txt: 'Muda de mesa, e o ensopado até está bom.', fx: {} } },
    ] },
  { id: 'd_cidadepere', terreno: 'cidade', titulo: 'As Ruas Verdes',
    texto: 'As plantas crescem entre os ladrilhos, e há casas consumidas por grama e flores. Um druida varre com calma a entrada de uma biblioteca fechada, enquanto um grupo de antigos soldados discute se isto ainda é uma cidade.',
    fundo: 'O Opositor prometeu aos Saybaff devolver-lhes a cidade que era deles. Na biblioteca de Pere estão os pergaminhos mais antigos e os artefatos mais poderosos, e agora só eles lá entram. Nem todos os que ficaram aqui estão de acordo com isso.',
    opcoes: [
      { t: 'Saudar como um deles', d: 'Só o Druida. Ele abre-lhe a porta.', tipo: 'investigacao', req: { cls: 'druida' }, ok: { txt: 'Passa uma tarde entre pergaminhos que já não julgava existirem, e sai a saber muito mais do que entrou.', fx: { xp: 6, vida: 2 } } },
      { t: 'Reconhecer as armadilhas', d: 'Requer Sentinela de Peream. Foi você quem as montou.', tipo: 'habilidade', req: { bg: 'sentinela' }, ok: { txt: 'Sabe onde ainda há depósitos de armas, e por onde passar. Ninguém os reclama.', fx: { ouro: 7, item: 'varinha' } } },
      { t: 'Mediar a discussão', d: 'Entre o druida e os soldados.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Ninguém fica contente, o que é um bom acordo. Agradecem-lhe, e um rapaz alto de espada larga junta-se a si.', fx: { aliado: 'aaron', xp: 2 } }, ko: { txt: 'Passam a estar de acordo em não gostar de si.', fx: { vida: -2 } } },
      { t: 'Ver o que se vende', d: 'Ainda há quem precise de comer.', ok: { txt: 'Os que partem vendem tudo, e barato.', fx: { mercado: true } } },
    ] },
  { id: 'd_regente', terreno: 'cidade', titulo: 'A Sala do Regente',
    texto: 'Um elfo de ar cansado recebe-o entre pinturas de família, com soldados imperiais à porta. "Não posso fazer muito", diz, em voz baixa. "Mas o que estiver ao meu alcance, faço-o sem hesitar. Diga-me o que precisa, e diga-o depressa."',
    fundo: 'Há muitos regentes como Darién Brilho da Lua: homens e elfos que ficaram nos seus postos para proteger o que ainda há. Assinam o que lhes mandam, e salvam quem conseguem. Toda a gente lhes chama traidores, até ao dia em que precisam de um favor.',
    opcoes: [
      { t: 'Pedir um salvo-conduto', d: 'Só Elfos. Ele confia nos seus.', tipo: 'social', req: { raca: 'elfo' }, ok: { txt: 'Assina-o sem o ler, e no fim da semana pede para ir consigo. "Já não me deixam ser regente."', fx: { aliado: 'darien', xp: 2 } } },
      { t: 'Convencê-lo a ajudar', d: 'Olhos nos olhos.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Abre um cofre, e vira a cara. Quando volta a olhar, você já lá não está, nem o que estava no cofre.', fx: { ouro: 8, xp: 2 } }, ko: { txt: 'Não pode, e diz-lho de modo a que os guardas ouçam. Sai depressa.', fx: { vida: -2 } } },
      { t: 'Ler os registos do castelo', d: 'Enquanto ele distrai os guardas.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'Aponta na cabeça as ordens e os nomes. Saber custa menos do que comprar.', fx: { xp: 5 } }, ko: { txt: 'Um guarda vem à sala cedo de mais.', fx: { vida: -2 } } },
      { t: 'Agradecer e sair', d: 'Ele já se arrisca muito.', ok: { txt: 'Ele acena com a cabeça. Na manga do casaco, descobre mais tarde um frasco.', fx: { item: 'pocao' } } },
    ] },
  { id: 'd_pedra', terreno: 'floresta', titulo: 'A Terceira Árvore',
    texto: 'Ouvem-se passos furtivos em cima dos galhos. Um goblin de olhos vermelhos espreita lá de cima, a terceira árvore ao lado do arbusto, e já tira da algibeira uma pedra que emana uma luz branca.',
    fundo: 'Os goblins são muito territoriais, e talentosos com emboscadas. A pedra energizada serve para chamar os companheiros, e faz um barulho que deixa um homem surdo durante um bom bocado. Quem a impedir de bater no chão tem bastante sorte.',
    opcoes: [
      { t: 'Atirar a adaga', d: 'Antes que ele a agite.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'O goblin cai com um gemido, e apanha a pedra no ar, antes de bater no chão.', fx: { item: 'pedra', xp: 2 } }, ko: { txt: 'A pedra cai. O barulho deixa-o a andar às voltas, e os companheiros dele chegam.', fx: { vida: -3 } } },
      { t: 'Mirar na terceira árvore', d: 'Requer Sentinela de Peream.', tipo: 'combate', req: { bg: 'sentinela' }, ok: { txt: 'Já tinha percebido onde estava. Um único gesto, e fica com a pedra, a bolsa e um belo silêncio.', fx: { item: 'pedra', ouro: 5 } } },
      { t: 'Barreira de fogo no chão', d: 'Só o Feiticeiro. Eles têm medo das chamas.', tipo: 'combate', req: { cls: 'feiticeiro' }, ok: { txt: '"Lach!" O fogo sobe entre si e eles, e alguns até largam as azagaias a fugir.', fx: { ouro: 6, xp: 2 } } },
      { t: 'Lutar contra o bando', d: 'Eles vêm a gritar.', tipo: 'combate', roll: { a: 'forca', dc: 11, pv: 6, ini: 'Os Goblins da Azagaia' }, ok: { txt: 'Quem pode foge. Fica-lhe um monte de azagaias sujas, e o que traziam roubado.', fx: { ouro: 6 } }, ko: { txt: 'As azagaias voam de todo o lado.', fx: { vida: -4 } } },
      { t: 'Correr até à ladeira', d: 'Tapar os ouvidos, e correr.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 9 }, ok: { txt: 'Escorrega pela ladeira de erva, e só para na planície, a rir de nervos.', fx: {} }, ko: { txt: 'Uma azagaia acerta-lhe a meio da corrida.', fx: { vida: -2 } } },
    ] },
  { id: 'd_saybaff', terreno: 'floresta', titulo: 'Os Guardiões',
    texto: 'Os lobos saem do mato sem rosnar, e sentam-se em círculo à sua volta. Um falcão pousa num ramo baixo. Uma voz vem de lado nenhum: "Quantas árvores cortou para aqui chegar, viajante? Pense bem na resposta."',
    fundo: 'Os humanos chamam-lhes druidas, e os elfos chamam-lhes Saybaff. Tiram a energia da natureza, e devem respeitá-la para extrair a força de Obad-hai. Foram eles que ajudaram os rebeldes a entrar em Peream, porque o Opositor lhes prometeu aquilo que nenhum rei prometeu.',
    opcoes: [
      { t: 'Responder em élfico', d: 'Só Elfos. Eles reconhecem a pronúncia.', tipo: 'social', req: { raca: 'elfo' }, ok: { txt: 'Os lobos levantam-se e abrem caminho, e por ali chega um dia mais cedo.', fx: { dia: -1, vida: 3 } } },
      { t: 'Ler os sinais', d: 'Só o Patrulheiro. Os lobos estão a apontar para algum lado.', tipo: 'investigacao', req: { cls: 'patrulheiro' }, ok: { txt: 'Percebe que o estão a guiar para fora de uma armadilha, e agradece. Deixam-lhe frutos e raízes que valem bem.', fx: { ouro: 6, xp: 3, marca: 'druidas' } } },
      { t: 'Dizer a verdade', d: 'Não mentir à floresta.', tipo: 'social', roll: { a: 'carisma', dc: 11 }, ok: { txt: 'A voz ri-se. O círculo abre, e parte com uma raiz que lhe sara as feridas, e com um pedido: não se esqueça.', fx: { vida: 5, xp: 2, marca: 'druidas' } }, ko: { txt: 'A floresta não gostou. As raízes prendem-lhe o pé, e custa-lhe sair.', fx: { vida: -3 } } },
      { t: 'Abrir caminho', d: 'São lobos. Só lobos.', tipo: 'combate', roll: { a: 'forca', dc: 13, pv: 7, ini: 'Os Lobos de Pere' }, ok: { txt: 'Passa, e ninguém vem atrás. A floresta fica em silêncio, e isso custa mais do que os dentes.', fx: { xp: 2, ouro: 3 } }, ko: { txt: 'Eram mais do que parecia.', fx: { vida: -4 } } },
    ] },
  { id: 'd_pantera', terreno: 'floresta', titulo: 'A Caixa que se Mexe',
    texto: 'Dois goblins em javalis puxam uma carroça, com uma caixa de madeira que se mexe sozinha. "Agora divirtam-se com o nosso animal de estimação!", gritam, a arrebentar a fechadura. Uma silhueta negra sai tão depressa que não se percebe para onde foi.',
    fundo: 'A pantera deslocadora é uma besta mágica invocada por xamãs goblins: seis patas, dois tentáculos com farpas e um corpo que nunca está onde o vê. Um grupo de aventureiros perdeu um bom amigo às mãos de uma destas, numa estrada de Abiad. Ainda há quem cante essa história.',
    opcoes: [
      { t: 'Ouvir, em vez de olhar', d: 'Só o Monge. Os olhos, aqui, só atrapalham.', tipo: 'combate', req: { cls: 'monge' }, ok: { txt: 'Fecha os olhos, e o golpe encontra-a em pleno salto. Os goblins fogem, e deixam a carroça.', fx: { ouro: 9, xp: 3 } } },
      { t: 'Enfrentar a pantera', d: 'É muito rápida. E há de cansar-se.', tipo: 'combate', roll: { a: 'forca', dc: 14, pv: 9, ini: 'A Pantera Deslocadora' }, ok: { txt: 'A besta cai de lado, por fim sem se mexer. A pele vale muito, e ninguém vai acreditar em si.', fx: { ouro: 12, xp: 2 } }, ko: { txt: 'As farpas arrancam-lhe a pele das costas. Foge, e ela nem se dá ao trabalho de o seguir.', fx: { vida: -6 } } },
      { t: 'Prendê-la outra vez', d: 'A caixa ainda está inteira.', tipo: 'investigacao', roll: { a: 'mente', dc: 13 }, ok: { txt: 'Percebe o padrão dos saltos, e larga a isca no sítio certo. A tampa fecha, e tem uma besta para vender.', fx: { ouro: 10, xp: 2 } }, ko: { txt: 'Quem acaba debaixo dela é você.', fx: { vida: -5 } } },
      { t: 'Fugir para a carruagem', d: 'Entre as rodas, ela não salta.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Fica ali, sem respirar, até os goblins a chamarem de volta.', fx: {} }, ko: { txt: 'Quase conseguiu.', fx: { vida: -3 } } },
    ] },
  { id: 'd_caravana', terreno: 'estrada', titulo: 'As Caravanas em Chamas',
    texto: 'Uma mulher corre para si aos gritos. Mais à frente há quatro carruagens: a primeira em chamas, duas destruídas, e a última ainda inteira. Goblins rodeiam soldados feridos, e no chão há viajantes caídos e um estandarte imperial pisado.',
    fundo: 'As Rotas Comerciais alimentaram Daraan durante séculos. Desde que os soldados passaram a guardar só as caravanas dos novos reis, as outras passam por sua conta e risco. Os goblins aprenderam a contar as escoltas, e estão a ficar muito bons nisso.',
    opcoes: [
      { t: 'Investir contra os goblins', d: 'Com tudo.', tipo: 'combate', roll: { a: 'forca', dc: 11, pv: 6, ini: 'Os Goblins da Estrada' }, ok: { txt: 'Eles fogem para o mato. A mulher agradece-lhe, e os sobreviventes pagam como podem.', fx: { ouro: 7, marca: 'caravana' } }, ko: { txt: 'A multidão de goblins dá-lhe mais trabalho do que parecia.', fx: { vida: -4 } } },
      { t: 'Tratar dos feridos', d: 'Só o Clérigo. Pelor ouve quem se ajoelha na lama.', tipo: 'social', req: { cls: 'clerigo' }, ok: { txt: 'Põe de pé quem podia morrer, e os goblins desistem ao ver a luz. Pagam-lhe em ouro e em gratidão.', fx: { ouro: 6, vida: 2, marca: 'caravana' } } },
      { t: 'Revistar a carruagem intacta', d: 'Enquanto ninguém olha.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Atrás de um fundo falso há uma bolsa com selos imperiais, e uma carta que nunca há de chegar ao destino.', fx: { ouro: 9, xp: 1 } }, ko: { txt: 'Lá dentro havia alguém armado, e muito assustado.', fx: { vida: -3 } } },
      { t: 'Ajudar e ver o que vendem', d: 'Salvar a carga dos mercadores.', ok: { txt: 'Apaga as chamas com areia. Os mercadores abrem o que sobrou, a preços de quem está a recomeçar.', fx: { mercado: true } } },
      { t: 'Passar à larga', d: 'Isto cheira a emboscada.', ok: { txt: 'Dá a volta pelos campos. Atrás de si, os gritos vão parando.', fx: {} } },
    ] },
  { id: 'd_posto', terreno: 'estrada', titulo: 'O Posto Imperial',
    texto: 'Uma barreira corta a estrada, com a bandeira preta e vermelha no alto. Os soldados revistam as carroças, e levantam o queixo a toda a gente, à procura de tintura no rosto. "Nome, e terra de origem!", grita um deles, sem olhar para si.',
    fundo: 'A primeira coisa que o Império fez foi pedir o nome às pessoas. Um rapaz gritou o seu às portas de Abiad, e isso custou-lhe uma família inteira. Hoje, em Daraan, há quem tenha mais nomes do que sapatos.',
    opcoes: [
      { t: 'Vestir a cara de elfo sombrio', d: 'Só Elfos Sombrios. Eles nem levantam os olhos.', tipo: 'social', req: { raca: 'elfosombrio' }, ok: { txt: 'O soldado engole em seco e abre caminho. Ainda se oferece para lhe dar de comer.', fx: { ouro: 3, xp: 3 } } },
      { t: 'Dar um nome falso', d: 'Com convicção.', tipo: 'social', roll: { a: 'carisma', dc: 11 }, ok: { txt: 'O soldado aponta-o no livro, com muita atenção. Parte a rir por dentro.', fx: { xp: 2 } }, ko: { txt: 'O sargento conhecia a pessoa que diz ser. Paga para sair dali.', fx: { ouro: -3, vida: -1 } } },
      { t: 'Dar a volta pelos campos', d: 'Perde um dia, mas ninguém lhe pede nada.', ok: { txt: 'Os lavradores de Abiad nem olham para si. Por aqui, ninguém gosta muito de barreiras.', fx: { dia: 1, xp: 1 } } },
      { t: 'Saltar a barreira à noite', d: 'Por entre as tochas.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Passa, e ainda leva a bolsa do cabo da guarda.', fx: { ouro: 5 } }, ko: { txt: 'A flecha vem de muito longe, e acerta.', fx: { vida: -4 } } },
      { t: 'Lutar', d: 'Já chega de pedir licença.', tipo: 'combate', roll: { a: 'forca', dc: 13, pv: 7, ini: 'Os Soldados Imperiais' }, ok: { txt: 'A bandeira cai. Os lavradores da zona olham para si, e não dizem nada, de uma maneira muito simpática.', fx: { ouro: 7, xp: 1 } }, ko: { txt: 'Espadas de duas mãos não são para brincadeiras.', fx: { vida: -5 } } },
    ] },
  { id: 'd_planalto', terreno: 'estrada', titulo: 'O Planalto Sem Nome',
    texto: 'A planície estende-se até onde a vista alcança, e o vento nunca se cala. Dois elfos a cavalo observam-no há muito tempo de cima de uma colina. Não trazem brasão nenhum, e nenhum deles faz o mínimo gesto.',
    fundo: "M'hari permanece desconhecida para o povo do continente, e os elfos de lá preferem assim. Vivem simples e demoram muito a responder. Quando o Império lhes mandou um embaixador, pediram-lhe que voltasse daí a cem anos.",
    opcoes: [
      { t: 'Esperar por eles', d: 'Sem pressa.', ok: { txt: 'Passam-se horas. Por fim, um deles desce, deixa uma bolsa de ervas na sua mão, e volta a subir.', fx: { vida: 4, dia: 1, xp: 1 } } },
      { t: 'Cumprimentar à maneira deles', d: 'Só Elfos.', tipo: 'social', req: { raca: 'elfo' }, ok: { txt: 'Sorriem, o que é raro, e mostram-lhe o trilho que atravessa o planalto em metade do tempo.', fx: { dia: -1, xp: 3 } } },
      { t: 'Ler o terreno', d: 'Eles conhecem as fontes, e as fontes conhecem-nos.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'Encontra um poço e um esconderijo de viajantes, e não mexe em nada que não possa repor.', fx: { ouro: 5, xp: 2 } }, ko: { txt: 'Perde o caminho, e a água que tinha.', fx: { vida: -2 } } },
      { t: 'Seguir viagem', d: 'Com os olhos deles nas costas.', ok: { txt: 'Quando olha para trás, já não há ninguém.', fx: {} } },
    ] },
  { id: 'd_ratti', terreno: 'montanha', titulo: 'O Rei Fugitivo',
    texto: 'Entre as pedras das Montanhas Dentadas, um homem de roupa rica e pés a sangrar pede-lhe água, sem conseguir parar de olhar para o céu. Traz uma coroa dentro de um saco. "Dou-lhe tudo", diz. "Foi só um mal-entendido. Eles estão a chegar."',
    fundo: 'Caik Bak trocou o trono de Protetor do Reino pelo de marionete, e os equipamentos de Peream por ouro e fama. Quando os rebeldes chegaram, deixou a cidade defender-se sozinha. Os Andarilhos Fantasmas raramente dão segundas oportunidades.',
    opcoes: [
      { t: 'Levar-lhe a coroa', d: 'Ele já não vai precisar dela.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Sai dali com a coroa, sem olhar para trás. Ninguém compra uma coisa destas, mas pagam muito por ela.', fx: { ouro: 12 } }, ko: { txt: 'Ele morde. Os reis, afinal, também mordem.', fx: { vida: -2, ouro: 3 } } },
      { t: 'Ouvir o que ele sabe', d: 'Um homem assustado fala muito.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, ok: { txt: 'Fala do Paço, das rotas, e de quem paga a quem. Vale mais do que a coroa.', fx: { xp: 6 } }, ko: { txt: 'Só repete o mesmo nome, e chora.', fx: {} } },
      { t: 'Dizer-lhe a verdade', d: 'Só Bardos. Alguém há de contar esta história.', tipo: 'social', req: { cls: 'bardo' }, ok: { txt: 'Ele ouve em silêncio a canção que lhe vão fazer. Depois, dá-lhe o anel, para que a acabe bem.', fx: { item: 'anel', xp: 3 } } },
      { t: 'Dar-lhe a água, e seguir', d: 'E não ficar por aqui.', ok: { txt: 'Ele bebe, e agradece-lhe como um rei. Mais acima, já não se ouve nada.', fx: { xp: 1 } } },
    ] },
  { id: 'd_monasterio', terreno: 'montanha', titulo: 'O Monastério de Heironeus',
    texto: 'Lá em cima, sobre o desfiladeiro, ouvem-se gritos ritmados. Dezenas de noviços batem nas mãos contra sacos de areia, e um mestre muito velho faz sinal para que você suba. "Os que chegam aqui sem ser chamados costumam precisar de algo. O quê?"',
    fundo: 'Heironeus é o deus do heroísmo, e o seu monastério ensina a lutar de mãos vazias a quem não tem mais nada. Foi aqui que um rapaz adotado pelo Opositor aprendeu, antes de perder a vista num combate contra um dos Andarilhos.',
    opcoes: [
      { t: 'Treinar com os noviços', d: 'Um dia a levar pancada. Vale a pena.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Perde o dia, mas ganha uma nova forma de cair. O mestre diz-lhe que tem bons pés, e ri-se.', fx: { dia: 1, xp: 6 } }, ko: { txt: 'Um noviço de dez anos deita-o ao chão. Várias vezes.', fx: { dia: 1, vida: -2, xp: 2 } } },
      { t: 'Saudar como antigo aluno', d: 'Só o Monge.', tipo: 'social', req: { cls: 'monge' }, ok: { txt: 'Dão-lhe de comer, deitam-lhe água nas feridas, e um monge cego decide acompanhá-lo por uns tempos.', fx: { aliado: 'geyser', vida: 4 } } },
      { t: 'Pedir bênção', d: 'Só o Clérigo.', tipo: 'social', req: { cls: 'clerigo' }, ok: { txt: 'O velho põe-lhe a mão na testa. Sente-se mais leve, e as dores vão-se embora.', fx: { vida: 6, xp: 2 } } },
      { t: 'Ouvir o velho', d: 'Sentar-se, e não dizer nada.', ok: { txt: 'Passam uma hora em silêncio. No fim, ele diz: "Boa conversa." Curiosamente, foi.', fx: { xp: 2, vida: 2 } } },
    ] },
  { id: 'd_tinturas', terreno: 'pantano', titulo: 'Os Rostos Pintados',
    texto: 'As tochas apagam-se à sua volta. Vultos de roupa simples saem de trás das pedras e dos troncos, com o rosto pintado, cada um à sua maneira. Uma mulher de tranças aponta-lhe uma espada longa, e na outra mão traz uma adaga. "Pelo Opositor", diz. "E você, é por quem?"',
    fundo: 'Os soldados imperiais nunca passaram pelo Pântano Sombrio, o que deu aos rebeldes muitos anos de paz. Simony Lumiel é a última da sua família, filha do antigo rei da capital. Luta no estilo lua crescente, e diz que não guarda rancor. Quem a conhece não aposta nisso.',
    opcoes: [
      { t: 'Mostrar as suas tinturas', d: 'Requer Rebelde do Opositor.', tipo: 'social', req: { bg: 'rebelde' }, ok: { txt: 'Ela baixa a lâmina, e abre um sorriso que quase ninguém viu. "Precisava de alguém como você."', fx: { aliado: 'simony', xp: 2 } } },
      { t: 'Levantar a mão com os outros', d: 'Dizer que é pela liberdade, e dizê-lo a sério.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Ela olha para si durante muito tempo, e dá-lhe uma varinha. "Para quando for preciso subir."', fx: { item: 'varinha', xp: 2, marca: 'rebeldes' } }, ko: { txt: 'Ela não acredita. Deixa-o ir, mas sem as botas e a bolsa.', fx: { ouro: -3, vida: -1 } } },
      { t: 'Duelo de lâminas', d: 'É a única língua que ela respeita.', tipo: 'combate', roll: { a: 'agilidade', dc: 14, pv: 8, ini: 'Simony Lumiel' }, ok: { txt: 'Está com a lâmina na garganta dela, e ela está a rir. "Vivo. É o que conta." Junta-se a si, por uns tempos.', fx: { aliado: 'simony' } }, ko: { txt: 'A diferença de tamanho entre as lâminas apanha-o desprevenido. Fica estendido na lama, e ela nem lhe tira nada.', fx: { vida: -5 } } },
      { t: 'Desaparecer no lodo', d: 'Eles estão em casa, mas você é rápido.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Fica com lama até às orelhas, mas sem furos.', fx: {} }, ko: { txt: 'Quase conseguiu, e uma flecha fica-lhe no ombro.', fx: { vida: -3 } } },
    ] },
  { id: 'd_caverna', terreno: 'pantano', titulo: 'O Esconderijo Abandonado',
    texto: 'Na encosta de uma gruta enorme, ainda há fogueiras por apagar, cabanas vazias e um muro de pedra onde alguém treinou muitas vezes. Saíram com pressa, há poucos dias. Algures, muito perto, ouve-se um soldado a chamar outro.',
    fundo: 'Quando Alura, irmã de Simony, foi capturada, o segredo do esconderijo morreu com ela, mas não foi o bastante. Partiram centenas de rebeldes em menos de dois dias. Ficou tudo o que era pesado, e que os soldados ainda não tiveram tempo de roubar.',
    opcoes: [
      { t: 'Revistar as cabanas', d: 'Ainda há tempo.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Uma bolsa, duas poções e um mapa rasgado. Sai antes de eles chegarem.', fx: { ouro: 5, item: 'pocao' } }, ko: { txt: 'Sai depois de eles chegarem.', fx: { vida: -3, ouro: 2 } } },
      { t: 'Ler o que ficou no chão', d: 'O desenho do treino diz muita coisa.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'Quem ensinou aqui sabia muito. Copia os gestos no diário, e sai com mais do que veio buscar.', fx: { xp: 5 } }, ko: { txt: 'São só riscos, e pisou uma armadilha velha.', fx: { vida: -2 } } },
      { t: 'Atrasar os soldados', d: 'Fazer cair a entrada.', tipo: 'combate', roll: { a: 'forca', dc: 12, pv: 6, ini: 'A Patrulha do Pântano' }, ok: { txt: 'A patrulha foge, sem saber quantos eram. Os rebeldes ganham mais um dia, sem saberem que foi você.', fx: { xp: 2, ouro: 4, marca: 'rebeldes' } }, ko: { txt: 'A pedra caiu ao lado de quem não devia.', fx: { vida: -4 } } },
      { t: 'Sair em silêncio', d: 'Nada aqui é seu.', ok: { txt: 'Apaga uma fogueira com o pé, por respeito, e segue.', fx: {} } },
    ] },
  { id: 'd_vitrais', terreno: 'ruina', titulo: 'Os Vitrais de Farlagg',
    texto: 'A grande porta de madeira negra range ao abrir. Os raios de sol iluminam um altar ao fundo e vitrais de anjos e paisagens, e há marcas de queimadura no chão. Em cima do altar alguém deixou três moedas, com um bilhete: "Para quem ainda viaja."',
    fundo: 'Farlagg é o deus da viagem, e os seus templos foram construídos nos caminhos mais altos. Ninguém os dobra, ninguém os vigia. É costume deixar qualquer coisa a quem passar, e levar o que for preciso, sem dizer nada a ninguém.',
    opcoes: [
      { t: 'Levar as moedas, e deixar uma', d: 'À maneira de quem viaja.', ok: { txt: 'Fica mais leve, sem saber bem porquê. Quando sai, a estrada parece mais curta.', fx: { ouro: 2, vida: 3 } } },
      { t: 'Consultar os vitrais', d: 'Só o Clérigo sabe ler estas rotas.', tipo: 'investigacao', req: { cls: 'clerigo' }, ok: { txt: 'Os vitrais são um mapa, e mostram-lhe um trilho que poupa um dia inteiro.', fx: { dia: -1, xp: 3 } } },
      { t: 'Procurar por baixo do altar', d: 'Há uma laje solta.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 }, ok: { txt: 'Lá dentro há uma espada dobrada a jeito, e um pano limpo em volta dela.', fx: { item: 'larga', xp: 1 } }, ko: { txt: 'A laje era de sustentar o altar. Por pouco, não fica por baixo.', fx: { vida: -3 } } },
      { t: 'Levar tudo', d: 'Deus nenhum vigia isto.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 9 }, ok: { txt: 'Sai com a bolsa mais pesada e com a impressão de ter sido visto.', fx: { ouro: 8, marca: 'farlagg' } }, ko: { txt: 'A porta negra fecha-se com força em cima da sua mão.', fx: { vida: -3 } } },
    ] },
  { id: 'd_anoes', terreno: 'ruina', titulo: 'Debaixo do Céu',
    texto: 'A galeria de pedra foi trabalhada há séculos, com salas perfeitas e um tecto baixo que quase toca na sua cabeça. Numa parede lê-se, em letras de anão: "Por aqui, não se cai." Mais à frente há um corredor que dá para o exterior, e lá ninguém entrou.',
    fundo: 'Os anões preferem habitar em locais com teto, por causa de uma antiga lenda que diz que se pode cair no céu. Ninguém se ri disto à frente deles. Deixaram a região há muito tempo, e ainda há quem procure o que ficou para trás.',
    opcoes: [
      { t: 'Encontrar o mecanismo', d: 'Só Anões. A pedra conta.', tipo: 'investigacao', req: { raca: 'anao' }, ok: { txt: 'Uma pressão na parede, e abre-se uma sala que não aparece em mapa nenhum. Lá dentro, uma cota de malha que ainda brilha.', fx: { item: 'cota', xp: 2 } } },
      { t: 'Atravessar o corredor aberto', d: 'A saída fica já ali.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Lá em baixo, há um armazém esquecido com moedas de muitos reis.', fx: { ouro: 9 } }, ko: { txt: 'Afinal, cai-se. Não no céu, mas cai-se.', fx: { vida: -4 } } },
      { t: 'Decifrar as letras', d: 'Há mais escrita debaixo do pó.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, ok: { txt: 'É uma lista de contas por pagar, e dá-lhe grande prazer lê-la até ao fim.', fx: { xp: 5 } }, ko: { txt: 'Só fica com pó nos pulmões.', fx: { vida: -1 } } },
      { t: 'Voltar para trás', d: 'Debaixo de um tecto destes, não se está mal. Mas há pressa.', ok: { txt: 'Dorme uma hora a sério, como já não fazia há muito.', fx: { vida: 2 } } },
    ] },
  { id: 'd_salao', terreno: 'ruina', titulo: 'O Salão dos Reis Caídos',
    texto: 'Atrás de uma parede derrubada, estende-se uma longa fila de nichos, cada um com uma coroa e, em cada coroa, uma placa. O último nicho foi limpo há pouco tempo. Tem um pedestal novo, e ainda está vazio. Tem também um nome que devia reconhecer.',
    fundo: 'Na Guerra das Coroas, Ivan guardou os que caíram. Foi o que primeiro chamou a atenção dos mais velhos: que um conquistador recente tivesse tanto cuidado com a memória. Dizem que é rancoroso, e que tem problemas em esquecer as coisas.',
    opcoes: [
      { t: 'Roubar as coroas', d: 'A quem é que elas fazem falta?', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Duas cabem no saco. Valem muito ouro, e custam bastante sono.', fx: { ouro: 12 } }, ko: { txt: 'O peso dispara qualquer coisa, e o chão morde.', fx: { vida: -4 } } },
      { t: 'Ler as placas', d: 'Cada uma conta como acabou.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'A mesma letra em todas, e cada uma com um erro de quem as viu de perto. Sabe agora como pensam os Andarilhos.', fx: { xp: 5, marca: 'salao' } }, ko: { txt: 'Quanto mais lê, mais lhe custa respirar aqui.', fx: { vida: -2 } } },
      { t: 'Prestar-lhes homenagem', d: 'Nobre Caído. Conhece alguns destes nomes.', tipo: 'social', req: { bg: 'nobre' }, ok: { txt: 'Ajoelha-se, e diz o nome de cada um. Atrás de uma placa solta, alguém deixou há muito tempo um cofre.', fx: { ouro: 9, xp: 2 } } },
      { t: 'Sair daqui', d: 'Não vá o último nicho ser para si.', ok: { txt: 'Sai de costas, e fecha a parede como pode.', fx: {} } },
    ] },
  { id: 'd_velas', terreno: 'costa', titulo: 'As Velas Negras',
    texto: 'Do farol, avistam-se barcos de madeira negra como a noite, quase invisíveis na chuva. A guarda de prontidão ri-se, à espera de piratas. O velho faroleiro é o único que não ri. "São os mesmos", diz. "Da última vez, também eram só piratas, até serem um exército."',
    fundo: 'Há muitos anos, em uma madrugada como esta, centenas de barcos chegaram a Tocairn e cruzaram a fenda de Narmer. Tudo acabou tão depressa que parecia mentira. Desde então, os faroleiros estão proibidos de dar alarme sem ordem por escrito.',
    opcoes: [
      { t: 'Ajudar a dar o alarme', d: 'Mesmo sem ordem.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Ouvem-no a tempo, e a cidade fecha as portas. Quem o ouviu não se esquece de si, nem lhe cobra o jantar.', fx: { ouro: 6, xp: 3 } }, ko: { txt: 'Multa por perturbação da ordem, com uns tabefes.', fx: { ouro: -3, vida: -1 } } },
      { t: 'Ler as marés', d: 'Requer Marinheiro. Esses barcos pesam de mais.', tipo: 'investigacao', req: { bg: 'marinheiro' }, ok: { txt: 'Traziam ouro, e não soldados. Passa a saber para onde vai o tributo, e fica com uma parte.', fx: { ouro: 9, xp: 2 } } },
      { t: 'Espiar o desembarque', d: 'Das rochas.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Fica a saber quantos são, e ninguém sabe nada de si. Tira-lhes ainda uma caixa.', fx: { xp: 3, ouro: 4 } }, ko: { txt: 'As rochas estão molhadas, e o mar, muito perto.', fx: { vida: -3 } } },
      { t: 'Ir embora', d: 'Não é a sua guerra. Ainda.', ok: { txt: 'Atrás de si, o farol apaga-se.', fx: {} } },
    ] },
  { id: 'd_selo', terreno: 'costa', titulo: 'O Chão Pulsa',
    texto: 'A areia emana cores diferentes a cada passo seu, e a maré traz pedaços de algo com escamas. Mais adiante, um barco de contrabandistas espera, e o dono quer saber se você vem ou se vai. Coisas com asas rondam, lá ao longe, sobre a ilha.',
    fundo: 'Sangue Sombrio foi amaldiçoada pelos deuses, e Ivan escolheu-a para os que não podem ser presos em sítios comuns. Os contrabandistas levam comida a troco de moedas, e nunca saem do barco. Quase ninguém pergunta o que come uma ilha assim.',
    opcoes: [
      { t: 'Negociar com os contrabandistas', d: 'Toda a gente em Daraan tem um preço.', tipo: 'social', roll: { a: 'carisma', dc: 11 }, ok: { txt: 'Vendem-lhe o que têm, e deixam-no ver o carregamento de que falam tão pouco.', fx: { xp: 2, mercado: true } }, ko: { txt: 'Riem-se, e ficam com o seu dinheiro.', fx: { ouro: -3 } } },
      { t: 'Lutar contra o que sai da água', d: 'Vem com muitos dentes.', tipo: 'combate', roll: { a: 'forca', dc: 14, pv: 8, ini: 'O Demónio da Areia' }, ok: { txt: 'Os contrabandistas, de longe, gritam de contentes. Atiram-lhe uma bolsa.', fx: { ouro: 10, xp: 2 } }, ko: { txt: 'Não era para ter vindo aqui.', fx: { vida: -5 } } },
      { t: 'Afastar o mal', d: 'Só o Clérigo. Não é assim tão difícil, ao que parece.', tipo: 'social', req: { cls: 'clerigo' }, ok: { txt: 'A cor foge-lhe dos pés, e os bichos voltam para a água. Os homens do barco benzem-se, e pagam-lhe sem que lhes peça.', fx: { ouro: 7, vida: 2, xp: 2 } } },
      { t: 'Sair da praia', d: 'Com muita calma, e sem correr.', tipo: 'habilidade', roll: { a: 'mente', dc: 9 }, ok: { txt: 'Lembra-se de andar devagar, e a areia acalma.', fx: {} }, ko: { txt: 'Correr foi um erro.', fx: { vida: -3 } } },
    ] },
];

const CONSEQUENCIAS_DARAAN = [
  { id: 'volta_recrutas', marca: 'recrutas', titulo: 'Os da Fila',
    texto: 'Quatro homens saem do mato, com as mesmas caras de há uns dias, mas agora com as espadas do lado certo. Um deles era cozinheiro. "Devemos-lhe a pele", diz. "Trouxemos o que conseguimos."',
    fundo: 'Os que escaparam da convocação foram a primeira grande vitória da Oposição, e nem sequer sabem. Em poucos meses, serão a maior parte do exército dela.',
    opcoes: [
      { t: 'Aceitar o que trazem', d: 'Pão, ouro e notícias.', ok: { txt: 'Deixam-lhe o que têm, e ainda lhe dizem por onde não deve passar.', fx: { ouro: 6, vida: 2, xp: 2 } } },
      { t: 'Mandá-los para Feldon', d: 'Ali precisam mais deles.', ok: { txt: 'Partem de cabeça erguida. Bem mais tarde, ouve dizer que levaram consigo uma aldeia inteira.', fx: { xp: 5 } } },
    ] },
  { id: 'volta_caravana', marca: 'caravana', titulo: 'A Mulher da Estrada',
    texto: 'Uma carroça para ao seu lado, e reconhece a mulher que gritava na estrada. Está diferente, e já não chora. "Trabalhava para o embaixador, e agora trabalho para quem me salvou", diz. "Tenho uns papéis que lhe podem interessar."',
    fundo: 'Nas casas dos nobres, quem limpa as mesas lê muita coisa. Quatur nunca aprendeu a olhar para os criados. Foi o que acabou por lhe custar mais caro.',
    opcoes: [
      { t: 'Ler os papéis', d: 'Com cuidado.', ok: { txt: 'Há nomes de reis, valores e rotas. Passa a noite a tirar notas, e sente que cresceu.', fx: { xp: 6 } } },
      { t: 'Vendê-los', d: 'Os novos reis pagam bem para ficar com eles.', ok: { txt: 'Ela olha para si com tristeza, mas fica com a sua parte.', fx: { ouro: 10 } } },
    ] },
  { id: 'volta_druidas', marca: 'druidas', titulo: 'Um Falcão à Sua Espera',
    texto: 'Um falcão pousa-lhe no ombro, sem lhe fazer mal, e deixa cair um embrulho de folhas. Mais tarde, um lobo enorme caminha a seu lado durante uma hora inteira, sem olhar para si. Afinal, não se esqueceram.',
    fundo: 'Os Saybaff não têm fortuna nem exército, mas têm uma memória tão velha como as árvores. Quem os respeita uma vez fica no caderno deles para sempre. Quem não os respeita também fica.',
    opcoes: [
      { t: 'Abrir o embrulho', d: 'Cheira a chuva.', ok: { txt: 'Raízes e um unguento. As feridas fecham em poucos minutos.', fx: { vida: 8, xp: 2 } } },
    ] },
  { id: 'volta_rebeldes', marca: 'rebeldes', titulo: 'O Monge no Muro',
    texto: 'Um monge sentado num muro vira a cabeça na sua direção antes de você fazer qualquer barulho. Os olhos estão fechados. "Simony fala de si", diz, e salta para o chão. "Tenho estado a treinar gente que nunca segurou numa espada. Precisava de sair daqui."',
    fundo: 'Geyser Punho Cego foi adotado pelo próprio Opositor, tirado das trevas ainda em criança. Perdeu a visão num combate contra um Andarilho. Diz que, desde aí, é o único em Daraan a ver bem.',
    opcoes: [
      { t: 'Levá-lo consigo', d: 'Um monge cego a mais nunca fez mal.', ok: { txt: 'Parte consigo, sem levar nada, e passa a avisá-lo do que há na curva seguinte.', fx: { aliado: 'geyser' } } },
      { t: 'Pedir-lhe uma lição', d: 'Só uma.', ok: { txt: 'Uma lição dura dez segundos. Passa o resto do dia a percebê-la.', fx: { xp: 5, vida: -1 } } },
    ] },
];

const SURPRESAS_DARAAN = [
  { inimigo: 'Goblins', pv: 6,
    contra: 'Uma pedra brilha no meio do caminho, e o barulho rebenta-lhe nos ouvidos. Antes de se recompor, já tem azagaias a voar à sua volta.',
    favor: 'Graças à sua cautela, vê-os primeiro: um bando de goblins, escondido em árvores e troncos, à espera de uma carroça que não vem. Não o viram.',
    saque: 5 },
  { inimigo: 'Soldados Imperiais', pv: 8,
    contra: 'Bandeira preta e vermelha, à saída da curva. "Nome, e terra de origem!", grita um deles, a sacar a espada de duas mãos antes de você responder.',
    favor: 'Do alto de um penedo, vê uma patrulha imperial a descansar à beira da estrada, de armaduras despidas, e com os cavalos soltos.',
    saque: 8 },
  { inimigo: 'A Pantera Deslocadora', pv: 8,
    contra: 'Só percebe que está ali quando já tem as garras nas costas. Parece estar em dois sítios ao mesmo tempo, e talvez esteja.',
    favor: 'Uma pelagem negro-azulada brilha ao sol, a dormir numa rocha, com os tentáculos caídos. Nunca ninguém a viu tão quieta, e talvez não volte a ver.',
    saque: 4 },
  { inimigo: 'Enviados de {vilao}', pv: 8,
    contra: 'Quatro figuras com o emblema dos Andarilhos cortam-lhe o caminho. Sabem o seu nome. Alguém os mandou aqui de propósito.',
    favor: 'Vê quatro figuras com o emblema dos Andarilhos a montar guarda numa ponte. Estão à sua espera, mas a olhar para o lado errado.',
    saque: 8 },
  { inimigo: 'Bárbaros das Terras Selvagens', pv: 7,
    contra: 'Saem das moitas a gritar, e não falam a língua do Pacto. Para eles, ninguém assinou coisa nenhuma.',
    favor: 'Fumo de fogueira sem cuidado. Um grupo de bárbaros assa qualquer coisa, sem desconfiar de nada. Falam alto, e estão a discutir por causa de um saco.',
    saque: 6 },
];

const BONS_ENCONTROS_DARAAN = [
  { id: 'd_campones', titulo: 'Os Campos de Abiad',
    texto: 'Uma família de lavradores divide o almoço à beira do caminho, e o mais velho faz-lhe sinal para se sentar, sem perguntar nada. "Há sempre fruta a mais, e o Império ainda não aprendeu a contar as maçãs", diz.',
    opcoes: [
      { t: 'Sentar-se a comer', d: 'Há quanto tempo não o fazia?', ok: { txt: 'Pão quente e fruta, e não lhe perguntam o nome. Parte com outra disposição.', fx: { vida: 6 } } },
      { t: 'Pedir-lhes notícias', d: 'Eles veem tudo o que passa.', ok: { txt: 'Dizem-lhe por onde passam as patrulhas, e dão-lhe umas moedas para um primo em Feldon.', fx: { xp: 3, ouro: 3 } } },
    ] },
  { id: 'd_montblanc', titulo: 'O Bardo sem Plateia',
    texto: 'Um halfling de roupa remendada toca baixinho numa pedra da estrada, com um gorro no chão, e nada dentro dele. A melodia é um velho hino do Pacto de Aramon, disfarçado de canção de embalar. Sorri-lhe, sem parar de tocar.',
    opcoes: [
      { t: 'Deixar uma moeda', d: 'Custa 1 de Ouro.', ok: { txt: 'Devolve-lhe três, e uma piscadela. "Parece que tem sorte hoje", diz.', fx: { ouro: 2, xp: 2 } } },
      { t: 'Convidá-lo a ir consigo', d: 'Boas palavras abrem muitas portas.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, ok: { txt: 'Levanta-se, e guarda o instrumento. "Tenho umas coisas para escrever. Já que vai para esse lado..."', fx: { aliado: 'montblanc' } }, ko: { txt: 'Ri-se muito. "Não, ainda não. Mas volte a perguntar."', fx: { xp: 1 } } },
    ] },
  { id: 'd_tesouro', titulo: 'O Tributo Perdido',
    texto: 'Uma carroça imperial virou-se numa vala, sem ninguém por perto, com os cavalos já longe. Debaixo da lona há sacos com o selo de um dos novos reis. Quem aqui devia estar decidiu que não valia a pena explicar isto a um Andarilho.',
    opcoes: [
      { t: 'Levar os sacos', d: 'É o dinheiro de quem o ganhou.', ok: { txt: 'Moedas de cinco cidades, que nunca hão de chegar à capital.', fx: { ouro: 12 } } },
      { t: 'Procurar as ordens', d: 'Vale mais do que o ouro.', tipo: 'investigacao', roll: { a: 'mente', dc: 9 }, ok: { txt: 'Lista de nomes, datas e rotas. Aprende muito, e ainda fica com o que estava na caixa do cabo.', fx: { xp: 6, ouro: 4 } }, ko: { txt: 'Um escorpião também achou boa ideia viver nos papéis.', fx: { vida: -1 } } },
    ] },
];

const MERCADOR_SECRETO_DARAAN = {
  titulo: 'O Ferreiro da Rota',
  texto: 'Fora das Rotas Comerciais, há uma carroça sem brasão, e um anão a martelar debaixo de um toldo. Não o olha nos olhos: olha para a sua arma. "Foi por isso que o Império me quer lá em cima", diz. "Aço de mais para a sua segurança. Quer ver o que sei fazer?"',
  fundo: 'O Cavaleiro Negro levou os melhores ferreiros de Daraan para Kaluen, e só alguns escaparam. Andam pelas estradas, e dizem que trabalham para quem pagar. Os rebeldes pagam muito pouco, e nunca lhes faltou trabalho.',
  opcoes: [
    { t: 'Mostrar-lhe o equipamento', d: 'Melhorias com 30% de desconto.', ok: { txt: 'Passa o polegar pelo gume, e estende a mão para o resto.', fx: { forja: 'secreto' } } },
    { t: 'Ver o que traz para vender', d: 'Coisas que não se vendem no mercado.', ok: { txt: 'Abre a carroça sem dizer nada.', fx: { mercado: true } } },
    { t: 'Seguir caminho', d: 'Quem não faz perguntas também não dá garantias.', ok: { txt: 'Quando olha para trás, já só se ouve o martelo, ao longe.', fx: {} } },
  ],
};

const ATRASOS_DARAAN = {
  cidade: [...ATRASOS.cidade, { id: 'd_censo', titulo: 'O Censo do Imperador',
    texto: 'Os soldados fecham a rua, e chamam toda a gente para ser contada. Um escriba de mãos sujas de tinta pergunta-lhe nome, ofício e terra de origem, com uma fila enorme atrás de si.',
    opcoes: [
      { t: 'Esperar na fila', d: 'Perde um dia.', ok: { txt: 'Ao fim do dia, é um número num livro. Pelo menos, aquele número está vivo.', fx: { dia: 1 } } },
      { t: 'Pagar a quem conta', d: 'Custa 4 de Ouro.', ok: { txt: 'O escriba conta-o sem o ver.', fx: { ouro: -4 } } },
      { t: 'Inventar um ofício', d: 'Fala em nome do general.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Sai dali, com uma vénia do escriba.', fx: {} }, ko: { txt: 'O escriba confirma com o sargento. Demora um dia a sair disto.', fx: { dia: 1, vida: -1 } } },
    ] }],
  estrada: [...ATRASOS.estrada, { id: 'd_exercito', titulo: 'A Coluna do Império',
    texto: 'Uma coluna de soldados enche a estrada toda, e levanta poeira até ao fim da vista. Marcham devagar, com carroças de lanças e catapultas. Ninguém passa à frente deles, e ninguém lhes pergunta para onde vão.',
    opcoes: [
      { t: 'Esperar que passem', d: 'Perde um dia.', ok: { txt: 'Ao fim do dia, ainda consegue ouvi-los.', fx: { dia: 1 } } },
      { t: 'Cortar pelos campos', d: 'Sem que o vejam.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Sai à frente deles, com muitas informações úteis.', fx: { xp: 2 } }, ko: { txt: 'Veem-no. Passa a noite a explicar-se, com a ajuda de um bastão.', fx: { dia: 1, vida: -2 } } },
    ] }],
};

const FIM_MORTE_DARAAN = {
  titulo: 'Mais Um Nome',
  texto: 'As forças abandonam-no longe de casa, numa estrada de Daraan. Durante uns tempos, alguém pinta o seu nome nos muros de Abiad. Depois, os soldados pintam por cima. Mas ainda se nota, à luz certa.',
};
const FIM_TARDE_DARAAN = {
  titulo: 'O Império Não Espera',
  texto: 'As bandeiras pretas e vermelhas sobem por todas as torres antes de você chegar, e já não há nada a fazer. {vilao} venceu, sem sequer precisar de saber que você existia. Alguns sonhos realmente não deveriam se realizar.',
};
const PRESSAGIOS_DARAAN = [
  'O tempo aperta. Há mais soldados em cada estrada e menos gente em cada praça, e tudo vai ser mais difícil a partir de agora.',
  'O prazo chegou ao fim. {vilao} está mais forte a cada dia, e em Daraan já ninguém se atreve a dizer o nome do Opositor.',
];

const LORE_DARAAN = {
  tocairn: { nome: 'Tocairn', titulo: 'Tocairn', texto: 'Cidade portuária do norte, com águas cristalinas e um rio. Foi por aqui que chegaram as velas negras. Hoje é o abrigo dos soldados imperiais, dos políticos e dos religiosos corruptos, e cheira a ambição.' },
  waleph: { nome: 'Waleph', titulo: 'Waleph', texto: 'No centro do oeste, junto a um lago que parece um imenso espelho e reflete as Montanhas Dentadas. Rodeada de bosques e urzais, é onde vivem mais elfos.' },
  narmer: { nome: 'Narmer', titulo: 'Narmer, o Porto Real', texto: 'Numa fenda onde as águas pedem permissão para passar, a caminho da capital. Foi feita para proteger Kaluen, e caiu numa só noite.' },
  mhari: { nome: "M'hari", titulo: "M'hari", texto: 'Vastas planícies e planaltos a nordeste, que na sua grandeza permanecem desconhecidos do povo do continente. Quem lá vive não costuma dar explicações.' },
  abiad: { nome: 'Abiad', titulo: 'Abiad', texto: 'Pequena cidade do sudeste, com campos frutíferos que alimentam Daraan pelas Rotas Comerciais. Tem um chafariz, uma grande praça, e já não é a cidade de paz que foi.' },
  kaluen: { nome: 'Kaluen', titulo: 'Kaluen', texto: 'A capital, a maior e mais bela das cidades, no ponto mais alto do continente. Uma cachoeira despenca lá de dentro, e do Paço Real vê-se toda Daraan, em trezentos e sessenta graus.' },
  peream: { nome: 'Peream', titulo: 'Peream', texto: 'Construída na floresta de Pere, com muitas catapultas e um grande portão. Era um dos pontos principais de transporte de armas do Império, antes de os rebeldes a tomarem sem causar uma única morte. A floresta está agora a tomá-la deles.' },
  mormon: { nome: 'Mórmon', titulo: 'Mórmon', texto: 'No centro de uma depressão de montanhas, habitada por elfos, halflings e alguns humanos, em paz. O regente é Darién Brilho da Lua. Foi aqui que os últimos Voranan foram queimados.' },
  feldon: { nome: 'Feldon', titulo: 'Feldon', texto: 'Vila pouco visitada pelo Império, a oeste do pântano. Uma colina atrás dela esconde uma caverna trabalhada há séculos por anões, e o maior segredo da Força Rebelde.' },
  dentadas: { nome: 'Montanhas Dentadas', titulo: 'As Montanhas Dentadas de Ratti', texto: 'A oeste, lembram os caninos de um grande animal. Região antiga do continente, para onde foge quem já não tem mais para onde fugir.' },
  templo: { nome: 'Farlagg', titulo: 'O Templo de Farlagg', texto: 'Farlagg é o deus da viagem, e a sua grande porta de madeira negra fica no alto das Montanhas Dentadas. Do alto do templo vê-se tudo, e é por isso que os generais gostam tanto dele.' },
  pere: { nome: 'Floresta de Pere', titulo: 'A Floresta de Pere', texto: 'Densa e traiçoeira, jaz nas subidas que levam ao castelo. Nela está a biblioteca sagrada, herança milenar dos druidas, com os pergaminhos mais antigos e os artefatos mais poderosos.' },
  pantano: { nome: 'Pântano Sombrio', titulo: 'O Pântano Sombrio', texto: 'A sul de Abiad, e os soldados imperiais nunca o atravessaram. Foi durante muito tempo a casa dos rebeldes, numa caverna muito grande, até alguém revelar o segredo.' },
  sangue: { nome: 'Sangue Sombrio', titulo: 'A Ilha de Sangue Sombrio', texto: 'Amaldiçoada pelos deuses. Dizem que tem um portal entre a terra e o inferno, e que os monstros não conseguem sair dela. O portão da prisão está selado com a magia do Império, para proteger os prisioneiros dos demónios, e os demónios dos prisioneiros.' },
  rotas: { nome: 'Rotas Comerciais', titulo: 'As Rotas Comerciais', texto: 'Levavam a comida de Abiad a toda Daraan. Agora levam também soldados, tributos e embaixadores, e são vigiadas pelos goblins de um lado e pelo Império do outro.' },
  ivan: { nome: 'Ivan Galonadel', titulo: 'Ivan Galonadel, o Imperador da Espada', texto: 'Elfo sombrio, chamado Cavaleiro Negro, chegou com centenas de barcos de velas negras. Empunha a espada dos deuses, com o pomo em cinco cabeças de dragão. Tem um rosto descarnado, um sorriso de orelha a orelha, e olhos cor de esmeralda. É rancoroso. Tem problemas em esquecer as coisas.' },
  khayn: { nome: 'Khayn', titulo: 'O General Khayn Ludrione', texto: 'Impiedoso, corrupto e arrogante, de voz rouca e bigode bem feito. A espada dada pelo Imperador acende-se quando sacada, e a cicatriz que traz no rosto foi-lhe feita em plena derrota, por um feiticeiro de Abiad.' },
  profeta: { nome: 'Profeta', titulo: 'O Profeta', texto: 'Um dos Andarilhos Fantasmas, talvez o mais terrível. Elfo de manto branco e vermelho, é o confidente sombrio do Imperador, e tem a idade dele. Traz um cajado com a caveira de um dragão filhote, e um anel que manda as pessoas para a ilha.' },
  espadachim: { nome: 'Espadachim', titulo: 'O Espadachim', texto: 'O guerreiro mais rápido de Daraan, e parece um rapaz. Dizem que nem aparenta mexer-se para atacar, e chamam-lhe o raio branco de Ivan. Salta para o céu, e desaparece.' },
  tevish: { nome: 'Tevish Szar', titulo: 'Tevish Szar', texto: 'O Andarilho monge. Grande parte do corpo parece metal, com um gume na lateral dos braços, e olhos incandescentes. Foi ele quem partiu em dois a espada de um príncipe, só com a mão.' },
  andarilhos: { nome: 'Andarilhos', titulo: 'Os Andarilhos Fantasmas', texto: 'Os quatro guardiões do Imperador, encapuzados e de presença aterradora. Ninguém sabe do que são capazes, e ninguém ousa testar. Dão a vida para o proteger, sempre.' },
  opositor: { nome: 'Opositor', titulo: 'O Opositor', texto: 'Um nome que corre de boca em boca, à frente da Força Rebelde. Ele diz que é uma ideia, e não um homem. Quem o conheceu fala de um velho sem nenhum sintoma de velhice, que tem sempre um mapa cheio de agulhas.' },
  simony: { nome: 'Simony', titulo: 'Simony Lumiel', texto: 'Última da família real, o braço direito do Opositor. Luta no estilo lua crescente, com uma espada longa e uma adaga. O Imperador quere-a viva. Chama aos seus preferidos "pequeno rubi".' },
  geyser: { nome: 'Geyser', titulo: 'Geyser Punho Cego', texto: 'Monge poderoso, adotado pelo Opositor e treinado no monastério de Heironeus. Perdeu a visão num combate contra um dos Andarilhos, mas sente a energia vital de quem tem à frente. Os inimigos só percebem isso tarde de mais.' },
  artas: { nome: 'Artas', titulo: 'Artas Lancaster', texto: 'Halfling de família nobre, que nunca soube seguir ordens. Exímio mestre de armas brancas, treinou a maioria dos soldados de Peream. A confiança nos arremessos parece tolice, até o verem arremessar. As adagas saem-lhe das mangas sem que ninguém perceba. Fica furioso quando Aaron esconde que é príncipe.' },
  aaron: { nome: 'Aaron', titulo: 'Aaron Bak', texto: 'Filho do rei Caik, e prefere estar em guerra ao lado do povo a cobrar impostos num trono. Foi sentinela nas florestas. Fez um juramento, e leva-o a sério.' },
  crunch: { nome: 'Crunch', titulo: 'Crunch', texto: 'Meio-orc, último da sua tribo. Fala de si mesmo como se fosse outra pessoa, e cuida dos amigos como se fossem a única coisa que tem. Crunch esmaga.' },
  zhenris: { nome: 'Zhenris', titulo: 'Zhenris Voranan', texto: 'Elfo feiticeiro de Abiad, especialista em fogo, conhecido pelos seus orbes. Antes da guerra, nem sabia pegar numa espada. Gritou o seu nome às portas de Abiad, e isso custou-lhe a família.' },
  voranan: { nome: 'Voranan', titulo: 'A Família Voranan', texto: 'Elfos feiticeiros de fogo. Dizem que têm sangue de dragão, e quase toda a gente acha que é boato. Os elfos das linhagens dracônicas sabem que têm um antepassado de escamas. Muitos serviam o Império, como soldados de elite ou conselheiros, até ao decreto.' },
  montblanc: { nome: 'Montblanc', titulo: 'Montblanc', texto: 'Bardo halfling, cujas palavras eram muito respeitadas no reino. Escreveu que um escolhido dos deuses está a chegar. O Imperador cumprimentou-o pelo estilo, e mandou-o para Sangue Sombrio.' },
  darien: { nome: 'Darién', titulo: 'Darién Brilho da Lua', texto: 'Elfo, regente de Mórmon. Assina o que lhe mandam, e faz o que pode para salvar quem lhe cai nas mãos. Foi amigo da família Voranan até ao fim.' },
  salazar: { nome: 'Salazar', titulo: 'Salazar', texto: 'Um velho feiticeiro de vestes reluzentes, que repele com eletricidade os ataques que lhe tocam. Ninguém lhe sabe o nome próprio, nem o que deve ao Opositor.' },
  quatur: { nome: 'Quatur', titulo: 'Quatur, o Embaixador', texto: 'Embaixador de Ivan, preocupado com a confiança do povo no Império. Bem-vestido, bem-falante, e facilmente substituível, como ele próprio sabe e diz.' },
  caik: { nome: 'Caik', titulo: 'Caik Bak', texto: 'O último Protetor do Reino. Depois da derrota, foi obrigado a servir Ivan no Paço Real, onde antes havia harmonia e confraternização. Há quem jure que trocou o trono por ouro e fama.' },
  aramon: { nome: 'Pacto de Aramon', titulo: 'O Pacto de Aramon', texto: 'Feito há muitos séculos pelo Rei Aramon Bak, defendia uma Daraan única, com os povos em harmonia. Humanos, elfos, halflings e orcs viveram sob ele. Custou muitas guerras a fazer, e custou uma só traição a desfazer.' },
  traicao: { nome: 'Guerra da Traição Real', titulo: 'A Guerra da Traição Real', texto: 'Os senhores de Daraan foram comprados com promessas de riqueza. O Cavaleiro Negro destruía centenas com um único ataque, e o resto foi feito pelos que antes eram amigos. Depois da guerra, os traidores passaram a chamar-se reis.' },
  saybaff: { nome: 'Saybaff', titulo: 'Os Saybaff', texto: 'A quem os humanos chamam druidas. Canalizam a energia da natureza, e dependem dela. Sem plantas e animais, o seu poder não pode ser usado. É por isso que Ivan os prende num lugar só de metal.' },
  oktena: { nome: 'Oktena', titulo: 'Os Oktena', texto: 'A quem os outros chamam magos. Estudam a magia ao longo da vida, e precisam de livros, pergaminhos e artefactos. Um feiticeiro, pelo contrário, gasta o próprio corpo.' },
  heironeus: { nome: 'Heironeus', titulo: 'Heironeus', texto: 'O deus do heroísmo, a quem o monastério de mãos vazias é dedicado.' },
  obadhai: { nome: 'Obad-hai', titulo: 'Obad-hai', texto: 'O deus da natureza. Os Saybaff tiram dele a sua força, e devem respeitá-la para o poderem fazer.' },
  pelor: { nome: 'Pelor', titulo: 'Pelor', texto: 'Deus a quem se reza em Daraan, muitas vezes quando já é tarde. Dizem que atua na mente dos reis. Até hoje, nenhum rei se queixou.' },
  goblins: { nome: 'Goblin', titulo: 'Os Goblins', texto: 'Pequenos, de pele esverdeada, olhos vermelhos e voz muito fina. Extremamente territoriais, vivem nas florestas a preparar emboscadas, e alguns dos seus xamãs invocam bestas mágicas.' },
  pantera: { nome: 'Pantera Deslocadora', titulo: 'A Pantera Deslocadora', texto: 'Besta mágica com seis patas e dois tentáculos com farpas, tão rápida que os olhos não acompanham. Prefere caçar criaturas pequenas, mas come tudo o que apanha.' },
  cajado: { nome: 'Cajado dos Voranan', titulo: 'O Cajado dos Voranan', texto: 'Herança de família. À palavra certa, amolece nas mãos de quem o segura, e toma a forma de uma enorme víbora. Quando é ferida, volta a ser só madeira, à espera.' },
  pergaminho: { nome: 'Pergaminho de Montblanc', titulo: 'O Pergaminho de Montblanc', texto: 'O original do texto que o levou à ilha. Termina com a promessa de um escolhido. Os conselheiros têm medo de o ler em voz alta.' },
  livro: { nome: 'Livro dos Saybaff', titulo: 'O Livro dos Saybaff', texto: 'O mais velho da biblioteca de Pere. As páginas são de folha, e nunca secaram. O Império queria saber o que diz sobre a espada do Imperador.' },
  selopacto: { nome: 'Selo do Pacto', titulo: 'O Selo do Pacto de Aramon', texto: 'O selo original, com as marcas de cada povo. Desapareceu na Guerra da Traição Real. Quem o apresentar pode chamar a Daraan inteira às armas, ou pelo menos é nisso que os velhos acreditam.' },
  lua_crescente: { nome: 'Lua Crescente', titulo: 'O Estilo Lua Crescente', texto: 'Luta-se com uma espada longa e uma adaga, e a diferença de tamanho entre as lâminas surpreende o oponente. É a especialidade de Simony.' },
};

// ---------- Os mundos ----------

const MUNDOS = {
  vesper: { glyph: 'moon', desc: 'O reino de sempre: um rei afogado, uma sacerdotisa velada, e sinos a tocar sem razão.',
    LUGARES, ESTRADAS, MAPA, OBJETIVOS, RELIQUIAS, REFENS, VILOES, REVIRAVOLTAS, GANCHOS, ENCONTROS, CONSEQUENCIAS, SURPRESAS, BONS_ENCONTROS, MERCADOR_SECRETO, ATRASOS, FIM_MORTE, FIM_TARDE, PRESSAGIOS, LORE },
  daraan: { glyph: 'sword', desc: 'O Cavaleiro Negro venceu, e o Pacto de Aramon caiu. Junte-se ao Opositor, contra os Andarilhos Fantasmas.',
    LUGARES: LUGARES_DARAAN, ESTRADAS: ESTRADAS_DARAAN, MAPA: MAPA_DARAAN, OBJETIVOS: OBJETIVOS_DARAAN, RELIQUIAS: RELIQUIAS_DARAAN, REFENS: REFENS_DARAAN, VILOES: VILOES_DARAAN,
    REVIRAVOLTAS: REVIRAVOLTAS_DARAAN, GANCHOS: GANCHOS_DARAAN, ENCONTROS: ENCONTROS_DARAAN, CONSEQUENCIAS: CONSEQUENCIAS_DARAAN, SURPRESAS: SURPRESAS_DARAAN, BONS_ENCONTROS: BONS_ENCONTROS_DARAAN,
    MERCADOR_SECRETO: MERCADOR_SECRETO_DARAAN, ATRASOS: ATRASOS_DARAAN, FIM_MORTE: FIM_MORTE_DARAAN, FIM_TARDE: FIM_TARDE_DARAAN, PRESSAGIOS: PRESSAGIOS_DARAAN, LORE: LORE_DARAAN },
};

function ativarMundo(id) {
  ({ LUGARES, ESTRADAS, MAPA, OBJETIVOS, RELIQUIAS, REFENS, VILOES, REVIRAVOLTAS, GANCHOS, ENCONTROS, CONSEQUENCIAS, SURPRESAS, BONS_ENCONTROS, MERCADOR_SECRETO, ATRASOS, FIM_MORTE, FIM_TARDE, PRESSAGIOS, LORE } = MUNDOS[id]);
  G.mundo = id;
}
