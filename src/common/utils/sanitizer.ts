/* eslint-disable prettier/prettier */
import * as sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitizes HTML input to prevent XSS attacks.
 * - Removes all HTML tags
 * - Escapes special characters
 * - Prevents script injection
 *
 * @param html The input HTML string to sanitize
 * @returns A sanitized string with all HTML removed
 */
export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) {
    return '';
  }

  // Configure sanitize-html to strip all HTML tags
  const options = {
    allowedTags: [], // No HTML tags allowed
    allowedAttributes: {}, // No attributes allowed
    disallowedTagsMode: 'discard', // Remove disallowed tags completely
    parseStyleAttributes: false, // Don't parse style attributes
    allowedStyles: {}, // No styles allowed
    selfClosing: [], // No self-closing tags
    allowedSchemes: [], // No URL schemes allowed
    allowedSchemesByTag: {}, // No URL schemes allowed by tag
    allowedSchemesAppliedToAttributes: [], // No attributes that can have URL schemes
    allowProtocolRelative: false, // No protocol-relative URLs
  };

  return sanitizeHtmlLib(html, options);
}

/**
 * Sanitizes an object's string properties recursively.
 * Useful for sanitizing user input in DTOs.
 *
 * @param obj The object to sanitize
 * @returns A new object with all string properties sanitized
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result = { ...obj } as any;

  Object.keys(result).forEach((key) => {
    const value = result[key];

    if (typeof value === 'string') {
      result[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value);
    }
  });

  return result as T;
}
