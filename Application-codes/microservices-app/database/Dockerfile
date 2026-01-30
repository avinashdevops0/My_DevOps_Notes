FROM mysql:8

ENV MYSQL_ROOT_PASSWORD=rootpassword

COPY ./database/db-setup.sql /docker-entrypoint-initdb.d/
