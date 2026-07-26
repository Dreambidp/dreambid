import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { enquiriesAPI } from '../../services/api';
import { closeEnquiryDetails, getActiveEnquiry, openEnquiryDetails } from '../../utils/enquiriesSelection';
import toast from 'react-hot-toast';

const getAttachmentList = (enquiry) => {
  if (!enquiry?.attachment_files) return [];

  if (Array.isArray(enquiry.attachment_files)) {
    return enquiry.attachment_files;
  }

  if (typeof enquiry.attachment_files === 'string') {
    try {
      return JSON.parse(enquiry.attachment_files);
    } catch (error) {
      return [];
    }
  }

  return [];
};

function Enquiries() {
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const queryClient = useQueryClient();
  const activeEnquiry = getActiveEnquiry(selectedEnquiry, isDetailsOpen);

  const { data, isLoading, error } = useQuery(
    ['enquiries', statusFilter],
    () => enquiriesAPI.getAll({ status: statusFilter || undefined, limit: 100 })
  );

  const updateStatusMutation = useMutation(
    ({ id, status }) => enquiriesAPI.updateStatus(id, status),
    {
      onSuccess: (response, { id, status }) => {
        toast.success('Enquiry status updated');
        // Update the selected enquiry with the new status
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({
            ...selectedEnquiry,
            status: status
          });
        }
        // Invalidate queries to refresh the list
        queryClient.invalidateQueries('enquiries');
        queryClient.invalidateQueries(['enquiries', statusFilter]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update status');
      },
    }
  );

  const enquiries = data?.data?.enquiries || [];

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleEnquirySelect = (enquiry) => {
    openEnquiryDetails(enquiry, setSelectedEnquiry, setIsDetailsOpen);
  };

  const handleDetailsClose = () => {
    closeEnquiryDetails(setSelectedEnquiry, setIsDetailsOpen);
  };

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
    closeEnquiryDetails(setSelectedEnquiry, setIsDetailsOpen);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'contacted': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      case 'not_interested': return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'unable_to_connect': return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
      case 'call_later': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading enquiries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-300">Error loading enquiries: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Enquiries List */}
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Enquiries</h1>
          
          {/* Filters */}
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-midnight-700 border border-midnight-600 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="not_interested">Not Interested</option>
            <option value="unable_to_connect">Unable to Connect</option>
            <option value="call_later">Asked to Call Later</option>
          </select>
        </div>

        {/* Enquiries List */}
        <div className="space-y-3">
          {enquiries.length === 0 ? (
            <div className="bg-midnight-900 border border-midnight-700 rounded-lg p-8 text-center text-text-secondary">
              <p>No enquiries found.</p>
            </div>
          ) : (
            enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                role="button"
                tabIndex={0}
                onClick={() => handleEnquirySelect(enquiry)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleEnquirySelect(enquiry);
                  }
                }}
                className={`bg-midnight-900 border border-midnight-700 rounded-lg p-4 cursor-pointer transition-all hover:border-gold ${
                  selectedEnquiry?.id === enquiry.id ? 'border-gold ring-2 ring-gold/20' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{enquiry.name}</h3>
                    <p className="text-sm text-text-secondary truncate">{enquiry.email}</p>
                    <p className="text-sm text-text-secondary">{enquiry.phone}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enquiry.status)}`}>
                      {enquiry.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-midnight-700">
                  <p className="text-sm text-text-primary font-medium truncate">{enquiry.property_title}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {new Date(enquiry.created_at).toLocaleDateString()} at {new Date(enquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column - Details Panel */}
      {activeEnquiry && (
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-midnight-900 border border-midnight-700 rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold text-text-primary mb-6">Enquiry Details</h2>

            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-text-secondary">Name</p>
                    <p className="text-sm text-text-primary font-medium">{activeEnquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Email</p>
                    <p className="text-sm text-text-primary font-medium break-all">{activeEnquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Phone</p>
                    <p className="text-sm text-text-primary font-medium">{activeEnquiry.phone}</p>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div className="pt-4 border-t border-midnight-700">
                <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Property Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-text-secondary">Property</p>
                    <p className="text-sm text-text-primary font-medium">{activeEnquiry.property_title}</p>
                  </div>
                  {activeEnquiry.property_address && (
                    <div>
                      <p className="text-xs text-text-secondary">Address</p>
                      <p className="text-sm text-text-primary">{activeEnquiry.property_address}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-text-secondary">Type</p>
                    <p className="text-sm text-text-primary font-medium">{activeEnquiry.enquiry_type || 'General Inquiry'}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {activeEnquiry.message && (
                <div className="pt-4 border-t border-midnight-700">
                  <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Message</h3>
                  <p className="text-sm text-text-primary bg-midnight-800 rounded-lg p-3">
                    {activeEnquiry.message}
                  </p>
                </div>
              )}

              {/* Attachments */}
              {getAttachmentList(activeEnquiry).length > 0 && (
                <div className="pt-4 border-t border-midnight-700">
                  <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Attachments</h3>
                  <div className="space-y-3">
                    {getAttachmentList(activeEnquiry).map((attachment, index) => (
                      <div key={`${attachment.url || attachment.storedName || index}`} className="rounded-lg border border-midnight-700 bg-midnight-800 p-3">
                        {attachment.mimeType?.startsWith('image/') ? (
                          <a href={attachment.url} target="_blank" rel="noreferrer" className="block">
                            <img src={attachment.url} alt={attachment.originalName || 'Attachment'} className="max-h-40 w-full rounded object-cover" />
                          </a>
                        ) : (
                          <a href={attachment.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gold hover:text-gold-hover">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>{attachment.originalName || 'Download attachment'}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status & Actions */}
              <div className="pt-4 border-t border-midnight-700">
                <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Status</h3>
                <select
                  value={activeEnquiry.status}
                  onChange={(e) => {
                    handleStatusChange(activeEnquiry.id, e.target.value);
                    setSelectedEnquiry({ ...activeEnquiry, status: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-midnight-800 border border-midnight-600 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="not_interested">Not Interested</option>
                  <option value="unable_to_connect">Unable to Connect</option>
                  <option value="call_later">Asked to Call Later</option>
                </select>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-midnight-700">
                <p className="text-xs text-text-secondary">
                  Created: {new Date(activeEnquiry.created_at).toLocaleDateString()} {new Date(activeEnquiry.created_at).toLocaleTimeString()}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  ID: {activeEnquiry.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile details modal */}
      {activeEnquiry && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-midnight-900 border border-midnight-700 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-midnight-700">
              <h2 className="text-xl font-bold text-text-primary">Enquiry Details</h2>
              <button
                type="button"
                onClick={handleDetailsClose}
                className="text-text-secondary hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-text-secondary">Name</p>
                    <p className="text-sm text-text-primary font-medium">{activeEnquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Email</p>
                    <p className="text-sm text-text-primary font-medium break-all">{activeEnquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Phone</p>
                    <p className="text-sm text-text-primary font-medium">{activeEnquiry.phone}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-midnight-700">
                <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Property Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-text-secondary">Property</p>
                    <p className="text-sm text-text-primary font-medium">{activeEnquiry.property_title}</p>
                  </div>
                  {activeEnquiry.property_address && (
                    <div>
                      <p className="text-xs text-text-secondary">Address</p>
                      <p className="text-sm text-text-primary">{activeEnquiry.property_address}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-text-secondary">Type</p>
                    <p className="text-sm text-text-primary font-medium">{activeEnquiry.enquiry_type || 'General Inquiry'}</p>
                  </div>
                </div>
              </div>

              {activeEnquiry.message && (
                <div className="pt-4 border-t border-midnight-700">
                  <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Message</h3>
                  <p className="text-sm text-text-primary bg-midnight-800 rounded-lg p-3">
                    {activeEnquiry.message}
                  </p>
                </div>
              )}

              {getAttachmentList(activeEnquiry).length > 0 && (
                <div className="pt-4 border-t border-midnight-700">
                  <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Attachments</h3>
                  <div className="space-y-3">
                    {getAttachmentList(activeEnquiry).map((attachment, index) => (
                      <div key={`${attachment.url || attachment.storedName || index}`} className="rounded-lg border border-midnight-700 bg-midnight-800 p-3">
                        {attachment.mimeType?.startsWith('image/') ? (
                          <a href={attachment.url} target="_blank" rel="noreferrer" className="block">
                            <img src={attachment.url} alt={attachment.originalName || 'Attachment'} className="max-h-40 w-full rounded object-cover" />
                          </a>
                        ) : (
                          <a href={attachment.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gold hover:text-gold-hover">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>{attachment.originalName || 'Download attachment'}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-midnight-700">
                <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3">Status</h3>
                <select
                  value={activeEnquiry.status}
                  onChange={(e) => {
                    handleStatusChange(activeEnquiry.id, e.target.value);
                    setSelectedEnquiry({ ...activeEnquiry, status: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-midnight-800 border border-midnight-600 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="not_interested">Not Interested</option>
                  <option value="unable_to_connect">Unable to Connect</option>
                  <option value="call_later">Asked to Call Later</option>
                </select>
              </div>

              <div className="pt-4 border-t border-midnight-700">
                <p className="text-xs text-text-secondary">
                  Created: {new Date(activeEnquiry.created_at).toLocaleDateString()} {new Date(activeEnquiry.created_at).toLocaleTimeString()}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  ID: {activeEnquiry.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enquiries;
