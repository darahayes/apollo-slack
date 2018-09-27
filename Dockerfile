FROM node:10-alpine

EXPOSE 7700

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN ls -l

WORKDIR /app/server

RUN npm install --production

CMD ["npm", "start"]
