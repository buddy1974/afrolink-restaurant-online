/**
 * Regular opening hours — one entry per day (accurate daily data).
 * The UI groups consecutive days with identical hours; schema.org uses this list directly.
 * A closing time earlier than the opening time means "after midnight".
 */

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DayHours {
  day: Day;
  opens: string; // HH:MM, Europe/Berlin
  closes: string; // HH:MM, Europe/Berlin
}

export const timeZone = 'Europe/Berlin';

export const openingHours: DayHours[] = [
  { day: 'Monday', opens: '15:00', closes: '00:00' },
  { day: 'Tuesday', opens: '15:00', closes: '00:00' },
  { day: 'Wednesday', opens: '15:00', closes: '00:00' },
  { day: 'Thursday', opens: '15:00', closes: '00:00' },
  { day: 'Friday', opens: '15:00', closes: '01:00' },
  { day: 'Saturday', opens: '15:00', closes: '01:00' },
  { day: 'Sunday', opens: '16:00', closes: '00:00' },
];

export interface HoursGroup {
  days: Day[];
  label: string;
  opens: string;
  closes: string;
}

/** Collapse consecutive days with identical hours: "Monday – Thursday". */
export function groupHours(hours: DayHours[] = openingHours): HoursGroup[] {
  const groups: HoursGroup[] = [];
  for (const h of hours) {
    const last = groups.at(-1);
    if (last && last.opens === h.opens && last.closes === h.closes) {
      last.days.push(h.day);
    } else {
      groups.push({ days: [h.day], label: '', opens: h.opens, closes: h.closes });
    }
  }
  for (const g of groups) {
    g.label = g.days.length === 1 ? g.days[0] : `${g.days[0]} – ${g.days.at(-1)}`;
  }
  return groups;
}
