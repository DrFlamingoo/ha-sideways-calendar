import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { renderTimeline } from "./timeline-svg.js";
import {
  RawEvent,
  TimelineEvent,
  CalendarInfo,
  CalendarEntry,
  normalizeSlotValue,
  assignLanes,
} from "./layout.js";
import {
  getScheme,
  calendarColor,
  eventColor,
} from "./colors.js";
import "./editor.js";

interface CardConfig {
  type: string;
  colorScheme?: string;
  workStyle?: string;
  showDeclined?: boolean;
  showTentative?: boolean;
  inlineLabels?: boolean;
  calendarA?: CalendarEntry[];
  calendarB?: CalendarEntry[];
  calendarC?: CalendarEntry[];
  calendarD?: CalendarEntry[];
  emailA?: string;
  emailB?: string;
  emailC?: string;
  emailD?: string;
  nameA?: string;
  nameB?: string;
  nameC?: string;
  nameD?: string;
  personA?: string;
  personB?: string;
  personC?: string;
  personD?: string;
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
  attendees?: HAAttendee[];
}

interface HAAttendee {
  email?: string;
  name?: string;
  response?: string; // "accepted" | "declined" | "tentative" | "needsAction"
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

  private static readonly SLOTS = [
    "calendarA",
    "calendarB",
    "calendarC",
    "calendarD",
  ] as const;

  private static readonly SLOT_LABELS = ["A", "B", "C", "D"];
  private static readonly NAME_KEYS = ["nameA", "nameB", "nameC", "nameD"] as const;
  private static readonly PERSON_KEYS = ["personA", "personB", "personC", "personD"] as const;

  /** Build a map from entity_id → slot keys (one entity may appear in multiple slots). */
  private _entityToSlots(): Map<string, string[]> {
    const map = new Map<string, string[]>();
    for (const slot of SidewaysCalendarCard.SLOTS) {
      const entries = this._config?.[slot];
      if (!entries) continue;
      for (const e of entries) {
        const arr = map.get(e.entity);
        if (arr) { if (!arr.includes(slot)) arr.push(slot); }
        else map.set(e.entity, [slot]);
      }
    }
    return map;
  }

  private static readonly EMAIL_KEYS = ["emailA", "emailB", "emailC", "emailD"] as const;

  /** Build a map from slot key → owner email. */
  private _slotToEmail(): Map<string, string> {
    const map = new Map<string, string>();
    for (let i = 0; i < SidewaysCalendarCard.SLOTS.length; i++) {
      const email = this._config?.[SidewaysCalendarCard.EMAIL_KEYS[i]];
      if (email) map.set(SidewaysCalendarCard.SLOTS[i], email.toLowerCase());
    }
    return map;
  }

  /** Set of entity IDs flagged as "work" across all slots. */
  private _workEntities(): Set<string> {
    const set = new Set<string>();
    for (const slot of SidewaysCalendarCard.SLOTS) {
      const entries = this._config?.[slot];
      if (!entries) continue;
      for (const e of entries) {
        if (e.work) set.add(e.entity);
      }
    }
    return set;
  }

  /** All unique entity IDs across all slots. */
  private _allEntityIds(): string[] {
    const ids: string[] = [];
    for (const slot of SidewaysCalendarCard.SLOTS) {
      const entries = this._config?.[slot];
      if (!entries) continue;
      for (const e of entries) {
        if (!ids.includes(e.entity)) ids.push(e.entity);
      }
    }
    return ids;
  }

  /** Slot keys that have at least one entity. */
  private _activeSlots(): typeof SidewaysCalendarCard.SLOTS[number][] {
    return SidewaysCalendarCard.SLOTS.filter(
      (slot) => (this._config?.[slot]?.length ?? 0) > 0,
    );
  }

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

  setConfig(config: Record<string, unknown>) {
    const normalized: CardConfig = {
      type: config.type as string,
      colorScheme: config.colorScheme as string | undefined,
      workStyle: config.workStyle as string | undefined,
      showDeclined: config.showDeclined as boolean | undefined,
      showTentative: config.showTentative as boolean | undefined,
      inlineLabels: config.inlineLabels as boolean | undefined,
    };
    for (let i = 0; i < SidewaysCalendarCard.SLOTS.length; i++) {
      const slot = SidewaysCalendarCard.SLOTS[i];
      const val = normalizeSlotValue(
        config[slot] as string | CalendarEntry[] | undefined,
      );
      if (val) normalized[slot] = val;
      const email = config[SidewaysCalendarCard.EMAIL_KEYS[i]] as string | undefined;
      if (email) normalized[SidewaysCalendarCard.EMAIL_KEYS[i]] = email;
      const name = config[SidewaysCalendarCard.NAME_KEYS[i]] as string | undefined;
      if (name) normalized[SidewaysCalendarCard.NAME_KEYS[i]] = name;
      const person = config[SidewaysCalendarCard.PERSON_KEYS[i]] as string | undefined;
      if (person) normalized[SidewaysCalendarCard.PERSON_KEYS[i]] = person;
    }
    this._config = normalized;
    this._lastFetchKey = "";
    this._buildCalendarInfos();
    this._tryFetchEvents();
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return { rows: "auto", columns: "full", min_rows: 2, min_columns: 6 };
  }

  static getStubConfig(hass: Hass) {
    const calendars = Object.keys(hass.states).filter((e) =>
      e.startsWith("calendar.")
    );
    const stub: Record<string, unknown> = {};
    for (let i = 0; i < Math.min(calendars.length, 4); i++) {
      stub[SidewaysCalendarCard.SLOTS[i]] = [{ entity: calendars[i] }];
    }
    return stub;
  }

  static getConfigElement() {
    return document.createElement("sideways-calendar-card-editor");
  }

  private _buildCalendarInfos() {
    const scheme = getScheme(this._config?.colorScheme);
    const active = this._activeSlots();
    this._calendars = active.map((slot, i) => {
      const slotIdx = SidewaysCalendarCard.SLOTS.indexOf(slot);
      const customName = this._config?.[SidewaysCalendarCard.NAME_KEYS[slotIdx]];
      const entries = this._config[slot]!;
      const fallbackName =
        (this._hass?.states[entries[0].entity]?.attributes
          ?.friendly_name as string) || entries[0].entity;
      return {
        id: slot,
        name: customName || fallbackName,
        color: calendarColor(i, scheme),
      };
    });
  }

  private _tryFetchEvents() {
    if (!this._hass || !this._config) return;
    const today = new Date().toISOString().split("T")[0];
    const cals = this._allEntityIds().join(",");
    const key = `${today}|${cals}`;
    if (key === this._lastFetchKey) return;
    this._lastFetchKey = key;
    this._buildCalendarInfos();
    this._fetchEvents();
  }

  private async _fetchEvents() {
    const hass = this._hass!;
    const entityIds = this._allEntityIds();
    if (entityIds.length === 0) {
      this._events = [];
      return;
    }

    const entityToSlots = this._entityToSlots();
    const slotToEmail = this._slotToEmail();
    const workEntities = this._workEntities();
    const showDeclined = this._config?.showDeclined ?? false;
    const showTentative = this._config?.showTentative ?? true;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const start = startOfDay.toISOString();
    const end = endOfDay.toISOString();

    /** Per-slot buckets: personal events and work events kept separate. */
    const slotPersonal = new Map<string, RawEvent[]>();
    const slotWork = new Map<string, RawEvent[]>();

    await Promise.all(
      entityIds.map(async (entityId) => {
        const slotIds = entityToSlots.get(entityId);
        if (!slotIds?.length) return;
        const isWork = workEntities.has(entityId);
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

            /* Fan out to every slot that references this entity */
            for (const slotId of slotIds) {
              /* ---- attendance filter by owner email ---- */
              const ownerEmail = slotToEmail.get(slotId);
              if (e.attendees?.length && ownerEmail) {
                const self = e.attendees.find(
                  (a) => a.email?.toLowerCase() === ownerEmail,
                );
                if (self) {
                  if (self.response === "declined" && !showDeclined) continue;
                  if (self.response === "tentative" && !showTentative) continue;
                }
              }

              const raw: RawEvent = {
                id: `${slotId}|${e.summary}|${eStart.toISOString()}`,
                start: clampedStart,
                end: clampedEnd,
                title: e.summary,
                calendarIds: [slotId],
                work: isWork,
              };

              const bucket = isWork ? slotWork : slotPersonal;
              if (!bucket.has(slotId)) bucket.set(slotId, []);
              bucket.get(slotId)!.push(raw);
            }
          }
        } catch (err) {
          console.error(`Failed to fetch events for ${entityId}:`, err);
        }
      }),
    );

    /* ---- envelope detection: match "work.*" personal events to work sub-events ---- */
    const allEvents: RawEvent[] = [];
    const consumedWorkEvents = new Set<string>(); // IDs of work events nested inside envelopes

    for (const slot of SidewaysCalendarCard.SLOTS) {
      const personal = slotPersonal.get(slot) || [];
      const work = slotWork.get(slot) || [];

      for (const ev of personal) {
        if (/^work/i.test(ev.title) && work.length > 0) {
          /* Find work events that fit within this envelope's time range */
          const children = work.filter(
            (w) => w.start.getTime() >= ev.start.getTime() &&
                   w.end.getTime() <= ev.end.getTime(),
          );
          if (children.length > 0) {
            ev.envelope = true;
            ev.children = children;
            for (const c of children) consumedWorkEvents.add(c.id);
          }
        }
        allEvents.push(ev);
      }

      /* Add work events that were NOT consumed by any envelope */
      for (const w of work) {
        if (!consumedWorkEvents.has(w.id)) allEvents.push(w);
      }
    }

    /* ---- merge duplicates (same title + same start + same end, rounded to minute) ---- */
    const roundMin = (d: Date) => Math.round(d.getTime() / 60_000);
    const mergeMap = new Map<string, RawEvent>();
    for (const event of allEvents) {
      const key = `${event.title.trim()}|${roundMin(event.start)}|${roundMin(event.end)}`;
      const existing = mergeMap.get(key);
      if (existing) {
        for (const cid of event.calendarIds) {
          if (!existing.calendarIds.includes(cid)) {
            existing.calendarIds.push(cid);
          }
        }
        /* work only if ALL sources are work */
        if (!event.work) existing.work = false;
        /* merge children from envelope events (de-duplicate by title+time) */
        if (event.envelope) {
          existing.envelope = true;
          const prev = existing.children || [];
          const prevKeys = new Set(
            prev.map((c) => `${c.title}|${roundMin(c.start)}|${roundMin(c.end)}`),
          );
          for (const child of event.children || []) {
            const ck = `${child.title}|${roundMin(child.start)}|${roundMin(child.end)}`;
            const dup = prev.find(
              (c) => `${c.title}|${roundMin(c.start)}|${roundMin(c.end)}` === ck,
            );
            if (dup) {
              /* merge calendarIds into existing child */
              for (const cid of child.calendarIds) {
                if (!dup.calendarIds.includes(cid)) dup.calendarIds.push(cid);
              }
            } else {
              prev.push(child);
              prevKeys.add(ck);
            }
          }
          existing.children = prev;
        }
      } else {
        mergeMap.set(key, event);
      }
    }

    this._events = assignLanes([...mergeMap.values()]);
  }

  render() {
    const userName = this._hass?.user?.name || "User";
    const scheme = getScheme(this._config?.colorScheme);
    const calIds = this._calendars.map((c) => c.id);
    const workStyle = this._config?.workStyle || "dimmed";
    const inlineLabels = this._config?.inlineLabels ?? false;
    const calNames = this._calendars.map((c) => c.name);

    /* Build legend only from calendarId combos that actually appear in events */
    const combos: Array<{ label: string; ids: string[]; color: string }> = [];
    if (this._calendars.length > 1) {
      const seen = new Set<string>();
      for (const ev of this._events) {
        if (ev.calendarIds.length < 2) continue;
        const key = [...ev.calendarIds].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        const label = ev.calendarIds
          .map((id) => {
            const idx = calIds.indexOf(id);
            return idx >= 0 ? calNames[idx] : id;
          })
          .join(" + ");
        combos.push({
          label,
          ids: ev.calendarIds,
          color: eventColor(ev.calendarIds, calIds, scheme),
        });
      }
    }

    return html`
      <ha-card header="${userName}'s Calendar">
        <div class="card-content">
          ${this._calendars.length === 0
            ? html`<p class="empty">No calendars configured.</p>`
            : renderTimeline(this._events, this._calendars, this._now, undefined, scheme, workStyle, inlineLabels)}
          ${combos.length > 0
            ? html`
              <div class="legend">
                ${combos.map(
                  (c) => html`
                    <span class="legend-item">
                      <span class="legend-swatch" style="background:${c.color}"></span>
                      ${c.label}
                    </span>
                  `,
                )}
              </div>`
            : ""}
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
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 12px;
      padding-top: 8px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .legend-swatch {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 2px;
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
