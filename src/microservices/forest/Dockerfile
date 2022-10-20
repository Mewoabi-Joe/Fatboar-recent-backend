FROM node:14.15.1-alpine3.10

RUN mkdir -p /app

WORKDIR /app

COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn install --prod

COPY ./src/common /app/src/common
COPY ./src/microservices/forest /app/src/microservices/forest

EXPOSE 3000

CMD yarn run forest
