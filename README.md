# networks 
docker network create front

docker network create database

# front image

docker build -t frontend .

docker run --rm -p 4200:4200 --net front --name test-frontend frontend

# database image

docker build -t database .

docker run --rm --net database --name test-database database

# backend image
docker build --build-args DB_CONTAINER=test-database -t backend .

docker run --net front --net database --name test-backend backend

