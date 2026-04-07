/**
 * User model - represents a user response from JSONPlaceholder API
 */
export class User {
  id: number = 0;
  name: string = '';
  username: string = '';
  email: string = '';
  phone?: string = '';
  website?: string = '';
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  company?: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  company?: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };
}
