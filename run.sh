#!/bin/bash

echo "Creating Docker networks"
docker network create front
docker network create database

echo "Starting the frontend container"
docker build -t frontend ./front-end
docker run -d --rm -p 4200:4200 --net front --name frontendContainer frontend

echo "Starting the database container"
docker build -t database ./database
docker run -d --rm --net database --name databaseContainer database
sleep 10

echo "Starting the backend container"
docker build --build-arg DB_CONTAINER=databaseContainer -t backend ./back-end
docker run -d --rm --net database --net front --name backendContainer backend
sleep 5

echo "Starting the Nginx reverse proxy"
docker build -t nginx-proxy ./nginx
docker run -d --rm -p 8080:80 --net front --net database --name nginxContainer nginx-proxy

echo "All containers are up and running!"
docker ps