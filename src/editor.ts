import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { COLOR_SCHEMES, getScheme, calendarColor } from "./colors.js";

interface CardConfig {
  type: string;
  colorScheme?: string;
  calendarA?: string;
  calendarB?: string;
  calendarC?: string;
  calendarD?: string;
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

@customElement("sideways-calendar-card-editor")
export class SidewaysCalendarCardEditor extends LitElement {
  @state() private _config!: CardConfig;
  @state() private _hass?: Hass;
  @state() private _expandedSlot: number | null = null;

  set hass(hass: Hass) {
    this._hass = hass;
  }

  setConfig(config: CardConfig) {
    this._config = { ...config };
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

  private _calendarChanged(slot: typeof SLOTS[number], entityId: string) {
    this._config = { ...this._config, [slot]: entityId || undefined };
    this._fireChange();
  }

  private _clearCalendar(slot: typeof SLOTS[number]) {
    const updated = { ...this._config };
    delete updated[slot];
    this._config = updated;
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
            <ha-icon icon="mdi:palette"></ha-icon>
            <span>Color Scheme</span>
          </div>
          <div class="section-content">
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
          </div>
        </div>

        ${SLOTS.map((slot, i) => {
          const label = SLOT_LABELS[i];
          const color = calendarColor(i, scheme);
          const value = this._config?.[slot] || "";
          const expanded = this._expandedSlot === i;

          return html`
            <div class="section">
              <div
                class="section-header clickable"
                @click=${() => this._toggleSlot(i)}
              >
                <span class="color-dot" style="background:${color}"></span>
                <span class="slot-title">
                  Calendar ${label}
                  ${value
                    ? html` — <em>${this._friendlyName(value)}</em>`
                    : html` <span class="unset">(not set)</span>`}
                </span>
                <ha-icon
                  icon=${expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                ></ha-icon>
              </div>
              ${expanded
                ? html`
                    <div class="section-content">
                      <select
                        .value=${value}
                        @change=${(e: Event) =>
                          this._calendarChanged(
                            slot,
                            (e.target as HTMLSelectElement).value,
                          )}
                      >
                        <option value="">— Select calendar —</option>
                        ${calEntities.map(
                          (eid) => html`
                            <option value=${eid} ?selected=${eid === value}>
                              ${this._friendlyName(eid)}
                            </option>
                          `,
                        )}
                      </select>
                      ${value
                        ? html`
                            <button
                              class="clear-btn"
                              @click=${() => this._clearCalendar(slot)}
                            >
                              Clear
                            </button>
                          `
                        : ""}
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
    select {
      flex: 1;
      padding: 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .clear-btn {
      padding: 6px 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
      font-size: 13px;
    }
    .clear-btn:hover {
      background: var(--error-color, #db4437);
      color: #fff;
    }
  `;
}
