import { Controller } from '@nestjs/common';

/**
 * Decorator to create a controller with standard API path
 * @param path Controller path
 */
export function ApiController(path: string) {
  return Controller({ path, version: '1' });
}
