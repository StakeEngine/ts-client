import { describe, expect, test } from '@jest/globals';
import { DisplayAmount } from './helpers.js';

describe('Helpers', () => {
  test('DisplayAmount', () => {
    expect(DisplayAmount({ amount: 1000000, currency: 'USD' })).toBe(
      '$1,000.00',
    );
  });
});
//# sourceMappingURL=helpers.test.js.map
