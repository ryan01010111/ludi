#! /usr/bin/env bash

docker_compose_files_args='-f docker-compose.yaml -f docker-compose.development.yaml'

function await_postgres() {
    local try_count=0;
    while true; do
        if [[ try_count -ge 60 ]]; then
            echo 'Postgres not ready after 1 min'
            exit 1
        fi
        ((try_count+=1))
        echo "Trying Postgres (${try_count}/60):"
        set +e
        docker compose exec -T postgres pg_isready && break
        set -e
        sleep 1
    done
}

set -e

docker compose $docker_compose_files_args up -d postgres 
await_postgres
docker compose exec -T postgres psql -U postgres -c 'CREATE DATABASE ludi;'

docker compose $docker_compose_files_args up -d server 

exit $?
