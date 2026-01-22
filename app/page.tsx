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


import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface UserFormValues {
  email: string
  password: string
}

const Login = () => {
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
useEffect(() => {
  if (userSession) {
    router.push("/home");
  }
}, [userSession]);

  const handleAuth = async (values: UserFormValues, formikHelpers: FormikHelpers<UserFormValues>) => {
  setLoading(true);
  console.log('Attempting auth with:', values); // 👈 Add this line
  
  try {
    if (login === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      console.log('Login response:error', { error });
      console.log('Login response data:', { data });
      
      console.log("error?.error?.code",`${error.code}`)
      toast.error(`${error.code}`, {
        icon: <XCircle className="text-red-500" />,
      });
      formikHelpers.resetForm();

      if (!error) {
        router.push('/home');
      }
        // 👈 Add this line
      if (error) throw error;
      alert("Logged in successfully!");
      
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      console.log('Signup response:', { data, error }); // 👈 Add this line
      if (error) throw error;
      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        // alert('User already exists. Try logging in.');
         toast.success("User already exists. Try logging in.", {
        icon: <CheckCircle className="text-green-500" />,
      });
      } else if (data.session) {
        // alert('Sign up successful! You are now signed in.');
         toast.success("Sign up successful! You are now signed in", {
        icon: <CheckCircle className="text-green-500" />,
        
      });
      router.push("/home");
      } else {
        // alert('Sign up successful! Please check your email for the confirmation link.');
        toast.success("Sign up successful! Please check your email", {
        icon: <CheckCircle className="text-green-500" />,
      });
      }
    }
  } catch (error: unknown) {
    const {errors}=error
    // toast.success(error?.error?.code, {
    //     icon: <CheckCircle className="text-green-500" />,
    //   });
    // ... your existing error handling ...
    console.log("errors",error)
  } finally {
    setLoading(false);
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
      <div className="bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background-dark))] shadow-lg flex rounded-2xl w-full items-center">
        {/* form */}
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#002D74]">
            {login === "login" ? "Login" : "Sign Up"}
          </h2>
          <p className="text-xs mt-4 text-[#002D74]">
            {login === "login" 
              ? "If you are already a member, easily log in" 
              : "Create a new account to get started"}
          </p>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleAuth}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <div className="mt-8">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    className="p-2 rounded-xl border w-full"
                    type="email"
                    name="email"
                    placeholder="Email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      className="p-2 rounded-xl border w-full"
                        type={showPassword ? "text" : "password"}

                      name="password"
                      placeholder="Password"
                    />
                                        <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>

                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <Button
                  type="submit"
                  className=" rounded-xl text-white py-2 hover:scale-105 duration-300"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Processing...' : (login === "login" ? "Login" : "Sign Up")}
                </Button>
              </Form>
            )}
          </Formik>
          
          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>
          
         
          
          {/* <div className="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74]">
            <a href="#">Forgot your password?</a>
          </div>
           */}
          <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
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
              {login === "login" ? "Register" : "Login"}
            </Button>
          </div>
        </div>
        
        {/* image */}
        <div className="md:block hidden w-1/2">
            {/* eslint-disable @next/next/no-img-element */}
          
          <img
            className="rounded-2xl w-full h-screen object-cover"
            src="/assets/images/service/service-2-1.png"
            alt="Login visual"
            
          />
        </div>
      </div>
    </section>
  );
};

export default Login;