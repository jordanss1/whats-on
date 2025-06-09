FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

USER root

RUN npm install --production

COPY dist ./dist

RUN chown node:node -R /app

USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]
