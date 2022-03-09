# syntax=docker/dockerfile:1

FROM node:16

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm i --production

COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "npm", "start" ]
