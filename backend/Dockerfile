# Dev & CI
FROM node:18
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY tsconfig.json .
COPY src/ src/
COPY config/ config/
COPY db_migrations/ db_migrations/
# tests
COPY test/ test/
COPY jest.config.js .

EXPOSE 3000
CMD ["npm", "run", "dev"]
