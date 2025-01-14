# EvoTraining

![React Native](https://img.shields.io/badge/React%20Native-v0.72.06-blue)
![NodeJS](https://img.shields.io/badge/Node.js-v18.0.0-green?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-v13.0.0-black?logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-v6.0.0-green?logo=mongodb&logoColor=white)
![Licença](https://img.shields.io/badge/licença-MIT-green)


🇺🇸 [English Version](https://github.com/AbynerRocha/evotraining)

**EvoTraining** é um projeto criado para a PAP (Prova de Aptidão Profissional) da Escola Profissional do Infante que consiste de um aplicativo mobile de gerenciamento de treinos de musculação.

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pre-requisitos)
- [Como Rodar o Projeto](#como-rodar)
    - [Instalação](#como-rodar)
    - [Executando o Aplicativo Mobile](#exec-app-mobile)
    - [Executando a API](#exec-api)
    - [Executando Admi Dashboard](#exec-admin-dashboard)

---

## Sobre o Projeto 🌟

**EvoTraining** é um projeto criado para a PAP (Prova de Aptidão Profissional) da Escola Profissional do Infante que consiste de um aplicativo mobile de gerenciamento de treinos de musculação.

Logo de inicio decidi que este projeto seria para me tirar da zona de conforto (que era o desenvolvimento web) então decidi criar um aplicativo mobile, com isso decidi utilizar React-Native por conta da sua versátilidade por conta dos *components* e dos diversos pacotes criados pela comunidade que iria ajudar e acelerar o desenvolvimento. 

Na hora de escolher qual banco de dados utilizar, pensei em utilizar o [MongoDB](https://mongodb.com) por ser um banco de dados que eu tinha utilizado em nenhum projeto e com uma "estrutura" diferente a qual eu estava acostumado.

Durante o planejamento, foi posta uma questão: *Como que os dados contendo os exercícios seriam adicionados no banco de dados?* É uma questão bastante válida, já qdaue existem diversos exercícios e das mais diversas molidades. Inicialmente planejei utilizar uma API para receber os dados dos exercícios, mas todas as APIs que tinham um tempo de resposta aceitável e uma boa quantidade de dados tinham limitações que iriam impactar na usabilidade do aplicativo, então esta hipótese foi descartada. 

Outra hipótese posta foi em salvar os dados de alguma destas APIs no nosso banco de dados e até funcionou, mas faltava algo essencial: As ilustrações dos exercícios. Algumas tinham mas com tokenização que significava que iria ter que fazer outra requisição para aquela API para ter a ilutração então essa hipótese também foi descartada, Naquele momento surgiu a ideia de criar uma dashboard web para que a "equipe" pudesse adicionar os exercícios manualmente com o tempo, e foi a ideia de adotamos.

---

## Tecnologias Utilizadas 🧑‍💻


#### Mobile

- TypeScript
- React-Native
- Expo
- Expo-router
- Native-Base
- NativeWind (estilização)
- Moti (Animações)
- React-hook-form
- Axios 

#### Dashboard Web

- TypeScript
- NextJS
- TailwindCSS
- Axios

#### API

- TypeScript
- Fastify
- Resend (Envio de emails)
- MongoDB

---

## Funcionalidades 📱

---

## Pré-Requisitos 🖥️

---

## Como Rodar ⚙️

---
