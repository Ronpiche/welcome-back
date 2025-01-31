# Use the official Node.js image as base
FROM node:20-alpine

# Add environment variable
ENV NODE_ENV=production
ENV PORT=8080

# Set the working directory
WORKDIR /code

# Copy the application
COPY . ./

# Install NestJS dependencies
RUN npm ci --ignore-scripts

# Build the NestJS project
RUN npm run build

# Command to run the application
CMD ["npm", "run", "start:prod"]