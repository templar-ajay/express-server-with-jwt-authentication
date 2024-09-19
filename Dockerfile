FROM node:20

WORKDIR /usr/app/src

COPY package* .

RUN npm i

COPY . .

EXPOSE 9991

CMD ["node", "server.js"]
