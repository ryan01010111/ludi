#! /usr/bin/env bash

docker_compose_files_args='-f docker-compose.yaml'
if [[ -z $CI ]]; then
    docker_compose_files_args+=" -f docker-compose.development.yaml"
fi

start_and_await() {
    local service=$1
    local status_check_command=$2
    docker compose $docker_compose_files_args up -d $service
    set +e
    local try_count=0
    while true; do
        if [[ try_count -ge 60 ]]; then
            echo `>>> ${service} not ready after 1 min`
            exit 1
        fi
        ((try_count+=1))
        printf "\n::::: Trying [ ${service} ] (${try_count}/60):\n"
        docker compose exec -T $service $status_check_command && break
        sleep 1
    done
    set -e
}

set -e

start_and_await postgres pg_isready
docker compose exec -T postgres psql -U postgres -c 'CREATE DATABASE ludi;'

start_and_await mockserver 'curl http://localhost/status'

docker compose $docker_compose_files_args up -d

exit $?
