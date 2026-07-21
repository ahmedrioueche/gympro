const LOCAL_DATETIME_INPUT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const pad2 = (value: number) => String(value).padStart(2, "0");

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
  const date = parseSessionStartInstant(value);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** Display session start in the user's local timezone. */
export function formatSessionStartDisplay(value: string | Date): string {
  const date = parseSessionStartInstant(value);
  const month = date.toLocaleString(undefined, { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  return `${month} ${day}, ${year} - ${hours}:${minutes}`;
}
