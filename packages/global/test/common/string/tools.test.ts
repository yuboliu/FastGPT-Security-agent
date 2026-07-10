import { describe, expect, it } from 'vitest';
import { desensitizeApiKey } from '@fastgpt/global/common/string/tools';

describe('desensitizeApiKey', () => {
  it('should mask the second half of a key', () => {
    expect(desensitizeApiKey('sk-1234567890')).toBe('sk-1234******');
  });

  it('should round up the visible length for odd-length keys', () => {
    expect(desensitizeApiKey('sk-123456789')).toBe('sk-123******');
  });

  it('should handle short keys', () => {
    expect(desensitizeApiKey('ab')).toBe('a*');
    expect(desensitizeApiKey('abc')).toBe('ab*');
  });

  it('should return empty string for empty, null or undefined input', () => {
    expect(desensitizeApiKey('')).toBe('');
    expect(desensitizeApiKey(null)).toBe('');
    expect(desensitizeApiKey(undefined)).toBe('');
  });
});
