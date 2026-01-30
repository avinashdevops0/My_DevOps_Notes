FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
RUN apk add --no-cache curl
COPY . .

FROM node:alpine
WORKDIR /app
COPY --from=build /app .
CMD ["npm", "start"]
