const DECIMAL_PATTERN = /^\d+(\.\d{1,2})?$/;

export function parseAndValidateDecimalField(value, {
  min = 0,
  max = 99999999.99,
  allowEmpty = false,
  label = 'Value'
} = {}) {
  if (value === undefined || value === null || value === '') {
    if (allowEmpty) {
      return { isValid: true, value: null };
    }

    return {
      isValid: false,
      error: `${label} is required.`
    };
  }

  const normalizedValue = String(value).trim().replace(/,/g, '');
  if (!DECIMAL_PATTERN.test(normalizedValue)) {
    return {
      isValid: false,
      error: `${label} must be a non-negative number with at most 2 decimal places.`
    };
  }

  const parsedValue = Number(normalizedValue);
  if (!Number.isFinite(parsedValue)) {
    return {
      isValid: false,
      error: `${label} must be a valid number.`
    };
  }

  if (parsedValue < min) {
    return {
      isValid: false,
      error: `${label} must be greater than or equal to ${min}.`
    };
  }

  if (parsedValue > max) {
    return {
      isValid: false,
      error: `${label} must be less than or equal to ${max.toLocaleString('en-IN', { maximumFractionDigits: 2 })}.`
    };
  }

  return {
    isValid: true,
    value: parsedValue
  };
}
