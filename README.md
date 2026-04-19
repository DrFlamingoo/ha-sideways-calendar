# Sideways Calendar Card

A Home Assistant custom Lovelace card that displays a horizontal 24-hour timeline of your day, with git-branch-style calendar lines routing to event boxes.

## Features

- **24-hour horizontal timeline** — time axis with labeled ticks
- **Git-branch-style routing** — each person's calendar line branches down to their events via smooth cubic bezier curves, then returns to the axis
- **Up to 4 person slots (A–D)** — each slot can hold multiple calendar entities
- **Work calendar envelopes** — a "Work…" event on a personal calendar wraps matching work-calendar sub-events, showing them nested inside
- **Attendance filtering** — filter events by owner email; optionally show declined or tentative
- **Colorblind-safe colors** — default Tol scheme, plus additive, subtractive, and perceptual (OKLCH) options
- **Multi-calendar color mixing** — shared events get a blended color; legend shows only observed combinations
- **Lane stacking** — overlapping events stack into lanes without overlap
- **Inline labels** — optionally write person names directly on their calendar lines instead of the legend
- **Custom slot names** — override the display name per slot
- **Person entity linking** — associate a `person.*` entity with each slot
- **Work event styling** — dimmed (dashed, lower opacity) or no distinction
- **Visual config editor** — full GUI for all settings, no YAML required
- **Grid layout** — auto-height, full-width by default in HA sections view

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

Add the card to a dashboard via the visual editor, or in YAML:

```yaml
type: custom:sideways-calendar-card
calendarA:
  - entity: calendar.alice_personal
  - entity: calendar.alice_work
    work: true
calendarB:
  - entity: calendar.bob_personal
  - entity: calendar.bob_work
    work: true
nameA: Alice
nameB: Bob
emailA: alice@example.com
emailB: bob@example.com
colorScheme: colorblind
workStyle: dimmed
showDeclined: false
showTentative: true
inlineLabels: true
```

## Configuration

### General

| Option | Type | Default | Description |
|---|---|---|---|
| `colorScheme` | string | `"colorblind"` | Color scheme: `colorblind`, `additive`, `subtractive`, or `oklch` |
| `workStyle` | string | `"dimmed"` | How work events look: `"dimmed"` (dashed, low opacity) or `"normal"` |
| `showDeclined` | boolean | `false` | Show events you declined |
| `showTentative` | boolean | `true` | Show events you tentatively accepted |
| `inlineLabels` | boolean | `false` | Write names on calendar lines instead of the legend |

### Per-slot (A–D)

| Option | Type | Description |
|---|---|---|
| `calendarA`–`calendarD` | CalendarEntry[] | List of `{ entity, work? }` objects |
| `nameA`–`nameD` | string | Custom display name for the slot |
| `emailA`–`emailD` | string | Owner email for attendance filtering |
| `personA`–`personD` | string | Associated `person.*` entity ID |

Each `CalendarEntry` is `{ entity: "calendar.xxx", work?: true }`. The `work` flag marks the entity as a work calendar for envelope detection and dimmed styling.

## Development

```sh
npm install
```

### Make targets

| Target | Description |
|---|---|
| `make build` | Build the card to `dist/sideways-calendar-card.js` |
| `make watch` | Rebuild automatically on source changes |
| `make ha-start` | Build and start a throwaway HA instance on `:8123` |
| `make ha-stop` | Remove the test HA container |
| `make ha-restart` | Rebuild the card and restart the HA container |
| `make ha-logs` | Tail the HA container logs |
| `make ha-open` | Open HA in the browser |
| `make clean` | Remove `dist/` |

### Testing workflow

1. `make ha-start` — builds the card and spins up HA in Docker.
2. Complete the HA onboarding at `http://localhost:8123`.
3. Add the resource: **Settings** → **Dashboards** → **⋮** → **Resources** → add `/local/sideways-calendar-card.js` as **JavaScript Module**.
4. Add the card to a dashboard.
5. Edit source, run `make build`, then hard-refresh the browser (`Ctrl+Shift+R`).
6. `make ha-stop` when done.

### Project structure

```
src/
  types.ts                  — Shared types, constants, config normalization
  layout.ts                 — Layout computation, lane assignment, coordinate helpers
  colors.ts                 — Color schemes, mixing (OKLCH/additive/subtractive)
  timeline-svg.ts           — All SVG rendering (axis, lines, events, labels)
  sideways-calendar-card.ts — Main card element, HA integration, event fetching
  editor.ts                 — Visual config editor element
```
