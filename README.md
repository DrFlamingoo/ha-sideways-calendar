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
npm run build     # one-time build
npm run watch     # rebuild on changes
```

Output goes to `dist/ha-hello-world-card.js`.
