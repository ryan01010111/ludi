#! /usr/bin/env bash

docker_compose_files_args='-f docker-compose.yaml'
if [[ -z $CI ]]; then
    docker_compose_files_args+=" -f docker-compose.development.yaml"
fi

await_postgres() {
    set +e
    local try_count=0
    while true; do
        if [[ try_count -ge 60 ]]; then
            echo 'Postgres not ready after 1 min'
            exit 1
        fi
        ((try_count+=1))
        echo "Trying Postgres (${try_count}/60):"
        docker compose exec -T postgres pg_isready && break
        sleep 1
    done
    set -e
}

set -e

docker compose $docker_compose_files_args up -d postgres 
await_postgres
docker compose exec -T postgres psql -U postgres -c 'CREATE DATABASE ludi;'

# TODO: status check
docker compose $docker_compose_files_args up -d mockserver 
docker compose $docker_compose_files_args up -d server 

exit $?
