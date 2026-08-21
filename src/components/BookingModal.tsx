import React from 'react'
import { Formik, Form } from 'formik'
import { useTranslation } from 'react-i18next'
import _PhoneInput from 'react-phone-input-2'
import type { PhoneInputProps } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

// CJS/ESM interop: Vite may give us { default: fn } instead of fn
const PhoneInput = ((_PhoneInput as any).default ?? _PhoneInput) as React.ComponentType<PhoneInputProps>
import { FormField } from '../lib/input'
import { fireBookingConversion } from '../lib/analytics'

interface BookingData {
  checkIn: string
  checkOut: string
  rooms: string
  guests: string
}

interface BookingModalProps {
  bookingData: BookingData
  onClose: () => void
}

interface GuestForm {
  name: string
  email: string
  mobile: string
}

const WHATSAPP_NUMBER = '918790057559'

export function BookingModal({ bookingData, onClose }: BookingModalProps) {
  const { t } = useTranslation()

  const validate = (values: GuestForm) => {
    const errors: Partial<GuestForm> = {}
    if (!values.name) errors.name = 'Name is required'
    if (!values.mobile || values.mobile.length < 10) errors.mobile = 'Enter a valid mobile number'
    return errors
  }

  const handleSubmit = (values: GuestForm) => {
    const apiUrl = import.meta.env.VITE_BOOKING_API_URL
    if (apiUrl) {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: `+${values.mobile}`,
          arrival_date: bookingData.checkIn,
          departure_date: bookingData.checkOut,
          room_type: bookingData.rooms,
          adults: bookingData.guests,
          children: '0',
        }),
      }).catch(() => {})
    }

    fireBookingConversion()

    const msg = [
      `*New Booking Request*`,
      `Name: ${values.name}`,
      `Phone: +${values.mobile}`,
      `Email: ${values.email || 'N/A'}`,
      `Check-in: ${bookingData.checkIn}`,
      `Check-out: ${bookingData.checkOut}`,
      `Rooms: ${bookingData.rooms}`,
      `Guests: ${bookingData.guests}`,
    ].join('\n')

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>

        <h2 className="text-xl font-bold text-gray-800 mb-1">{t('booking.completeBooking')}</h2>
        <p className="text-sm text-gray-500 mb-5">{t('booking.sentViaWhatsapp')}</p>

        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-5 grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">{t('booking.summary.checkIn')}</span><p className="font-medium">{bookingData.checkIn || '—'}</p></div>
          <div><span className="text-gray-500">{t('booking.summary.checkOut')}</span><p className="font-medium">{bookingData.checkOut || '—'}</p></div>
          <div><span className="text-gray-500">{t('booking.summary.rooms')}</span><p className="font-medium">{bookingData.rooms}</p></div>
          <div><span className="text-gray-500">{t('booking.summary.guests')}</span><p className="font-medium">{bookingData.guests}</p></div>
        </div>

        <Formik initialValues={{ name: '', email: '', mobile: '' }} validate={validate} onSubmit={handleSubmit}>
          {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
          <Form className="flex flex-col gap-4">
            <FormField name="name" label={t('booking.form.name')} placeholder={t('booking.form.namePlaceholder')} required />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">{t('booking.form.mobile')}<span className="text-red-500 ml-0.5">*</span></label>
              <PhoneInput
                country="in"
                value={values.mobile}
                onChange={(phone) => setFieldValue('mobile', phone)}
                onBlur={() => setFieldTouched('mobile', true)}
                inputClass="!w-full !h-10 !text-sm !border-gray-300 !rounded-md focus:!border-cyan-400 focus:!ring-2 focus:!ring-cyan-300"
                containerClass="!w-full"
                buttonClass="!border-gray-300 !rounded-l-md"
              />
              {touched.mobile && errors.mobile && (
                <p className="text-xs text-red-500">{errors.mobile}</p>
              )}
            </div>
            <FormField name="email" label={t('booking.form.email')} type="email" placeholder={t('booking.form.emailPlaceholder')} />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('booking.form.submit')}
            </button>
          </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
