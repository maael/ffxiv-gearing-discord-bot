FROM mhart/alpine-node:12
ARG PORT
ARG NODE_ENV
WORKDIR /repo
COPY . .
RUN yarn
RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline

CMD ["yarn", "start"]