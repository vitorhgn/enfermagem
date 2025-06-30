
# 🏥 Sistema de Enfermagem

Este projeto é um sistema completo para gerenciamento de anamneses realizado por **estagiários**, **supervisores** e **coordenadores** em um ambiente acadêmico ou clínico. Ele é dividido em:

- Backend em **Node.js** com **Express** e **Sequelize**
- Banco de dados **MySQL**
- Aplicativo mobile com **React Native** + **Expo Router**

---

## 🚀 Funcionalidades

- 📋 Listagem de pacientes
- 🧠 Preenchimento de fichas de anamnese
- ✅ Aprovação ou reprovação por supervisores
- 🔒 Login com controle de acesso por tipo de profissional
- 📱 Aplicativo mobile responsivo e moderno

---

## 📁 Estrutura do Projeto

```
enfermagem/
├── backend/                # API REST em Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── config/
│   └── server.js
├── app-enfermagem/         # App mobile em React Native com Expo
│   ├── app/                # Telas com Expo Router
│   ├── assets/             # Imagens e ícones
│   └── ...
└── README.md               # Este arquivo
```

---

## 🛠️ Tecnologias

### Backend
- Node.js
- Express
- Sequelize
- MySQL
- bcrypt

### Mobile
- React Native (Expo)
- Expo Router
- Axios
- TypeScript
- React Navigation

---

## 👥 Tipos de Usuário

| Tipo        | Código | Permissões                                |
|-------------|--------|-------------------------------------------|
| Estagiário  | `1`    | Cadastrar e corrigir anamneses            |
| Supervisor  | `3`    | Aprovar ou reprovar anamneses             |
| Coordenador | `4`    | Apenas visualizar as anamneses aprovadas  |

---

## ⚙️ Como Rodar o Projeto

### 🔗 Pré-requisitos

- Node.js (LTS)
- MySQL
- Yarn ou npm
- Expo CLI → `npm i -g expo-cli`

---

### 📦 Rodando o Backend

```bash
cd backend
yarn              # ou npm install
yarn start        # inicia o servidor em http://localhost:5380
```

- Configure `src/config/database.js` com as credenciais do seu banco local.

---

### 📱 Rodando o App Mobile

```bash
cd app-enfermagem
yarn              # ou npm install
npx expo start
```

- Escaneie o QR code com o aplicativo **Expo Go** no seu celular

> 💡 **Importante:** Para rodar o projeto localmente, será necessário restaurar os arquivos `app.json` e `eas.json` ao padrão original. Você pode recuperar esses arquivos olhando os commits anteriores no repositório.

---

## 🛑 Observações

- A API deve estar rodando antes de iniciar o app mobile.
- O endereço da API (ex: `http://192.168.X.X:5380`) deve estar acessível pelo celular.
- Os usuários devem estar cadastrados no banco com login e senha criptografada (bcrypt).

---


## 👨‍💻 Autores

Desenvolvido por: 

[Maria Júlia Brilhante San Martin](https://github.com/Maju1903)  
📧 brilhantemariajulia3@gmail.com

[Vitor Hugo Gouveia Nunes](https://github.com/vitorhgn)  
📧 vitorhgn100@gmail.com
