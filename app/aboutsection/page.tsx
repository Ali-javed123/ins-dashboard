

// "use client";
// import { FC, useCallback, useEffect, useState, useRef } from 'react'
// import type { AboutSectionData } from "@/types/aboutSection";
// import { Settings, ShieldCheck } from "lucide-react";

// import { Input } from '@/components/ui/input'
// import { supabase } from "@/lib/supabase-client"

// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
// import * as Yup from 'yup'


// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog'




// const BUCKET_NAME = "home-banner";
// const STORAGE_TYPE = "bucket";
// const CHUNK_SIZE = 60000;
// const DELIMITER = '|||CHUNK|||';
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024;


// interface DatabaseUser {
//   id: string;
//   title: string;
//   heading: number;
// created_at:string
//   para: string;
//   imgOne: string;
//   imgTwo: string;
//   subHeading: string;
//   subpara: string;
//   coliconOne: string;
//   coliconTwo: string;
//   colHeadOne: string;
//   colHeadTwo: string;
//   colparaOne: string;
//   colparaTwo: string;

//   colbtn: string;



//   btnOne: string;   // ✅ add
//   btnTwo: string;   // ✅ add

//   profileImage: string | null; // Changed from 'image' to 'profileImage'
//   profileImageUrl?: string | null; // undefined भी allow करें
// }



// interface FormData {
//   title: string;
//   heading: string;
//   btnOne: string;
//   btnTwo: string;
//   profileImage: File | null;
// }
// export const aboutSectionData: AboutSectionData = {
//   badge: "ABOUT US",
//   heading: "Provide the Best Easy Solution for Your IT Problem",
//   description:
//     "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
//   highlightTitle: "Deliver Perfect Solution",
//   highlightDescription:
//     "There are many variations passages of Lorem Ipsum available, but the majority.",
//   colbtn: "More Details",
//   features: [
//     {
//       id: 1,
//       title: "Manage Tech Services",
//       description: "There are many variations of passages of Lorem.",
//       icon: <Settings size={20} />,
//     },
//     {
//       id: 2,
//       title: "IT Consulting Solution",
//       description: "There are many variations of passages of Lorem.",
//       icon: <ShieldCheck size={20} />,
//     },
//   ],
// };

// interface User {
//   id: string;
//   title: string;
//   heading: number;
//   para: string;
//   imgOne: string;
//   imgTwo: string;
//   subHeading: string;
//   subpara: string;
//   coliconOne: string;
//   coliconTwo: string;
//   colHeadOne: string;
//   colHeadTwo: string;
//   colparaOne: string;
//   colparaTwo: string;
// created_at:string
//   colbtn: string;

//   btnOne: string;   // ✅ add
//   btnTwo: string;   // ✅ add



//   profileImage: string | null; // Changed from 'image' to 'profileImage'
//   profileImageUrl?: string | null; // undefined भी allow करें
// }



// interface UserFormValues {
//    title?: string;
//   heading?: string;
//   para?: string;
//   imgOne?: string;
//   imgTwo?: string;
//   subHeading?: string;
//   subpara?: string;
//   coliconOne?: string;
//   coliconTwo?: string;
//   colHeadOne?: string;
//   colHeadTwo?: string;
//   colparaOne?: string;
//   colparaTwo?: string;
// created_at?:string
//   colbtn?: string;

// }
// const Page: FC = () => {
  

//     const [users, setUsers] = useState<User[]>([]);
//     const [loading, setLoading] = useState(true);
// const [formData, setFormData] = useState<FormData>({
//     title: "",
//     heading: "",
//     btnOne: "",
//     btnTwo: "",
//     profileImage: null,
//   });



//     const validationSchema = Yup.object({
//       title: Yup.string()
//         .min(2, 'tile must be at least 2 characters')
//         .required('title is required'),
//       heading: Yup.string()
//         .min(2, 'Heading must be at least 2 characters')
//         .required('Heading is required'),
//       btnOne: Yup.string()
//         .min(2, 'btn one must be at least 2 characters')
//         .required('btn one is required'),
//       btnTwo: Yup.string()
//         .min(2, 'btn two must be at least 2 characters')
//         .required('btn two is required'),
//     })
  
//     const initialValues: UserFormValues = {
//       title: '',
//   heading: '',
//   para: '',
//   imgOne: '',
//   imgTwo: '',
//   subHeading: '',
//   subpara: '',
//   coliconOne: '',
//   coliconTwo: '',
//   colHeadOne: '',
//   colHeadTwo: '',
//   colparaOne: '',
//   colparaTwo: '',
//   colbtn: '',

//     }
  


//   const fetchUsers = useCallback(async () => {
//       try {
//         const { data, error } = await supabase
//           .from("aboutSection")
//           .select("*")
//           .order("created_at", { ascending: true });
//         console.log("Fetched users:", data);
  
//         if (error) {
//           console.error("Error fetching users:", error);
//           return;
//         }
  
//         // Safely convert database users to component users
//         const processedUsers = (data || []).map((dbUser) => convertToUser(dbUser as DatabaseUser));
  
//         setUsers(processedUsers);
//       } catch (error) {
//         console.error("Unexpected error:", error);
//       } finally {
//         setLoading(false);
//       }
//     }, []);
  
//     useEffect(() => {
//       fetchUsers();
//     }, [fetchUsers]);
  


//   //    const convertToUser = (dbUser: DatabaseUser): User => {
//   //   if (STORAGE_TYPE === "bucket") {
//   //     // For bucket storage
//   //     return {
//   //       id: dbUser.id,
//   //       title: dbUser.title,
//   //       heading: dbUser.heading,
//   //       btnOne: dbUser.btnOne,
//   //       btnTwo: dbUser.btnTwo,
//   //       profileImage: null,
//   //       profileImageUrl: dbUser.profileImage || null

        
//   //     };
//   //   } else {
//   //     // For Base64 storage
//   //     return {
//   //       id: dbUser.id,
//   //       title: dbUser.title,
//   //       heading: dbUser.heading,
//   //       btnOne: dbUser.btnOne,
//   //       btnTwo: dbUser.btnTwo,
//   //       profileImage: reconstructFromChunks(dbUser.profileImage),
//   //       profileImageUrl: null

//   //     };
//   //   }
//   // };
//   const convertToUser = (dbUser: DatabaseUser): User => {
//   if (STORAGE_TYPE === "bucket") {
//     return {
//       id: dbUser.id,
//       title: dbUser.title,
//       heading: dbUser.heading,
//       para: dbUser.para,
//       imgOne: dbUser.imgOne,
//       imgTwo: dbUser.imgTwo,
//       subHeading: dbUser.subHeading,
//       subpara: dbUser.subpara,
//       coliconOne: dbUser.coliconOne,
//       coliconTwo: dbUser.coliconTwo,
//       colHeadOne: dbUser.colHeadOne,
//       colHeadTwo: dbUser.colHeadTwo,
//       colparaOne: dbUser.colparaOne,
//       colparaTwo: dbUser.colparaTwo,
//       colbtn: dbUser.colbtn,

//       btnOne: dbUser.btnOne ?? "", // agar DatabaseUser mein hai
//       btnTwo: dbUser.btnTwo ?? "",

//       profileImage: null,
//       profileImageUrl: dbUser.profileImage ?? null,
//       created_at: dbUser.created_at,
//     };
//   } else {
//     return {
//       id: dbUser.id,
//       title: dbUser.title,
//       heading: dbUser.heading,
//       para: dbUser.para,
//       imgOne: dbUser.imgOne,
//       imgTwo: dbUser.imgTwo,
//       subHeading: dbUser.subHeading,
//       subpara: dbUser.subpara,
//       coliconOne: dbUser.coliconOne,
//       coliconTwo: dbUser.coliconTwo,
//       colHeadOne: dbUser.colHeadOne,
//       colHeadTwo: dbUser.colHeadTwo,
//       colparaOne: dbUser.colparaOne,
//       colparaTwo: dbUser.colparaTwo,
//       colbtn: dbUser.colbtn,

//     btnOne: dbUser.btnOne ?? "",
//       btnTwo: dbUser.btnTwo ?? "",

//       profileImage: reconstructFromChunks(dbUser.profileImage),
//       profileImageUrl: null,
//       created_at: dbUser.created_at,
//     };
//   }
// };

// const reconstructFromChunks = (chunkedString: string | null | undefined): string | null => {
//     if (!chunkedString) return null;

//     if (!chunkedString.includes(DELIMITER)) {
//       return chunkedString;
//     }

//     return chunkedString.split(DELIMITER).join('');
//   };
// return(
//   <>
//         <section className="bg-[hsl(var(--color-background))] text-white py-20">
//       <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">

//         {/* LEFT IMAGES */}
//       <div className="relative w-full max-w-[520px] h-[520px]">

//   {/* Big Image */}
//   {/* eslint-disable-next-line @next/next/no-img-element */}
//   <img
//     src="/assets/images/about/about-1-1.png"
//     alt="About main"
//     className="
//       absolute
//       top-0
//       left-0
//       w-[90%]
//       h-[95%]
//       object-cover
//       rounded-2xl
//       z-10
//       shadow-xl
//     "
//   />

//   {/* Small Overlay Image */}
//   {/* eslint-disable-next-line @next/next/no-img-element */}
//   <img
//     src="/assets/images/about/about-1-2.png"
//     alt="About overlay"
//     className="
//       absolute
//       bottom-0
//       right-0
//       w-[55%]
//       h-[55%]
//       object-cover
//       rounded-2xl
//       z-20
//       shadow-2xl
//       border-8 border-black
//     "
//   />

//   {/* Floating Circle Icon */}
//   {/* <div
//     className="
//       absolute
//       left-[-30px]
//       top-1/2
//       -translate-y-1/2
//       bg-blue-600
//       w-20
//       h-20
//       rounded-full
//       flex
//       items-center
//       justify-center
//       shadow-xl
//       z-30
//     "
//   >
//     {aboutSectionData.features[0].icon}
//   </div> */}
// </div>



//         {/* RIGHT CONTENT */}
//         <div>
//           <span className="inline-block mb-3 border-l-4 border-[var(--color-theme)]  pl-3 text-sm tracking-widest text-[var(--color-theme)]">
//             {aboutSectionData.badge}
//           </span>

//           <h2 className="text-4xl text-black dark:text-slate-50 font-bold leading-tight mb-6">
//             {aboutSectionData.heading}
//           </h2>

//           <p className="text-black dark:text-slate-50 mb-8">
//             {aboutSectionData.description}
//           </p>

//           {/* Highlight Card */}
//           <div className="bg-neutral-900 dark:bg-slate-900 border border-neutral-800 rounded-xl p-6 mb-8">
//             <h4 className="font-semibold mb-2">
//               {aboutSectionData.highlightTitle}
//             </h4>
//             <p className="text-sm text-slate-50">
//               {aboutSectionData.highlightDescription}
//             </p>
//           </div>

//           {/* Features */}
//         <div className="grid sm:grid-cols-2 gap-6 mb-8">
//   {aboutSectionData.features.map((item) => (
//     <div
//       key={item.id}
//       className="flex items-start gap-x-4"
//     >
//       {/* Icon */}
//       <div className="mt-4 flex h-10 w-10 p-3 rounded-full items-center justify-center items-center justify-center rounded-lg bg-green-100 text-[var(--color-theme)]">
//         {item.icon}
//       </div>

//       {/* Text */}
//       <div>
//         <h5 className="font-medium leading-tight text-black dark:text-slate-50">
//           {item.title}
//         </h5>
//         <p className="text-sm  mt-1 text-black dark:text-slate-50">
//           {item.description}
//         </p>
//       </div>
//     </div>
//   ))}
// </div>


//           <button className="bg-[var(--color-theme)] hover:bg-[var(--color-theme-hover)] transition px-6 py-3 rounded-lg font-medium">
//             {aboutSectionData.colbtn}
//           </button>
//         </div>

//       </div>
//     </section>
  
//   </>

// )
// }
// export default Page



// components/AboutSectionCard.tsx






// 'use client'

// import { FC, useCallback, useEffect, useState, useRef } from 'react'
// import { Settings, ShieldCheck } from "lucide-react"
// import { Input } from '@/components/ui/input'
// import { supabase } from "@/lib/supabase-client"
// import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikProps } from 'formik'

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
// import { Pen, Trash } from "lucide-react"
// import type { AboutSectionData } from "@/types/aboutSection";

// // Constants
// const BUCKET_NAME = "aboutSection"
// const STORAGE_TYPE = "bucket"
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024

// // Types
// interface DatabaseAboutSection {
//   id: string
//   title: string
//   heading: string
//   para: string
//   imgOne: string | null
//   imgTwo: string | null
  
//   coliconOne: string
//   coliconTwo: string
//   colHeadOne: string
//   colHeadTwo: string
//   colparaOne: string
//   colparaTwo: string
//   colbtn: string
  
//   // badge: string
//   highlightTitle: string
//   highlightDescription: string
//   created_at?: string
// }

// interface AboutSection {
//   id: string
//   title: string
//   heading: string
//   para: string
//   imgOne: string | null
//   imgTwo: string | null
  
//   coliconOne: string
//   coliconTwo: string
//   colHeadOne: string
//   colHeadTwo: string
//   colparaOne: string
//   colparaTwo: string
 
//   // badge?: string
//   highlightTitle: string
//   highlightDescription: string
//   colbtn: string
//   imgOneUrl?: string | null
//   imgTwoUrl?: string | null
// }
// export const aboutSectionData: AboutSectionData = {
//   badge: "ABOUT US",
//   heading: "Provide the Best Easy Solution for Your IT Problem",
//   description:
//     "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
//   highlightTitle: "Deliver Perfect Solution",
//   highlightDescription:
//     "There are many variations passages of Lorem Ipsum available, but the majority.",
//   colbtn: "More Details",
//   features: [
//     {
//       id: 1,
//       title: "Manage Tech Services",
//       description: "There are many variations of passages of Lorem.",
//       icon: <Settings size={20} />,
//     },
//     {
//       id: 2,
//       title: "IT Consulting Solution",
//       description: "There are many variations of passages of Lorem.",
//       icon: <ShieldCheck size={20} />,
//     },
//   ],
// };
// interface AboutSectionFormValues {
//   title: string
//   heading: string
//   para: string
  
//   coliconOne: string
//   coliconTwo: string
//   colHeadOne: string
//   colHeadTwo: string
//   colparaOne: string
//   colparaTwo: string
//   colbtn: string
//   btnOne?: string
//   btnTwo?: string
//   // badge: string
//   highlightTitle: string
//   highlightDescription: string
// }

// interface AboutSectionFormData {
//   title: string
//   heading: string
//   para: string
//   subHeading?: string
//   subpara?: string
//   coliconOne: string
//   coliconTwo: string
//   colHeadOne: string
//   colHeadTwo: string
//   colparaOne: string
//   colparaTwo: string
//   colbtn: string
//   btnOne?: string
//   btnTwo?: string
//   // badge: string
//   highlightTitle: string
//   highlightDescription: string
//   imgOne: File | null
//   imgTwo: File | null
// }

// interface AboutSectionCardProps {
//   open: boolean
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>
// }

// const AboutSectionCard: FC<AboutSectionCardProps> = () => {
//   // State
//   const [sections, setSections] = useState<AboutSection[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isEdit, setIsEdit] = useState(false)
//   const [editId, setEditId] = useState<string | null>(null)


//     const [open, setOpen] = useState(false)

//   const [submitting, setSubmitting] = useState(false)
//   const [previewImgOne, setPreviewImgOne] = useState<string | null>(null)
//   const [previewImgTwo, setPreviewImgTwo] = useState<string | null>(null)
  
//   const fileInputRefOne = useRef<HTMLInputElement>(null)
//   const fileInputRefTwo = useRef<HTMLInputElement>(null)

//   const [formData, setFormData] = useState<AboutSectionFormData>({
//     title: "",
//     heading: "",
//     para: "",
    
//     coliconOne: "",
//     coliconTwo: "",
//     colHeadOne: "",
//     colHeadTwo: "",
//     colparaOne: "",
//     colparaTwo: "",
   
//     // badge: "ABOUT US",
//     highlightTitle: "",
//     highlightDescription: "",
//     colbtn: "More Details",
//     imgOne: null,
//     imgTwo: null
//   })

//   // Validation Schema
//   const validationSchema = Yup.object({
//     title: Yup.string()
//       .min(2, 'Title must be at least 2 characters')
//       .required('Title is required'),
//     heading: Yup.string()
//       .min(2, 'Heading must be at least 2 characters')
//       .required('Heading is required'),
//     para: Yup.string()
//       .min(10, 'Description must be at least 10 characters')
//       .required('Description is required'),
    
//     colHeadOne: Yup.string()
//       .min(2, 'Column 1 heading is required'),
//     colparaOne: Yup.string()
//       .min(10, 'Column 1 description is required'),
//     colHeadTwo: Yup.string()
//       .min(2, 'Column 2 heading is required'),
//     colparaTwo: Yup.string()
//       .min(10, 'Column 2 description is required'),
    
//   })

//   // Initial Form Values
//   const initialValues: AboutSectionFormValues = {
//     title: formData.title || '',
//     heading: formData.heading || '',
//     para: formData.para || '',
//     // subHeading: formData.subHeading || '',
//     // subpara: formData.subpara || '',
//     coliconOne: formData.coliconOne || '',
//     coliconTwo: formData.coliconTwo || '',
//     colHeadOne: formData.colHeadOne || '',
//     colHeadTwo: formData.colHeadTwo || '',
//     colparaOne: formData.colparaOne || '',
//     colparaTwo: formData.colparaTwo || '',
    
//     // badge: formData.badge || 'ABOUT US',
//     highlightTitle: formData.highlightTitle || '',
//     highlightDescription: formData.highlightDescription || '',
//     colbtn: formData.colbtn || 'More Details'
//   }

//   // Reset Form
//   const resetForm = () => {
//     setFormData({
//       title: "",
//       heading: "",
//       para: "",
     
//       coliconOne: "",
//       coliconTwo: "",
//       colHeadOne: "",
//       colHeadTwo: "",
//       colparaOne: "",
//       colparaTwo: "",
    
//       // badge: "ABOUT US",
//       highlightTitle: "",
//       highlightDescription: "",
//       colbtn: "More Details",
//       imgOne: null,
//       imgTwo: null
//     })
//     setEditId(null)
//     setPreviewImgOne(null)
//     setPreviewImgTwo(null)
//     setIsEdit(false)
//     setSubmitting(false)
    
//     if (fileInputRefOne.current) fileInputRefOne.current.value = ""
//     if (fileInputRefTwo.current) fileInputRefTwo.current.value = ""
//   }

//   // Fetch About Sections
//   const fetchSections = useCallback(async () => {
//     try {
//       setLoading(true)
//       const { data, error } = await supabase
//         .from("aboutSection")
//         .select("*")
//         .order("created_at", { ascending: true })

//       if (error) {
//         console.error("Error fetching sections:", error)
//         return
//       }

//       const processedSections = (data || []).map(convertToAboutSection)
//       setSections(processedSections)
//     } catch (error) {
//       console.error("Unexpected error:", error)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchSections()
//   }, [fetchSections])

//   // Convert Database to Component Type
//   const convertToAboutSection = (dbSection: DatabaseAboutSection): AboutSection => {
//     if (STORAGE_TYPE === "bucket") {
//       return {
//         id: dbSection.id,
//         title: dbSection.title || "",
//         heading: dbSection.heading || "",
//         para: dbSection.para || "",
//         imgOne: null,
//         imgTwo: null,
     
//         coliconOne: dbSection.coliconOne || "",
//         coliconTwo: dbSection.coliconTwo || "",
//         colHeadOne: dbSection.colHeadOne || "",
//         colHeadTwo: dbSection.colHeadTwo || "",
//         colparaOne: dbSection.colparaOne || "",
//         colparaTwo: dbSection.colparaTwo || "",
       
//         // badge: dbSection.badge || "ABOUT US",
//         highlightTitle: dbSection.highlightTitle || "",
//         highlightDescription: dbSection.highlightDescription || "",
//         colbtn: dbSection.colbtn || "More Details",
//         imgOneUrl: dbSection.imgOne,
//         imgTwoUrl: dbSection.imgTwo
//       }
//     } else {
//       return {
//         id: dbSection.id,
//         title: dbSection.title || "",
//         heading: dbSection.heading || "",
//         para: dbSection.para || "",
//         imgOne: dbSection.imgOne,
//         imgTwo: dbSection.imgTwo,
        
//         coliconOne: dbSection.coliconOne || "",
//         coliconTwo: dbSection.coliconTwo || "",
//         colHeadOne: dbSection.colHeadOne || "",
//         colHeadTwo: dbSection.colHeadTwo || "",
//         colparaOne: dbSection.colparaOne || "",
//         colparaTwo: dbSection.colparaTwo || "",
        
//         // badge: dbSection.badge || "ABOUT US",
//         highlightTitle: dbSection.highlightTitle || "",
//         highlightDescription: dbSection.highlightDescription || "",
//         colbtn: dbSection.colbtn || "More Details"
//       }
//     }
//   }

//   // Handle Edit
//   const handleEdit = (section: AboutSection) => {
//     setIsEdit(true)
//     setEditId(section.id)
//     setFormData({
//       title: section.title,
//       heading: section.heading,
//       para: section.para,
//       // subHeading: section.subHeading,
//       // subpara: section.subpara,
//       coliconOne: section.coliconOne,
//       coliconTwo: section.coliconTwo,
//       colHeadOne: section.colHeadOne,
//       colHeadTwo: section.colHeadTwo,
//       colparaOne: section.colparaOne,
//       colparaTwo: section.colparaTwo,
//       colbtn: section.colbtn,
     
//       // badge: section.badge,
//       highlightTitle: section.highlightTitle,
//       highlightDescription: section.highlightDescription,
//       imgOne: null,
//       imgTwo: null
//     })
    
//     // Set preview images
//     if (STORAGE_TYPE === "bucket") {
//       setPreviewImgOne(section.imgOneUrl || null)
//       setPreviewImgTwo(section.imgTwoUrl || null)
//     } else {
//       setPreviewImgOne(section.imgOne)
//       setPreviewImgTwo(section.imgTwo)
//     }
    
//     setOpen(true)
//   }

//   // Generate File Name
//   const generateFileName = (sectionId: string, file: File, imageNumber: number): string => {
//     const timestamp = Date.now()
//     const extension = file.name.split('.').pop() || 'jpg'
//     return `about_${sectionId}_img${imageNumber}_${timestamp}.${extension}`
//   }

//   // Upload to Bucket
//   const uploadToBucket = async (file: File, sectionId: string, imageNumber: number): Promise<string> => {
//     try {
//       const fileName = generateFileName(sectionId, file, imageNumber)
      
//       const { data, error } = await supabase.storage
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
//   const deleteFromBucket = async (imageUrl: string | null | undefined): Promise<void> => {
//     try {
//       if (!imageUrl) return
      
//       const fileName = imageUrl.split('/').pop()
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
//   const handleImageChange = (
//     e: React.ChangeEvent<HTMLInputElement>, 
//     imageNumber: 1 | 2
//   ) => {
//     const file = e.target.files?.[0] || null
    
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         alert('Please select an image file')
//         return
//       }

//       if (file.size > MAX_IMAGE_SIZE) {
//         alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`)
//         return
//       }

//       if (imageNumber === 1) {
//         setFormData(prev => ({ ...prev, imgOne: file }))
//         const previewUrl = URL.createObjectURL(file)
//         setPreviewImgOne(previewUrl)
//       } else {
//         setFormData(prev => ({ ...prev, imgTwo: file }))
//         const previewUrl = URL.createObjectURL(file)
//         setPreviewImgTwo(previewUrl)
//       }
//     }
//   }

//   // Handle Remove Image
//   const handleRemoveImage = (imageNumber: 1 | 2) => {
//     if (imageNumber === 1) {
//       setFormData(prev => ({ ...prev, imgOne: null }))
//       setPreviewImgOne(null)
//       if (fileInputRefOne.current) fileInputRefOne.current.value = ""
//     } else {
//       setFormData(prev => ({ ...prev, imgTwo: null }))
//       setPreviewImgTwo(null)
//       if (fileInputRefTwo.current) fileInputRefTwo.current.value = ""
//     }
//   }

//   // Cleanup preview URLs
//   useEffect(() => {
//     return () => {
//       if (previewImgOne) URL.revokeObjectURL(previewImgOne)
//       if (previewImgTwo) URL.revokeObjectURL(previewImgTwo)
//     }
//   }, [previewImgOne, previewImgTwo])

//   // Handle Submit (Create)
//   const handleSubmit = async (
//     values: AboutSectionFormValues,
//     formikHelpers: FormikHelpers<AboutSectionFormValues>
//   ) => {
//     if (submitting) return

//     try {
//       console.log("Submitting form with values:", values);

//       setSubmitting(true)

//       // First create section without images
//       const { data: sectionData, error: sectionError } = await supabase
//         .from("aboutSection")
//         .insert([
//           {
//             title: values.title,
//             heading: values.heading,
//             para: values.para,
//             imgOne: null,
//             imgTwo: null,
            
//             coliconOne: values.coliconOne,
//             coliconTwo: values.coliconTwo,
//             colHeadOne: values.colHeadOne,
//             colHeadTwo: values.colHeadTwo,
//             colparaOne: values.colparaOne,
//             colparaTwo: values.colparaTwo,
//             colbtn: values.colbtn,
         
//             // badge: values.badge,
//             highlightTitle: values.highlightTitle,
//             highlightDescription: values.highlightDescription,
//           }
//         ])
//         .select()
//         .single()

//       if (sectionError) {
//         console.error("Error adding section:", sectionError)
//         alert(`Error: ${sectionError.message}`)
//         return
//       }

//       let imgOneUrl: string | null = null
//       let imgTwoUrl: string | null = null

//       // Upload images to bucket if selected
//       if (formData.imgOne) {
//         try {
//           imgOneUrl = await uploadToBucket(formData.imgOne, sectionData.id, 1)
//         } catch (error) {
//           console.error("Failed to upload image 1:", error)
//         }
//       }

//       if (formData.imgTwo) {
//         try {
//           imgTwoUrl = await uploadToBucket(formData.imgTwo, sectionData.id, 2)
//         } catch (error) {
//           console.error("Failed to upload image 2:", error)
//         }
//       }

//       // Update section with image URLs
//       if (imgOneUrl || imgTwoUrl) {
//         const { error: updateError } = await supabase
//           .from("aboutSection")
//           .update({ 
//             imgOne: imgOneUrl,
//             imgTwo: imgTwoUrl
//           })
//           .eq("id", sectionData.id)

//         if (updateError) {
//           console.error("Error updating section with images:", updateError)
//         }
//       }

//       // Create new section object
//       const newSection: AboutSection = {
//         id: sectionData.id,
//         title: sectionData.title || "",
//         heading: sectionData.heading || "",
//         para: sectionData.para || "",
//         imgOne: null,
//         imgTwo: null,
       
//         coliconOne: sectionData.coliconOne || "",
//         coliconTwo: sectionData.coliconTwo || "",
//         colHeadOne: sectionData.colHeadOne || "",
//         colHeadTwo: sectionData.colHeadTwo || "",
//         colparaOne: sectionData.colparaOne || "",
//         colparaTwo: sectionData.colparaTwo || "",
//         // btnOne: sectionData.btnOne || "",
//         // btnTwo: sectionData.btnTwo || "",
//         // badge: sectionData.badge || "ABOUT US",
//         highlightTitle: sectionData.highlightTitle || "",
//         highlightDescription: sectionData.highlightDescription || "",
//         colbtn: sectionData.colbtn || "More Details",
//         // imgOneUrl: imgOneUrl,
//         // imgTwoUrl: imgTwoUrl
//       }

//       // Update state
//       setSections(prev => {
//         const exists = prev.some(s => s.id === newSection.id)
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
//       alert(error instanceof Error ? `Error: ${error.message}` : "Error saving section")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Handle Update
//   const handleUpdate = async (
//     values: AboutSectionFormValues,
//     formikHelpers: FormikHelpers<AboutSectionFormValues>
//   ) => {
//     if (!editId || submitting) return

//     try {
//       setSubmitting(true)

//       // Get existing section data
//       const existingSection = sections.find(s => s.id === editId)
//       let imgOneUrl: string | null = existingSection?.imgOneUrl || null
//       let imgTwoUrl: string | null = existingSection?.imgTwoUrl || null

//       // Handle image updates
//       if (formData.imgOne) {
//         // Delete old image if exists
//         if (existingSection?.imgOneUrl) {
//           await deleteFromBucket(existingSection.imgOneUrl)
//         }
//         // Upload new image
//         imgOneUrl = await uploadToBucket(formData.imgOne, editId, 1)
//       }

//       if (formData.imgTwo) {
//         // Delete old image if exists
//         if (existingSection?.imgTwoUrl) {
//           await deleteFromBucket(existingSection.imgTwoUrl)
//         }
//         // Upload new image
//         imgTwoUrl = await uploadToBucket(formData.imgTwo, editId, 2)
//       }

//       // Update section in database
//       const { data, error } = await supabase
//         .from("aboutSection")
//         .update({
//           title: values.title,
//           heading: values.heading,
//           para: values.para,
//           imgOne: imgOneUrl,
//           imgTwo: imgTwoUrl,
//           // subHeading: values.subHeading,
//           // subpara: values.subpara,
//           coliconOne: values.coliconOne,
//           coliconTwo: values.coliconTwo,
//           colHeadOne: values.colHeadOne,
//           colHeadTwo: values.colHeadTwo,
//           colparaOne: values.colparaOne,
//           colparaTwo: values.colparaTwo,
//           // btnOne: values.btnOne,
//           // btnTwo: values.btnTwo,
//           // badge: values.badge,
//           highlightTitle: values.highlightTitle,
//           highlightDescription: values.highlightDescription,
//           colbtn: values.colbtn
//         })
//         .eq("id", editId)
//         .select()
//         .single()

//       if (error) {
//         console.error("Error updating section:", error)
//         alert(`Error: ${error.message}`)
//         return
//       }
// console.log("initialValues",initialValues)
//       // Convert to component type and update state
//       const updatedSection = convertToAboutSection(data)
//       setSections(prev => prev.map(s => s.id === editId ? updatedSection : s))

//       resetForm()
//       formikHelpers.resetForm()
//       setOpen(false)
//       fetchSections()
//     } catch (error) {
//       console.error("Error updating section:", error)
//       alert(error instanceof Error ? `Error: ${error.message}` : "Error updating section")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Handle Delete
//   const handleDeleteSection = async (id: string) => {
//     if (!window.confirm("Delete this section?")) return

//     try {
//       // Delete images from bucket
//       const sectionToDelete = sections.find(s => s.id === id)
//       if (sectionToDelete?.imgOneUrl) {
//         await deleteFromBucket(sectionToDelete.imgOneUrl)
//       }
//       if (sectionToDelete?.imgTwoUrl) {
//         await deleteFromBucket(sectionToDelete.imgTwoUrl)
//       }

//       // Delete from database
//       const { error } = await supabase.from("aboutSection").delete().eq("id", id)

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

//   // Get safe image URL
//   const getSafeImageUrl = (section: AboutSection, imageNumber: 1 | 2): string => {
//     const url = imageNumber === 1 
//       ? (STORAGE_TYPE === "bucket" ? section.imgOneUrl : section.imgOne)
//       : (STORAGE_TYPE === "bucket" ? section.imgTwoUrl : section.imgTwo)
    
//     return url || "/assets/images/about/about-1-1.png"
//   }

//   return (
//     <>
//         <section className="bg-[hsl(var(--color-background))] text-white py-20">
//           <div className="container mx-auto">
//              <div className="flex justify-end my-7">
//         <Button onClick={() => setOpen(true)}>
//           Open Modal
//         </Button>
//       </div>
//        <div className=" grid lg:grid-cols-2 gap-12 items-center">

//          {/* LEFT IMAGES */}
//        <div className="relative w-full max-w-[520px] h-[520px]">

//    {/* Big Image */}
//    {/* eslint-disable-next-line @next/next/no-img-element */}
//    <img
//      src="/assets/images/about/about-1-1.png"
//      alt="About main"
//      className="
//        absolute
//        top-0
//        left-0
//        w-[90%]
//        h-[95%]
//        object-cover
//        rounded-2xl
//        z-10
//        shadow-xl
//      "
//    />

//    {/* Small Overlay Image */}
//    {/* eslint-disable-next-line @next/next/no-img-element */}
//    <img
//      src="/assets/images/about/about-1-2.png"
//      alt="About overlay"
//      className="
//        absolute
//        bottom-0
//        right-0
//        w-[55%]
//        h-[55%]
//        object-cover
//        rounded-2xl
//        z-20
//        shadow-2xl
//        border-8 border-black
//      "
//    />

//    {/* Floating Circle Icon */}
//    {/* <div
//      className="
//        absolute
//        left-[-30px]
//        top-1/2
//        -translate-y-1/2
//        bg-blue-600
//        w-20
//        h-20
//        rounded-full
//        flex
//        items-center
//        justify-center
//        shadow-xl
//        z-30
//      "
//    >
//      {aboutSectionData.features[0].icon}
//    </div> */}
//  </div>



//          {/* RIGHT CONTENT */}
//          <div>
//            <span className="inline-block mb-3 border-l-4 border-[var(--color-theme)]  pl-3 text-sm tracking-widest text-[var(--color-theme)]">
//              {aboutSectionData.badge}
//            </span>

//            <h2 className="text-4xl text-black dark:text-slate-50 font-bold leading-tight mb-6">
//              {aboutSectionData.heading}
//            </h2>

//            <p className="text-black dark:text-slate-50 mb-8">
//              {aboutSectionData.description}
//            </p>

//            {/* Highlight Card */}
//            <div className="bg-neutral-900 dark:bg-slate-900 border border-neutral-800 rounded-xl p-6 mb-8">
//              <h4 className="font-semibold mb-2">
//                {aboutSectionData.highlightTitle}
//              </h4>
//              <p className="text-sm text-slate-50">
//                {aboutSectionData.highlightDescription}
//              </p>
//            </div>

//            {/* Features */}
//          <div className="grid sm:grid-cols-2 gap-6 mb-8">
//    {aboutSectionData.features.map((item) => (
//      <div
//        key={item.id}
//        className="flex items-start gap-x-4"
//      >
//        {/* Icon */}
//        <div className="mt-4 flex h-10 w-10 p-3 rounded-full items-center justify-center items-center justify-center rounded-lg bg-green-100 text-[var(--color-theme)]">
//          {item.icon}
//        </div>

//        {/* Text */}
//        <div>
//          <h5 className="font-medium leading-tight text-black dark:text-slate-50">
//            {item.title}
//          </h5>
//          <p className="text-sm  mt-1 text-black dark:text-slate-50">
//            {item.description}
//          </p>
//        </div>
//      </div>
//    ))}
//  </div>


//            <button className="bg-[var(--color-theme)] hover:bg-[var(--color-theme-hover)] transition px-6 py-3 rounded-lg font-medium">
//              {aboutSectionData.colbtn}
//            </button>
//          </div>

//        </div>
//        </div>
//      </section>
//          {open && (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="
//           max-w-4xl 
//           max-h-[85vh] 
//           overflow-hidden 
//           flex flex-col
//         ">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle>
//               {isEdit ? "Edit About Section" : "Create About Section"}
//             </DialogTitle>
//           </DialogHeader>

//           {/* Scrollable Content */}
//           <div className="
//             flex-1 
//             overflow-y-auto 
//             pr-2 
//             custom-scrollbar
//             max-h-[calc(85vh-140px)]
//           ">
//             <Formik
//               initialValues={initialValues}
//               validationSchema={validationSchema}
//               onSubmit={isEdit ? handleUpdate : handleSubmit}
//             >
//   {({ isSubmitting, errors, touched }: FormikProps<AboutSectionFormValues>) => (

//                 <Form
//                   id="aboutSectionForm" // ✅ Add this

//                 className="space-y-6 pb-4">
//                   {/* Main Content */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
//                     {/* Left Column */}
//                     <div className="space-y-4">
//                       {/* <div>
//                         <Label htmlFor="badge">Badge Text</Label>
//                         <Field
//                           as={Input}
//                           id="badge"
//                           name="badge"
//                           placeholder="ABOUT US"
//                         />
//                       </div> */}

//                       <div>
//                         <Label htmlFor="title">Title *</Label>
//                         <Field
//                           as={Input}
//                           id="title"
//                           name="title"
//                           placeholder="ABOUT US"
//                           className={errors.title && touched.title ? 'border-red-500' : ''}
//                         />
//                         <ErrorMessage
//                           name="title"
//                           component="div"
//                           className="text-sm text-red-400 mt-1"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="heading">Heading *</Label>
//                         <Field
//                           as={Input}
//                           id="heading"
//                           name="heading"
//                           placeholder="Provide the Best Easy Solution"
//                           className={errors.heading && touched.heading ? 'border-red-500' : ''}
//                         />
//                         <ErrorMessage
//                           name="heading"
//                           component="div"
//                           className="text-sm text-red-400 mt-1"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="para">Description *</Label>
//                         <Field
//                           as="textarea"
//                           id="para"
//                           name="para"
//                           rows={4}
//                           className={`w-full p-3 border rounded-md ${errors.para && touched.para ? 'border-red-500' : ''}`}
//                           placeholder="Main description here..."
//                         />
//                         <ErrorMessage
//                           name="para"
//                           component="div"
//                           className="text-sm text-red-400 mt-1"
//                         />
//                       </div>
//                     </div>

//                     {/* Right Column */}
//                     <div className="space-y-4">
//                       <div>
//                         <Label htmlFor="highlightTitle">Highlight Title</Label>
//                         <Field
//                           as={Input}
//                           id="highlightTitle"
//                           name="highlightTitle"
//                           placeholder="Deliver Perfect Solution"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="highlightDescription">Highlight Description</Label>
//                         <Field
//                           as="textarea"
//                           id="highlightDescription"
//                           name="highlightDescription"
//                           rows={4}
//                           className="w-full p-3 border rounded-md"
//                           placeholder="Highlight description here..."
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="colbtn">Button Text</Label>
//                         <Field
//                           as={Input}
//                           id="colbtn"
//                           name="colbtn"
//                           placeholder="More Details"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Images Section */}
//                   <div className="border-t pt-6">
//                     <h3 className="font-semibold text-lg mb-4">Images</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
//                       {/* Image 1 */}
//                       <div className="space-y-3">
//                         <Label htmlFor="imgOne">Main Image (Big Image) *</Label>
//                         <div className="
//                           border-2 border-dashed 
//                           rounded-lg p-4 
//                           hover:border-gray-400 
//                           transition-colors
//                         ">
//                           <input
//                             type="file"
//                             ref={fileInputRefOne}
//                             onChange={(e) => handleImageChange(e, 1)}
//                             accept="image/*"
//                             className="hidden"
//                             disabled={submitting}
//                           />
                          
//                           {previewImgOne ? (
//                             <div className="text-center space-y-3">
//                               <img
//                                 src={previewImgOne}
//                                 alt="Preview 1"
//                                 className="mx-auto max-h-48 rounded-lg object-contain"
//                               />
//                               <div className="flex gap-2 justify-center">
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => fileInputRefOne.current?.click()}
//                                   disabled={submitting}
//                                 >
//                                   Change Image
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="destructive"
//                                   size="sm"
//                                   onClick={() => handleRemoveImage(1)}
//                                   disabled={submitting}
//                                 >
//                                   Remove
//                                 </Button>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="text-center">
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => fileInputRefOne.current?.click()}
//                                 className="w-full py-6"
//                                 disabled={submitting}
//                               >
//                                 <div className="flex flex-col items-center gap-2">
//                                   <svg 
//                                     xmlns="http://www.w3.org/2000/svg" 
//                                     width="24" 
//                                     height="24" 
//                                     viewBox="0 0 24 24" 
//                                     fill="none" 
//                                     stroke="currentColor" 
//                                     strokeWidth="2" 
//                                     className="text-gray-400"
//                                   >
//                                     <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
//                                     <line x1="16" x2="22" y1="5" y2="5"/>
//                                     <line x1="19" x2="19" y1="2" y2="8"/>
//                                     <circle cx="9" cy="9" r="2"/>
//                                     <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
//                                   </svg>
//                                   <span>Upload Main Image</span>
//                                   <span className="text-xs text-gray-500">Max 5MB</span>
//                                 </div>
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Image 2 */}
//                       <div className="space-y-3">
//                         <Label htmlFor="imgTwo">Overlay Image (Small Image) *</Label>
//                         <div className="
//                           border-2 border-dashed 
//                           rounded-lg p-4 
//                           hover:border-gray-400 
//                           transition-colors
//                         ">
//                           <input
//                             type="file"
//                             ref={fileInputRefTwo}
//                             onChange={(e) => handleImageChange(e, 2)}
//                             accept="image/*"
//                             className="hidden"
//                             disabled={submitting}
//                           />
                          
//                           {previewImgTwo ? (
//                             <div className="text-center space-y-3">
//                               <img
//                                 src={previewImgTwo}
//                                 alt="Preview 2"
//                                 className="mx-auto max-h-48 rounded-lg object-contain"
//                               />
//                               <div className="flex gap-2 justify-center">
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => fileInputRefTwo.current?.click()}
//                                   disabled={submitting}
//                                 >
//                                   Change Image
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="destructive"
//                                   size="sm"
//                                   onClick={() => handleRemoveImage(2)}
//                                   disabled={submitting}
//                                 >
//                                   Remove
//                                 </Button>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="text-center">
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => fileInputRefTwo.current?.click()}
//                                 className="w-full py-6"
//                                 disabled={submitting}
//                               >
//                                 <div className="flex flex-col items-center gap-2">
//                                   <svg 
//                                     xmlns="http://www.w3.org/2000/svg" 
//                                     width="24" 
//                                     height="24" 
//                                     viewBox="0 0 24 24" 
//                                     fill="none" 
//                                     stroke="currentColor" 
//                                     strokeWidth="2" 
//                                     className="text-gray-400"
//                                   >
//                                     <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
//                                     <line x1="16" x2="22" y1="5" y2="5"/>
//                                     <line x1="19" x2="19" y1="2" y2="8"/>
//                                     <circle cx="9" cy="9" r="2"/>
//                                     <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
//                                   </svg>
//                                   <span>Upload Overlay Image</span>
//                                   <span className="text-xs text-gray-500">Max 5MB</span>
//                                 </div>
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Features Section */}
//                   <div className="border-t pt-6">
//                     <h3 className="font-semibold text-lg mb-4">Features</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
//                       {/* Feature 1 */}
//                       <div className="space-y-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
//                         <div>
//                           <Label htmlFor="coliconOne">Icon 1</Label>
//                           <Field
//                             as={Input}
//                             id="coliconOne"
//                             name="coliconOne"
//                             placeholder="Settings"
//                           />
//                         </div>
                        
//                         <div>
//                           <Label htmlFor="colHeadOne">Feature 1 Title *</Label>
//                           <Field
//                             as={Input}
//                             id="colHeadOne"
//                             name="colHeadOne"
//                             placeholder="Manage Tech Services"
//                             className={errors.colHeadOne && touched.colHeadOne ? 'border-red-500' : ''}
//                           />
//                           <ErrorMessage
//                             name="colHeadOne"
//                             component="div"
//                             className="text-sm text-red-400 mt-1"
//                           />
//                         </div>
                        
//                         <div>
//                           <Label htmlFor="colparaOne">Feature 1 Description *</Label>
//                           <Field
//                             as="textarea"
//                             id="colparaOne"
//                             name="colparaOne"
//                             rows={3}
//                             className={`w-full p-3 border rounded-md ${errors.colparaOne && touched.colparaOne ? 'border-red-500' : ''}`}
//                             placeholder="Description for feature 1"
//                           />
//                           <ErrorMessage
//                             name="colparaOne"
//                             component="div"
//                             className="text-sm text-red-400 mt-1"
//                           />
//                         </div>
//                       </div>

//                       {/* Feature 2 */}
//                       <div className="space-y-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
//                         <div>
//                           <Label htmlFor="coliconTwo">Icon 2</Label>
//                           <Field
//                             as={Input}
//                             id="coliconTwo"
//                             name="coliconTwo"
//                             placeholder="ShieldCheck"
//                           />
//                         </div>
                        
//                         <div>
//                           <Label htmlFor="colHeadTwo">Feature 2 Title *</Label>
//                           <Field
//                             as={Input}
//                             id="colHeadTwo"
//                             name="colHeadTwo"
//                             placeholder="IT Consulting Solution"
//                             className={errors.colHeadTwo && touched.colHeadTwo ? 'border-red-500' : ''}
//                           />
//                           <ErrorMessage
//                             name="colHeadTwo"
//                             component="div"
//                             className="text-sm text-red-400 mt-1"
//                           />
//                         </div>
                        
//                         <div>
//                           <Label htmlFor="colparaTwo">Feature 2 Description *</Label>
//                           <Field
//                             as="textarea"
//                             id="colparaTwo"
//                             name="colparaTwo"
//                             rows={3}
//                             className={`w-full p-3 border rounded-md ${errors.colparaTwo && touched.colparaTwo ? 'border-red-500' : ''}`}
//                             placeholder="Description for feature 2"
//                           />
//                           <ErrorMessage
//                             name="colparaTwo"
//                             component="div"
//                             className="text-sm text-red-400 mt-1"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Buttons Section */}
                 
//                              <DialogFooter className="
//             flex-shrink-0 
//             pt-4 
//             border-t 
//             bg-white 
//             dark:bg-gray-900
//             sticky 
//             bottom-0
//           ">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 setOpen(false)
//                 resetForm()
//               }}
//               disabled={submitting}
//             >
//               Cancel
//             </Button>
            
//             <Button
//               type="submit"
//               form="aboutSectionForm"
              
//               disabled={submitting}
//             >
//               {isSubmitting ? "Saving..." : (isEdit ? "Update" : "Create")}
//             </Button>
//           </DialogFooter>
//                 </Form>
//               )}
//             </Formik>
//           </div>

//           {/* Fixed Footer */}
 
//         </DialogContent>
//       </Dialog>
//     )}
//      </>
//   )
// }

// export default AboutSectionCard



'use client'

import { FC, useCallback, useEffect, useState, useRef } from 'react'
import { Settings, ShieldCheck } from "lucide-react"
import { Input } from '@/components/ui/input'
import { supabase } from "@/lib/supabase-client"
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikProps } from 'formik'
import Image, { StaticImageData } from 'next/image'

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
import { Pen, Trash } from "lucide-react"
import type { AboutSectionData } from "@/types/aboutSection";
import img from '@/public/assets/images/about/about-1-1.png'

// Constants - HomeSlide jaisa structure
const BUCKET_NAME = "aboutSection"
const STORAGE_TYPE = "bucket" // "bucket" ya "base64" change kar sakte hain
const CHUNK_SIZE = 60000
const DELIMITER = '|||CHUNK|||'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

// Types
interface DatabaseAboutSection {
  id: string
  title: string
  heading: string
  para: string
  imgOne: string | null
  imgTwo: string | null
  
  coliconOne: string
  coliconTwo: string
  colHeadOne: string
  colHeadTwo: string
  colparaOne: string
  colparaTwo: string
  colbtn: string
  
  highlightTitle: string
  highlightDescription: string
  created_at?: string
}

interface AboutSection {
  id: string
  title: string
  heading: string
  para: string
  imgOne: string | null
  imgTwo: string | null
  
  coliconOne: string
  coliconTwo: string
  colHeadOne: string
  colHeadTwo: string
  colparaOne: string
  colparaTwo: string
 
  highlightTitle: string
  highlightDescription: string
  colbtn: string
  imgOneUrl?: string | null
  imgTwoUrl?: string | null
}

export const aboutSectionData: AboutSectionData = {

  badge: "ABOUT US",
  heading: "Provide the Best Easy Solution for Your IT Problem",
  description:
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
  highlightTitle: "Deliver Perfect Solution",
  highlightDescription:
    "There are many variations passages of Lorem Ipsum available, but the majority.",
  colbtn: "More Details",
  features: [
    {
      id: 1,
      title: "Manage Tech Services",
      description: "There are many variations of passages of Lorem.",
      icon: <Settings size={20} />,
    },
    {
      id: 2,
      title: "IT Consulting Solution",
      description: "There are many variations of passages of Lorem.",
      icon: <ShieldCheck size={20} />,
    },
  ],
};

interface AboutSectionFormValues {
  title: string
  heading: string
  para: string
  
  coliconOne: string
  coliconTwo: string
  colHeadOne: string
  colHeadTwo: string
  colparaOne: string
  colparaTwo: string
  colbtn: string
  highlightTitle: string
  highlightDescription: string
}



interface UpdateAboutSectionData {
  title: string;
  heading: string;
  para: string;
  coliconOne: string;
  coliconTwo: string;
  colHeadOne: string;
  colHeadTwo: string;
  colparaOne: string;
  colparaTwo: string;
  highlightTitle: string;
  highlightDescription: string;
  colbtn: string;
  imgOne?: string | null;
  imgTwo?: string | null;
}


interface AboutSectionFormData {
  title: string
  heading: string
  para: string
  coliconOne: string
  coliconTwo: string
  colHeadOne: string
  colHeadTwo: string
  colparaOne: string
  colparaTwo: string
  colbtn: string
  highlightTitle: string
  highlightDescription: string
  imgOne: File | null
  imgTwo: File | null
}

interface AboutSectionCardProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AboutSectionCard: FC<AboutSectionCardProps> = () => {
  // State
  const [sections, setSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previewImgOne, setPreviewImgOne] = useState<string | null>(null)
  const [previewImgTwo, setPreviewImgTwo] = useState<string | null>(null)
  
  const fileInputRefOne = useRef<HTMLInputElement>(null)
  const fileInputRefTwo = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<AboutSectionFormData>({
    title: "",
    heading: "",
    para: "",
    coliconOne: "",
    coliconTwo: "",
    colHeadOne: "",
    colHeadTwo: "",
    colparaOne: "",
    colparaTwo: "",
    highlightTitle: "",
    highlightDescription: "",
    colbtn: "More Details",
    imgOne: null,
    imgTwo: null
  })

  // Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .required('Title is required'),
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .required('Heading is required'),
    para: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
    
    colHeadOne: Yup.string()
      .min(2, 'Column 1 heading is required'),
    colparaOne: Yup.string()
      .min(10, 'Column 1 description is required'),
    colHeadTwo: Yup.string()
      .min(2, 'Column 2 heading is required'),
    colparaTwo: Yup.string()
      .min(10, 'Column 2 description is required'),
  })

  // Initial Form Values
  const initialValues: AboutSectionFormValues = {
    title: formData.title || '',
    heading: formData.heading || '',
    para: formData.para || '',
    coliconOne: formData.coliconOne || '',
    coliconTwo: formData.coliconTwo || '',
    colHeadOne: formData.colHeadOne || '',
    colHeadTwo: formData.colHeadTwo || '',
    colparaOne: formData.colparaOne || '',
    colparaTwo: formData.colparaTwo || '',
    highlightTitle: formData.highlightTitle || '',
    highlightDescription: formData.highlightDescription || '',
    colbtn: formData.colbtn || 'More Details'
  }

  // Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      heading: "",
      para: "",
      coliconOne: "",
      coliconTwo: "",
      colHeadOne: "",
      colHeadTwo: "",
      colparaOne: "",
      colparaTwo: "",
      highlightTitle: "",
      highlightDescription: "",
      colbtn: "More Details",
      imgOne: null,
      imgTwo: null
    })
    setEditId(null)
    setPreviewImgOne(null)
    setPreviewImgTwo(null)
    setIsEdit(false)
    setSubmitting(false)
    
    if (fileInputRefOne.current) fileInputRefOne.current.value = ""
    if (fileInputRefTwo.current) fileInputRefTwo.current.value = ""
  }

  // Fetch About Sections
  const fetchSections = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("aboutSection")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching sections:", error)
        return
      }

      const processedSections = (data || []).map(convertToAboutSection)
      setSections(processedSections)
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  // Base64 Chunking Functions - HomeSlide se liye
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

  // Image to Base64 Conversion - HomeSlide jaisa
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

          const img = new window.Image();
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

  // Convert Database to Component Type
  const convertToAboutSection = (dbSection: DatabaseAboutSection): AboutSection => {
    if (STORAGE_TYPE === "bucket") {
      return {
        id: dbSection.id,
        title: dbSection.title || "",
        heading: dbSection.heading || "",
        para: dbSection.para || "",
        imgOne: null,
        imgTwo: null,
        coliconOne: dbSection.coliconOne || "",
        coliconTwo: dbSection.coliconTwo || "",
        colHeadOne: dbSection.colHeadOne || "",
        colHeadTwo: dbSection.colHeadTwo || "",
        colparaOne: dbSection.colparaOne || "",
        colparaTwo: dbSection.colparaTwo || "",
        highlightTitle: dbSection.highlightTitle || "",
        highlightDescription: dbSection.highlightDescription || "",
        colbtn: dbSection.colbtn || "More Details",
        imgOneUrl: dbSection.imgOne,
        imgTwoUrl: dbSection.imgTwo
      }
    } else {
      // For Base64 storage
      return {
        id: dbSection.id,
        title: dbSection.title || "",
        heading: dbSection.heading || "",
        para: dbSection.para || "",
        imgOne: reconstructFromChunks(dbSection.imgOne),
        imgTwo: reconstructFromChunks(dbSection.imgTwo),
        coliconOne: dbSection.coliconOne || "",
        coliconTwo: dbSection.coliconTwo || "",
        colHeadOne: dbSection.colHeadOne || "",
        colHeadTwo: dbSection.colHeadTwo || "",
        colparaOne: dbSection.colparaOne || "",
        colparaTwo: dbSection.colparaTwo || "",
        highlightTitle: dbSection.highlightTitle || "",
        highlightDescription: dbSection.highlightDescription || "",
        colbtn: dbSection.colbtn || "More Details"
      }
    }
  }

  // Handle Edit
  const handleEdit = (section: AboutSection) => {
    setIsEdit(true)
    setEditId(section.id)
    setFormData({
      title: section.title,
      heading: section.heading,
      para: section.para,
      coliconOne: section.coliconOne,
      coliconTwo: section.coliconTwo,
      colHeadOne: section.colHeadOne,
      colHeadTwo: section.colHeadTwo,
      colparaOne: section.colparaOne,
      colparaTwo: section.colparaTwo,
      colbtn: section.colbtn,
      highlightTitle: section.highlightTitle,
      highlightDescription: section.highlightDescription,
      imgOne: null,
      imgTwo: null
    })
    
    // Set preview images based on storage type
    if (STORAGE_TYPE === "bucket") {
      setPreviewImgOne(section.imgOneUrl || null)
      setPreviewImgTwo(section.imgTwoUrl || null)
    } else {
      setPreviewImgOne(section.imgOne)
      setPreviewImgTwo(section.imgTwo)
    }
    
    setOpen(true)
  }

  // Generate File Name for Bucket Storage
  const generateFileName = (sectionId: string, file: File, imageNumber: number): string => {
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    return `about_${sectionId}_img${imageNumber}_${timestamp}.${extension}`
  }

  // Upload to Bucket - HomeSlide jaisa
  const uploadToBucket = async (file: File, sectionId: string, imageNumber: number): Promise<string> => {
    try {
      const fileName = generateFileName(sectionId, file, imageNumber)
      
      const { data, error } = await supabase.storage
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

  // Delete from Bucket - HomeSlide jaisa
  const deleteFromBucket = async (imageUrl: string | null | undefined): Promise<void> => {
    try {
      if (!imageUrl) return
      
      const fileName = imageUrl.split('/').pop()
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

  // Handle Image Change - HomeSlide jaisa
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    imageNumber: 1 | 2
  ) => {
    const file = e.target.files?.[0] || null
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`)
        return
      }

      if (imageNumber === 1) {
        setFormData(prev => ({ ...prev, imgOne: file }))
        const previewUrl = URL.createObjectURL(file)
        setPreviewImgOne(previewUrl)
      } else {
        setFormData(prev => ({ ...prev, imgTwo: file }))
        const previewUrl = URL.createObjectURL(file)
        setPreviewImgTwo(previewUrl)
      }
    }
  }

  // Handle Remove Image
  const handleRemoveImage = (imageNumber: 1 | 2) => {
    if (imageNumber === 1) {
      setFormData(prev => ({ ...prev, imgOne: null }))
      setPreviewImgOne(null)
      if (fileInputRefOne.current) fileInputRefOne.current.value = ""
    } else {
      setFormData(prev => ({ ...prev, imgTwo: null }))
      setPreviewImgTwo(null)
      if (fileInputRefTwo.current) fileInputRefTwo.current.value = ""
    }
  }

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (previewImgOne) URL.revokeObjectURL(previewImgOne)
      if (previewImgTwo) URL.revokeObjectURL(previewImgTwo)
    }
  }, [previewImgOne, previewImgTwo])

  // Handle Submit (Create) - Updated for both storage types
  const handleSubmit = async (
    values: AboutSectionFormValues,
    formikHelpers: FormikHelpers<AboutSectionFormValues>
  ) => {
    if (submitting) return

    try {
      console.log("Submitting form with values:", values);
      setSubmitting(true)

      let imgOneData: string | null = null
      let imgTwoData: string | null = null

      // Process images based on storage type
      if (formData.imgOne) {
        if (STORAGE_TYPE === "bucket") {
          // Will upload after section creation to get ID
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.imgOne)
            imgOneData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed for imgOne:", convertError)
          }
        }
      }

      if (formData.imgTwo) {
        if (STORAGE_TYPE === "bucket") {
          // Will upload after section creation to get ID
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.imgTwo)
            imgTwoData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed for imgTwo:", convertError)
          }
        }
      }

      // First create section
      const { data: sectionData, error: sectionError } = await supabase
        .from("aboutSection")
        .insert([
          {
            title: values.title,
            heading: values.heading,
            para: values.para,
            imgOne: STORAGE_TYPE === "bucket" ? null : imgOneData,
            imgTwo: STORAGE_TYPE === "bucket" ? null : imgTwoData,
            coliconOne: values.coliconOne,
            coliconTwo: values.coliconTwo,
            colHeadOne: values.colHeadOne,
            colHeadTwo: values.colHeadTwo,
            colparaOne: values.colparaOne,
            colparaTwo: values.colparaTwo,
            colbtn: values.colbtn,
            highlightTitle: values.highlightTitle,
            highlightDescription: values.highlightDescription,
          }
        ])
        .select()
        .single()

      if (sectionError) {
        console.error("Error adding section:", sectionError)
        alert(`Error: ${sectionError.message}`)
        return
      }

      // For bucket storage, upload images after getting section ID
      if (STORAGE_TYPE === "bucket") {
        let imgOneUrl: string | null = null
        let imgTwoUrl: string | null = null

        if (formData.imgOne) {
          try {
            imgOneUrl = await uploadToBucket(formData.imgOne, sectionData.id, 1)
          } catch (error) {
            console.error("Failed to upload image 1:", error)
          }
        }

        if (formData.imgTwo) {
          try {
            imgTwoUrl = await uploadToBucket(formData.imgTwo, sectionData.id, 2)
          } catch (error) {
            console.error("Failed to upload image 2:", error)
          }
        }

        // Update section with image URLs
        if (imgOneUrl || imgTwoUrl) {
          const { error: updateError } = await supabase
            .from("aboutSection")
            .update({ 
              imgOne: imgOneUrl,
              imgTwo: imgTwoUrl
            })
            .eq("id", sectionData.id)

          if (updateError) {
            console.error("Error updating section with images:", updateError)
          }
        }

        // Update image data for response
        imgOneData = imgOneUrl
        imgTwoData = imgTwoUrl
      }

      // Create new section object
      const newSection: AboutSection = {
        id: sectionData.id,
        title: sectionData.title || "",
        heading: sectionData.heading || "",
        para: sectionData.para || "",
        imgOne: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(imgOneData),
        imgTwo: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(imgTwoData),
        coliconOne: sectionData.coliconOne || "",
        coliconTwo: sectionData.coliconTwo || "",
        colHeadOne: sectionData.colHeadOne || "",
        colHeadTwo: sectionData.colHeadTwo || "",
        colparaOne: sectionData.colparaOne || "",
        colparaTwo: sectionData.colparaTwo || "",
        highlightTitle: sectionData.highlightTitle || "",
        highlightDescription: sectionData.highlightDescription || "",
        colbtn: sectionData.colbtn || "More Details",
        imgOneUrl: STORAGE_TYPE === "bucket" ? imgOneData : null,
        imgTwoUrl: STORAGE_TYPE === "bucket" ? imgTwoData : null
      }

      // Update state
      setSections(prev => {
        const exists = prev.some(s => s.id === newSection.id)
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
      alert(error instanceof Error ? `Error: ${error.message}` : "Error saving section")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Update - Updated for both storage types
  const handleUpdate = async (
    values: AboutSectionFormValues,
    formikHelpers: FormikHelpers<AboutSectionFormValues>
  ) => {
    if (!editId || submitting) return

    try {
      setSubmitting(true)

      // Get existing section data
      const existingSection = sections.find(s => s.id === editId)
      let imgOneData: string | null = null
      let imgTwoData: string | null = null
      
      if (existingSection) {
        imgOneData = STORAGE_TYPE === "bucket" 
          ? existingSection.imgOneUrl 
          : existingSection.imgOne
        imgTwoData = STORAGE_TYPE === "bucket" 
          ? existingSection.imgTwoUrl 
          : existingSection.imgTwo
      }

      // Handle image updates
      if (formData.imgOne) {
        if (STORAGE_TYPE === "bucket") {
          // Delete old image if exists
          if (existingSection?.imgOneUrl) {
            await deleteFromBucket(existingSection.imgOneUrl)
          }
          // Upload new image
          imgOneData = await uploadToBucket(formData.imgOne, editId, 1)
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.imgOne)
            imgOneData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed:", convertError)
            // Keep existing image data
            imgOneData = existingSection?.imgOne || null
          }
        }
      } else {
        // Keep existing image data
        imgOneData = existingSection?.imgOne || existingSection?.imgOneUrl || null
      }

      if (formData.imgTwo) {
        if (STORAGE_TYPE === "bucket") {
          // Delete old image if exists
          if (existingSection?.imgTwoUrl) {
            await deleteFromBucket(existingSection.imgTwoUrl)
          }
          // Upload new image
          imgTwoData = await uploadToBucket(formData.imgTwo, editId, 2)
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.imgTwo)
            imgTwoData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed:", convertError)
            // Keep existing image data
            imgTwoData = existingSection?.imgTwo || null
          }
        }
      } else {
        // Keep existing image data
        imgTwoData = existingSection?.imgTwo || existingSection?.imgTwoUrl || null
      }

      // Update section in database
      const updateData: UpdateAboutSectionData = {
        title: values.title,
        heading: values.heading,
        para: values.para,
        coliconOne: values.coliconOne,
        coliconTwo: values.coliconTwo,
        colHeadOne: values.colHeadOne,
        colHeadTwo: values.colHeadTwo,
        colparaOne: values.colparaOne,
        colparaTwo: values.colparaTwo,
        highlightTitle: values.highlightTitle,
        highlightDescription: values.highlightDescription,
        colbtn: values.colbtn
      }

      // Add image data based on storage type
      if (STORAGE_TYPE === "bucket") {
        updateData.imgOne = imgOneData
        updateData.imgTwo = imgTwoData
      } else {
        updateData.imgOne = imgOneData
        updateData.imgTwo = imgTwoData
      }

      const { data, error } = await supabase
        .from("aboutSection")
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
      const updatedSection = convertToAboutSection(data)
      setSections(prev => prev.map(s => s.id === editId ? updatedSection : s))

      resetForm()
      formikHelpers.resetForm()
      setOpen(false)
      fetchSections()
    } catch (error) {
      console.error("Error updating section:", error)
      alert(error instanceof Error ? `Error: ${error.message}` : "Error updating section")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete - Updated for both storage types
  const handleDeleteSection = async (id: string) => {
    if (!window.confirm("Delete this section?")) return

    try {
      // Handle image deletion based on storage type
      const sectionToDelete = sections.find(s => s.id === id)
      
      if (STORAGE_TYPE === "bucket") {
        // Delete images from bucket
        if (sectionToDelete?.imgOneUrl) {
          await deleteFromBucket(sectionToDelete.imgOneUrl)
        }
        if (sectionToDelete?.imgTwoUrl) {
          await deleteFromBucket(sectionToDelete.imgTwoUrl)
        }
      }
      // For Base64 storage, no need to delete from bucket

      // Delete from database
      const { error } = await supabase.from("aboutSection").delete().eq("id", id)

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

  // Get safe image URL for both storage types
  const getSafeImageUrl = (
  dynamicSrc: string | null, 
  fallbackSrc: string
): string => {
  // Use dynamic source if available and valid
  if (dynamicSrc && dynamicSrc.trim() !== "") {
    return dynamicSrc;
  }
  
  // Return fallback
  return fallbackSrc || "/assets/images/about/about-1-1.png";
};


  // Get image URL helper
  const getImageUrl = (section: AboutSection, imageNumber: 1 | 2): string | null => {
  if (imageNumber === 1) {
    return STORAGE_TYPE === "bucket" ? section.imgOneUrl : section.imgOne;
  } else {
    return STORAGE_TYPE === "bucket" ? section.imgTwoUrl : section.imgTwo;
  }
};



  
  

  console.log("sections",sections)

  return (
    <>
      <section className="bg-[hsl(var(--color-background))] text-white py-20">
        <div className="container mx-auto">
          {sections.map((e,i) => (
            <div key={i}>

          <div className="flex justify-end my-1">
            {/* <Button onClick={() => setOpen(true)}>
              Open Modal
            </Button> */}
            <Button             onClick={() => handleEdit(e)}
>
              Edit Conent
            </Button>
          </div>
          
          {/* Display existing sections */}
  

          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT IMAGES */}
            <div className="relative w-full max-w-[520px] h-[520px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                // src="/assets/images/about/about-1-1.png"
          src={getSafeImageUrl(
            getImageUrl(e, 1), 
            "/assets/images/about/about-1-1.png"
          )}

                
                alt="About main"
                className="
                  absolute
                  top-0
                  left-0
                  w-[90%]
                  h-[95%]
                  object-cover
                  rounded-2xl
                  z-10
                  shadow-xl
                "
              />

              {/* Small Overlay Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                // src="/assets/images/about/about-1-2.png"
                src={getSafeImageUrl(
            getImageUrl(e, 2), 
            "/assets/images/about/about-1-1.png"
          )}
                alt="About overlay"
                className="
                  absolute
                  bottom-0
                  right-0
                  w-[55%]
                  h-[55%]
                  object-cover
                  rounded-2xl
                  z-20
                  shadow-2xl
                  border-8 border-black
                "
              />
            </div>

            {/* RIGHT CONTENT */}
            <div>
              <span className="inline-block mb-3 border-l-4 border-[var(--color-theme)]  pl-3 text-sm tracking-widest text-[var(--color-theme)]">
                {e.title ? e.title:aboutSectionData.badge}
              </span>

              <h2 className="text-4xl text-black dark:text-slate-50 font-bold leading-tight mb-6">
               
                {e.heading ? e.heading:aboutSectionData.heading}
              </h2>

              <p className="text-black dark:text-slate-50 mb-8">
                    
                     {e.para ? e.para:aboutSectionData.description}
              </p>

              {/* Highlight Card */}
              <div className="bg-neutral-900 dark:bg-slate-900 border border-neutral-800 rounded-xl p-6 mb-8">
                <h4 className="font-semibold mb-2">
                      {/* {aboutSectionData.highlightTitle} */}
                     {e.highlightTitle ? e.highlightTitle:aboutSectionData.highlightTitle}
                      
                </h4>
                <p className="text-sm text-slate-50">
                  {/* {aboutSectionData.highlightDescription} */}
                     {e.highlightDescription ? e.highlightDescription:aboutSectionData.highlightDescription}

                </p>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div
                    className="flex items-start gap-x-4"
                  >
                    {/* Icon */}
                    <div className="mt-4 flex h-10 w-10 p-3 rounded-full items-center justify-center items-center justify-center rounded-lg bg-green-100 text-[var(--color-theme)]">
                      {/* {item.icon} */}
                   {/* <i className={`${e.coliconOne ? e.coliconOne:''} text-lg` } />   */}
                         <div 
        dangerouslySetInnerHTML={{
          __html: `<i class="fa-regular ${e.coliconOne || ''}"></i>`
        }}
        className="flex items-center justify-center w-full h-full"
      />
    



                    </div>

                    {/* Text */}
                    <div>
                      <h5 className="font-medium leading-tight text-black dark:text-slate-50">
                        {/* {item.title} */}
                     {e.colHeadOne ? e.colHeadOne:''}

                      </h5>
                      <p className="text-sm  mt-1 text-black dark:text-slate-50">
                        {/* {item.description} */}
                     {e.colparaOne ? e.colparaOne:''}

                      </p>
                    </div>
                  </div>
                   <div
                    className="flex items-start gap-x-4"
                  >
                    {/* Icon */}
                    <div className="mt-4 flex h-10 w-10 p-3 rounded-full items-center justify-center items-center justify-center rounded-lg bg-green-100 text-[var(--color-theme)]">
                      {/* {item.icon} */}
                     {/* {e.coliconTwo ? e.coliconTwo:''} */}
                                      <div 
        dangerouslySetInnerHTML={{
          __html: `<i class="${e.coliconTwo || 'fas fa-globe'}"></i>`
        }}
        className="flex items-center justify-center w-full h-full"
      />

                    </div>

                    {/* Text */}
                    <div>
                      <h5 className="font-medium leading-tight text-black dark:text-slate-50">
                        {/* {item.title} */}
                     {e.colHeadTwo ? e.colHeadTwo:''}

                      </h5>
                      <p className="text-sm  mt-1 text-black dark:text-slate-50">
                        {/* {item.description} */}
                     {e.colparaTwo ? e.colparaTwo:''}

                      </p>
                    </div>
                  </div>
              </div>

              <button className="bg-[var(--color-theme)] hover:bg-[var(--color-theme-hover)] transition px-6 py-3 rounded-lg font-medium">
                {e.colbtn}
              </button>
            </div>
          </div>
            </div>
          ))}

        </div>
      </section>
      
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="
            max-w-4xl 
            max-h-[85vh] 
            overflow-hidden 
            flex flex-col
          ">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>
                {isEdit ? "Edit About Section" : "Create About Section"}
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="
              flex-1 
              overflow-y-auto 
              pr-2 
              custom-scrollbar
              max-h-[calc(85vh-140px)]
            ">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={isEdit ? handleUpdate : handleSubmit}
              >
                {({ isSubmitting, errors, touched }: FormikProps<AboutSectionFormValues>) => (
                  <Form
                    id="aboutSectionForm"
                    className="space-y-6 pb-4"
                  >
                    {/* Main Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title *</Label>
                          <Field
                            as={Input}
                            id="title"
                            name="title"
                            placeholder="ABOUT US"
                            className={errors.title && touched.title ? 'border-red-500' : ''}
                          />
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-sm text-red-400 mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="heading">Heading *</Label>
                          <Field
                            as={Input}
                            id="heading"
                            name="heading"
                            placeholder="Provide the Best Easy Solution"
                            className={errors.heading && touched.heading ? 'border-red-500' : ''}
                          />
                          <ErrorMessage
                            name="heading"
                            component="div"
                            className="text-sm text-red-400 mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="para">Description *</Label>
                          <Field
                            as="textarea"
                            id="para"
                            name="para"
                            rows={4}
                            className={`w-full p-3 border rounded-md ${errors.para && touched.para ? 'border-red-500' : ''}`}
                            placeholder="Main description here..."
                          />
                          <ErrorMessage
                            name="para"
                            component="div"
                            className="text-sm text-red-400 mt-1"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="highlightTitle">Highlight Title</Label>
                          <Field
                            as={Input}
                            id="highlightTitle"
                            name="highlightTitle"
                            placeholder="Deliver Perfect Solution"
                          />
                        </div>

                        <div>
                          <Label htmlFor="highlightDescription">Highlight Description</Label>
                          <Field
                            as="textarea"
                            id="highlightDescription"
                            name="highlightDescription"
                            rows={4}
                            className="w-full p-3 border rounded-md"
                            placeholder="Highlight description here..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="colbtn">Button Text</Label>
                          <Field
                            as={Input}
                            id="colbtn"
                            name="colbtn"
                            placeholder="More Details"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Images Section - HomeSlide Style */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-lg mb-4">Images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Image 1 */}
                        <div className="space-y-3">
                          <Label htmlFor="imgOne">Main Image (Big Image)</Label>
                          <div className="
                            border-2 border-dashed 
                            rounded-lg p-4 
                            hover:border-gray-400 
                            transition-colors
                          ">
                            <input
                              type="file"
                              ref={fileInputRefOne}
                              onChange={(e) => handleImageChange(e, 1)}
                              accept="image/*"
                              className="hidden"
                              disabled={submitting}
                            />
                            
                            {previewImgOne ? (
                              <div className="text-center space-y-3">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={previewImgOne}
                                  alt="Preview 1"
                                  className="mx-auto max-h-48 rounded-lg object-contain"
                                />
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRefOne.current?.click()}
                                    disabled={submitting}
                                  >
                                    Change Image
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveImage(1)}
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
                                  onClick={() => fileInputRefOne.current?.click()}
                                  className="w-full py-6"
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
                                    <span>Upload Main Image</span>
                                    <span className="text-xs text-gray-500">Max 5MB</span>
                                  </div>
                                </Button>
                              </div>
                            )}
                            
                            {isEdit && !previewImgOne && (
                              <div className="mt-2 text-center text-xs text-gray-500">
                                Leave empty to keep existing image
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {STORAGE_TYPE === "bucket" 
                              ? "Stored in secure cloud storage bucket."
                              : "Automatically compressed and stored in database."
                            }
                          </div>
                        </div>

                        {/* Image 2 */}
                        <div className="space-y-3">
                          <Label htmlFor="imgTwo">Overlay Image (Small Image)</Label>
                          <div className="
                            border-2 border-dashed 
                            rounded-lg p-4 
                            hover:border-gray-400 
                            transition-colors
                          ">
                            <input
                              type="file"
                              ref={fileInputRefTwo}
                              onChange={(e) => handleImageChange(e, 2)}
                              accept="image/*"
                              className="hidden"
                              disabled={submitting}
                            />
                            
                            {previewImgTwo ? (
                              <div className="text-center space-y-3">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={previewImgTwo}
                                  alt="Preview 2"
                                  className="mx-auto max-h-48 rounded-lg object-contain"
                                />
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRefTwo.current?.click()}
                                    disabled={submitting}
                                  >
                                    Change Image
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveImage(2)}
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
                                  onClick={() => fileInputRefTwo.current?.click()}
                                  className="w-full py-6"
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
                                    <span>Upload Overlay Image</span>
                                    <span className="text-xs text-gray-500">Max 5MB</span>
                                  </div>
                                </Button>
                              </div>
                            )}
                            
                            {isEdit && !previewImgTwo && (
                              <div className="mt-2 text-center text-xs text-gray-500">
                                Leave empty to keep existing image
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {STORAGE_TYPE === "bucket" 
                              ? "Stored in secure cloud storage bucket."
                              : "Automatically compressed and stored in database."
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features Section */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-lg mb-4">Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Feature 1 */}
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                          <div>
                            <Label htmlFor="coliconOne">Icon 1</Label>
                            <Field
                              as={Input}
                              id="coliconOne"
                              name="coliconOne"
                              placeholder="Settings"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="colHeadOne">Feature 1 Title *</Label>
                            <Field
                              as={Input}
                              id="colHeadOne"
                              name="colHeadOne"
                              placeholder="Manage Tech Services"
                              className={errors.colHeadOne && touched.colHeadOne ? 'border-red-500' : ''}
                            />
                            <ErrorMessage
                              name="colHeadOne"
                              component="div"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="colparaOne">Feature 1 Description *</Label>
                            <Field
                              as="textarea"
                              id="colparaOne"
                              name="colparaOne"
                              rows={3}
                              className={`w-full p-3 border rounded-md ${errors.colparaOne && touched.colparaOne ? 'border-red-500' : ''}`}
                              placeholder="Description for feature 1"
                            />
                            <ErrorMessage
                              name="colparaOne"
                              component="div"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                          <div>
                            <Label htmlFor="coliconTwo">Icon 2</Label>
                            <Field
                              as={Input}
                              id="coliconTwo"
                              name="coliconTwo"
                              placeholder="ShieldCheck"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="colHeadTwo">Feature 2 Title *</Label>
                            <Field
                              as={Input}
                              id="colHeadTwo"
                              name="colHeadTwo"
                              placeholder="IT Consulting Solution"
                              className={errors.colHeadTwo && touched.colHeadTwo ? 'border-red-500' : ''}
                            />
                            <ErrorMessage
                              name="colHeadTwo"
                              component="div"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="colparaTwo">Feature 2 Description *</Label>
                            <Field
                              as="textarea"
                              id="colparaTwo"
                              name="colparaTwo"
                              rows={3}
                              className={`w-full p-3 border rounded-md ${errors.colparaTwo && touched.colparaTwo ? 'border-red-500' : ''}`}
                              placeholder="Description for feature 2"
                            />
                            <ErrorMessage
                              name="colparaTwo"
                              component="div"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons Section */}
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
                      >
                        Cancel
                      </Button>
                      
                      <Button
                        type="submit"
                        form="aboutSectionForm"
                        disabled={submitting}
                      >
                        {isSubmitting ? "Saving..." : (isEdit ? "Update" : "Create")}
                      </Button>
                    </DialogFooter>
                  </Form>
                )}
              </Formik>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default AboutSectionCard