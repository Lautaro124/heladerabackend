FROM node:18

WORKDIR /app

ENV PORT=3000

COPY package.json /app/

COPY yarn.lock /app/

COPY . /app/

RUN yarn