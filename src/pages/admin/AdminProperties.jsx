import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function Properties() {
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch properties with proper caching and quick refresh capability
  const { data, isLoading, isFetching, error, refetch } = useQuery(
    ['properties', statusFilter],
    () => propertiesAPI.getAll({ status: statusFilter || '', limit: 100 }),
    {
      staleTime: 1000 * 30, // 30 seconds
      cacheTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  const deleteMutation = useMutation(
    (id) => propertiesAPI.delete(id),
    {
      onSuccess: () => {
        toast.success('Property deleted successfully');
        // Invalidate all property-related queries
        queryClient.invalidateQueries('properties');
        queryClient.invalidateQueries(['properties']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete property');
      },
    }
  );

  const properties = data?.data?.data?.properties || [];

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-300">Error loading properties: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Properties</h1>
          <p className="text-sm text-text-secondary mt-1">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex-1 sm:flex-none border border-midnight-700 bg-midnight-900 px-4 py-2 text-sm font-semibold text-text-primary hover:border-gold hover:text-white rounded-lg transition disabled:opacity-50"
          >
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            to="/admin/properties/new"
            className="flex-1 sm:flex-none bg-gold px-4 py-2 rounded-lg font-semibold text-midnight-950 hover:bg-gold/90 transition text-sm inline-flex items-center justify-center"
          >
            Add Property
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-midnight-800 border border-midnight-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="sold">Sold</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Properties List */}
      <div className="bg-midnight-900 border border-midnight-700 rounded-lg overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            <p>No properties found.</p>
            <Link to="/admin/properties/new" className="text-gold hover:text-gold-hover mt-2 inline-block font-medium">
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-midnight-700">
              <thead className="bg-midnight-800 border-b border-midnight-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Reserve Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Auction Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-midnight-900 divide-y divide-midnight-700">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-midnight-800 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {(property.cover_image_url || (property.images && property.images.length > 0)) && (
                          <img
                            src={getImageUrl(property.cover_image_url || 
                              (property.images && property.images.length > 0 
                                ? (typeof property.images[0] === 'object' ? (property.images[0].image_data || property.images[0].image_url) : property.images[0])
                                : null))}
                            alt={property.title}
                            className="h-12 w-12 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-text-primary">{property.title}</div>
                          <div className="text-sm text-text-secondary">{property.property_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{property.city}</div>
                      <div className="text-sm text-text-secondary">{property.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      ₹{parseFloat(property.reserve_price).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {new Date(property.auction_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {property.views_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                        className="text-gold hover:text-gold-hover mr-4 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property.id, property.title)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;
