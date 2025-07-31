# EvoTraining

![React Native](https://img.shields.io/badge/React%20Native-v0.72.06-blue)
![NodeJS](https://img.shields.io/badge/Node.js-v18.0.0-green?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-v13.0.0-black?logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-v6.0.0-green?logo=mongodb&logoColor=white)
![Licença](https://img.shields.io/badge/licença-MIT-green)


🇺🇸 [English Version](https://github.com/AbynerRocha/evotraining/README-en.md)

**EvoTraining** é um projeto criado para a PAP (Prova de Aptidão Profissional) da Escola Profissional do Infante que consiste de um aplicativo mobile de gerenciamento de treinos de musculação.

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pre-requisitos)
- [Como Rodar o Projeto](#como-rodar)
    - [Requisitos](#como-rodar)
    - [Executando o Aplicativo Mobile](#exec-app-mobile)
    - [Executando a API](#exec-api)
    - [Executando Web Dashboard](#exec-admin-dashboard)

---

## 🌟 Sobre o Projeto 

**EvoTraining** é um projeto criado para a PAP (Prova de Aptidão Profissional) da Escola Profissional do Infante que consiste de um aplicativo mobile de gerenciamento de treinos de musculação.

Logo de inicio decidi que este projeto seria para me tirar da zona de conforto (que era o desenvolvimento web) então decidi criar um aplicativo mobile, com isso decidi utilizar React-Native por conta da sua versátilidade por conta dos *components* e dos diversos pacotes criados pela comunidade que iria ajudar e acelerar o desenvolvimento. 

Na hora de escolher qual banco de dados utilizar, pensei em utilizar o [MongoDB](https://mongodb.com) por ser um banco de dados que eu tinha utilizado em nenhum projeto e com uma "estrutura" diferente a qual eu estava acostumado.

Durante o planejamento, foi posta uma questão: *Como que os dados contendo os exercícios seriam adicionados no banco de dados?* É uma questão bastante válida, já qdaue existem diversos exercícios e das mais diversas molidades. Inicialmente planejei utilizar uma API para receber os dados dos exercícios, mas todas as APIs que tinham um tempo de resposta aceitável e uma boa quantidade de dados tinham limitações que iriam impactar na usabilidade do aplicativo, então esta hipótese foi descartada. 

Outra hipótese posta foi em salvar os dados de alguma destas APIs no nosso banco de dados e até funcionou, mas faltava algo essencial: As ilustrações dos exercícios. Algumas tinham mas com tokenização que significava que iria ter que fazer outra requisição para aquela API para ter a ilutração então essa hipótese também foi descartada, Naquele momento surgiu a ideia de criar uma dashboard web para que a "equipe" pudesse adicionar os exercícios manualmente com o tempo, e foi a ideia de adotamos.

Durante o planejamento e desenvolvimento deste projeto consegui aprimorar muito meus conhecimentos, principalmente com mobile, que, como eu havia dito anteriormente eu não tinha nenhum. E acredito que isso se reflete até mesmo no código em questão de organização e performance. E perante o tempo escasso que me foi posto para finalizar este projeto, fico muito feliz com o resultado.

---

## 🧑‍💻 Tecnologias Utilizadas


#### Mobile
- [React-Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo-router](https://docs.expo.dev/router/introduction/)
- [Native-Base](https://nativebase.io/)
- [NativeWind](https://www.nativewind.dev/)
- [Moti](https://moti.fyi/)
- [React-Hook-Form](https://react-hook-form.com/)
- [Axios](https://axios-http.com/)

#### Dashboard Web
- [NextJs](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

#### API
- [Fastify](https://fastify.dev/)
- [Resend](https://resend.com/)
- [Mongoose](mongoosejs.com)

### Banco de Dados
- [MongoDB](https://www.mongodb.com/)

---

## 📱 Funcionalidades 

### Mobile
- Criar planos de treinos para si mesmo ou para terceiros.
- Ajustar os treinos durante a semana na agenda do aplicativo.
- Definir tempo de descanso entre as series.
- Armazenar as cargas utilizadas em cada serie de cada exercício.
- Poder acompanhar a evolução de cargas e treinos feitos em cada mês através de um gráfico no perfil do usuário.
- Compartilhar os resultados com amigos (30%)

---
### Web

- Gerenciar os exercícios contidos no aplicativo.
- Gerenciar os usuários (50%)

---

## 🖥️ Pré-Requisitos 
- [NodeJS  versão LTS recomendada ](https://nodejs.org/pt)
-  [Yarn](https://yarnpkg.com/) ou NPM
- [Expo CLI](https://expo.dev/)
- [Android Studio com SDKs instalados (para rodar no Android)](https://developer.android.com/studio)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Siga o modelo que esta no arquivo `.env.example`

## ⚙️ Como Rodar 
**Este projeto não foi testado no IOS**

### 📁 Clonar Repositório

    git clone https://github.com/AbynerRocha/evotraining.git
    cd evotraining

### 📱 Instalar dependências e iniciar Mobile 

    cd mobile
    yarn ou npm install
    
    yarn start 
    # ou 
    npm run start

### 🖥️ Instalar dependências e iniciar Web

    cd site
    yarn ou npm install
    
    yarn build 
    # ou 
    npm run build
    
    yarn start ou npm run start
 
  ### 🖥️ Instalar dependências e iniciar API

    cd api
    
    yarn 
    # ou 
    npm install
    
    yarn build 
    # ou 
    npm run build
    
    yarn start 
    # ou 
    npm run start
  
### 🎲 Banco de dados
 
 Na raiz do projeto

    docker-compose up
