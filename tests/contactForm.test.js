import test from 'node:test';
import assert from 'node:assert/strict';

import { buildContactSubmissionData } from '../src/utils/contactForm.js';

test('buildContactSubmissionData includes form fields and appends multiple attachments', () => {
  const formData = {
    name: 'Jane Doe',
    contactNumber: '9876543210',
    email: 'jane@example.com',
    contactingAs: 'buyer',
    message: 'Need help',
    attachments: [{ name: 'doc1.pdf' }, { name: 'photo.png' }],
  };

  const submissionData = buildContactSubmissionData(formData);

  assert.equal(submissionData.get('name'), 'Jane Doe');
  assert.equal(submissionData.get('contactNumber'), '9876543210');
  assert.equal(submissionData.get('email'), 'jane@example.com');
  assert.equal(submissionData.get('contactingAs'), 'buyer');
  assert.equal(submissionData.get('message'), 'Need help');
  assert.equal(submissionData.getAll('attachment').length, 2);
});

test('buildContactSubmissionData skips empty attachments', () => {
  const submissionData = buildContactSubmissionData({
    name: 'Jane Doe',
    contactNumber: '9876543210',
    email: 'jane@example.com',
    contactingAs: '',
    message: '',
    attachments: [],
  });

  assert.equal(submissionData.get('name'), 'Jane Doe');
  assert.equal(submissionData.getAll('attachment').length, 0);
});
