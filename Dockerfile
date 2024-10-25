FROM node:20.17.0

WORKDIR /app

COPY client/package.json ./client/package.json
COPY client/package-lock.json ./client/package-lock.json
RUN  cd client && npm install

COPY client ./client
RUN cd client && npm run build

FROM node:20.17.0

WORKDIR /app

COPY server/package.json ./server/package.json
COPY server/package-lock.json ./server/package-lock.json
RUN cd server && npm install

COPY --from=build /app/client/build ./server/public

EXPOSE 5000

CMD [ "node", "server/src/index.js" ]