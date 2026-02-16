// // app/dashboard/page.tsx
// import DashboardStats from '@/components/dashboard/DashboardStats'
// import RecentActivity from '@/components/dashboard/RecentActivity'
// import ChartsSection from '@/components/dashboard/ChartsSection'
// import UserForm from '@/components/forms/UserForm'
// import { DataTable } from '@/components/dashboard/DataTable'
// import { columns, User } from '@/components/dashboard/Columns'

// const sampleData: User[] = [
//   {
//     id: "1",
//     name: "John Doe",
//     email: "john@example.com",
//     status: "Active",
//     role: "Admin",
//     lastLogin: "2024-01-15",
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     email: "jane@example.com",
//     status: "Inactive",
//     role: "User",
//     lastLogin: "2024-01-10",
//   },
// ]

// export default function DashboardPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//         <p className="text-muted-foreground">
//           Welcome back! Here&apos;s what&apos;s happening with your business today.
//         </p>
//       </div>

//       <DashboardStats />
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <ChartsSection />
//           <div className="bg-card rounded-lg border p-6">
//             <h3 className="text-lg font-semibold mb-4">User Management</h3>
//             <DataTable columns={columns} data={sampleData} />
//           </div>
//         </div>
        
//         <div className="space-y-6">
//           <RecentActivity />
//           <UserForm />
//         </div>
//       </div>
//     </div>
//   )
// }

// app/(auth)/login/page.tsx
"use client";
import React from 'react';
import { useState,useEffect } from "react";
import { Button } from '@/components/ui/button'
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-client"
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { navigate } from 'next/dist/client/components/segment-cache/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import Link from 'next/link';
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface UserFormValues {
  email: string
  password: string
}

const Login = () => {
    const theme = useAppSelector((state) => state.theme.mode)
  console.log("theme:",theme)

    const themeIcon = theme === 'dark' ? '🌙' : '☀️' 
  
  const router =useRouter();
  const [login, setLogin] = useState<"login" | "signUp">("login");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userSession, setUserSession] = useState<Session | null>(null);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })

  const initialValues: UserFormValues = {
    email: '',
    password: '',
  }
// useEffect(() => {
//   if (userSession) {
//     router.push("/home");
//   }
// }, [userSession]);

//   const handleAuth = async (values: UserFormValues, formikHelpers: FormikHelpers<UserFormValues>) => {
//   setLoading(true);
//   console.log('Attempting auth with:', values); // 👈 Add this line
  
//   try {
//     if (login === "login") {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: values.email,
//         password: values.password,
//       });
//       console.log('Login response:error', { error });
//       console.log('Login response data:', { data });
      
//       console.log("error?.error?.code",`${error.code}`)
//       toast.error(`${error.code}`, {
//         icon: <XCircle className="text-red-500" />,
//       });
//       formikHelpers.resetForm();

//       if (!error) {
//         router.push('/home');
//       }
//         // 👈 Add this line
//       if (error) throw error;
//       alert("Logged in successfully!");
      
//     } else {
//       const { data, error } = await supabase.auth.signUp({
//         email: values.email,
//         password: values.password,
//       });
//       console.log('Signup response:', { data, error }); // 👈 Add this line
//       if (error) throw error;
//       // Check if email confirmation is required
//       if (data.user && data.user.identities && data.user.identities.length === 0) {
//         // alert('User already exists. Try logging in.');
//          toast.success("User already exists. Try logging in.", {
//         icon: <CheckCircle className="text-green-500" />,
//       });
//       } else if (data.session) {
//         // alert('Sign up successful! You are now signed in.');
//          toast.success("Sign up successful! You are now signed in", {
//         icon: <CheckCircle className="text-green-500" />,
        
//       });
//       router.push("/home");
//       } else {
//         // alert('Sign up successful! Please check your email for the confirmation link.');
//         toast.success("Sign up successful! Please check your email", {
//         icon: <CheckCircle className="text-green-500" />,
//       });
//       }
//     }
//   } catch (error: unknown) {
//     const {errors}=error
//     // toast.success(error?.error?.code, {
//     //     icon: <CheckCircle className="text-green-500" />,
//     //   });
//     // ... your existing error handling ...
//     console.log("errors",error)
//   } finally {
//     setLoading(false);
//   }
// };
const handleAuth = async (values: UserFormValues, formikHelpers: FormikHelpers<UserFormValues>) => {
  setLoading(true);
  console.log('Attempting auth with:', values);
  
  try {
    if (login === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        toast.error(`${error.message}`, {
          icon: <XCircle className="text-red-500" />,
        });
        return; // ✅ yahin stop
      }
      
      // ✅ Agar error nahi hai to redirect karein
      if (data.session) {
        toast.success("Logged in successfully!", {
          icon: <CheckCircle className="text-green-500" />,
        });
        router.push('/dashboard');
        router.refresh(); // ✅ Client-side cache refresh
      }
      
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        toast.error(`${error.message}`, {
          icon: <XCircle className="text-red-500" />,
        });
        throw error;
      }
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.info("User already exists. Try logging in.", {
          icon: <AlertTriangle className="text-yellow-500" />,
        });
      } else if (data.session) {
        toast.success("Sign up successful! You are now signed in", {
          icon: <CheckCircle className="text-green-500" />,
        });
        router.push("/dashboard");
        // router.refresh(); // ✅ Client-side cache refresh
      } else {
        toast.success("Sign up successful! Please check your email", {
          icon: <CheckCircle className="text-green-500" />,
        });
      }
    }
  } catch (error: unknown) {
    console.error("Auth error:", error);
  } finally {
    setLoading(false);
    formikHelpers.resetForm();
  }
};
   // Session listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserSession(data.session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
console.log("userSession",userSession)

  return (
    <section 
      className="bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background-dark))] min-h-screen flex items-center justify-center"
    >
      {/* login container */}
      <div className="bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background-dark))]  flex rounded-2xl w-full items-center">
        {/* form */}
        <div className="md:w-1/2 px-4 md:px-13">
  <div className="group relative rounded-3xl p-[2px] bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 transition-all duration-500 shadow-xl hover:shadow-2xl">
    <div className=" rounded-3xl p-4 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-xl shadow-inner">
      
      {/* Logo और हेडर सेक्शन */}
      <div className="flex flex-col items-center mb-3">
        <div className="mb-3 transform transition-transform group-hover:scale-105 duration-300">
          <img 
            loading='lazy'
            decoding="async" 
            src="/assets/images/logos.png" 
            className="block mx-auto" 
            alt="Ostech HTML" 
            width="200px"
          />
        </div>
        
        <div className="text-center mb-2">
          <h2 className="font-bold text-3xl bg-gradient-to-r from-blue-500 to-sky-800 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {login === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
            {login === "login" 
              ? "Sign in to continue your journey" 
              : "Join us and explore amazing features"}
          </p>
        </div>
      </div>

      {/* Form सेक्शन */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleAuth}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </Label>
              <div className="relative">
                <Field
                  as={Input}
                  className={`p-3 rounded-xl border-2 w-full transition-all
                    ${errors.email && touched.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
                    }
                    focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                    bg-white/50 dark:bg-gray-900/50`}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                />
              </div>
              <ErrorMessage 
                name="email" 
                component="div" 
                className="text-red-500 text-sm flex items-center gap-1" 
              />
            </div>
            
            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label 
                  htmlFor="password" 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                {login === "login" && (
                  <Link 
                    href="#" 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Field
                  as={Input}
                  className={`p-3 rounded-xl border-2 w-full transition-all pr-12
                    ${errors.password && touched.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
                    }
                    focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                    bg-white/50 dark:bg-gray-900/50`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 
                    text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 
                    transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <ErrorMessage 
                name="password" 
                component="div" 
                className="text-red-500 text-sm flex items-center gap-1" 
              />
            </div>
            
            {/* Submit Button */}
            {/* <Button
              type="submit"
              className="w-full py-1 rounded-xl font-semibold text-white 
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700
                transform hover:scale-[1.02] transition-all duration-300
                shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                login === "login" ? "Sign In" : "Create Account"
              )}
            </Button> */}
                                    <div className="flex justify-center items-center">
                <Button
                  type="submit"
                  className=" rounded-xl text-white py-2 w-lg hover:scale-104 duration-300"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Processing...' : (login === "login" ? "Login" : "Sign Up")}
                </Button>
                </div>

          </Form>
        )}
      </Formik>
      
      {/* Divider */}
                <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm dark:text-gray-300">OR</p>
            <hr className="border-gray-400" />
          </div>

      
      {/* Social Login Options */}
  
      
      {/* Toggle Login/Signup */}
                <div className="mt-3 text-xs flex justify-between items-center dark:text-gray-300 text-[#002D74]">
            <p>
              {login === "login" 
                ? "Don't have an account?" 
                : "Already have an account?"}
            </p>
            <Button
              type="button"
              className="py-2 px-5  border rounded-xl hover:scale-110 duration-300"
              onClick={() => setLogin(login === "login" ? "signUp" : "login")}
            >
             <Link href="/register">{login === "login" ? "Register" : "Login"}</Link> 
            </Button>
              </div>

      
    </div>
  </div>
</div>
        
        {/* image */}
        <div className="md:block hidden w-1/2">
            {/* eslint-disable @next/next/no-img-element */}
          
          <img
            className=" w-full h-screen object-cover"
            src="/assets/images/service/service-2-1.png"
            alt="Login visual"
            
          />
        </div>
      </div>
    </section>
  );
};

export default Login;