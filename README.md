# To run bash
```bash
./run.sh
```
---
## For manually

Network
```bash
docker network create front
```
```bash
docker network create database
```
___
Volume 
```bash
docker volume create MysqlData
```
---
Front Image
```bash
docker build -t frontend ./front-end
```
```bash
docker run -d --rm -p 4200:4200 --net front --name frontendContainer frontend
```
---
Database Image
```bash
docker build -t database ./database
```
```bash
docker run -d --rm --net database --name databaseContainer -v MysqlData:/var/lib/mysql database
```
---
Backend Image
```bash
docker build --build-arg DB_CONTAINER=databaseContainer -t backend ./back-end
```
```bash
docker run -d --rm --net database --net front --name backendContainer backend
```
---
ps 
```bash
docker ps
```


