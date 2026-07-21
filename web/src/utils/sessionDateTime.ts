import { format } from "date-fns";

const LOCAL_DATETIME_INPUT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/** Parse `<input type="datetime-local">` value as local wall-clock time. */
export function parseLocalDateTimeInput(value: string): Date {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

/** Parse stored session start (ISO or legacy datetime-local string). */
export function parseSessionStartInstant(value: string | Date): Date {
  if (value instanceof Date) {
    return value;
  }

  if (LOCAL_DATETIME_INPUT.test(value)) {
    return parseLocalDateTimeInput(value);
  }

  return new Date(value);
}

/** Serialize datetime-local input to UTC ISO for the API. */
export function localDateTimeInputToISO(value: string): string {
  return parseLocalDateTimeInput(value).toISOString();
}

/** Convert stored session start to datetime-local input value. */
export function sessionStartToLocalInput(value: string | Date): string {
  return format(parseSessionStartInstant(value), "yyyy-MM-dd'T'HH:mm");
}

/** Display session start in the user's local timezone. */
export function formatSessionStartDisplay(value: string | Date): string {
  return format(parseSessionStartInstant(value), "MMM d, yyyy - HH:mm");
}
