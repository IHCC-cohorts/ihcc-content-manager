FROM node:12.16.1-alpine

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

CMD [ "npm", "run", "start-prod" ]
