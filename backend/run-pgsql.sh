#!/bin/bash

# Get the absolute path of the directory where this script is located
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

# Create the pg-data directory if it doesn't exist (for persistent Postgres data)
[ -d pg-data ] || mkdir $SCRIPTPATH/pg-data

# Set environment variables for the Postgres password and Docker container name
PGPASSWORD=analyzai
DOCKERNAME=analyzai-pgsql

# Stop the existing container if it's running
[ "$(docker ps | grep $DOCKERNAME)" ] && docker stop $DOCKERNAME

# Remove the existing container if it exists
[ "$(docker ps -a | grep $DOCKERNAME)" ] && docker rm $DOCKERNAME

# Run a new Postgres container in detached mode
docker run -d \
  --name $DOCKERNAME \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=$PGPASSWORD \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v $SCRIPTPATH/pg-data:/var/lib/postgresql/data \
  postgres:16

# Wait a few seconds to let Postgres fully start up
sleep 3

# Create the database 'analyzai' if it doesn't exist
echo "SELECT 'CREATE DATABASE analyzai' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'analyzai')\gexec" | \
PGPASSWORD=$PGPASSWORD psql -h 127.0.0.1 --user postgres

# Create the role/user 'analyzai' with password if it doesn't exist
echo "SELECT 'CREATE ROLE analyzai LOGIN PASSWORD ''analyzai''' WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'analyzai')\gexec" | \
PGPASSWORD=$PGPASSWORD psql -h 127.0.0.1 --user postgres

# Grant all privileges on the 'analyzai' database to the user 'analyzai'
echo "GRANT ALL PRIVILEGES ON DATABASE analyzai TO analyzai\gexec" | \
PGPASSWORD=$PGPASSWORD psql -h 127.0.0.1 --user postgres

# Change the ownership of the 'public' schema to user 'analyzai'
echo "ALTER SCHEMA public OWNER TO analyzai\gexec" | \
PGPASSWORD=$PGPASSWORD psql -h 127.0.0.1 --user postgres analyzai

# Grant all privileges on the 'public' schema to user 'analyzai'
echo "GRANT ALL ON SCHEMA public TO analyzai\gexec" | \
PGPASSWORD=$PGPASSWORD psql -h 127.0.0.1 --user postgres analyzai

# Final confirmation message
echo "✅ Postgres container is running and the 'analyzai' database is ready."