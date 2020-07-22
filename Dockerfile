# node 10.16.3
FROM node as build-stage
WORKDIR /app
RUN npm install -g yarn
COPY yarn.lock ./
COPY package.json ./
COPY ./example ./
RUN yarn install
RUN NODE_PATH=src yarn build
FROM nginx as deploy-stage
RUN apt-get update \
    && apt-get install --yes curl apache2-utils less jq \
    && apt-get clean

COPY ./nginx.conf /etc/nginx/
COPY --from=build-stage /app/build /var/www
COPY --from=build-stage /app/config/proxy.conf /etc/nginx/

CMD nginx -g 'daemon off;'
