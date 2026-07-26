export const getActiveEnquiry = (selectedEnquiry, isDetailsOpen) => {
  if (!selectedEnquiry || !isDetailsOpen) {
    return null;
  }

  return selectedEnquiry;
};

export const openEnquiryDetails = (enquiry, setSelectedEnquiry, setIsDetailsOpen) => {
  setSelectedEnquiry(enquiry);
  setIsDetailsOpen(true);
};

export const closeEnquiryDetails = (setSelectedEnquiry, setIsDetailsOpen) => {
  setSelectedEnquiry(null);
  setIsDetailsOpen(false);
};
