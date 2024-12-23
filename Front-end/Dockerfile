FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Fix permissions for the working directory
RUN chmod -R 777 /app


# Expose the Angular dev server's default port
EXPOSE 4200

# Start the Angular dev server
ENTRYPOINT ["npm", "start"]

