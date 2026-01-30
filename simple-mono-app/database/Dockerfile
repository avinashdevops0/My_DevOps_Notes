FROM mysql:8.4

ENV MYSQL_ROOT_PASSWORD=rootpassword
# ENV MYSQL_DATABASE=simple_app_db

COPY init.sql /docker-entrypoint-initdb.d/
