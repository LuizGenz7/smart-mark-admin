export const getDateDifference = (startISO, endISO) => {
    const start = new Date(startISO);
    const end = new Date(endISO);


    const diffMs = end - start; // difference in milliseconds

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return days;
};


export function getDayDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // convert to UTC to avoid timezone issues
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;

  return Math.abs(Math.floor((utc2 - utc1) / msPerDay));
}

export function getMonthName(dateStr) {
    const [d, m, y] = dateStr.split('-');
    const newDate = `${y}-${m}-${d}`;

    const date = new Date(newDate);
    // Using Intl.DateTimeFormat for locale-safe month name
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
}
export function getToday() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

export function parseDDMMYYYY(dateStr) {
    const [day, month, year] = dateStr.split("-").map(Number);

    // JS months are 0-based (0 = January)
    return new Date(year, month - 1, day);
}

export const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
}


export function compareDates(dateA, dateB) {
    const d1 = parseDDMMYYYY(dateA);
    const d2 = parseDDMMYYYY(dateB);
    return d1 < d2;
}

export const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";

  const [day, month, year] = dateStr.split("-").map(Number);

  const months = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
  ];

  if (!day || !month || !year) return "";

  const monthName = months[month - 1];

  const formattedDay = String(day).padStart(2, "0");

  return `${formattedDay} ${monthName} ${year}`;
};