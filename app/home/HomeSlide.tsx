// // components/HomeSliderCard.tsx
// 'use client'
// import { FC,useCallback,useEffect,useState,useRef } from 'react'
// import Image, { StaticImageData } from 'next/image'
// import img from './img1.jpg'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { supabase } from "@/lib/supabase-client"
// import { Input } from '@/components/ui/input'

// import { Formik, Form, Field, ErrorMessage } from 'formik'
// import * as Yup from 'yup'
// import type { Session } from "@supabase/supabase-js";
// import { Label } from '@/components/ui/label'
// interface UserFormValues {
//   title: string
//   heading: string
//   btn_one:string
//   btn_two:string
// }


// interface DatabaseUser {
//   id: string;
//   title: string;
//   heading: number;
//   btn_one: string;
//   btn_two: string;
//   profile_image: string | null;
//   created_at?: string;
// }


// interface HomeSliderCardProps {
//   imageSrc: string | StaticImageData  // <-- fix here

//   title: string
//   heading: string
//   buttonOneText: string
//   buttonTwoText: string
//   open: boolean
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>

// }


// const BUCKET_NAME = "userImages";
// const STORAGE_TYPE = "bucket";
// const CHUNK_SIZE = 60000;
// const DELIMITER = '|||CHUNK|||';
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024;





// // Define Component User type
// interface User {
//   id: string;
//   title: string;
//   heading: number;
//   btn_one: string;
//   btn_two: string;
//   image: string;
//   profile_image:string | null;
  
  

//   profile_imageUrl?: string | null | undefined; // undefined भी allow करें
// }

// interface FormData {
//   title: string;
//   heading: string;
//   btn_one: string;
//   btn_two: string;
//   profile_image: File | null;
// }
// const HomeSliderCard: FC<HomeSliderCardProps> = ({
//   imageSrc,
//   title,
//   heading,
//   buttonOneText,
//   buttonTwoText,
//   open,
//   setOpen
// }) => {


//    const [show, setShow] = useState(false);
//     const [users, setUsers] = useState<User[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isEdit, setIsEdit] = useState(false);
//     const [editId, setEditId] = useState<string | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [submitting, setSubmitting] = useState(false);
//     const [previewImage, setPreviewImage] = useState<string | null>(null);
//     const [formData, setFormData] = useState<FormData>({
//       title: "",
//       heading: "",
//       btn_one: "",
//       btn_two: "",
//       profile_image: null,
//     });
  
//   // ---Formik---
 

//   const validationSchema = Yup.object({
//     title: Yup.string()
//       .min(2, 'tile must be at least 2 characters')
//       .required('title is required'),
//     heading: Yup.string()
//       .min(2, 'Heading must be at least 2 characters')
//       .required('Heading is required'),
//    btn_one: Yup.string()
//       .min(2, 'btn one must be at least 2 characters')
//       .required('btn one is required'),
//       btn_two: Yup.string()
//       .min(2, 'btn two must be at least 2 characters')
//       .required('btn two is required'),
//   })
  
// const initialValues: UserFormValues = {
//     title: '',
//     heading: '',
//     btn_one: '',
//     btn_two: '',
    
//   }

//    const resetForm = () => {
//     setFormData({ 
//       title: "", 
//       heading: "", 
//       btn_one: "", 
//       btn_two: "",
//       profile_image: null 
//     });
//     setEditId(null);
//     setPreviewImage(null);
//     setIsEdit(false);
//     setShow(false);
//     setSubmitting(false);
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };
//   const handleSubmit = async (values: UserFormValues) => {
//     console.log('Form submitted:', values)


//     if (submitting) return;
    
//     try {
//       setSubmitting(true);
      
//       // First, create user without image to get ID
//       const { data: userData, error: userError } = await supabase
//         .from("home-banner")
//         .insert([
//           {
//             title: formData.title,
//             heading: Number(formData.heading),
//             btn_one: formData.btn_one,
//             profile_image: null, // Will update after processing
//           },
//         ])
//         .select()
//         .single();

//       if (userError) {
//         console.error("Error adding user:", userError);
//         alert(`Error: ${userError.message}`);
//         return;
//       }

//       let profile_imageData: string | null = null;
      
//       // Process image based on storage type
//       if (formData.profile_image) {
//         if (STORAGE_TYPE === "bucket") {
//           // Upload to bucket
//           try {
//             const bucketUrl = await uploadToBucket(formData.profile_image, userData.id);
//             profile_imageData = bucketUrl;
//           } catch (uploadError) {
//             console.error("Bucket upload failed:", uploadError);
//             // Continue without image
//           }
//         } else {
//           // Convert to Base64 and chunk
//           try {
//             const base64Image = await convertImageToBase64(formData.profile_image);
//             profile_imageData = splitIntoChunks(base64Image);
//           } catch (convertError) {
//             console.error("Base64 conversion failed:", convertError);
//           }
//         }
        
//         // Update user with image data
//         if (profile_imageData) {
//           const { error: updateError } = await supabase
//             .from("home-banner")
//             .update({ profile_image: profile_imageData })
//             .eq("id", userData.id);

//           if (updateError) {
//             console.error("Error updating user with image:", updateError);
//           }
//         }
//       }

//       // Create new user object
//       const newUser: User = {
//         ...userData,
//         profile_image: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(profile_imageData),
//         profile_imageUrl: STORAGE_TYPE === "bucket" ? profile_imageData : null
//       };
      
//       // Add user to state with duplicate check
//       setUsers(prev => {
//         const exists = prev.some(u => u.id === newUser.id);
//         if (exists) {
//           console.log("User already exists, updating instead");
//           return prev.map(u => u.id === newUser.id ? newUser : u);
//         }
//         return [...prev, newUser];
//       });
      
//       resetForm();
//     } catch (error) {
//       console.error("Error saving user:", error);
//       if (error instanceof Error) {
//         alert(`Error: ${error.message}`);
//       } else {
//         alert("Error saving user. Please try again.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // ---Formik---

//   // Base64 chunking functions
//   const splitIntoChunks = (base64String: string): string => {
//     if (base64String.length <= CHUNK_SIZE) {
//       return base64String;
//     }
    
//     const chunks: string[] = [];
//     for (let i = 0; i < base64String.length; i += CHUNK_SIZE) {
//       chunks.push(base64String.slice(i, i + CHUNK_SIZE));
//     }
//     return chunks.join(DELIMITER);
//   };

//   const reconstructFromChunks = (chunkedString: string | null | undefined): string | null => {
//     if (!chunkedString) return null;
    
//     if (!chunkedString.includes(DELIMITER)) {
//       return chunkedString;
//     }
    
//     return chunkedString.split(DELIMITER).join('');
//   };

//   // Optimized Base64 conversion
//   const convertImageToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       if (file.size > MAX_IMAGE_SIZE) {
//         reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`));
//         return;
//       }

//       const compressImage = (imageFile: File): Promise<string> => {
//         return new Promise((resolveCompress, rejectCompress) => {
//           const img = new Image();
//           const canvas = document.createElement('canvas');
          
//           img.onload = () => {
//             let width = img.width;
//             let height = img.height;
            
//             const maxDimension = 1024;
//             if (width > maxDimension || height > maxDimension) {
//               if (width > height) {
//                 height = (height * maxDimension) / width;
//                 width = maxDimension;
//               } else {
//                 width = (width * maxDimension) / height;
//                 height = maxDimension;
//               }
//             }
            
//             canvas.width = width;
//             canvas.height = height;
            
//             const ctx = canvas.getContext('2d');
//             if (!ctx) {
//               rejectCompress(new Error('Could not get canvas context'));
//               return;
//             }
            
//             ctx.fillStyle = 'white';
//             ctx.fillRect(0, 0, width, height);
//             ctx.drawImage(img, 0, 0, width, height);
            
//             let quality = 0.8;
//             if (file.size > 2 * 1024 * 1024) quality = 0.6;
//             if (file.size > 3 * 1024 * 1024) quality = 0.5;
           
//             const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
//             resolveCompress(compressedBase64);
//           };
          
//           img.onerror = rejectCompress;
//           img.src = URL.createObjectURL(imageFile);
//         });
//       };

//       const processImage = async () => {
//         try {
//           if (file.size > 500 * 1024) {
//             return await compressImage(file);
//           } else {
//             return new Promise<string>((resolveNormal, rejectNormal) => {
//               const reader = new FileReader();
//               reader.readAsDataURL(file);
//               reader.onload = () => resolveNormal(reader.result as string);
//               reader.onerror = rejectNormal;
//             });
//           }
//         } catch  {
//           return new Promise<string>((resolveFallback, rejectFallback) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = () => resolveFallback(reader.result as string);
//             reader.onerror = rejectFallback;
//           });
//         }
//       };

//       processImage()
//         .then(resolve)
//         .catch(reject);
//     });
//   };

//   // Handle image file selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
    
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         alert('Please select an image file');
//         return;
//       }

//       if (file.size > MAX_IMAGE_SIZE) {
//         alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
//         return;
//       }

//       setFormData((prev) => ({ ...prev, profile_image: file }));
      
//       const previewUrl = URL.createObjectURL(file);
//       setPreviewImage(previewUrl);
//     }
//   };

//   // Cleanup preview URL
//   useEffect(() => {
//     return () => {
//       if (previewImage) {
//         URL.revokeObjectURL(previewImage);
//       }
//     };
//   }, [previewImage]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const convertToUser = (dbUser: DatabaseUser): User => {
//     if (STORAGE_TYPE === "bucket") {
//       // For bucket storage
//       return {
//         id: dbUser.id,
//         title: dbUser.title,
//         heading: dbUser.heading,
//         btn_one: dbUser.btn_one,
//         btn_two: dbUser.btn_two,
//         profile_image: null,
//         profile_imageUrl: dbUser.profile_image || null
//       };
//     } else {
//       // For Base64 storage
//       return {
//         id: dbUser.id,
//         title: dbUser.title,
//         heading: dbUser.heading,
//         btn_one: dbUser.btn_one,
//         btn_two: dbUser.btn_two,
//         profile_image: reconstructFromChunks(dbUser.profile_image),
//         profile_imageUrl: null
//       };
//     }
//   };
  

// const   fetchUsers = useCallback(async () => {
//     try {
//       // setLoading(true);
//       const { data, error } = await supabase
//         .from("home-banner")
//         .select("*")
//         .order("created_at", { ascending: true });
//       console.log("Fetched users:", data);

//     if (error) {
//         console.error("Error fetching users:", error);
//         return;
//       }
      
//       // Safely convert database users to component users
//       // const processedUsers = (data || []).map(convertToUser);
      
//       // setUsers(processedUsers);
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     } finally {
//       // setLoading(false);
//     }
//   }, []);


//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   const generateFileName = (userId: string, file: File): string => {
//     const timestamp = Date.now();
//     const extension = file.name.split('.').pop() || 'jpg';
//     return `${userId}_${timestamp}.${extension}`;
//   };


//   const uploadToBucket = async (file: File, userId: string): Promise<string> => {
//     try {
//       const fileName = generateFileName(userId, file);
      
//       const { data, error } = await supabase.storage
//         .from(BUCKET_NAME)
//         .upload(fileName, file, {
//           cacheControl: '3600',
//           upsert: true
//         });
      
//       console.log("Upload data:", data);

//       if (error) {
//         console.error("Error uploading to bucket:", error);
//         throw error;
//       }

//       // Get public URL
//       const { data: { publicUrl } } = supabase.storage
//         .from(BUCKET_NAME)
//         .getPublicUrl(fileName);

//       return publicUrl;
//     } catch (error) {
//       console.error("Upload failed:", error);
//       throw error;
//     }
//   };

//   // Delete image from bucket
//   const deleteFromBucket = async (imageUrl: string | null | undefined): Promise<void> => {
//     try {
//       if (!imageUrl) return;
      
//       // Extract filename from URL
//       const fileName = imageUrl.split('/').pop();
//       if (!fileName) return;

//       const { error } = await supabase.storage
//         .from(BUCKET_NAME)
//         .remove([fileName]);

//       if (error) {
//         console.error("Error deleting from bucket:", error);
//       }
//     } catch (error) {
//       console.error("Delete from bucket failed:", error);
//     }
//   };

// const handleRemoveImage = () => {
//     setFormData(prev => ({ ...prev, profile_image: null }));
//     setPreviewImage(null);
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };
//   return (
//     <div>
  
//           <div className="flex w-[400px] flex-col gap-4 rounded-[30px] 
//   dark:bg-[var(--dark-back-grdient)] bg-[var(--back-grdient)] 
//   shadow-[0px_0px_152px_20px_#edf2f7] p-4 hover:-translate-y-4.5 transition-all duration-300">
//                   <div>
//   <div className="relative">
//     <Image src={img} alt="sad" className="inline-block h-20 md:h-60 w-full rounded-[15px] md:rounded-[25px] object-cover" />
//   </div>
//   <div className="flex w-full flex-col gap-5">
//     <h3 className="font-[600] plusJakartaSans text-[12px] md:text-[14px]">
//       cPanel Tutorial for Linux Hosting
//     </h3>
//     <p className="font-[300] text-[12px] md:text-[14px]">
//       What is cPanel? Who should learn how to work with cPanel?
//     </p>
//     {/* Divider */}
//     <div className="h-px w-full bg-[#F7F7F7]" />
//     <div className="flex items-center">
//       <img src={"./assets/images/user.svg"} alt="ad" className="mx-1 inline-block" />
//       <div className="flex flex-col md:flex-row md:items-center justify-between">
//         <h6 className="text-[#A5A5A5] text-[10px] md:text-[12px]">WHMCSCRAFT</h6>
//         <p className="mx-2 hidden text-[#A5A5A5] text-[12px] lg:block">
//           -
//         </p>
//         <p className="text-[#A5A5A5] text-[12px]">
//           October 27, 2025
//         </p>
//       </div>
//     </div>
//   </div>
//               </div>
//               </div>

//    {open && (
//   <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Delete Item</DialogTitle>
            
//           </DialogHeader>
//              <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, errors, touched }) => (
//             <Form>
//           <div >
//             <div className="my-2">
//                 <Label htmlFor="title">Title</Label>
//                 <Field
//                   as={Input}
//                   id="title"
//                   name="title"
//                   placeholder="John Doe"
//                   className={errors.title && touched.title ? 'border-destructive' : ''}
//                 />
//                 <ErrorMessage
//                   name="title"
//                   component="div"
//                   className="text-sm text-red-400"
//                 />
//                     </div>
//                     <div className="my-2">
//                 <Label htmlFor="heading">Heading</Label>
//                 <Field
//                   as={Input}
//                   id="heading"
//                   name="heading"
//                   placeholder="John Doe"
//                   className={errors.heading && touched.heading ? 'border-destructive' : ''}
//                 />
//                 <ErrorMessage
//                   name="heading"
//                   component="div"
//                   className="text-sm text-red-400"
//                 />
//                     </div>
//                     <div className='flex  w-full  my-2  gap-2'>
//                       <div>
//                           <Label htmlFor="btn_one">Button 1</Label>
//                 <Field
//                   as={Input}
//                   id="btn_one"
//                   name="btn_one"
//                   placeholder="John Doe"
//                   className={errors.btn_one && touched.btn_one ? 'border-destructive' : ''}
//                 />
//                 <ErrorMessage
//                   name="btn_one"
//                   component="div"
//                   className="text-sm text-red-400"
//                 />
//                         </div>
//                       <div>
//                                   <Label htmlFor="btn_two">Button 2</Label>
//                 <Field
//                   as={Input}
//                   id="btn_two"
//                   name="btn_two"
//                   placeholder="John Doe"
//                   className={errors["btn_two"] && touched["btn_two"] ? 'border-destructive' : ''}
//                 />
//                 <ErrorMessage
//                   name="btn_two"
//                   component="div"
//                   className="text-sm text-red-400"
//                 />
//                         </div>

          

//                       </div>

//                     <div className="mb-3">
//             <label className="form-label">Background Image (Max 1MB)</label>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleImageChange}
//               accept="image/*"
//               className="form-control mb-2"
//               disabled={submitting}
//             />

//             {previewImage && (
//               <div className="mt-2 text-center">
//                 <img
//                   src={previewImage}
//                   alt="Preview"
//                   className="img-thumbnail"
//                   style={{ maxWidth: "150px", maxHeight: "150px" }}
//                 />
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-danger mt-2"
//                   onClick={handleRemoveImage}
//                   disabled={submitting}
//                 >
//                   Remove Image
//                 </button>
//               </div>
//             )}

//             {!previewImage && isEdit && (
//               <div className="text-muted small">
//                 Leave empty to keep existing image
//               </div>
//             )}

//             <div className="form-text">
//               {STORAGE_TYPE === "bucket" 
//                 ? "Images are stored in secure cloud storage bucket."
//                 : "Images are automatically compressed and stored in database."}
//             </div>
//           </div>

//           </div>
          
//           </Form>
//               )}
//             </Formik>

//           <DialogFooter className="flex gap-2">
//             <Button
//               variant="error"
//               onClick={() => setOpen(false)}
//             >
//               Cancel
//             </Button>

//             <Button
              
//               onClick={() => {
//                 console.log('Deleted')
//                 setOpen(false)
//               }}
//             >
//               Confirm
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     )}   
//     </div>
//   )
// }

// export default HomeSliderCard




// components/HomeSliderCard.tsx
'use client'
import { FC, useCallback, useEffect, useState, useRef } from 'react'
import Image, { StaticImageData } from 'next/image'
import img from './img1.jpg'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { supabase } from "@/lib/supabase-client"
import { Input } from '@/components/ui/input'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Label } from '@/components/ui/label'

import { Pen, Trash,UserRound } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay} from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"



import img1 from './img1.jpg'

// Remove Session import if not used
// import type { Session } from "@supabase/supabase-js";

interface UserFormValues {
  title: string
  heading: string
  btn_one: string
  btn_two: string
}

interface DatabaseUser {
  id: string;
  title: string;
  heading: number;
  btn_one: string;
  btn_two: string;
  profile_image: string | null;
  created_at?: string;
}

interface HomeSliderCardProps {
  imageSrc: string | StaticImageData
  title?: string
  heading?: string
  buttonOneText?: string
  buttonTwoText?: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const BUCKET_NAME = "home-banner";
const STORAGE_TYPE = "bucket";
const CHUNK_SIZE = 60000;
const DELIMITER = '|||CHUNK|||';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Define Component User type - FIXED: image field removed
interface User {
  id: string;
  title: string;
  heading: number;
  btn_one: string;
  btn_two: string;
  profile_image: string | null; // Changed from 'image' to 'profile_image'
  profile_imageUrl?: string | null; // undefined भी allow करें
}

interface FormData {
  title: string;
  heading: string;
  btn_one: string;
  btn_two: string;
  profile_image: File | null;
}

const HomeSliderCard: FC<HomeSliderCardProps> = ({
  imageSrc,
  title,
  heading,
  buttonOneText,
  buttonTwoText,
  open,
  setOpen
}) => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);


    const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)


  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    heading: "",
    btn_one: "",
    btn_two: "",
    profile_image: null,
  });

  // ---Formik---
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(2, 'tile must be at least 2 characters')
      .required('title is required'),
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .required('Heading is required'),
    btn_one: Yup.string()
      .min(2, 'btn one must be at least 2 characters')
      .required('btn one is required'),
    btn_two: Yup.string()
      .min(2, 'btn two must be at least 2 characters')
      .required('btn two is required'),
  })

  const initialValues: UserFormValues = {
    title: formData.title? formData.title : '',
    heading: formData.heading? formData.heading : '',
    btn_one: formData.btn_one? formData.btn_one : '',
    btn_two: formData.btn_two? formData.btn_two : '',
  }

  const resetForm = () => {
    setFormData({
      title: "",
      heading: "",
      btn_one: "",
      btn_two: "",
      profile_image: null
    });
    setEditId(null);
    setPreviewImage(null);
    setIsEdit(false);
    setShow(false);
    setSubmitting(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleEdit = (user: User) => {
  console.log("<><><>",user)
    setIsEdit(true);
    setEditId(user.id);
    setFormData({
      title: user.title,
      heading: String(user.heading),
      btn_one: user.btn_one,
      btn_two: user.btn_two,
      profile_image: null,
    });
    
    // Set preview based on storage type
    if (STORAGE_TYPE === "bucket") {
      setPreviewImage(user.profile_imageUrl || null);
    } else {
      setPreviewImage(user.profile_image);
    }
    setOpen(true);
  };
  console.log("modal show",show)


  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("home_banner")
        .select("*")
        .order("created_at", { ascending: true });
      console.log("Fetched user:", data);

      if (error) {
        console.error("Error fetching home:", error);
        return;
      }

      // Safely convert database users to component users
      const processedUsers = (data || []).map((dbUser) => convertToUser(dbUser as DatabaseUser));

      setUsers(processedUsers);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);




  console.log("users", users)
  
  
  const handleSubmit = async (
    values: UserFormValues,
    formikHelpers: FormikHelpers<UserFormValues>
  ) => {
    console.log('Form submitted:', values)

    if (submitting) return;

    try {
      setSubmitting(true);

      // First, create user without image to get ID
      const { data: userData, error: userError } = await supabase
        .from("home_banner")
        .insert([
          {
            title: values.title, // Use values from Formik
            heading: values.heading, // Convert heading to number
            btn_one: values.btn_one,
            btn_two: values.btn_two, // Add btn_two which was missing
            profile_image: null, // Will update after processing
          }
        ])
        .select()
        .single();
      
      setOpen(false);
      if (userError) {
        console.error("Error adding user:", userError);
        alert(`Error: ${userError.message}`);
        return;
      }

      let profile_imageData: string | null = null;

      // Process image based on storage type
      if (formData.profile_image) {
        if (STORAGE_TYPE === "bucket") {
          // Upload to bucket
          try {
            const bucketUrl = await uploadToBucket(formData.profile_image, userData.id);
            profile_imageData = bucketUrl;
          } catch (uploadError) {
            console.error("Bucket upload failed:", uploadError);
            // Continue without image
          }
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.profile_image);
            profile_imageData = splitIntoChunks(base64Image);
          } catch (convertError) {
            console.error("Base64 conversion failed:", convertError);
          }
        }

        // Update user with image data
        if (profile_imageData) {
          const { error: updateError } = await supabase
            .from("home_banner")
            .update({ profile_image: profile_imageData })
            .eq("id", userData.id);

          if (updateError) {
            console.error("Error updating user with image:", updateError);
          }
        }
      }

      // Type-safe user data handling
      if (!userData) {
        throw new Error("No user data returned from insert");
      }

      // Create new user object with proper typing
      const newUser: User = {
        id: userData.id,
        title: userData.title || "",
        heading: Number(userData.heading) || 0,
        btn_one: userData.btn_one || "",
        btn_two: userData.btn_two || "",
        profile_image: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(profile_imageData),
        profile_imageUrl: STORAGE_TYPE === "bucket" ? profile_imageData : null
      };

      // Add user to state with duplicate check
      setUsers(prev => {
        const exists = prev.some(u => u.id === newUser.id);
        if (exists) {
          console.log("User already exists, updating instead");
          return prev.map(u => u.id === newUser.id ? newUser : u);
        }
        return [...prev, newUser];
      });
fetchUsers();
      resetForm();
      formikHelpers.resetForm();
    } catch (error) {
setOpen(false);

      console.error("Error saving user:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Error saving user. Please try again.");
      }
    } finally {
setOpen(false);

      setSubmitting(false);
    }
  }

  // Base64 chunking functions
  const splitIntoChunks = (base64String: string): string => {
    if (base64String.length <= CHUNK_SIZE) {
      return base64String;
    }

    const chunks: string[] = [];
    for (let i = 0; i < base64String.length; i += CHUNK_SIZE) {
      chunks.push(base64String.slice(i, i + CHUNK_SIZE));
    }
    return chunks.join(DELIMITER);
  };

  const reconstructFromChunks = (chunkedString: string | null | undefined): string | null => {
    if (!chunkedString) return null;

    if (!chunkedString.includes(DELIMITER)) {
      return chunkedString;
    }

    return chunkedString.split(DELIMITER).join('');
  };

  // Optimized Base64 conversion
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`));
        return;
      }

      const compressImage = (imageFile: File): Promise<string> => {
        return new Promise((resolveCompress, rejectCompress) => {
    if (typeof window === 'undefined') {
      rejectCompress(new Error('Image compression only available in browser'));
      return;
    }

    const img = new window.Image(); // Use window.Image

          const canvas = document.createElement('canvas');

          img.onload = () => {
            let width = img.width;
            let height = img.height;

            const maxDimension = 1024;
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = (height * maxDimension) / width;
                width = maxDimension;
              } else {
                width = (width * maxDimension) / height;
                height = maxDimension;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              rejectCompress(new Error('Could not get canvas context'));
              return;
            }

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            let quality = 0.8;
            if (file.size > 2 * 1024 * 1024) quality = 0.6;
            if (file.size > 3 * 1024 * 1024) quality = 0.5;

            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolveCompress(compressedBase64);
          };

          img.onerror = rejectCompress;
          img.src = URL.createObjectURL(imageFile);
        });
      };


      const processImage = async () => {
        try {
          if (file.size > 500 * 1024) {
            return await compressImage(file);
          } else {
            return new Promise<string>((resolveNormal, rejectNormal) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolveNormal(reader.result as string);
              reader.onerror = rejectNormal;
            });
          }
        } catch {
          return new Promise<string>((resolveFallback, rejectFallback) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolveFallback(reader.result as string);
            reader.onerror = rejectFallback;
          });
        }
      };

      processImage()
        .then(resolve)
        .catch(reject);
    });
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
        return;
      }

      setFormData((prev) => ({ ...prev, profile_image: file }));

      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const convertToUser = (dbUser: DatabaseUser): User => {
    if (STORAGE_TYPE === "bucket") {
      // For bucket storage
      return {
        id: dbUser.id,
        title: dbUser.title,
        heading: dbUser.heading,
        btn_one: dbUser.btn_one,
        btn_two: dbUser.btn_two,
        profile_image: null,
        profile_imageUrl: dbUser.profile_image || null
      };
    } else {
      // For Base64 storage
      return {
        id: dbUser.id,
        title: dbUser.title,
        heading: dbUser.heading,
        btn_one: dbUser.btn_one,
        btn_two: dbUser.btn_two,
        profile_image: reconstructFromChunks(dbUser.profile_image),
        profile_imageUrl: null
      };
    }
  };


  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      // Reinitialize navigation with custom buttons
      const swiper = swiperRef.current
      
      // Update navigation elements
      if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
        swiper.params.navigation.prevEl = prevRef.current
        swiper.params.navigation.nextEl = nextRef.current
      }
      
      // Re-init navigation
      swiper.navigation.destroy()
      swiper.navigation.init()
      swiper.navigation.update()
    }
  }, [])





  const generateFileName = (userId: string, file: File): string => {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    return `${userId}_${timestamp}.${extension}`;
  };

  const uploadToBucket = async (file: File, userId: string): Promise<string> => {
    try {
      const fileName = generateFileName(userId, file);

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      console.log("Upload data:", data);

      if (error) {
        console.error("Error uploading to bucket:", error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  // Delete image from bucket
  const deleteFromBucket = async (imageUrl: string | null | undefined): Promise<void> => {
    try {
      if (!imageUrl) return;

      // Extract filename from URL
      const fileName = imageUrl.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error("Error deleting from bucket:", error);
      }
    } catch (error) {
      console.error("Delete from bucket failed:", error);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profile_image: null }));
    setPreviewImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  console.log("formData",formData)


  const getImageUrl = (user: User): string | null => {
    const url = STORAGE_TYPE === "bucket" ? user.profile_imageUrl : user.profile_image;
    return url || null;
  };


const getSafeImageSrc = (
  dynamicSrc: string | null, 
  fallbackSrc: string | StaticImageData | undefined
): string => {
  // Use dynamic source if available
  if (dynamicSrc) return dynamicSrc;
  
  // Handle fallback source
  if (!fallbackSrc) return `${img1}`;
  
  if (typeof fallbackSrc === 'string') {
    return fallbackSrc;
  }
  
  // Handle StaticImageData
  if (fallbackSrc && typeof fallbackSrc === 'object' && 'src' in fallbackSrc) {
    return fallbackSrc.src;
  }
  
  return `${img1}`;
};


   // DELETE USER Functionality - with both storage options
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      // Handle image deletion based on storage type
      if (STORAGE_TYPE === "bucket") {
        const userToDelete = users.find(u => u.id === id);
        if (userToDelete?.profile_imageUrl) {
          await deleteFromBucket(userToDelete.profile_imageUrl);
        }
      }
      // For Base64 storage, no need to delete from bucket

      // Delete user from database
      const { error } = await supabase.from("home_banner").delete().eq("id", id);

      if (error) {
        console.error("Error deleting user:", error);
        alert(`Error: ${error.message}`);
        return;
      }

      // Remove user from state
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Please try again.");
    }
  };


  const handleUpdateUser = async (
    values: UserFormValues,
    formikHelpers: FormikHelpers<UserFormValues>
  ) => {
    if (!editId || submitting) return;

    try {
      setSubmitting(true);
      let profile_imageData: string | null = null;
      let oldImageData: string | null | undefined = null;
      
      // Get existing user data
      const existingUser = users.find(u => u.id === editId);
      if (existingUser) {
        oldImageData = STORAGE_TYPE === "bucket" 
          ? existingUser.profile_imageUrl 
          : existingUser.profile_image;
      }
      
      // Process new image if selected
      if (formData.profile_image) {
        if (STORAGE_TYPE === "bucket") {
          // Delete old image from bucket if exists
          if (oldImageData) {
            await deleteFromBucket(oldImageData);
          }
          
          // Upload new image to bucket
          try {
            profile_imageData = await uploadToBucket(formData.profile_image, editId);
          } catch (uploadError) {
            console.error("Bucket upload failed:", uploadError);
            profile_imageData = oldImageData || null;
          }
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.profile_image);
            profile_imageData = splitIntoChunks(base64Image);
          } catch (convertError) {
            console.error("Base64 conversion failed:", convertError);
            profile_imageData = oldImageData ? splitIntoChunks(oldImageData) : null;
          }
        }
      } else {
        // Keep existing image
        profile_imageData = oldImageData || null;
      }

      // Update user in database
      const { data, error } = await supabase
        .from("home_banner")
        .update({
          title: values.title,
          heading: values.heading,
          btn_one: values.btn_one,
          btn_two: values.btn_two,
          profile_image: profile_imageData,
        })
        .eq("id", editId)
        .select()
        .single();
        setOpen(false);

      if (error) {
        console.error("Error updating user:", error);
        alert(`Error: ${error.message}`);
        return;
      }

      // Convert database user to component user
      const updatedUser = convertToUser(data);
      
      setUsers((prev) => prev.map((u) => (u.id === editId ? updatedUser : u)));
      resetForm();
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Error updating user. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  console.log("users isEdit",isEdit)
  
  return (

    
<div className="w-full   overflow-hidden">

      
      <div className="w-full relative">
              <button
        ref={prevRef}
        className="absolute text-black left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg"
      >
        ←
      </button>
      
      <button
        ref={nextRef}
        className="absolute text-black right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg"
      >
        →
      </button>

  <Swiper
            modules={[Navigation, Pagination, Autoplay]}
    spaceBetween={16}
    slidesPerView="auto"
          // slidesPerView={1}  // Default 1 slide

    loop={true}
    autoplay={{
      delay: 2500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    }}
    pagination={{ 
      clickable: true,
      dynamicBullets: true ,
              // el: '.custom-pagination',

    }}
    navigation={false} // Start mein false rakhein
        onSwiper={(swiper) => {
      swiperRef.current = swiper
    }}

    onInit={(swiper) => {
      // Alternative: Direct onclick handlers set karein
      if (prevRef.current && nextRef.current) {
        prevRef.current.onclick = () => swiper.slidePrev()
        nextRef.current.onclick = () => swiper.slideNext()
      }
    }}
             breakpoints={{
        640: { 
          slidesPerView: 2,
          slidesPerGroup: 1,
          spaceBetween: 16 
        },
        768: { 
          slidesPerView: 2,
          slidesPerGroup: 1,
          spaceBetween: 20
        },
        1024: { 
          slidesPerView: 2,
          slidesPerGroup: 1,
          spaceBetween: 24
        },
      }}


    // className="!overflow-y-visible"
    className="min-h-[520px]"
    

  >
    {/* eslint-disable @next/next/no-img-element */}
    {users?.map((u: User) => (
      <SwiperSlide 
        key={u.id} 

      >
        {/* <div className="relative group">

        <div className="flex flex-col gap-2 rounded-[30px] bg-[hsl(var(--color-background))] shadow-lg border-2 p-4 hover:-translate-y-4.5 transition-all duration-300 w-full h-full">
          <div className="relative">
            <img
                src={getSafeImageSrc(getImageUrl(u), imageSrc)}

              alt={u.title}
              className="w-full h-60 md:h-60 rounded-[15px] object-cover"
              
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <h3 className="font-semibold text-[12px] md:text-[14px]">{u.title}</h3>
            <p className="font-light text-[12px] md:text-[14px]">{u.heading}</p>


            <div className="flex gap-2">
                        <div>

                        <Button >
                          {u.btn_one}
                        </Button>
                        </div>
                        <div>

                        <Button >
                          {u.btn_two}
                        </Button>
                        </div>
                        <div>
                            <button
                          className="btn w-8 h-8   px-1 rounded-lg py-1 bg-red-400 mt-[2px]"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          <Trash className="text-white font-lg text-[12px] leading-[15px]"/>
                        </button>
                        </div>
                        <div>
                          <button
  type="button"
  onClick={() => handleEdit(u)}
  className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-400 hover:bg-green-500 transition"
>
  <div className="relative">
    <UserRound size={20} className="text-white" />

    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-white">
      <Pen size={14} className="text-white"/>
    </span>
  </div>
</button>

                        </div>

                      </div>
            
          </div>
        </div>
        </div> */}
        <div className="relative group min-h-[450px] perspective-1000">
          
  {/* Floating animation container */}
  <div className="
    absolute 
    inset-0 
    rounded-[30px] 
    bg-gradient-to-br 
    from-[hsl(var(--color-primary)/0.1)] 
    to-[hsl(var(--color-secondary)/0.05)]
    via-transparent 
    opacity-0 
    group-hover:opacity-100 
    transition-opacity 
    duration-700
    blur-xl
    -z-10
  "/>
  
  {/* Main card with enhanced hover effects */}
  <div className="
    flex flex-col gap-4 
    rounded-[30px] 
    bg-gradient-to-br 
    from-[hsl(var(--color-background))] 
    to-[hsl(var(--color-background)/0.95)]
    dark:from-[hsl(var(--color-background-dark))] 
    dark:to-[hsl(var(--color-background-dark)/0.95)]
    shadow-lg 
    shadow-[hsl(var(--color-shadow)/0.1)]
    border-2 
    border-[hsl(var(--color-border)/0.8)]
    p-5 
    h-full
    overflow-hidden
    
    
    
    /* Shadow and border effects */
    group-hover:shadow-2xl
    group-hover:shadow-[hsl(var(--color-primary)/0.2)]
    group-hover:border-[hsl(var(--color-primary)/0.4)]
    
    /* Glow animation on hover */
    group-hover:animate-[pulse-glow_2s_ease-in-out_infinite]
    
    /* All transitions */
    transition-all 
    duration-500 
    ease-[cubic-bezier(0.34,1.56,0.64,1)]
    
    /* Glass morphism effect */
    backdrop-blur-[2px]
    group-hover:backdrop-blur-[4px]
    
    /* Floating animation trigger */
    group-hover:animate-[float_3s_ease-in-out_infinite]
  ">
    
    {/* Shimmer effect overlay */}
    <div className="
      absolute 
      inset-0 
      rounded-[30px]
      bg-gradient-to-r 
      from-transparent 
      via-[hsl(var(--color-primary)/0.1)] 
      to-transparent 
      translate-x-[-150%]
      group-hover:translate-x-[150%]
      transition-transform 
      duration-[2s]
      ease-out
      pointer-events-none
      z-10
    "/>
    
    {/* Glowing border */}
    <div className="
      absolute 
      inset-0 
      rounded-[30px]
      border 
      border-transparent
      group-hover:border-[hsl(var(--color-primary)/0.3)]
      group-hover:shadow-[0_0_30px_hsl(var(--color-primary)/0.2)]
      transition-all 
      duration-700
      pointer-events-none
    "/>
    
    {/* Image container with parallax effect */}
    <div className="relative overflow-hidden rounded-[20px]">
      {/* Image gradient overlay */}
      <div className="
        absolute 
        inset-0 
        bg-gradient-to-t 
        from-[hsl(var(--color-background)/0.3)] 
        via-transparent 
        to-transparent
        opacity-0
        group-hover:opacity-100
        transition-opacity 
        duration-500
        z-10
      "/>
      
      <img
        src={getSafeImageSrc(getImageUrl(u), imageSrc)}
        alt={u.title}
        className="
          w-full 
          h-56 
          object-cover
          scale-100
          group-hover:scale-110
          group-hover:brightness-110
          transition-all 
          duration-700
          ease-out
          transform-gpu
        "
      />
      
      {/* Floating overlay effect */}
      <div className="
        absolute 
        inset-0 
        bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
        from-[hsl(var(--color-primary)/0.2)] 
        via-transparent 
        to-transparent
        opacity-0
        group-hover:opacity-70
        mix-blend-overlay
        transition-opacity 
        duration-500
        pointer-events-none
      "/>
    </div>

    {/* Content area with animated text */}
    <div className="flex flex-col gap-3 mt-3 flex-grow">
      {/* Title with color transition */}
      <h3 className="
        font-bold 
        text-lg
        text-[hsl(var(--color-foreground))]
        dark:text-[hsl(var(--color-foreground-dark))]
        group-hover:text-[hsl(var(--color-primary))]
        group-hover:drop-shadow-[0_2px_4px_hsl(var(--color-primary)/0.3)]
        transition-all 
        duration-400
        delay-75
        transform-gpu
        group-hover:translate-x-1
      ">
        {u.title}
      </h3>
      
      {/* Description with smooth reveal */}
      <p className="
        text-sm 
        text-[hsl(var(--color-muted-foreground))]
        dark:text-[hsl(var(--color-muted-foreground-dark))]
        group-hover:text-[hsl(var(--color-foreground))]
        dark:group-hover:text-[hsl(var(--color-foreground-dark))]
        transition-all 
        duration-400
        delay-100
        line-clamp-2
        group-hover:line-clamp-3
      ">
        {u.heading}
      </p>

      {/* Action buttons container - ALWAYS VISIBLE */}
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-[hsl(var(--color-border)/0.5)]">
        
        {/* Button One - Always Visible */}
        <Button 
          className="
            flex-1 
            min-w-[120px]
            bg-gradient-to-r 
            from-[hsl(var(--color-primary))] 
            to-[hsl(var(--color-primary)/0.9)]
            text-[hsl(var(--color-primary-foreground))]
            border-0
            shadow-md
            shadow-[hsl(var(--color-primary)/0.2)]
            hover:from-[hsl(var(--color-primary)/0.9)] 
            hover:to-[hsl(var(--color-primary)/0.8)]
            hover:shadow-lg
            hover:shadow-[hsl(var(--color-primary)/0.3)]
            hover:scale-105
            active:scale-95
            transition-all 
            duration-300
            transform-gpu
          "
        >
          {u.btn_one}
        </Button>
        
        {/* Button Two - Always Visible */}
        <Button 
          variant="outline"
          className="
            flex-1 
            min-w-[120px]
            border-[hsl(var(--color-border))]
            text-[hsl(var(--color-foreground))]
            dark:text-[hsl(var(--color-foreground-dark))]
            bg-[hsl(var(--color-background)/0.5)]
            dark:bg-[hsl(var(--color-background-dark)/0.5)]
            hover:border-[hsl(var(--color-primary))]
            hover:text-[hsl(var(--color-primary))]
            hover:bg-[hsl(var(--color-primary)/0.05)]
            hover:shadow-md
            hover:scale-105
            active:scale-95
            transition-all 
            duration-300
            transform-gpu
          "
        >
          {u.btn_two}
        </Button>

        {/* Edit and Delete buttons - ALWAYS VISIBLE with enhanced styling */}
        <div className="flex gap-2 ml-auto">
          
          {/* Edit Button - Enhanced */}
          <button
            type="button"
            onClick={() => handleEdit(u)}
            className="
              relative
              flex 
              items-center 
              justify-center 
              w-10 
              h-10 
              rounded-xl
              bg-gradient-to-br 
              from-[hsl(var(--color-success)/0.15)] 
              to-[hsl(var(--color-success)/0.1)]
              border 
              border-[hsl(var(--color-success)/0.3)]
              text-[hsl(var(--color-success))]
              hover:text-[hsl(var(--color-success))]
              hover:from-[hsl(var(--color-success)/0.25)] 
              hover:to-[hsl(var(--color-success)/0.2)]
              hover:border-[hsl(var(--color-success)/0.5)]
              hover:scale-110
              hover:shadow-lg
              hover:shadow-[hsl(var(--color-success)/0.2)]
              active:scale-95
              transition-all 
              duration-300
              transform-gpu
              group/edit
              overflow-hidden
            "
            aria-label="Edit"
          >
            {/* Shimmer effect for edit button */}
            <div className="
              absolute 
              inset-0 
              bg-gradient-to-r 
              from-transparent 
              via-white/20 
              to-transparent 
              translate-x-[-100%]
              group-hover/edit:translate-x-[100%]
              transition-transform 
              duration-1000
            "/>
            
            <Pen className="w-4 h-4 relative z-10" />
            
            {/* Tooltip */}
            <span className="
              absolute 
              -top-8 
              left-1/2 
              -translate-x-1/2 
              bg-[hsl(var(--color-success))] 
              text-[hsl(var(--color-success-foreground))] 
              text-xs 
              px-2 
              py-1 
              rounded-md 
              opacity-0 
              group-hover/edit:opacity-100 
              group-hover/edit:translate-y-0 
              translate-y-2 
              transition-all 
              duration-300
              whitespace-nowrap
              pointer-events-none
              z-20
              before:content-[''] 
              before:absolute 
              before:bottom-[-4px] 
              before:left-1/2 
              before:-translate-x-1/2 
              before:border-4 
              before:border-transparent 
              before:border-t-[hsl(var(--color-success))] 
            ">
              Edit
            </span>
          </button>

          {/* Delete Button - Enhanced */}
          <button
            type="button"
            onClick={() => handleDeleteUser(u.id)}
            className="
              relative
              flex 
              items-center 
              justify-center 
              w-10 
              h-10 
              rounded-xl
              bg-gradient-to-br 
              from-[hsl(var(--color-destructive)/0.15)] 
              to-[hsl(var(--color-destructive)/0.1)]
              border 
              border-[hsl(var(--color-destructive)/0.3)]
              text-[hsl(var(--color-destructive))]
              hover:text-[hsl(var(--color-destructive))]
              hover:from-[hsl(var(--color-destructive)/0.25)] 
              hover:to-[hsl(var(--color-destructive)/0.2)]
              hover:border-[hsl(var(--color-destructive)/0.5)]
              hover:scale-110
              hover:shadow-lg
              hover:shadow-[hsl(var(--color-destructive)/0.2)]
              active:scale-95
              transition-all 
              duration-300
              transform-gpu
              group/delete
              overflow-hidden
            "
            aria-label="Delete"
          >
            {/* Shimmer effect for delete button */}
            <div className="
              absolute 
              inset-0 
              bg-gradient-to-r 
              from-transparent 
              via-white/20 
              to-transparent 
              translate-x-[-100%]
              group-hover/delete:translate-x-[100%]
              transition-transform 
              duration-1000
            "/>
            
            <Trash className="w-4 h-4 relative z-10" />
            
            {/* Tooltip */}
            <span className="
              absolute 
              -top-8 
              left-1/2 
              -translate-x-1/2 
              bg-[hsl(var(--color-destructive))] 
              text-[hsl(var(--color-destructive-foreground))] 
              text-xs 
              px-2 
              py-1 
              rounded-md 
              opacity-0 
              group-hover/delete:opacity-100 
              group-hover/delete:translate-y-0 
              translate-y-2 
              transition-all 
              duration-300
              whitespace-nowrap
              pointer-events-none
              z-20
              before:content-[''] 
              before:absolute 
              before:bottom-[-4px] 
              before:left-1/2 
              before:-translate-x-1/2 
              before:border-4 
              before:border-transparent 
              before:border-t-[hsl(var(--color-destructive))] 
            ">
              Delete
            </span>
          </button>
        </div>
      </div>
    </div>
    
    {/* Particle effect dots */}
    <div className="
      absolute 
      inset-0 
      rounded-[30px] 
      overflow-hidden 
      pointer-events-none
      opacity-0
      group-hover:opacity-100
      transition-opacity 
      duration-700
    ">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="
            absolute 
            w-1 
            h-1 
            rounded-full 
            bg-[hsl(var(--color-primary)/0.4)]
            animate-[float_3s_ease-in-out_infinite]
          "
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
    
    {/* Corner accent */}
    <div className="
      absolute 
      top-3 
      right-3 
      w-3 
      h-3 
      rounded-full 
      bg-gradient-to-r 
      from-[hsl(var(--color-primary))] 
      to-[hsl(var(--color-secondary))]
      opacity-70
      group-hover:opacity-100
      group-hover:scale-150
      transition-all 
      duration-500
    "/>
  </div>
</div>
      </SwiperSlide>
    ))}
          
    <div className="custom-pagination flex gap-2 mt-4"></div>
  </Swiper>
</div>


      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Slide" : "Create Slide"}</DialogTitle>
            </DialogHeader>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={isEdit ? handleUpdateUser : handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div>
                    <div className="my-2">
                      <Label htmlFor="title">Title</Label>
                      <Field
                        as={Input}
                        id="title"
                        name="title"
                        placeholder="John Doe"
                        className={errors.title && touched.title ? 'border-destructive' : ''}
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-sm text-red-400"
                      />
                    </div>
                    <div className="my-2">
                      <Label htmlFor="heading">Heading</Label>
                      <Field
                        as={Input}
                        id="heading"
                        name="heading"
                        placeholder="John Doe"
                        className={errors.heading && touched.heading ? 'border-destructive' : ''}
                      />
                      <ErrorMessage
                        name="heading"
                        component="div"
                        className="text-sm text-red-400"
                      />
                    </div>
                    <div className='flex w-full my-2 gap-2'>
                      <div>
                        <Label htmlFor="btn_one">Button 1</Label>
                        <Field
                          as={Input}
                          id="btn_one"
                          name="btn_one"
                          placeholder="John Doe"
                          className={errors.btn_one && touched.btn_one ? 'border-destructive' : ''}
                        />
                        <ErrorMessage
                          name="btn_one"
                          component="div"
                          className="text-sm text-red-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="btn_two">Button 2</Label>
                        <Field
                          as={Input}
                          id="btn_two"
                          name="btn_two"
                          placeholder="John Doe"
                          className={errors["btn_two"] && touched["btn_two"] ? 'border-destructive' : ''}
                        />
                        <ErrorMessage
                          name="btn_two"
                          component="div"
                          className="text-sm text-red-400"
                        />
                      </div>
                    </div>

                    {/* <div className="mb-3">
                      <label className="form-label">Background Image (Max 1MB)</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="form-control mb-2"
                        disabled={submitting}
                      />

                      {previewImage && (
                        <div className="mt-2 text-center">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ maxWidth: "150px", maxHeight: "150px" }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger mt-2"
                            onClick={handleRemoveImage}
                            disabled={submitting}
                          >
                            Remove Image
                          </button>
                        </div>
                      )}

                      {!previewImage && isEdit && (
                        <div className="text-muted small">
                          Leave empty to keep existing image
                        </div>
                      )}

                      <div className="form-text">
                        {STORAGE_TYPE === "bucket"
                          ? "Images are stored in secure cloud storage bucket."
                          : "Images are automatically compressed and stored in database."}
                      </div>
                    </div> */}
      <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Background Image (Max 1MB)
  </label>

  {/* File Upload Card - Compact for modal */}
  <div 
    className={`
      relative border-2 border-dashed rounded-lg transition-all duration-200
      ${!previewImage 
        ? 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800' 
        : 'border-transparent'
      }
      ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      max-w-full
    `}
    onClick={() => !submitting && fileInputRef.current?.click()}
  >
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleImageChange}
      accept="image/*"
      className="hidden"
      disabled={submitting}
    />

    {!previewImage ? (
      <div className="p-4 text-center">
        <div className="mx-auto w-10 h-10 mb-2 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-500 dark:text-gray-400"
          >
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
            <line x1="16" x2="22" y1="5" y2="5"/>
            <line x1="19" x2="19" y1="2" y2="8"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span className="font-medium text-primary-600 dark:text-primary-400">
            Click to upload
          </span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
          PNG, JPG, GIF (max 1MB)
        </p>
        
        {isEdit && (
          <div className="mt-2 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md inline-block">
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              Leave empty to keep existing
            </p>
          </div>
        )}
      </div>
    ) : (
      <div className="p-3">
        <div className="flex items-center gap-3">
          {/* Image Preview - Compact */}
          <div className="relative group flex-shrink-0">
            <img
              src={previewImage}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-md shadow"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                disabled={submitting}
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Remove Button - Compact */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
              Image selected
            </p>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={submitting}
              className="w-30 py-1.5 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 text-sm"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Storage Info - Compact */}
  <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-primary-500 mt-0.5 flex-shrink-0"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
      <span>
        {STORAGE_TYPE === "bucket" 
          ? "Stored in secure cloud storage bucket."
          : "Automatically compressed and stored."
        }
      </span>
    </p>
  </div>
</div>
                    

                    <DialogFooter className="flex gap-2 mt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </div>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default HomeSliderCard