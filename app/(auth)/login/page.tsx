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

  const handleAuth = async (values: UserFormValues, formikHelpers: FormikHelpers<UserFormValues>) => {
  setLoading(true);
  console.log('Attempting auth with:', values); // 👈 Add this line
  
  try {
    if (login === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      console.log('Login response:', { data, error });
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
        alert('User already exists. Try logging in.');
      } else if (data.session) {
        alert('Sign up successful! You are now signed in.');
      } else {
        alert('Sign up successful! Please check your email for the confirmation link.');
      }
    }
  } catch (error: unknown) {
    // ... your existing error handling ...
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
                  className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
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
          
          <Button
            type="button"
            className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]"
          >
            <svg
              className="mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="25px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.0032l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Continue with Google
          </Button>
          
          <div className="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74]">
            <a href="#">Forgot your password?</a>
          </div>
          
          <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
            <p>
              {login === "login" 
                ? "Don't have an account?" 
                : "Already have an account?"}
            </p>
            <Button
              type="button"
              className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
              onClick={() => setLogin(login === "login" ? "signUp" : "login")}
            >
              {login === "login" ? "Register" : "Login"}
            </Button>
          </div>
        </div>
        
        {/* image */}
        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl"
            src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
            alt="Login visual"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;