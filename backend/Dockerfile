FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

RUN apt-get update && apt-get install -y postgresql-client

COPY . .

RUN npx prisma generate && npm run build

EXPOSE 3001

CMD ["sh", "config.sh"]
