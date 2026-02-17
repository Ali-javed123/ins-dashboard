// 'use client'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase-client'
// import { useRouter } from 'next/navigation'

// export default function ResetPassword() {
//   const [password, setPassword] = useState('')
//   const [message, setMessage] = useState('')
//   const router = useRouter()

//   useEffect(() => {
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       async (event:unknown) => {
//         if (event === 'PASSWORD_RECOVERY') {
//           console.log('Recovery mode active')
//         }
//       }
//     )

//     return () => {
//       listener.subscription.unsubscribe()
//     }
//   }, [])

//   const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     const { error } = await supabase.auth.updateUser({
//       password: password,
//     })

//     if (error) {
//       setMessage(error.message)
//     } else {
//       setMessage('Password updated successfully')
//       router.push('/')
//     }
//   }

//   return (
//     <form onSubmit={handleUpdate}>
//       <input
//         type="password"
//         placeholder="Enter new password"
//         required
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit">Update Password</button>
//       <p>{message}</p>
//     </form>
//   )
// }
'use client'

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, XCircle, ArrowLeft, Link as link } from 'lucide-react';
import Link from 'next/link';
// Define interface for form values
interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

// Password validation regex - at least 8 chars, 1 uppercase, 1 lowercase, 1 number
// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

// Validation schema with Yup
const validationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
   ,
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoveryMode(true);
          console.log('Password recovery mode active');
        }
      }
    );

    // Check if we're in recovery mode on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // You can add additional logic here if needed
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitStatus({ type: null, message: '' });

      try {
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });

        if (error) {
          setSubmitStatus({
            type: 'error',
            message: error.message,
          });
        } else {
          setSubmitStatus({
            type: 'success',
            message: 'Password updated successfully! Redirecting to login...',
          });
          
          // Redirect after success
          setTimeout(() => {
            router.push('/');
          }, 2000);
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

  // Password strength indicator
  const getPasswordStrength = (password: string): { strength: number; text: string; color: string } => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[\W_]/.test(password)) strength += 1;

    const strengthMap = {
      0: { text: 'Very Weak', color: 'bg-red-500' },
      1: { text: 'Weak', color: 'bg-red-400' },
      2: { text: 'Fair', color: 'bg-yellow-500' },
      3: { text: 'Good', color: 'bg-blue-500' },
      4: { text: 'Strong', color: 'bg-green-500' },
      5: { text: 'Very Strong', color: 'bg-green-600' },
    };

    return {
      strength,
      text: strengthMap[strength as keyof typeof strengthMap]?.text || '',
      color: strengthMap[strength as keyof typeof strengthMap]?.color || '',
    };
  };

  const passwordStrength = getPasswordStrength(formik.values.password);

  // If not in recovery mode, show message
  if (!isRecoveryMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/forgetpassword"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`
                    block w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                    transition duration-150 ease-in-out
                    ${formik.touched.password && formik.errors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                  `}
                  placeholder="Enter new password"
                  disabled={formik.isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formik.values.password && !formik.errors.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-600">
                      {passwordStrength.text}
                    </span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li className={formik.values.password.length >= 8 ? 'text-green-600' : ''}>
                      ✓ At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formik.values.password) ? 'text-green-600' : ''}>
                      ✓ One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formik.values.password) ? 'text-green-600' : ''}>
                      ✓ One lowercase letter
                    </li>
                    <li className={/[0-9]/.test(formik.values.password) ? 'text-green-600' : ''}>
                      ✓ One number
                    </li>
                  </ul>
                </div>
              )}

              {/* Error Message */}
              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`
                    block w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
                    transition duration-150 ease-in-out
                    ${formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                  `}
                  placeholder="Confirm new password"
                  disabled={formik.isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.confirmPassword}
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
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus.type && (
              <div
                className={`
                  p-4 rounded-lg text-sm border animate-fadeIn
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
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium group"
              >
                <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}