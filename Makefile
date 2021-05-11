.PHONY: build

build: 
	docker build -f Dockerfile -t itcg .

stop-client:
	docker stop itcg-client || true

stop-server:
	docker stop itcg-server || true

start-client: build stop-client
	docker run -d --rm --name itcg-client -p 13000:13000 itcg ./node_modules/.bin/serve -s build -l 13000

start-server: build stop-server
	docker run -d --rm --name itcg-server -p 18000:18000 itcg node lib/server.js
