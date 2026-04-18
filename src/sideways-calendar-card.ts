import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";

interface CardConfig {
  type: string;
  calendars?: string[];
}

interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

interface Hass {
  user: { name: string };
  states: Record<string, HassEntity>;
  callApi: <T>(method: string, path: string) => Promise<T>;
}

interface CalendarEventCount {
  entity_id: string;
  name: string;
  count: number;
}

@customElement("sideways-calendar-card")
export class SidewaysCalendarCard extends LitElement {
  @state() private _config!: CardConfig;
  @state() private _eventCounts: CalendarEventCount[] = [];
  private _hass?: Hass;
  private _lastFetchKey = "";

  set hass(hass: Hass) {
    this._hass = hass;
    this._tryFetchEvents();
    this.requestUpdate();
  }

  get hass(): Hass | undefined {
    return this._hass;
  }

  setConfig(config: CardConfig) {
    this._config = config;
    this._lastFetchKey = "";
    this._tryFetchEvents();
  }

  getCardSize() {
    return 2;
  }

  getGridOptions() {
    return { rows: 2, columns: 6, min_rows: 2, min_columns: 3 };
  }

  static getStubConfig(hass: Hass) {
    const calendars = Object.keys(hass.states).filter((e) =>
      e.startsWith("calendar.")
    );
    return { calendars: calendars.slice(0, 5) };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "calendars",
          selector: {
            entity: {
              domain: "calendar",
              multiple: true,
            },
          },
        },
      ],
    };
  }

  private _tryFetchEvents() {
    if (!this._hass || !this._config) return;
    const today = new Date().toISOString().split("T")[0];
    const cals = (this._config.calendars || []).slice().sort().join(",");
    const key = `${today}|${cals}`;
    if (key === this._lastFetchKey) return;
    this._lastFetchKey = key;
    this._fetchEvents();
  }

  private async _fetchEvents() {
    const hass = this._hass!;
    const calendars = this._config.calendars || [];
    if (calendars.length === 0) {
      this._eventCounts = [];
      return;
    }

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const start = startOfDay.toISOString();
    const end = endOfDay.toISOString();

    const counts: CalendarEventCount[] = await Promise.all(
      calendars.map(async (entityId) => {
        const stateObj = hass.states[entityId];
        const name =
          (stateObj?.attributes?.friendly_name as string) || entityId;
        try {
          const events = await hass.callApi<unknown[]>(
            "GET",
            `calendars/${entityId}?start=${start}&end=${end}`
          );
          return { entity_id: entityId, name, count: events.length };
        } catch (e) {
          console.error(`Failed to fetch events for ${entityId}:`, e);
          return { entity_id: entityId, name, count: 0 };
        }
      })
    );

    this._eventCounts = counts;
  }

  render() {
    const userName = this._hass?.user?.name || "User";

    return html`
      <ha-card header="${userName}'s Calendar">
        <div class="card-content">
          ${this._eventCounts.length === 0
            ? html`<p class="empty">No calendars configured.</p>`
            : this._eventCounts.map(
                (cal) => html`
                  <div class="calendar-row">
                    <span class="calendar-name">${cal.name}</span>
                    <span class="event-count">${cal.count}</span>
                  </div>
                `
              )}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    ha-card {
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .card-content {
      padding: 0 16px 16px;
    }
    .calendar-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .calendar-row:last-child {
      border-bottom: none;
    }
    .calendar-name {
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .event-count {
      font-size: 20px;
      font-weight: bold;
      color: var(--primary-color);
      min-width: 32px;
      text-align: center;
    }
    .empty {
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `;
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "sideways-calendar-card",
  name: "Sideways Calendar Card",
  description:
    "Displays the number of events for today per configured calendar.",
});

declare global {
  interface Window {
    customCards: Array<{ type: string; name: string; description?: string }>;
  }
}
