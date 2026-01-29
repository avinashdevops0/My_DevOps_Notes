# Build stage
FROM node:alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Runtime stage
FROM node:alpine
WORKDIR /app

COPY --from=build /app .

CMD ["npm", "start"]
