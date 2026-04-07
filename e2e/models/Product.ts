/**
 * Product model - represents a product from FakeStore API
 * Used for both request serialization and response deserialization
 */
export class Product {
  id?: number;
  title: string = '';
  price: number = 0;
  description: string = '';
  category: string = '';
  image: string = '';
  rating?: {
    rate: number;
    count: number;
  };

  constructor(data?: Partial<Product>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export interface IProduct {
  id?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}
