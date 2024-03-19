# Use the official Node.js image as a parent image
FROM node:18-slim

ENV NODE_VERSION 18.19.1
# Set the working directory

WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json .
# Install dependencies
RUN npm install
# Copy the rest of your app's source code
COPY . .
# Make port available outside the container
EXPOSE 8080
# Command to run your app
CMD ["npm", "start"]
