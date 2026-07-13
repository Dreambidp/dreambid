import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAndValidateDecimalField } from '../utils/propertyValidation.js';

test('accepts decimal values that fit the database precision', () => {
  const result = parseAndValidateDecimalField('12345.67', { max: 99999999.99 });

  assert.equal(result.isValid, true);
  assert.equal(result.value, 12345.67);
});

test('rejects decimal values that exceed the allowed precision', () => {
  const tooLarge = parseAndValidateDecimalField('100000000.00', { max: 99999999.99 });
  const tooManyDecimals = parseAndValidateDecimalField('1.234', { max: 99999999.99 });

  assert.equal(tooLarge.isValid, false);
  assert.match(tooLarge.error, /less than/i);
  assert.equal(tooManyDecimals.isValid, false);
  assert.match(tooManyDecimals.error, /at most 2 decimal places/i);
});
