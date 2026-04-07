import { APIResponse } from '@playwright/test';

/**
 * Generic helper to deserialize API response JSON into a typed class instance
 * Uses Object.assign for simple, reliable transformation without decorators
 *
 * @param response - The Playwright APIResponse object
 * @param classType - The class constructor to deserialize into (e.g., User, Product)
 * @returns Promise of typed instance with proper object structure
 *
 * @example
 * const user = await deserializeResponse(response, User);
 * console.log(user.address.city); // TypeScript knows address is properly typed
 */
export async function deserializeResponse<T extends object>(
  response: APIResponse,
  classType: new () => T
): Promise<T> {
  const json = await response.json();
  const instance = new classType();
  return Object.assign(instance as object, json) as T;
}

/**
 * Generic helper to serialize a class instance into plain object for API request body
 * Uses Object.assign to create a plain copy suitable for JSON serialization
 *
 * @param instance - The class instance to serialize (e.g., new Product())
 * @returns Plain object suitable for JSON serialization in request body
 *
 * @example
 * const product = new Product({ title: 'Test', price: 10 });
 * const plainData = serializeRequest(product);
 * await request.post(url, { data: plainData });
 */
export function serializeRequest<T extends object>(instance: T): Record<string, any> {
  // Create a plain object from the instance (removes prototype chain)
  return JSON.parse(JSON.stringify(instance));
}

/**
 * Deserialize array of JSON objects into typed class instances
 * Useful when API returns array of objects
 *
 * @param response - The Playwright APIResponse object
 * @param classType - The class constructor for each array element
 * @returns Promise of array of typed instances
 *
 * @example
 * const users = await deserializeArray(response, User);
 * users.forEach(user => console.log(user.email)); // All users are typed as User
 */
export async function deserializeArray<T extends object>(
  response: APIResponse,
  classType: new () => T
): Promise<T[]> {
  const json = await response.json();
  if (!Array.isArray(json)) {
    return [];
  }
  return json.map(item => {
    const instance = new classType();
    return Object.assign(instance as object, item) as T;
  });
}

/**
 * Validate API response status is successful (2xx)
 *
 * @param response - The Playwright APIResponse object
 * @returns The response object if status is 2xx, otherwise throws error
 *
 * @example
 * const response = await request.get(url);
 * const checkedResponse = await assertSuccessStatus(response);
 */
export async function assertSuccessStatus(response: APIResponse): Promise<APIResponse> {
  const status = response.status();
  if (status < 200 || status >= 300) {
    throw new Error(`API request failed with status ${status}: ${await response.text()}`);
  }
  return response;
}

/**
 * Combined helper: deserialize and validate status in one call
 *
 * @param response - The Playwright APIResponse object
 * @param classType - The class constructor to deserialize into
 * @returns Promise of typed instance
 *
 * @example
 * const user = await getAndDeserialize(response, User);
 */
export async function getAndDeserialize<T extends object>(
  response: APIResponse,
  classType: new () => T
): Promise<T> {
  await assertSuccessStatus(response);
  return deserializeResponse(response, classType);
}

/**
 * Create instance with strongly typed constructor
 * Provides better IDE autocomplete than inline object literals
 *
 * @param classType - The class constructor
 * @param data - Partial data to initialize the instance
 * @returns Initialized instance
 *
 * @example
 * const product = createInstance(Product, {
 *   title: 'New Product',
 *   price: 29.99,
 *   category: 'electronics'
 * });
 */
export function createInstance<T extends object>(
  classType: new () => T,
  data: Partial<T>
): T {
  const instance = new classType();
  return Object.assign(instance as object, data) as T;
}
