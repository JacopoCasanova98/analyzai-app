#!/bin/bash
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
[ -d pg-data ] || mkdir $SCRIPTPATH/pg-data
PGPASSWORD=analyzai
DOCKERNAME=analyzai-pgsql

# Stop e rimuovi container esistente se c’è
[ "$(docker ps | grep $DOCKERNAME)" ] && docker stop $DOCKERNAME
[ "$(docker ps -a | grep $DOCKERNAME)" ] && docker rm $DOCKERNAME

# Avvia nuovo container Postgres
docker run -d \
  --name $DOCKERNAME \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=$PGPASSWORD \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v $SCRIPTPATH/pg-data:/var/lib/postgresql/data \
  postgres:16

# Attendi che Postgres sia pronto
sleep 3

# Crea DB e utente se non esistono
echo "SELECT 'CREATE DATABASE analyzai' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'analyzai')\gexec" | PGPASSWORD=$PGPASSWORD psql -h 127.0.0.1 --user postgres
echo "SELECT 'CREATE ROLE analyzai LOGIN PASSWORD ''analyzai''' WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'analyzai')\gexec" | PGPASSWORD=$PGPASSWORD psql -h 127.0.0.1 --user postgres
echo "GRANT ALL PRIVILEGES ON DATABASE analyzai TO analyzai\gexec" | PGPASSWORD=$PGPASSWORD psql -h 127.0.0.1 --user postgres

echo "✅ Postgres container is running e DB 'analyzai' is ready."
