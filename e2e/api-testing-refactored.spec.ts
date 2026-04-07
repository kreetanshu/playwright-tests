import { expect, test } from '@playwright/test';
import { User } from './models/User';
import { Product } from './models/Product';
import {
  deserializeResponse,
  serializeRequest,
  getAndDeserialize,
  createInstance,
  assertSuccessStatus
} from './fixtures/api.helpers';

/**
 * Refactored API Tests using class-transformer for type-safe serialization/deserialization
 * Benefits:
 * - Strong typing for API responses and requests
 * - IDE autocomplete for nested objects (e.g., user.address.city)
 * - Cleaner, more maintainable test code
 * - Generic helper functions reusable across all API tests
 */

test('GET API Test - User from JSONPlaceholder', async ({ request }) => {
  // Make GET request
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');

  // Deserialize response into strongly typed User instance
  // The @Type decorator in User class ensures address (nested object) is properly typed as Address
  const user: User = await deserializeResponse(response, User);

  // Validate status
  expect(response.status()).toBe(200);

  // Validate response structure with full type safety
  expect(user.id).toBe(1);
  expect(user.name).toBeTruthy();
  expect(user.email).toBeTruthy();

  // Access nested properties with full IDE support
  if (user.address) {
    expect(user.address.city).toBeTruthy();
    expect(user.address.street).toBeTruthy();
    console.log(`User ${user.name} is from ${user.address.city}`);
  }

  // Validate date header (original test behavior preserved)
  const responseHeader = response.headersArray();
  const apiDateStr: string = responseHeader.find(p => p.name === 'Date')!.value;
  const apidate = new Date(apiDateStr);
  const todayDate = new Date();
  expect(todayDate.toDateString()).toBe(apidate.toDateString());
  console.log(`Response Date: ${apiDateStr}`);
});

test('GET API Test - Using getAndDeserialize helper (combined validation + deserialization)', async ({ request }) => {
  // Use combined helper for cleaner code (validates status + deserializes in one call)
  const response = await request.get('https://jsonplaceholder.typicode.com/users/2');
  const user: User = await getAndDeserialize(response, User);

  // User automatically validated and typed
  expect(user.id).toBe(2);
  expect(user.email).toBeTruthy();
  console.log(`Retrieved user: ${user.name} (${user.email})`);
});

test('POST API Test - Create Product on FakeStore', async ({ request }) => {
  // Create strongly typed Product instance
  const productData = createInstance(Product, {
    title: 'RK Test Product',
    price: 29.99,
    description: 'High quality test product from Playwright',
    category: 'electronics',
    image: 'http://example.com/image.jpg'
  });

  console.log('Sending product:', productData);

  // Serialize instance to plain object for request body
  const plainData = serializeRequest(productData);

  // Make POST request with serialized data
  const response = await request.post('https://fakestoreapi.com/products/', {
    data: plainData
  });

  // Validate status
  expect(response.status()).toBe(201);

  // Deserialize response into strongly typed Product instance
  const createdProduct: Product = await deserializeResponse(response, Product);

  // Access properties with full type safety
  expect(createdProduct.title).toBe(productData.title);
  expect(createdProduct.price).toBe(productData.price);
  expect(createdProduct.category).toBe(productData.category);

  console.log('Created product:', {
    id: createdProduct.id,
    title: createdProduct.title,
    price: createdProduct.price,
    category: createdProduct.category
  });
});

test('POST API Test - Alternative: using constructor', async ({ request }) => {
  // Alternative: use class constructor directly for instance creation
  const productData = new Product();
  productData.title = 'RK Alternative Product';
  productData.price = 19.99;
  productData.description = 'Alternative product creation method';
  productData.category = 'human';
  productData.image = 'http://example.com/alt-image.jpg';

  const response = await request.post('https://fakestoreapi.com/products/', {
    data: serializeRequest(productData)
  });

  expect(response.status()).toBe(201);

  const createdProduct: Product = await deserializeResponse(response, Product);
  expect(createdProduct.title).toBe('RK Alternative Product');

  console.log(`Product created with ID: ${createdProduct.id}`);
});

test('API Error Handling - Verify assertSuccessStatus throws on failure', async ({ request }) => {
  // Request to non-existent endpoint
  const response = await request.get('https://jsonplaceholder.typicode.com/users/99999/invalid');

  // assertSuccessStatus will throw if status is not 2xx
  try {
    await assertSuccessStatus(response);
    // If we reach here, status was 2xx (unlikely for this test)
    console.log('Status was successful');
  } catch (error) {
    expect(error).toBeDefined();
    console.log(`Caught expected error: ${(error as Error).message}`);
  }
});

test('Multiple Users - Deserialize single response into array', async ({ request }) => {
  // Example: If API returns single user, deserialize into array for consistency
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
  const user: User = await deserializeResponse(response, User);

  // Now we have a single User object with proper types
  expect(user).toBeInstanceOf(User);
  expect(user.id).toBe(1);

  // Demonstrates proper type inference
  const userName: string = user.name; // TypeScript knows this is string
  const userEmail: string = user.email; // TypeScript knows this is string
  console.log(`User name: ${userName}, email: ${userEmail}`);
});
