CARD_FILE := dist/sideways-calendar-card.js
CONTAINER := ha-test
HA_IMAGE := ghcr.io/home-assistant/home-assistant:stable
HA_PORT := 8123

.PHONY: build watch ha-start ha-stop ha-restart ha-logs ha-open clean

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

clean:
	rm -rf dist
