const { escapeRegex } = require('../utils/escapeRegex');

describe('escapeRegex', () => {
  test('leaves plain search terms untouched', () => {
    expect(escapeRegex('Biryani House')).toBe('Biryani House');
  });

  test('escapes every regex metacharacter', () => {
    expect(escapeRegex('.*+?^${}()|[]\\')).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  test('produces a valid pattern for an unmatched opening paren', () => {
    // `new RegExp('mac (')` throws; the escaped term must compile.
    expect(() => new RegExp(escapeRegex('mac ('))).not.toThrow();
    expect(new RegExp(escapeRegex('mac ('), 'i').test('Mac (Cheese) Corner')).toBe(true);
  });

  test('matches metacharacters literally instead of as a pattern', () => {
    const pattern = new RegExp(escapeRegex('a.c'), 'i');
    expect(pattern.test('a.c Diner')).toBe(true);
    expect(pattern.test('abc Diner')).toBe(false);
  });

  test('returns an empty string for non-string input', () => {
    expect(escapeRegex(undefined)).toBe('');
    expect(escapeRegex(null)).toBe('');
    expect(escapeRegex({ $ne: null })).toBe('');
    expect(escapeRegex(['a', 'b'])).toBe('');
  });
});
