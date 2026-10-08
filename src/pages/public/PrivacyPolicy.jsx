import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  const lastUpdated = 'October 8, 2026';

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-midnight-950 py-10 md:py-16 text-text-primary">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="border-b border-midnight-700 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            Legal & Policy
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 font-serif">
            Privacy Policy
          </h1>
          <p className="text-text-secondary text-sm md:text-base">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-text-soft leading-relaxed text-sm md:text-base">
          {/* Section 1 */}
          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">1</span>
              Introduction
            </h2>
            <p className="mb-4">
              Welcome to <strong>DreamBid</strong> ("we," "our," or "us"). We operate the DreamBid mobile application and web platform (collectively, the "Platform"), providing digital property auction listings, bidding platforms, and real estate discovery services.
            </p>
            <p>
              We are committed to protecting your personal information and your right to privacy. This Privacy Policy outlines what information we collect, how we use and safeguard it, and your rights regarding your personal data when you use our mobile application and services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">2</span>
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect information that you directly provide to us, information collected automatically during your app usage, and information from third parties:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-midnight-900/60 rounded-xl border border-midnight-700/60">
                <h3 className="font-semibold text-gold mb-2 text-base">A. Personal Information You Provide</h3>
                <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                  <li><strong>Account Registration:</strong> Name, email address, phone number, and password.</li>
                  <li><strong>Profile & Verification:</strong> User profile details, location preferences, and contact information.</li>
                  <li><strong>Enquiries & Communication:</strong> Messages, property enquiries, and feedback sent through our contact forms or support channels.</li>
                  <li><strong>Bidding & Transaction Details:</strong> Property shortlist preferences, bids placed, transaction history, and auction participation data.</li>
                </ul>
              </div>

              <div className="p-4 bg-midnight-900/60 rounded-xl border border-midnight-700/60">
                <h3 className="font-semibold text-gold mb-2 text-base">B. Information Automatically Collected</h3>
                <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                  <li><strong>Device Information:</strong> Device model, operating system version, unique device identifiers, and network information.</li>
                  <li><strong>Log & Usage Data:</strong> Pages or property listings viewed, search queries, interaction timestamps, crash logs, and app performance diagnostics.</li>
                  <li><strong>Approximate Location:</strong> IP address or coarse location to provide relevant nearby property listings (if permission is granted).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">3</span>
              How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the collected information for various business and operational purposes, including:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2 bg-midnight-900/40 p-3 rounded-lg border border-midnight-700/40">
                <span className="text-status-live font-bold">✓</span>
                <span>Operating and maintaining the property auction & bidding platform.</span>
              </li>
              <li className="flex items-start gap-2 bg-midnight-900/40 p-3 rounded-lg border border-midnight-700/40">
                <span className="text-status-live font-bold">✓</span>
                <span>Creating, authenticating, and managing your user account securely.</span>
              </li>
              <li className="flex items-start gap-2 bg-midnight-900/40 p-3 rounded-lg border border-midnight-700/40">
                <span className="text-status-live font-bold">✓</span>
                <span>Processing property enquiries and connecting buyers with property sellers.</span>
              </li>
              <li className="flex items-start gap-2 bg-midnight-900/40 p-3 rounded-lg border border-midnight-700/40">
                <span className="text-status-live font-bold">✓</span>
                <span>Sending transaction notifications, auction alerts, and security updates.</span>
              </li>
              <li className="flex items-start gap-2 bg-midnight-900/40 p-3 rounded-lg border border-midnight-700/40">
                <span className="text-status-live font-bold">✓</span>
                <span>Preventing fraudulent activity, abuse, and unauthorized access.</span>
              </li>
              <li className="flex items-start gap-2 bg-midnight-900/40 p-3 rounded-lg border border-midnight-700/40">
                <span className="text-status-live font-bold">✓</span>
                <span>Complying with statutory real estate laws and regulatory obligations.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">4</span>
              Data Sharing & Disclosure
            </h2>
            <p className="mb-4">
              <strong>We do not sell, rent, or trade your personal information to third parties for advertising or marketing purposes.</strong> We only share information under the following strict conditions:
            </p>
            <div className="space-y-3 text-sm text-text-secondary">
              <p>
                • <strong className="text-text-primary">Property Sellers & Auction Organizers:</strong> When you submit an enquiry or place bids on specific properties, relevant details may be shared to facilitate the transaction.
              </p>
              <p>
                • <strong className="text-text-primary">Service Providers:</strong> Trusted third-party vendors who assist us in cloud hosting, database management, SMS/email delivery, and error tracking under strict non-disclosure obligations.
              </p>
              <p>
                • <strong className="text-text-primary">Legal & Compliance:</strong> When required by applicable law, court subpoenas, regulatory bodies, or to protect the safety and property of DreamBid and its users.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">5</span>
              Data Security & Retention
            </h2>
            <p className="mb-4">
              We implement industry-standard technical and organizational security measures to protect your personal data, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm mb-4">
              <li>End-to-end data encryption in transit using HTTPS / TLS protocols.</li>
              <li>Secure password hashing using industry-standard cryptographic algorithms.</li>
              <li>Restricted internal access to personal databases and regular vulnerability assessments.</li>
            </ul>
            <p className="text-sm text-text-secondary">
              We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, maintain active accounts, or comply with legal record-keeping obligations.
            </p>
          </section>

          {/* Section 6 - Critical for Google Play Store Data Safety */}
          <section className="bg-midnight-800/60 border border-gold/40 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold text-midnight-950 flex items-center justify-center text-sm font-bold">6</span>
              Your Rights & Account/Data Deletion
            </h2>
            <p className="mb-4">
              In accordance with Google Play Store policies and global privacy regulations, you have full control over your personal data:
            </p>
            <div className="space-y-3 text-sm text-text-secondary mb-6">
              <p>• <strong className="text-text-primary">Access & Correction:</strong> You can view and update your profile details at any time from your Account Settings.</p>
              <p>• <strong className="text-text-primary">Account Deletion Request:</strong> You have the right to request the permanent deletion of your account and all associated personal data.</p>
              <p>• <strong className="text-text-primary">Revoke Permissions:</strong> You can modify or revoke device permissions (such as camera or notifications) via your device's Android settings menu at any time.</p>
            </div>

            <div className="bg-midnight-900/90 border border-midnight-700 p-4 rounded-xl">
              <h4 className="font-semibold text-gold mb-2 text-sm">How to Request Account & Data Deletion:</h4>
              <p className="text-xs md:text-sm text-text-secondary mb-3">
                To delete your account and associated personal data, you can:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs md:text-sm text-text-secondary mb-3">
                <li>Go to <strong>Settings &gt; Profile</strong> inside the DreamBid mobile app and click <em>Delete Account</em>, or</li>
                <li>Send an email to <a href="mailto:dreambidproperties01@gmail.com?subject=Account%20Deletion%20Request" className="text-gold hover:underline">dreambidproperties01@gmail.com</a> with the subject line <code>"Account Deletion Request"</code> and your registered phone/email.</li>
              </ol>
              <p className="text-xs text-text-muted">
                Upon receiving your request, your account and associated personal data will be permanently removed within 30 days, subject to legal compliance requirements.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">7</span>
              Children's Privacy
            </h2>
            <p className="text-sm text-text-secondary">
              DreamBid is designed exclusively for users who are at least 18 years of age (or the legal age of majority in your jurisdiction). We do not knowingly collect or solicit personal information from minors. If we learn that we have collected personal data from a child under 18, we will promptly delete that information from our servers.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">8</span>
              Changes to This Policy
            </h2>
            <p className="text-sm text-text-secondary">
              We may update this Privacy Policy periodically to reflect changes in our legal obligations, platform features, or operational practices. We will notify you of material changes by updating the "Last Updated" date at the top of this page and, where appropriate, displaying a notice within the app.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-midnight-800/60 border border-midnight-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">9</span>
              Contact Information & Grievance Redressal
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              If you have any questions, concerns, or grievances regarding this Privacy Policy or our data handling practices, please contact us at:
            </p>
            <div className="bg-midnight-900/60 p-4 rounded-xl border border-midnight-700/60 space-y-2 text-sm">
              <p><strong className="text-white">DreamBid Properties</strong></p>
              <p className="text-text-secondary">Email: <a href="mailto:dreambidproperties01@gmail.com" className="text-gold hover:underline">dreambidproperties01@gmail.com</a></p>
              <p className="text-text-secondary">Phone: <a href="tel:+917428264402" className="text-gold hover:underline">+91-7428264402</a></p>
              <p className="text-text-secondary">Website: <a href="https://dreambid.in" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">https://dreambid.in</a></p>
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

export default PrivacyPolicy;
