FROM node:20-alpine

# Create app directory and set permissions
WORKDIR /app
COPY package*.json ./

# Install dependencies as root (default)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]
