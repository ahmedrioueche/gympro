import { AuditInfo } from './common';

// Export constant
export const EQUIPMENT_CONDITIONS = ['good', 'needs_maintenance', 'broken'] as const;

// Derive type from constant
export type EquipmentCondition = (typeof EQUIPMENT_CONDITIONS)[number];

export interface EquipmentItem extends AuditInfo {
  _id: string;
  gymId: string; // which gym owns this equipment
  name: string; // e.g., "dumbbell 20kg"
  type: string; // e.g., "dumbbell", "bench", "treadmill"
  quantity: number; // number of identical items
  condition?: EquipmentCondition;
  notes?: string;
}
