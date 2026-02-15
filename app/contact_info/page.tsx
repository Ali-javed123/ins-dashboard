// app/contact-us-card/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase-client"

import { Formik, Form, Field, FieldArray, FormikHelpers ,FieldProps} from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Shadcn UI Components (aapko inhe install karna hoga)
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
import { PlusCircle, Pencil, Trash2, Mail, Phone, X } from 'lucide-react';

// TypeScript Interfaces
interface EmailField {
  email: string;
}

interface PhoneField {
  number: string;
}

interface ContactUsCard {
  id?: number;
  email: EmailField[];
  number: PhoneField[];
  created_at?: string;
}


// Validation Schema
const ContactUsCardSchema = Yup.object().shape({
  email: Yup.array()
    .of(
      Yup.object().shape({
        email: Yup.string()
          .email('Invalid email format')
          .required('Email is required'),
      })
    )
    .min(1, 'At least one email is required'),
   number: Yup.array()
    .of(
      Yup.object().shape({
        number: Yup.string()
          .required('Phone number is required')
          .test('len', 'Phone number must be at least 8 digits', (val) => {
            if (!val) return false;
            // Remove all non-digit characters and check length
            const digitsOnly = val.replace(/\D/g, '');
            return digitsOnly.length >= 8;
          }),
      })
    )

    .min(1, 'At least one phone number is required'),
});

// Initial Values
const initialValues: ContactUsCard = {
  email: [{ email: '' }],
  number: [{ number: '' }],
};

export default function ContactUsCardPage() {
//   const supabase = createClientComponentClient();
  const [cards, setCards] = useState<ContactUsCard[]>([]);
  const [editingCard, setEditingCard] = useState<ContactUsCard | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all cards
  const fetchCards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_us_card')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Handle form submit (Add/Update)
  const handleSubmit = async (
    values: ContactUsCard,
    { resetForm, setSubmitting }: FormikHelpers<ContactUsCard>
  ) => {
    try {
      if (editingCard?.id) {
        // Update
        const { error } = await supabase
          .from('contact_us_card')
          .update({
            email: values.email,
            number: values.number,
          })
          .eq('id', editingCard.id);

        if (error) throw error;
      } else {
        // Add
        const { error } = await supabase
          .from('contact_us_card')
          .insert([values]);

        if (error) throw error;
      }

      await fetchCards();
      setIsDialogOpen(false);
      setEditingCard(null);
      resetForm();
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contact_us_card')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCards();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  // Open edit dialog
  const handleEdit = (card: ContactUsCard) => {
    setEditingCard(card);
    setIsDialogOpen(true);
  };

  // Open add dialog
  const handleAdd = () => {
    setEditingCard(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-400">Contact Us Cards</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Add New Card
        </Button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600 ">Loading cards...</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No contact cards found. Create your first card!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className=''>Contact Card {card.id}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(card)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {/* <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this contact card.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => card.id && handleDelete(card.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog> */}
                  </div>
                </CardTitle>
                <CardDescription>Created: {new Date(card.created_at || '').toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Emails Section */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[var(--color-theme)]" /> Email Addresses
                  </h3>
                  <div className="space-y-2 my-3">
                    {card.email.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-300 border-l-4 border-blue-600   p-2 rounded flex gap-1">
                        <div>
                    <Mail className="h-4 w-4 text-[var(--color-theme)]" /> 

                        </div>
                        <div>

                        {item.email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phone Numbers Section */}
                <div className='my-4'>
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[var(--color-theme)]" /> Phone Numbers
                  </h3>
                  <div className="space-y-2 my-3">
                    {card.number.map((item, index) => (
                      <div key={index} className="text-sm  text-gray-600 dark:text-gray-300   border-l-4 border-blue-600 dark:b p-2 rounded flex gap-1">
                        <div className=''>

                       <span><Phone className="h-4 w-4 d-flex text-[var(--color-theme)]" /></span> 
                        </div>
                        <div>
                          <span className='d-flex'>+{item.number}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCard ? 'Edit Contact Card' : 'Add New Contact Card'}</DialogTitle>
            <DialogDescription>
              Add email addresses and phone numbers for contact information.
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={editingCard || initialValues}
            validationSchema={ContactUsCardSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Email Fields Array */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Email Addresses</label>
                    <FieldArray name="email">
                      {({ push, remove }) => (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => push({ email: '' })}
                          className="flex items-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Email
                        </Button>
                      )}
                    </FieldArray>
                  </div>

                  <FieldArray name="email">
                    {({ remove, push }) => (
                      <div className="space-y-3">
                        {values.email.map((_, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Field name={`email.${index}.email`}>
              {({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<unknown>) => void; onBlur: (e: React.FocusEvent<unknown>) => void; name: string } }) => (

                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter email address"
                                                      className={
                    errors.email && 
                    Array.isArray(errors.email) && 
                    errors.email[index] && 
                    typeof errors.email[index] === 'object' && 
                    'email' in (errors.email[index] as object) && 
                    touched.email && 
                    Array.isArray(touched.email) && 
                    touched.email[index]?.email
                      ? 'border-red-500'
                      : ''
                  }

                                  />
                                )}
                              </Field>
                                          {errors.email && 
             Array.isArray(errors.email) && 
             errors.email[index] && 
             typeof errors.email[index] === 'object' && 
             'email' in (errors.email[index] as object) && 
             touched.email && 
             Array.isArray(touched.email) && 
             touched.email[index]?.email && (
              <div className="text-red-500 text-sm mt-1">
                {(errors.email[index] as { email?: string }).email}
              </div>
            )}

                            </div>
                            {values.email.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-10 w-10 text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                  {typeof errors.email === 'string' && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>

                {/* Phone Number Fields Array */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Phone Numbers</label>
                    <FieldArray name="number">
                      {({ push }) => (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => push({ number: '' })}
                          className="flex items-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Phone
                        </Button>
                      )}
                    </FieldArray>
                  </div>

                  <FieldArray name="number">
                    {({ remove }) => (
                      <div className="space-y-3">
                        {values.number.map((_, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <PhoneInput
                                country={'us'}
                                value={values.number[index].number}
                                   onChange={(phone) => setFieldValue(`number.${index}.number`, phone)}
  onBlur={() =>
    setFieldValue(`number.${index}.number`, values.number[index].number, true)
  }

                      inputStyle={{
                  width: '100%',
                  height: '40px',
                  fontSize: '14px',
                  backgroundColor: 'hsl(var(--color-background))',
                  color: 'hsl(var(--color-foreground))',
                  borderColor: (() => {
                    if (errors.number && 
                        Array.isArray(errors.number) && 
                        errors.number[index] && 
                        typeof errors.number[index] === 'object' && 
                        'number' in (errors.number[index] as object) && 
                        touched.number && 
                        Array.isArray(touched.number) && 
                        touched.number[index]?.number) {
                      return '#ef4444';
                    }
                    return 'hsl(var(--color-input))';
                  })(),
                  borderWidth: '1px',
                  borderRadius: 'var(--radius)',
                  transition: 'all 0.2s',
                }}
                buttonStyle={{
                  backgroundColor: 'hsl(var(--color-background))',
                  borderColor: 'hsl(var(--color-input))',
                  borderRight: 'none',
                  borderRadius: 'var(--radius) 0 0 var(--radius)',
                }}
                dropdownStyle={{
                  backgroundColor: 'hsl(var(--color-background))',
                  color: 'hsl(var(--color-foreground))',
                  border: '1px solid hsl(var(--color-border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-lg)',
                }}

                inputClass="phone-input"
                buttonClass="phone-input-button"
                dropdownClass="phone-input-dropdown"
                searchClass="phone-input-search"
                enableSearch={true}
                                containerStyle={{ width: '100%' }}
                              />
                  {errors.number && 
    Array.isArray(errors.number) && 
    errors.number[index] && 
    typeof errors.number[index] === 'object' && 
    'number' in (errors.number[index] as object) && 
    touched.number && 
    Array.isArray(touched.number) && 
    touched.number[index]?.number && (
      <div className="text-red-500 text-sm mt-1">
        {(errors.number[index] as { number?: string }).number}
      </div>
    )}


                            </div>
                            {values.number.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-10 w-10 text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                  {typeof errors.number === 'string' && (
                    <div className="text-red-500 text-sm">{errors.number}</div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingCard(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingCard ? 'Update Card' : 'Add Card'}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}