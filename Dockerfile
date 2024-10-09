FROM node:20
WORKDIR /app
COPY package.json .
COPY . .
EXPOSE 8888

CMD ["node","index.js"]