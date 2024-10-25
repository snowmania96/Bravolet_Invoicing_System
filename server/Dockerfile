FROM node:20.17.0

WORKDIR /app

COPY .api package.json package-lock.json ./
RUN  npm install

COPY . ./

EXPOSE 5000

CMD [ "npm", "start" ]
