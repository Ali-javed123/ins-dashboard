'use client'

import { FC, useState } from 'react'
import { createClient, User } from '@supabase/supabase-js'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'

/* =============================
   Supabase Client
============================= */

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* =============================
   Types
============================= */

interface ChangePasswordFormValues {
  password: string
  confirmPassword: string
}

interface SupabaseError {
  message: string
}

/* =============================
   Validation Schema
============================= */

const validationSchema: Yup.ObjectSchema<ChangePasswordFormValues> = Yup.object({
  password: Yup.string()
    .min(6, 'Minimum 6 characters required')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
})

/* =============================
   Component
============================= */

const ChangePasswordPage: FC = () => {
    const router = useRouter()
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const initialValues: ChangePasswordFormValues = {
    password: '',
    confirmPassword: '',
  }

  const handleSubmit = async (
    values: ChangePasswordFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ChangePasswordFormValues>
  ): Promise<void> => {
    setSuccessMessage('')
    setErrorMessage('')

    /* Check Logged In User */
    const {
      data: { user },
      error: userError,
    }: {
      data: { user: User | null }
      error: Error | null
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setErrorMessage('User not authenticated.')
      setSubmitting(false)
      return
    }

    /* Update Password Without Email Verification */
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    })

    if (error) {
      const typedError: SupabaseError = {
        message: error.message,
      }
      setErrorMessage(typedError.message)
    } else {
      setSuccessMessage('Password changed successfully.')
        resetForm()
        router.push('/') // Redirect to login page after successful password change
    }

    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Change Password
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>

                <Field
                  type="password"
                  name="password"
                  className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>

                <Field
                  type="password"
                  name="confirmPassword"
                  className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 
                           text-white py-2 font-semibold transition disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>

              {successMessage && (
                <div className="text-green-600 text-sm text-center">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="text-red-600 text-sm text-center">
                  {errorMessage}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ChangePasswordPage
