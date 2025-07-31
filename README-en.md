# EvoTraining

![React Native](https://img.shields.io/badge/React%20Native-v0.72.06-blue)
![NodeJS](https://img.shields.io/badge/Node.js-v18.0.0-green?logo=node.js\&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-v13.0.0-black?logo=next.js\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-v6.0.0-green?logo=mongodb\&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

🌟 [Versão em Português](https://github.com/AbynerRocha/evotraining/blob/main/README.md)

**EvoTraining** is a project created for the PAP (Professional Aptitude Test) of Escola Profissional do Infante. It consists of a mobile app for managing weight training routines.

## Table of Contents

* [About the Project](#about-the-project)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Prerequisites](#prerequisites)
* [How to Run the Project](#how-to-run)

  * [Requirements](#how-to-run)
  * [Running the Mobile App](#running-the-mobile-app)
  * [Running the API](#running-the-api)
  * [Running the Web Dashboard](#running-the-web-dashboard)

---

## 🌟 About the Project

**EvoTraining** is a project created for the PAP (Professional Aptitude Test) of Escola Profissional do Infante. It is a mobile application designed to manage bodybuilding workouts.

From the start, I decided that this project should push me out of my comfort zone (which was web development), so I opted to build a mobile app. I chose React Native because of its versatility, component-based structure, and the wealth of community packages that speed up development.

When it came to choosing a database, I selected [MongoDB](https://mongodb.com) because I had never used it in a project before, and its document-based structure was different from what I was used to.

During the planning stage, a question arose: *How would the exercise data be added to the database?* This was an important question, as there are countless exercises across many modalities. Initially, I planned to use an API to fetch exercise data, but all available APIs with good response time and data volume had limitations that would affect app usability, so that idea was discarded.

Another approach considered was saving API data into our database. This worked to some extent, but lacked something essential: exercise illustrations. Some APIs had them, but required tokenized requests, meaning we would need additional calls to fetch illustrations. That solution was also discarded. This led to the idea of creating a web dashboard so that the "team" could manually add exercises over time, and that became our chosen path.

Throughout the planning and development of this project, I significantly improved my skills, especially in mobile development, which was completely new to me. I believe this growth is reflected in the code, especially in terms of organization and performance. Given the tight deadline I faced, I'm really happy with the outcome.

---

## 🧑‍💻 Technologies Used

### Mobile

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/)
* [Expo Router](https://docs.expo.dev/router/introduction/)
* [Native Base](https://nativebase.io/)
* [NativeWind](https://www.nativewind.dev/)
* [Moti](https://moti.fyi/)
* [React Hook Form](https://react-hook-form.com/)
* [Axios](https://axios-http.com/)

### Web Dashboard

* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Axios](https://axios-http.com/)

### API

* [Fastify](https://fastify.dev/)
* [Resend](https://resend.com/)
* [Mongoose](https://mongoosejs.com)

### Database

* [MongoDB](https://www.mongodb.com/)

---

## 📱 Features

### Mobile

* Create workout plans for yourself or others.
* Adjust weekly workout routines using the in-app calendar.
* Set rest time between sets.
* Store weights used for each set and exercise.
* Track progress with charts on the user profile page.
* Share workout results with friends (30% implemented).

### Web

* Manage the exercises included in the app.
* Manage users (50% implemented).

---

## 🖥️ Prerequisites

* [Node.js (LTS recommended)](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/) or NPM
* [Expo CLI](https://expo.dev/)
* [Android Studio with SDKs installed (for Android testing)](https://developer.android.com/studio)
* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Follow the structure provided in the `.env.example` file.

---

## ⚙️ How to Run

**This project has not been tested on iOS**

### 📁 Clone the Repository

```bash
git clone https://github.com/AbynerRocha/evotraining.git
cd evotraining
```

### 📱 Install Dependencies and Start Mobile App

```bash
cd mobile
yarn
# or
npm install

yarn start
# or
npm run start
```

### 🖥️ Install Dependencies and Start Web Dashboard

```bash
cd site
yarn
# or
npm install

yarn build
# or
npm run build

yarn start
# or
npm run start
```

### 🖥️ Install Dependencies and Start API

```bash
cd api
yarn
# or
npm install

yarn build
# or
npm run build

yarn start
# or
npm run start
```

### 🎲 Database

From the project root:

```bash
docker-compose up
```
