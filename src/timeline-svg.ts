/** SVG rendering for the 24-hour timeline. */

import { svg, nothing, SVGTemplateResult } from "lit";
import {
  TimelineEvent,
  CalendarInfo,
  LayoutConfig,
  DEFAULT_CONFIG,
  hourToX,
  timeToX,
  laneToY,
  calendarHomeY,
  getLaneCount,
  computeHeight,
} from "./layout.js";
import { ColorScheme, eventColor, getScheme } from "./colors.js";

/* ------------------------------------------------------------------ */
/*  Public entry point                                                 */
/* ------------------------------------------------------------------ */

export function renderTimeline(
  events: TimelineEvent[],
  calendars: CalendarInfo[],
  now: Date,
  config: LayoutConfig = DEFAULT_CONFIG,
  scheme?: ColorScheme,
): SVGTemplateResult {
  const cs = scheme || getScheme();
  const calIds = calendars.map((c) => c.entityId);
  const laneCount = getLaneCount(events);
  const height = computeHeight(laneCount, config);

  return svg`
    <svg viewBox="0 0 ${config.viewBoxWidth} ${height}"
         preserveAspectRatio="xMidYMid meet"
         xmlns="http://www.w3.org/2000/svg"
         style="width:100%;display:block">
      ${renderAxis(config)}
      ${calendars.map((cal, i) =>
        renderCalendarLine(
          cal.entityId, cal.color, events, i, calendars.length, config,
        ),
      )}
      ${renderEventBoxes(events, calendars, calIds, cs, config)}
      ${renderNowMarker(now, height, config)}
    </svg>
  `;
}

/* ------------------------------------------------------------------ */
/*  Time axis                                                          */
/* ------------------------------------------------------------------ */

function renderAxis(config: LayoutConfig): SVGTemplateResult {
  const xStart = hourToX(config.startHour, config);
  const xEnd = hourToX(config.endHour, config);

  const ticks: SVGTemplateResult[] = [];
  for (let h = config.startHour; h <= config.endHour; h++) {
    const x = hourToX(h, config);
    const isMajor = h % 3 === 0;
    const tickLen = isMajor ? 6 : 3;
    ticks.push(svg`
      <line x1="${x}" y1="${config.axisY - tickLen}"
            x2="${x}" y2="${config.axisY + tickLen}"
            stroke="var(--secondary-text-color, #888)"
            stroke-width="${isMajor ? 1 : 0.5}" />
      ${isMajor
        ? svg`
          <text x="${x}" y="${config.axisY - 10}"
                text-anchor="middle"
                fill="var(--secondary-text-color, #888)"
                font-size="9">
            ${h}
          </text>`
        : nothing}
    `);
  }

  return svg`
    <line x1="${xStart}" y1="${config.axisY}"
          x2="${xEnd}"   y2="${config.axisY}"
          stroke="var(--divider-color, #ccc)" stroke-width="1" />
    ${ticks}
  `;
}

/* ------------------------------------------------------------------ */
/*  Calendar lines (git-branch style)                                  */
/* ------------------------------------------------------------------ */

function renderCalendarLine(
  calendarId: string,
  color: string,
  events: TimelineEvent[],
  calIndex: number,
  totalCals: number,
  config: LayoutConfig,
): SVGTemplateResult {
  const homeY = calendarHomeY(calIndex, totalCals, config);
  const calEvents = events
    .filter((e) => e.calendarIds.includes(calendarId))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const xStart = hourToX(config.startHour, config);
  const xEnd = hourToX(config.endHour, config);
  const cr = config.curveRadius;

  if (calEvents.length === 0) {
    return svg`
      <line x1="${xStart}" y1="${homeY}" x2="${xEnd}" y2="${homeY}"
            stroke="${color}" stroke-width="1.5" opacity="0.5" />
    `;
  }

  const parts: string[] = [];
  let curX = xStart;
  let curY = homeY;
  parts.push(`M ${curX} ${curY}`);

  for (let i = 0; i < calEvents.length; i++) {
    const event = calEvents[i];
    const targetY = laneToY(event.lane, config) + config.laneHeight / 2;
    const ex1 = Math.max(timeToX(event.start, config), curX);
    const ex2 = Math.max(timeToX(event.end, config), ex1);

    if (curY === homeY) {
      /* ---- branch down from axis to event lane ---- */
      const branchX = Math.max(curX, ex1 - cr);
      if (branchX > curX) {
        parts.push(`L ${branchX} ${homeY}`);
        curX = branchX;
      }
      const destX = Math.max(curX, ex1);
      const midX = (curX + destX) / 2;
      parts.push(
        `C ${midX} ${homeY} ${midX} ${targetY} ${destX} ${targetY}`,
      );
      curX = destX;
      curY = targetY;
    } else if (curY !== targetY) {
      /* ---- lane-to-lane transition (overlapping same-cal events) ---- */
      const destX = Math.max(curX, Math.min(curX + cr, ex1));
      const midX = (curX + destX) / 2;
      parts.push(
        `C ${midX} ${curY} ${midX} ${targetY} ${destX} ${targetY}`,
      );
      if (destX < ex1) parts.push(`L ${ex1} ${targetY}`);
      curX = Math.max(curX, ex1);
      curY = targetY;
    }

    /* ---- horizontal through event ---- */
    if (ex2 > curX) {
      parts.push(`L ${ex2} ${targetY}`);
      curX = ex2;
    }

    /* ---- return to axis if there's room before next event ---- */
    const nextX = calEvents[i + 1]
      ? timeToX(calEvents[i + 1].start, config)
      : xEnd;
    if (nextX - curX > 2 * cr + 4) {
      const retX = curX + cr;
      const midX = (curX + retX) / 2;
      parts.push(`C ${midX} ${curY} ${midX} ${homeY} ${retX} ${homeY}`);
      curX = retX;
      curY = homeY;
    }
  }

  /* ---- return to axis if still in a lane ---- */
  if (curY !== homeY) {
    const retX = Math.min(curX + cr, xEnd);
    const midX = (curX + retX) / 2;
    parts.push(`C ${midX} ${curY} ${midX} ${homeY} ${retX} ${homeY}`);
    curX = retX;
    curY = homeY;
  }

  /* ---- always extend to end of day ---- */
  if (curX < xEnd) parts.push(`L ${xEnd} ${homeY}`);

  return svg`
    <path d="${parts.join(" ")}" fill="none"
          stroke="${color}" stroke-width="1.5" opacity="0.8" />
  `;
}

/* ------------------------------------------------------------------ */
/*  Event boxes                                                        */
/* ------------------------------------------------------------------ */

function renderEventBoxes(
  events: TimelineEvent[],
  calendars: CalendarInfo[],
  calendarOrder: string[],
  scheme: ColorScheme,
  config: LayoutConfig,
): SVGTemplateResult {
  return svg`${events.map((event) => {
    const x = timeToX(event.start, config);
    const x2 = timeToX(event.end, config);
    const y = laneToY(event.lane, config);
    const w = Math.max(x2 - x, 4);
    const h = config.laneHeight;

    const color = eventColor(event.calendarIds, calendarOrder, scheme);

    return svg`
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}"
              rx="4" ry="4"
              fill="var(--card-background-color, #fff)"
              stroke="none" />
        <rect x="${x}" y="${y}" width="${w}" height="${h}"
              rx="4" ry="4"
              fill="${color}" fill-opacity="0.15"
              stroke="${color}" stroke-width="1" />
        ${w > 40
          ? svg`
            <text x="${x + 4}" y="${y + h / 2}"
                  dominant-baseline="central"
                  font-size="10"
                  fill="var(--primary-text-color, #333)"
                  pointer-events="none">
              ${event.title}
            </text>`
          : nothing}
      </g>
    `;
  })}`;
}

/* ------------------------------------------------------------------ */
/*  Current-time marker                                                */
/* ------------------------------------------------------------------ */

function renderNowMarker(
  now: Date,
  height: number,
  config: LayoutConfig,
): SVGTemplateResult {
  const hours = now.getHours() + now.getMinutes() / 60;
  if (hours < config.startHour || hours > config.endHour) return svg``;

  const x = timeToX(now, config);
  return svg`
    <line x1="${x}" y1="0" x2="${x}" y2="${height}"
          stroke="var(--primary-color, #03a9f4)"
          stroke-width="1.5" opacity="0.6" />
    <circle cx="${x}" cy="${config.axisY}" r="3"
            fill="var(--primary-color, #03a9f4)" />
  `;
}
