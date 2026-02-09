// // app/components/why-choose-us.tsx
// import React from 'react';
// import { CheckCircle, Target, Users, Shield, Zap, Headphones } from 'lucide-react';

// // Define TypeScript interfaces for type safety
// interface FeatureCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   color: 'blue' | 'green' | 'purple' | 'orange';
// }

// interface StatItemProps {
//   value: string;
//   label: string;
// }

// // Main Component
// export default function WhyChooseUs() {
//   // Feature cards data with strict typing
//   const featureCards: FeatureCardProps[] = [
//     {
//       icon: <Target className="w-6 h-6" />,
//       title: "Precision & Excellence",
//       description: "Navigating IT solutions with meticulous attention to detail and unparagraphlleled quality standards.",
//       color: 'blue'
//     },
//     {
//       icon: <Shield className="w-6 h-6" />,
//       title: "Expert Care",
//       description: "Resolving your technology woes with specialized knowledge and dedicated support.",
//       color: 'green'
//     },
//     {
//       icon: <Zap className="w-6 h-6" />,
//       title: "Reliable Solutions",
//       description: "Providing dependable IT services that keep your operations running smoothly.",
//       color: 'purple'
//     },
//     {
//       icon: <Headphones className="w-6 h-6" />,
//       title: "24/7 Support",
//       description: "Round-the-clock assistance to address your technical issues anytime.",
//       color: 'orange'
//     }
//   ];

//   // Statistics data
//   const stats: StatItemProps[] = [
//     { value: "99.9%", label: "Uptime Guarantee" },
//     { value: "500+", label: "Clients Served" },
//     { value: "24/7", label: "Support Availability" },
//     { value: "15+", label: "Years Experience" }
//   ];

//   // Color mapping for consistent styling

//   return (
//    <div className="w-full space-y-6 bg-[hsl(var(--color-background))]
//     dark:bg-[hsl(var(--color-background))] ">
//       <div className="w-full">
//         {/* Header Section */}
//         <div className="mb-12 text-center">
//           <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
//             <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
//             WHY CHOOSE US
//           </h1>
//           <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
//             Why Our Technology Solutions Company Stands Out?
//                   </p>
//                    <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 We&apos;re resolving your technology woes with expert care, ensuring your business operates at peak efficiency with minimal downtime.
//               </p>
//           <div className="h-1 w-24 bg-[var(--color-theme)] mx-auto rounded-full"></div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-12">
//           {/* Left Column - Features */}
//           <div className="space-y-6">
//             <div className="bg-white bg-[hsl(var(--color-background))]
//     dark:bg-[hsl(var(--color-background))] rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
//               <div className="grid grid-cols-1 md:grid-cols-1 gap-1 mb-2">
                          
//                           <div className='flex justify-center items-center'>
//                           <div>
//                               <img src="/assets/images/about/about-1-1.png" alt="adas"  className=' h-[300px] rounded-[12px] '/>
//                           </div>
                              
             
//                               </div>
//                               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {featureCards.map((feature, index) => (
//                   <div
//                     key={index}
//                     className={`p-4 rounded-xl border bg-[var(--color-theme)] transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}
//                   >
//                     <div className="flex items-start space-x-3">
//                       <div className="mt-1">
//                         {feature.icon}
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
//                         <p className="text-sm opacity-90">{feature.description}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Stats Section */}
//             <div className="bg-[hsl(var(--color-background))]
//     dark:bg-[hsl(var(--color-background))] border-1 rounded-2xl shadow-lg p-6 text-white">
//               <h3 className="text-xl text-gray-600 dark:text-gray-400 font-bold mb-6 text-gray-300 dark:text-white text-center">Our Impact in Numbers</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {stats.map((stat, index) => (
//                   <div key={index} className="text-center">
//                     <div className="text-3xl font-bold text-gray-600 dark:text-gray-300" >{stat.value}</div>
//                     <div className="text-sm opacity-90 text-gray-600 dark:text-gray-300">{stat.label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

          
//         </div>

//         {/* Footer Note */}
        
//       </div>
//     </div>
//   );
// }



// app/components/why-choose-us-section.tsx
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
// import { Plus, Trash, Pen, X, Loader2 } from "lucide-react"

// // Constants - Use environment variables in production
// const BUCKET_NAME = process.env.NEXT_PUBLIC_WHY_CHOOSE_US_BUCKET || "why_choose_us"
// const STORAGE_TYPE: 'bucket' | 'base64' = "bucket"
// const CHUNK_SIZE = 60000
// const DELIMITER = '|||CHUNK|||'
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024

// // Strict Type Definitions
// type StorageType = 'bucket' | 'base64'

// interface Feature {
//   icon: string
//   title: string
//   paragraph: string
// }

// interface DatabaseWhyChooseUs {
//   id: string
//   title: string
//   paragraph: string
//   images: string | null
//   heading: string
//   banner_buttun: string
//   features: Feature[] | null
//   created_at?: string
// }

// interface WhyChooseUs {
//   id: string
//   title: string
//   paragraph: string
//   images: string | null
//   heading: string
//   banner_buttun: string
//   features: Feature[]
//   imageUrl: string | null
// }

// interface WhyChooseUsFormValues {
//   title: string
//   paragraph: string
//   heading: string
//   banner_buttun: string
//   features: Feature[]
// }

// interface WhyChooseUsFormData {
//   title: string
//   paragraph: string
//   heading: string
//   banner_buttun: string
//   features: Feature[]
//   image: File | null
// }

// interface UpdateWhyChooseUsData {
//   title: string
//   paragraph: string
//   images: string | null
//   heading: string
//   banner_buttun: string
//   features: Feature[]
// }

// interface FeatureColors {
//   blue: string
//   green: string
//   purple: string
//   orange: string
// }

// interface ImagePreview {
//   url: string
//   type: 'new' | 'existing'
// }

// // Define proper error types for Formik
// interface FeatureError {
//   icon?: string
//   title?: string
//   paragraph?: string
// }

// interface FormikErrorType {
//   title?: string
//   paragraph?: string
//   heading?: string
//   banner_buttun?: string
//   features?: string | FeatureError[]
// }

// const WhyChooseUsSection: FC = () => {
//   // State with strict typing
//   const [sections, setSections] = useState<WhyChooseUs[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [isEdit, setIsEdit] = useState<boolean>(false)
//   const [editId, setEditId] = useState<string | null>(null)
//   const [open, setOpen] = useState<boolean>(false)
//   const [submitting, setSubmitting] = useState<boolean>(false)
//   const [previewImage, setPreviewImage] = useState<ImagePreview | null>(null)
//   const [fetchError, setFetchError] = useState<string | null>(null)
  
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   // Use useEffect to set initial form data only on client
//   const [formData, setFormData] = useState<WhyChooseUsFormData | null>(null)

//   // Initialize form data only on client
//   useEffect(() => {
//     setFormData({
//       title: "",
//       paragraph: "",
//       heading: "",
//       banner_buttun: "",
//       features: [
//         { icon: "", title: "", paragraph: "" },
//         { icon: "", title: "", paragraph: "" }
//       ],
//       image: null
//     })
//   }, [])

//   // Validation Schema with strict typing
//   const validationSchema = Yup.object().shape({
//     title: Yup.string()
//       .min(2, 'Title must be at least 2 characters')
//       .required('Title is required'),
//     paragraph: Yup.string()
//       .min(10, 'Description must be at least 10 characters')
//       .required('Description is required'),
//     heading: Yup.string()
//       .min(2, 'Banner heading is required')
//       .required('Banner heading is required'),
//     banner_buttun: Yup.string()
//       .min(2, 'Banner button text is required')
//       .required('Banner button text is required'),
//     features: Yup.array().of(
//       Yup.object().shape({
//         icon: Yup.string()
//           .min(2, 'Icon class is required')
//           .required('Icon is required'),
//         title: Yup.string()
//           .min(2, 'Feature title is required')
//           .required('Title is required'),
//         paragraph: Yup.string()
//           .min(10, 'Feature description must be at least 10 characters')
//           .required('Description is required')
//       })
//     ).min(1, 'At least one feature is required').required('Features are required')
//   })

//   // Initial Form Values - only when formData is available
//   const initialValues: WhyChooseUsFormValues = formData ? {
//     title: formData.title,
//     paragraph: formData.paragraph,
//     heading: formData.heading,
//     banner_buttun: formData.banner_buttun,
//     features: formData.features
//   } : {
//     title: "",
//     paragraph: "",
//     heading: "",
//     banner_buttun: "",
//     features: []
//   }

//   // Reset Form
//   const resetForm = (): void => {
//     if (formData) {
//       setFormData({
//         ...formData,
//         title: "",
//         paragraph: "",
//         heading: "",
//         banner_buttun: "",
//         features: [
//           { icon: "", title: "", paragraph: "" },
//           { icon: "", title: "", paragraph: "" }
//         ],
//         image: null
//       })
//     }
//     setEditId(null)
//     setPreviewImage(null)
//     setIsEdit(false)
//     setSubmitting(false)
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   // Fetch Sections with proper error handling
//   const fetchSections = useCallback(async (): Promise<void> => {
//     try {
//       setLoading(true)
//       setFetchError(null)
      
//       // Check if supabase client is initialized
//       if (!supabase) {
//         throw new Error('Supabase client not initialized')
//       }

//       const { data, error } = await supabase
//         .from(`${TableName}`)
//         .select("*")
//         .order("created_at", { ascending: true })

//       if (error) {
//         console.error("Error fetching sections:", error)
//         setFetchError(error.message || 'Failed to fetch data')
//         return
//       }

//       console.log("Fetched data:", data)

//       const processedSections: WhyChooseUs[] = (data || []).map(convertToWhyChooseUs)
//       setSections(processedSections)
//     } catch (error) {
//       console.error("Unexpected error:", error)
//       setFetchError(error instanceof Error ? error.message : 'Unknown error occurred')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchSections()
//   }, [fetchSections])

//   // Base64 Chunking Functions
//   const splitIntoChunks = (base64String: string): string => {
//     if (base64String.length <= CHUNK_SIZE) {
//       return base64String
//     }

//     const chunks: string[] = []
//     for (let i = 0; i < base64String.length; i += CHUNK_SIZE) {
//       chunks.push(base64String.slice(i, i + CHUNK_SIZE))
//     }
//     return chunks.join(DELIMITER)
//   }

//   const reconstructFromChunks = (chunkedString: string | null): string | null => {
//     if (!chunkedString) return null

//     if (!chunkedString.includes(DELIMITER)) {
//       return chunkedString
//     }

//     return chunkedString.split(DELIMITER).join('')
//   }

//   // Image to Base64 Conversion - Only runs on client
//   const convertImageToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       if (typeof window === 'undefined') {
//         reject(new Error('Image processing only available in browser'))
//         return
//       }

//       if (file.size > MAX_IMAGE_SIZE) {
//         reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`))
//         return
//       }

//       const compressImage = (imageFile: File): Promise<string> => {
//         return new Promise((resolveCompress, rejectCompress) => {
//           const img = new Image()
//           const canvas = document.createElement('canvas')

//           img.onload = (): void => {
//             let width: number = img.width
//             let height: number = img.height

//             const maxDimension: number = 1024
//             if (width > maxDimension || height > maxDimension) {
//               if (width > height) {
//                 height = (height * maxDimension) / width
//                 width = maxDimension
//               } else {
//                 width = (width * maxDimension) / height
//                 height = maxDimension
//               }
//             }

//             canvas.width = width
//             canvas.height = height

//             const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
//             if (!ctx) {
//               rejectCompress(new Error('Could not get canvas context'))
//               return
//             }

//             ctx.fillStyle = 'white'
//             ctx.fillRect(0, 0, width, height)
//             ctx.drawImage(img, 0, 0, width, height)

//             let quality: number = 0.8
//             if (file.size > 2 * 1024 * 1024) quality = 0.6
//             if (file.size > 3 * 1024 * 1024) quality = 0.5

//             const compressedBase64: string = canvas.toDataURL('image/jpeg', quality)
//             resolveCompress(compressedBase64)
//           }

//           img.onerror = (): void => {
//             rejectCompress(new Error('Failed to load image'))
//           }
          
//           img.src = URL.createObjectURL(imageFile)
//         })
//       }

//       const processImage = async (): Promise<string> => {
//         try {
//           if (file.size > 500 * 1024) {
//             return await compressImage(file)
//           } else {
//             return new Promise<string>((resolveNormal, rejectNormal) => {
//               const reader = new FileReader()
//               reader.readAsDataURL(file)
//               reader.onload = (): void => {
//                 if (typeof reader.result === 'string') {
//                   resolveNormal(reader.result)
//                 } else {
//                   rejectNormal(new Error('Failed to read file as data URL'))
//                 }
//               }
//               reader.onerror = (): void => {
//                 rejectNormal(new Error('FileReader error'))
//               }
//             })
//           }
//         } catch {
//           return new Promise<string>((resolveFallback, rejectFallback) => {
//             const reader = new FileReader()
//             reader.readAsDataURL(file)
//             reader.onload = (): void => {
//               if (typeof reader.result === 'string') {
//                 resolveFallback(reader.result)
//               } else {
//                 rejectFallback(new Error('Failed to read file as data URL'))
//               }
//             }
//             reader.onerror = (): void => {
//               rejectFallback(new Error('FileReader error'))
//             }
//           })
//         }
//       }

//       processImage()
//         .then(resolve)
//         .catch(reject)
//     })
//   }

//   // Convert Database to Component Type
//   const convertToWhyChooseUs = (dbSection: DatabaseWhyChooseUs): WhyChooseUs => {
//     if (STORAGE_TYPE === "bucket") {
//       return {
//         id: dbSection.id,
//         title: dbSection.title || "",
//         paragraph: dbSection.paragraph || "",
//         images: null,
//         heading: dbSection.heading || "",
//         banner_buttun: dbSection.banner_buttun || "",
//         features: dbSection.features || [],
//         imageUrl: dbSection.images
//       }
//     } else {
//       return {
//         id: dbSection.id,
//         title: dbSection.title || "",
//         paragraph: dbSection.paragraph || "",
//         images: reconstructFromChunks(dbSection.images),
//         heading: dbSection.heading || "",
//         banner_buttun: dbSection.banner_buttun || "",
//         features: dbSection.features || [],
//         imageUrl: null
//       }
//     }
//   }

//   // Handle Edit
//   const handleEdit = (section: WhyChooseUs): void => {
//     setIsEdit(true)
//     setEditId(section.id)
    
//     if (formData) {
//       setFormData({
//         ...formData,
//         title: section.title,
//         paragraph: section.paragraph,
//         heading: section.heading,
//         banner_buttun: section.banner_buttun,
//         features: section.features.length > 0 ? section.features : [
//           { icon: "", title: "", paragraph: "" },
//           { icon: "", title: "", paragraph: "" }
//         ],
//         image: null
//       })
//     }
    
//     // Set preview image based on storage type
//     const imageUrl: string | null = STORAGE_TYPE === "bucket" ? section.imageUrl : section.images
//     if (imageUrl) {
//       setPreviewImage({
//         url: imageUrl,
//         type: 'existing'
//       })
//     }
    
//     setOpen(true)
//   }

//   // Generate File Name for Bucket Storage
//   const generateFileName = (sectionId: string, file: File): string => {
//     const timestamp: number = Date.now()
//     const extension: string = file.name.split('.').pop() || 'jpg'
//     return `why_choose_us_${sectionId}_${timestamp}.${extension}`
//   }

//   // Upload to Bucket
//   const uploadToBucket = async (file: File, sectionId: string): Promise<string> => {
//     try {
//       const fileName: string = generateFileName(sectionId, file)
      
//       const { error } = await supabase.storage
//         .from(BUCKET_NAME)
//         .upload(fileName, file, {
//           cacheControl: '3600',
//           upsert: true
//         })

//       if (error) {
//         console.error("Error uploading to bucket:", error)
//         throw error
//       }

//       const { data: { publicUrl } } = supabase.storage
//         .from(BUCKET_NAME)
//         .getPublicUrl(fileName)

//       return publicUrl
//     } catch (error) {
//       console.error("Upload failed:", error)
//       throw error
//     }
//   }

//   // Delete from Bucket
//   const deleteFromBucket = async (imageUrl: string | null): Promise<void> => {
//     try {
//       if (!imageUrl) return
      
//       const fileName: string | undefined = imageUrl.split('/').pop()
//       if (!fileName) return

//       const { error } = await supabase.storage
//         .from(BUCKET_NAME)
//         .remove([fileName])

//       if (error) {
//         console.error("Error deleting from bucket:", error)
//       }
//     } catch (error) {
//       console.error("Delete from bucket failed:", error)
//     }
//   }

//   // Handle Image Change
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     const file: File | undefined = e.target.files?.[0]
    
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         alert('Please select an image file')
//         return
//       }

//       if (file.size > MAX_IMAGE_SIZE) {
//         alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`)
//         return
//       }

//       if (formData) {
//         setFormData({
//           ...formData,
//           image: file
//         })
//       }
//       const previewUrl: string = URL.createObjectURL(file)
//       setPreviewImage({
//         url: previewUrl,
//         type: 'new'
//       })
//     }
//   }

//   // Handle Remove Image
//   const handleRemoveImage = (): void => {
//     if (formData) {
//       setFormData({
//         ...formData,
//         image: null
//       })
//     }
    
//     // Revoke object URL if it's a new image
//     if (previewImage?.type === 'new') {
//       URL.revokeObjectURL(previewImage.url)
//     }
    
//     setPreviewImage(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   // Cleanup preview URL
//   useEffect(() => {
//     return (): void => {
//       if (previewImage?.type === 'new') {
//         URL.revokeObjectURL(previewImage.url)
//       }
//     }
//   }, [previewImage])

//   // Handle Submit (Create)
//   const handleSubmit = async (
//     values: WhyChooseUsFormValues,
//     formikHelpers: FormikHelpers<WhyChooseUsFormValues>
//   ): Promise<void> => {
//     if (submitting || !formData) return

//     try {
//       setSubmitting(true)

//       let imageData: string | null = null

//       // Process image based on storage type
//       if (formData.image) {
//         if (STORAGE_TYPE === "bucket") {
//           // Will upload after section creation to get ID
//         } else {
//           // Convert to Base64 and chunk
//           try {
//             const base64Image: string = await convertImageToBase64(formData.image)
//             imageData = splitIntoChunks(base64Image)
//           } catch (convertError) {
//             console.error("Base64 conversion failed:", convertError)
//           }
//         }
//       }

//       // First create section
//       const { data: sectionData, error: sectionError } = await supabase
//         .from("why-choose-us")
//         .insert([
//           {
//             title: values.title,
//             paragraph: values.paragraph,
//             images: STORAGE_TYPE === "bucket" ? null : imageData,
//             heading: values.heading,
//             banner_buttun: values.banner_buttun,
//             features: values.features
//           }
//         ])
//         .select()
//         .single()

//       if (sectionError) {
//         console.error("Error adding section:", sectionError)
//         alert(`Error: ${sectionError.message}`)
//         return
//       }

//       // For bucket storage, upload image after getting section ID
//       if (STORAGE_TYPE === "bucket" && formData.image) {
//         let imageUrl: string | null = null

//         try {
//           imageUrl = await uploadToBucket(formData.image, sectionData.id)
//         } catch (error) {
//           console.error("Failed to upload image:", error)
//         }

//         // Update section with image URL
//         if (imageUrl) {
//           const { error: updateError } = await supabase
//             .from("why-choose-us")
//             .update({ 
//               images: imageUrl
//             })
//             .eq("id", sectionData.id)

//           if (updateError) {
//             console.error("Error updating section with image:", updateError)
//           }
//         }

//         // Update image data for response
//         imageData = imageUrl
//       }

//       // Create new section object
//       const newSection: WhyChooseUs = {
//         id: sectionData.id,
//         title: sectionData.title || "",
//         paragraph: sectionData.paragraph || "",
//         images: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(imageData),
//         heading: sectionData.heading || "",
//         banner_buttun: sectionData.banner_buttun || "",
//         features: sectionData.features || [],
//         imageUrl: STORAGE_TYPE === "bucket" ? imageData : null
//       }

//       // Update state
//       setSections(prev => {
//         const exists: boolean = prev.some(s => s.id === newSection.id)
//         if (exists) {
//           return prev.map(s => s.id === newSection.id ? newSection : s)
//         }
//         return [...prev, newSection]
//       })

//       resetForm()
//       formikHelpers.resetForm()
//       setOpen(false)
//       fetchSections()
//     } catch (error) {
//       console.error("Error saving section:", error)
//       if (error instanceof Error) {
//         alert(`Error: ${error.message}`)
//       } else {
//         alert("Error saving section")
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Handle Update
//   const handleUpdate = async (
//     values: WhyChooseUsFormValues,
//     formikHelpers: FormikHelpers<WhyChooseUsFormValues>
//   ): Promise<void> => {
//     if (!editId || submitting || !formData) return

//     try {
//       setSubmitting(true)

//       // Get existing section data
//       const existingSection: WhyChooseUs | undefined = sections.find(s => s.id === editId)
//       let imageData: string | null = null
      
//       if (existingSection) {
//         imageData = STORAGE_TYPE === "bucket" 
//           ? existingSection.imageUrl 
//           : existingSection.images
//       }

//       // Handle image updates
//       if (formData.image) {
//         if (STORAGE_TYPE === "bucket") {
//           // Delete old image if exists
//           if (existingSection?.imageUrl) {
//             await deleteFromBucket(existingSection.imageUrl)
//           }
//           // Upload new image
//           imageData = await uploadToBucket(formData.image, editId)
//         } else {
//           // Convert to Base64 and chunk
//           try {
//             const base64Image: string = await convertImageToBase64(formData.image)
//             imageData = splitIntoChunks(base64Image)
//           } catch (convertError) {
//             console.error("Base64 conversion failed:", convertError)
//             // Keep existing image data
//             imageData = existingSection?.images || null
//           }
//         }
//       } else {
//         // Keep existing image data
//         imageData = existingSection?.images || existingSection?.imageUrl || null
//       }

//       // Update section in database
//       const updateData: UpdateWhyChooseUsData = {
//         title: values.title,
//         paragraph: values.paragraph,
//         images: imageData,
//         heading: values.heading,
//         banner_buttun: values.banner_buttun,
//         features: values.features
//       }

//       const { data, error } = await supabase
//         .from("why-choose-us")
//         .update(updateData)
//         .eq("id", editId)
//         .select()
//         .single()

//       if (error) {
//         console.error("Error updating section:", error)
//         alert(`Error: ${error.message}`)
//         return
//       }

//       // Convert to component type and update state
//       const updatedSection: WhyChooseUs = convertToWhyChooseUs(data)
//       setSections(prev => prev.map(s => s.id === editId ? updatedSection : s))

//       resetForm()
//       formikHelpers.resetForm()
//       setOpen(false)
//       fetchSections()
//     } catch (error) {
//       console.error("Error updating section:", error)
//       if (error instanceof Error) {
//         alert(`Error: ${error.message}`)
//       } else {
//         alert("Error updating section")
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Handle Delete
//   const handleDeleteSection = async (id: string): Promise<void> => {
//     if (!window.confirm("Delete this section?")) return

//     try {
//       // Handle image deletion based on storage type
//       const sectionToDelete: WhyChooseUs | undefined = sections.find(s => s.id === id)
      
//       if (STORAGE_TYPE === "bucket") {
//         // Delete image from bucket
//         if (sectionToDelete?.imageUrl) {
//           await deleteFromBucket(sectionToDelete.imageUrl)
//         }
//       }

//       // Delete from database
//       const { error } = await supabase.from("why-choose-us").delete().eq("id", id)

//       if (error) {
//         console.error("Error deleting section:", error)
//         alert(`Error: ${error.message}`)
//         return
//       }

//       // Update state
//       setSections(prev => prev.filter(s => s.id !== id))
//     } catch (error) {
//       console.error("Error deleting section:", error)
//       alert("Error deleting section. Please try again.")
//     }
//   }

//   // Get image URL helper
//   const getImageUrl = (section: WhyChooseUs): string | null => {
//     return STORAGE_TYPE === "bucket" ? section.imageUrl : section.images
//   }

//   // Get safe image URL - prevent hydration mismatch
//   const getSafeImageUrl = (
//     dynamicSrc: string | null, 
//     fallbackSrc: string
//   ): string => {
//     if (dynamicSrc && dynamicSrc.trim() !== "") {
//       return dynamicSrc
//     }
    
//     return fallbackSrc
//   }

//   // Feature card colors for display
//   const featureColors: FeatureColors = {
//     blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
//     green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
//     purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
//     orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
//   }

//   // Color classes array for rotation
//   const colorClassesArray: string[] = [
//     featureColors.blue,
//     featureColors.green,
//     featureColors.purple,
//     featureColors.orange
//   ]

//   // Type-safe helper to check if errors exist for a specific field
//   const hasError = (
//     errors: FormikErrorType,
//     fieldName: keyof WhyChooseUsFormValues | keyof Feature,
//     index?: number
//   ): boolean => {
//     if (index !== undefined && fieldName !== 'features') {
//       const fieldNameKey = fieldName as keyof Feature
//       const featureErrors = errors.features
//       if (Array.isArray(featureErrors) && featureErrors[index]) {
//         const featureError = featureErrors[index] as FeatureError
//         return !!featureError[fieldNameKey]
//       }
//       return false
//     }
    
//     if (fieldName === 'features') {
//       return !!errors.features && typeof errors.features === 'string'
//     }
    
//     const fieldNameKey = fieldName as keyof WhyChooseUsFormValues
//     return !!errors[fieldNameKey]
//   }

//   // Helper to get feature error message
//   const getFeatureErrorMessage = (
//     errors: FormikErrorType,
//     index: number,
//     fieldName: keyof Feature
//   ): string | undefined => {
//     const featureErrors = errors.features
//     if (Array.isArray(featureErrors) && featureErrors[index]) {
//       const featureError = featureErrors[index] as FeatureError
//       return featureError[fieldName]
//     }
//     return undefined
//   }

//   // Render content based on loading state
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading sections...</p>
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
//       <div className="w-full space-y-6 ">
//         <div className="container mx-auto px-4 py-8">
//           {/* Header with Add Button */}
//           <div className="flex justify-between items-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose Us Sections</h1>
//             <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="w-4 h-4 mr-2" />
//               Add New Section
//             </Button>
//           </div>

//           {/* Error Display */}
//           {fetchError && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-700 font-medium">Error: {fetchError}</p>
//               <Button 
//                 variant="outline" 
//                 size="sm" 
//                 onClick={() => fetchSections()}
//                 className="mt-2"
//               >
//                 Retry
//               </Button>
//             </div>
//           )}

//           {/* Display existing sections or empty state */}
//           {sections.length === 0 ? (
//             <div className="text-center py-12 border-2 border-dashed  rounded-lg ">
//               <div className="w-16 h-16 mx-auto mb-4 rounded-full  flex items-center justify-center">
//                 <Plus className="w-8 h-8 text-gray-400" />
//               </div>
//               <p className="text-gray-500 mb-4">No sections found</p>
//               <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
//                 Create First Section
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-8">
//               {sections.map((section, index) => (
//                 <div key={section.id} className="   overflow-hidden">
//                   <div className="flex justify-between  items-center p-6 ">
//                     <div>
                      
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEdit(section)}
//                         className="border-blue-200 shadow-lg hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30"
//                       >
//                         <Pen className="w-4 h-4 mr-2" />
//                         Edit
//                       </Button>
//                       <Button
//                         variant="outline"

//                                   className='shadow-lg text-black dark:text-white'
//                         size="sm"
//                         onClick={() => handleDeleteSection(section.id)}
//                       >
//                         <Trash className="w-4 h-4 mr-2" />
//                         Delete
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Main Content */}
//                   <div className="rounded-[20px] 
//     bg-gradient-to-br 
//     from-[hsl(var(--color-background))] 
//     to-[hsl(var(--color-background)/0.95)]
//     dark:from-[hsl(var(--color-background-dark))] 
//     dark:to-[hsl(var(--color-background-dark)/0.95)]
//     shadow-lg 
//     shadow-[hsl(var(--color-shadow)/0.1)]
//     border-2 
//     border-[hsl(var(--color-border)/0.8)] p-5">
//                     {/* Header Section */}
//                     <div className="mb-8 text-center">
//                       <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
//                         <div className="w-6 h-6 text-blue-600 dark:text-blue-400">✓</div>
//                       </div>
//                       <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//                         {section.title}
//                       </h1>
//                       <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
//                         {section.heading}
//                       </p>
//                       <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-3xl mx-auto">
//                         {section.paragraph}
//                       </p>
//                       <div className="h-1 w-24 bg-[var(--color-theme)] mx-auto rounded-full"></div>
//                     </div>

//                     {/* Image Display */}
//                     {(section.imageUrl || section.images) && (
//                       <div className="mb-8 flex justify-center">
//                         <div className="relative w-full max-w-2xl">
//                           <img 
//                             src={getSafeImageUrl(
//                               getImageUrl(section), 
//                               "/assets/images/placeholder.jpg"
//                             )} 
//                             alt={section.title} 
//                             className="rounded-lg object-cover w-full h-64 md:h-80"
//                             loading="lazy"
//                           />
//                         </div>
//                       </div>
//                     )}

//                     {/* Features Grid */}
//                     <div className="mb-8">
//                       <h3 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">Features</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {section.features.map((feature, idx) => (
//                           <div 
//                             key={idx}
//                             className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-[var(--color-theme)]`}
//                           >
//                             <div className="flex items-start space-x-4">
//                               <div className="mt-1 flex-shrink-0">
//                                 <div 
//                                   dangerouslySetInnerHTML={{
//                                     __html: `<i class="${feature.icon} text-2xl"></i>`
//                                   }}
//                                   className="flex items-center justify-center"
//                                 />
//                               </div>
//                               <div className="flex-1">
//                                 <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
//                                 <p className="text-gray-600 dark:text-gray-300">{feature.paragraph}</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Banner Section */}
//                   </div>
//                     <div className="rounded-[20px] 
//     bg-gradient-to-br 
//     from-[hsl(var(--color-background))] 
//     to-[hsl(var(--color-background)/0.95)]
//     dark:from-[hsl(var(--color-background-dark))] 
//     dark:to-[hsl(var(--color-background-dark)/0.95)]
//     shadow-lg 
//     shadow-[hsl(var(--color-shadow)/0.1)]
//     border-2 
//     border-[hsl(var(--color-border)/0.8)]  p-6 text-white p-8 mt-3">
//                       <div className="text-center">
//                         <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//                           {section.heading}
//                         </h3>
//                         <p className="text-gray-600 dark:text-gray-300 mb-6">
//                           Ready to experience our exceptional service?
//                         </p>
//                         <button className="bg-[var(--color-theme)] hover:bg-[var(--color-theme-hover)] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
//                           {section.banner_buttun}
//                         </button>
//                       </div>
//                     </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Dialog for Create/Edit */}
//       {open && (
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//             <DialogHeader className="flex-shrink-0">
//               <DialogTitle className="text-2xl font-bold">
//                 {isEdit ? "Edit Why Choose Us Section" : "Create Why Choose Us Section"}
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
//                 }: FormikProps<WhyChooseUsFormValues>) => {
//                   // Cast errors to our custom type
//                   const formikErrors: FormikErrorType = errors as unknown as FormikErrorType
                  
//                   return (
//                     <Form id="whyChooseUsForm" className="space-y-6 pb-4">
//                       {/* Main Content */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* Left Column */}
//                         <div className="space-y-4">
//                           <div>
//                             <Label htmlFor="title" className="mb-2 block font-medium">
//                               Title *
//                             </Label>
//                             <Field
//                               as={Input}
//                               id="title"
//                               name="title"
//                               placeholder="WHY CHOOSE US"
//                               className={`${hasError(formikErrors, 'title') && touched.title ? 'border-red-500 focus:ring-red-500' : ''}`}
//                             />
//                             <ErrorMessage
//                               name="title"
//                               component="div"
//                               className="text-sm text-red-600 mt-1"
//                             />
//                           </div>

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
//                               placeholder="We're resolving your technology woes with expert care..."
//                             />
//                             <ErrorMessage
//                               name="paragraph"
//                               component="div"
//                               className="text-sm text-red-600 mt-1"
//                             />
//                           </div>
//                         </div>

//                         {/* Right Column */}
//                         <div className="space-y-4">
//                           <div>
//                             <Label htmlFor="heading" className="mb-2 block font-medium">
//                               Banner Heading *
//                             </Label>
//                             <Field
//                               as={Input}
//                               id="heading"
//                               name="heading"
//                               placeholder="Why Our Technology Solutions Company Stands Out?"
//                               className={`${hasError(formikErrors, 'heading') && touched.heading ? 'border-red-500 focus:ring-red-500' : ''}`}
//                             />
//                             <ErrorMessage
//                               name="heading"
//                               component="div"
//                               className="text-sm text-red-600 mt-1"
//                             />
//                           </div>

//                           <div>
//                             <Label htmlFor="banner_buttun" className="mb-2 block font-medium">
//                               Banner Button Text *
//                             </Label>
//                             <Field
//                               as={Input}
//                               id="banner_buttun"
//                               name="banner_buttun"
//                               placeholder="Get Started"
//                               className={`${hasError(formikErrors, 'banner_buttun') && touched.banner_buttun ? 'border-red-500 focus:ring-red-500' : ''}`}
//                             />
//                             <ErrorMessage
//                               name="banner_buttun"
//                               component="div"
//                               className="text-sm text-red-600 mt-1"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Image Upload Section */}
//                       <div className="border-t pt-6">
//                         <h3 className="font-semibold text-lg mb-4">Main Image</h3>
//                         <div className="space-y-3">
//                           <div className="
//                             border-2 border-dashed border-gray-300 dark:border-gray-700
//                             rounded-lg p-4 
//                             hover:border-gray-400 dark:hover:border-gray-600
//                             transition-colors
//                           ">
//                             <input
//                               type="file"
//                               ref={fileInputRef}
//                               onChange={handleImageChange}
//                               accept="image/*"
//                               className="hidden"
//                               disabled={submitting}
//                               id="image-upload"
//                             />
                            
//                             {previewImage ? (
//                               <div className="text-center space-y-3">
//                                 <img
//                                   src={previewImage.url}
//                                   alt="Preview"
//                                   className="mx-auto max-h-48 rounded-lg object-contain"
//                                 />
//                                 <div className="flex gap-2 justify-center">
//                                   <Button
//                                     type="button"
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => fileInputRef.current?.click()}
//                                     disabled={submitting}
//                                   >
//                                     Change Image
//                                   </Button>
//                                   <Button
//                                     type="button"
//                                     variant="destructive"
//                                     size="sm"
//                                     onClick={handleRemoveImage}
//                                     disabled={submitting}
//                                   >
//                                     Remove
//                                   </Button>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="text-center">
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   onClick={() => fileInputRef.current?.click()}
//                                   className="w-full py-8 border-dashed"
//                                   disabled={submitting}
//                                 >
//                                   <div className="flex flex-col items-center gap-2">
//                                     <svg 
//                                       xmlns="http://www.w3.org/2000/svg" 
//                                       width="24" 
//                                       height="24" 
//                                       viewBox="0 0 24 24" 
//                                       fill="none" 
//                                       stroke="currentColor" 
//                                       strokeWidth="2" 
//                                       className="text-gray-400"
//                                     >
//                                       <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
//                                       <line x1="16" x2="22" y1="5" y2="5"/>
//                                       <line x1="19" x2="19" y1="2" y2="8"/>
//                                       <circle cx="9" cy="9" r="2"/>
//                                       <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
//                                     </svg>
//                                     <span className="font-medium">Upload Main Image</span>
//                                     <span className="text-xs text-gray-500">Max 5MB</span>
//                                   </div>
//                                 </Button>
//                               </div>
//                             )}
                            
//                             {isEdit && !previewImage && (
//                               <div className="mt-2 text-center text-xs text-gray-500">
//                                 Leave empty to keep existing image
//                               </div>
//                             )}
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             {STORAGE_TYPE === "bucket" 
//                               ? "Stored in secure cloud storage bucket."
//                               : "Automatically compressed and stored in database."
//                             }
//                           </div>
//                         </div>
//                       </div>

//                       {/* Features Section with FieldArray */}
//                       <div className="border-t pt-6">
//                         <div className="flex justify-between items-center mb-4">
//                           <h3 className="font-semibold text-lg">Features *</h3>
//                           <FieldArray name="features">
//                             {({ push }: FieldArrayRenderProps) => (
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => push({ icon: "", title: "", paragraph: "" })}
//                                 disabled={submitting}
//                               >
//                                 <Plus className="w-4 h-4 mr-2" />
//                                 Add Feature
//                               </Button>
//                             )}
//                           </FieldArray>
//                         </div>
                        
//                         <FieldArray name="features">
//                           {({ push, remove }: FieldArrayRenderProps) => (
//                             <div className="space-y-4">
//                               {values.features.map((feature, index) => (
//                                 <div key={index} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
//                                   <div className="flex justify-between items-center mb-4">
//                                     <h4 className="font-medium text-gray-900 dark:text-white">Feature {index + 1}</h4>
//                                     {values.features.length > 1 && (
//                                       <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => remove(index)}
//                                         disabled={submitting}
//                                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                       >
//                                         <X className="w-4 h-4" />
//                                       </Button>
//                                     )}
//                                   </div>
                                  
//                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                     <div>
//                                       <Label htmlFor={`features.${index}.icon`} className="mb-2 block font-medium">
//                                         Icon Class (Font Awesome) *
//                                       </Label>
//                                       <Field
//                                         as={Input}
//                                         id={`features.${index}.icon`}
//                                         name={`features.${index}.icon`}
//                                         placeholder="fas fa-check"
//                                         className={`${getFeatureErrorMessage(formikErrors, index, 'icon') ? 'border-red-500 focus:ring-red-500' : ''}`}
//                                       />
//                                       <ErrorMessage
//                                         name={`features.${index}.icon`}
//                                         component="div"
//                                         className="text-sm text-red-600 mt-1"
//                                       />
//                                       <div className="text-xs text-gray-500 mt-1">
//                                         Example: fas fa-check, fab fa-react
//                                       </div>
//                                     </div>
                                    
//                                     <div>
//                                       <Label htmlFor={`features.${index}.title`} className="mb-2 block font-medium">
//                                         Title *
//                                       </Label>
//                                       <Field
//                                         as={Input}
//                                         id={`features.${index}.title`}
//                                         name={`features.${index}.title`}
//                                         placeholder="Precision & Excellence"
//                                         className={`${getFeatureErrorMessage(formikErrors, index, 'title') ? 'border-red-500 focus:ring-red-500' : ''}`}
//                                       />
//                                       <ErrorMessage
//                                         name={`features.${index}.title`}
//                                         component="div"
//                                         className="text-sm text-red-600 mt-1"
//                                       />
//                                     </div>
                                    
//                                     <div>
//                                       <Label htmlFor={`features.${index}.paragraph`} className="mb-2 block font-medium">
//                                         Description *
//                                       </Label>
//                                       <Field
//                                         as="textarea"
//                                         id={`features.${index}.paragraph`}
//                                         name={`features.${index}.paragraph`}
//                                         rows={3}
//                                         className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                           getFeatureErrorMessage(formikErrors, index, 'paragraph') 
//                                             ? 'border-red-500 focus:ring-red-500' 
//                                             : ''
//                                         }`}
//                                         placeholder="Navigating IT solutions with meticulous attention..."
//                                       />
//                                       <ErrorMessage
//                                         name={`features.${index}.paragraph`}
//                                         component="div"
//                                         className="text-sm text-red-600 mt-1"
//                                       />
//                                     </div>
//                                   </div>
                                  
//                                   {/* Icon Preview */}
//                                   <div className="mt-3 flex items-center gap-2">
//                                     <span className="text-sm text-gray-500">Icon Preview:</span>
//                                     <div 
//                                       dangerouslySetInnerHTML={{
//                                         __html: `<i class="${feature.icon || 'fas fa-question'} text-lg"></i>`
//                                       }}
//                                       className="flex items-center justify-center"
//                                     />
//                                     <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
//                                       {feature.icon || 'No icon selected'}
//                                     </span>
//                                   </div>
//                                 </div>
//                               ))}
                              
//                               {typeof errors.features === 'string' && (
//                                 <div className="text-sm text-red-600 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
//                                   {errors.features}
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
//                           form="whyChooseUsForm"
//                           disabled={submitting || !isValid}
//                           className="bg-blue-600 hover:bg-blue-700"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                               Saving...
//                             </>
//                           ) : isEdit ? "Update Section" : "Create Section"}
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

// export default WhyChooseUsSection








'use client'

import { FC, useCallback, useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { supabase } from "@/lib/supabase-client"
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikProps, FieldArray, FieldArrayRenderProps } from 'formik'
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
import { Plus, Trash, Pen, X, Loader2 } from "lucide-react"

// Constants - Use environment variables in production
const BUCKET_NAME = process.env.NEXT_PUBLIC_WHY_CHOOSE_US_BUCKET || "why_choose_us"
const STORAGE_TYPE: 'bucket' | 'base64' = "bucket"
const CHUNK_SIZE = 60000
const DELIMITER = '|||CHUNK|||'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const TableName="why_choose_us"

// Strict Type Definitions - sub_heading ADDED HERE
type StorageType = 'bucket' | 'base64'

interface Feature {
  icon: string
  // title: string
  paragraph: string
}

interface DatabaseWhyChooseUs {
  id: string
  title: string
  paragraph: string
  sub_heading: string // NEW FIELD ADDED
  images: string | null
  heading: string
  banner_buttun: string
  features: Feature[] | null
  created_at?: string
}

interface WhyChooseUs {
  id: string
  title: string
  paragraph: string
  sub_heading: string // NEW FIELD ADDED
  images: string | null
  heading: string
  banner_buttun: string
  features: Feature[]
  imageUrl: string | null
}

interface WhyChooseUsFormValues {
  title: string
  paragraph: string
  sub_heading: string // NEW FIELD ADDED
  heading: string
  banner_buttun: string
  features: Feature[]
}

interface WhyChooseUsFormData {
  title: string
  paragraph: string
  sub_heading: string // NEW FIELD ADDED
  heading: string
  banner_buttun: string
  features: Feature[]
  image: File | null
}

interface UpdateWhyChooseUsData {
  title: string
  paragraph: string
  sub_heading: string // NEW FIELD ADDED
  images: string | null
  heading: string
  banner_buttun: string
  features: Feature[]
}

interface FeatureColors {
  blue: string
  green: string
  purple: string
  orange: string
}

interface ImagePreview {
  url: string
  type: 'new' | 'existing'
}

// Define proper error types for Formik
interface FeatureError {
  icon?: string
  // title?: string
  paragraph?: string
}

interface FormikErrorType {
  title?: string
  paragraph?: string
  sub_heading?: string // NEW FIELD ADDED
  heading?: string
  banner_buttun?: string
  features?: string | FeatureError[]
}

const WhyChooseUsSection: FC = () => {
  // State with strict typing
  const [sections, setSections] = useState<WhyChooseUs[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<ImagePreview | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use useEffect to set initial form data only on client
  const [formData, setFormData] = useState<WhyChooseUsFormData | null>(null)

  // Initialize form data only on client
  useEffect(() => {
    setFormData({
      title: "",
      paragraph: "",
      sub_heading: "", // NEW FIELD INITIALIZED
      heading: "",
      banner_buttun: "",
      features: [
        { icon: "",  paragraph: "" },
        { icon: "",  paragraph: "" }
      ],
      image: null
    })
  }, [])

  // Validation Schema with strict typing - sub_heading VALIDATION ADDED
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .required('Title is required'),
    paragraph: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
    sub_heading: Yup.string() // NEW VALIDATION ADDED
      .min(2, 'Sub-heading must be at least 2 characters')
      .required('Sub-heading is required'),
    heading: Yup.string()
      .min(2, 'Banner heading is required')
      .required('Banner heading is required'),
    banner_buttun: Yup.string()
      .min(2, 'Banner button text is required')
      .required('Banner button text is required'),
    features: Yup.array().of(
      Yup.object().shape({
        icon: Yup.string()
          .min(2, 'Icon class is required')
          .required('Icon is required'),
        // title: Yup.string()
        //   .min(2, 'Feature title is required')
        //   .required('Title is required'),
        paragraph: Yup.string()
          .min(10, 'Feature description must be at least 10 characters')
          .required('Description is required')
      })
    ).min(1, 'At least one feature is required').required('Features are required')
  })

  // Initial Form Values - only when formData is available
  const initialValues: WhyChooseUsFormValues = formData ? {
    title: formData.title,
    paragraph: formData.paragraph,
    sub_heading: formData.sub_heading, // NEW FIELD ADDED
    heading: formData.heading,
    banner_buttun: formData.banner_buttun,
    features: formData.features
  } : {
    title: "",
    paragraph: "",
    sub_heading: "", // NEW FIELD ADDED
    heading: "",
    banner_buttun: "",
    features: []
  }

  // Reset Form
  const resetForm = (): void => {
    if (formData) {
      setFormData({
        ...formData,
        title: "",
        paragraph: "",
        sub_heading: "", // NEW FIELD RESET
        heading: "",
        banner_buttun: "",
        features: [
          { icon: "",  paragraph: "" },
          { icon: "",  paragraph: "" }
        ],
        image: null
      })
    }
    setEditId(null)
    setPreviewImage(null)
    setIsEdit(false)
    setSubmitting(false)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Fetch Sections with proper error handling
  const fetchSections = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setFetchError(null)
      
      // Check if supabase client is initialized
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from(`${TableName}`)
        .select("*")
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching sections:", error)
        setFetchError(error.message || 'Failed to fetch data')
        return
      }

      console.log("Fetched data:", data)

      const processedSections: WhyChooseUs[] = (data || []).map(convertToWhyChooseUs)
      setSections(processedSections)
    } catch (error) {
      console.error("Unexpected error:", error)
      setFetchError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  // Base64 Chunking Functions
  const splitIntoChunks = (base64String: string): string => {
    if (base64String.length <= CHUNK_SIZE) {
      return base64String
    }

    const chunks: string[] = []
    for (let i = 0; i < base64String.length; i += CHUNK_SIZE) {
      chunks.push(base64String.slice(i, i + CHUNK_SIZE))
    }
    return chunks.join(DELIMITER)
  }

  const reconstructFromChunks = (chunkedString: string | null): string | null => {
    if (!chunkedString) return null

    if (!chunkedString.includes(DELIMITER)) {
      return chunkedString
    }

    return chunkedString.split(DELIMITER).join('')
  }

  // Image to Base64 Conversion - Only runs on client
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Image processing only available in browser'))
        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`))
        return
      }

      const compressImage = (imageFile: File): Promise<string> => {
        return new Promise((resolveCompress, rejectCompress) => {
          const img = new Image()
          const canvas = document.createElement('canvas')

          img.onload = (): void => {
            let width: number = img.width
            let height: number = img.height

            const maxDimension: number = 1024
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = (height * maxDimension) / width
                width = maxDimension
              } else {
                width = (width * maxDimension) / height
                height = maxDimension
              }
            }

            canvas.width = width
            canvas.height = height

            const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
            if (!ctx) {
              rejectCompress(new Error('Could not get canvas context'))
              return
            }

            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, width, height)
            ctx.drawImage(img, 0, 0, width, height)

            let quality: number = 0.8
            if (file.size > 2 * 1024 * 1024) quality = 0.6
            if (file.size > 3 * 1024 * 1024) quality = 0.5

            const compressedBase64: string = canvas.toDataURL('image/jpeg', quality)
            resolveCompress(compressedBase64)
          }

          img.onerror = (): void => {
            rejectCompress(new Error('Failed to load image'))
          }
          
          img.src = URL.createObjectURL(imageFile)
        })
      }

      const processImage = async (): Promise<string> => {
        try {
          if (file.size > 500 * 1024) {
            return await compressImage(file)
          } else {
            return new Promise<string>((resolveNormal, rejectNormal) => {
              const reader = new FileReader()
              reader.readAsDataURL(file)
              reader.onload = (): void => {
                if (typeof reader.result === 'string') {
                  resolveNormal(reader.result)
                } else {
                  rejectNormal(new Error('Failed to read file as data URL'))
                }
              }
              reader.onerror = (): void => {
                rejectNormal(new Error('FileReader error'))
              }
            })
          }
        } catch {
          return new Promise<string>((resolveFallback, rejectFallback) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (): void => {
              if (typeof reader.result === 'string') {
                resolveFallback(reader.result)
              } else {
                rejectFallback(new Error('Failed to read file as data URL'))
              }
            }
            reader.onerror = (): void => {
              rejectFallback(new Error('FileReader error'))
            }
          })
        }
      }

      processImage()
        .then(resolve)
        .catch(reject)
    })
  }

  // Convert Database to Component Type - sub_heading ADDED HERE
  const convertToWhyChooseUs = (dbSection: DatabaseWhyChooseUs): WhyChooseUs => {
    if (STORAGE_TYPE === "bucket") {
      return {
        id: dbSection.id,
        title: dbSection.title || "",
        paragraph: dbSection.paragraph || "",
        sub_heading: dbSection.sub_heading || "", // NEW FIELD ADDED
        images: null,
        heading: dbSection.heading || "",
        banner_buttun: dbSection.banner_buttun || "",
        features: dbSection.features || [],
        imageUrl: dbSection.images
      }
    } else {
      return {
        id: dbSection.id,
        title: dbSection.title || "",
        paragraph: dbSection.paragraph || "",
        sub_heading: dbSection.sub_heading || "", // NEW FIELD ADDED
        images: reconstructFromChunks(dbSection.images),
        heading: dbSection.heading || "",
        banner_buttun: dbSection.banner_buttun || "",
        features: dbSection.features || [],
        imageUrl: null
      }
    }
  }

  // Handle Edit - sub_heading ADDED HERE
  const handleEdit = (section: WhyChooseUs): void => {
    setIsEdit(true)
    setEditId(section.id)
    
    if (formData) {
      setFormData({
        ...formData,
        title: section.title,
        paragraph: section.paragraph,
        sub_heading: section.sub_heading, // NEW FIELD ADDED
        heading: section.heading,
        banner_buttun: section.banner_buttun,
        features: section.features.length > 0 ? section.features : [
          { icon: "",  paragraph: "" },
          { icon: "",  paragraph: "" }
        ],
        image: null
      })
    }
    
    // Set preview image based on storage type
    const imageUrl: string | null = STORAGE_TYPE === "bucket" ? section.imageUrl : section.images
    if (imageUrl) {
      setPreviewImage({
        url: imageUrl,
        type: 'existing'
      })
    }
    
    setOpen(true)
  }

  // Generate File Name for Bucket Storage
  const generateFileName = (sectionId: string, file: File): string => {
    const timestamp: number = Date.now()
    const extension: string = file.name.split('.').pop() || 'jpg'
    return `why_choose_us_${sectionId}_${timestamp}.${extension}`
  }

  // Upload to Bucket
  const uploadToBucket = async (file: File, sectionId: string): Promise<string> => {
    try {
      const fileName: string = generateFileName(sectionId, file)
      
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error("Error uploading to bucket:", error)
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  // Delete from Bucket
  const deleteFromBucket = async (imageUrl: string | null): Promise<void> => {
    try {
      if (!imageUrl) return
      
      const fileName: string | undefined = imageUrl.split('/').pop()
      if (!fileName) return

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName])

      if (error) {
        console.error("Error deleting from bucket:", error)
      }
    } catch (error) {
      console.error("Delete from bucket failed:", error)
    }
  }

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = e.target.files?.[0]
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`)
        return
      }

      if (formData) {
        setFormData({
          ...formData,
          image: file
        })
      }
      const previewUrl: string = URL.createObjectURL(file)
      setPreviewImage({
        url: previewUrl,
        type: 'new'
      })
    }
  }

  // Handle Remove Image
  const handleRemoveImage = (): void => {
    if (formData) {
      setFormData({
        ...formData,
        image: null
      })
    }
    
    // Revoke object URL if it's a new image
    if (previewImage?.type === 'new') {
      URL.revokeObjectURL(previewImage.url)
    }
    
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Cleanup preview URL
  useEffect(() => {
    return (): void => {
      if (previewImage?.type === 'new') {
        URL.revokeObjectURL(previewImage.url)
      }
    }
  }, [previewImage])

  // Handle Submit (Create) - sub_heading ADDED HERE
  const handleSubmit = async (
    values: WhyChooseUsFormValues,
    formikHelpers: FormikHelpers<WhyChooseUsFormValues>
  ): Promise<void> => {
    if (submitting || !formData) return

    try {
      setSubmitting(true)

      let imageData: string | null = null

      // Process image based on storage type
      if (formData.image) {
        if (STORAGE_TYPE === "bucket") {
          // Will upload after section creation to get ID
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image: string = await convertImageToBase64(formData.image)
            imageData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed:", convertError)
          }
        }
      }

      // First create section - sub_heading ADDED HERE
      const { data: sectionData, error: sectionError } = await supabase
        .from(`${TableName}`)
        .insert([
          {
            title: values.title,
            paragraph: values.paragraph,
            sub_heading: values.sub_heading, // NEW FIELD ADDED
            images: STORAGE_TYPE === "bucket" ? null : imageData,
            heading: values.heading,
            banner_buttun: values.banner_buttun,
            features: values.features
          }
        ])
        .select()
        .single()

      if (sectionError) {
        console.error("Error adding section:", sectionError)
        alert(`Error: ${sectionError.message}`)
        return
      }

      // For bucket storage, upload image after getting section ID
      if (STORAGE_TYPE === "bucket" && formData.image) {
        let imageUrl: string | null = null

        try {
          imageUrl = await uploadToBucket(formData.image, sectionData.id)
        } catch (error) {
          console.error("Failed to upload image:", error)
        }

        // Update section with image URL
        if (imageUrl) {
          const { error: updateError } = await supabase
            .from(`${TableName}`)
            .update({ 
              images: imageUrl
            })
            .eq("id", sectionData.id)

          if (updateError) {
            console.error("Error updating section with image:", updateError)
          }
        }

        // Update image data for response
        imageData = imageUrl
      }

      // Create new section object - sub_heading ADDED HERE
      const newSection: WhyChooseUs = {
        id: sectionData.id,
        title: sectionData.title || "",
        paragraph: sectionData.paragraph || "",
        sub_heading: sectionData.sub_heading || "", // NEW FIELD ADDED
        images: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(imageData),
        heading: sectionData.heading || "",
        banner_buttun: sectionData.banner_buttun || "",
        features: sectionData.features || [],
        imageUrl: STORAGE_TYPE === "bucket" ? imageData : null
      }

      // Update state
      setSections(prev => {
        const exists: boolean = prev.some(s => s.id === newSection.id)
        if (exists) {
          return prev.map(s => s.id === newSection.id ? newSection : s)
        }
        return [...prev, newSection]
      })

      resetForm()
      formikHelpers.resetForm()
      setOpen(false)
      fetchSections()
    } catch (error) {
      console.error("Error saving section:", error)
      if (error instanceof Error) {
        alert(`Error: ${error.message}`)
      } else {
        alert("Error saving section")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Update - sub_heading ADDED HERE
  const handleUpdate = async (
    values: WhyChooseUsFormValues,
    formikHelpers: FormikHelpers<WhyChooseUsFormValues>
  ): Promise<void> => {
    if (!editId || submitting || !formData) return

    try {
      setSubmitting(true)

      // Get existing section data
      const existingSection: WhyChooseUs | undefined = sections.find(s => s.id === editId)
      let imageData: string | null = null
      
      if (existingSection) {
        imageData = STORAGE_TYPE === "bucket" 
          ? existingSection.imageUrl 
          : existingSection.images
      }

      // Handle image updates
      if (formData.image) {
        if (STORAGE_TYPE === "bucket") {
          // Delete old image if exists
          if (existingSection?.imageUrl) {
            await deleteFromBucket(existingSection.imageUrl)
          }
          // Upload new image
          imageData = await uploadToBucket(formData.image, editId)
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image: string = await convertImageToBase64(formData.image)
            imageData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed:", convertError)
            // Keep existing image data
            imageData = existingSection?.images || null
          }
        }
      } else {
        // Keep existing image data
        imageData = existingSection?.images || existingSection?.imageUrl || null
      }

      // Update section in database - sub_heading ADDED HERE
      const updateData: UpdateWhyChooseUsData = {
        title: values.title,
        paragraph: values.paragraph,
        sub_heading: values.sub_heading, // NEW FIELD ADDED
        images: imageData,
        heading: values.heading,
        banner_buttun: values.banner_buttun,
        features: values.features
      }

      const { data, error } = await supabase
        .from(`${TableName}`)
        .update(updateData)
        .eq("id", editId)
        .select()
        .single()

      if (error) {
        console.error("Error updating section:", error)
        alert(`Error: ${error.message}`)
        return
      }

      // Convert to component type and update state
      const updatedSection: WhyChooseUs = convertToWhyChooseUs(data)
      setSections(prev => prev.map(s => s.id === editId ? updatedSection : s))

      resetForm()
      formikHelpers.resetForm()
      setOpen(false)
      fetchSections()
    } catch (error) {
      console.error("Error updating section:", error)
      if (error instanceof Error) {
        alert(`Error: ${error.message}`)
      } else {
        alert("Error updating section")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete
  const handleDeleteSection = async (id: string): Promise<void> => {
    if (!window.confirm("Delete this section?")) return

    try {
      // Handle image deletion based on storage type
      const sectionToDelete: WhyChooseUs | undefined = sections.find(s => s.id === id)
      
      if (STORAGE_TYPE === "bucket") {
        // Delete image from bucket
        if (sectionToDelete?.imageUrl) {
          await deleteFromBucket(sectionToDelete.imageUrl)
        }
      }

      // Delete from database
      const { error } = await supabase.from(`${TableName}`).delete().eq("id", id)

      if (error) {
        console.error("Error deleting section:", error)
        alert(`Error: ${error.message}`)
        return
      }

      // Update state
      setSections(prev => prev.filter(s => s.id !== id))
    } catch (error) {
      console.error("Error deleting section:", error)
      alert("Error deleting section. Please try again.")
    }
  }

  // Get image URL helper
  const getImageUrl = (section: WhyChooseUs): string | null => {
    return STORAGE_TYPE === "bucket" ? section.imageUrl : section.images
  }

  // Get safe image URL - prevent hydration mismatch
  const getSafeImageUrl = (
    dynamicSrc: string | null, 
    fallbackSrc: string
  ): string => {
    if (dynamicSrc && dynamicSrc.trim() !== "") {
      return dynamicSrc
    }
    
    return fallbackSrc
  }

  // Feature card colors for display
  const featureColors: FeatureColors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
  }

  // Color classes array for rotation
  const colorClassesArray: string[] = [
    featureColors.blue,
    featureColors.green,
    featureColors.purple,
    featureColors.orange
  ]

  // Type-safe helper to check if errors exist for a specific field
  const hasError = (
    errors: FormikErrorType,
    fieldName: keyof WhyChooseUsFormValues | keyof Feature,
    index?: number
  ): boolean => {
    if (index !== undefined && fieldName !== 'features') {
      const fieldNameKey = fieldName as keyof Feature
      const featureErrors = errors.features
      if (Array.isArray(featureErrors) && featureErrors[index]) {
        const featureError = featureErrors[index] as FeatureError
        return !!featureError[fieldNameKey]
      }
      return false
    }
    
    if (fieldName === 'features') {
      return !!errors.features && typeof errors.features === 'string'
    }
    
    const fieldNameKey = fieldName as keyof WhyChooseUsFormValues
    return !!errors[fieldNameKey]
  }

  // Helper to get feature error message
  const getFeatureErrorMessage = (
    errors: FormikErrorType,
    index: number,
    fieldName: keyof Feature
  ): string | undefined => {
    const featureErrors = errors.features
    if (Array.isArray(featureErrors) && featureErrors[index]) {
      const featureError = featureErrors[index] as FeatureError
      return featureError[fieldName]
    }
    return undefined
  }

  // Render content based on loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading sections...</p>
        </div>
      </div>
    )
  }

  // Don't render form until formData is initialized
  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Initializing form...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full space-y-6 ">
        <div className="container mx-auto px-4 py-8">
          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose Us Sections</h1>
            <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Section
            </Button>
          </div>

          {/* Error Display */}
          {fetchError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Error: {fetchError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchSections()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Display existing sections or empty state */}
          {sections.length === 0 ? (
            <div className="text-center py-12   rounded-lg ">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full  flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No sections found</p>
              <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                Create First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={section.id} className="   overflow-hidden">
                  <div className="flex justify-between  items-center p-6 ">
                    <div>
                      
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(section)}
                        className="border-blue-200 shadow-lg hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30"
                      >
                        <Pen className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="error"
                        className='shadow-lg '
                        size="sm"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="rounded-[20px] 
    bg-gradient-to-br 
    from-[hsl(var(--color-background))] 
    to-[hsl(var(--color-background)/0.95)]
    dark:from-[hsl(var(--color-background-dark))] 
    dark:to-[hsl(var(--color-background-dark)/0.95)]
    shadow-lg 
    shadow-[hsl(var(--color-shadow)/0.1)]
    border-2 
    border-[hsl(var(--color-border)/0.8)] p-5">
                    {/* Header Section - sub_heading DISPLAY ADDED HERE */}
                    <div className="mb-8 text-center">
                      <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <div className="w-6 h-6 text-blue-600 dark:text-blue-400">✓</div>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {section.title}
                      </h1>
                      {/* sub_heading DISPLAY ADDED HERE */}
                      {/* <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        {section.sub_heading}
                      </p> */}
                      <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        {section.heading}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-3xl mx-auto">
                        {section.paragraph}
                      </p>
                      <div className="h-1 w-24 bg-[var(--color-theme)] mx-auto rounded-full"></div>
                    </div>

                    {/* Image Display */}
                    {(section.imageUrl || section.images) && (
                      <div className="mb-8 flex justify-center">
                                  <div className="relative w-full max-w-2xl">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={getSafeImageUrl(
                              getImageUrl(section), 
                              "/assets/images/placeholder.jpg"
                            )} 
                            alt={section.title} 
                            className="rounded-lg object-cover w-full h-64 md:h-80"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}

                    {/* Features Grid */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.features.map((feature, idx) => (
                          <div 
                            key={idx}
                            className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-[var(--color-theme)]`}
                          >
                            <div className="flex items-start space-x-4">
                              <div className="mt-1 flex-shrink-0">
                                <div 
                                  dangerouslySetInnerHTML={{
                                    __html: `<i class="${feature.icon} text-2xl"></i>`
                                  }}
                                  className="flex items-center justify-center"
                                />
                              </div>
                              <div className="flex-1">
                                {/* <h3 className="font-bold text-xl mb-2">{feature.title}</h3> */}
                                <p className="text-gray-600 dark:text-gray-300">{feature.paragraph}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Banner Section */}
                  </div>
                    <div className="rounded-[20px] 
    bg-gradient-to-br 
    from-[hsl(var(--color-background))] 
    to-[hsl(var(--color-background)/0.95)]
    dark:from-[hsl(var(--color-background-dark))] 
    dark:to-[hsl(var(--color-background-dark)/0.95)]
    shadow-lg 
    shadow-[hsl(var(--color-shadow)/0.1)]
    border-2 
    border-[hsl(var(--color-border)/0.8)]  p-6 text-white p-8 mt-3">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                          {section.sub_heading}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          Ready to experience our exceptional service?
                        </p>
                        <button className="bg-[var(--color-theme)] hover:bg-[var(--color-theme-hover)] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                          {section.banner_buttun}
                        </button>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog for Create/Edit - sub_heading FORM FIELD ADDED HERE */}
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-2xl font-bold">
                {isEdit ? "Edit Why Choose Us Section" : "Create Why Choose Us Section"}
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(90vh-140px)]">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={isEdit ? handleUpdate : handleSubmit}
                enableReinitialize
              >
                {({ 
                  values, 
                  errors, 
                  touched, 
                  isSubmitting, 
                  setFieldValue,
                  isValid 
                }: FormikProps<WhyChooseUsFormValues>) => {
                  // Cast errors to our custom type
                  const formikErrors: FormikErrorType = errors as unknown as FormikErrorType
                  
                  return (
                    <Form id="whyChooseUsForm" className="space-y-6 pb-4">
                      {/* Main Content */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title" className="mb-2 block font-medium">
                              Title *
                            </Label>
                            <Field
                              as={Input}
                              id="title"
                              name="title"
                              placeholder="WHY CHOOSE US"
                              className={`${hasError(formikErrors, 'title') && touched.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            <ErrorMessage
                              name="title"
                              component="div"
                              className="text-sm text-red-600 mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="sub_heading" className="mb-2 block font-medium">
                              Banner Heading * {/* NEW FIELD ADDED */}
                            </Label>
                            <Field
                              as={Input}
                              id="sub_heading"
                              name="sub_heading"
                              placeholder="Why Our Technology Solutions Company Stands Out?"
                              className={`${hasError(formikErrors, 'sub_heading') && touched.sub_heading ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            <ErrorMessage
                              name="sub_heading"
                              component="div"
                              className="text-sm text-red-600 mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="paragraph" className="mb-2 block font-medium">
                              Description *
                            </Label>
                            <Field
                              as="textarea"
                              id="paragraph"
                              name="paragraph"
                              rows={4}
                              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${hasError(formikErrors, 'paragraph') && touched.paragraph ? 'border-red-500 focus:ring-red-500' : ''}`}
                              placeholder="We're resolving your technology woes with expert care..."
                            />
                            <ErrorMessage
                              name="paragraph"
                              component="div"
                              className="text-sm text-red-600 mt-1"
                            />
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="heading" className="mb-2 block font-medium">
                              Heading *
                            </Label>
                            <Field
                              as={Input}
                              id="heading"
                              name="heading"
                              placeholder="Our Commitment to Excellence"
                              className={`${hasError(formikErrors, 'heading') && touched.heading ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            <ErrorMessage
                              name="heading"
                              component="div"
                              className="text-sm text-red-600 mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="banner_buttun" className="mb-2 block font-medium">
                              Banner Button Text *
                            </Label>
                            <Field
                              as={Input}
                              id="banner_buttun"
                              name="banner_buttun"
                              placeholder="Get Started"
                              className={`${hasError(formikErrors, 'banner_buttun') && touched.banner_buttun ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            <ErrorMessage
                              name="banner_buttun"
                              component="div"
                              className="text-sm text-red-600 mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Rest of the form remains the same */}
                      {/* Image Upload Section */}
                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-lg mb-4">Main Image</h3>
                        <div className="space-y-3">
                          <div className="
                            border-2 border-dashed border-gray-300 dark:border-gray-700
                            rounded-lg p-4 
                            hover:border-gray-400 dark:hover:border-gray-600
                            transition-colors
                          ">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageChange}
                              accept="image/*"
                              className="hidden"
                              disabled={submitting}
                              id="image-upload"
                            />
                            
                            {previewImage ? (
                                          <div className="text-center space-y-3">
                                              {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={previewImage.url}
                                  alt="Preview"
                                  className="mx-auto max-h-48 rounded-lg object-contain"
                                />
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={submitting}
                                  >
                                    Change Image
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleRemoveImage}
                                    disabled={submitting}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-full py-8 border-dashed"
                                  disabled={submitting}
                                >
                                  <div className="flex flex-col items-center gap-2">
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      width="24" 
                                      height="24" 
                                      viewBox="0 0 24 24" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      strokeWidth="2" 
                                      className="text-gray-400"
                                    >
                                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                                      <line x1="16" x2="22" y1="5" y2="5"/>
                                      <line x1="19" x2="19" y1="2" y2="8"/>
                                      <circle cx="9" cy="9" r="2"/>
                                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                    </svg>
                                    <span className="font-medium">Upload Main Image</span>
                                    <span className="text-xs text-gray-500">Max 5MB</span>
                                  </div>
                                </Button>
                              </div>
                            )}
                            
                            {isEdit && !previewImage && (
                              <div className="mt-2 text-center text-xs text-gray-500">
                                Leave empty to keep existing image
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {STORAGE_TYPE === "bucket" 
                              ? "Stored in secure cloud storage bucket."
                              : "Automatically compressed and stored in database."
                            }
                          </div>
                        </div>
                      </div>

                      {/* Features Section with FieldArray */}
                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg">Features *</h3>
                                  <FieldArray name="features">
                                      
                                      {({ push }: FieldArrayRenderProps) => (
                                          
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push({ icon: "",  paragraph: "" })}
  disabled={submitting || values.features.length >= 2}

                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Feature
                              </Button>
                            )}
                          </FieldArray>
                        </div>
                        
                        <FieldArray name="features">
                          {({ push, remove }: FieldArrayRenderProps) => (
                            <div className="space-y-4">
                              {values.features.map((feature, index) => (
                                <div key={index} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                                  <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Feature {index + 1}</h4>
                                    {values.features.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => remove(index)}
                                        disabled={submitting}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <Label htmlFor={`features.${index}.icon`} className="mb-2 block font-medium">
                                        Icon Class (Font Awesome) *
                                      </Label>
                                      <Field
                                        as={Input}
                                        id={`features.${index}.icon`}
                                        name={`features.${index}.icon`}
                                        placeholder="fas fa-check"
                                        className={`${getFeatureErrorMessage(formikErrors, index, 'icon') ? 'border-red-500 focus:ring-red-500' : ''}`}
                                      />
                                      <ErrorMessage
                                        name={`features.${index}.icon`}
                                        component="div"
                                        className="text-sm text-red-600 mt-1"
                                      />
                                      <div className="text-xs text-gray-500 mt-1">
                                        Example: fas fa-check, fab fa-react
                                      </div>
                                    </div>
                                    
                                    {/* <div>
                                      <Label htmlFor={`features.${index}.title`} className="mb-2 block font-medium">
                                        Title *
                                      </Label>
                                      <Field
                                        as={Input}
                                        id={`features.${index}.title`}
                                        name={`features.${index}.title`}
                                        placeholder="Precision & Excellence"
                                        className={`${getFeatureErrorMessage(formikErrors, index, 'title') ? 'border-red-500 focus:ring-red-500' : ''}`}
                                      />
                                      <ErrorMessage
                                        name={`features.${index}.title`}
                                        component="div"
                                        className="text-sm text-red-600 mt-1"
                                      />
                                    </div> */}
                                    
                                    <div>
                                      <Label htmlFor={`features.${index}.paragraph`} className="mb-2 block font-medium">
                                        Description *
                                      </Label>
                                      <Field
                                        as="textarea"
                                        id={`features.${index}.paragraph`}
                                        name={`features.${index}.paragraph`}
                                        rows={3}
                                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                          getFeatureErrorMessage(formikErrors, index, 'paragraph') 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : ''
                                        }`}
                                        placeholder="Navigating IT solutions with meticulous attention..."
                                      />
                                      <ErrorMessage
                                        name={`features.${index}.paragraph`}
                                        component="div"
                                        className="text-sm text-red-600 mt-1"
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Icon Preview */}
                                  <div className="mt-3 flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Icon Preview:</span>
                                    <div 
                                      dangerouslySetInnerHTML={{
                                        __html: `<i class="${feature.icon || 'fas fa-question'} text-lg"></i>`
                                      }}
                                      className="flex items-center justify-center"
                                    />
                                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                      {feature.icon || 'No icon selected'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              
                              {typeof errors.features === 'string' && (
                                <div className="text-sm text-red-600 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                  {errors.features}
                                </div>
                              )}
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      {/* Footer Buttons */}
                      <DialogFooter className="
                        flex-shrink-0 
                        pt-4 
                        border-t 
                        bg-white 
                        dark:bg-gray-900
                        sticky 
                        bottom-0
                      ">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setOpen(false)
                            resetForm()
                          }}
                          disabled={submitting}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                        
                        <Button
                          type="submit"
                          form="whyChooseUsForm"
                          disabled={submitting || !isValid}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : isEdit ? "Update Section" : "Create Section"}
                        </Button>
                      </DialogFooter>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default WhyChooseUsSection