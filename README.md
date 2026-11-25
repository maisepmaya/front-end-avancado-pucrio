<div align="center">
  <img src="src/assets/logo.png" alt="HordaMaster" width="260"/>

  <h3>Controle de combate para mestres de RPG de mesa, com interface ilustrada à mão.</h3>

  <p>
    <a href="https://maisepmaya.github.io/front-end-avancado-pucrio/"><strong>▶ Testar a demo ao vivo</strong></a>
    &nbsp;·&nbsp;
    <a href="#-decisões-de-design">Decisões de design</a>
    &nbsp;·&nbsp;
    <a href="#-identidade-visual">Identidade visual</a>
    &nbsp;·&nbsp;
    <a href="#-como-rodar">Como rodar</a>
  </p>

  <img src="docs/combate.gif" alt="Aplicando dano em um goblin até ele ser derrotado e depois curando" width="800"/>
</div>

---

## 🎲 Em 30 segundos

|                  |                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **O que é**      | Uma web app para o mestre de RPG controlar vários inimigos ao mesmo tempo durante o combate. |
| **Meu papel**    | Projeto individual: product design, **todas as ilustrações da interface**, UI e desenvolvimento front-end. |
| **Contexto**     | Pós-graduação em Desenvolvimento Full-Stack — PUC-Rio (2025). Redesenhado em 2026 para portfólio. |
| **Ferramentas**  | Ilustração digital · React · TypeScript · Tailwind CSS                               |
| **Destaques**    | Prévia ao vivo do cartão · feedback visual de dano/cura · estados vazios guiados · funciona no celular |

> Todas as artes da interface — madeira, pergaminhos, cartões, corações, escudo, estandarte, logo e o d20 — foram desenhadas por mim. Só os ícones das criaturas vêm do [Freepik](https://www.freepik.com).

---

## 🧩 O problema

Num RPG de mesa, o **mestre** narra a história e controla tudo que os jogadores enfrentam. Num combate contra uma horda — seis goblins, um orc e um necromante — ele precisa saber, a cada turno, **quem é quem, quanto de vida cada um ainda tem e quem já caiu**. Na prática isso vira papel rabiscado, planilha improvisada e conta de cabeça, bem no momento em que a mesa mais precisa de ritmo.

**Para quem:** mestres que preparam inimigos antes da sessão e precisam consultá-los e alterá-los rápido durante o jogo, muitas vezes num notebook ou celular ao lado do livro de regras.

**O que o produto precisa fazer bem:**

1. **Preparar** inimigos uma vez e reaproveitar (uma ficha → várias cópias).
2. **Distinguir** cópias iguais na hora (Goblin 1, Goblin 2, Goblin 3...).
3. **Atualizar** vida em um ou dois toques, sem perder a concentração na narrativa.
4. **Mostrar** o estado do combate de relance: quem está de pé e quem foi derrotado.

---

## ✨ Decisões de design

### 1. A ação principal não pode ficar escondida

Na primeira versão, o formulário de "Criar ficha" só aparecia quando o mouse passava por cima do pergaminho — bonito, mas a tarefa principal da tela ficava invisível e impossível de descobrir no celular.

**Agora:** o formulário fica sempre aberto, o pergaminho virou o título da seção e entrou uma **prévia ao vivo** que mostra o cartão exatamente como ele vai aparecer na mesa de combate. Os números ganharam botões de − / + (mais fáceis de usar no toque) e o seletor de ícone virou uma **grade visual** no lugar de uma lista de texto.

<img src="docs/antes-depois-criar.png" alt="Antes e depois da tela Criar ficha"/>

### 2. O estado do combate de relance

O grid de cartões mostrava cada inimigo, mas não o combate como um todo, e a única ação em lote era um "Resetar" solto no rodapé.

**Agora:** um cabeçalho resume **quantos estão na mesa, de pé e derrotados**, e uma barra de **vida da horda** mostra o quanto o combate já avançou. As ações em lote ganharam nomes que dizem o que fazem (**Tirar derrotados**, **Encerrar combate**) e pedem confirmação, com o foco começando em "Cancelar".

<img src="docs/antes-depois-mesa.png" alt="Antes e depois da mesa de combate"/>

### 3. Cada cartão responde ao que acontece com ele

- O **coração muda de ilustração** conforme a vida: cheio → machucado → partido.
- Dano faz o coração **tremer**; cura faz ele **pulsar**.
- Ao chegar a 0 PV, o cartão perde a cor e recebe um **carimbo de "Derrotado"** — dá para ver quem caiu sem ler nenhum número.
- Os números ganharam contexto: **"7 de 7"** no coração, **"CA"** no escudo, **"Nv"** no nível e o ícone da criatura no canto, para diferenciar inimigos parecidos.

### 4. Estados vazios que ensinam

Mesa vazia não é mais "nada para mostrar": virou um mini-onboarding com os três passos de uso e um atalho para criar a primeira ficha. A barra lateral também orienta ("Clique numa ficha para invocar") e, sem fichas, oferece o botão de criar.

<img src="docs/vazio.png" alt="Estado vazio da mesa de combate" width="800"/>

### 5. Feedback no lugar de `alert()`

Os alertas nativos do navegador quebravam a imersão. Agora há **avisos temáticos** (sucesso, informação, erro) — por exemplo, "Goblin Saqueador 4 entrou na mesa!" ao invocar um inimigo.

### 6. Acessibilidade e mobile

- Foco visível em todos os controles, navegação por teclado e `Esc` para fechar diálogos.
- Rótulos para leitores de tela em todos os botões de ícone; ilustrações decorativas marcadas como tal.
- Respeito a `prefers-reduced-motion`.
- No celular, a navegação vai para baixo (perto do polegar) e as fichas abrem numa gaveta lateral.

<img src="docs/mobile.png" alt="Telas no celular" width="520"/>

---

## 🎨 Identidade visual

O tom é de **mesa de taverna**: madeira, pergaminho e um estandarte de tecido, com contorno firme e volume simples — lúdico, mas legível no meio de uma sessão.

<img src="docs/ilustracoes.png" alt="Ilustrações originais da interface"/>

**Paleta** — tirada das próprias ilustrações:

| Madeira escura | Madeira | Pergaminho | Estandarte | Botão | d20 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ![#29160d](https://placehold.co/72x40/29160d/29160d.png) | ![#82583f](https://placehold.co/72x40/82583f/82583f.png) | ![#fde6d6](https://placehold.co/72x40/fde6d6/fde6d6.png) | ![#2d6856](https://placehold.co/72x40/2d6856/2d6856.png) | ![#b0402f](https://placehold.co/72x40/b0402f/b0402f.png) | ![#b5a52a](https://placehold.co/72x40/b5a52a/b5a52a.png) |
| `#29160d` | `#82583f` | `#fde6d6` | `#2d6856` | `#b0402f` | `#b5a52a` |

**Tipografia** — **Marhey** para títulos e botões (tem a cara de letreiro pintado) e **Nunito** para textos e números, que precisam ser lidos rápido.

**Componentes** — botões "de brinquedo" com sombra deslocada sem desfoque (o mesmo volume chapado das ilustrações), cartões de pergaminho com borda grossa e a ilustração usada como moldura do conteúdo (`ImgDiv`).

---

## 🖼️ Telas

| Mesa de combate | Criar ficha |
| :---: | :---: |
| <img src="docs/home.png" alt="Mesa de combate"/> | <img src="docs/criar.png" alt="Criar ficha"/> |
| **Sobre** | **Mesa vazia** |
| <img src="docs/sobre.png" alt="Sobre"/> | <img src="docs/vazio.png" alt="Mesa vazia"/> |

---

## ⚔️ Funcionalidades

- Criar e apagar fichas de inimigos (nome, nível, vida, CA, ícone e anotações).
- Buscar monstros prontos no bestiário oficial de D&D 5e ([5e SRD API](https://www.dnd5eapi.co/)).
- Invocar várias cópias numeradas automaticamente na mesa de combate.
- Aplicar dano e cura, editar a vida direto no coração e recuperar a vida total.
- Anotações por inimigo (condições, efeitos, lembretes).
- Resumo do combate, remover derrotados e encerrar combate.

---

## 🚀 Como rodar

### Modo demo (sem back-end)

Sem configuração nenhuma, o app roda em **modo demo**: os dados ficam no `localStorage` do navegador e já vêm alguns inimigos de exemplo. É o modo da [versão publicada](https://maisepmaya.github.io/front-end-avancado-pucrio/).

```bash
git clone https://github.com/maisepmaya/front-end-avancado-pucrio.git
cd front-end-avancado-pucrio
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Com o back-end (Flask + SQLite)

Suba a [HordaMaster API](https://github.com/maisepmaya/back-end-puc-rio-project/) e crie um arquivo `.env` (há um modelo em `.env.example`):

```bash
VITE_API_URL=http://localhost:5000
```

### Com Docker

```bash
docker build -t hordamaster .                                              # modo demo
docker build --build-arg VITE_API_URL=http://localhost:5000 -t hordamaster . # com back-end
docker run -p 3000:3000 hordamaster
```

A aplicação fica em `http://localhost:3000`.

### Publicação

Cada push na `main` publica o site no GitHub Pages pelo workflow em `.github/workflows/deploy.yml`.

---

## 🛠️ Por trás da interface

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router · Phosphor Icons

<div align="center">
  <img src="src/assets/architecture.png" alt="Arquitetura da aplicação" width="700"/>
</div>

- **API interna** ([HordaMaster API](https://github.com/maisepmaya/back-end-puc-rio-project/)) — cria, lista e apaga fichas e cartões de combate.
- **API externa** ([5e SRD API](https://www.dnd5eapi.co/)) — monstros de D&D 5e. Licença MIT; dados sob Open Game License. Não exige chave de acesso.

| Método | Endpoint                     | Uso                          |
| ------ | ---------------------------- | ---------------------------- |
| `GET`  | `/api/monsters`              | Lista de monstros            |
| `GET`  | `/api/2014/monsters/{index}` | Detalhes de um monstro       |

---

## 🔭 Próximos passos

- **Ordem de iniciativa** — o pedido mais natural depois do controle de vida.
- **Condições com ícones** (envenenado, caído, atordoado) no lugar de texto livre.
- **Teste de usabilidade com mestres** durante uma sessão real, medindo o tempo para aplicar dano em um inimigo específico.

---

<div align="center">
  <img src="src/assets/icon.png" alt="" width="48"/>
  <p>Ilustrações, UI e código por <a href="https://github.com/maisepmaya">@maisepmaya</a> · Ícones de criaturas por <a href="https://www.freepik.com">Freepik</a></p>
  <p><sub>Projeto da Pós-Graduação em Desenvolvimento Full-Stack — PUC-Rio</sub></p>
</div>
