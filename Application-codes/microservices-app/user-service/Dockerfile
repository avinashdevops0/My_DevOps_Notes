# Build stage
FROM node:alpine AS build
WORKDIR /app
RUN apk add --no-cache curl


COPY package*.json ./
RUN npm install --production

COPY . .

# Runtime stage
FROM node:alpine
WORKDIR /app
RUN apk add --no-cache curl

COPY --from=build /app .

CMD ["npm", "start"]
