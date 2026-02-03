import { AuditInfo } from "./common";

// Export constants
export const EQUIPMENT_CONDITIONS = [
  "good",
  "needs_maintenance",
  "broken",
  "out_of_service",
] as const;
export const EQUIPMENT_CATEGORIES = [
  "cardio",
  "strength",
  "free_weights",
  "functional",
  "recovery",
  "other",
] as const;

// Derive types
export type EquipmentCondition = (typeof EQUIPMENT_CONDITIONS)[number];
export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

export interface EquipmentItem extends AuditInfo {
  _id: string;
  gymId: string;
  name: string;
  category: EquipmentCategory;
  description?: string;
  images?: string[];
  quantity: number;
  condition: EquipmentCondition;

  // Specs
  brand?: string;
  modelNumber?: string;
  serialNumber?: string;

  // Management info (Staff-only typically)
  purchasePrice?: number;
  purchaseDate?: string | Date;
  vendor?: string;
  warrantyExpiry?: string | Date;

  // Maintenance
  lastServiceDate?: string | Date;
  nextServiceDueDate?: string | Date;

  notes?: string;
}
