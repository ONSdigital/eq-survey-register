FROM node:10-alpine

EXPOSE 8080
ENV PORT=8080
WORKDIR /app

ENV NODE_ENV production
ENV AWS_DEFAULT_REGION eu-west-1

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]

COPY . /app
RUN yarn install
