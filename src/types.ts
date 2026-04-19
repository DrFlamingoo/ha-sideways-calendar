/** Shared types, constants, and config helpers. */

import { CalendarEntry, normalizeSlotValue } from "./layout.js";

/* ------------------------------------------------------------------ */
/*  Card configuration                                                 */
/* ------------------------------------------------------------------ */

export interface CardConfig {
  type: string;
  colorScheme?: string;
  workStyle?: "dimmed" | "normal";
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

/* ------------------------------------------------------------------ */
/*  Slot constants                                                     */
/* ------------------------------------------------------------------ */

export const SLOTS = [
  "calendarA",
  "calendarB",
  "calendarC",
  "calendarD",
] as const;

export const SLOT_LABELS = ["A", "B", "C", "D"];

export const EMAIL_KEYS = [
  "emailA",
  "emailB",
  "emailC",
  "emailD",
] as const;

export const NAME_KEYS = [
  "nameA",
  "nameB",
  "nameC",
  "nameD",
] as const;

export const PERSON_KEYS = [
  "personA",
  "personB",
  "personC",
  "personD",
] as const;

/* ------------------------------------------------------------------ */
/*  Home Assistant types (subset used by card + editor)                 */
/* ------------------------------------------------------------------ */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface Hass {
  user: { name: string };
  states: Record<string, HassEntity>;
  callApi: <T>(method: string, path: string) => Promise<T>;
}

/** Editor only needs a subset of Hass. */
export type EditorHass = Pick<Hass, "states">;

/* ------------------------------------------------------------------ */
/*  Shared config normalization                                        */
/* ------------------------------------------------------------------ */

/** Parse a raw config object into a typed CardConfig. */
export function normalizeConfig(config: Record<string, unknown>): CardConfig {
  const normalized: CardConfig = {
    type: config.type as string,
    colorScheme: config.colorScheme as string | undefined,
    workStyle: config.workStyle as CardConfig["workStyle"],
    showDeclined: config.showDeclined as boolean | undefined,
    showTentative: config.showTentative as boolean | undefined,
    inlineLabels: config.inlineLabels as boolean | undefined,
  };
  for (let i = 0; i < SLOTS.length; i++) {
    const val = normalizeSlotValue(
      config[SLOTS[i]] as string | CalendarEntry[] | undefined,
    );
    if (val) normalized[SLOTS[i]] = val;
    const email = config[EMAIL_KEYS[i]] as string | undefined;
    if (email) normalized[EMAIL_KEYS[i]] = email;
    const name = config[NAME_KEYS[i]] as string | undefined;
    if (name) normalized[NAME_KEYS[i]] = name;
    const person = config[PERSON_KEYS[i]] as string | undefined;
    if (person) normalized[PERSON_KEYS[i]] = person;
  }
  return normalized;
}
