FROM node:10.16.0
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm","run","pure_start"]