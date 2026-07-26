import test from 'node:test';
import assert from 'node:assert/strict';
import {
  closeRegistrationDetails,
  getActiveRegistration,
  openRegistrationDetails,
} from '../src/utils/registrationsSelection.js';

test('openRegistrationDetails sets the selected registration and opens details', () => {
  let selectedRegistration = null;
  let isDetailsOpen = false;

  openRegistrationDetails({ id: 1 }, (value) => {
    selectedRegistration = value;
  }, (value) => {
    isDetailsOpen = value;
  });

  assert.deepEqual(selectedRegistration, { id: 1 });
  assert.equal(isDetailsOpen, true);
});

test('getActiveRegistration returns null when details are closed', () => {
  assert.equal(getActiveRegistration({ id: 1 }, false), null);
  assert.equal(getActiveRegistration(null, true), null);
});

test('closeRegistrationDetails clears the selected registration and closes details', () => {
  let selectedRegistration = { id: 1 };
  let isDetailsOpen = true;

  closeRegistrationDetails((value) => {
    selectedRegistration = value;
  }, (value) => {
    isDetailsOpen = value;
  });

  assert.equal(selectedRegistration, null);
  assert.equal(isDetailsOpen, false);
});
