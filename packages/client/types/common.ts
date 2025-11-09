export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type DaysPerWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface TimeRange {
  start: string;
  end: string;
}

export interface WeeklyTimeRange {
  days: WeekDay[];
  range: TimeRange;
}

export interface AuditInfo {
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}
