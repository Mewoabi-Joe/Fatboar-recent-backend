#!/bin/bash
#sudo chmod +x run.sh
docker network create --driver=overlay traefik-public
export EMAIL=aminekhalifa92@gmail.com
export USERNAME=admin
export PASSWORD=amine1
export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)
echo $HASHED_PASSWORD
docker stack deploy -c devops-traefik.yml devops
docker build -t  node-app -f src/microservices/api/Dockerfile  .
docker stack deploy -c docker-compose-debug-local.yml js
