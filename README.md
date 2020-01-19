# Sisk Short Links [backend]

[![Netlify Status](https://api.netlify.com/api/v1/badges/9034c417-f3f9-4bb8-b6b2-e8931925e041/deploy-status)](https://app.netlify.com/sites/)

The back-end for a simple short link generator with optional custom names and expiration settings built in [Node.js®](https://nodejs.org/)

*[front-end](https://github.com/CalamityAdam/flts-frontend)*

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

need to have:

+ [PostgreSQL](https://www.postgresql.org/)

### Installation

+ fork and clone this repository

```console
npm install
createdb <package-name>
npm run seed
```

+ note: package name is `asls-backend` by default

+ create file `./secrets.js` in root of project and place the following environment variables in that file
+ required environment variables:

```js
process.env.SESSION_SECRET = '<put a nice tasty secret here>';
process.env.SILENT_AUTH_NAME = '<login username>';
process.env.SILENT_AUTH_CHECK = '<login password>';
```

+ optional environment variables (if connecting SMS support via [Twilio](https://www.twilio.com/)):

```js
process.env.TWILIO_ACCOUNT_SID = '<get your own>';
process.env.TWILIO_AUTHT_TOKEN = '<from twilio>';
```

+ time to start the server!

```console
npm run start
```

## Built With

+ [React](https://reactjs.org/docs/getting-started.html) - A JavaScript library for building user interfaces
+ [Styled Components](https://www.styled-components.com/docs) - Visual primitives for the component age
+ [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js

## Authors

+ **Adam Sisk** - *Developer* - [github](https://github.com/calamityadam) | [linkedIn](https://www.linkedin.com/in/adamsisk/)

## License

This project is licensed under the MIT License

>made with ❤️ by Adam Sisk
