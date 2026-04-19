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
/*  Inline label types                                                 */
/* ------------------------------------------------------------------ */

interface InlineLabel {
  calIndex: number;
  x: number;
  width: number;
  homeY: number;
  text: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Public entry point                                                 */
/* ------------------------------------------------------------------ */

export function renderTimeline(
  events: TimelineEvent[],
  calendars: CalendarInfo[],
  now: Date,
  config: LayoutConfig = DEFAULT_CONFIG,
  scheme?: ColorScheme,
  workStyle: string = "dimmed",
  inlineLabels: boolean = false,
): SVGTemplateResult {
  const cs = scheme || getScheme();
  const calIds = calendars.map((c) => c.id);
  const laneCount = getLaneCount(events);
  const height = computeHeight(laneCount, config);

  const labels = inlineLabels && calendars.length > 0
    ? computeInlineLabels(calendars, laneCount, config)
    : undefined;

  return svg`
    <svg viewBox="0 0 ${config.viewBoxWidth} ${height}"
         preserveAspectRatio="xMidYMid meet"
         xmlns="http://www.w3.org/2000/svg"
         style="width:100%;display:block">
      ${renderAxis(config)}
      ${renderNowLine(now, height, config)}
      ${calendars.map((cal, i) =>
        renderCalendarLine(
          cal.id, cal.color, events, i, calendars.length, laneCount, config,
          labels,
        ),
      )}
      ${renderEventBoxes(events, calIds, cs, config, workStyle)}
      ${labels ? renderInlineLabelTexts(labels) : nothing}
      ${renderNowDot(now, config)}
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
/*  Inline labels                                                      */
/* ------------------------------------------------------------------ */

function computeInlineLabels(
  calendars: CalendarInfo[],
  laneCount: number,
  config: LayoutConfig,
): InlineLabel[] {
  const gapX = hourToX(config.startHour + 0.25, config) - hourToX(config.startHour, config);
  let labelX = hourToX(config.startHour, config) + 5;

  return calendars.map((cal, i) => {
    const charWidth = 6.5;
    const width = Math.max(cal.name.length * charWidth + 14, 40);
    const homeY = calendarHomeY(i, calendars.length, laneCount, config);
    const label: InlineLabel = {
      calIndex: i,
      x: labelX,
      width,
      homeY,
      text: cal.name,
      color: cal.color,
    };
    labelX += width + gapX;
    return label;
  });
}

function renderInlineLabelTexts(labels: InlineLabel[]): SVGTemplateResult {
  return svg`${labels.map((l) => svg`
    <text x="${l.x + l.width / 2}" y="${l.homeY}"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="10"
          font-weight="500"
          fill="${l.color}"
          pointer-events="none">
      ${l.text}
    </text>
  `)}`;
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
  laneCount: number,
  config: LayoutConfig,
  labels?: InlineLabel[],
): SVGTemplateResult {
  const homeY = calendarHomeY(calIndex, totalCals, laneCount, config);
  const calEvents = events
    .filter((e) => e.calendarIds.includes(calendarId))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const xStart = hourToX(config.startHour, config);
  const xEnd = hourToX(config.endHour, config);
  const cr = config.curveRadius;

  /* Helper: weave label gaps/bumps into a horizontal segment at homeY.
     Advances curX from `from` towards `to`, emitting path commands for
     any labels that fall in between. Returns new curX. */
  function weaveLabelSegment(
    parts: string[],
    from: number,
    to: number,
  ): number {
    let cx = from;
    if (!labels?.length) return cx;

    const sorted = labels
      .filter((l) => l.x + l.width > cx && l.x < to)
      .sort((a, b) => a.x - b.x);

    for (const label of sorted) {
      const lStart = Math.max(label.x, cx);
      const lEnd = label.x + label.width;

      /* draw line up to label start */
      if (lStart > cx) {
        parts.push(`L ${lStart} ${homeY}`);
        cx = lStart;
      }

      if (label.calIndex === calIndex) {
        /* OWN label: gap — start new sub-path after it */
        cx = lEnd;
        parts.push(`M ${cx} ${homeY}`);
      } else {
        /* OTHER label: smooth bump over it */
        const bumpDir = calIndex < label.calIndex ? -1 : 1;
        const bumpY = homeY + bumpDir * 6;
        parts.push(
          `C ${label.x + label.width * 0.25} ${bumpY} ${label.x + label.width * 0.75} ${bumpY} ${lEnd} ${homeY}`,
        );
        cx = lEnd;
      }
    }
    return cx;
  }

  /* ---- no events: simple horizontal line with label weaving ---- */
  if (calEvents.length === 0) {
    if (!labels?.length) {
      return svg`
        <line x1="${xStart}" y1="${homeY}" x2="${xEnd}" y2="${homeY}"
              stroke="${color}" stroke-width="1.5" opacity="0.5" />
      `;
    }
    const parts: string[] = [`M ${xStart} ${homeY}`];
    const cx = weaveLabelSegment(parts, xStart, xEnd);
    if (cx < xEnd) parts.push(`L ${xEnd} ${homeY}`);
    return svg`
      <path d="${parts.join(" ")}" fill="none"
            stroke="${color}" stroke-width="1.5" opacity="0.5" />
    `;
  }

  const parts: string[] = [];
  let curX = xStart;
  let curY = homeY;
  parts.push(`M ${curX} ${curY}`);

  /* ---- weave labels before first event ---- */
  if (labels?.length) {
    const firstEventX = timeToX(calEvents[0].start, config);
    curX = weaveLabelSegment(parts, curX, firstEventX);
  }

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
  calendarOrder: string[],
  scheme: ColorScheme,
  config: LayoutConfig,
  workStyle: string,
): SVGTemplateResult {
  return svg`${events.map((event) => {
    const x = timeToX(event.start, config);
    const x2 = timeToX(event.end, config);
    const y = laneToY(event.lane, config);
    const w = Math.max(x2 - x, 4);
    const h = config.laneHeight;

    const color = eventColor(event.calendarIds, calendarOrder, scheme);
    const dimWork = workStyle !== "normal";
    const isWork = !!event.work;
    const fillOpacity = isWork && dimWork ? "0.07" : "0.15";
    const dash = isWork && dimWork ? "3,2" : "none";

    /* ---- envelope event: draw outer box + nested child boxes ---- */
    if (event.envelope && event.children?.length) {
      const envelopeFill = dimWork ? "0.08" : "0.15";
      const envelopeDash = dimWork ? "none" : "none";

      return svg`
        <g>
          <rect x="${x}" y="${y}" width="${w}" height="${h}"
                rx="4" ry="4"
                fill="var(--card-background-color, #fff)"
                stroke="none" />
          <rect x="${x}" y="${y}" width="${w}" height="${h}"
                rx="4" ry="4"
                fill="${color}" fill-opacity="${envelopeFill}"
                stroke="${color}" stroke-width="1"
                stroke-dasharray="${envelopeDash}" />
          ${w > 40
            ? svg`
              <text x="${x + 4}" y="${y + 8}"
                    dominant-baseline="central"
                    font-size="7"
                    fill="var(--secondary-text-color, #888)"
                    pointer-events="none"
                    opacity="0.7">
                ${event.title}
              </text>`
            : nothing}
          ${event.children.map((child) => {
            const cx = timeToX(child.start, config);
            const cx2 = timeToX(child.end, config);
            const cw = Math.max(cx2 - cx, 3);
            const childColor = eventColor(child.calendarIds.length ? child.calendarIds : event.calendarIds, calendarOrder, scheme);
            const childFill = dimWork ? "0.14" : "0.30";
            const childDash = dimWork ? "3,2" : "none";
            return svg`
              <rect x="${cx}" y="${y}" width="${cw}" height="${h}"
                    rx="3" ry="3"
                    fill="${childColor}" fill-opacity="${childFill}"
                    stroke="${childColor}" stroke-width="0.75"
                    stroke-dasharray="${childDash}" />
            `;
          })}
        </g>
      `;
    }

    return svg`
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}"
              rx="4" ry="4"
              fill="var(--card-background-color, #fff)"
              stroke="none" />
        <rect x="${x}" y="${y}" width="${w}" height="${h}"
              rx="4" ry="4"
              fill="${color}" fill-opacity="${fillOpacity}"
              stroke="${color}" stroke-width="1"
              stroke-dasharray="${dash}" />
        ${!isWork && w > 40
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

function renderNowLine(
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
  `;
}

function renderNowDot(
  now: Date,
  config: LayoutConfig,
): SVGTemplateResult {
  const hours = now.getHours() + now.getMinutes() / 60;
  if (hours < config.startHour || hours > config.endHour) return svg``;

  const x = timeToX(now, config);
  return svg`
    <circle cx="${x}" cy="${config.axisY}" r="3"
            fill="var(--primary-color, #03a9f4)" />
  `;
}
