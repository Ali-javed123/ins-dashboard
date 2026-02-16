'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

// Validation schema with Yup
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

// TypeScript interface for form values
interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  
  // const supabase = createClientComponentClient();

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values: ForgotPasswordFormValues) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          setSubmitError(error.message);
        } else {
          setSubmitSuccess(true);
          formik.resetForm();
        }
      } catch (err) {
        setSubmitError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {submitSuccess ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  Check your email for the password reset link
                </p>
                <p className="text-green-700 text-sm mt-2">
                  If you don&apos;t see it, check your spam folder
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`
                    w-full px-4 py-3 rounded-lg border outline-none transition-colors duration-200
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${formik.touched.email && formik.errors.email
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-gray-50'
                    }
                  `}
                  placeholder="john.doe@example.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium text-white
                  transition-all duration-200 transform
                  ${isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending reset link...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center mt-6">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Well send you a link to reset your password. 
          <br />The link will expire in 24 hours.
        </p>
      </div>
    </div>
  );
}