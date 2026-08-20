import { Formik, Form, type FormikHelpers } from 'formik'

interface FormWrapperProps<T extends Record<string, unknown>> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit: (values: T, helpers: FormikHelpers<T>) => void | Promise<void>
  children: React.ReactNode
  className?: string
}

export function FormWrapper<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
  children,
  className = '',
}: FormWrapperProps<T>) {
  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {() => (
        <Form className={`flex flex-col gap-4 ${className}`}>
          {children}
        </Form>
      )}
    </Formik>
  )
}
