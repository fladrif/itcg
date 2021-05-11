.PHONY: build

build: 
	docker build -f Dockerfile -t itcg .

stop-client:
	docker stop itcg-client || true

stop-server:
	docker stop itcg-server || true

network:
	docker network create itcg-backend || true

start-db: network
	docker run -d --name itcg-db -e POSTGRES_PASSWORD=itcg --network itcg-backend postgres

start-client: build stop-client
	docker run -d --rm --name itcg-client -p 13000:13000 itcg ./node_modules/.bin/serve -s build -l 13000

start-server: build network stop-server
	docker run -d --rm --name itcg-server --network itcg-backend -p 18000:18000 itcg node lib/server.js
