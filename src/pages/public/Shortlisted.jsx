import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShortlist } from '../../contexts/ShortlistContext';
import { getImageUrl } from '../../utils/imageUrl';
import { shareProperty } from '../../utils/whatsapp';
import toast from 'react-hot-toast';

function Shortlisted() {
  const navigate = useNavigate();
  const { shortlistedProperties, toggleShortlist, isShortlisted, clearShortlist } = useShortlist();

  const groupedProperties = useMemo(() => {
    const groups = {
      active: [],
      expired: [],
    };

    shortlistedProperties.forEach(property => {
      if (property.auction_date) {
        const auctionDate = new Date(property.auction_date).getTime();
        const now = new Date().getTime();
        if (auctionDate > now) {
          groups.active.push(property);
        } else {
          groups.expired.push(property);
        }
      } else {
        groups.active.push(property);
      }
    });

    return groups;
  }, [shortlistedProperties]);

  const handleRemoveFromShortlist = (property) => {
    toggleShortlist(property);
    toast.success('Removed from shortlist');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all shortlisted properties?')) {
      clearShortlist();
      toast.success('All properties cleared from shortlist');
    }
  };

  const renderPropertyCard = (property) => {
    const imageUrl = property.cover_image_url || 
      (property.images && property.images.length > 0 
        ? (typeof property.images[0] === 'object' ? (property.images[0].image_data || property.images[0].image_url) : property.images[0])
        : null);

    return (
      <div
        key={property.id}
        className="card overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/properties/${property.id}`)}
      >
        {/* Image Section */}
        <div className="relative h-56 bg-midnight-800 overflow-hidden group">
          {imageUrl ? (
            <img
              src={getImageUrl(imageUrl)}
              alt={property.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-75 transition duration-300"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231F2A3D" width="400" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-midnight-800">
              <span className="text-text-secondary">No Image</span>
            </div>
          )}

          {/* Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveFromShortlist(property);
            }}
            className="absolute top-4 right-4 p-2 bg-midnight-800 rounded-full hover:bg-midnight-700 transition"
            title="Remove from shortlist"
          >
            <svg className="w-5 h-5 fill-red-500 text-red-500" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-lg md:text-2xl font-bold text-text-primary mb-3 line-clamp-2 min-h-14">
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-text-secondary text-xs md:text-sm mb-4">
            📍 {property.city}, {property.state}
          </p>

          {/* Property Details Grid */}
          <div className="space-y-3 mb-4 pb-4 border-b border-midnight-700">
            <div>
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">Reserve Price</p>
              <p className="text-lg md:text-2xl font-bold text-gold">
                ₹{parseFloat(property.reserve_price).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-text-secondary mb-1">Auction Date</p>
                <p className="font-semibold text-text-primary">
                  {property.auction_date 
                    ? new Date(property.auction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Property Type</p>
                <p className="font-semibold text-text-primary">{property.property_type ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1) : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              to={`/properties/${property.id}`}
              className="flex-1 px-4 py-3 bg-gold-hover text-midnight-950 rounded-btn hover:bg-gold transition font-semibold text-sm btn-primary flex items-center justify-center"
            >
              View Details
            </Link>
            <button
              onClick={() => shareProperty(property)}
              className="flex-1 px-4 py-3 bg-status-live text-white rounded-btn hover:bg-green-600 transition flex items-center justify-center gap-2"
              title="Share on WhatsApp"
            >
              <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-midnight-950">
      {/* Header */}
      <div className="bg-midnight-900 border-b border-midnight-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary font-sans">Shortlisted Properties</h1>
              <p className="mt-2 text-text-secondary">
                Total: {shortlistedProperties.length} properties
              </p>
            </div>
            {shortlistedProperties.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition font-medium border border-red-500/30"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shortlistedProperties.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-text-secondary/40 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-text-primary mb-2">No Shortlisted Properties</h2>
              <p className="text-text-secondary mb-6">
                You haven't shortlisted any properties yet. Start exploring properties by clicking the heart icon.
              </p>
              <Link
                to="/properties"
                className="inline-block px-6 py-3 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] transition font-medium"
              >
                Explore Properties
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Listings */}
            {groupedProperties.active.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2 font-sans">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active Auctions ({groupedProperties.active.length})
                  </h2>
                  <p className="text-text-secondary mt-2">
                    Auctions still available for bidding
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedProperties.active.map((property) => renderPropertyCard(property))}
                </div>
              </div>
            )}

            {/* Expired Listings */}
            {groupedProperties.expired.length > 0 && (
              <div>
                <div className="mb-6 pt-8 border-t border-midnight-700">
                  <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2 font-sans">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Expired Auctions ({groupedProperties.expired.length})
                  </h2>
                  <p className="text-text-secondary mt-2">
                    These auctions have ended. You can remove them from your shortlist.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                  {groupedProperties.expired.map((property) => renderPropertyCard(property))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shortlisted;
