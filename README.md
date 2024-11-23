# for front image
docker network create front

docker build --squash -t frontend .

docker run --rm -p 4200:4200 --net front --name test-frontend frontend
