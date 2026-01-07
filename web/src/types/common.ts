import type { TFunction } from "i18next";

export type TranslationType = TFunction<"translation", undefined>;

export interface ScanResult {
  status: "granted" | "denied" | "verifying";
  name?: string;
  photo?: string;
  reason?: string;
  expiry?: string | Date;
  timestamp: Date;
}
