import test from 'node:test';
import assert from 'node:assert/strict';
import { getActiveEnquiry, openEnquiryDetails, closeEnquiryDetails } from '../src/utils/enquiriesSelection.js';

test('shows only the currently selected enquiry details when the mobile sheet is open', () => {
  assert.equal(getActiveEnquiry(null, true), null);
  assert.equal(getActiveEnquiry({ id: 1 }, false), null);
  assert.deepEqual(getActiveEnquiry({ id: 1 }, true), { id: 1 });
});

test('opens a single enquiry detail view and clears it when closed', () => {
  let selectedEnquiry = null;
  let isDetailsOpen = false;

  openEnquiryDetails({ id: 42 }, (value) => {
    selectedEnquiry = value;
  }, (value) => {
    isDetailsOpen = value;
  });

  assert.deepEqual(selectedEnquiry, { id: 42 });
  assert.equal(isDetailsOpen, true);

  closeEnquiryDetails((value) => {
    selectedEnquiry = value;
  }, (value) => {
    isDetailsOpen = value;
  });

  assert.equal(selectedEnquiry, null);
  assert.equal(isDetailsOpen, false);
});
