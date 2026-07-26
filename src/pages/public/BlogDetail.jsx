import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { ArrowLeftIcon, CalendarIcon, UserIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);

  // Fetch single blog
  const { data: blogData, isLoading, error } = useQuery(
    ['blog', id],
    async () => {
      const response = await api.get(`/blogs/${id}`);
      return response.data.data || null;
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  const blog = blogData;

  // Fetch related blogs (same category)
  const { data: relatedBlogsData } = useQuery(
    ['related-blogs', blog?.category],
    async () => {
      if (!blog?.category) return [];
      const response = await api.get('/blogs');
      const allBlogs = response.data.data || [];
      return allBlogs
        .filter(b => b.category === blog.category && b.id !== blog.id)
        .slice(0, 3);
    },
    {
      enabled: !!blog?.category,
      staleTime: 1000 * 60 * 5,
    }
  );

  const relatedBlogs = relatedBlogsData || [];

  // Image carousel functions
  const allImages = blog?.images && blog.images.length > 0 
    ? blog.images 
    : (blog?.image ? [{ image_data: blog.image }] : []);
  
  const currentImage = allImages[currentImageIndex];
  
  const goToPrevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1);
  };
  
  const goToNextImage = () => {
    setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-950 to-midnight-900 flex items-center justify-center">
        <p className="text-text-secondary text-lg">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-950 to-midnight-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-6">Article not found</p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-hover font-medium transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-950 to-midnight-900">
      {/* Image Modal - Gallery Viewer */}
      {selectedImageModal && selectedImageModal.length > 0 && (() => {
        const currentImage = selectedImageModal[galleryImageIndex];

        return (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
            onClick={() => setSelectedImageModal(null)}
          >
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute right-4 text-white hover:text-red-500 transition-colors z-50 bg-red-600 hover:bg-red-700 rounded-full p-2 shadow-lg"
              style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
              aria-label="Close"
              title="Close (ESC)"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {selectedImageModal.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGalleryImageIndex((prev) => (prev > 0 ? prev - 1 : selectedImageModal.length - 1));
                  }}
                  className="absolute left-4 text-white hover:text-red-500 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-black"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGalleryImageIndex((prev) => (prev < selectedImageModal.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-4 text-white hover:text-red-500 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-black"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={getImageUrl(currentImage?.image_data || currentImage?.image_url || '')}
                alt={`${blog.title} ${galleryImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              <button
                type="button"
                onClick={() => setSelectedImageModal(null)}
                className="mt-4 px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
              >
                Close
              </button>
              {selectedImageModal.length > 1 && (
                <div className="text-center text-white mt-4">
                  <span className="text-sm">{galleryImageIndex + 1} / {selectedImageModal.length}</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-gold hover:text-gold-hover font-medium transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to All Articles
        </Link>
      </div>

      {/* Hero Section with Image Carousel */}
      {allImages.length > 0 && (
        <div className="relative w-full h-64 md:h-[360px] lg:h-[420px] bg-midnight-800 overflow-hidden mb-8">
          {/* Main carousel image */}
          <div className="relative w-full h-full">
            <img
              src={getImageUrl(currentImage?.image_data || currentImage?.image_url || '')}
              alt={`${blog.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent"></div>
            
            {/* Image counter badge */}
            <div className="absolute bottom-4 right-4 bg-midnight-950/80 backdrop-blur-sm px-4 py-2 rounded-lg text-gold text-sm font-medium border border-midnight-700">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </div>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-midnight-950/70 hover:bg-midnight-950 text-gold p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-midnight-950/70 hover:bg-midnight-950 text-gold p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnail carousel at bottom */}
          {allImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-midnight-950 to-transparent p-4">
              <div className="flex gap-2 overflow-x-auto max-w-4xl mx-auto">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? 'border-gold shadow-lg shadow-gold/50' 
                        : 'border-midnight-700 hover:border-gold/50'
                    }`}
                  >
                    <img
                      src={getImageUrl(img.image_data || img.image_url || '')}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Article Content - revamped layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {/* Archived notice */}
        {blog.status === 'archived' && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-800 text-red-200">
            This article has been archived and is no longer actively maintained.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main column */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="inline-block px-4 py-1.5 bg-gold/20 text-gold text-xs font-bold rounded-full uppercase tracking-wide mb-4">
                {blog.category}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {blog.title}
              </h1>

              <p className="text-text-secondary text-sm mb-4 italic">{blog.excerpt}</p>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              {blog.content ? (
                <div
                  className="text-text-secondary leading-relaxed whitespace-pre-wrap text-base"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <p className="text-text-secondary leading-relaxed">{blog.excerpt}</p>
              )}
            </div>

            {/* Image gallery (larger) */}
            {allImages.length > 0 && (
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allImages.map((img, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-midnight-700 cursor-pointer group" onClick={() => {
                      setSelectedImageModal(allImages);
                      setGalleryImageIndex(idx);
                    }}>
                      <img src={getImageUrl(img.image_data || img.image_url || '')} alt={`${blog.title} ${idx+1}`} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles (keep as before) */}
            {relatedBlogs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Related Articles</h2>
                <p className="text-text-secondary mb-6">Explore more insights on this topic</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedBlogs.map(relatedBlog => (
                    <Link
                      key={relatedBlog.id}
                      to={`/blogs/${relatedBlog.id}`}
                      className="group bg-gradient-to-br from-midnight-800 to-midnight-750 rounded-xl overflow-hidden border border-midnight-700 hover:border-gold hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300"
                    >
                      <div className="h-44 overflow-hidden bg-midnight-700 relative">
                        {relatedBlog.image ? (
                          <img
                            src={relatedBlog.image}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.523 0 10-4.649 10-10.747S17.523 6.253 12 6.253z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full capitalize">
                            {relatedBlog.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gold transition-colors">{relatedBlog.title}</h3>
                        <p className="text-text-secondary text-sm line-clamp-2">{relatedBlog.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-midnight-900 border border-midnight-700 rounded-lg p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-red-600 flex items-center justify-center text-midnight-950 font-bold text-lg">
                  {blog.author ? blog.author.charAt(0) : 'A'}
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Author</div>
                  <div className="text-white font-semibold">{blog.author}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-text-secondary mb-2">Category</div>
                <div className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full">{blog.category}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-text-secondary mb-2">Status</div>
                <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full" style={{backgroundColor: blog.status === 'archived' ? 'rgba(128, 0, 0, 0.15)' : undefined}}>
                  <span className={`px-2 py-1 text-sm font-medium rounded-full ${blog.status === 'archived' ? 'bg-red-800/20 text-red-200 border border-red-700' : 'bg-green-100 text-green-800'}`}>
                    {blog.status}
                  </span>
                </div>
              </div>

              <div className="mb-4 text-text-secondary text-sm">
                <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gold" />{new Date(blog.created_at).toLocaleDateString()}</div>
              </div>

              <div className="mt-4">
                <div className="flex flex-col gap-3">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full px-4 py-2 bg-gold text-midnight-950 rounded-lg">Back to Top</button>
                <a href="/blogs" className="w-full inline-block text-center px-4 py-2 bg-midnight-800 text-gold border border-midnight-700 rounded-lg">All Articles</a>
              </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Related Articles
          </h2>
          <p className="text-text-secondary mb-12">Explore more insights on this topic</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedBlogs.map(relatedBlog => (
              <Link
                key={relatedBlog.id}
                to={`/blogs/${relatedBlog.id}`}
                className="group bg-gradient-to-br from-midnight-800 to-midnight-750 rounded-xl overflow-hidden border border-midnight-700 hover:border-gold hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-56 overflow-hidden bg-midnight-700 relative">
                  {relatedBlog.image ? (
                    <img
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.523 0 10-4.649 10-10.747S17.523 6.253 12 6.253z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full capitalize">
                      {relatedBlog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                    {relatedBlog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-text-secondary text-sm mb-6 line-clamp-2">
                    {relatedBlog.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-midnight-700">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>{new Date(relatedBlog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{relatedBlog.readTime}</span>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gold/10 via-midnight-800 to-red-600/10 border-y border-midnight-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Auction Journey?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Discover premium properties and start bidding with DreamBid today. Join thousands of satisfied bidders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center px-8 py-3 bg-gold text-midnight-950 font-bold rounded-lg hover:bg-gold/90 transition-all duration-300 hover:shadow-lg hover:shadow-gold/50"
            >
              Explore Properties
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/blogs"
              className="inline-flex items-center justify-center px-8 py-3 bg-midnight-800 text-gold border border-midnight-700 font-bold rounded-lg hover:bg-midnight-700 transition-all duration-300"
            >
              More Articles
            </Link>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
}

export default BlogDetail;
