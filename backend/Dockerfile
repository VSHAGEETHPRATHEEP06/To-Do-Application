# Use the official Node.js 18 image as the base image
FROM node:18-slim

# Install build tools for native dependencies
RUN apt-get update && apt-get install -y build-essential

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (including devDependencies for nodemon)
RUN npm install

# Install nodemon globally (optional, but ensures it's available)
# RUN npm install -g nodemon

# Rebuild native dependencies if needed
RUN npm rebuild bcrypt --update-binary

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Set NODE_ENV environment variable
ENV NODE_ENV=production

# Use nodemon for development
# CMD ["npm", "run", "dev"]
# Command to run the application
CMD ["npm", "start"]