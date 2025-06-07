FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

USER root

RUN npm install

COPY . .

RUN chown node:node -R /app

USER node

EXPOSE 5173

CMD npm run dev

