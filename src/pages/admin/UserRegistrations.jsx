import { useQuery } from 'react-query';
import { userRegistrationsAPI } from '../../services/admin-api';
import toast from 'react-hot-toast';
import { UserIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { closeRegistrationDetails, getActiveRegistration, openRegistrationDetails } from '../../utils/registrationsSelection';

function UserRegistrations() {
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const activeRegistration = getActiveRegistration(selectedRegistration, isDetailsOpen);

  const { data: registrationsData, isLoading, error } = useQuery(
    'user-registrations',
    async () => {
      const response = await userRegistrationsAPI.getAll();
      return response.data;
    },
    {
      onError: (err) => {
        toast.error('Failed to fetch registrations');
      },
    }
  );

  const registrations = registrationsData?.registrations || [];

  const handleRegistrationSelect = (registration) => {
    openRegistrationDetails(registration, setSelectedRegistration, setIsDetailsOpen);
  };

  const handleDetailsClose = () => {
    closeRegistrationDetails(setSelectedRegistration, setIsDetailsOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-secondary">Loading registrations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">Failed to load registrations</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">User Registrations</h1>

      {registrations.length === 0 ? (
        <div className="bg-midnight-800 border border-midnight-700 rounded-lg p-8 text-center">
          <p className="text-text-secondary">No registrations yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registrations List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRegistrationSelect(reg)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleRegistrationSelect(reg);
                    }
                  }}
                  className={`bg-midnight-800 border border-midnight-700 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:border-gold ${
                    activeRegistration?.id === reg.id ? 'border-gold bg-midnight-750' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{reg.name}</h3>
                      <p className="text-text-secondary flex items-center gap-2 mt-1">
                        <UserIcon className="w-4 h-4" />
                        {reg.contact_number}
                      </p>
                    </div>
                    <span className="text-xs text-text-muted">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {reg.requirements && Array.isArray(reg.requirements) && (
                    <div className="text-sm text-text-secondary space-y-1">
                      <p className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        {reg.requirements.length} requirement(s)
                      </p>
                      {reg.requirements[0] && (
                        <p>
                          Interested in: {reg.requirements[0].propertyType?.join(', ') || 'N/A'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          {activeRegistration && (
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-midnight-800 border border-midnight-700 rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-white mb-6">Registration Details</h2>

                {/* Basic Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-text-muted text-sm mb-1">Name</p>
                    <p className="text-white font-medium">{activeRegistration.name}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm mb-1">Contact Number</p>
                    <p className="text-white font-medium">{activeRegistration.contact_number}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm mb-1">Registered On</p>
                    <p className="text-white font-medium">
                      {new Date(activeRegistration.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                {activeRegistration.requirements && Array.isArray(activeRegistration.requirements) && (
                  <div className="border-t border-midnight-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
                    <div className="space-y-4">
                      {activeRegistration.requirements.map((req, idx) => (
                        <div key={idx} className="bg-midnight-900 rounded-lg p-4 border border-midnight-700">
                          <p className="text-gold text-sm font-semibold mb-3">Requirement {idx + 1}</p>

                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-text-muted mb-1">City/Locality</p>
                              <p className="text-text-primary">{req.preferredCity || 'N/A'}</p>
                            </div>

                            <div>
                              <p className="text-text-muted mb-1">Budget</p>
                              <p className="text-text-primary">{req.budget || 'N/A'}</p>
                            </div>

                            <div>
                              <p className="text-text-muted mb-1">Property Type</p>
                              <p className="text-text-primary">
                                {Array.isArray(req.propertyType) && req.propertyType.length > 0
                                  ? req.propertyType.join(', ')
                                  : 'N/A'}
                              </p>
                            </div>

                            <div>
                              <p className="text-text-muted mb-1">Requirement Type</p>
                              <p className="text-text-primary capitalize">{req.requirementType || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile details modal */}
          {activeRegistration && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="w-full max-w-xl bg-midnight-800 border border-midnight-700 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-midnight-700">
                  <h2 className="text-xl font-semibold text-white">Registration Details</h2>
                  <button
                    type="button"
                    onClick={handleDetailsClose}
                    className="text-text-secondary hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-text-muted text-sm mb-1">Name</p>
                      <p className="text-white font-medium">{activeRegistration.name}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-sm mb-1">Contact Number</p>
                      <p className="text-white font-medium">{activeRegistration.contact_number}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-sm mb-1">Registered On</p>
                      <p className="text-white font-medium">
                        {new Date(activeRegistration.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {activeRegistration.requirements && Array.isArray(activeRegistration.requirements) && (
                    <div className="border-t border-midnight-700 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
                      <div className="space-y-4">
                        {activeRegistration.requirements.map((req, idx) => (
                          <div key={idx} className="bg-midnight-900 rounded-lg p-4 border border-midnight-700">
                            <p className="text-gold text-sm font-semibold mb-3">Requirement {idx + 1}</p>

                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-text-muted mb-1">City/Locality</p>
                                <p className="text-text-primary">{req.preferredCity || 'N/A'}</p>
                              </div>

                              <div>
                                <p className="text-text-muted mb-1">Budget</p>
                                <p className="text-text-primary">{req.budget || 'N/A'}</p>
                              </div>

                              <div>
                                <p className="text-text-muted mb-1">Property Type</p>
                                <p className="text-text-primary">
                                  {Array.isArray(req.propertyType) && req.propertyType.length > 0
                                    ? req.propertyType.join(', ')
                                    : 'N/A'}
                                </p>
                              </div>

                              <div>
                                <p className="text-text-muted mb-1">Requirement Type</p>
                                <p className="text-text-primary capitalize">{req.requirementType || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserRegistrations;
