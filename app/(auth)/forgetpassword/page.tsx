// 'use client'
// import { useState } from 'react'
// import { supabase } from "@/lib/supabase-client"

// export default function ForgetPassword() {
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setLoading(true)
//     setMessage('')

//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/resetpassword`,
//     })

//     if (error) {
//       setMessage(error.message)
//     } else {
//       setMessage('Reset link sent to your email')
//     }

//     setLoading(false)
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         placeholder="Enter your email"
//         required
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <button disabled={loading}>
//         {loading ? 'Sending...' : 'Send Reset Link'}
//       </button>
//       <p>{message}</p>
//     </form>
//   )
// }
'use client'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from "@/lib/supabase-client";
import { useState } from 'react';
import { Mail, Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
// Define interface for form values
interface ForgetPasswordFormValues {
  email: string;
}

// Validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address'
    ),
});

export default function ForgetPassword() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const formik = useFormik<ForgetPasswordFormValues>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitStatus({ type: null, message: '' });

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${window.location.origin}/resetpassword`,
        });

        if (error) {
          setSubmitStatus({
            type: 'error',
            message: error.message,
          });
        } else {
          setSubmitStatus({
            type: 'success',
            message: 'Reset link sent to your email! Please check your inbox.',
          });
          resetForm();
        }
      } catch {
        setSubmitStatus({
          type: 'error',
          message: 'An unexpected error occurred. Please try again.',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`
                    block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                    transition duration-150 ease-in-out
                    ${formik.touched.email && formik.errors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                  `}
                  placeholder="you@example.com"
                  disabled={formik.isSubmitting}
                />
              </div>
              {/* Error Message */}
              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className={`
                  w-full flex justify-center items-center py-2.5 px-4 
                  border border-transparent rounded-lg shadow-sm text-sm font-medium 
                  text-white bg-blue-600 hover:bg-blue-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  transition duration-150 ease-in-out
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${formik.isSubmitting ? 'cursor-wait' : ''}
                `}
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus.type && (
              <div
                className={`
                  p-4 rounded-lg text-sm border
                  ${submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border-green-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                  }
                `}
                role="alert"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {submitStatus.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {submitStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Login Link */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium group"
              >
                <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}