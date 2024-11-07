import moment from "moment";

function toISO8601Format(date: Date): string {
  return moment(date).format("YYYY-MM-DD");
}

export { toISO8601Format };