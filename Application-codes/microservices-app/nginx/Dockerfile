FROM nginx:alpine

# Copy your nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN apk add --no-cache curl

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
