COMPOSE=docker compose

.PHONY: watch build down

watch:
	$(COMPOSE) watch

build:
	$(COMPOSE) build

down:
	$(COMPOSE) down