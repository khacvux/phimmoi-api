FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN yarn

COPY . .

RUN yarn build

USER node

EXPOSE 8000

CMD [ "node", "dist/index.js" ]