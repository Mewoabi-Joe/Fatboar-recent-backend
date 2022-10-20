#!/bin/bash
#sudo chmod +x run.sh
docker build -t  node-app  .
docker build -t  node-app-prod -f src/microservices/api/Dockerfile  .
docker build -t  node-app-stagging -f src/microservices/api/Dockerfile  .
docker stack deploy -c docker-compose-debug-local.yml stagging
docker stack deploy -c docker-compose-debug.yml stagging
docker stack deploy -c docker-compose.prod.yml prod
docker build . -t nexus.fatboar-burger.fr:8123/forest-dev:02  -f ./src/microservices/forest/Dockerfile.debug
docker build . -t nexus.fatboar-burger.fr:8123/forest:01  -f ./src/microservices/forest/Dockerfile
docker push nexus.fatboar-burger.fr:8123/forest-dev:02
docker push nexus.fatboar-burger.fr:8123/forest:01
docker login https://nexus.fatboar-burger.fr:8123 -u admin --password  amine1