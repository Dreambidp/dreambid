export const getActiveRegistration = (selectedRegistration, isDetailsOpen) => {
  if (!selectedRegistration || !isDetailsOpen) {
    return null;
  }

  return selectedRegistration;
};

export const openRegistrationDetails = (registration, setSelectedRegistration, setIsDetailsOpen) => {
  setSelectedRegistration(registration);
  setIsDetailsOpen(true);
};

export const closeRegistrationDetails = (setSelectedRegistration, setIsDetailsOpen) => {
  setSelectedRegistration(null);
  setIsDetailsOpen(false);
};
