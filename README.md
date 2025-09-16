<div align="center">
  <img src="src/assets/logo.png" alt="logo" width="200"/>
</div>

# HordaMaster 

![GitHub repo size](https://img.shields.io/github/repo-size/maisepmaya/front-end-avancado-pucrio?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/maisepmaya/front-end-avancado-pucrio?style=for-the-badge)

O **HordaMaster** é uma aplicação web criada para facilitar a vida de mestres de RPG de mesa, ajudando a gerenciar **múltiplos inimigos em combate** de forma organizada, prática e em tempo real.

📚 **RPG**, do inglês _Role Playing Game_, é um jogo de interpretação de papéis, onde um grupo de pessoas cria uma história em conjunto. Um narrador — chamado de **mestre** — descreve o mundo, cria desafios e controla criaturas e inimigos que os jogadores enfrentam. Durante os combates, o mestre costuma administrar várias criaturas ao mesmo tempo, o que pode ser confuso quando feito apenas em papel ou planilhas.

✨ O **HordaMaster** resolve esse problema permitindo:

- Criar **fichas** de inimigos com nome, nível, pontos de vida, classe de armadura e informações adicionais.
- Adicionar múltiplas cópias de inimigos numeradas automaticamente (ex.: Goblin 1, Goblin 2, Goblin 3).
- Gerenciar a vida de cada inimigo em tempo real direto na tela.
- Consultar informações básicas de monstros usando a API [5e SRD API](https://www.dnd5eapi.co/).

🔗 Para o backend/API, confira o repositório [HordaMaster API](https://github.com/maisepmaya/back-end-puc-rio-project/)

<div align="center" style="margin: 20px 0;">
  <img src="src/assets/architecture.png" alt="Arquitetura da Aplicação" width="700"/>
  <p><em>Arquitetura da aplicação</em></p>
</div>

## 🚀 Tecnologias utilizadas

- **Vite**
- **React**
- **TailwindCSS**
- **uuid**
- **HTML5**
- **CSS3**
- **Icons:** Alguns ícones foram obtidos no [Freepik](https://www.freepik.com/); demais artes foram desenhadas por mim.


## 📥 Instalação e Execução

```bash
git clone https://github.com/maisepmaya/front-end-avancado-pucrio.git
cd front-end-avancado-pucrio
npm install
npm run dev
````

Acesse no navegador: `http://localhost:5173`.

## 🐳 Executando com Docker

```bash
# Construa a imagem
docker build -t hordamaster .

# Execute o container
docker run -p 3000:3000 hordamaster
```
A aplicação estará disponível em `http://localhost:3000`.

## ⚔️ Funcionalidades

- Criação de fichas
- Edição e exclusão de fichas
- Adição de inimigos ao grid com numeração automática
- Gerenciamento de vida em tempo real
- Integração com a 5e SRD API
- Interface intuitiva e divertida


## 📂 Estrutura de Páginas

### 📌 Página Principal

* Visualiza todas as fichas criadas.
* Adiciona instâncias de cada ficha ao **grid de combate**, com numeração automática.
* Gerencia vida e status de cada inimigo individualmente.

### ✏️ Página Criar Ficha

* Cria novas fichas de inimigos ou apaga fichas antigas.
* Campos: Nome, Nível, Vida, CA, Ícone, Informações adicionais.
* As fichas salvas ficam disponíveis na tela principal em **Minhas Fichas**.

### ℹ️ Página Sobre

* Explica o objetivo do HordaMaster.
* Orienta mestres e novos usuários sobre o funcionamento.
* Informa sobre o uso da 5e SRD API.


## 🔗 API Utilizada

O **HordaMaster** se integra a duas APIs diferentes:

### 🗂️ API Interna (Backend do Projeto)
- Repositório: [HordaMaster API](https://github.com/maisepmaya/back-end-puc-rio-project/)
- Responsável por:
  - Criar, editar e excluir fichas de inimigos.
  - Gerenciar dados persistentes no banco de dados.
  - Servir informações para o front-end.

### 🌍 API Externa (5e SRD API)
- Documentação: [https://www.dnd5eapi.co/](https://www.dnd5eapi.co/)
- Utilizada para consultar informações básicas de monstros.
- **Licença:** MIT License para a API; dados sob _Open Game License (OGL)_.
- **Autenticação:** Não requer cadastro ou chave de acesso (API Key).

#### Endpoints Utilizados
| Método | Endpoint                     | Descrição                       |
| ------ | ---------------------------- | ------------------------------- |
| `GET`  | `/api/2014/monsters`         | Retorna lista de monstros.      |
| `GET`  | `/api/2014/monsters/{index}` | Retorna detalhes de um monstro. |

#

📜 Projeto da **Pós-Graduação em Desenvolvimento Full-Stack** - **PUC-Rio**.

