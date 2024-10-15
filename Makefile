.PHONY: build

build: 
	docker build -f Dockerfile -t itcg .

save:
	docker save -o itcg.tar itcg:latest

deploy: build save
	rm -rf itcgImage/*
	tar -xf itcg.tar -C itcgImage
	rsync --delete --progress -acv itcgImage ubuntu@$(shell dig maple.rs | grep ^maple.rs. | cut -f 6):~/

stop-client:
	docker stop itcg-client || true
	sleep 1

stop-server:
	docker stop itcg-server || true
	sleep 1

network:
	docker network create itcg-backend || true

create-local-db:
	docker run --rm -d --name itcg-db -e POSTGRES_DB=itcg -e POSTGRES_PASSWORD=itcg -p 5432:5432 postgres:13
	@echo '### Run the following to run migrations ###'
	@echo '1. npm run create-db-local'
	@echo '2. npm run migrate-up-local'

run-migration: network
	docker run -d --rm --name itcg-migration -e POSTGRES_DB=user -e POSTGRES_PASSWORD=itcg --network itcg-backend itcg npm run migrate-up

start-db: network
	docker run -d --name itcg-db -e POSTGRES_DB=itcg -e POSTGRES_PASSWORD=itcg --volume /data/postgres-data:/var/lib/postgresql/data --network itcg-backend postgres:13

load:
	tar -cvf itcg.tar -C ../itcgImage .
	docker load -i itcg.tar

start-client: stop-client
	docker run -d --rm --restart unless-stopped --name itcg-client -p 13000:13000 itcg ./node_modules/.bin/serve -s build -l 13000

start-server: network stop-server run-migration
	docker run -d --rm --restart unless-stopped --log-driver=journald --name itcg-server --network itcg-backend -p 18000:18000 itcg node server/lib/server/src/index.js

load-start: load start-client start-server
