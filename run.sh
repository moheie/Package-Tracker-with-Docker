#!/bin/bash

echo "Creating Docker networks"
docker network create front
docker network create database

echo "Creating Docker volumes"
docker volume create MysqlData

echo "Starting the frontend container"
docker build -t frontend ./front-end
docker run -d --rm -p 4200:4200 --net front --name frontend frontend

echo "Starting the database container"
docker build -t database ./database
docker run -d --rm --net database --name database -v MysqlData:/var/lib/mysql database
sleep 10

echo "Starting the backend container"
docker build -t backend ./back-end
docker run -d --rm --net database --net front -p 8080:8080 --name backend backend
sleep 5

echo "All containers are up and running!"
docker ps