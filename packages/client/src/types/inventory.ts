import { AuditInfo } from "./common";

export interface EquipmentItem extends AuditInfo {
  _id: string;
  gymId: string; // which gym owns this equipment
  name: string; // e.g., "dumbbell 20kg"
  type: string; // e.g., "dumbbell", "bench", "treadmill"
  quantity: number; // number of identical items
  condition?: "good" | "needs_maintenance" | "broken";
  notes?: string;
}
