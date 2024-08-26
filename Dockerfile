FROM node:22
WORKDIR /opt/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY server/package.json server/package.json
COPY server/package-lock.json server/package-lock.json

RUN cd server && npm ci && cd ../

COPY src/images src/images
COPY server/src server/src
COPY server/tsconfig.json server/tsconfig.json
COPY src src
COPY public public
COPY tsconfig.json tsconfig.json
COPY database.json database.json
COPY config.json config.json

RUN npm run build
RUN cd server && npm run build-server

COPY migrations migrations
