// // app/components/faqs.tsx
// 'use client'

// import { FC, useCallback, useEffect, useState, useRef } from 'react'
// import { Input } from '@/components/ui/input'
// import { supabase } from "@/lib/supabase-client"
// import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikProps, FieldArray, FieldArrayRenderProps } from 'formik'
// import * as Yup from 'yup'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import { Plus, Trash, Pen, X, Loader2, ChevronDown, ChevronUp } from "lucide-react"

// // Constants
// const STORAGE_TYPE: 'bucket' | 'base64' = "bucket"
// const CHUNK_SIZE = 60000
// const DELIMITER = '|||CHUNK|||'
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024

// // Strict Type Definitions
// type StorageType = 'bucket' | 'base64'

// interface FAQItem {
//   answer: string
// }

// interface FAQList {
//   list: FAQItem[]
// }

// interface DatabaseFAQ {
//   id: string
//   main_heading: string
//   title: string
//   paragraph: string
//   items: FAQList[] | null
//   created_at?: string
// }

// interface FAQ {
//   id: string
//   created_at: string
//   main_heading: string
//   title: string
//   paragraph: string
//   items: FAQList[]
// }

// interface FAQFormValues {
//   main_heading: string
//   title: string
//   paragraph: string
//   items: FAQList[]
// }

// interface FAQFormData {
//   main_heading: string
//   title: string
//   paragraph: string
//   items: FAQList[]
// }

// interface UpdateFAQData {
//   main_heading: string
//   title: string
//   paragraph: string
//   items: FAQList[]
// }

// interface ImagePreview {
//   url: string
//   type: 'new' | 'existing'
// }

// // Define proper error types for Formik
// interface FAQItemError {
//   answer?: string
// }

// interface FAQListError {
//   list?: string | FAQItemError[]
// }

// interface FormikErrorType {
//   main_heading?: string
//   title?: string
//   paragraph?: string
//   items?: string | FAQListError[]
// }

// const FAQs: FC = () => {
//   // State with strict typing
//   const [faqs, setFaqs] = useState<FAQ[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [isEdit, setIsEdit] = useState<boolean>(false)
//   const [editId, setEditId] = useState<string | null>(null)
//   const [open, setOpen] = useState<boolean>(false)
//   const [submitting, setSubmitting] = useState<boolean>(false)
//   const [fetchError, setFetchError] = useState<string | null>(null)
//   const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({})

//   // Use useEffect to set initial form data only on client
//   const [formData, setFormData] = useState<FAQFormData | null>(null)

//   // Initialize form data only on client
//   useEffect(() => {
//     setFormData({
//       main_heading: "",
//       title: "",
//       paragraph: "",
//       items: [
//         { list: [{ answer: "" }] }
//       ]
//     })
//   }, [])

//   // Validation Schema with strict typing
//   const validationSchema = Yup.object().shape({
//     main_heading: Yup.string()
//       .min(2, 'Main heading must be at least 2 characters')
//       .required('Main heading is required'),
//     title: Yup.string()
//       .min(2, 'Title must be at least 2 characters')
//       .required('Title is required'),
//     paragraph: Yup.string()
//       .min(10, 'Description must be at least 10 characters')
//       .required('Description is required'),
//     items: Yup.array().of(
//       Yup.object().shape({
//         list: Yup.array().of(
//           Yup.object().shape({
//             answer: Yup.string()
//               .min(2, 'Answer must be at least 2 characters')
//               .required('Answer is required')
//           })
//         ).min(1, 'At least one answer is required').required('List items are required')
//       })
//     ).min(1, 'At least one FAQ section is required').required('FAQ sections are required')
//   })

//   // Initial Form Values - only when formData is available
//   const initialValues: FAQFormValues = formData ? {
//     main_heading: formData.main_heading,
//     title: formData.title,
//     paragraph: formData.paragraph,
//     items: formData.items
//   } : {
//     main_heading: "",
//     title: "",
//     paragraph: "",
//     items: []
//   }

//   // Reset Form
//   const resetForm = (): void => {
//     if (formData) {
//       setFormData({
//         ...formData,
//         main_heading: "",
//         title: "",
//         paragraph: "",
//         items: [
//           { list: [{ answer: "" }] }
//         ]
//       })
//     }
//     setEditId(null)
//     setIsEdit(false)
//     setSubmitting(false)
//   }

//   // Fetch FAQs with proper error handling
//   const fetchFAQs = useCallback(async (): Promise<void> => {
//     try {
//       setLoading(true)
//       setFetchError(null)
      
//       // Check if supabase client is initialized
//       if (!supabase) {
//         throw new Error('Supabase client not initialized')
//       }

//       const { data, error } = await supabase
//         .from("faqs")
//         .select("*")
//         .order("created_at", { ascending: true })

//       if (error) {
//         console.error("Error fetching FAQs:", error)
//         setFetchError(error.message || 'Failed to fetch data')
//         return
//       }

//       console.log("Fetched FAQs data:", data)

//       const processedFAQs: FAQ[] = (data || []).map(convertToFAQ)
//       setFaqs(processedFAQs)
//     } catch (error) {
//       console.error("Unexpected error:", error)
//       setFetchError(error instanceof Error ? error.message : 'Unknown error occurred')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchFAQs()
//   }, [fetchFAQs])

//   // Convert Database to Component Type
//   const convertToFAQ = (dbFAQ: DatabaseFAQ): FAQ => {
//     return {
//       id: dbFAQ.id,
//       created_at: dbFAQ.created_at || new Date().toISOString(),
//       main_heading: dbFAQ.main_heading || "",
//       title: dbFAQ.title || "",
//       paragraph: dbFAQ.paragraph || "",
//       items: dbFAQ.items || [{ list: [] }]
//     }
//   }

//   // Handle Edit
//   const handleEdit = (faq: FAQ): void => {
//     setIsEdit(true)
//     setEditId(faq.id)
    
//     if (formData) {
//       setFormData({
//         ...formData,
//         main_heading: faq.main_heading,
//         title: faq.title,
//         paragraph: faq.paragraph,
//         items: faq.items.length > 0 ? faq.items : [
//           { list: [{ answer: "" }] }
//         ]
//       })
//     }
    
//     setOpen(true)
//   }

//   // Handle Submit (Create)
//   const handleSubmit = async (
//     values: FAQFormValues,
//     formikHelpers: FormikHelpers<FAQFormValues>
//   ): Promise<void> => {
//     if (submitting || !formData) return

//     try {
//       setSubmitting(true)

//       // Create FAQ in database
//       const { data: faqData, error: faqError } = await supabase
//         .from("faqs")
//         .insert([
//           {
//             main_heading: values.main_heading,
//             title: values.title,
//             paragraph: values.paragraph,
//             items: values.items
//           }
//         ])
//         .select()
//         .single()

//       if (faqError) {
//         console.error("Error adding FAQ:", faqError)
//         alert(`Error: ${faqError.message}`)
//         return
//       }

//       // Create new FAQ object
//       const newFAQ: FAQ = {
//         id: faqData.id,
//         created_at: faqData.created_at || new Date().toISOString(),
//         main_heading: faqData.main_heading || "",
//         title: faqData.title || "",
//         paragraph: faqData.paragraph || "",
//         items: faqData.items || [{ list: [] }]
//       }

//       // Update state
//       setFaqs(prev => {
//         const exists: boolean = prev.some(f => f.id === newFAQ.id)
//         if (exists) {
//           return prev.map(f => f.id === newFAQ.id ? newFAQ : f)
//         }
//         return [...prev, newFAQ]
//       })

//       resetForm()
//       formikHelpers.resetForm()
//       setOpen(false)
//       fetchFAQs()
//     } catch (error) {
//       console.error("Error saving FAQ:", error)
//       if (error instanceof Error) {
//         alert(`Error: ${error.message}`)
//       } else {
//         alert("Error saving FAQ")
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Handle Update
//   const handleUpdate = async (
//     values: FAQFormValues,
//     formikHelpers: FormikHelpers<FAQFormValues>
//   ): Promise<void> => {
//     if (!editId || submitting || !formData) return

//     try {
//       setSubmitting(true)

//       // Update FAQ in database
//       const updateData: UpdateFAQData = {
//         main_heading: values.main_heading,
//         title: values.title,
//         paragraph: values.paragraph,
//         items: values.items
//       }

//       const { data, error } = await supabase
//         .from("faqs")
//         .update(updateData)
//         .eq("id", editId)
//         .select()
//         .single()

//       if (error) {
//         console.error("Error updating FAQ:", error)
//         alert(`Error: ${error.message}`)
//         return
//       }

//       // Convert to component type and update state
//       const updatedFAQ: FAQ = convertToFAQ(data)
//       setFaqs(prev => prev.map(f => f.id === editId ? updatedFAQ : f))

//       resetForm()
//       formikHelpers.resetForm()
//       setOpen(false)
//       fetchFAQs()
//     } catch (error) {
//       console.error("Error updating FAQ:", error)
//       if (error instanceof Error) {
//         alert(`Error: ${error.message}`)
//       } else {
//         alert("Error updating FAQ")
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Handle Delete
//   const handleDeleteFAQ = async (id: string): Promise<void> => {
//     if (!window.confirm("Delete this FAQ?")) return

//     try {
//       // Delete from database
//       const { error } = await supabase.from("faqs").delete().eq("id", id)

//       if (error) {
//         console.error("Error deleting FAQ:", error)
//         alert(`Error: ${error.message}`)
//         return
//       }

//       // Update state
//       setFaqs(prev => prev.filter(f => f.id !== id))
//     } catch (error) {
//       console.error("Error deleting FAQ:", error)
//       alert("Error deleting FAQ. Please try again.")
//     }
//   }

//   // Toggle FAQ item expansion
//   const toggleExpansion = (faqId: string, itemIndex: number): void => {
//     const key = `${faqId}-${itemIndex}`
//     setExpandedItems(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }))
//   }

//   // Type-safe helper to check if errors exist for a specific field
//   const hasError = (
//     errors: FormikErrorType,
//     fieldName: keyof FAQFormValues | keyof FAQItem,
//     index?: number,
//     subIndex?: number
//   ): boolean => {
//     if (index !== undefined && subIndex !== undefined && fieldName === 'answer') {
//       const itemsErrors = errors.items
//       if (Array.isArray(itemsErrors) && itemsErrors[index]) {
//         const listErrors = itemsErrors[index] as FAQListError
//         const listArrayErrors = listErrors.list
//         if (Array.isArray(listArrayErrors) && listArrayErrors[subIndex]) {
//           const itemError = listArrayErrors[subIndex] as FAQItemError
//           return !!itemError.answer
//         }
//       }
//       return false
//     }
    
//     if (fieldName === 'items') {
//       return !!errors.items && typeof errors.items === 'string'
//     }
    
//     const fieldNameKey = fieldName as keyof FAQFormValues
//     return !!errors[fieldNameKey]
//   }

//   // Helper to get error message
//   const getErrorMessage = (
//     errors: FormikErrorType,
//     index: number,
//     subIndex: number,
//     fieldName: keyof FAQItem
//   ): string | undefined => {
//     const itemsErrors = errors.items
//     if (Array.isArray(itemsErrors) && itemsErrors[index]) {
//       const listErrors = itemsErrors[index] as FAQListError
//       const listArrayErrors = listErrors.list
//       if (Array.isArray(listArrayErrors) && listArrayErrors[subIndex]) {
//         const itemError = listArrayErrors[subIndex] as FAQItemError
//         return itemError[fieldName]
//       }
//     }
//     return undefined
//   }

//   // Render content based on loading state
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading FAQs...</p>
//         </div>
//       </div>
//     )
//   }

//   // Don't render form until formData is initialized
//   if (!formData) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600">Initializing form...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="w-full space-y-6">
//         <div className="container mx-auto px-4 py-8">
//           {/* Header with Add Button */}
//           <div className="flex justify-between items-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FAQs Management</h1>
//             <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="w-4 h-4 mr-2" />
//               Add New FAQ
//             </Button>
//           </div>

//           {/* Error Display */}
//           {fetchError && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-700 font-medium">Error: {fetchError}</p>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => fetchFAQs()}
//                 className="mt-2"
//               >
//                 Retry
//               </Button>
//             </div>
//           )}

//           {/* Display existing FAQs or empty state */}
//           {faqs.length === 0 ? (
//             <div className="text-center py-12 border-2 border-dashed rounded-lg">
//               <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
//                 <Plus className="w-8 h-8 text-gray-400" />
//               </div>
//               <p className="text-gray-500 mb-4">No FAQs found</p>
//               <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
//                 Create First FAQ
//               </Button>
//             </div>
//           ) : (
//   <div className="space-y-8">
//   {faqs.map((faq) => (
//     <div key={faq.id} className="overflow-hidden">
//       <div className="flex justify-between items-center p-6">
//         <div>
//           <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//             {faq.main_heading}
//           </h3>
//         </div>
//         <div className="flex gap-2">
//           <Button

//             onClick={() => handleEdit(faq)}
//             // className="border-blue-200 shadow-lg hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30"
//           >
//             <Pen className="w-4 h-4 mr-2" />
//             Edit
//           </Button>
//           <Button
//             variant="error"
//             className='shadow-lg'
//             onClick={() => handleDeleteFAQ(faq.id)}
//           >
//             <Trash className="w-4 h-4 mr-2" />
//             Delete
//           </Button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="rounded-[20px]
//         bg-gradient-to-br
//         from-[hsl(var(--color-background))]
//         to-[hsl(var(--color-background)/0.95)]
//         dark:from-[hsl(var(--color-background-dark))]
//         dark:to-[hsl(var(--color-background-dark)/0.95)]
//         shadow-lg
//         shadow-[hsl(var(--color-shadow)/0.1)]
//         border-2
//         border-[hsl(var(--color-border)/0.8)] p-6">
        
//         {/* Header Section */}
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//             {faq.main_heading}
//           </h1>
//           <div className="h-1 w-24 bg-[var(--color-theme)] mx-auto rounded-full mb-8"></div>
//         </div>

//         {/* Multiple FAQ Sections */}
//         <div className="space-y-6">
//           {faq.items.map((itemGroup, groupIndex) => {
//             const isGroupExpanded = expandedItems[`${faq.id}-${groupIndex}`];
            
//             return (
//               <div key={groupIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
//                 {/* Toggle Button for FAQ Section */}
//                 <button
//                   onClick={() => toggleExpansion(faq.id, groupIndex)}
//                   className="w-full p-6 text-left flex justify-between items-center bg-gradient-to-br
//         from-[hsl(var(--color-background))]
//         to-[hsl(var(--color-background)/0.95)]
//         dark:from-[hsl(var(--color-background-dark))]
//         dark:to-[hsl(var(--color-background-dark)/0.95)] transition-colors"
//                 >
//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                       {faq.title} {/* This should be the question/title */}
//                     </h3>
//                     {!isGroupExpanded && (
//                       <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
//                         {faq.paragraph} {/* Show snippet when collapsed */}
//                       </p>
//                     )}
//                   </div>
//                   {isGroupExpanded ? (
//                     <ChevronUp className="w-6 h-6 text-gray-500 ml-4 flex-shrink-0" />
//                   ) : (
//                     <ChevronDown className="w-6 h-6 text-gray-500 ml-4 flex-shrink-0" />
//                   )}
//                 </button>
                
//                 {/* Expanded Content */}
//                 {isGroupExpanded && (
//                   <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
//                     {/* Full Description */}
                  
                    
//                     {/* Multiple List Items */}
//                     <div className="space-y-4">
//                       <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
//                         {faq.paragraph}
//                       </h4>
//                       {itemGroup.list.map((item, itemIndex) => (
//                         <div key={itemIndex} className="pl-4 ">
//                           <p className="text-gray-700 dark:text-gray-300">
//                             <span className="font-medium">{itemIndex + 1}:</span> {item.answer}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
//           )}
//         </div>
//       </div>

//       {/* Dialog for Create/Edit */}
//       {open && (
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//             <DialogHeader className="flex-shrink-0">
//               <DialogTitle className="text-2xl font-bold">
//                 {isEdit ? "Edit FAQ" : "Create New FAQ"}
//               </DialogTitle>
//             </DialogHeader>

//             {/* Scrollable Content */}
//             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(90vh-140px)]">
//               <Formik
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={isEdit ? handleUpdate : handleSubmit}
//                 enableReinitialize
//               >
//                 {({
//                   values,
//                   errors,
//                   touched,
//                   isSubmitting,
//                   setFieldValue,
//                   isValid
//                 }: FormikProps<FAQFormValues>) => {
//                   // Cast errors to our custom type
//                   const formikErrors: FormikErrorType = errors as unknown as FormikErrorType
                  
//                   return (
//                     <Form id="faqForm" className="space-y-6 pb-4">
//                       {/* Main Content */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* Left Column */}
//                         <div className="space-y-4">
//                           <div>
//                             <Label htmlFor="main_heading" className="mb-2 block font-medium">
//                               Main Heading *
//                             </Label>
//                             <Field
//                               as={Input}
//                               id="main_heading"
//                               name="main_heading"
//                               placeholder="Frequently Asked Questions"
//                               className={`${hasError(formikErrors, 'main_heading') && touched.main_heading ? 'border-red-500 focus:ring-red-500' : ''}`}
//                             />
//                             <ErrorMessage
//                               name="main_heading"
//                               component="div"
//                               className="text-sm text-red-600 mt-1"
//                             />
//                           </div>

//                           <div>
//                             <Label htmlFor="title" className="mb-2 block font-medium">
//                               Title *
//                             </Label>
//                             <Field
//                               as={Input}
//                               id="title"
//                               name="title"
//                               placeholder="Common Questions & Answers"
//                               className={`${hasError(formikErrors, 'title') && touched.title ? 'border-red-500 focus:ring-red-500' : ''}`}
//                             />
//                             <ErrorMessage
//                               name="title"
//                               component="div"
//                               className="text-sm text-red-600 mt-1"
//                             />
//                           </div>
//                         </div>

//                         {/* Right Column */}
//                         <div className="space-y-4">
//                           <div>
//                             <Label htmlFor="paragraph" className="mb-2 block font-medium">
//                               Description *
//                             </Label>
//                             <Field
//                               as="textarea"
//                               id="paragraph"
//                               name="paragraph"
//                               rows={4}
//                               className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${hasError(formikErrors, 'paragraph') && touched.paragraph ? 'border-red-500 focus:ring-red-500' : ''}`}
//                               placeholder="Find answers to the most common questions about our services..."
//                             />
//                             <ErrorMessage
//                               name="paragraph"
//                               component="div"
//                               className="text-sm text-red-600 mt-1"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* FAQ Items Section with Nested FieldArrays */}
//                       <div className="border-t pt-6">
//                         <div className="flex justify-between items-center mb-4">
//                           <h3 className="font-semibold text-lg">FAQ Items *</h3>
//                           <FieldArray name="items">
//                             {({ push }: FieldArrayRenderProps) => (
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => push({ list: [{ answer: "" }] })}
//                                 disabled={submitting}
//                               >
//                                 <Plus className="w-4 h-4 mr-2" />
//                                 Add FAQ Section
//                               </Button>
//                             )}
//                           </FieldArray>
//                         </div>
                        
//                         <FieldArray name="items">
//                           {({ push, remove }: FieldArrayRenderProps) => (
//                             <div className="space-y-6">
//                               {values.items.map((itemGroup, groupIndex) => (
//                                 <div key={groupIndex} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
//                                   <div className="flex justify-between items-center mb-4">
//                                     <h4 className="font-medium text-gray-900 dark:text-white">
//                                       FAQ Section {groupIndex + 1}
//                                     </h4>
//                                     {values.items.length > 1 && (
//                                       <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => remove(groupIndex)}
//                                         disabled={submitting}
//                                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                       >
//                                         <X className="w-4 h-4" />
//                                       </Button>
//                                     )}
//                                   </div>
                                  
//                                   {/* Nested FieldArray for list items */}
//                                   <FieldArray name={`items.${groupIndex}.list`}>
//                                     {({
//                                       push: pushListItem,
//                                       remove: removeListItem
//                                     }: FieldArrayRenderProps) => (
//                                       <div className="space-y-4">
//                                         <div className="flex justify-between items-center">
//                                           <Label className="font-medium">Questions & Answers</Label>
//                                           <Button
//                                             type="button"
//                                             variant="outline"
//                                             size="sm"
//                                             onClick={() => pushListItem({ answer: "" })}
//                                             disabled={submitting}
//                                           >
//                                             <Plus className="w-4 h-4 mr-2" />
//                                             Add Question
//                                           </Button>
//                                         </div>
                                        
//                                         {itemGroup.list.map((listItem, itemIndex) => (
//                                           <div key={itemIndex} className="border p-3 rounded-md bg-white dark:bg-gray-800">
//                                             <div className="flex justify-between items-center mb-2">
//                                               <Label htmlFor={`items.${groupIndex}.list.${itemIndex}.answer`} className="font-medium">
//                                                 Answer {itemIndex + 1} *
//                                               </Label>
//                                               {itemGroup.list.length > 1 && (
//                                                 <Button
//                                                   type="button"
//                                                   variant="ghost"
//                                                   size="sm"
//                                                   onClick={() => removeListItem(itemIndex)}
//                                                   disabled={submitting}
//                                                   className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
//                                                 >
//                                                   <X className="w-3 h-3" />
//                                                 </Button>
//                                               )}
//                                             </div>
//                                             <Field
//                                               as="textarea"
//                                               id={`items.${groupIndex}.list.${itemIndex}.answer`}
//                                               name={`items.${groupIndex}.list.${itemIndex}.answer`}
//                                               rows={3}
//                                               className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                                 hasError(formikErrors, 'answer', groupIndex, itemIndex)
//                                                   ? 'border-red-500 focus:ring-red-500'
//                                                   : ''
//                                               }`}
//                                               placeholder="Enter the answer here..."
//                                             />
//                                             <ErrorMessage
//                                               name={`items.${groupIndex}.list.${itemIndex}.answer`}
//                                               component="div"
//                                               className="text-sm text-red-600 mt-1"
//                                             />
//                                           </div>
//                                         ))}
//                                       </div>
//                                     )}
//                                   </FieldArray>
//                                 </div>
//                               ))}
                              
//                               {typeof errors.items === 'string' && (
//                                 <div className="text-sm text-red-600 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
//                                   {errors.items}
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </FieldArray>
//                       </div>

//                       {/* Footer Buttons */}
//                       <DialogFooter className="
//                         flex-shrink-0
//                         pt-4
//                         border-t
//                         bg-white
//                         dark:bg-gray-900
//                         sticky
//                         bottom-0
//                       ">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => {
//                             setOpen(false)
//                             resetForm()
//                           }}
//                           disabled={submitting}
//                           className="border-gray-300 hover:bg-gray-50"
//                         >
//                           Cancel
//                         </Button>
                        
//                         <Button
//                           type="submit"
//                           form="faqForm"
//                           disabled={submitting || !isValid}
//                           className="bg-blue-600 hover:bg-blue-700"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                               Saving...
//                             </>
//                           ) : isEdit ? "Update FAQ" : "Create FAQ"}
//                         </Button>
//                       </DialogFooter>
//                     </Form>
//                   )
//                 }}
//               </Formik>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   )
// }

// export default FAQs



// app/components/faqs.tsx
// app/components/faqs.tsx
// app/components/faqs.tsx
'use client'

import { FC, useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { supabase } from "@/lib/supabase-client"
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikProps } from 'formik'
import * as Yup from 'yup'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, Trash, Pen, X, Loader2, ChevronDown, ChevronUp, Grid, Folder, Check } from "lucide-react"
import { Badge } from '@/components/ui/badge'

// Types
interface FAQItem {
  answer: string
}

interface FAQList {
  list: FAQItem[]
}

interface DatabaseFAQ {
  id: string
  created_at: string
  title: string
  paragraph: string
  items: FAQList[] | null
  faq_group_id: string
}

interface DatabaseFAQGroup {
  id: string
  created_at: string
  main_heading: string
}

interface FAQ {
  id: string
  created_at: string
  title: string
  paragraph: string
  items: FAQList[]
  faq_group_id: string
}

interface FAQGroup {
  id: string
  created_at: string
  main_heading: string
  faqs: FAQ[]
}

interface FAQGroupFormValues {
  main_heading: string
}

interface FAQFormValues {
  title: string
  paragraph: string
  items: FAQList[]
}

// Error Types
interface FAQItemErrors {
  answer?: string
}

interface FAQListErrors {
  list?: FAQItemErrors[] | string
}

interface FAQFormErrors {
  title?: string
  paragraph?: string
  items?: FAQListErrors[] | string
}

const FAQs: FC = () => {
  // State
  const [faqGroups, setFaqGroups] = useState<FAQGroup[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  // FAQ Group Modal States
  const [faqGroupModalOpen, setFaqGroupModalOpen] = useState<boolean>(false)
  const [isFaqGroupEdit, setIsFaqGroupEdit] = useState<boolean>(false)
  const [editFaqGroupId, setEditFaqGroupId] = useState<string | null>(null)
  
  // FAQ Modal States
  const [faqModalOpen, setFaqModalOpen] = useState<boolean>(false)
  const [isFaqEdit, setIsFaqEdit] = useState<boolean>(false)
  const [editFaqId, setEditFaqId] = useState<string | null>(null)
  const [selectedFaqGroupId, setSelectedFaqGroupId] = useState<string | null>(null)
  
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({})

  // Validation Schemas
  const faqGroupValidationSchema = Yup.object().shape({
    main_heading: Yup.string()
      .min(2, 'Main heading must be at least 2 characters')
      .required('Main heading is required')
  })

  const faqValidationSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .required('Title is required'),
    paragraph: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
    items: Yup.array().of(
      Yup.object().shape({
        list: Yup.array().of(
          Yup.object().shape({
            answer: Yup.string()
              .min(2, 'Answer must be at least 2 characters')
              .required('Answer is required')
          })
        ).min(1, 'At least one answer is required')
      })
    ).min(1, 'At least one FAQ section is required')
  })

  // Initial Values
  const faqGroupInitialValues: FAQGroupFormValues = {
    main_heading: ""
  }

  const faqInitialValues: FAQFormValues = {
    title: "",
    paragraph: "",
    items: [
      { list: [{ answer: "" }] }
    ]
  }

  // Reset Functions
  const resetFaqGroupForm = (): void => {
    setEditFaqGroupId(null)
    setIsFaqGroupEdit(false)
    setFaqGroupModalOpen(false)
  }

  const resetFaqForm = (): void => {
    setEditFaqId(null)
    setIsFaqEdit(false)
    setSelectedFaqGroupId(null)
    setFaqModalOpen(false)
  }

  // Fetch FAQ Groups with their FAQs
  const fetchFAQGroups = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setFetchError(null)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      // Fetch all FAQ Groups
      const { data: faqGroupsData, error: faqGroupsError } = await supabase
        .from("faq_group")
        .select("*")
        .order("created_at", { ascending: false })

      if (faqGroupsError) {
        console.error("Error fetching FAQ Groups:", faqGroupsError)
        setFetchError(faqGroupsError.message || 'Failed to fetch FAQ Groups')
        return
      }

      // Fetch all FAQs
      const { data: faqsData, error: faqsError } = await supabase
        .from("faqs")
        .select("*")
        .order("created_at", { ascending: true })

      if (faqsError) {
        console.error("Error fetching FAQs:", faqsError)
        setFetchError(faqsError.message || 'Failed to fetch FAQs')
        return
      }

      // Process FAQ Groups with their FAQs
      const processedFAQGroups: FAQGroup[] = (faqGroupsData || []).map((group: DatabaseFAQGroup) => {
        // Filter FAQs for this group
        const groupFAQs: FAQ[] = (faqsData || [])
          .filter((faq: DatabaseFAQ) => faq.faq_group_id === group.id)
          .map((faq: DatabaseFAQ) => ({
            id: faq.id,
            created_at: faq.created_at,
            title: faq.title || "",
            paragraph: faq.paragraph || "",
            items: faq.items || [{ list: [] }],
            faq_group_id: faq.faq_group_id
          }))

        return {
          id: group.id,
          created_at: group.created_at,
          main_heading: group.main_heading || "",
          faqs: groupFAQs
        }
      })

      setFaqGroups(processedFAQGroups)
    } catch (error) {
      console.error("Unexpected error:", error)
      setFetchError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFAQGroups()
  }, [fetchFAQGroups])

  // Get FAQ for editing
  const getFAQForEdit = (): FAQFormValues => {
    if (!isFaqEdit || !editFaqId) return faqInitialValues
    
    for (const group of faqGroups) {
      const faq = group.faqs.find(f => f.id === editFaqId)
      if (faq) {
        return {
          title: faq.title,
          paragraph: faq.paragraph,
          items: faq.items.length > 0 ? faq.items : [{ list: [{ answer: "" }] }]
        }
      }
    }
    
    return faqInitialValues
  }

  // Get FAQ Group for editing
  const getFAQGroupForEdit = (): FAQGroupFormValues => {
    if (!isFaqGroupEdit || !editFaqGroupId) return faqGroupInitialValues
    
    const group = faqGroups.find(g => g.id === editFaqGroupId)
    if (group) {
      return {
        main_heading: group.main_heading
      }
    }
    
    return faqGroupInitialValues
  }

  // Handle FAQ Group Edit
  const handleEditFAQGroup = (faqGroup: FAQGroup): void => {
    setIsFaqGroupEdit(true)
    setEditFaqGroupId(faqGroup.id)
    setFaqGroupModalOpen(true)
  }

  // Handle FAQ Edit
  const handleEditFAQ = (faqGroupId: string, faq: FAQ): void => {
    setSelectedFaqGroupId(faqGroupId)
    setIsFaqEdit(true)
    setEditFaqId(faq.id)
    setFaqModalOpen(true)
  }

  // Handle Add FAQ
  const handleAddFAQ = (faqGroupId: string): void => {
    setSelectedFaqGroupId(faqGroupId)
    setIsFaqEdit(false)
    setEditFaqId(null)
    setFaqModalOpen(true)
  }

  // Handle FAQ Group Submit (Create)
  const handleFAQGroupSubmit = async (
    values: FAQGroupFormValues,
    formikHelpers: FormikHelpers<FAQGroupFormValues>
  ): Promise<void> => {
    if (submitting) return

    try {
      setSubmitting(true)

      const { data: faqGroupData, error: faqGroupError } = await supabase
        .from("faqGroup")
        .insert([{ main_heading: values.main_heading }])
        .select()
        .single()

      if (faqGroupError) {
        console.error("Error adding FAQ Group:", faqGroupError)
        alert(`Error: ${faqGroupError.message}`)
        return
      }

      const newFAQGroup: FAQGroup = {
        id: faqGroupData.id,
        created_at: faqGroupData.created_at,
        main_heading: faqGroupData.main_heading,
        faqs: []
      }

      setFaqGroups(prev => [newFAQGroup, ...prev])
      resetFaqGroupForm()
      formikHelpers.resetForm()
    } catch (error) {
      console.error("Error saving FAQ Group:", error)
      alert(error instanceof Error ? `Error: ${error.message}` : "Error saving FAQ Group")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle FAQ Group Update
  const handleFAQGroupUpdate = async (
    values: FAQGroupFormValues,
    formikHelpers: FormikHelpers<FAQGroupFormValues>
  ): Promise<void> => {
    if (!editFaqGroupId || submitting) return

    try {
      setSubmitting(true)

      const { data, error } = await supabase
        .from("faq_group")
        .update({ main_heading: values.main_heading })
        .eq("id", editFaqGroupId)
        .select()
        .single()

      if (error) {
        console.error("Error updating FAQ Group:", error)
        alert(`Error: ${error.message}`)
        return
      }

      setFaqGroups(prev => prev.map(group => 
        group.id === editFaqGroupId 
          ? { ...group, main_heading: data.main_heading }
          : group
      ))

      resetFaqGroupForm()
      formikHelpers.resetForm()
    } catch (error) {
      console.error("Error updating FAQ Group:", error)
      alert(error instanceof Error ? `Error: ${error.message}` : "Error updating FAQ Group")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle FAQ Submit (Create)
  const handleFAQSubmit = async (
    values: FAQFormValues,
    formikHelpers: FormikHelpers<FAQFormValues>
  ): Promise<void> => {
    if (!selectedFaqGroupId || submitting) return

    try {
      setSubmitting(true)

      const { data: faqData, error: faqError } = await supabase
        .from("faqs")
        .insert([{
          title: values.title,
          paragraph: values.paragraph,
          items: values.items,
          faq_group_id: selectedFaqGroupId
        }])
        .select()
        .single()

      if (faqError) {
        console.error("Error adding FAQ:", faqError)
        alert(`Error: ${faqError.message}`)
        return
      }

      const newFAQ: FAQ = {
        id: faqData.id,
        created_at: faqData.created_at,
        title: faqData.title || "",
        paragraph: faqData.paragraph || "",
        items: faqData.items || [{ list: [] }],
        faq_group_id: faqData.faq_group_id
      }

      setFaqGroups(prev => prev.map(group => {
        if (group.id === selectedFaqGroupId) {
          return { ...group, faqs: [...group.faqs, newFAQ] }
        }
        return group
      }))

      resetFaqForm()
      formikHelpers.resetForm()
    } catch (error) {
      console.error("Error saving FAQ:", error)
      alert(error instanceof Error ? `Error: ${error.message}` : "Error saving FAQ")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle FAQ Update
  const handleFAQUpdate = async (
    values: FAQFormValues,
    formikHelpers: FormikHelpers<FAQFormValues>
  ): Promise<void> => {
    if (!editFaqId || !selectedFaqGroupId || submitting) return

    try {
      setSubmitting(true)

      const { data, error } = await supabase
        .from("faqs")
        .update({
          title: values.title,
          paragraph: values.paragraph,
          items: values.items
        })
        .eq("id", editFaqId)
        .select()
        .single()

      if (error) {
        console.error("Error updating FAQ:", error)
        alert(`Error: ${error.message}`)
        return
      }

      const updatedFAQ: FAQ = {
        id: data.id,
        created_at: data.created_at,
        title: data.title || "",
        paragraph: data.paragraph || "",
        items: data.items || [{ list: [] }],
        faq_group_id: data.faq_group_id
      }

      setFaqGroups(prev => prev.map(group => {
        if (group.id === selectedFaqGroupId) {
          return {
            ...group,
            faqs: group.faqs.map(f => f.id === editFaqId ? updatedFAQ : f)
          }
        }
        return group
      }))

      resetFaqForm()
      formikHelpers.resetForm()
    } catch (error) {
      console.error("Error updating FAQ:", error)
      alert(error instanceof Error ? `Error: ${error.message}` : "Error updating FAQ")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle FAQ Group Delete
  const handleDeleteFAQGroup = async (id: string): Promise<void> => {
    if (!window.confirm("Delete this FAQ Group and all its FAQs?")) return

    try {
      const { error: faqsError } = await supabase
        .from("faqs")
        .delete()
        .eq("faq_group_id", id)

      if (faqsError) {
        console.error("Error deleting FAQs:", faqsError)
        alert(`Error: ${faqsError.message}`)
        return
      }

      const { error } = await supabase
        .from("faq_group")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Error deleting FAQ Group:", error)
        alert(`Error: ${error.message}`)
        return
      }

      setFaqGroups(prev => prev.filter(g => g.id !== id))
    } catch (error) {
      console.error("Error deleting FAQ Group:", error)
      alert("Error deleting FAQ Group. Please try again.")
    }
  }

  // Handle FAQ Delete
  const handleDeleteFAQ = async (faqGroupId: string, faqId: string): Promise<void> => {
    if (!window.confirm("Delete this FAQ?")) return

    try {
      const { error } = await supabase.from("faqs").delete().eq("id", faqId)

      if (error) {
        console.error("Error deleting FAQ:", error)
        alert(`Error: ${error.message}`)
        return
      }

      setFaqGroups(prev => prev.map(group => {
        if (group.id === faqGroupId) {
          return { ...group, faqs: group.faqs.filter(f => f.id !== faqId) }
        }
        return group
      }))
    } catch (error) {
      console.error("Error deleting FAQ:", error)
      alert("Error deleting FAQ. Please try again.")
    }
  }

  // Toggle FAQ item expansion
  const toggleExpansion = (faqId: string, itemIndex: number): void => {
    const key = `${faqId}-${itemIndex}`
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Helper function to check if answer field has error
  const hasAnswerError = (errors: FAQFormErrors, groupIndex: number, itemIndex: number): boolean => {
    if (!errors.items || typeof errors.items === 'string') return false
    
    const itemErrors = errors.items[groupIndex]
    if (!itemErrors || typeof itemErrors === 'string') return false
    
    const listErrors = itemErrors.list
    if (!listErrors || typeof listErrors === 'string') return false
    
    const answerError = listErrors[itemIndex]?.answer
    return !!answerError
  }

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full space-y-6">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FAQs Management</h1>
            <Button onClick={() => {
              setIsFaqGroupEdit(false)
              setFaqGroupModalOpen(true)
            }} >
              <Plus className="w-4 h-4 mr-2" />
              Add New FAQ Group
            </Button>
          </div>

          {/* Error Display */}
          {fetchError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Error: {fetchError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchFAQGroups()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {/* FAQ Groups List */}
          {faqGroups.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No FAQ Groups found</p>
              <Button onClick={() => {
                setIsFaqGroupEdit(false)
                setFaqGroupModalOpen(true)
              }} >
                Create First FAQ Group
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {faqGroups.map((faqGroup) => (
                <section key={faqGroup.id} className="scroll-mt-16">
                  {/* FAQ Group Header */}
                  <div className="mb-8 bg-[hsl(var(--color-background))] p-6 rounded-2xl border">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-[var(--color-theme)] group-hover:bg-[var(--color-theme-hover flex items-center justify-center">
                            <span className="text-white font-bold text-lg">?</span>
                          </div>
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                              {faqGroup.main_heading}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <Badge variant="outline" className="gap-2">
                                <Grid size={14} />
                                {faqGroup.faqs.length} FAQs
                              </Badge>
                              <Badge variant="secondary">
                                {formatDate(faqGroup.created_at)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 flex-shrink-0">
                        <Button
                          onClick={() => handleEditFAQGroup(faqGroup)}
                          variant="outline"
                          className="gap-2"
                        >
                          <Pen size={16} />
                          Edit Group
                        </Button>
                        <Button
                          onClick={() => handleAddFAQ(faqGroup.id)}
                          className="gap-2"
                        >
                          <Plus size={16} />
                          Add FAQ
                        </Button>
                        <Button
                          onClick={() => handleDeleteFAQGroup(faqGroup.id)}
                          variant="destructive"
                          size="icon"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* FAQs in this group */}
                  {faqGroup.faqs.length > 0 ? (
                    <div className="space-y-6">
                      {faqGroup.faqs.map((faq) => (
                        <div key={faq.id} className="overflow-hidden">
                          <div className="flex justify-between items-center p-6">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {faq.title}
                              </h3>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditFAQ(faqGroup.id, faq)}
                              >
                                <Pen className="w-4 h-4 mr-2" />
                                Edit FAQ
                              </Button>
                              <Button
                                variant="error"
                                onClick={() => handleDeleteFAQ(faqGroup.id, faq.id)}
                              >
                                <Trash className="w-4 h-4 mr-2" />
                                Delete FAQ
                              </Button>
                            </div>
                          </div>

                          {/* FAQ Content */}
                          <div className="rounded-[20px] 
                            bg-gradient-to-br 
                            from-[hsl(var(--color-background))] 
                            to-[hsl(var(--color-background)/0.95)]
                            dark:from-[hsl(var(--color-background-dark))] 
                            dark:to-[hsl(var(--color-background-dark)/0.95)]
                            shadow-lg 
                            shadow-[hsl(var(--color-shadow)/0.1)]
                            border-2 
                            border-[hsl(var(--color-border)/0.8)] p-6">
                            
                            <div className="mb-8 text-center">
                              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {faqGroup.main_heading}
                              </h1>
                              <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full mb-8"></div>
                            </div>

                            <div className="space-y-6">
                              {faq.items.map((itemGroup, groupIndex) => {
                                const isGroupExpanded = expandedItems[`${faq.id}-${groupIndex}`];
                                
                                return (
                                  <div key={groupIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => toggleExpansion(faq.id, groupIndex)}
                                      className="w-full p-6 text-left flex justify-between items-center bg-gradient-to-br 
                                        from-[hsl(var(--color-background))] 
                                        to-[hsl(var(--color-background)/0.95)]
                                        dark:from-[hsl(var(--color-background-dark))] 
                                        dark:to-[hsl(var(--color-background-dark)/0.95)] transition-colors"
                                    >
                                      <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                          {faq.title}
                                        </h3>
                                        {!isGroupExpanded && (
                                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {faq.paragraph}
                                          </p>
                                        )}
                                      </div>
                                      {isGroupExpanded ? (
                                        <ChevronUp className="w-6 h-6 text-gray-500 ml-4 flex-shrink-0" />
                                      ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-500 ml-4 flex-shrink-0" />
                                      )}
                                    </button>
                                    
                                    {isGroupExpanded && (
                                      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                        <div className="space-y-4">
                                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            {faq.paragraph}
                                          </h4>
                                          {itemGroup.list.map((item, itemIndex) => (
                                            <div key={itemIndex} className="pl-4">
                                              <p className="text-gray-700 dark:text-gray-300">
                                                <span className="font-medium">{itemIndex + 1}:</span> {item.answer}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl border-gray-200 dark:border-gray-800">
                      <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <Folder className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No FAQs in This Group
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Add FAQs to this group to showcase common questions and answers
                      </p>
                      <Button
                        onClick={() => handleAddFAQ(faqGroup.id)}
                        variant="outline"
                        className="gap-2"
                      >
                        <Plus size={16} />
                        Add First FAQ
                      </Button>
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAQ Group Modal */}
      <Dialog open={faqGroupModalOpen} onOpenChange={setFaqGroupModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isFaqGroupEdit ? "Edit FAQ Group" : "Create New FAQ Group"}
            </DialogTitle>
          </DialogHeader>

          <Formik
            initialValues={getFAQGroupForEdit()}
            validationSchema={faqGroupValidationSchema}
            onSubmit={isFaqGroupEdit ? handleFAQGroupUpdate : handleFAQGroupSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <Label htmlFor="main_heading" className="text-base font-medium">
                    Main Heading *
                  </Label>
                  <Field
                    as={Input}
                    id="main_heading"
                    name="main_heading"
                    placeholder="e.g., Frequently Asked Questions"
                    className={`mt-2 text-lg ${errors.main_heading && touched.main_heading ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="main_heading"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <DialogFooter className="mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFaqGroupForm}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        {isFaqGroupEdit ? 'Update Group' : 'Create Group'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* FAQ Modal */}
      <Dialog open={faqModalOpen} onOpenChange={setFaqModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold">
              {isFaqEdit ? "Edit FAQ" : "Create New FAQ"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 max-h-[calc(90vh-140px)]">
            <Formik
              initialValues={getFAQForEdit()}
              validationSchema={faqValidationSchema}
              onSubmit={isFaqEdit ? handleFAQUpdate : handleFAQSubmit}
              enableReinitialize
            >
              {({ 
                values, 
                errors, 
                touched, 
                isSubmitting, 
                isValid,
                setFieldValue
              }: FormikProps<FAQFormValues>) => {
                // Cast errors to our custom error type
                const formErrors = errors as FAQFormErrors
                
                return (
                  <Form id="faqForm" className="space-y-6 pb-4">
                    {/* Main Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title" className="mb-2 block font-medium">
                            Title *
                          </Label>
                          <Field
                            as={Input}
                            id="title"
                            name="title"
                            placeholder="Common Questions & Answers"
                            className={`${errors.title && touched.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-sm text-red-600 mt-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="paragraph" className="mb-2 block font-medium">
                            Description *
                          </Label>
                          <Field
                            as="textarea"
                            id="paragraph"
                            name="paragraph"
                            rows={4}
                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.paragraph && touched.paragraph ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Find answers to the most common questions about our services..."
                          />
                          <ErrorMessage
                            name="paragraph"
                            component="div"
                            className="text-sm text-red-600 mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* FAQ Items Section */}
                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">FAQ Items *</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newItems = [...values.items, { list: [{ answer: "" }] }]
                            setFieldValue("items", newItems)
                          }}
                          disabled={isSubmitting}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add FAQ Section
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                        {values.items.map((itemGroup, groupIndex) => (
                          <div key={groupIndex} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                FAQ Section {groupIndex + 1}
                              </h4>
                              {values.items.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newItems = values.items.filter((_, idx) => idx !== groupIndex)
                                    setFieldValue("items", newItems)
                                  }}
                                  disabled={isSubmitting}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <Label className="font-medium">Questions & Answers</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const updatedItems = [...values.items]
                                    updatedItems[groupIndex].list = [...updatedItems[groupIndex].list, { answer: "" }]
                                    setFieldValue("items", updatedItems)
                                  }}
                                  disabled={isSubmitting}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Question
                                </Button>
                              </div>
                              
                              {itemGroup.list.map((listItem, itemIndex) => (
                                <div key={itemIndex} className="border p-3 rounded-md bg-white dark:bg-gray-800">
                                  <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor={`items.${groupIndex}.list.${itemIndex}.answer`} className="font-medium">
                                      Answer {itemIndex + 1} *
                                    </Label>
                                    {itemGroup.list.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const updatedItems = [...values.items]
                                          updatedItems[groupIndex].list = updatedItems[groupIndex].list.filter((_, idx) => idx !== itemIndex)
                                          setFieldValue("items", updatedItems)
                                        }}
                                        disabled={isSubmitting}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                  <Field
                                    as="textarea"
                                    id={`items.${groupIndex}.list.${itemIndex}.answer`}
                                    name={`items.${groupIndex}.list.${itemIndex}.answer`}
                                    rows={3}
                                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                      hasAnswerError(formErrors, groupIndex, itemIndex) 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : ''
                                    }`}
                                    placeholder="Enter the answer here..."
                                  />
                                  <ErrorMessage
                                    name={`items.${groupIndex}.list.${itemIndex}.answer`}
                                    component="div"
                                    className="text-sm text-red-600 mt-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {typeof errors.items === 'string' && (
                          <div className="text-sm text-red-600 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            {errors.items}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="
                      flex-shrink-0 
                      pt-4 
                      border-t 
                      bg-white 
                      dark:bg-gray-900
                      sticky 
                      bottom-0
                      flex justify-end gap-3
                    ">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFaqModalOpen(false)
                          resetFaqForm()
                        }}
                        disabled={isSubmitting}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : isFaqEdit ? "Update FAQ" : "Create FAQ"}
                      </Button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FAQs