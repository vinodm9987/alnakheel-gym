FROM node:12.18.0-alpine as node

WORKDIR /gymgo

RUN  chmod +x /gymgo

COPY ./ /gymgo

RUN yarn install 

RUN yarn install -g nodemon

RUN yarn build

EXPOSE 5000

CMD [ "nodemon","/server" ]