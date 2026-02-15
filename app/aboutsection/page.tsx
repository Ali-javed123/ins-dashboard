

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
//   paragraph: string;
//   img_one: string;
//   img_two: string;
//   subHeading: string;
//   subparagraph: string;
//   col_icon_one: string;
//   col_icon_two: string;
//   col_head_one: string;
//   col_head_two: string;
//   col_paragraph_one: string;
//   col_paragraph_two: string;

//   col_btn: string;



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
//   highlight_title: "Deliver Perfect Solution",
//   highlight_description:
//     "There are many variations passages of Lorem Ipsum available, but the majority.",
//   col_btn: "More Details",
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
//   paragraph: string;
//   img_one: string;
//   img_two: string;
//   subHeading: string;
//   subparagraph: string;
//   col_icon_one: string;
//   col_icon_two: string;
//   col_head_one: string;
//   col_head_two: string;
//   col_paragraph_one: string;
//   col_paragraph_two: string;
// created_at:string
//   col_btn: string;

//   btnOne: string;   // ✅ add
//   btnTwo: string;   // ✅ add



//   profileImage: string | null; // Changed from 'image' to 'profileImage'
//   profileImageUrl?: string | null; // undefined भी allow करें
// }



// interface UserFormValues {
//    title?: string;
//   heading?: string;
//   paragraph?: string;
//   img_one?: string;
//   img_two?: string;
//   subHeading?: string;
//   subparagraph?: string;
//   col_icon_one?: string;
//   col_icon_two?: string;
//   col_head_one?: string;
//   col_head_two?: string;
//   col_paragraph_one?: string;
//   col_paragraph_two?: string;
// created_at?:string
//   col_btn?: string;

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
//   paragraph: '',
//   img_one: '',
//   img_two: '',
//   subHeading: '',
//   subparagraph: '',
//   col_icon_one: '',
//   col_icon_two: '',
//   col_head_one: '',
//   col_head_two: '',
//   col_paragraph_one: '',
//   col_paragraph_two: '',
//   col_btn: '',

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
//       paragraph: dbUser.paragraph,
//       img_one: dbUser.img_one,
//       img_two: dbUser.img_two,
//       subHeading: dbUser.subHeading,
//       subparagraph: dbUser.subparagraph,
//       col_icon_one: dbUser.col_icon_one,
//       col_icon_two: dbUser.col_icon_two,
//       col_head_one: dbUser.col_head_one,
//       col_head_two: dbUser.col_head_two,
//       col_paragraph_one: dbUser.col_paragraph_one,
//       col_paragraph_two: dbUser.col_paragraph_two,
//       col_btn: dbUser.col_btn,

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
//       paragraph: dbUser.paragraph,
//       img_one: dbUser.img_one,
//       img_two: dbUser.img_two,
//       subHeading: dbUser.subHeading,
//       subparagraph: dbUser.subparagraph,
//       col_icon_one: dbUser.col_icon_one,
//       col_icon_two: dbUser.col_icon_two,
//       col_head_one: dbUser.col_head_one,
//       col_head_two: dbUser.col_head_two,
//       col_paragraph_one: dbUser.col_paragraph_one,
//       col_paragraph_two: dbUser.col_paragraph_two,
//       col_btn: dbUser.col_btn,

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
//               {aboutSectionData.highlight_title}
//             </h4>
//             <p className="text-sm text-slate-50">
//               {aboutSectionData.highlight_description}
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
//             {aboutSectionData.col_btn}
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
//   paragraph: string
//   img_one: string | null
//   img_two: string | null
  
//   col_icon_one: string
//   col_icon_two: string
//   col_head_one: string
//   col_head_two: string
//   col_paragraph_one: string
//   col_paragraph_two: string
//   col_btn: string
  
//   // badge: string
//   highlight_title: string
//   highlight_description: string
//   created_at?: string
// }

// interface AboutSection {
//   id: string
//   title: string
//   heading: string
//   paragraph: string
//   img_one: string | null
//   img_two: string | null
  
//   col_icon_one: string
//   col_icon_two: string
//   col_head_one: string
//   col_head_two: string
//   col_paragraph_one: string
//   col_paragraph_two: string
 
//   // badge?: string
//   highlight_title: string
//   highlight_description: string
//   col_btn: string
//   img_oneUrl?: string | null
//   img_twoUrl?: string | null
// }
// export const aboutSectionData: AboutSectionData = {
//   badge: "ABOUT US",
//   heading: "Provide the Best Easy Solution for Your IT Problem",
//   description:
//     "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
//   highlight_title: "Deliver Perfect Solution",
//   highlight_description:
//     "There are many variations passages of Lorem Ipsum available, but the majority.",
//   col_btn: "More Details",
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
//   paragraph: string
  
//   col_icon_one: string
//   col_icon_two: string
//   col_head_one: string
//   col_head_two: string
//   col_paragraph_one: string
//   col_paragraph_two: string
//   col_btn: string
//   btnOne?: string
//   btnTwo?: string
//   // badge: string
//   highlight_title: string
//   highlight_description: string
// }

// interface AboutSectionFormData {
//   title: string
//   heading: string
//   paragraph: string
//   subHeading?: string
//   subparagraph?: string
//   col_icon_one: string
//   col_icon_two: string
//   col_head_one: string
//   col_head_two: string
//   col_paragraph_one: string
//   col_paragraph_two: string
//   col_btn: string
//   btnOne?: string
//   btnTwo?: string
//   // badge: string
//   highlight_title: string
//   highlight_description: string
//   img_one: File | null
//   img_two: File | null
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
//   const [previewimg_one, setPreviewimg_one] = useState<string | null>(null)
//   const [previewimg_two, setPreviewimg_two] = useState<string | null>(null)
  
//   const fileInputRefOne = useRef<HTMLInputElement>(null)
//   const fileInputRefTwo = useRef<HTMLInputElement>(null)

//   const [formData, setFormData] = useState<AboutSectionFormData>({
//     title: "",
//     heading: "",
//     paragraph: "",
    
//     col_icon_one: "",
//     col_icon_two: "",
//     col_head_one: "",
//     col_head_two: "",
//     col_paragraph_one: "",
//     col_paragraph_two: "",
   
//     // badge: "ABOUT US",
//     highlight_title: "",
//     highlight_description: "",
//     col_btn: "More Details",
//     img_one: null,
//     img_two: null
//   })

//   // Validation Schema
//   const validationSchema = Yup.object({
//     title: Yup.string()
//       .min(2, 'Title must be at least 2 characters')
//       .required('Title is required'),
//     heading: Yup.string()
//       .min(2, 'Heading must be at least 2 characters')
//       .required('Heading is required'),
//     paragraph: Yup.string()
//       .min(10, 'Description must be at least 10 characters')
//       .required('Description is required'),
    
//     col_head_one: Yup.string()
//       .min(2, 'Column 1 heading is required'),
//     col_paragraph_one: Yup.string()
//       .min(10, 'Column 1 description is required'),
//     col_head_two: Yup.string()
//       .min(2, 'Column 2 heading is required'),
//     col_paragraph_two: Yup.string()
//       .min(10, 'Column 2 description is required'),
    
//   })

//   // Initial Form Values
//   const initialValues: AboutSectionFormValues = {
//     title: formData.title || '',
//     heading: formData.heading || '',
//     paragraph: formData.paragraph || '',
//     // subHeading: formData.subHeading || '',
//     // subparagraph: formData.subparagraph || '',
//     col_icon_one: formData.col_icon_one || '',
//     col_icon_two: formData.col_icon_two || '',
//     col_head_one: formData.col_head_one || '',
//     col_head_two: formData.col_head_two || '',
//     col_paragraph_one: formData.col_paragraph_one || '',
//     col_paragraph_two: formData.col_paragraph_two || '',
    
//     // badge: formData.badge || 'ABOUT US',
//     highlight_title: formData.highlight_title || '',
//     highlight_description: formData.highlight_description || '',
//     col_btn: formData.col_btn || 'More Details'
//   }

//   // Reset Form
//   const resetForm = () => {
//     setFormData({
//       title: "",
//       heading: "",
//       paragraph: "",
     
//       col_icon_one: "",
//       col_icon_two: "",
//       col_head_one: "",
//       col_head_two: "",
//       col_paragraph_one: "",
//       col_paragraph_two: "",
    
//       // badge: "ABOUT US",
//       highlight_title: "",
//       highlight_description: "",
//       col_btn: "More Details",
//       img_one: null,
//       img_two: null
//     })
//     setEditId(null)
//     setPreviewimg_one(null)
//     setPreviewimg_two(null)
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
//         paragraph: dbSection.paragraph || "",
//         img_one: null,
//         img_two: null,
     
//         col_icon_one: dbSection.col_icon_one || "",
//         col_icon_two: dbSection.col_icon_two || "",
//         col_head_one: dbSection.col_head_one || "",
//         col_head_two: dbSection.col_head_two || "",
//         col_paragraph_one: dbSection.col_paragraph_one || "",
//         col_paragraph_two: dbSection.col_paragraph_two || "",
       
//         // badge: dbSection.badge || "ABOUT US",
//         highlight_title: dbSection.highlight_title || "",
//         highlight_description: dbSection.highlight_description || "",
//         col_btn: dbSection.col_btn || "More Details",
//         img_oneUrl: dbSection.img_one,
//         img_twoUrl: dbSection.img_two
//       }
//     } else {
//       return {
//         id: dbSection.id,
//         title: dbSection.title || "",
//         heading: dbSection.heading || "",
//         paragraph: dbSection.paragraph || "",
//         img_one: dbSection.img_one,
//         img_two: dbSection.img_two,
        
//         col_icon_one: dbSection.col_icon_one || "",
//         col_icon_two: dbSection.col_icon_two || "",
//         col_head_one: dbSection.col_head_one || "",
//         col_head_two: dbSection.col_head_two || "",
//         col_paragraph_one: dbSection.col_paragraph_one || "",
//         col_paragraph_two: dbSection.col_paragraph_two || "",
        
//         // badge: dbSection.badge || "ABOUT US",
//         highlight_title: dbSection.highlight_title || "",
//         highlight_description: dbSection.highlight_description || "",
//         col_btn: dbSection.col_btn || "More Details"
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
//       paragraph: section.paragraph,
//       // subHeading: section.subHeading,
//       // subparagraph: section.subparagraph,
//       col_icon_one: section.col_icon_one,
//       col_icon_two: section.col_icon_two,
//       col_head_one: section.col_head_one,
//       col_head_two: section.col_head_two,
//       col_paragraph_one: section.col_paragraph_one,
//       col_paragraph_two: section.col_paragraph_two,
//       col_btn: section.col_btn,
     
//       // badge: section.badge,
//       highlight_title: section.highlight_title,
//       highlight_description: section.highlight_description,
//       img_one: null,
//       img_two: null
//     })
    
//     // Set preview images
//     if (STORAGE_TYPE === "bucket") {
//       setPreviewimg_one(section.img_oneUrl || null)
//       setPreviewimg_two(section.img_twoUrl || null)
//     } else {
//       setPreviewimg_one(section.img_one)
//       setPreviewimg_two(section.img_two)
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
//         setFormData(prev => ({ ...prev, img_one: file }))
//         const previewUrl = URL.createObjectURL(file)
//         setPreviewimg_one(previewUrl)
//       } else {
//         setFormData(prev => ({ ...prev, img_two: file }))
//         const previewUrl = URL.createObjectURL(file)
//         setPreviewimg_two(previewUrl)
//       }
//     }
//   }

//   // Handle Remove Image
//   const handleRemoveImage = (imageNumber: 1 | 2) => {
//     if (imageNumber === 1) {
//       setFormData(prev => ({ ...prev, img_one: null }))
//       setPreviewimg_one(null)
//       if (fileInputRefOne.current) fileInputRefOne.current.value = ""
//     } else {
//       setFormData(prev => ({ ...prev, img_two: null }))
//       setPreviewimg_two(null)
//       if (fileInputRefTwo.current) fileInputRefTwo.current.value = ""
//     }
//   }

//   // Cleanup preview URLs
//   useEffect(() => {
//     return () => {
//       if (previewimg_one) URL.revokeObjectURL(previewimg_one)
//       if (previewimg_two) URL.revokeObjectURL(previewimg_two)
//     }
//   }, [previewimg_one, previewimg_two])

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
//             paragraph: values.paragraph,
//             img_one: null,
//             img_two: null,
            
//             col_icon_one: values.col_icon_one,
//             col_icon_two: values.col_icon_two,
//             col_head_one: values.col_head_one,
//             col_head_two: values.col_head_two,
//             col_paragraph_one: values.col_paragraph_one,
//             col_paragraph_two: values.col_paragraph_two,
//             col_btn: values.col_btn,
         
//             // badge: values.badge,
//             highlight_title: values.highlight_title,
//             highlight_description: values.highlight_description,
//           }
//         ])
//         .select()
//         .single()

//       if (sectionError) {
//         console.error("Error adding section:", sectionError)
//         alert(`Error: ${sectionError.message}`)
//         return
//       }

//       let img_oneUrl: string | null = null
//       let img_twoUrl: string | null = null

//       // Upload images to bucket if selected
//       if (formData.img_one) {
//         try {
//           img_oneUrl = await uploadToBucket(formData.img_one, sectionData.id, 1)
//         } catch (error) {
//           console.error("Failed to upload image 1:", error)
//         }
//       }

//       if (formData.img_two) {
//         try {
//           img_twoUrl = await uploadToBucket(formData.img_two, sectionData.id, 2)
//         } catch (error) {
//           console.error("Failed to upload image 2:", error)
//         }
//       }

//       // Update section with image URLs
//       if (img_oneUrl || img_twoUrl) {
//         const { error: updateError } = await supabase
//           .from("aboutSection")
//           .update({ 
//             img_one: img_oneUrl,
//             img_two: img_twoUrl
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
//         paragraph: sectionData.paragraph || "",
//         img_one: null,
//         img_two: null,
       
//         col_icon_one: sectionData.col_icon_one || "",
//         col_icon_two: sectionData.col_icon_two || "",
//         col_head_one: sectionData.col_head_one || "",
//         col_head_two: sectionData.col_head_two || "",
//         col_paragraph_one: sectionData.col_paragraph_one || "",
//         col_paragraph_two: sectionData.col_paragraph_two || "",
//         // btnOne: sectionData.btnOne || "",
//         // btnTwo: sectionData.btnTwo || "",
//         // badge: sectionData.badge || "ABOUT US",
//         highlight_title: sectionData.highlight_title || "",
//         highlight_description: sectionData.highlight_description || "",
//         col_btn: sectionData.col_btn || "More Details",
//         // img_oneUrl: img_oneUrl,
//         // img_twoUrl: img_twoUrl
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
//       let img_oneUrl: string | null = existingSection?.img_oneUrl || null
//       let img_twoUrl: string | null = existingSection?.img_twoUrl || null

//       // Handle image updates
//       if (formData.img_one) {
//         // Delete old image if exists
//         if (existingSection?.img_oneUrl) {
//           await deleteFromBucket(existingSection.img_oneUrl)
//         }
//         // Upload new image
//         img_oneUrl = await uploadToBucket(formData.img_one, editId, 1)
//       }

//       if (formData.img_two) {
//         // Delete old image if exists
//         if (existingSection?.img_twoUrl) {
//           await deleteFromBucket(existingSection.img_twoUrl)
//         }
//         // Upload new image
//         img_twoUrl = await uploadToBucket(formData.img_two, editId, 2)
//       }

//       // Update section in database
//       const { data, error } = await supabase
//         .from("aboutSection")
//         .update({
//           title: values.title,
//           heading: values.heading,
//           paragraph: values.paragraph,
//           img_one: img_oneUrl,
//           img_two: img_twoUrl,
//           // subHeading: values.subHeading,
//           // subparagraph: values.subparagraph,
//           col_icon_one: values.col_icon_one,
//           col_icon_two: values.col_icon_two,
//           col_head_one: values.col_head_one,
//           col_head_two: values.col_head_two,
//           col_paragraph_one: values.col_paragraph_one,
//           col_paragraph_two: values.col_paragraph_two,
//           // btnOne: values.btnOne,
//           // btnTwo: values.btnTwo,
//           // badge: values.badge,
//           highlight_title: values.highlight_title,
//           highlight_description: values.highlight_description,
//           col_btn: values.col_btn
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
//       if (sectionToDelete?.img_oneUrl) {
//         await deleteFromBucket(sectionToDelete.img_oneUrl)
//       }
//       if (sectionToDelete?.img_twoUrl) {
//         await deleteFromBucket(sectionToDelete.img_twoUrl)
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
//       ? (STORAGE_TYPE === "bucket" ? section.img_oneUrl : section.img_one)
//       : (STORAGE_TYPE === "bucket" ? section.img_twoUrl : section.img_two)
    
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
//                {aboutSectionData.highlight_title}
//              </h4>
//              <p className="text-sm text-slate-50">
//                {aboutSectionData.highlight_description}
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
//              {aboutSectionData.col_btn}
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
//                         <Label htmlFor="paragraph">Description *</Label>
//                         <Field
//                           as="textarea"
//                           id="paragraph"
//                           name="paragraph"
//                           rows={4}
//                           className={`w-full p-3 border rounded-md ${errors.paragraph && touched.paragraph ? 'border-red-500' : ''}`}
//                           placeholder="Main description here..."
//                         />
//                         <ErrorMessage
//                           name="paragraph"
//                           component="div"
//                           className="text-sm text-red-400 mt-1"
//                         />
//                       </div>
//                     </div>

//                     {/* Right Column */}
//                     <div className="space-y-4">
//                       <div>
//                         <Label htmlFor="highlight_title">Highlight Title</Label>
//                         <Field
//                           as={Input}
//                           id="highlight_title"
//                           name="highlight_title"
//                           placeholder="Deliver Perfect Solution"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="highlight_description">Highlight Description</Label>
//                         <Field
//                           as="textarea"
//                           id="highlight_description"
//                           name="highlight_description"
//                           rows={4}
//                           className="w-full p-3 border rounded-md"
//                           placeholder="Highlight description here..."
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="col_btn">Button Text</Label>
//                         <Field
//                           as={Input}
//                           id="col_btn"
//                           name="col_btn"
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
//                         <Label htmlFor="img_one">Main Image (Big Image) *</Label>
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
                          
//                           {previewimg_one ? (
//                             <div className="text-center space-y-3">
//                               <img
//                                 src={previewimg_one}
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
//                         <Label htmlFor="img_two">Overlay Image (Small Image) *</Label>
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
                          
//                           {previewimg_two ? (
//                             <div className="text-center space-y-3">
//                               <img
//                                 src={previewimg_two}
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
//                           <Label htmlFor="col_icon_one">Icon 1</Label>
//                           <Field
//                             as={Input}
//                             id="col_icon_one"
//                             name="col_icon_one"
//                             placeholder="Settings"
//                           />
//                         </div>
                        
//                         <div>
//                           <Label htmlFor="col_head_one">Feature 1 Title *</Label>
//                           <Field
//                             as={Input}
//                             id="col_head_one"
//                             name="col_head_one"
//                             placeholder="Manage Tech Services"
//                             className={errors.col_head_one && touched.col_head_one ? 'border-red-500' : ''}
//                           />
//                           <ErrorMessage
//                             name="col_head_one"
//                             component="div"
//                             className="text-sm text-red-400 mt-1"
//                           />
//                         </div>
                        
//                         <div>
//                           <Label htmlFor="col_paragraph_one">Feature 1 Description *</Label>
//                           <Field
//                             as="textarea"
//                             id="col_paragraph_one"
//                             name="col_paragraph_one"
//                             rows={3}
//                             className={`w-full p-3 border rounded-md ${errors.col_paragraph_one && touched.col_paragraph_one ? 'border-red-500' : ''}`}
//                             placeholder="Description for feature 1"
//                           />
//                           <ErrorMessage
//                             name="col_paragraph_one"
//                             component="div"
//                             className="text-sm text-red-400 mt-1"
//                           />
//                         </div>
//                       </div>

//                       {/* Feature 2 */}
//                       <div className="space-y-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
//                         <div>
//                           <Label htmlFor="col_icon_two">Icon 2</Label>
//                           <Field
//                             as={Input}
//                             id="col_icon_two"
//                             name="col_icon_two"
//                             placeholder="ShieldCheck"
//                           />
//                         </div>
                        
//                         <div>
//                           <Label htmlFor="col_head_two">Feature 2 Title *</Label>
//                           <Field
//                             as={Input}
//                             id="col_head_two"
//                             name="col_head_two"
//                             placeholder="IT Consulting Solution"
//                             className={errors.col_head_two && touched.col_head_two ? 'border-red-500' : ''}
//                           />
//                           <ErrorMessage
//                             name="col_head_two"
//                             component="div"
//                             className="text-sm text-red-400 mt-1"
//                           />
//                         </div>
                        
//                         <div>
//                           <Label htmlFor="col_paragraph_two">Feature 2 Description *</Label>
//                           <Field
//                             as="textarea"
//                             id="col_paragraph_two"
//                             name="col_paragraph_two"
//                             rows={3}
//                             className={`w-full p-3 border rounded-md ${errors.col_paragraph_two && touched.col_paragraph_two ? 'border-red-500' : ''}`}
//                             placeholder="Description for feature 2"
//                           />
//                           <ErrorMessage
//                             name="col_paragraph_two"
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
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

// Constants - HomeSlide jaisa structure
const BUCKET_NAME = "aboutSection"
const STORAGE_TYPE = "bucket" // "bucket" ya "base64" change kar sakte hain
const CHUNK_SIZE = 60000
const DELIMITER = '|||CHUNK|||'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const TableName="about_section"
// Types
interface DatabaseAboutSection {
  id: string
  title: string
  heading: string
  paragraph: string
  img_one: string | null
  img_two: string | null
  
  col_icon_one: string
  col_icon_two: string
  col_head_one: string
  col_head_two: string
  col_paragraph_one: string
  col_paragraph_two: string
  col_btn: string
  
  highlight_title: string
  highlight_description: string
  created_at?: string
}

interface AboutSection {
  id: string
  title: string
  heading: string
  paragraph: string
  img_one: string | null
  img_two: string | null
  
  col_icon_one: string
  col_icon_two: string
  col_head_one: string
  col_head_two: string
  col_paragraph_one: string
  col_paragraph_two: string
 
  highlight_title: string
  highlight_description: string
  col_btn: string
  img_oneUrl?: string | null
  img_twoUrl?: string | null
}

export const aboutSectionData: AboutSectionData = {

  badge: "ABOUT US",
  heading: "Provide the Best Easy Solution for Your IT Problem",
  description:
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
  highlight_title: "Deliver Perfect Solution",
  highlight_description:
    "There are many variations passages of Lorem Ipsum available, but the majority.",
  col_btn: "More Details",
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
  paragraph: string
  
  col_icon_one: string
  col_icon_two: string
  col_head_one: string
  col_head_two: string
  col_paragraph_one: string
  col_paragraph_two: string
  col_btn: string
  highlight_title: string
  highlight_description: string
}



interface UpdateAboutSectionData {
  title: string;
  heading: string;
  paragraph: string;
  col_icon_one: string;
  col_icon_two: string;
  col_head_one: string;
  col_head_two: string;
  col_paragraph_one: string;
  col_paragraph_two: string;
  highlight_title: string;
  highlight_description: string;
  col_btn: string;
  img_one?: string | null;
  img_two?: string | null;
}


interface AboutSectionFormData {
  title: string
  heading: string
  paragraph: string
  col_icon_one: string
  col_icon_two: string
  col_head_one: string
  col_head_two: string
  col_paragraph_one: string
  col_paragraph_two: string
  col_btn: string
  highlight_title: string
  highlight_description: string
  img_one: File | null
  img_two: File | null
}

interface AboutSectionCardProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AboutSectionCard: FC<AboutSectionCardProps> = () => {
  // State
  const [sections, setSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)
  const  [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previewimg_one, setPreviewimg_one] = useState<string | null>(null)
  const [previewimg_two, setPreviewimg_two] = useState<string | null>(null)
  
  const fileInputRefOne = useRef<HTMLInputElement>(null)
  const fileInputRefTwo = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<AboutSectionFormData>({
    title: "",
    heading: "",
    paragraph: "",
    col_icon_one: "",
    col_icon_two: "",
    col_head_one: "",
    col_head_two: "",
    col_paragraph_one: "",
    col_paragraph_two: "",
    highlight_title: "",
    highlight_description: "",
    col_btn: "More Details",
    img_one: null,
    img_two: null
  })

  // Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .required('Title is required'),
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .required('Heading is required'),
    paragraph: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
    
    col_head_one: Yup.string()
      .min(2, 'Column 1 heading is required'),
    col_paragraph_one: Yup.string()
      .min(10, 'Column 1 description is required'),
    col_head_two: Yup.string()
      .min(2, 'Column 2 heading is required'),
    col_paragraph_two: Yup.string()
      .min(10, 'Column 2 description is required'),
  })

  // Initial Form Values
  const initialValues: AboutSectionFormValues = {
    title: formData.title || '',
    heading: formData.heading || '',
    paragraph: formData.paragraph || '',
    col_icon_one: formData.col_icon_one || '',
    col_icon_two: formData.col_icon_two || '',
    col_head_one: formData.col_head_one || '',
    col_head_two: formData.col_head_two || '',
    col_paragraph_one: formData.col_paragraph_one || '',
    col_paragraph_two: formData.col_paragraph_two || '',
    highlight_title: formData.highlight_title || '',
    highlight_description: formData.highlight_description || '',
    col_btn: formData.col_btn || 'More Details'
  }

  // Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      heading: "",
      paragraph: "",
      col_icon_one: "",
      col_icon_two: "",
      col_head_one: "",
      col_head_two: "",
      col_paragraph_one: "",
      col_paragraph_two: "",
      highlight_title: "",
      highlight_description: "",
      col_btn: "More Details",
      img_one: null,
      img_two: null
    })
    setEditId(null)
    setPreviewimg_one(null)
    setPreviewimg_two(null)
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
        .from(`${TableName}`)
        .select("*")
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching secticonvertToUserons:", error)
                toast.error("Failed to fetch about section data", {
          icon: <XCircle className="text-red-500" />,
        });
        return
      }

      const processedSections = (data || []).map(convertToAboutSection)
      setSections(processedSections)
            toast.success("About section data loaded successfully", {
        icon: <CheckCircle className="text-green-500" />,
      });

    }
     catch (error: unknown) {
        console.error("Error updating slide:", error);
        
        let errorMessage = "Failed to update slide";
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        ) {
          errorMessage = (error as { message: string }).message;
        }
        
        toast.error(errorMessage, {
          icon: <XCircle className="text-red-500" />,
        });
      } 
    finally {
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
        paragraph: dbSection.paragraph || "",
        img_one: null,
        img_two: null,
        col_icon_one: dbSection.col_icon_one || "",
        col_icon_two: dbSection.col_icon_two || "",
        col_head_one: dbSection.col_head_one || "",
        col_head_two: dbSection.col_head_two || "",
        col_paragraph_one: dbSection.col_paragraph_one || "",
        col_paragraph_two: dbSection.col_paragraph_two || "",
        highlight_title: dbSection.highlight_title || "",
        highlight_description: dbSection.highlight_description || "",
        col_btn: dbSection.col_btn || "More Details",
        img_oneUrl: dbSection.img_one,
        img_twoUrl: dbSection.img_two
      }
    } else {
      // For Base64 storage
      return {
        id: dbSection.id,
        title: dbSection.title || "",
        heading: dbSection.heading || "",
        paragraph: dbSection.paragraph || "",
        img_one: reconstructFromChunks(dbSection.img_one),
        img_two: reconstructFromChunks(dbSection.img_two),
        col_icon_one: dbSection.col_icon_one || "",
        col_icon_two: dbSection.col_icon_two || "",
        col_head_one: dbSection.col_head_one || "",
        col_head_two: dbSection.col_head_two || "",
        col_paragraph_one: dbSection.col_paragraph_one || "",
        col_paragraph_two: dbSection.col_paragraph_two || "",
        highlight_title: dbSection.highlight_title || "",
        highlight_description: dbSection.highlight_description || "",
        col_btn: dbSection.col_btn || "More Details"
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
      paragraph: section.paragraph,
      col_icon_one: section.col_icon_one,
      col_icon_two: section.col_icon_two,
      col_head_one: section.col_head_one,
      col_head_two: section.col_head_two,
      col_paragraph_one: section.col_paragraph_one,
      col_paragraph_two: section.col_paragraph_two,
      col_btn: section.col_btn,
      highlight_title: section.highlight_title,
      highlight_description: section.highlight_description,
      img_one: null,
      img_two: null
    })
    
    // Set preview images based on storage type
    if (STORAGE_TYPE === "bucket") {
      setPreviewimg_one(section.img_oneUrl || null)
      setPreviewimg_two(section.img_twoUrl || null)
    } else {
      setPreviewimg_one(section.img_one)
      setPreviewimg_two(section.img_two)
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
        setFormData(prev => ({ ...prev, img_one: file }))
        const previewUrl = URL.createObjectURL(file)
        setPreviewimg_one(previewUrl)
      } else {
        setFormData(prev => ({ ...prev, img_two: file }))
        const previewUrl = URL.createObjectURL(file)
        setPreviewimg_two(previewUrl)
      }
    }
  }

  // Handle Remove Image
  const handleRemoveImage = (imageNumber: 1 | 2) => {
    if (imageNumber === 1) {
      setFormData(prev => ({ ...prev, img_one: null }))
      setPreviewimg_one(null)
      if (fileInputRefOne.current) fileInputRefOne.current.value = ""
    } else {
      setFormData(prev => ({ ...prev, img_two: null }))
      setPreviewimg_two(null)
      if (fileInputRefTwo.current) fileInputRefTwo.current.value = ""
    }
  }

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (previewimg_one) URL.revokeObjectURL(previewimg_one)
      if (previewimg_two) URL.revokeObjectURL(previewimg_two)
    }
  }, [previewimg_one, previewimg_two])

  // Handle Submit (Create) - Updated for both storage types
  const handleSubmit = async (
    values: AboutSectionFormValues,
    formikHelpers: FormikHelpers<AboutSectionFormValues>
  ) => {
    if (submitting) return

    try {
      console.log("Submitting form with values:", values);
      setSubmitting(true)

      let img_oneData: string | null = null
      let img_twoData: string | null = null

      // Process images based on storage type
      if (formData.img_one) {
        if (STORAGE_TYPE === "bucket") {
          // Will upload after section creation to get ID
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.img_one)
            img_oneData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed for img_one:", convertError)
                      toast.error("Image 1 processing failed, but section will be created", {
            icon: <AlertTriangle className="text-yellow-500" />,
          });
          }
        }
      }

      if (formData.img_two) {
        if (STORAGE_TYPE === "bucket") {
          // Will upload after section creation to get ID
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.img_two)
            img_twoData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed for img_two:", convertError)
                      toast.error("Image 2 processing failed, but section will be created", {
            icon: <AlertTriangle className="text-yellow-500" />,
          });
          }
        }
      }

      // First create section
      const { data: sectionData, error: sectionError } = await supabase
        .from(`${TableName}`)
        .insert([
          {
            title: values.title,
            heading: values.heading,
            paragraph: values.paragraph,
            img_one: STORAGE_TYPE === "bucket" ? null : img_oneData,
            img_two: STORAGE_TYPE === "bucket" ? null : img_twoData,
            col_icon_one: values.col_icon_one,
            col_icon_two: values.col_icon_two,
            col_head_one: values.col_head_one,
            col_head_two: values.col_head_two,
            col_paragraph_one: values.col_paragraph_one,
            col_paragraph_two: values.col_paragraph_two,
            col_btn: values.col_btn,
            highlight_title: values.highlight_title,
            highlight_description: values.highlight_description,
          }
        ])
        .select()
        .single()

      if (sectionError) {
        console.error("Error adding section:", sectionError)
        // alert(`Error: ${sectionError.message}`)
              toast.error(`Failed to create: ${sectionError.message}`, {
        icon: <XCircle className="text-red-500" />,
      });
        return
      }

      // For bucket storage, upload images after getting section ID
      if (STORAGE_TYPE === "bucket") {
        let img_oneUrl: string | null = null
        let img_twoUrl: string | null = null

        if (formData.img_one) {
          try {
            img_oneUrl = await uploadToBucket(formData.img_one, sectionData.id, 1)
          } catch (error) {
            console.error("Failed to upload image 1:", error)
                      toast.error("Image 1 upload failed, but section was created", {
            icon: <AlertTriangle className="text-yellow-500" />,
          });
          }
        }

        if (formData.img_two) {
          try {
            img_twoUrl = await uploadToBucket(formData.img_two, sectionData.id, 2)
          } catch (error) {
            console.error("Failed to upload image 2:", error)
                      toast.error("Image 2 upload failed, but section was created", {
            icon: <AlertTriangle className="text-yellow-500" />,
          });
          }
        }

        // Update section with image URLs
        if (img_oneUrl || img_twoUrl) {
          const { error: updateError } = await supabase
            .from(`${TableName}`)
            .update({ 
              img_one: img_oneUrl,
              img_two: img_twoUrl
            })
            .eq("id", sectionData.id)

          if (updateError) {
            console.error("Error updating section with images:", updateError)
                      toast.error("Section created but images couldn't be saved", {
            icon: <AlertTriangle className="text-yellow-500" />,
          });
          }
        }

        // Update image data for response
        img_oneData = img_oneUrl
        img_twoData = img_twoUrl
      }

      // Create new section object
      const newSection: AboutSection = {
        id: sectionData.id,
        title: sectionData.title || "",
        heading: sectionData.heading || "",
        paragraph: sectionData.paragraph || "",
        img_one: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(img_oneData),
        img_two: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(img_twoData),
        col_icon_one: sectionData.col_icon_one || "",
        col_icon_two: sectionData.col_icon_two || "",
        col_head_one: sectionData.col_head_one || "",
        col_head_two: sectionData.col_head_two || "",
        col_paragraph_one: sectionData.col_paragraph_one || "",
        col_paragraph_two: sectionData.col_paragraph_two || "",
        highlight_title: sectionData.highlight_title || "",
        highlight_description: sectionData.highlight_description || "",
        col_btn: sectionData.col_btn || "More Details",
        img_oneUrl: STORAGE_TYPE === "bucket" ? img_oneData : null,
        img_twoUrl: STORAGE_TYPE === "bucket" ? img_twoData : null
      }

      // Update state
      setSections(prev => {
        const exists = prev.some(s => s.id === newSection.id)
        if (exists) {
          return prev.map(s => s.id === newSection.id ? newSection : s)
        }
        return [...prev, newSection]
      })
          toast.success("About section created successfully!", {
      icon: <CheckCircle className="text-green-500" />,
    });

      resetForm()
      formikHelpers.resetForm()
      setOpen(false)
      fetchSections()
    }  catch (error: unknown) {
  console.error("Service save failed:", error);

  let errorMessage = "Service save failed";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    errorMessage = (error as { message: string }).message;
  }

  toast.error(errorMessage, {
    icon: <XCircle className="text-red-500" />,
  });
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
      let img_oneData: string | null = null
      let img_twoData: string | null = null
      
      if (existingSection) {
        img_oneData = STORAGE_TYPE === "bucket" 
          ? existingSection.img_oneUrl 
          : existingSection.img_one
        img_twoData = STORAGE_TYPE === "bucket" 
          ? existingSection.img_twoUrl 
          : existingSection.img_two
      }

      // Handle image updates
      if (formData.img_one) {
        if (STORAGE_TYPE === "bucket") {
          // Delete old image if exists
          if (existingSection?.img_oneUrl) {
            await deleteFromBucket(existingSection.img_oneUrl)
          }
          // Upload new image
          img_oneData = await uploadToBucket(formData.img_one, editId, 1)
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.img_one)
            img_oneData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed:", convertError)
                      toast.error("Image 1 processing failed, keeping existing image", {
            icon: <AlertTriangle className="text-yellow-500" />,
          });
            // Keep existing image data
            img_oneData = existingSection?.img_one || null
          }
        }
      } else {
        // Keep existing image data
        img_oneData = existingSection?.img_one || existingSection?.img_oneUrl || null
      }

      if (formData.img_two) {
        if (STORAGE_TYPE === "bucket") {
          // Delete old image if exists
          if (existingSection?.img_twoUrl) {
            await deleteFromBucket(existingSection.img_twoUrl)
          }
          // Upload new image
          img_twoData = await uploadToBucket(formData.img_two, editId, 2)
        } else {
          // Convert to Base64 and chunk
          try {
            const base64Image = await convertImageToBase64(formData.img_two)
            img_twoData = splitIntoChunks(base64Image)
          } catch (convertError) {
            console.error("Base64 conversion failed:", convertError)
                      toast.error("Image 2 processing failed, keeping existing image", {
            icon: <AlertTriangle className="text-yellow-500" />,
          });
            // Keep existing image data
            img_twoData = existingSection?.img_two || null
          }
        }
      } else {
        // Keep existing image data
        img_twoData = existingSection?.img_two || existingSection?.img_twoUrl || null
      }

      // Update section in database
      const updateData: UpdateAboutSectionData = {
        title: values.title,
        heading: values.heading,
        paragraph: values.paragraph,
        col_icon_one: values.col_icon_one,
        col_icon_two: values.col_icon_two,
        col_head_one: values.col_head_one,
        col_head_two: values.col_head_two,
        col_paragraph_one: values.col_paragraph_one,
        col_paragraph_two: values.col_paragraph_two,
        highlight_title: values.highlight_title,
        highlight_description: values.highlight_description,
        col_btn: values.col_btn
      }

      // Add image data based on storage type
      if (STORAGE_TYPE === "bucket") {
        updateData.img_one = img_oneData
        updateData.img_two = img_twoData
      } else {
        updateData.img_one = img_oneData
        updateData.img_two = img_twoData
      }

      const { data, error } = await supabase
        .from(`${TableName}`)
        .update(updateData)
        .eq("id", editId)
        .select()
        .single()

      if (error) {
        console.error("Error updating section:", error)
        // alert(`Error: ${error.message}`)
              toast.error(`Failed to update: ${error.message}`, {
        icon: <XCircle className="text-red-500" />,
      });
        return
      }

      // Convert to component type and update state
      const updatedSection = convertToAboutSection(data)
      setSections(prev => prev.map(s => s.id === editId ? updatedSection : s))
          toast.success("About section updated successfully!", {
      icon: <CheckCircle className="text-green-500" />,
    });

      resetForm()
      formikHelpers.resetForm()
      setOpen(false)
      fetchSections()
    }
    // catch (error) {
    //   console.error("Error updating section:", error)
    //   alert(error instanceof Error ? `Error: ${error.message}` : "Error updating section")
    // }
    catch (error: unknown) {
        console.error("Error updating slide:", error);
        
        let errorMessage = "Failed to update slide";
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        ) {
          errorMessage = (error as { message: string }).message;
        }
        
        toast.error(errorMessage, {
          icon: <XCircle className="text-red-500" />,
        });
      } 
    finally {
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
        if (sectionToDelete?.img_oneUrl) {
          await deleteFromBucket(sectionToDelete.img_oneUrl)
        }
        if (sectionToDelete?.img_twoUrl) {
          await deleteFromBucket(sectionToDelete.img_twoUrl)
        }
      }
      // For Base64 storage, no need to delete from bucket

      // Delete from database
      const { error } = await supabase.from(`${TableName}`).delete().eq("id", id)

      if (error) {
        console.error("Error deleting section:", error)
        // alert(`Error: ${error.message}`)
              toast.error(`Failed to delete: ${error.message}`, {
        icon: <XCircle className="text-red-500" />,
      });

        return
      }

      // Update state
      setSections(prev => prev.filter(s => s.id !== id))
          toast.success("About section deleted successfully!", {
      icon: <CheckCircle className="text-green-500" />,
    });
    }
    catch (error: unknown) {
        console.error("Error updating slide:", error);
        
        let errorMessage = "Failed to update slide";
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        ) {
          errorMessage = (error as { message: string }).message;
        }
        
        toast.error(errorMessage, {
          icon: <XCircle className="text-red-500" />,
        });
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
    return STORAGE_TYPE === "bucket" ? section.img_oneUrl : section.img_one;
  } else {
    return STORAGE_TYPE === "bucket" ? section.img_twoUrl : section.img_two;
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
                    
                     {e.paragraph ? e.paragraph:aboutSectionData.description}
              </p>

              {/* Highlight Card */}
              <div className="bg-neutral-900 dark:bg-slate-900 border border-neutral-800 rounded-xl p-6 mb-8">
                <h4 className="font-semibold mb-2">
                      {/* {aboutSectionData.highlight_title} */}
                     {e.highlight_title ? e.highlight_title:aboutSectionData.highlight_title}
                      
                </h4>
                <p className="text-sm text-slate-50">
                  {/* {aboutSectionData.highlight_description} */}
                     {e.highlight_description ? e.highlight_description:aboutSectionData.highlight_description}

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
                   {/* <i className={`${e.col_icon_one ? e.col_icon_one:''} text-lg` } />   */}
                         <div 
        dangerouslySetInnerHTML={{
          __html: `<i class="fa-regular ${e.col_icon_one || ''}"></i>`
        }}
        className="flex items-center justify-center w-full h-full"
      />
    



                    </div>

                    {/* Text */}
                    <div>
                      <h5 className="font-medium leading-tight text-black dark:text-slate-50">
                        {/* {item.title} */}
                     {e.col_head_one ? e.col_head_one:''}

                      </h5>
                      <p className="text-sm  mt-1 text-black dark:text-slate-50">
                        {/* {item.description} */}
                     {e.col_paragraph_one ? e.col_paragraph_one:''}

                      </p>
                    </div>
                  </div>
                   <div
                    className="flex items-start gap-x-4"
                  >
                    {/* Icon */}
                    <div className="mt-4 flex h-10 w-10 p-3 rounded-full items-center justify-center items-center justify-center rounded-lg bg-green-100 text-[var(--color-theme)]">
                      {/* {item.icon} */}
                     {/* {e.col_icon_two ? e.col_icon_two:''} */}
                                      <div 
        dangerouslySetInnerHTML={{
          __html: `<i class="${e.col_icon_two || 'fas fa-globe'}"></i>`
        }}
        className="flex items-center justify-center w-full h-full"
      />

                    </div>

                    {/* Text */}
                    <div>
                      <h5 className="font-medium leading-tight text-black dark:text-slate-50">
                        {/* {item.title} */}
                     {e.col_head_two ? e.col_head_two:''}

                      </h5>
                      <p className="text-sm  mt-1 text-black dark:text-slate-50">
                        {/* {item.description} */}
                     {e.col_paragraph_two ? e.col_paragraph_two:''}

                      </p>
                    </div>
                  </div>
              </div>

              <button className="bg-[var(--color-theme)] hover:bg-[var(--color-theme-hover)] transition px-6 py-3 rounded-lg font-medium">
                {e.col_btn}
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
                          <Label htmlFor="paragraph">Description *</Label>
                          <Field
                            as="textarea"
                            id="paragraph"
                            name="paragraph"
                            rows={4}
                            className={`w-full p-3 border rounded-md ${errors.paragraph && touched.paragraph ? 'border-red-500' : ''}`}
                            placeholder="Main description here..."
                          />
                          <ErrorMessage
                            name="paragraph"
                            component="div"
                            className="text-sm text-red-400 mt-1"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="highlight_title">Highlight Title</Label>
                          <Field
                            as={Input}
                            id="highlight_title"
                            name="highlight_title"
                            placeholder="Deliver Perfect Solution"
                          />
                        </div>

                        <div>
                          <Label htmlFor="highlight_description">Highlight Description</Label>
                          <Field
                            as="textarea"
                            id="highlight_description"
                            name="highlight_description"
                            rows={4}
                            className="w-full p-3 border rounded-md"
                            placeholder="Highlight description here..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="col_btn">Button Text</Label>
                          <Field
                            as={Input}
                            id="col_btn"
                            name="col_btn"
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
                          <Label htmlFor="img_one">Main Image (Big Image)</Label>
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
                            
                            {previewimg_one ? (
                              <div className="text-center space-y-3">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={previewimg_one}
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
                            
                            {isEdit && !previewimg_one && (
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
                          <Label htmlFor="img_two">Overlay Image (Small Image)</Label>
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
                            
                            {previewimg_two ? (
                              <div className="text-center space-y-3">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={previewimg_two}
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
                            
                            {isEdit && !previewimg_two && (
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
                            <Label htmlFor="col_icon_one">Icon 1</Label>
                            <Field
                              as={Input}
                              id="col_icon_one"
                              name="col_icon_one"
                              placeholder="Settings"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="col_head_one">Feature 1 Title *</Label>
                            <Field
                              as={Input}
                              id="col_head_one"
                              name="col_head_one"
                              placeholder="Manage Tech Services"
                              className={errors.col_head_one && touched.col_head_one ? 'border-red-500' : ''}
                            />
                            <ErrorMessage
                              name="col_head_one"
                              component="div"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="col_paragraph_one">Feature 1 Description *</Label>
                            <Field
                              as="textarea"
                              id="col_paragraph_one"
                              name="col_paragraph_one"
                              rows={3}
                              className={`w-full p-3 border rounded-md ${errors.col_paragraph_one && touched.col_paragraph_one ? 'border-red-500' : ''}`}
                              placeholder="Description for feature 1"
                            />
                            <ErrorMessage
                              name="col_paragraph_one"
                              component="div"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                          <div>
                            <Label htmlFor="col_icon_two">Icon 2</Label>
                            <Field
                              as={Input}
                              id="col_icon_two"
                              name="col_icon_two"
                              placeholder="ShieldCheck"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="col_head_two">Feature 2 Title *</Label>
                            <Field
                              as={Input}
                              id="col_head_two"
                              name="col_head_two"
                              placeholder="IT Consulting Solution"
                              className={errors.col_head_two && touched.col_head_two ? 'border-red-500' : ''}
                            />
                            <ErrorMessage
                              name="col_head_two"
                              component="div"
                              className="text-sm text-red-400 mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="col_paragraph_two">Feature 2 Description *</Label>
                            <Field
                              as="textarea"
                              id="col_paragraph_two"
                              name="col_paragraph_two"
                              rows={3}
                              className={`w-full p-3 border rounded-md ${errors.col_paragraph_two && touched.col_paragraph_two ? 'border-red-500' : ''}`}
                              placeholder="Description for feature 2"
                            />
                            <ErrorMessage
                              name="col_paragraph_two"
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