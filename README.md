# Sideways Calendar Card

A Home Assistant custom card that displays a horizontal 24-hour timeline of your day, with calendar events visualized as boxes along a time axis.

## Features

- **24-hour timeline** — horizontal axis with labeled time ticks
- **Per-calendar colors** — each calendar gets a distinct color line running along the axis
- **Event boxes** — events appear as boxes below the axis, positioned to their start/end times
- **Lane stacking** — overlapping events stack into lanes without overlap (git-branch-style routing)
- **User greeting** — card title shows the logged-in user's name
- **Calendar selection** — config option to choose which CalDAV calendars to display

## Roadmap

- [x] Basic card with event count per calendar
- [ ] SVG timeline rendering (axis, time labels, event boxes)
- [ ] Lane assignment for overlapping events
- [ ] Git-branch-style line routing from calendar lines to event lanes
- [ ] Additive color mixing for multi-calendar events
- [ ] Content above the axis (TBD)

## Installation

### HACS (recommended)

1. Open HACS in your Home Assistant instance.
2. Go to **Frontend** → **⋮** (top right) → **Custom repositories**.
3. Add this repository URL and select **Dashboard** as the category.
4. Search for "Sideways Calendar Card" and install it.
5. Restart Home Assistant.

### Manual

1. Download `sideways-calendar-card.js` from the [latest release](../../releases/latest).
2. Copy it to `<ha-config>/www/sideways-calendar-card.js`.
3. In Home Assistant, go to **Settings** → **Dashboards** → **⋮** → **Resources**.
4. Add `/local/sideways-calendar-card.js` with type **JavaScript Module**.
5. Restart Home Assistant.

## Usage

Add the card to a dashboard:

```yaml
type: custom:sideways-calendar-card
calendars:
  - calendar.personal
  - calendar.work
```

| Option      | Type     | Default | Description                              |
|-------------|----------|---------|------------------------------------------|
| `calendars` | string[] | `[]`    | List of `calendar.*` entity IDs to show. |

The card also supports the visual editor — click the pencil icon to select calendars in the UI.

## Development

```sh
npm install
```

### Make targets

| Target           | Description                                              |
|------------------|----------------------------------------------------------|
| `make build`     | Build the card to `dist/sideways-calendar-card.js`       |
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
3. Add the resource: **Settings** → **Dashboards** → **⋮** → **Resources** → add `/local/sideways-calendar-card.js` as **JavaScript Module**.
4. Add the card to a dashboard.
5. Edit source, run `make build`, then hard-refresh the browser (`Ctrl+Shift+R`).
6. `make ha-stop` when done.
