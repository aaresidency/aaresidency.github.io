import { useFormikContext } from 'formik'

interface FormButtonProps {
  label?: string
  className?: string
}

export function FormButton({ label = 'Submit', className = '' }: FormButtonProps) {
  const { isSubmitting } = useFormikContext()

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isSubmitting ? 'Submitting...' : label}
    </button>
  )
}
