FROM nginx
COPY . /usr/share/nginx/html/
RUN apk add --no-cache curl
COPY ./nginx.conf /etc/nginx/conf.d/default.d