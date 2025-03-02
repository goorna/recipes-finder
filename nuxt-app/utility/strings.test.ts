
import { describe, it, expect } from 'vitest';
import { abbreviateTimeUnit } from './strings';

describe('abbreviateTimeUnit', () => {
  it('abbreviates "minutes" to "min"', () => {
    const result = abbreviateTimeUnit('minutes');
    expect(result).toBe('min');
  });

  it('abbreviates "hours" to "h"', () => {
    const result = abbreviateTimeUnit('hours');
    expect(result).toBe('h');
  });

  it('returns empty string for unknown time units', () => {
    const result = abbreviateTimeUnit('days' as any);
    expect(result).toBe('');
  });

  it('returns empty string for undefined input', () => {
    const result = abbreviateTimeUnit(undefined as any);
    expect(result).toBe('');
  });

  it('returns empty string for null input', () => {
    const result = abbreviateTimeUnit(null as any);
    expect(result).toBe('');
  });

  it('returns empty string for empty string input', () => {
    const result = abbreviateTimeUnit('' as any);
    expect(result).toBe('');
  });

  it('is case sensitive', () => {
    const result = abbreviateTimeUnit('Minutes' as any);
    expect(result).toBe('');
  });

  it('handles all expected time units', () => {
    const shortLabels = {
      minutes: 'min',
      hours: 'h'
    };

    for (const [unit, abbreviation] of Object.entries(shortLabels)) {
      const result = abbreviateTimeUnit(unit as any);
      expect(result).toBe(abbreviation);
    }
  });
});
