/**
 * Address model - represents a nested address structure
 * Used in User responses from JSONPlaceholder API
 */
export class Address {
  street: string = '';
  suite: string = '';
  city: string = '';
  zipcode: string = '';
  geo?: {
    lat: string;
    lng: string;
  };

  constructor(data?: Partial<Address>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export interface IAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo?: {
    lat: string;
    lng: string;
  };
}
