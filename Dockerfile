FROM node:10-alpine

EXPOSE 8080
ENV PORT=8080
WORKDIR /app

ENV NODE_ENV production

ENTRYPOINT yarn start

COPY . /app
RUN yarn install