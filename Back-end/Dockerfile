FROM golang:alpine

WORKDIR /app

ENV SECRET_KEY=thisisasecretkey
ENV DATABASE_URL='root:root@tcp(172.18.0.3:3306)/package_tracker?charset=utf8mb4&parseTime=True&loc=Local'

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o /app/main .

EXPOSE 8080

ENTRYPOINT ["/app/main"]
