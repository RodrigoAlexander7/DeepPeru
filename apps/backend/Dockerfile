FROM node:22.20-alpine3.21

RUN npm install -g pnpm@latest-10

WORKDIR app

COPY package*.json .

RUN pnpm install

# so now app  ~= (is equivalent to) apps/backend
COPY . . 

RUN pnpm prisma generate

CMD ["pnpm", "run", "dev"]




