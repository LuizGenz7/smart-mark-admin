export const sortTermsLatestFirst = (terms = []) => {
  const toTime = (dateStr) => {
    if (!dateStr) return 0;

    // dd-mm-yyyy → Date
    const [d, m, y] = dateStr.split("-").map(Number);
    if (!d || !m || !y) return 0;

    return new Date(y, m - 1, d).getTime();
  };

  const extractYear = (name = "") => {
    const match = name.match(/\d{4}/);
    return match ? Number(match[0]) : 0;
  };

  return [...terms].sort((a, b) => {
    const aTime = toTime(a.end) || toTime(a.begin) || extractYear(a.name);
    const bTime = toTime(b.end) || toTime(b.begin) || extractYear(b.name);

    return bTime - aTime; // latest first
  });
};