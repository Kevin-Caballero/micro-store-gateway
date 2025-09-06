FROM node:22-alpine3.19
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm config set fetch-retry-mintimeout 20000 && \
  npm config set fetch-retry-maxtimeout 120000 && \
  npm config set fetch-timeout 300000 && \
  npm install
COPY . .
EXPOSE 3000