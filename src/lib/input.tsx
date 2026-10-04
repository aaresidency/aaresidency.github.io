import { useField } from 'formik'

type FieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'textarea' | 'select'

interface FormFieldProps {
  name: string
  label: string
  type?: FieldType
  placeholder?: string
  options?: { label: string; value: string }[]
  disabled?: boolean
  className?: string
  required?: boolean
  /** Lower bound for date/number inputs. */
  min?: string
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  options = [],
  disabled = false,
  className = '',
  required = false,
  min,
}: FormFieldProps) {
  const [field, meta] = useField(name)
  const hasError = meta.touched && meta.error

  const baseInputClass = `w-full px-3 py-2 border rounded-md text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? 'border-red-500 focus:ring-red-300'
      : 'border-gray-300 focus:ring-cyan-300 focus:border-cyan-400'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          {...field}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={baseInputClass}
        />
      ) : type === 'select' ? (
        <select
          {...field}
          id={name}
          disabled={disabled}
          className={baseInputClass}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...field}
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          className={baseInputClass}
        />
      )}

      {hasError && (
        <span className="text-xs text-red-500">{meta.error}</span>
      )}
    </div>
  )
}
