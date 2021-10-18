FROM node:latest

WORKDIR /usr/src/app
ADD . .
RUN yarn
RUN yarn build-back
EXPOSE 3000
CMD ["node", "packages/back/dist/index.js"]