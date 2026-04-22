CARD_FILE := dist/sideways-calendar-card.js
CONTAINER := ha-test
HA_IMAGE := ghcr.io/home-assistant/home-assistant:stable
HA_PORT := 8123

.PHONY: build watch ha-start ha-stop ha-restart ha-logs ha-open ha-sample clean

build:
	npm run build

watch:
	npm run watch

ha-start: build
	@docker inspect $(CONTAINER) >/dev/null 2>&1 && docker rm -f $(CONTAINER) || true
	docker run -d --name $(CONTAINER) \
		-p $(HA_PORT):8123 \
		-v $(CURDIR)/$(CARD_FILE):/config/www/sideways-calendar-card.js:ro \
		$(HA_IMAGE)
	@echo "HA starting at http://localhost:$(HA_PORT)"
	@echo "Add resource: /local/sideways-calendar-card.js (JS module)"

ha-stop:
	docker rm -f $(CONTAINER)

ha-restart: build
	docker restart $(CONTAINER)

ha-logs:
	docker logs -f $(CONTAINER)

ha-open:
	xdg-open http://localhost:$(HA_PORT)

ha-sample:
	@if [ -z "$(HA_TOKEN)" ]; then \
		echo "Set HA_TOKEN first: export HA_TOKEN=<your long-lived token>"; \
		exit 1; \
	fi
	./scripts/sample-day.sh http://localhost:$(HA_PORT) $(HA_TOKEN)

clean:
	rm -rf dist
