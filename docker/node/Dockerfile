FROM node:10
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./frontend/package.json /usr/src/app
RUN npm cache clean
RUN npm install
COPY ./frontend /usr/src/app
EXPOSE 4200
CMD ["npm","start"]