FROM node:10.16.0
ARG npm_script
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm",$npm_script]