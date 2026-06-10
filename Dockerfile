from "node:20-alpine"

workdir /app

copy package*.json ./

run npm install

copy prisma ./prisma/

run npx prisma generate

copy . .

expose 3000

cmd ["npx","tsx","src/server.ts"]