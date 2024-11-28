FROM golang:alpine

WORKDIR /app

ARG DB_CONTAINER

ENV SECRET_KEY=thisisasecretkey \
    DATABASE_URL=root:root@tcp(${DB_CONTAINER}:3306)/package_tracker?charset=utf8mb4&parseTime=True&loc=Local

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o /app/main .

EXPOSE 8080

ENTRYPOINT ["/app/main"]
