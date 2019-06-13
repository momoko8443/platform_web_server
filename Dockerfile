FROM node:10.16.0
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "DOMAIN=47.111.6.126","npm","start"]