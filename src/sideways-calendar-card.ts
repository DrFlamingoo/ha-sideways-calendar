import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { renderTimeline } from "./timeline-svg.js";
import {
  RawEvent,
  TimelineEvent,
  CalendarInfo,
  CALENDAR_COLORS,
  assignLanes,
} from "./layout.js";

interface CardConfig {
  type: string;
  calendars?: string[];
}

interface HACalendarEventTime {
  dateTime?: string;
  date?: string;
}

interface HACalendarEvent {
  start: HACalendarEventTime;
  end: HACalendarEventTime;
  summary: string;
  uid?: string;
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

function parseEventTime(time: HACalendarEventTime, fallback: Date): Date {
  if (time.dateTime) return new Date(time.dateTime);
  if (time.date) return new Date(time.date + "T00:00:00");
  return fallback;
}

@customElement("sideways-calendar-card")
export class SidewaysCalendarCard extends LitElement {
  @state() private _config!: CardConfig;
  @state() private _events: TimelineEvent[] = [];
  @state() private _calendars: CalendarInfo[] = [];
  @state() private _now = new Date();

  private _hass?: Hass;
  private _lastFetchKey = "";
  private _timer?: number;

  set hass(hass: Hass) {
    this._hass = hass;
    this._tryFetchEvents();
    this.requestUpdate();
  }

  get hass(): Hass | undefined {
    return this._hass;
  }

  connectedCallback() {
    super.connectedCallback();
    this._timer = window.setInterval(() => {
      this._now = new Date();
    }, 60_000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  setConfig(config: CardConfig) {
    this._config = config;
    this._lastFetchKey = "";
    this._buildCalendarInfos();
    this._tryFetchEvents();
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return { rows: 3, columns: 12, min_rows: 2, min_columns: 6 };
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

  private _buildCalendarInfos() {
    const calIds = this._config?.calendars || [];
    this._calendars = calIds.map((entityId, i) => {
      const name =
        (this._hass?.states[entityId]?.attributes?.friendly_name as string) ||
        entityId;
      return {
        entityId,
        name,
        color: CALENDAR_COLORS[i % CALENDAR_COLORS.length],
      };
    });
  }

  private _tryFetchEvents() {
    if (!this._hass || !this._config) return;
    const today = new Date().toISOString().split("T")[0];
    const cals = (this._config.calendars || []).slice().sort().join(",");
    const key = `${today}|${cals}`;
    if (key === this._lastFetchKey) return;
    this._lastFetchKey = key;
    this._buildCalendarInfos();
    this._fetchEvents();
  }

  private async _fetchEvents() {
    const hass = this._hass!;
    const calIds = this._config.calendars || [];
    if (calIds.length === 0) {
      this._events = [];
      return;
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const start = startOfDay.toISOString();
    const end = endOfDay.toISOString();

    const rawEvents: RawEvent[] = [];

    await Promise.all(
      calIds.map(async (entityId) => {
        try {
          const haEvents = await hass.callApi<HACalendarEvent[]>(
            "GET",
            `calendars/${entityId}?start=${start}&end=${end}`,
          );
          for (const e of haEvents) {
            const eStart = parseEventTime(e.start, startOfDay);
            const eEnd = parseEventTime(e.end, endOfDay);
            const clampedStart = new Date(
              Math.max(eStart.getTime(), startOfDay.getTime()),
            );
            const clampedEnd = new Date(
              Math.min(eEnd.getTime(), endOfDay.getTime()),
            );
            rawEvents.push({
              id: `${entityId}|${e.summary}|${eStart.toISOString()}`,
              start: clampedStart,
              end: clampedEnd,
              title: e.summary,
              calendarIds: [entityId],
            });
          }
        } catch (err) {
          console.error(`Failed to fetch events for ${entityId}:`, err);
        }
      }),
    );

    /* ---- merge duplicates (same title + same start + same end, rounded to minute) ---- */
    const roundMin = (d: Date) => Math.round(d.getTime() / 60_000);
    const mergeMap = new Map<string, RawEvent>();
    for (const event of rawEvents) {
      const key = `${event.title}|${roundMin(event.start)}|${roundMin(event.end)}`;
      const existing = mergeMap.get(key);
      if (existing) {
        for (const cid of event.calendarIds) {
          if (!existing.calendarIds.includes(cid)) {
            existing.calendarIds.push(cid);
          }
        }
      } else {
        mergeMap.set(key, event);
      }
    }

    this._events = assignLanes([...mergeMap.values()]);
  }

  render() {
    const userName = this._hass?.user?.name || "User";

    return html`
      <ha-card header="${userName}'s Calendar">
        <div class="card-content">
          ${this._calendars.length === 0
            ? html`<p class="empty">No calendars configured.</p>`
            : renderTimeline(this._events, this._calendars, this._now)}
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
