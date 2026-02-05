import { AuditInfo } from "./common";

export const PRODUCT_CATEGORIES = [
  "supplements",
  "gear",
  "clothing",
  "drinks",
  "food",
  "accessories",
  "other",
] as const;

export const PRODUCT_STATUS = ["active", "out_of_stock", "hidden"] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductStatus = (typeof PRODUCT_STATUS)[number];

export interface Product extends AuditInfo {
  _id: string;
  gymId: string;
  name: string;
  category: ProductCategory;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sku?: string;
  images?: string[];
  status: ProductStatus;
  notes?: string;
}

export interface CreateProductDto {
  name: string;
  category: ProductCategory;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sku?: string;
  images?: string[];
  status: ProductStatus;
  notes?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
