FROM node:12

RUN mkdir -p /srv/app

WORKDIR /srv/app

COPY ./package.json /srv/app/
COPY ./yarn.lock /srv/app/
RUN yarn install

COPY ./src/common /srv/app/src/common
COPY ./src/microservices/api /srv/app/src/microservices/api

EXPOSE 3000

CMD yarn run api
