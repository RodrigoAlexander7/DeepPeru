# Select the image for node
FROM node:22-alpine

# Create app/ on the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY tsconfig*.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy the backend package.json to apps/backend on the container
COPY apps/backend/package.json apps/backend

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies using pnpm -> This isntall only the backend dependencies
# <...> means include also transitive dependencies -> so install monorepo dep. and back dependencies
RUN pnpm install --filter ./apps/backend...

# Copy the rest of the application code to the container
# we copi all cause we need root files like linter etc (i hate u alvaro lol)
COPY . . 

# Say: now /app/apps/backend is the current direcotory (is like cd) 
WORKDIR /app/apps/backend
RUN npx prisma generate

RUN pnpm run build

EXPOSE 4000
CMD ["pnpm", "start:prod"]



