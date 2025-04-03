function toISO8601Format(aDate: Date): string {
  return aDate.toISOString().substring(0, 10);
}

function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export { toISO8601Format, isSameDate };