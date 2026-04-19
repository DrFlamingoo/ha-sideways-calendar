import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { COLOR_SCHEMES, getScheme, calendarColor } from "./colors.js";
import { CalendarEntry, normalizeSlotValue } from "./layout.js";

interface CardConfig {
  type: string;
  colorScheme?: string;
  workStyle?: string;
  showDeclined?: boolean;
  showTentative?: boolean;
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

interface HassEntity {
  entity_id: string;
  attributes: Record<string, unknown>;
}

interface Hass {
  states: Record<string, HassEntity>;
}

const SLOTS = ["calendarA", "calendarB", "calendarC", "calendarD"] as const;
const SLOT_LABELS = ["A", "B", "C", "D"];
const WORK_STYLES = [
  { value: "dimmed", label: "Dimmed (dashed border, lower opacity)" },
  { value: "normal", label: "No distinction" },
];

@customElement("sideways-calendar-card-editor")
export class SidewaysCalendarCardEditor extends LitElement {
  @state() private _config!: CardConfig;
  @state() private _hass?: Hass;
  @state() private _expandedSlot: number | null = null;

  set hass(hass: Hass) {
    this._hass = hass;
  }

  private static readonly EMAIL_KEYS = ["emailA", "emailB", "emailC", "emailD"] as const;
  private static readonly NAME_KEYS = ["nameA", "nameB", "nameC", "nameD"] as const;
  private static readonly PERSON_KEYS = ["personA", "personB", "personC", "personD"] as const;

  setConfig(config: Record<string, unknown>) {
    const normalized: CardConfig = {
      type: config.type as string,
      colorScheme: config.colorScheme as string | undefined,
      workStyle: config.workStyle as string | undefined,
      showDeclined: config.showDeclined as boolean | undefined,
      showTentative: config.showTentative as boolean | undefined,
    };
    for (let i = 0; i < SLOTS.length; i++) {
      const val = normalizeSlotValue(
        config[SLOTS[i]] as string | CalendarEntry[] | undefined,
      );
      if (val) normalized[SLOTS[i]] = val;
      const email = config[SidewaysCalendarCardEditor.EMAIL_KEYS[i]] as string | undefined;
      if (email) normalized[SidewaysCalendarCardEditor.EMAIL_KEYS[i]] = email;
      const name = config[SidewaysCalendarCardEditor.NAME_KEYS[i]] as string | undefined;
      if (name) normalized[SidewaysCalendarCardEditor.NAME_KEYS[i]] = name;
      const person = config[SidewaysCalendarCardEditor.PERSON_KEYS[i]] as string | undefined;
      if (person) normalized[SidewaysCalendarCardEditor.PERSON_KEYS[i]] = person;
    }
    this._config = normalized;
  }

  private _fireChange() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _schemeChanged(e: Event) {
    const target = e.target as HTMLSelectElement;
    this._config = { ...this._config, colorScheme: target.value };
    this._fireChange();
  }

  private _workStyleChanged(e: Event) {
    const target = e.target as HTMLSelectElement;
    this._config = { ...this._config, workStyle: target.value };
    this._fireChange();
  }

  private _toggleShowDeclined() {
    this._config = { ...this._config, showDeclined: !(this._config.showDeclined ?? false) };
    this._fireChange();
  }

  private _toggleShowTentative() {
    this._config = { ...this._config, showTentative: !(this._config.showTentative ?? true) };
    this._fireChange();
  }

  private _addEntity(slot: typeof SLOTS[number], entityId: string) {
    if (!entityId) return;
    const current = this._config[slot] || [];
    if (current.some((e) => e.entity === entityId)) return;
    this._config = {
      ...this._config,
      [slot]: [...current, { entity: entityId }],
    };
    this._fireChange();
  }

  private _removeEntity(slot: typeof SLOTS[number], index: number) {
    const current = this._config[slot] || [];
    const updated = current.filter((_, i) => i !== index);
    const cfg = { ...this._config };
    if (updated.length === 0) {
      delete cfg[slot];
    } else {
      cfg[slot] = updated;
    }
    this._config = cfg;
    this._fireChange();
  }

  private _emailChanged(slotIndex: number, value: string) {
    const key = SidewaysCalendarCardEditor.EMAIL_KEYS[slotIndex];
    const cfg = { ...this._config };
    if (value) {
      cfg[key] = value;
    } else {
      delete cfg[key];
    }
    this._config = cfg;
    this._fireChange();
  }

  private _nameChanged(slotIndex: number, value: string) {
    const key = SidewaysCalendarCardEditor.NAME_KEYS[slotIndex];
    const cfg = { ...this._config };
    if (value) {
      cfg[key] = value;
    } else {
      delete cfg[key];
    }
    this._config = cfg;
    this._fireChange();
  }

  private _personChanged(slotIndex: number, value: string) {
    const key = SidewaysCalendarCardEditor.PERSON_KEYS[slotIndex];
    const cfg = { ...this._config };
    if (value) {
      cfg[key] = value;
    } else {
      delete cfg[key];
    }
    this._config = cfg;
    this._fireChange();
  }

  private _getPersonEntities(): string[] {
    if (!this._hass) return [];
    return Object.keys(this._hass.states)
      .filter((e) => e.startsWith("person."))
      .sort();
  }

  private _toggleWork(slot: typeof SLOTS[number], index: number) {
    const current = this._config[slot] || [];
    const updated = current.map((entry, i) =>
      i === index ? { ...entry, work: !entry.work } : entry,
    );
    this._config = { ...this._config, [slot]: updated };
    this._fireChange();
  }

  private _toggleSlot(index: number) {
    this._expandedSlot = this._expandedSlot === index ? null : index;
  }

  private _getCalendarEntities(): string[] {
    if (!this._hass) return [];
    return Object.keys(this._hass.states)
      .filter((e) => e.startsWith("calendar."))
      .sort();
  }

  private _friendlyName(entityId: string): string {
    return (
      (this._hass?.states[entityId]?.attributes?.friendly_name as string) ||
      entityId
    );
  }

  render() {
    const scheme = getScheme(this._config?.colorScheme);
    const calEntities = this._getCalendarEntities();

    return html`
      <div class="editor">
        <div class="section">
          <div class="section-header">
            <ha-icon icon="mdi:cog"></ha-icon>
            <span>General</span>
          </div>
          <div class="section-content column">
            <label class="field-label">Color Scheme</label>
            <select
              .value=${this._config?.colorScheme || "colorblind"}
              @change=${this._schemeChanged}
            >
              ${Object.values(COLOR_SCHEMES).map(
                (s) => html`
                  <option value=${s.name} ?selected=${s.name === (this._config?.colorScheme || "colorblind")}>
                    ${s.label}
                  </option>
                `,
              )}
            </select>
            <label class="field-label">Work Event Style</label>
            <select
              .value=${this._config?.workStyle || "dimmed"}
              @change=${this._workStyleChanged}
            >
              ${WORK_STYLES.map(
                (s) => html`
                  <option value=${s.value} ?selected=${s.value === (this._config?.workStyle || "dimmed")}>
                    ${s.label}
                  </option>
                `,
              )}
            </select>
            <label class="field-label">Attendance</label>
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${this._config?.showTentative ?? true}
                @change=${this._toggleShowTentative}
              />
              Show tentative events
            </label>
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${this._config?.showDeclined ?? false}
                @change=${this._toggleShowDeclined}
              />
              Show declined events
            </label>
          </div>
        </div>

        ${SLOTS.map((slot, i) => {
          const fallbackLabel = SLOT_LABELS[i];
          const customName = this._config?.[SidewaysCalendarCardEditor.NAME_KEYS[i]];
          const displayName = customName || `Calendar ${fallbackLabel}`;
          const color = calendarColor(i, scheme);
          const entries = this._config?.[slot] || [];
          const expanded = this._expandedSlot === i;
          const summary =
            entries.length > 0
              ? entries.map((e) => this._friendlyName(e.entity)).join(", ")
              : "(not set)";

          return html`
            <div class="section">
              <div
                class="section-header clickable"
                @click=${() => this._toggleSlot(i)}
              >
                <span class="color-dot" style="background:${color}"></span>
                <span class="slot-title">
                  ${displayName}
                  ${entries.length > 0
                    ? html` — <em>${summary}</em>`
                    : html` <span class="unset">${summary}</span>`}
                </span>
                <ha-icon
                  icon=${expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                ></ha-icon>
              </div>
              ${expanded
                ? html`
                    <div class="section-content column">
                      <label class="field-label">Name</label>
                      <input
                        type="text"
                        class="email-input"
                        placeholder="e.g. Alice, Bob…"
                        .value=${this._config?.[SidewaysCalendarCardEditor.NAME_KEYS[i]] || ""}
                        @change=${(e: Event) =>
                          this._nameChanged(i, (e.target as HTMLInputElement).value.trim())}
                      />
                      <label class="field-label">Person entity</label>
                      <select
                        .value=${this._config?.[SidewaysCalendarCardEditor.PERSON_KEYS[i]] || ""}
                        @change=${(e: Event) =>
                          this._personChanged(i, (e.target as HTMLSelectElement).value)}
                      >
                        <option value="">— None —</option>
                        ${this._getPersonEntities().map(
                          (eid) => html`
                            <option value=${eid}
                              ?selected=${eid === (this._config?.[SidewaysCalendarCardEditor.PERSON_KEYS[i]] || "")}>
                              ${this._friendlyName(eid)}
                            </option>
                          `,
                        )}
                      </select>
                      ${entries.length > 0
                        ? html`
                            <div class="entity-list">
                              ${entries.map(
                                (entry, ei) => html`
                                  <div class="entity-row">
                                    <span class="entity-name">
                                      ${this._friendlyName(entry.entity)}
                                    </span>
                                    <label class="work-toggle">
                                      <input
                                        type="checkbox"
                                        .checked=${!!entry.work}
                                        @change=${() =>
                                          this._toggleWork(slot, ei)}
                                      />
                                      Work
                                    </label>
                                    <button
                                      class="remove-btn"
                                      @click=${() =>
                                        this._removeEntity(slot, ei)}
                                    >
                                      ×
                                    </button>
                                  </div>
                                `,
                              )}
                            </div>
                          `
                        : ""}
                      <select
                        @change=${(e: Event) => {
                          const sel = e.target as HTMLSelectElement;
                          this._addEntity(slot, sel.value);
                          sel.value = "";
                        }}
                      >
                        <option value="">+ Add calendar…</option>
                        ${calEntities
                          .filter(
                            (eid) => !entries.some((e) => e.entity === eid),
                          )
                          .map(
                            (eid) => html`
                              <option value=${eid}>
                                ${this._friendlyName(eid)}
                              </option>
                            `,
                          )}
                      </select>
                      <label class="field-label">Owner email (for attendance filtering)</label>
                      <input
                        type="email"
                        class="email-input"
                        placeholder="user@example.com"
                        .value=${this._config?.[SidewaysCalendarCardEditor.EMAIL_KEYS[i]] || ""}
                        @change=${(e: Event) =>
                          this._emailChanged(i, (e.target as HTMLInputElement).value.trim())}
                      />
                    </div>
                  `
                : ""}
            </div>
          `;
        })}
      </div>
    `;
  }

  static styles = css`
    .editor {
      padding: 8px 0;
    }
    .section {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      margin-bottom: 8px;
      overflow: hidden;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      background: var(--card-background-color, #fff);
    }
    .section-header.clickable {
      cursor: pointer;
    }
    .section-header.clickable:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .slot-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .slot-title em {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .unset {
      color: var(--secondary-text-color);
      font-weight: 400;
    }
    .color-dot {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .section-content {
      padding: 8px 12px 12px;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .section-content.column {
      flex-direction: column;
      align-items: stretch;
    }
    .field-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      margin-bottom: -4px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .toggle-row input {
      cursor: pointer;
    }
    select {
      padding: 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .email-input {
      padding: 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .entity-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .entity-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      font-size: 13px;
    }
    .entity-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .work-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      cursor: pointer;
    }
    .work-toggle input {
      cursor: pointer;
    }
    .remove-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: none;
      color: var(--error-color, #db4437);
      font-size: 16px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .remove-btn:hover {
      background: var(--error-color, #db4437);
      color: #fff;
    }
  `;
}
