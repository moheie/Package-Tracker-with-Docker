FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

RUN chmod -R 777 /app

# Expose the Angular dev server's default port
EXPOSE 4200

# Start the Angular dev server
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

