FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev
RUN npm install -g vite

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]
