import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { propertiesAPI } from '../../services/api';

const statusClassNames = {
  new: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25',
  contacted: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  resolved: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  closed: 'bg-gray-500/15 text-gray-300 border border-gray-500/25',
  not_interested: 'bg-red-500/15 text-red-300 border border-red-500/25',
  unable_to_connect: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
  call_later: 'bg-purple-500/15 text-purple-300 border border-purple-500/25',
};

const metricCards = [
  { key: 'totalProperties', label: 'Total Properties', color: 'text-white', icon: '🏠' },
  { key: 'activeAuctions', label: 'Active Auctions', color: 'text-emerald-300', icon: '⚡' },
  { key: 'upcomingAuctions', label: 'Upcoming Auctions', color: 'text-sky-300', icon: '⏳' },
  { key: 'newEnquiries', label: 'New Enquiries', color: 'text-orange-300', icon: '✉️' },
  { key: 'totalViews', label: 'Total Views', color: 'text-violet-300', icon: '👁️' },
  { key: 'totalShares', label: 'Total Shares', color: 'text-cyan-300', icon: '🔗' },
  { key: 'totalEnquiries', label: 'Total Enquiries', color: 'text-rose-300', icon: '📥' },
];

function Dashboard() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery('dashboardStats', propertiesAPI.getDashboardStats, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const dashboard = data?.data?.data;
  const stats = dashboard?.stats || {};
  const enquiries = dashboard?.recent_enquiries || [];

  const lastUpdated = useMemo(() => {
    if (!data) return 'Fetching...';
    return new Date().toLocaleString();
  }, [data]);

  const renderStatValue = (value) => {
    if (isLoading) {
      return <span className="block h-8 w-16 rounded bg-midnight-800 animate-pulse" />;
    }
    return <span className="text-3xl font-semibold text-text-primary">{value ?? '0'}</span>;
  };

  const getStatusClassName = (status) => {
    return statusClassNames[status] || 'bg-gray-500/15 text-gray-300 border border-gray-500/25';
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">Last updated: {lastUpdated}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => refetch()}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-midnight-700 bg-midnight-900 px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-gold hover:text-white"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/properties/new')}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-midnight-950 transition hover:bg-gold/90"
          >
            Add Property
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
          Failed to load dashboard data. Please refresh or try again later.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metricCards.slice(0, 4).map((card) => (
              <div key={card.key} className="min-w-0 rounded-3xl border border-midnight-700 bg-midnight-900 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">{card.label}</p>
                    {renderStatValue(stats[card.key])}
                  </div>
                  <div className="rounded-2xl bg-midnight-800 p-3 text-xl">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metricCards.slice(4).map((card) => (
              <div key={card.key} className="min-w-0 rounded-3xl border border-midnight-700 bg-midnight-900 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">{card.label}</p>
                {renderStatValue(stats[card.key])}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-midnight-700 bg-midnight-900 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Recent Enquiries</h2>
                <p className="text-sm text-text-secondary">Latest enquiries from buyers and leads.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-midnight-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-text-secondary">
                  {enquiries.length} recent entries
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/admin/enquiries')}
                  className="inline-flex items-center justify-center rounded-full border border-midnight-700 bg-midnight-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-gold hover:text-gold"
                >
                  View all enquiries
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-3xl border border-midnight-700 bg-midnight-800 p-4 animate-pulse" />
                ))
              ) : enquiries.length === 0 ? (
                <div className="rounded-3xl border border-midnight-700 bg-midnight-800 p-8 text-center text-text-secondary">
                  No recent enquiries yet.
                </div>
              ) : (
                enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="rounded-3xl border border-midnight-700 bg-midnight-950 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-text-primary">{enquiry.name}</h3>
                        <p className="text-sm text-text-secondary truncate">{enquiry.email} • {enquiry.phone}</p>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(enquiry.status)}`}>
                        {enquiry.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Property</p>
                          <p className="mt-1 text-sm text-text-primary">{enquiry.property_title}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Address</p>
                          <p className="mt-1 text-sm text-text-primary truncate">{enquiry.property_address || 'N/A'}</p>
                        </div>
                      </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
