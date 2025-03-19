import { SetMetadata } from '@nestjs/common';
import { VERSION_METADATA } from '@nestjs/common/constants';

/**
 * Decorator to apply API versioning to methods
 * @param version API version number
 */
export function ApiVersion(version: string | number) {
  return SetMetadata(VERSION_METADATA, version.toString());
}
