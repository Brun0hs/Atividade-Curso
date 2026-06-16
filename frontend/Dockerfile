FROM node:lts-alpine

WORKDIR /usr/src/app

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
