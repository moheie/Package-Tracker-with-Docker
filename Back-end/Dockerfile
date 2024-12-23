FROM golang:alpine

WORKDIR /app


ENV SECRET_KEY=thisisasecretkey \
    DB_CONTAINER=database \
    DATABASE_URL=root:root@tcp(${DB_CONTAINER}:3306)/package_tracker?charset=utf8mb4&parseTime=True&loc=Local

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o /app/main .

EXPOSE 8080

ENTRYPOINT ["/app/main"]
