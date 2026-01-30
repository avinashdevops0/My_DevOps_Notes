FROM mysql:8

ENV MYSQL_ROOT_PASSWORD=rootpassword

COPY ./init.sql /docker-entrypoint-initdb.d/
