FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

FROM node:18-alpine

COPY --from=build /app /app/
# Expose the Angular dev server's default port
EXPOSE 4200

# Start the Angular dev server
ENTRYPOINT ["npm", "start"]

