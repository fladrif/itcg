FROM node:14
WORkDIR /opt/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npm run build
RUN npm run build-server
