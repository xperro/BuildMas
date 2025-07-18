FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

RUN apt-get update && apt-get install -y postgresql-client

COPY . .

ENTRYPOINT ["sh", "config.sh"]

EXPOSE 3001
