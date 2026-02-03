import { EquipmentCategory, EquipmentCondition } from "../types/inventory";

export interface CreateEquipmentDto {
  name: string;
  category: EquipmentCategory;
  description?: string;
  images?: string[];
  quantity?: number;
  condition?: EquipmentCondition;
  brand?: string;
  modelNumber?: string;
  serialNumber?: string;
  purchasePrice?: number;
  purchaseDate?: string | Date;
  vendor?: string;
  warrantyExpiry?: string | Date;
  lastServiceDate?: string | Date;
  nextServiceDueDate?: string | Date;
  notes?: string;
}

export interface UpdateEquipmentDto extends Partial<CreateEquipmentDto> {}
