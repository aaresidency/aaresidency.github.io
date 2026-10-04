import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import _PhoneInput from 'react-phone-input-2'
import type { PhoneInputProps } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Seo } from '../components/Seo'
import { PHONE_DIGITS } from '../lib/contact'

const PhoneInput = ((_PhoneInput as any).default ?? _PhoneInput) as React.ComponentType<PhoneInputProps>


interface EventForm {
  guestName: string
  eventType: string
  expectedGuests: string
  contact: string
}

const INITIAL_VALUES: EventForm = { guestName: '', eventType: '', expectedGuests: '', contact: '' }

const VALIDATION_SCHEMA = Yup.object({
  guestName: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Guest name is required'),
  eventType: Yup.string().required('Please select an event type'),
  expectedGuests: Yup.number()
    .typeError('Must be a number')
    .min(1, 'At least 1 guest required')
    .max(10000, 'Maximum 10,000 guests')
    .integer('Must be a whole number')
    .required('Expected guests is required'),
  contact: Yup.string().min(10, 'Enter a valid phone number').required('Contact number is required'),
})

const EVENT_TYPES = [
  'Wedding / Reception',
  'Birthday Celebration',
  'Anniversary',
  'Corporate Meeting',
  'Conference / Seminar',
  'Social Gathering / Party',
  'Baby Shower',
  'Engagement Ceremony',
  'Other',
]

const PACKAGES = [
  {
    title: 'Occasional Functions',
    price: '₹30,000',
    image: '/images/banquet-stage-1.webp',
    includes: 'Electricity Charges, Parking Security & Cleaning Charges',
    idealFor: '200 members',
  },
  {
    title: 'Corporate Meetings',
    price: '₹25,000',
    image: '/images/banquet-stage-3.webp',
    includes: 'Electricity Charges & Cleaning Charges',
    idealFor: '200 members',
  },
]

const CheckIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="#c9a84c" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const ERR = ({ name }: { name: string }) => (
  <ErrorMessage name={name}>
    {(msg) => <p className="text-red-400 text-xs mt-1">{msg}</p>}
  </ErrorMessage>
)

export function Events() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (values: EventForm, { resetForm }: { resetForm: () => void }) => {
    const msg = [
      `*Event Enquiry - AA Residency*`,
      `Guest Name: ${values.guestName}`,
      `Type of Function: ${values.eventType}`,
      `Expected Guests: ${values.expectedGuests}`,
      `Contact: +${values.contact}`,
    ].join('\n')
    window.open(`https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(msg)}`, '_blank')
    resetForm()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const enquireViaWhatsApp = (eventTitle: string) => {
    const msg = `*Event Enquiry - AA Residency*\nEvent Type: ${eventTitle}\n\nPlease share more details about availability and pricing.`
    window.open(`https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div>
      <Seo title="Events & Banquets" description="Host weddings, conferences and celebrations in the banquet hall at AA Residency Tirupati. Flexible event spaces and on-site rooms. Enquire on WhatsApp now." path="/events" />
      {/* Hero */}
      <div className="h-60 bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url(/images/banquet-event-1.webp)' }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center">
          <h1 className="text-4xl font-bold" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>Events & Celebrations</h1>
          <p className="mt-1" style={{ color: '#c9a84c' }}>An air-conditioned hall for every occasion</p>
        </div>
      </div>

      {/* Package cards */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>What We Host</p>
          <h2 className="text-3xl font-bold" style={{ color: '#f5e6c8' }}>Event Packages</h2>
          <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: '#a89070' }}>
            Simple, transparent hall packages for functions and meetings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PACKAGES.map((pkg) => (
            <div key={pkg.title} className="rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-transform"
              style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
              <div className="h-52 overflow-hidden">
                <img loading="lazy" decoding="async" src={pkg.image} alt={pkg.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#f5e6c8' }}>{pkg.title}</h3>
                  <p className="font-semibold text-sm mt-0.5" style={{ color: '#c9a84c' }}>{pkg.price}</p>
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {[`Includes: ${pkg.includes}`, `Ideal for: ${pkg.idealFor}`].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#c8b89a' }}>
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => enquireViaWhatsApp(pkg.title)}
                  className="mt-2 w-full py-2.5 rounded-lg font-semibold text-sm transition-colors"
                  style={{ backgroundColor: '#c9a84c', color: '#1a0e00' }}
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed enquiry form */}
      <section className="py-14 px-4" style={{ backgroundColor: '#1e0d00' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>Get In Touch</p>
            <h2 className="text-3xl font-bold" style={{ color: '#f5e6c8' }}>Event Enquiry</h2>
            <p className="text-sm mt-3" style={{ color: '#a89070' }}>Fill in the details and we'll get back to you via WhatsApp.</p>
          </div>

          <div className="rounded-2xl p-8" style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
            <Formik initialValues={INITIAL_VALUES} validationSchema={VALIDATION_SCHEMA} onSubmit={handleSubmit}>
              {({ values, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Form className="flex flex-col gap-5">

                  <div className="flex flex-col gap-1">
                    <label htmlFor="guestName" className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c9a84c' }}>
                      Guest Name <span className="text-red-400">*</span>
                    </label>
                    <Field
                      id="guestName" name="guestName" type="text" placeholder="Your full name"
                      className="px-4 py-3 rounded-lg text-gray-800 text-sm placeholder-gray-400 outline-none"
                      style={{ border: '1px solid #c9a84c', backgroundColor: 'white' }}
                    />
                    <ERR name="guestName" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="eventType" className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c9a84c' }}>
                      Type of Function <span className="text-red-400">*</span>
                    </label>
                    <Field
                      as="select" id="eventType" name="eventType"
                      className="px-4 py-3 rounded-lg text-gray-800 text-sm outline-none"
                      style={{ border: '1px solid #c9a84c', backgroundColor: 'white' }}
                    >
                      <option value="">Select event type...</option>
                      {EVENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </Field>
                    <ERR name="eventType" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="expectedGuests" className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c9a84c' }}>
                      Expected Guests <span className="text-red-400">*</span>
                    </label>
                    <Field
                      id="expectedGuests" name="expectedGuests" type="number" min="1" placeholder="e.g. 50"
                      className="px-4 py-3 rounded-lg text-gray-800 text-sm placeholder-gray-400 outline-none"
                      style={{ border: '1px solid #c9a84c', backgroundColor: 'white' }}
                    />
                    <ERR name="expectedGuests" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c9a84c' }}>
                      Contact Number <span className="text-red-400">*</span>
                    </label>
                    <PhoneInput
                      country="in"
                      value={values.contact}
                      onChange={(phone) => setFieldValue('contact', phone)}
                      onBlur={() => setFieldTouched('contact', true)}
                      inputClass="!w-full !h-[46px] !text-sm !border-gray-300 !rounded-md focus:!border-cyan-400 focus:!ring-2 focus:!ring-cyan-300"
                      containerClass="!w-full"
                      buttonClass="!border-gray-300 !rounded-l-md"
                    />
                    <ERR name="contact" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 disabled:opacity-60 font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#c9a84c', color: '#1a0e00' }}
                  >
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Send Enquiry via WhatsApp
                  </button>

                  {submitted && (
                    <p className="text-center text-green-600 text-sm font-medium">
                      Enquiry sent! We'll be in touch shortly.
                    </p>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>
    </div>
  )
}
