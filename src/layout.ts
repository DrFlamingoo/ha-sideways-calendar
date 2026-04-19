/** Shared types and layout computation — no rendering code here. */

export interface CalendarEntry {
  entity: string;
  work?: boolean;
}

export function normalizeSlotValue(
  value: string | CalendarEntry[] | undefined,
): CalendarEntry[] | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return [{ entity: value }];
  return value;
}

export interface RawEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  calendarIds: string[];
  work?: boolean;
  /** This event is a "work.*" placeholder that envelopes work-calendar events. */
  envelope?: boolean;
  /** Work-calendar events nested inside an envelope. */
  children?: RawEvent[];
}

export interface TimelineEvent extends RawEvent {
  lane: number;
  children?: RawEvent[];
}

export interface CalendarInfo {
  id: string;
  name: string;
  color: string;
}

export interface LayoutConfig {
  startHour: number;
  endHour: number;
  viewBoxWidth: number;
  axisY: number;
  laneHeight: number;
  laneGap: number;
  axisLaneGap: number;
  paddingLeft: number;
  paddingRight: number;
  calendarLineSpacing: number;
  curveRadius: number;
}

export const DEFAULT_CONFIG: LayoutConfig = {
  startHour: 0,
  endHour: 24,
  viewBoxWidth: 1000,
  axisY: 28,
  laneHeight: 26,
  laneGap: 4,
  axisLaneGap: 14,
  paddingLeft: 20,
  paddingRight: 10,
  calendarLineSpacing: 3,
  curveRadius: 12,
};

export function hourToX(hour: number, config: LayoutConfig): number {
  const frac = (hour - config.startHour) / (config.endHour - config.startHour);
  const clamped = Math.max(0, Math.min(1, frac));
  const usable = config.viewBoxWidth - config.paddingLeft - config.paddingRight;
  return config.paddingLeft + clamped * usable;
}

export function timeToX(date: Date, config: LayoutConfig): number {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const ms = date.getTime() - todayMidnight;
  const hours = ms / 3_600_000;
  const frac = (hours - config.startHour) / (config.endHour - config.startHour);
  const clamped = Math.max(0, Math.min(1, frac));
  const usable = config.viewBoxWidth - config.paddingLeft - config.paddingRight;
  return config.paddingLeft + clamped * usable;
}

export function laneToY(lane: number, config: LayoutConfig): number {
  return config.axisY + config.axisLaneGap + lane * (config.laneHeight + config.laneGap);
}

export function calendarHomeY(
  index: number,
  total: number,
  laneCount: number,
  config: LayoutConfig,
): number {
  const lanes = Math.max(laneCount, 1);
  const topLane = laneToY(0, config);
  const bottomLane = laneToY(lanes - 1, config) + config.laneHeight;
  const centerY = (topLane + bottomLane) / 2;
  const span = (total - 1) * config.calendarLineSpacing;
  return centerY - span / 2 + index * config.calendarLineSpacing;
}

/** Greedy first-fit lane assignment. */
export function assignLanes(events: RawEvent[]): TimelineEvent[] {
  const sorted = [...events].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
  const laneEnds: number[] = [];
  return sorted.map((event) => {
    let lane = laneEnds.findIndex((end) => end <= event.start.getTime());
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = event.end.getTime();
    return { ...event, lane };
  });
}

export function getLaneCount(events: TimelineEvent[]): number {
  if (events.length === 0) return 0;
  return Math.max(...events.map((e) => e.lane)) + 1;
}

export function computeHeight(
  laneCount: number,
  config: LayoutConfig,
): number {
  if (laneCount === 0) return config.axisY + 30;
  return laneToY(laneCount - 1, config) + config.laneHeight + 10;
}
