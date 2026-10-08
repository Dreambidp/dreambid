import { Link } from 'react-router-dom';

function TermsAndConditions() {
  const lastUpdated = 'October 8, 2026';

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-midnight-950 py-10 md:py-16 text-text-primary">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold">Terms & Conditions</span>
        </div>

        {/* Header */}
        <div className="border-b border-midnight-700 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            Legal & Terms
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 font-serif">
            Terms & Conditions
          </h1>
          <p className="text-text-secondary text-sm md:text-base">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-text-soft leading-relaxed text-sm md:text-base">
          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By downloading, installing, accessing, or using the <strong>DreamBid</strong> mobile application or website ("Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please refrain from using our Platform.
            </p>
          </section>

          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">2</span>
              Eligibility & User Accounts
            </h2>
            <div className="space-y-3 text-text-secondary text-sm">
              <p>• You must be at least 18 years of age to register an account, participate in auctions, or place bids.</p>
              <p>• You are responsible for safeguarding your login credentials and for all activities that occur under your account.</p>
              <p>• You agree to provide accurate, complete, and current registration and identity information.</p>
            </div>
          </section>

          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">3</span>
              Property Listings & Bidding Rules
            </h2>
            <div className="space-y-3 text-text-secondary text-sm">
              <p>• <strong>Bidding Integrity:</strong> Placing a bid constitutes a serious financial intent. Users must not submit frivolous, fraudulent, or speculative bids.</p>
              <p>• <strong>Property Information:</strong> While DreamBid strives for maximum accuracy in property descriptions, reserve prices, and documentation, users are advised to conduct independent due diligence before bidding.</p>
              <p>• <strong>Auction Outcomes:</strong> Final acceptance and awarding of bids are subject to seller approval, verified documentation, and applicable statutory regulations.</p>
            </div>
          </section>

          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">4</span>
              Prohibited Activities
            </h2>
            <p className="mb-3 text-sm">When using DreamBid, you agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
              <li>Violate any applicable central, state, or international real estate or consumer protection laws.</li>
              <li>Attempt to reverse-engineer, decompile, or extract source code from the mobile application.</li>
              <li>Impersonate any individual, entity, or misrepresent affiliation with DreamBid.</li>
              <li>Deploy automated bots, scrapers, or scripts to disrupt auction bidding processes.</li>
            </ul>
          </section>

          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">5</span>
              Limitation of Liability & Disclaimer
            </h2>
            <p className="text-sm text-text-secondary">
              DreamBid provides its services on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by law, DreamBid shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the platform, auction participation, or inability to access services.
            </p>
          </section>

          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">6</span>
              Contact Us
            </h2>
            <p className="text-sm text-text-secondary mb-3">
              For any questions concerning these Terms & Conditions, please reach out to us at:
            </p>
            <div className="bg-midnight-900/60 p-4 rounded-xl border border-midnight-700/60 space-y-1 text-sm">
              <p><strong className="text-white">DreamBid Legal Team</strong></p>
              <p className="text-text-secondary">Email: <a href="mailto:dreambidproperties01@gmail.com" className="text-gold hover:underline">dreambidproperties01@gmail.com</a></p>
              <p className="text-text-secondary">Phone: <a href="tel:+917428264402" className="text-gold hover:underline">+91-7428264402</a></p>
            </div>
          </section>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-yellow-600 text-midnight-950 font-bold rounded-xl hover:opacity-90 transition shadow-lg"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
