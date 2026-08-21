declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const ADS_CONTAINER = 'AW-17283929589'
const BOOKING_CONVERSION_LABEL = 'MIoECN6XuagbEPWrz7FA'

export function initAnalytics() {
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (gaMeasurementId && window.gtag) {
    window.gtag('config', gaMeasurementId)
  }
}

export function fireBookingConversion() {
  window.gtag?.('event', 'conversion', {
    send_to: `${ADS_CONTAINER}/${BOOKING_CONVERSION_LABEL}`,
  })
}
