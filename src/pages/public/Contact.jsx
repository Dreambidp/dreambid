import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { contactAPI } from '../../services/api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    contactingAs: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const termsRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for contact number - only digits, max 10
    if (name === 'contactNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure terms accepted (button is disabled normally, but handle Enter key submits)
      if (!acceptedTerms) {
        setShowTermsError(true);
        setIsSubmitting(false);
        // focus the checkbox for accessibility
        if (termsRef?.current) termsRef.current.focus();
        return;
      }

      if (!formData.name || !formData.contactNumber || !formData.email) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      if (!acceptedTerms) {
        toast.error('Please accept the Privacy Policy and Terms of Service');
        setIsSubmitting(false);
        return;
      }

      // Make API request with JSON data (no files)
      await contactAPI.submit(formData);

      toast.success('Thank you! We will contact you soon.');
      setFormData({
        name: '',
        contactNumber: '',
        email: '',
        contactingAs: '',
        message: '',
      });
      setAcceptedTerms(false);
      setAcceptNewsletter(false);
      setShowTermsError(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-midnight-950 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Get In Touch
          </h1>
          <p className="text-text-secondary text-base md:text-lg">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Content - Contact Cards and Form */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Contact Cards */}
          <div className="space-y-4">
            {/* Email Card */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-midnight-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Email Us</h3>
              <p className="text-text-secondary text-sm mb-3">
                Send us your queries and we'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:dreambidproperties01@gmail.com"
                className="text-gold hover:text-gold-hover font-semibold text-sm transition"
              >
                dreambidproperties01@gmail.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-midnight-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.73 1.365a1 1 0 001.27-1.27l-1.365-2.73a1 1 0 00.756-.502l4.493-1.498a1 1 0 00.684-.948V5a2 2 0 00-2-2h-2.5a2.012 2.012 0 00-1.412.588l-.662.662A2 2 0 006.832 4h-1.7a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V9a1 1 0 10-2 0v8a2 2 0 11-4 0V5a2 2 0 00-2-2h-2.5a2 2 0 00-1.412.588l-.662.662A2 2 0 006.168 4H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Call Us</h3>
              <p className="text-text-secondary text-sm mb-3">
                Speak directly with our support team.
              </p>
              <a
                href="tel:+917428264402"
                className="text-gold hover:text-gold-hover font-semibold text-sm transition"
              >
                +91-7428264402
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-status-live rounded-lg flex items-center justify-center mb-4">
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">WhatsApp Us</h3>
              <p className="text-text-secondary text-sm mb-3">
                Quick support via WhatsApp messaging.
              </p>
              <a
                href="https://wa.me/917428264402?text=Hi%20I%20would%20like%20to%20know%20more%20about%20DreamBid"
                target="_blank"
                rel="noopener noreferrer"
                className="text-status-live hover:text-green-600 font-semibold text-sm transition"
              >
                +91-7428264402
              </a>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:col-span-2">
            <div className="card p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-midnight-800 border border-midnight-700 text-text-primary placeholder-text-muted rounded-input focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-semibold text-text-primary mb-2">
                    Contact Number *
                    <span className={`ml-2 text-xs ${formData.contactNumber.length === 10 ? 'text-green-400' : 'text-gray-400'}`}>
                      ({formData.contactNumber.length}/10)
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="Enter 10-digit mobile number"
                    className={`w-full px-4 py-3 bg-midnight-800 border text-text-primary placeholder-text-muted rounded-input focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition ${
                      formData.contactNumber.length === 10 ? 'border-green-500' : 'border-midnight-700'
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-midnight-800 border border-midnight-700 text-text-primary placeholder-text-muted rounded-input focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Contacting As */}
                <div>
                  <label htmlFor="contactingAs" className="block text-sm font-semibold text-text-primary mb-2">
                    Contacting As
                  </label>
                  <select
                    id="contactingAs"
                    name="contactingAs"
                    value={formData.contactingAs}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-midnight-800 border border-midnight-700 text-text-primary rounded-input focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                  >
                    <option value="" className="bg-midnight-800">Select an option</option>
                    <option value="buyer" className="bg-midnight-800">Buyer</option>
                    <option value="seller" className="bg-midnight-800">Seller</option>
                    <option value="investor" className="bg-midnight-800">Investor</option>
                    <option value="other" className="bg-midnight-800">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-text-primary mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about your inquiry..."
                    className="w-full px-4 py-3 bg-midnight-800 border border-midnight-700 text-text-primary placeholder-text-muted rounded-input focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 py-4 border-y border-midnight-700">
                  <div>
                    <label className="flex items-start cursor-pointer">
                      <input
                        ref={termsRef}
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => { setAcceptedTerms(e.target.checked); if (e.target.checked) setShowTermsError(false); }}
                        className="mt-1 w-4 h-4 rounded bg-midnight-800 border-midnight-700 text-gold focus:ring-gold cursor-pointer"
                        aria-required="true"
                        aria-invalid={showTermsError}
                      />
                      <span className="ml-3 text-sm text-text-secondary">
                        I agree to the{' '}
                        <Link to="/privacy" className="text-gold hover:text-gold-hover">
                          Privacy Policy
                        </Link>
                        {' '}and{' '}
                        <Link to="/terms" className="text-gold hover:text-gold-hover">
                          Terms of Service
                        </Link>
                        <span className="text-red-400"> *</span>
                      </span>
                    </label>

                    <div role="status" aria-live="polite" className="mt-2">
                      {showTermsError && (
                        <p className="text-sm text-red-400">You must accept the Privacy Policy and Terms of Service to continue.</p>
                      )}
                    </div>
                  </div>

                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptNewsletter}
                      onChange={(e) => setAcceptNewsletter(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded bg-midnight-800 border-midnight-700 text-gold focus:ring-gold cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-text-secondary">
                      Subscribe to our newsletter for updates
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !acceptedTerms}
                  title={!acceptedTerms ? 'Please accept Privacy Policy and Terms of Service' : undefined}
                  className="w-full px-6 py-3 bg-gold text-midnight-950 rounded-btn hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-base"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Office Locations */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
            Our Offices
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-text-primary mb-3">Delhi</h3>
              <p className="text-text-secondary text-sm">
                Uttam Nagar East, New Delhi
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-text-primary mb-3">Gurgaon</h3>
              <p className="text-text-secondary text-sm">
                Sector 76 & 77, Gurgaon
              </p>
            </div>

            <div className="card p-6 border-2 border-gold">
              <h3 className="text-lg font-bold text-gold mb-3">Bengaluru (HQ)</h3>
              <p className="text-text-secondary text-sm">
                Level 5, Pinnacle Tower, Sarjapur Road, Bengaluru, Karnataka 560034
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-text-primary mb-3">Mumbai</h3>
              <p className="text-text-secondary text-sm">
                Unit 302, Thane One, Ghodbunder Road, Mumbai, Maharashtra 400615
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-text-primary mb-3">Hyderabad</h3>
              <p className="text-text-secondary text-sm">
                Floor 3, Prosperity Tower, HITEC City, Hyderabad, Telangana 500081
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-text-primary mb-3">Surat</h3>
              <p className="text-text-secondary text-sm">
                Office No. 1201, 12th Floor, Shree Complex, Athwalines, Surat, Gujarat 395005
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Follow Us on Social Media
          </h2>
          <p className="text-text-secondary text-base md:text-lg mb-8">
            Stay updated with our latest properties and industry insights
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.facebook.com/share/1JHbhYZ11o/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-btn hover:bg-blue-700 transition font-semibold"
              title="Follow on Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/dream_bid_properties?igsh=MXc2Z3psdnk5bHpx&utm_source=ig_contact_invite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-btn hover:from-pink-600 hover:to-red-600 transition font-semibold"
              title="Follow on Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.779.263-1.618.634-2.223 1.24-.606.605-.977 1.45-1.239 2.22-.266.788-.467 1.657-.527 2.935C.04 8.333.024 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.527 2.935.262.79.633 1.636 1.24 2.24.604.606 1.45.977 2.22 1.239.788.266 1.657.467 2.935.527C8.333 23.96 8.74 23.976 12 23.976s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.935-.527.79-.262 1.636-.633 2.24-1.24.606-.604.977-1.45 1.239-2.22.266-.788.467-1.657.527-2.935.048-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.527-2.935-.262-.79-.633-1.636-1.24-2.24-.604-.606-1.45-.977-2.22-1.239-.788-.266-1.657-.467-2.935-.527C15.667.048 15.26.024 12 0zm0 2.16c3.203 0 3.585.009 4.849.07 1.171.054 1.805.244 2.227.408.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.244 1.805-.408 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07s-3.585-.009-4.849-.07c-1.171-.054-1.805-.244-2.227-.408-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849s.009-3.585.07-4.849c.054-1.171.244-1.805.408-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07z"/>
                <circle cx="12" cy="12" r="3.307"/>
                <circle cx="18.935" cy="5.307" r=".774"/>
              </svg>
              Instagram
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;
