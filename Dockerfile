FROM node:6.9.1
MAINTAINER sezzhltd@gmail.com

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

CMD ["node", "public/bin/app.bundle.js"]
