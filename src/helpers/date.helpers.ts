import moment from "moment";

function toISO8601Format(date: Date): string {
  return date.toISOString().substring(0, 10);
}

export { toISO8601Format };