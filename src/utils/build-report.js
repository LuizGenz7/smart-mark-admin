import { parseDDMMYYYY } from "./date-helpers";

export function buildWeeklyAttendance(fullTerm) {
  if (!fullTerm?.termDuration) return null;

  const start = new Date(fullTerm.termDuration.start);
  const end = new Date(fullTerm.termDuration.end);

  const pupils = fullTerm.records?.[0]?.data || [];

  // attendance map: date -> { pupilId: status }
  const attendanceMap = {};

  fullTerm.records.forEach((r) => {
    attendanceMap[r.date] = {};

    (r.data || []).forEach((p) => {
      attendanceMap[r.date][p.id] = p.status;
    });
  });

  const isWeekday = (d) => d.getDay() >= 1 && d.getDay() <= 5;

  const getDayName = (d) =>
    ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];

  const weeks = [];
  let week = [];
  let weekIndex = 1;

  const current = new Date(start);

  while (current <= end) {
    const copy = new Date(current);

    if (isWeekday(copy)) {
      week.push({
        date: copy.toISOString().split("T")[0],
        day: getDayName(copy),
      });
    }

    // every Friday OR end date → close week
    if (copy.getDay() === 5 || current.getTime() === end.getTime()) {
      if (week.length) {
        weeks.push({
          week: weekIndex++,
          days: week,
        });
        week = [];
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    weeks,
    pupils,
    attendanceMap,
  };
}