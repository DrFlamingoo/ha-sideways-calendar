# Hello World Card

A minimal Home Assistant custom card that displays a configurable string.

## Installation

### HACS (recommended)

1. Open HACS in your Home Assistant instance.
2. Go to **Frontend** → **⋮** (top right) → **Custom repositories**.
3. Add this repository URL and select **Dashboard** as the category.
4. Search for "Hello World Card" and install it.
5. Restart Home Assistant.

### Manual

1. Download `ha-hello-world-card.js` from the [latest release](../../releases/latest).
2. Copy it to `<ha-config>/www/ha-hello-world-card.js`.
3. In Home Assistant, go to **Settings** → **Dashboards** → **⋮** → **Resources**.
4. Add `/local/ha-hello-world-card.js` with type **JavaScript Module**.
5. Restart Home Assistant.

## Usage

Add the card to a dashboard:

```yaml
type: custom:ha-hello-world-card
message: "Hello World"
```

| Option    | Type   | Default       | Description               |
|-----------|--------|---------------|---------------------------|
| `message` | string | `Hello World` | The text to display.      |

The card also supports the visual editor — click the pencil icon to edit the message in the UI.

## Development

```sh
npm install
```

### Make targets

| Target           | Description                                              |
|------------------|----------------------------------------------------------|
| `make build`     | Build the card to `dist/ha-hello-world-card.js`          |
| `make watch`     | Rebuild automatically on source changes                  |
| `make ha-start`  | Build and start a throwaway HA instance on `:8123`       |
| `make ha-stop`   | Remove the test HA container                             |
| `make ha-restart`| Rebuild the card and restart the HA container            |
| `make ha-logs`   | Tail the HA container logs                               |
| `make ha-open`   | Open HA in the browser                                   |
| `make clean`     | Remove `dist/`                                           |

### Testing workflow

1. `make ha-start` — builds the card and spins up HA in Docker.
2. Complete the HA onboarding at `http://localhost:8123`.
3. Add the resource: **Settings** → **Dashboards** → **⋮** → **Resources** → add `/local/ha-hello-world-card.js` as **JavaScript Module**.
4. Add the card to a dashboard.
5. Edit source, run `make build`, then hard-refresh the browser (`Ctrl+Shift+R`).
6. `make ha-stop` when done.
