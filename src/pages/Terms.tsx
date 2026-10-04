import { Seo } from '../components/Seo'
import { EMAIL, PHONE_DISPLAY, PHONE_E164 } from '../lib/contact'

export function Terms() {
  return (
    <div>
      <Seo title="Terms & Conditions" description="Terms and conditions for bookings at AA Residency Tirupati." path="/terms" />
      <div
        className="h-60 bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: 'url(/images/exterior-front.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white">
          <h1 className="text-4xl font-bold">Terms &amp; Conditions</h1>
          <p className="text-cyan-300 mt-1">AA Residency, Tirupati</p>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 py-14 space-y-10 text-gray-700">
        <p className="text-sm text-gray-500">
          Last updated: August 2025. By making a reservation or staying at AA Residency you agree to the
          following terms.
        </p>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">1. Reservations &amp; Booking</h2>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>Bookings are confirmed only upon receipt of confirmation from AA Residency via phone or WhatsApp.</li>
            <li>We reserve the right to decline any reservation at our discretion.</li>
            <li>Room availability is subject to change until a booking is confirmed.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">2. Check-In &amp; Check-Out</h2>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>Standard check-in time is 12:00 PM and check-out time is 11:00 AM.</li>
            <li>Early check-in and late check-out are subject to availability and may attract additional charges.</li>
            <li>A valid government-issued photo ID is mandatory for all guests at check-in.</li>
            <li>The hotel reserves the right to deny check-in to guests unable to produce valid identification.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">3. Cancellation &amp; Modification</h2>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>Cancellations must be communicated at least 24 hours before the scheduled check-in time.</li>
            <li>Late cancellations or no-shows may incur a charge equivalent to one night's stay.</li>
            <li>Modifications to bookings are subject to availability and must be confirmed by the hotel.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">4. Payment</h2>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>Payment is due at the time of check-in unless prior arrangements have been made.</li>
            <li>We accept cash, UPI, and bank transfers. Card payments subject to availability.</li>
            <li>Room rates are quoted per night and are subject to applicable taxes.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">5. Guest Conduct</h2>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>Guests are expected to behave in a manner that does not disturb other guests or staff.</li>
            <li>Smoking is strictly prohibited in all indoor areas of the hotel.</li>
            <li>Consumption of alcohol is subject to applicable local laws and hotel policy.</li>
            <li>Pets are not permitted on the premises unless explicitly approved by management.</li>
            <li>Visitors to in-house guests must be registered at the front desk.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">6. Property &amp; Damages</h2>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>Guests are liable for any damage caused to hotel property during their stay.</li>
            <li>The cost of repairs or replacements will be charged to the guest's account.</li>
            <li>AA Residency is not responsible for loss or theft of personal belongings.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">7. Liability</h2>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
            <li>AA Residency shall not be liable for any indirect, incidental, or consequential loss arising from your stay.</li>
            <li>The hotel is not responsible for disruptions to services caused by circumstances beyond its control (power outages, natural events, etc.).</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">8. Governing Law</h2>
          <p className="text-sm leading-relaxed">
            These terms are governed by the laws of India and the State of Andhra Pradesh. Any disputes shall be subject to the
            exclusive jurisdiction of the courts in Tirupati.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">9. Contact</h2>
          <p className="text-sm leading-relaxed">
            For any questions regarding these terms, contact us at{' '}
            <a href={`mailto:${EMAIL}`} className="text-cyan-600 hover:underline">
              {EMAIL}
            </a>{' '}
            or call{' '}
            <a href={`tel:${PHONE_E164}`} className="text-cyan-600 hover:underline">
              {PHONE_DISPLAY}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
