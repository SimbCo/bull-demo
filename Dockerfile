FROM node:10-alpine

ENV HOME=/usr/src/app
RUN mkdir -p $HOME
WORKDIR $HOME

RUN yarn global add redis-cli
RUN yarn

EXPOSE 3030

USER 1000
