import {
  ChargilyClient,
  UpdatePriceParams,
  UpdateProductParams,
} from '@chargily/chargily-pay';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

const CHARGILY_SECRET_KEY = process.env.CHARGILY_SECRET_KEY;
const CHARGILY_MODE = process.env.CHARGILY_MODE;
@Injectable()
export class ChargilyService {
  private client: ChargilyClient;

  constructor() {
    this.client = new ChargilyClient({
      api_key: CHARGILY_SECRET_KEY || '',
      mode: (CHARGILY_MODE as 'test' | 'live') || 'test',
    });
  }

  async createCustomer(customerData: {
    name: string;
    email: string;
    phone: string;
    address?: {
      country: string;
      state: string;
      address: string;
    };
    metadata?: Record<string, any>;
  }) {
    return await this.client.createCustomer(customerData);
  }

  async createProduct(productData: {
    name: string;
    description?: string;
    images?: string[];
    metadata?: Record<string, any>;
  }) {
    return await this.client.createProduct(productData);
  }

  async createPrice(priceData: {
    amount: number;
    currency: string;
    product_id: string;
    metadata?: Record<string, any>;
  }) {
    return await this.client.createPrice(priceData);
  }

  async createCheckout(checkoutData: {
    items: Array<{ price: string; quantity: number }>;
    success_url: string;
    failure_url: string;
    payment_method?: 'edahabia' | 'cib';
    locale?: 'ar' | 'en' | 'fr';
    pass_fees_to_customer?: boolean;
    customer_id?: string;
    shipping_address?: string;
    collect_shipping_address?: boolean;
    metadata?: Record<string, any>;
  }) {
    return await this.client.createCheckout(checkoutData);
  }

  async createPaymentLink(paymentLinkData: {
    name: string;
    items: Array<{
      price: string;
      quantity: number;
      adjustable_quantity?: boolean;
    }>;
    after_completion_message?: string;
    locale?: 'ar' | 'en' | 'fr';
    pass_fees_to_customer?: boolean;
    collect_shipping_address?: boolean;
    metadata?: Record<string, any>;
  }) {
    return await this.client.createPaymentLink(paymentLinkData);
  }

  async getCheckout(checkoutId: string) {
    return await this.client.getCheckout(checkoutId);
  }

  getClient() {
    return this.client;
  }

  async listProducts(perPage?: number) {
    return await this.client.listProducts(perPage);
  }

  async updateProduct(productId: string, productData: UpdateProductParams) {
    return await this.client.updateProduct(productId, productData);
  }

  async deleteProduct(productId: string) {
    return await this.client.deleteProduct(productId);
  }

  async listPrices(perPage?: number) {
    return await this.client.listPrices(perPage);
  }

  async updatePrice(priceId: string, priceData: UpdatePriceParams) {
    return await this.client.updatePrice(priceId, priceData);
  }
}
