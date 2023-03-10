.PHONY: build

build: 
	docker build -f Dockerfile -t itcg .

stop-client:
	docker stop itcg-client || true

stop-server:
	docker stop itcg-server || true

network:
	docker network create itcg-backend || true

create-local-db:
	docker run --rm -d --name itcg-db -e POSTGRES_DB=itcg -e POSTGRES_PASSWORD=itcg -p 5432:5432 postgres:13
	echo 'Run the following to run migrations'
	echo 'npm run create-db-local'
	echo 'npm run migrate-up-local'

run-migration: network
	docker run -d --rm --name itcg-migration -e POSTGRES_DB=user -e POSTGRES_PASSWORD=itcg --network itcg-backend itcg npm run migrate-up

start-db: network
	docker run -d --name itcg-db -e POSTGRES_DB=itcg -e POSTGRES_PASSWORD=itcg --volume /data/postgres-data:/var/lib/postgresql/data --network itcg-backend postgres:13

start-client: build stop-client
	docker run -d --rm --name itcg-client -p 13000:13000 itcg ./node_modules/.bin/serve -s build -l 13000

start-server: build network stop-server run-migration
	docker run -d --rm --name itcg-server --network itcg-backend -p 18000:18000 itcg node server/lib/server/src/index.js
