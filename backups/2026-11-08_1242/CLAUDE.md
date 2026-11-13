# Rumo à CNH — contexto do projeto

Jogo 2D de navegador, feito pelo Bruno para a esposa estudar a prova teórica da CNH com o curso gratuito "CNH do Brasil" (Ministério dos Transportes / Senatran). Acima de tudo é uma ferramenta de estudo fiel ao conteúdo oficial; o jogo serve para deixar o estudo envolvente. Ela joga pouco: tudo precisa ser intuitivo, só com cliques, sem limite de tempo, sem reflexos e sem game over.

## Como funciona o código

- O jogo é entregue como **um único HTML** (`dist/rumo-a-cnh.html`), offline, sem bibliotecas externas.
- O HTML é **gerado**: não edite `dist/` à mão. Edite as fontes e rode `python3 scripts/build.py`.
- Build: `npm run build` (acha sozinho o Python do sistema). Teste de ponta a ponta (joga todas as fases, chefes, simulado, Reforço, caminho de erro e checagem das placas): `npm install` uma vez, depois `npm test`. Precisa terminar com `ERROS []` e `FALHAS []`. `npm run check` faz build + teste.
- Não há git nesta máquina: antes de mudanças grandes, rode `npm run backup` (copia fontes para `backups/`, mantém as 15 mais recentes).

| Arquivo | O que tem |
|---|---|
| `src/shell.html` | HTML + CSS (estilo coquette). Marcadores `/*__DATA__*/`, `/*__LIB__*/`, `/*__MAIN__*/` são preenchidos pelo build. |
| `src/lib.js` | Biblioteca visual: as 88 placas em vetor (`PLACAS`), ilustrações dos cartões (`ILU`), ícones de traço (`ICO` + `ICO_RULES` por palavra-chave), sprites em pixel art do Bruno e cenas Casa/Val/Quintas (`sceneRects`). |
| `src/main.js` | Motor: estado salvo, telas (título, mapa, estudo, quiz, reforço, domínio, opções), falas do Bruno (`F`), mapa do bairro (`NODES`, `ROADS`, `drawMap`), sons (WebAudio). |
| `scripts/topics.py` | Os 74 tópicos (id, aula, título, se é Aprofundamento) e as regras de palavra-chave usadas para classificar as questões. |
| `scripts/content.py` | Texto dos cartões de Estudo por tópico (`C`) e ajustes do "Saiba mais" (`S`). |
| `scripts/build.py` | Junta tudo, monta a seleção da Jornada, gera `dist/rumo-a-cnh.html` e `dist/cobertura.md`. O dicionário `VIS` liga linhas de cartão a placas (`P:R-1`) ou ilustrações (`I:faixa-ped`). |
| `data/banco.json` | As 1.500 questões extraídas por script do Banco Nacional de Questões. Não reescrever texto de questão. |
| `data/assign.json` | Questão → tópico (gerado por `scripts/classify.py` + `data/overrides.json`, revisão manual). |
| `data/saiba.json` | Trechos da apostila para o "Saiba mais". |
| `scripts/parse_banco.py`, `scripts/saiba.py` | Extração original. Só rodam com os PDFs convertidos em texto em `materiais/` (pasta fora do git). |

## Regras de conteúdo (não negociáveis)

- **Perguntas só do Banco oficial**, sem criar nem reescrever. Alternativas embaralhadas a cada exibição; comentário oficial sempre após a resposta.
- Cada questão pertence a exatamente **um tópico**; nenhuma pergunta aparece antes de o tópico ser estudado.
- **Placas sempre em vetor**, fiéis ao padrão oficial (formato, cor, símbolo). **Nunca pixel art em placas.** Pixel art só no clima de jogo (mapa, Bruno, enfeites).
- **Nada de prints ou imagens recortadas dos PDFs.** As explicações são cartões soltos em grid, com placas, ilustrações e ícones desenhados no código.
- Texto de estudo fiel aos módulos; tópicos que só a apostila cobre aparecem marcados como "Aprofundamento".
- Simulado: 30 questões, mínimo 70% (a apostila não diz quantas questões a prova real tem).

## Identidade e tom

- **Instrutor: Bruno**, homem negro, marido amoroso da aluna. Falas curtas, carinhosas ("amor", "meu amor"), com digitação letra a letra e bipes de fala. Sem voz gravada por enquanto.
- **Estilo coquette** sobre pixel art 16 bit: creme, rosa, cereja (`#B3264A`), lilás; lacinhos, corações (estrelas viraram corações, selos viraram broches). Texto de estudo sempre escuro sobre fundo claro.
- **Mapa = bairro real do casal**, seguindo a rota: Casa (partida) → Val (chefe 1, mercadinho em frente) → descida da R. Jayme Sapolnik → Tchuras (chefe 2, barraquinha do churrasco) → subida até a Rua das Araras → Quintas (simulado final, condomínio favorito).
- Privacidade: nada de número de prédio, telefone ou nome de loja nas fachadas.

## Pendências conhecidas

- **Tchuras** ainda sem desenho: aguardando foto da barraquinha. Até lá, só a parada de chefe no mapa.
- **Hospedagem** planejada no Cloudflare Pages (`teoriacnh.pages.dev`), ainda não feita. Lembrar que o site público exporia o mapa do bairro.
- Alguns pictogramas de placas de indicação e turísticas (SAU, TNA, THC, TAR) são simplificados.

## Como o Bruno gosta de trabalhar

- Ele manda **várias ideias de alteração seguidas**. Anote todas em `IDEIAS.md` e **não mexa no código até ele dizer "pode implementar"** (ou "pode subir"); aí implemente tudo de uma vez.
- Depois de implementar: rode o build e o teste, e conte em poucas linhas o que mudou e o que ele precisa saber.
- Respostas enxutas, em português.
