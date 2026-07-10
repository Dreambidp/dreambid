import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuctionStatusUpdateQuery } from '../utils/propertyQueries.js';

test('buildAuctionStatusUpdateQuery uses a valid WHERE clause', () => {
  const query = buildAuctionStatusUpdateQuery();

  assert.match(query, /UPDATE properties/i);
  assert.match(query, /WHERE status = 'upcoming' AND auction_date <= \$1/i);
  assert.doesNotMatch(query, /\)\s*$/);
});
