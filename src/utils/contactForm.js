export const buildContactSubmissionData = (formData = {}) => {
  const submitData = new FormData();

  submitData.append('name', formData.name || '');
  submitData.append('email', formData.email || '');
  submitData.append('contactNumber', formData.contactNumber || '');
  submitData.append('contactingAs', formData.contactingAs || '');
  submitData.append('message', formData.message || '');

  const attachments = Array.isArray(formData.attachments)
    ? formData.attachments
    : formData.attachment
      ? [formData.attachment]
      : [];

  attachments.filter(Boolean).forEach((file) => {
    const isFileLike = typeof File !== 'undefined' && file instanceof File
      ? true
      : typeof file === 'object' && file !== null && typeof file.name === 'string';

    if (isFileLike) {
      submitData.append('attachment', file);
    }
  });

  return submitData;
};
