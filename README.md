# networks 
docker network create front

docker network create database

# volume 
docker volume create MysqlData
# front image
docker build -t frontend ./front-end

docker run -d --rm -p 4200:4200 --net front --name frontendContainer frontend

# database image
docker build -t database ./database

docker run -d --rm --net database --name databaseContainer -v MysqlData:/var/lib/mysql database

# backend image
docker build --build-arg DB_CONTAINER=databaseContainer -t backend ./back-end

docker run -d --rm --net database --net front --name backendContainer backend

# nginx image
docker build -t nginx-proxy ./nginx

docker run -d --rm -p 8080:80 --net front --net database --name nginxContainer nginx-proxy

# ps 

docker ps

