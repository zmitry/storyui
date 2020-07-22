FROM node as build-stage
WORKDIR /app
COPY yarn.lock ./
COPY package.json ./
COPY ./example ./
RUN yarn install
RUN NODE_PATH=src yarn build
FROM nginx as deploy-stage
COPY ./nginx.conf /etc/nginx/
COPY --from=build-stage /app/build /var/www
CMD nginx -g 'daemon off;'
