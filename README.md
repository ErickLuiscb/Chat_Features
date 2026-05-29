# Chat_Features

Atividade 3 do Chat, para cada membro do grupo criar uma ou mais features acrescentando no projeto do chat.
Time:
Érick Luis Capera Barneche (Líder),
Pedro Lucas Porcellis Branco,
Diogo Beduhn Brum,
Augusto Oliveira Souza,

Features Designadas:

# Chat Básico em React + Node.js + MongoDB

## Sobre o Projeto

Este projeto consiste em uma aplicação de chat em tempo real desenvolvida utilizando React no frontend, Node.js com Express no backend e MongoDB como banco de dados.

A aplicação permite que múltiplos usuários entrem no sistema utilizando apenas um nome de usuário, enviem mensagens em tempo real e compartilhem imagens PNG dentro do chat.

O sistema também exibe os usuários ativos nos últimos 5 minutos, além do horário da última atividade de cada usuário.

---

# Tecnologias Utilizadas

## Frontend

- React
- Material UI (MUI)
- Axios
- Context API
- CSS3

## Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Multer
- GridFS

---

# Funcionalidades

- Login simples com nome de usuário
- Envio de mensagens em tempo real
- Listagem de usuários ativos
- Exibição da última atividade do usuário
- Upload de imagens PNG
- Armazenamento de imagens no MongoDB utilizando GridFS
- Interface responsiva inspirada no WhatsApp

---

# Estrutura do Projeto

## Backend

```bash
backend/
├── dbMessages.js
├── server.js
├── package.json
```

## Frontend

```bash
frontend/
├── src/
│   ├── components/
│   │   ├── Chat.js
│   │   ├── Sidebar.js
│   │   ├── SidebarChat.js
│   │   ├── Login.js
│   │   ├── Reducer.js
│   │   ├── StateProvider.js
│   │   ├── axios.js
│   │   └── *.css
│   ├── App.js
│   ├── index.js
│   └── package.json
```

---

# Como Executar o Projeto

## 1. Instalar o MongoDB

O MongoDB deve estar instalado e em execução na máquina.

A aplicação utiliza a seguinte conexão:

```js
mongodb://localhost:27017/chat
```

---

# 2. Executar o Backend

Abra um terminal na pasta backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Instale o multer:

```bash
npm install multer
```

Inicie o servidor:

```bash
npm start
```

Se tudo estiver correto, aparecerá:

```bash
MongoDB conectado
GridFS conectado
Listening on localhost: 9000
```

---

# 3. Executar o Frontend

Abra outro terminal na pasta frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm start
```

O sistema abrirá automaticamente no navegador:

```bash
http://localhost:3000
```

---

# Como Utilizar

## Login

Ao abrir o sistema:

1. Digite um nome de usuário
2. Clique em "Entrar"

---

## Enviar Mensagens

Digite uma mensagem no campo inferior do chat e pressione Enter.

---

## Enviar Imagens

1. Clique no ícone de anexo
2. Escolha uma imagem PNG
3. A imagem será enviada e exibida no chat

---

## Usuários Ativos

A barra lateral exibe:

- usuários ativos nos últimos 5 minutos
- horário da última atividade

---

# Rotas da API

## Buscar mensagens

```http
GET /messages/sync
```

---

## Enviar mensagem

```http
POST /messages/new
```

---

## Buscar usuários ativos

```http
GET /messages/actives
```

---

## Upload de imagem

```http
POST /messages/image
```

---

## Buscar imagem

```http
GET /messages/image/:id
```

---

# Banco de Dados

A aplicação utiliza MongoDB com Mongoose.

As mensagens possuem a seguinte estrutura:

```js
{
  message: String,
  name: String,
  timestamp: Date,
  received: Boolean,
  imageId: String
}
```

---

# GridFS

As imagens PNG são armazenadas utilizando GridFS, permitindo salvar arquivos diretamente dentro do MongoDB.

---

# Como Testar o Projeto

## Teste de Mensagens

1. Abra duas abas do navegador
2. Faça login com usuários diferentes
3. Envie mensagens entre eles

---

## Teste de Usuários Ativos

1. Faça login com diferentes usuários
2. Envie mensagens
3. Observe a barra lateral atualizando automaticamente

---

## Teste de Imagens

1. Clique no botão de anexo
2. Escolha uma imagem PNG
3. Verifique se a imagem aparece no chat

# Projeto desenvolvido para fins acadêmicos utilizando React, Node.js e MongoDB.
