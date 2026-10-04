import { Seo } from '../components/Seo'
import { EMAIL, PHONE_DISPLAY, PHONE_E164 } from '../lib/contact'

export function Privacy() {
  return (
    <div>
      <Seo title="Privacy Policy" description="Privacy policy for AA Residency Tirupati guests." path="/privacy" />
      <div
        className="h-60 bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: 'url(/images/exterior-front.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-cyan-300 mt-1">AA Residency, Tirupati</p>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 py-14 space-y-10 text-gray-700">
        <p className="text-sm text-gray-500">
          Last updated: August 2025. This policy explains how AA Residency collects, uses, and protects your
          personal information.
        </p>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">1. Information We Collect</h2>
          <p className="text-sm leading-relaxed">When you make a reservation or contact us, we may collect:</p>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>Full name and contact details (phone number, email address)</li>
            <li>Government-issued ID details (as required by law for guest registration)</li>
            <li>Booking preferences and stay history</li>
            <li>Communications sent to us via WhatsApp, phone, or email</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>To process and manage your reservation</li>
            <li>To comply with legal obligations (guest registration under Indian law)</li>
            <li>To communicate booking confirmations, updates, and offers</li>
            <li>To improve our services based on guest feedback</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">3. Sharing of Information</h2>
          <p className="text-sm leading-relaxed">
            We do not sell or rent your personal information to third parties. We may share your data only:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>When required by law or government authorities (e.g., police verification)</li>
            <li>With service providers who assist hotel operations, under confidentiality obligations</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">4. CCTV Surveillance</h2>
          <p className="text-sm leading-relaxed">
            For the safety and security of all guests and staff, AA Residency operates CCTV cameras in common
            areas (lobby, corridors, parking). Footage is retained for a limited period and accessed only when
            required for security purposes.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">5. Data Retention</h2>
          <p className="text-sm leading-relaxed">
            We retain guest records for the period required by applicable Indian hospitality regulations. After
            that period, records are securely deleted or anonymised.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">6. Data Security</h2>
          <p className="text-sm leading-relaxed">
            We take reasonable precautions to protect your personal information from unauthorised access, loss,
            or misuse. However, no method of storage or transmission over the internet is completely secure.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">7. Your Rights</h2>
          <p className="text-sm leading-relaxed">You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal retention requirements)</li>
          </ul>
          <p className="text-sm leading-relaxed">
            To exercise these rights, contact us using the details below.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">8. Cookies &amp; Website Data</h2>
          <p className="text-sm leading-relaxed">
            Our website may use browser storage (localStorage) to remember your language preference. We do not
            use tracking cookies or third-party analytics that collect personally identifiable information.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">9. Changes to This Policy</h2>
          <p className="text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. The latest version will always be available on
            this page. Continued use of our services after any changes constitutes your acceptance of the updated
            policy.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">10. Contact Us</h2>
          <p className="text-sm leading-relaxed">
            For privacy-related queries or to exercise your rights, reach us at:
          </p>
          <ul className="list-none space-y-1 text-sm leading-relaxed">
            <li>
              📧{' '}
              <a href={`mailto:${EMAIL}`} className="text-cyan-600 hover:underline">
                {EMAIL}
              </a>
            </li>
            <li>
              📞{' '}
              <a href={`tel:${PHONE_E164}`} className="text-cyan-600 hover:underline">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>📍 22-11-246/1, Gollavani Gunta, Renigunta Rd, AutoNagar, Tirupati, Andhra Pradesh 517501</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
