// components/forms/UserForm.tsx
'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserFormValues {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

export default function UserForm() {
  const initialValues: UserFormValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  }

  const handleSubmit = async (values: UserFormValues) => {
    console.log('Form submitted:', values)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>User Registration Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className={errors.name && touched.name ? 'border-destructive' : ''}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className={errors.email && touched.email ? 'border-destructive' : ''}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  placeholder="1234567890"
                  className={errors.phone && touched.phone ? 'border-destructive' : ''}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type="password"
                  className={errors.password && touched.password ? 'border-destructive' : ''}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Field
                  as={Input}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={errors.confirmPassword && touched.confirmPassword ? 'border-destructive' : ''}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}