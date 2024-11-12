import moment from "moment";

function toISO8601Format(aDate: Date): string {
  return aDate.toISOString().substring(0, 10);
}

export { toISO8601Format };