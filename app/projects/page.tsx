// // components/ProjectComponent.tsx - DUAL STORAGE VERSION
// 'use client'

// import { FC, useCallback, useEffect, useState, useRef } from 'react'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { supabase } from "@/lib/supabase-client"
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
// import * as Yup from 'yup'
// import { Label } from '@/components/ui/label'
// import { Pen, Trash, Plus, Image as ImageIcon, X, Upload, Check, Folder, FileText } from "lucide-react"
// import { Skeleton } from '@/components/ui/skeleton'

// // ============ CONSTANTS ============
// const PROJECT_BUCKET_NAME = "project"; // For project table images
// const PROJECT_STORAGE_TYPE = "bucket"; // project table uses bucket storage
// const PROJECT_ITEM_STORAGE_TYPE = "base64"; // projectItem table uses base64 storage
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
// const CHUNK_SIZE = 60000;
// const DELIMITER = '|||CHUNK|||';

// // ============ INTERFACE DEFINITIONS ============
// interface ProjectItemFormValues {
//   paragraph: string;
//   title: string;
//   heading: string;
//   btn_text: string;
// }

// interface ProjectFormValues {
//   title: string;
//   heading: string;
// }

// // Database Types
// interface DatabaseProjectItem {
//   id: string;
//   created_at: string;
//   paragraph: string;
//   title: string;
//   heading: string;
//   btn_text: string;
//   image: string | null;
//   project_id: string;
// }

// interface DatabaseProject {
//   id: string;
//   created_at: string;
//   title: string;
//   heading: string;
//   image: string | null;
// }

// // Component Types
// interface ProjectItem {
//   id: string;
//   created_at: string;
//   paragraph: string;
//   title: string;
//   heading: string;
//   btn_text: string;
//   imageUrl: string | null; // For displaying
//   project_id: string;
// }

// interface Project {
//   id: string;
//   created_at: string;
//   title: string;
//   heading: string;
//   imageUrl: string | null; // For displaying (bucket URL)
//   projectItems: ProjectItem[];
// }

// // Form Data Types
// interface ProjectFormData {
//   title: string;
//   heading: string;
//   projectImage: File | null;
// }

// interface ProjectItemFormData {
//   paragraph: string;
//   title: string;
//   heading: string;
//   btn_text: string;
//   itemImage: File | null;
// }

// // ============ HELPER FUNCTIONS FOR BASE64 CHUNKING ============
// const splitIntoChunks = (base64String: string): string => {
//   if (base64String.length <= CHUNK_SIZE) {
//     return base64String;
//   }

//   const chunks: string[] = [];
//   for (let i = 0; i < base64String.length; i += CHUNK_SIZE) {
//     chunks.push(base64String.slice(i, i + CHUNK_SIZE));
//   }
//   return chunks.join(DELIMITER);
// };

// const reconstructFromChunks = (chunkedString: string | null | undefined): string | null => {
//   if (!chunkedString) return null;

//   if (!chunkedString.includes(DELIMITER)) {
//     return chunkedString;
//   }

//   return chunkedString.split(DELIMITER).join('');
// };

// // ============ COMPONENT ============
// const ProjectComponent: FC = () => {
//   // ============ STATE MANAGEMENT ============
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
//   const [projectItemModalOpen, setProjectItemModalOpen] = useState<boolean>(false);
//   const [isProjectEdit, setIsProjectEdit] = useState<boolean>(false);
//   const [isProjectItemEdit, setIsProjectItemEdit] = useState<boolean>(false);
//   const [editProjectId, setEditProjectId] = useState<string | null>(null);
//   const [editProjectItemId, setEditProjectItemId] = useState<string | null>(null);
//   const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState<boolean>(false);
//   const [projectPreview, setProjectPreview] = useState<string | null>(null);
//   const [projectItemPreview, setProjectItemPreview] = useState<string | null>(null);

//   const projectFileRef = useRef<HTMLInputElement>(null);
//   const projectItemFileRef = useRef<HTMLInputElement>(null);

//   const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
//     title: "",
//     heading: "",
//     projectImage: null,
//   });

//   const [projectItemFormData, setProjectItemFormData] = useState<ProjectItemFormData>({
//     paragraph: "",
//     title: "",
//     heading: "",
//     btn_text: "",
//     itemImage: null,
//   });

//   // ============ FORM VALIDATION ============
//   const projectValidationSchema = Yup.object({
//     title: Yup.string()
//       .min(2, 'Title must be at least 2 characters')
//       .max(100, 'Title must be less than 100 characters')
//       .required('Title is required'),
//     heading: Yup.string()
//       .min(10, 'Heading must be at least 10 characters')
//       .max(500, 'Heading must be less than 500 characters')
//       .required('Heading is required'),
//   });

//   const projectItemValidationSchema = Yup.object({
//     paragraph: Yup.string()
//       .min(10, 'Description must be at least 10 characters')
//       .max(2000, 'Description must be less than 2000 characters')
//       .required('Description is required'),
//     title: Yup.string()
//       .min(2, 'Title must be at least 2 characters')
//       .max(100, 'Title must be less than 100 characters')
//       .required('Title is required'),
//     heading: Yup.string()
//       .min(2, 'Heading must be at least 2 characters')
//       .max(200, 'Heading must be less than 200 characters')
//       .required('Heading is required'),
//     btn_text: Yup.string()
//       .min(2, 'Button text must be at least 2 characters')
//       .max(50, 'Button text must be less than 50 characters')
//       .required('Button text is required'),
//   });

//   // ============ RESET FUNCTIONS ============
//   const resetProjectForm = (): void => {
//     setProjectFormData({
//       title: "",
//       heading: "",
//       projectImage: null,
//     });
//     setEditProjectId(null);
//     setProjectPreview(null);
//     setIsProjectEdit(false);
//     setProjectModalOpen(false);
//     if (projectFileRef.current) {
//       projectFileRef.current.value = "";
//     }
//   };

//   const resetProjectItemForm = (): void => {
//     setProjectItemFormData({
//       paragraph: "",
//       title: "",
//       heading: "",
//       btn_text: "",
//       itemImage: null,
//     });
//     setEditProjectItemId(null);
//     setProjectItemPreview(null);
//     setIsProjectItemEdit(false);
//     setProjectItemModalOpen(false);
//     if (projectItemFileRef.current) {
//       projectItemFileRef.current.value = "";
//     }
//   };

//   // ============ IMAGE PROCESSING FUNCTIONS ============
//   const generateFileName = (id: string, file: File): string => {
//     const timestamp = Date.now();
//     const extension = file.name.split('.').pop() || 'jpg';
//     return `${id}_${timestamp}.${extension}`;
//   };

//   // Convert image to base64 (like HomeSliderCard)
//   const convertImageToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       if (file.size > MAX_IMAGE_SIZE) {
//         reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`));
//         return;
//       }

//       if (typeof window === 'undefined') {
//         reject(new Error('Image processing only available in browser'));
//         return;
//       }

//       const compressImage = (imageFile: File): Promise<string> => {
//         return new Promise((resolveCompress, rejectCompress) => {
//           const img = new window.Image();
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
//         } catch {
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

//   // ============ BUCKET STORAGE FUNCTIONS (for project table) ============
//   const uploadToBucket = async (file: File, id: string): Promise<string> => {
//     try {
//       const fileName = generateFileName(id, file);
      
//       const { error } = await supabase.storage
//         .from(PROJECT_BUCKET_NAME)
//         .upload(fileName, file, {
//           cacheControl: '3600',
//           upsert: true
//         });

//       if (error) {
//         console.error("Error uploading to bucket:", error);
//         throw error;
//       }

//       const { data: { publicUrl } } = supabase.storage
//         .from(PROJECT_BUCKET_NAME)
//         .getPublicUrl(fileName);

//       return publicUrl;
//     } catch (error) {
//       console.error("Upload failed:", error);
//       throw error;
//     }
//   };

//   const deleteFromBucket = async (imageUrl: string | null): Promise<void> => {
//     try {
//       if (!imageUrl) return;
      
//       const fileName = imageUrl.split('/').pop();
//       if (!fileName) return;

//       const { error } = await supabase.storage
//         .from(PROJECT_BUCKET_NAME)
//         .remove([fileName]);

//       if (error) {
//         console.error("Error deleting from bucket:", error);
//       }
//     } catch (error) {
//       console.error("Delete from bucket failed:", error);
//     }
//   };

//   // ============ DATA FETCHING ============
//   const fetchProjects = useCallback(async (): Promise<void> => {
//     try {
//       setLoading(true);
      
//       // Fetch all projects
//       const { data: projectsData, error: projectsError } = await supabase
//         .from("project")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (projectsError) {
//         console.error('Projects fetch error:', projectsError);
//         throw projectsError;
//       }

//       if (projectsData && projectsData.length > 0) {
//         // Fetch all project items
//         const { data: allItemsData, error: itemsError } = await supabase
//           .from("projectItem")
//           .select("*")
//           .order("created_at", { ascending: true });

//         if (itemsError) {
//           console.error('Project items fetch error:', itemsError);
//         }

//         // Process projects with their items
//         const processedProjects: Project[] = projectsData.map((project: DatabaseProject) => {
//           // Filter items for this project
//           const projectItems: ProjectItem[] = (allItemsData || [])
//             .filter((item: DatabaseProjectItem) => item.project_id === project.id)
//             .map((item: DatabaseProjectItem) => {
//               // Handle projectItem image as base64
//               const imageUrl = reconstructFromChunks(item.image);
              
//               return {
//                 id: item.id,
//                 created_at: item.created_at,
//                 paragraph: item.paragraph,
//                 title: item.title,
//                 heading: item.heading,
//                 btn_text: item.btn_text,
//                 imageUrl: imageUrl, // Base64 image
//                 project_id: item.project_id
//               };
//             });

//           // Handle project image as bucket URL
//           return {
//             id: project.id,
//             created_at: project.created_at,
//             title: project.title,
//             heading: project.heading,
//             imageUrl: project.image, // Bucket URL
//             projectItems: projectItems
//           };
//         });

//         setProjects(processedProjects);
//       } else {
//         setProjects([]);
//       }
//     } catch (error) {
//       console.error("Error in fetchProjects:", error);
//       setProjects([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProjects();
//   }, [fetchProjects]);

//   // ============ PROJECT CRUD (BUCKET STORAGE) ============
//   const handleProjectSubmit = async (
//     values: ProjectFormValues,
//     formikHelpers: FormikHelpers<ProjectFormValues>
//   ): Promise<void> => {
//     if (submitting) return;

//     try {
//       setSubmitting(true);

//       // First create project without image to get ID
//       const { data: projectData, error: projectError } = await supabase
//         .from("project")
//         .insert([
//           {
//             title: values.title,
//             heading: values.heading,
//             image: null,
//           },
//         ])
//         .select()
//         .single();

//       if (projectError) {
//         console.error("Project insert error:", projectError);
//         throw projectError;
//       }

//       let imageUrl: string | null = null;

//       // Upload image to bucket if provided
//       if (projectFormData.projectImage) {
//         try {
//           imageUrl = await uploadToBucket(projectFormData.projectImage, projectData.id);
          
//           // Update project with image URL
//           const { error: updateError } = await supabase
//             .from("project")
//             .update({ image: imageUrl })
//             .eq("id", projectData.id);

//           if (updateError) {
//             console.error("Error updating project with image:", updateError);
//           }
//         } catch (uploadError) {
//           console.error("Image upload failed:", uploadError);
//         }
//       }

//       // Create new project object for state
//       const newProject: Project = {
//         id: projectData.id,
//         created_at: projectData.created_at,
//         title: projectData.title,
//         heading: projectData.heading,
//         imageUrl: imageUrl, // Bucket URL
//         projectItems: [],
//       };

//       // Update state
//       setProjects((prev) => [newProject, ...prev]);
      
//       resetProjectForm();
//       formikHelpers.resetForm();
      
//     } catch (error) {
//       console.error("Error saving project:", error);
//       alert(error instanceof Error ? error.message : "Error saving project");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleProjectUpdate = async (
//     values: ProjectFormValues,
//     formikHelpers: FormikHelpers<ProjectFormValues>
//   ): Promise<void> => {
//     if (!editProjectId || submitting) return;

//     try {
//       setSubmitting(true);
      
//       const existingProject = projects.find((p) => p.id === editProjectId);
//       let imageUrl: string | null = existingProject?.imageUrl || null;

//       // Handle image update
//       if (projectFormData.projectImage) {
//         // Delete old image if exists
//         if (existingProject?.imageUrl) {
//           await deleteFromBucket(existingProject.imageUrl);
//         }

//         // Upload new image
//         imageUrl = await uploadToBucket(projectFormData.projectImage, editProjectId);
//       }

//       // Update project in database
//       const { data, error } = await supabase
//         .from("project")
//         .update({
//           title: values.title,
//           heading: values.heading,
//           image: imageUrl,
//         })
//         .eq("id", editProjectId)
//         .select()
//         .single();

//       if (error) {
//         console.error("Project update error:", error);
//         throw error;
//       }

//       // Update project in state
//       const updatedProject: Project = {
//         ...existingProject!,
//         title: data.title,
//         heading: data.heading,
//         imageUrl: imageUrl,
//       };

//       setProjects((prev) =>
//         prev.map((p) => (p.id === editProjectId ? updatedProject : p))
//       );

//       resetProjectForm();
//       formikHelpers.resetForm();
      
//     } catch (error) {
//       console.error("Error updating project:", error);
//       alert(error instanceof Error ? error.message : "Error updating project");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteProject = async (id: string): Promise<void> => {
//     if (!window.confirm("Delete this project and all its items?")) return;

//     try {
//       const projectToDelete = projects.find(p => p.id === id);
      
//       // Delete project image from bucket if exists
//       if (projectToDelete?.imageUrl) {
//         await deleteFromBucket(projectToDelete.imageUrl);
//       }

//       // Delete all project items (base64, so no bucket cleanup needed)
//       if (projectToDelete?.projectItems && projectToDelete.projectItems.length > 0) {
//         // Delete items from database
//         await supabase
//           .from("projectItem")
//           .delete()
//           .eq("project_id", id);
//       }

//       // Delete project from database
//       const { error } = await supabase
//         .from("project")
//         .delete()
//         .eq("id", id);

//       if (error) {
//         console.error("Project delete error:", error);
//         throw error;
//       }

//       // Remove from state
//       setProjects(prev => prev.filter(p => p.id !== id));
      
//     } catch (error) {
//       console.error("Error deleting project:", error);
//       alert("Error deleting project");
//     }
//   };

//   // ============ PROJECT ITEM CRUD (BASE64 STORAGE) ============
//   const handleProjectItemSubmit = async (
//     values: ProjectItemFormValues,
//     formikHelpers: FormikHelpers<ProjectItemFormValues>
//   ): Promise<void> => {
//     if (!selectedProjectId || submitting) return;

//     try {
//       setSubmitting(true);

//       let imageData: string | null = null;

//       // Process image as base64
//       if (projectItemFormData.itemImage) {
//         try {
//           const base64Image = await convertImageToBase64(projectItemFormData.itemImage);
//           imageData = splitIntoChunks(base64Image);
//         } catch (convertError) {
//           console.error("Base64 conversion failed:", convertError);
//         }
//       }

//       // Create project item with base64 image
//       const { data, error } = await supabase
//         .from("projectItem")
//         .insert([
//           {
//             ...values,
//             project_id: selectedProjectId,
//             image: imageData, // Base64 chunks
//           },
//         ])
//         .select()
//         .single();

//       if (error) {
//         console.error("Project item insert error:", error);
//         throw error;
//       }

//       // Create new item object for state
//       const newItem: ProjectItem = {
//         ...data,
//         imageUrl: reconstructFromChunks(imageData), // Reconstruct base64
//       };

//       // Update state
//       setProjects((prev) =>
//         prev.map((project) =>
//           project.id === selectedProjectId
//             ? { ...project, projectItems: [...project.projectItems, newItem] }
//             : project
//         )
//       );

//       resetProjectItemForm();
//       formikHelpers.resetForm();
      
//     } catch (error) {
//       console.error("Error saving project item:", error);
//       alert(error instanceof Error ? error.message : "Error saving item");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleProjectItemUpdate = async (
//     values: ProjectItemFormValues,
//     formikHelpers: FormikHelpers<ProjectItemFormValues>
//   ): Promise<void> => {
//     if (!editProjectItemId || !selectedProjectId || submitting) return;

//     try {
//       setSubmitting(true);

//       const project = projects.find(p => p.id === selectedProjectId);
//       const existingItem = project?.projectItems.find(item => item.id === editProjectItemId);
//       let imageData: string | null = null;

//       // Process new image as base64 if provided
//       if (projectItemFormData.itemImage) {
//         try {
//           const base64Image = await convertImageToBase64(projectItemFormData.itemImage);
//           imageData = splitIntoChunks(base64Image);
//         } catch (convertError) {
//           console.error("Base64 conversion failed:", convertError);
//           // Keep existing image data
//           imageData = existingItem?.imageUrl ? splitIntoChunks(existingItem.imageUrl) : null;
//         }
//       } else {
//         // Keep existing image data
//         imageData = existingItem?.imageUrl ? splitIntoChunks(existingItem.imageUrl) : null;
//       }

//       // Update item in database
//       const updateData = await supabase
//         .from("projectItem")
//         .update({
//           paragraph: values.paragraph,
//           title: values.title,
//           heading: values.heading,
//           btn_text: values.btn_text,
//           image: imageData, // Base64 chunks
//         })
//         .eq("id", editProjectItemId)
//         .select()
//         .single();

//       if (updateData.error) {
//         console.error("Project item update error:", updateData.error);
//         throw updateData.error;
//       }

//       // Update item in state
//       const updatedItem: ProjectItem = {
//         ...updateData.data!,
//         imageUrl: reconstructFromChunks(imageData), // Reconstruct base64
//       };

//       setProjects(prev => prev.map(project => {
//         if (project.id === selectedProjectId) {
//           return {
//             ...project,
//             projectItems: project.projectItems.map(item =>
//               item.id === editProjectItemId ? updatedItem : item
//             )
//           };
//         }
//         return project;
//       }));

//       resetProjectItemForm();
//       formikHelpers.resetForm();
      
//     } catch (error) {
//       console.error("Error updating project item:", error);
//       alert(error instanceof Error ? error.message : "Error updating item");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteProjectItem = async (projectId: string, itemId: string): Promise<void> => {
//     if (!window.confirm("Delete this project item?")) return;

//     try {
//       // Delete from database (no bucket cleanup needed for base64)
//       const { error } = await supabase
//         .from("projectItem")
//         .delete()
//         .eq("id", itemId);

//       if (error) {
//         console.error("Project item delete error:", error);
//         throw error;
//       }

//       // Update state
//       setProjects(prev => prev.map(project => {
//         if (project.id === projectId) {
//           return {
//             ...project,
//             projectItems: project.projectItems.filter(item => item.id !== itemId)
//           };
//         }
//         return project;
//       }));
      
//     } catch (error) {
//       console.error("Error deleting project item:", error);
//       alert("Error deleting project item");
//     }
//   };

//   // ============ IMAGE HANDLERS ============
//   const handleProjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null
//     if (!file) return
//     if (!file.type.startsWith("image/")) return alert("Select image only")
//     if (file.size > MAX_IMAGE_SIZE) return alert("File too large")
//     setProjectFormData(prev => ({ ...prev, projectImage: file }))
//     setProjectPreview(URL.createObjectURL(file))
//   }

//   const handleProjectItemImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null
//     if (!file) return
//     if (!file.type.startsWith("image/")) return alert("Select image only")
//     if (file.size > MAX_IMAGE_SIZE) return alert("File too large")
//     setProjectItemFormData(prev => ({ ...prev, itemImage: file }))
//     setProjectItemPreview(URL.createObjectURL(file))
//   }

//   const handleRemoveProjectImage = (): void => {
//     setProjectFormData(prev => ({ ...prev, projectImage: null }));
//     setProjectPreview(null);
//     if (projectFileRef.current) projectFileRef.current.value = "";
//   };

//   const handleRemoveProjectItemImage = (): void => {
//     setProjectItemFormData(prev => ({ ...prev, itemImage: null }));
//     setProjectItemPreview(null);
//     if (projectItemFileRef.current) projectItemFileRef.current.value = "";
//   };

//   // Cleanup preview URLs
//   useEffect(() => {
//     return () => {
//       if (projectPreview) URL.revokeObjectURL(projectPreview);
//       if (projectItemPreview) URL.revokeObjectURL(projectItemPreview);
//     };
//   }, [projectPreview, projectItemPreview]);

//   // ============ UI HANDLERS ============
//   const handleEditProject = (project: Project): void => {
//     setIsProjectEdit(true);
//     setEditProjectId(project.id);
//     setProjectFormData({
//       title: project.title,
//       heading: project.heading,
//       projectImage: null,
//     });
//     setProjectPreview(project.imageUrl || null);
//     setProjectModalOpen(true);
//   };

//   const handleEditProjectItem = (projectId: string, item: ProjectItem): void => {
//     setSelectedProjectId(projectId);
//     setIsProjectItemEdit(true);
//     setEditProjectItemId(item.id);
//     setProjectItemFormData({
//       paragraph: item.paragraph,
//       title: item.title,
//       heading: item.heading,
//       btn_text: item.btn_text,
//       itemImage: null,
//     });
//     setProjectItemPreview(item.imageUrl || null);
//     setProjectItemModalOpen(true);
//   };

//   const handleAddProjectItem = (projectId: string): void => {
//     setSelectedProjectId(projectId);
//     setIsProjectItemEdit(false);
//     setEditProjectItemId(null);
//     resetProjectItemForm();
//     setProjectItemModalOpen(true);
//   };

//   // ============ FORMATTING FUNCTIONS ============
//   const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // ============ LOADING SKELETON ============
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background))] p-4 sm:p-6 lg:p-8">
//         <div className="text-center mb-12">
//           <Skeleton className="h-12 w-64 mx-auto mb-4" />
//           <Skeleton className="h-4 w-96 mx-auto" />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="border rounded-lg p-6">
//               <Skeleton className="h-48 w-full rounded-lg mb-4" />
//               <Skeleton className="h-6 w-3/4 mb-2" />
//               <Skeleton className="h-4 w-1/2 mb-4" />
//               <div className="space-y-2">
//                 <Skeleton className="h-4 w-full" />
//                 <Skeleton className="h-4 w-full" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ============ RENDER ============
//   return (
//     <div className="min-h-screen bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background))] p-4 sm:p-6 lg:p-8">
//       {/* Header Section */}
//       <div className="text-center mb-12">
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//           Project Management
//         </h1>
//         <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
//           Manage your projects and items with full CRUD functionality
//         </p>
        
//         <Button
//           onClick={() => {
//             setIsProjectEdit(false);
//             resetProjectForm();
//             setProjectModalOpen(true);
//           }}
//           className="gap-2 group"
//           size="lg"
//         >
//           <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
//           Add New Project
//         </Button>
//       </div>

//       {/* Projects Grid */}
//       {projects.length === 0 ? (
//         <div className="text-center py-20 border-2 border-dashed rounded-2xl border-gray-300 max-w-2xl mx-auto">
//           <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-blue-500/10">
//             <Folder className="w-12 h-12 text-blue-400" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">
//             No Projects Yet
//           </h3>
//           <p className="text-gray-500 mb-6 max-w-md mx-auto">
//             Create your first project to get started
//           </p>
//           <Button
//             onClick={() => {
//               setIsProjectEdit(false);
//               resetProjectForm();
//               setProjectModalOpen(true);
//             }}
//             variant="outline"
//             className="gap-2"
//           >
//             <Plus size={20} />
//             Create First Project
//           </Button>
//         </div>
//       ) : (
//       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
//           {projects.map((project) => (
//             <div
//               key={project.id}
//               className="group relative h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 hover:scale-[1.03] hover:-translate-y-1 transition-all duration-500 ease-out backdrop-blur-sm"
//             >
//               {/* Project Image */}
//               <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
//                 {/* Decorative gradient overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
//                 {project.imageUrl ? (
//                   <img
//                     src={project.imageUrl}
//                     alt={project.title}
//                     className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
//                     <div className="text-center">
//                       <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
//                       <p className="text-xs text-gray-500 dark:text-gray-400">No image</p>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Action buttons overlay */}
//                 <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-20">
//                   <div className="flex gap-2">
//                     <Button
//                       size="sm"
//                       className="gap-1 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/50"
//                       onClick={() => handleEditProject(project)}
//                     >
//                       <Pen size={16} />
//                       Edit
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       className="gap-1 shadow-lg hover:shadow-red-500/50"
//                       onClick={() => handleDeleteProject(project.id)}
//                     >
//                       <Trash size={16} />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Project Content */}
//               <div className="p-6 flex flex-col h-full">
//                 {/* Title & Description */}
//                 <div className="mb-4">
//                   <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
//                     {project.title}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
//                     {project.heading}
//                   </p>
//                 </div>
                
//                 {/* Divider */}
//                 <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-4" />
                
//                 {/* Project Stats */}
//                 {/* <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-5 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full" />
//                     <span className="font-medium">{project.projectItems.length} items</span>
//                   </div>
//                   <span className="text-gray-400">{formatDate(project.created_at)}</span>
//                 </div> */}
                
//                 {/* Add Item Button */}
//                 <Button
//                   onClick={() => handleAddProjectItem(project.id)}
//                   className="w-full mb-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/30 group/btn"
//                 >
//                   <Plus className="w-4 h-4 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
//                   Add Item
//                 </Button>
                
//                 {/* Project Items List */}
//                 {project.projectItems.length > 0 ? (
//                   <div className="flex-1 space-y-2 overflow-y-auto max-h-48 pr-2">
//                     {project.projectItems.map((item) => (
//                       <div
//                         key={item.id}
//                         className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-850 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300"
//                       >
//                         <div className="flex justify-between items-start gap-2">
//                           <div className="flex-1 min-w-0">
//                             <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
//                               {item.title}
//                             </h4>
//                             <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
//                               {item.heading}
//                             </p>
//                             <div className="flex items-center gap-2 flex-wrap">
//                               <span className="text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium">
//                                 {item.btn_text}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="flex gap-1 flex-shrink-0">
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleEditProjectItem(project.id, item)}
//                               className="h-7 w-7 p-0 hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400"
//                             >
//                               <Pen className="h-3.5 w-3.5" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleDeleteProjectItem(project.id, item.id)}
//                               className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400"
//                             >
//                               <Trash className="h-3.5 w-3.5" />
//                             </Button>
//                           </div>
//                         </div>
                        
//                         {/* Item Image */}
//                         {item.imageUrl && (
//                           <div className="mt-2.5 rounded-lg overflow-hidden h-20 bg-gray-200 dark:bg-gray-700">
//                             <img
//                               src={item.imageUrl}
//                               alt={item.title}
//                               className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex-1 flex items-center justify-center py-6 text-center text-gray-500 dark:text-gray-400">
//                     <div>
//                       <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-2">
//                         <Plus className="w-6 h-6 text-gray-400" />
//                       </div>
//                       <p className="text-sm font-medium">No items yet</p>
//                       <p className="text-xs">Add your first item</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ============ PROJECT MODAL ============ */}
//       <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">
//               {isProjectEdit ? 'Edit Project' : 'Create New Project'}
//             </DialogTitle>
//           </DialogHeader>
          
//           <Formik
//             initialValues={{
//               title: projectFormData.title,
//               heading: projectFormData.heading
//             }}
//             validationSchema={projectValidationSchema}
//             onSubmit={isProjectEdit ? handleProjectUpdate : handleProjectSubmit}
//             enableReinitialize
//           >
//             {({ isSubmitting, errors, touched }) => (
//               <Form className="space-y-6">
//                 <div>
//                   <Label htmlFor="title" className="text-base font-medium">
//                     Project Title *
//                   </Label>
//                   <Field
//                     as={Input}
//                     id="title"
//                     name="title"
//                     placeholder="e.g., E-commerce Website"
//                     className={`mt-2 text-lg ${errors.title && touched.title ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage
//                     name="title"
//                     component="div"
//                     className="text-sm text-red-500 mt-1"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="heading" className="text-base font-medium">
//                     Project Description *
//                   </Label>
//                   <Field
//                     as={Textarea}
//                     id="heading"
//                     name="heading"
//                     placeholder="Brief description of the project..."
//                     rows={3}
//                     className={`mt-2 resize-none ${errors.heading && touched.heading ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage
//                     name="heading"
//                     component="div"
//                     className="text-sm text-red-500 mt-1"
//                   />
//                 </div>

//                 {/* Image Upload for Project (Bucket Storage) */}
//                 <div>
//                   <Label className="text-base font-medium block mb-3">
//                     Project Image (Cloud Storage)
//                   </Label>
                  
//                   <div
//                     className={`relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer hover:border-blue-500
//                       ${projectPreview ? 'border-transparent' : 'border-gray-300'}
//                       ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
//                     `}
//                     onClick={() => !submitting && projectFileRef.current?.click()}
//                   >
//                     <input
//                       ref={projectFileRef}
//                       type="file"
//                       onChange={handleProjectImageChange}
//                       accept="image/*"
//                       className="hidden"
//                       disabled={submitting}
//                     />
                    
//                     {projectPreview ? (
//                       <div className="relative">
//                         <img
//                           src={projectPreview}
//                           alt="Preview"
//                           className="w-full h-64 object-cover rounded-lg"
//                         />
//                         <Button
//                           type="button"
//                           size="icon"
//                           variant="destructive"
//                           className="absolute top-3 right-3"
//                           onClick={handleRemoveProjectImage}
//                         >
//                           <X size={20} />
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="py-12 text-center">
//                         <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-500/10">
//                           <Upload className="w-8 h-8 text-blue-500" />
//                         </div>
//                         <div>
//                           <p className="text-lg font-medium text-gray-700 mb-1">
//                             Click to upload image
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             PNG, JPG, GIF up to 5MB
//                           </p>
//                         </div>
//                         {isProjectEdit && (
//                           <p className="text-sm text-gray-500 mt-4">
//                             Leave empty to keep existing image
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
                  
//                   <p className="text-xs text-gray-500 mt-2">
//                     Images are stored in secure cloud storage bucket.
//                   </p>
//                 </div>

//                 <DialogFooter className="mt-8 pt-6 border-t border-gray-200">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={resetProjectForm}
//                     disabled={isSubmitting}
//                     className="gap-2"
//                   >
//                     <X size={16} />
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="gap-2 bg-blue-600 hover:bg-blue-700"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <Check size={16} />
//                         {isProjectEdit ? 'Update Project' : 'Create Project'}
//                       </>
//                     )}
//                   </Button>
//                 </DialogFooter>
//               </Form>
//             )}
//           </Formik>
//         </DialogContent>
//       </Dialog>

//       {/* ============ PROJECT ITEM MODAL ============ */}
//       <Dialog open={projectItemModalOpen} onOpenChange={setProjectItemModalOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">
//               {isProjectItemEdit ? 'Edit Project Item' : 'Add Project Item'}
//             </DialogTitle>
//           </DialogHeader>
          
//           <Formik
//             initialValues={{
//               paragraph: projectItemFormData.paragraph,
//               title: projectItemFormData.title,
//               heading: projectItemFormData.heading,
//               btn_text: projectItemFormData.btn_text
//             }}
//             validationSchema={projectItemValidationSchema}
//             onSubmit={isProjectItemEdit ? handleProjectItemUpdate : handleProjectItemSubmit}
//             enableReinitialize
//           >
//             {({ isSubmitting, errors, touched }) => (
//               <Form className="space-y-6">
//                 <div>
//                   <Label htmlFor="title" className="text-base font-medium">
//                     Item Title *
//                   </Label>
//                   <Field
//                     as={Input}
//                     id="title"
//                     name="title"
//                     placeholder="e.g., Homepage Design"
//                     className={`mt-2 text-lg ${errors.title && touched.title ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage
//                     name="title"
//                     component="div"
//                     className="text-sm text-red-500 mt-1"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="heading" className="text-base font-medium">
//                     Item Heading *
//                   </Label>
//                   <Field
//                     as={Input}
//                     id="heading"
//                     name="heading"
//                     placeholder="e.g., Responsive homepage with animations"
//                     className={`mt-2 ${errors.heading && touched.heading ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage
//                     name="heading"
//                     component="div"
//                     className="text-sm text-red-500 mt-1"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="paragraph" className="text-base font-medium">
//                     Description *
//                   </Label>
//                   <Field
//                     as={Textarea}
//                     id="paragraph"
//                     name="paragraph"
//                     placeholder="Detailed description of the item..."
//                     rows={4}
//                     className={`mt-2 resize-none ${errors.paragraph && touched.paragraph ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage
//                     name="paragraph"
//                     component="div"
//                     className="text-sm text-red-500 mt-1"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="btn_text" className="text-base font-medium">
//                     Button Text *
//                   </Label>
//                   <Field
//                     as={Input}
//                     id="btn_text"
//                     name="btn_text"
//                     placeholder="e.g., View Details, Learn More"
//                     className={`mt-2 ${errors.btn_text && touched.btn_text ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage
//                     name="btn_text"
//                     component="div"
//                     className="text-sm text-red-500 mt-1"
//                   />
//                 </div>

//                 {/* Image Upload for Project Item (Base64 Storage) */}
//                 <div>
//                   <Label className="text-base font-medium block mb-3">
//                     Item Image (Database Storage)
//                   </Label>
                  
//                   <div
//                     className={`relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer hover:border-purple-500
//                       ${projectItemPreview ? 'border-transparent' : 'border-gray-300'}
//                       ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
//                     `}
//                     onClick={() => !submitting && projectItemFileRef.current?.click()}
//                   >
//                     <input
//                       ref={projectItemFileRef}
//                       type="file"
//                       onChange={handleProjectItemImageChange}
//                       accept="image/*"
//                       className="hidden"
//                       disabled={submitting}
//                     />
                    
//                     {projectItemPreview ? (
//                       <div className="relative">
//                         <img
//                           src={projectItemPreview}
//                           alt="Preview"
//                           className="w-full h-64 object-cover rounded-lg"
//                         />
//                         <Button
//                           type="button"
//                           size="icon"
//                           variant="destructive"
//                           className="absolute top-3 right-3"
//                           onClick={handleRemoveProjectItemImage}
//                         >
//                           <X size={20} />
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="py-12 text-center">
//                         <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-purple-500/10">
//                           <Upload className="w-8 h-8 text-purple-500" />
//                         </div>
//                         <div>
//                           <p className="text-lg font-medium text-gray-700 mb-1">
//                             Click to upload image
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             PNG, JPG, GIF up to 5MB
//                           </p>
//                         </div>
//                         {isProjectItemEdit && (
//                           <p className="text-sm text-gray-500 mt-4">
//                             Leave empty to keep existing image
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
                  
//                   <p className="text-xs text-gray-500 mt-2">
//                     Images are automatically compressed and stored in database as Base64.
//                   </p>
//                 </div>

//                 <DialogFooter className="mt-8 pt-6 border-t border-gray-200">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={resetProjectItemForm}
//                     disabled={isSubmitting}
//                     className="gap-2"
//                   >
//                     <X size={16} />
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="gap-2 bg-purple-600 hover:bg-purple-700"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <Check size={16} />
//                         {isProjectItemEdit ? 'Update Item' : 'Add Item'}
//                       </>
//                     )}
//                   </Button>
//                 </DialogFooter>
//               </Form>
//             )}
//           </Formik>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ProjectComponent;

// components/ProjectComponent.tsx - UPDATED UI VERSION
'use client'

import { FC, useCallback, useEffect, useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { supabase } from "@/lib/supabase-client"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Label } from '@/components/ui/label'
import { Pen, Trash, Plus, Image as ImageIcon, X, Upload, Check, Folder, FileText, Grid, List } from "lucide-react"
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// ============ CONSTANTS ============
const PROJECT_BUCKET_NAME = "project";
const PROJECT_STORAGE_TYPE = "bucket";
const PROJECT_ITEM_STORAGE_TYPE = "base64";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const CHUNK_SIZE = 60000;
const DELIMITER = '|||CHUNK|||';

// ============ INTERFACE DEFINITIONS ============
interface ProjectItemFormValues {
  paragraph: string;
  title: string;
  heading: string;
  btn_text: string;
}

interface ProjectFormValues {
  title: string;
  heading: string;
}

interface DatabaseProjectItem {
  id: string;
  created_at: string;
  paragraph: string;
  title: string;
  heading: string;
  btn_text: string;
  image: string | null;
  project_id: string;
}

interface DatabaseProject {
  id: string;
  created_at: string;
  title: string;
  heading: string;
  image: string | null;
}

interface ProjectItem {
  id: string;
  created_at: string;
  paragraph: string;
  title: string;
  heading: string;
  btn_text: string;
  imageUrl: string | null;
  project_id: string;
}

interface Project {
  id: string;
  created_at: string;
  title: string;
  heading: string;
  imageUrl: string | null;
  projectItems: ProjectItem[];
}

interface ProjectFormData {
  title: string;
  heading: string;
  projectImage: File | null;
}

interface ProjectItemFormData {
  paragraph: string;
  title: string;
  heading: string;
  btn_text: string;
  itemImage: File | null;
}

// ============ HELPER FUNCTIONS ============
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

// ============ COMPONENT ============
const ProjectComponent: FC = () => {
  // ============ STATE MANAGEMENT ============
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
  const [projectItemModalOpen, setProjectItemModalOpen] = useState<boolean>(false);
  const [isProjectEdit, setIsProjectEdit] = useState<boolean>(false);
  const [isProjectItemEdit, setIsProjectItemEdit] = useState<boolean>(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editProjectItemId, setEditProjectItemId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [projectPreview, setProjectPreview] = useState<string | null>(null);
  const [projectItemPreview, setProjectItemPreview] = useState<string | null>(null);

  const projectFileRef = useRef<HTMLInputElement>(null);
  const projectItemFileRef = useRef<HTMLInputElement>(null);

  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    title: "",
    heading: "",
    projectImage: null,
  });

  const [projectItemFormData, setProjectItemFormData] = useState<ProjectItemFormData>({
    paragraph: "",
    title: "",
    heading: "",
    btn_text: "",
    itemImage: null,
  });

  // ============ FORM VALIDATION ============
  const projectValidationSchema = Yup.object({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title must be less than 100 characters')
      .required('Title is required'),
    heading: Yup.string()
      .min(10, 'Heading must be at least 10 characters')
      .max(500, 'Heading must be less than 500 characters')
      .required('Heading is required'),
  });

  const projectItemValidationSchema = Yup.object({
    paragraph: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(2000, 'Description must be less than 2000 characters')
      .required('Description is required'),
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title must be less than 100 characters')
      .required('Title is required'),
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .max(200, 'Heading must be less than 200 characters')
      .required('Heading is required'),
    btn_text: Yup.string()
      .min(2, 'Button text must be at least 2 characters')
      .max(50, 'Button text must be less than 50 characters')
      .required('Button text is required'),
  });

  // ============ RESET FUNCTIONS ============
  const resetProjectForm = (): void => {
    setProjectFormData({
      title: "",
      heading: "",
      projectImage: null,
    });
    setEditProjectId(null);
    setProjectPreview(null);
    setIsProjectEdit(false);
    setProjectModalOpen(false);
    if (projectFileRef.current) {
      projectFileRef.current.value = "";
    }
  };

  const resetProjectItemForm = (): void => {
    setProjectItemFormData({
      paragraph: "",
      title: "",
      heading: "",
      btn_text: "",
      itemImage: null,
    });
    setEditProjectItemId(null);
    setProjectItemPreview(null);
    setIsProjectItemEdit(false);
    setProjectItemModalOpen(false);
    if (projectItemFileRef.current) {
      projectItemFileRef.current.value = "";
    }
  };

  // ============ IMAGE PROCESSING ============
  const generateFileName = (id: string, file: File): string => {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    return `${id}_${timestamp}.${extension}`;
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`));
        return;
      }

      if (typeof window === 'undefined') {
        reject(new Error('Image processing only available in browser'));
        return;
      }

      const compressImage = (imageFile: File): Promise<string> => {
        return new Promise((resolveCompress, rejectCompress) => {
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

  // ============ BUCKET STORAGE ============
  const uploadToBucket = async (file: File, id: string): Promise<string> => {
    try {
      const fileName = generateFileName(id, file);
      
      const { error } = await supabase.storage
        .from(PROJECT_BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error("Error uploading to bucket:", error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(PROJECT_BUCKET_NAME)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const deleteFromBucket = async (imageUrl: string | null): Promise<void> => {
    try {
      if (!imageUrl) return;
      
      const fileName = imageUrl.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from(PROJECT_BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error("Error deleting from bucket:", error);
      }
    } catch (error) {
      console.error("Delete from bucket failed:", error);
    }
  };

  // ============ DATA FETCHING ============
  const fetchProjects = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      
      const { data: projectsData, error: projectsError } = await supabase
        .from("project")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error('Projects fetch error:', projectsError);
        throw projectsError;
      }

      if (projectsData && projectsData.length > 0) {
        const { data: allItemsData, error: itemsError } = await supabase
          .from("project_item")
          .select("*")
          .order("created_at", { ascending: true });

        if (itemsError) {
          console.error('Project items fetch error:', itemsError);
        }

        const processedProjects: Project[] = projectsData.map((project: DatabaseProject) => {
          const projectItems: ProjectItem[] = (allItemsData || [])
            .filter((item: DatabaseProjectItem) => item.project_id === project.id)
            .map((item: DatabaseProjectItem) => {
              const imageUrl = reconstructFromChunks(item.image);
              
              return {
                id: item.id,
                created_at: item.created_at,
                paragraph: item.paragraph,
                title: item.title,
                heading: item.heading,
                btn_text: item.btn_text,
                imageUrl: imageUrl,
                project_id: item.project_id
              };
            });

          return {
            id: project.id,
            created_at: project.created_at,
            title: project.title,
            heading: project.heading,
            imageUrl: project.image,
            projectItems: projectItems
          };
        });

        setProjects(processedProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error in fetchProjects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ============ PROJECT CRUD ============
  const handleProjectSubmit = async (
    values: ProjectFormValues,
    formikHelpers: FormikHelpers<ProjectFormValues>
  ): Promise<void> => {
    if (submitting) return;

    try {
      setSubmitting(true);

      const { data: projectData, error: projectError } = await supabase
        .from("project")
        .insert([
          {
            title: values.title,
            heading: values.heading,
            image: null,
          },
        ])
        .select()
        .single();

      if (projectError) {
        console.error("Project insert error:", projectError);
        throw projectError;
      }

      let imageUrl: string | null = null;

      if (projectFormData.projectImage) {
        try {
          imageUrl = await uploadToBucket(projectFormData.projectImage, projectData.id);
          
          const { error: updateError } = await supabase
            .from("project")
            .update({ image: imageUrl })
            .eq("id", projectData.id);

          if (updateError) {
            console.error("Error updating project with image:", updateError);
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
        }
      }

      const newProject: Project = {
        id: projectData.id,
        created_at: projectData.created_at,
        title: projectData.title,
        heading: projectData.heading,
        imageUrl: imageUrl,
        projectItems: [],
      };

      setProjects((prev) => [newProject, ...prev]);
      
      resetProjectForm();
      formikHelpers.resetForm();
      
    } catch (error) {
      console.error("Error saving project:", error);
      alert(error instanceof Error ? error.message : "Error saving project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProjectUpdate = async (
    values: ProjectFormValues,
    formikHelpers: FormikHelpers<ProjectFormValues>
  ): Promise<void> => {
    if (!editProjectId || submitting) return;

    try {
      setSubmitting(true);
      
      const existingProject = projects.find((p) => p.id === editProjectId);
      let imageUrl: string | null = existingProject?.imageUrl || null;

      if (projectFormData.projectImage) {
        if (existingProject?.imageUrl) {
          await deleteFromBucket(existingProject.imageUrl);
        }

        imageUrl = await uploadToBucket(projectFormData.projectImage, editProjectId);
      }

      const { data, error } = await supabase
        .from("project")
        .update({
          title: values.title,
          heading: values.heading,
          image: imageUrl,
        })
        .eq("id", editProjectId)
        .select()
        .single();

      if (error) {
        console.error("Project update error:", error);
        throw error;
      }

      const updatedProject: Project = {
        ...existingProject!,
        title: data.title,
        heading: data.heading,
        imageUrl: imageUrl,
      };

      setProjects((prev) =>
        prev.map((p) => (p.id === editProjectId ? updatedProject : p))
      );

      resetProjectForm();
      formikHelpers.resetForm();
      
    } catch (error) {
      console.error("Error updating project:", error);
      alert(error instanceof Error ? error.message : "Error updating project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string): Promise<void> => {
    if (!window.confirm("Delete this project and all its items?")) return;

    try {
      const projectToDelete = projects.find(p => p.id === id);
      
      if (projectToDelete?.imageUrl) {
        await deleteFromBucket(projectToDelete.imageUrl);
      }

      if (projectToDelete?.projectItems && projectToDelete.projectItems.length > 0) {        
        await supabase
          .from("project_item")
          .delete()
          .eq("project_id", id);
      }

      const { error } = await supabase
        .from("project")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Project delete error:", error);
        throw error;
      }

      setProjects(prev => prev.filter(p => p.id !== id));
      
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    }
  };

  // ============ PROJECT ITEM CRUD ============
  const handleProjectItemSubmit = async (
    values: ProjectItemFormValues,
    formikHelpers: FormikHelpers<ProjectItemFormValues>
  ): Promise<void> => {
    if (!selectedProjectId || submitting) return;

    try {
      setSubmitting(true);

      let imageData: string | null = null;

      if (projectItemFormData.itemImage) {
        try {
          const base64Image = await convertImageToBase64(projectItemFormData.itemImage);
          imageData = splitIntoChunks(base64Image);
        } catch (convertError) {
          console.error("Base64 conversion failed:", convertError);
        }
      }

      const { data, error } = await supabase
        .from("project_item")
        .insert([
          {
            ...values,
            project_id: selectedProjectId,
            image: imageData,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Project item insert error:", error);
        throw error;
      }

      const newItem: ProjectItem = {
        ...data,
        imageUrl: reconstructFromChunks(imageData),
      };

      setProjects((prev) =>
        prev.map((project) =>
          project.id === selectedProjectId
            ? { ...project, projectItems: [...project.projectItems, newItem] }
            : project
        )
      );

      resetProjectItemForm();
      formikHelpers.resetForm();
      
    } catch (error) {
      console.error("Error saving project item:", error);
      alert(error instanceof Error ? error.message : "Error saving item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProjectItemUpdate = async (
    values: ProjectItemFormValues,
    formikHelpers: FormikHelpers<ProjectItemFormValues>
  ): Promise<void> => {
    if (!editProjectItemId || !selectedProjectId || submitting) return;

    try {
      setSubmitting(true);

      const project = projects.find(p => p.id === selectedProjectId);
      const existingItem = project?.projectItems.find(item => item.id === editProjectItemId);
      let imageData: string | null = null;

      if (projectItemFormData.itemImage) {
        try {
          const base64Image = await convertImageToBase64(projectItemFormData.itemImage);
          imageData = splitIntoChunks(base64Image);
        } catch (convertError) {
          console.error("Base64 conversion failed:", convertError);
          imageData = existingItem?.imageUrl ? splitIntoChunks(existingItem.imageUrl) : null;
        }
      } else {
        imageData = existingItem?.imageUrl ? splitIntoChunks(existingItem.imageUrl) : null;
      }

      const updateData = await supabase
        .from("project_item")
        .update({
          paragraph: values.paragraph,
          title: values.title,
          heading: values.heading,
          btn_text: values.btn_text,
          image: imageData,
        })
        .eq("id", editProjectItemId)
        .select()
        .single();

      if (updateData.error) {
        console.error("Project item update error:", updateData.error);
        throw updateData.error;
      }

      const updatedItem: ProjectItem = {
        ...updateData.data!,
        imageUrl: reconstructFromChunks(imageData),
      };

      setProjects(prev => prev.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            projectItems: project.projectItems.map(item =>
              item.id === editProjectItemId ? updatedItem : item
            )
          };
        }
        return project;
      }));

      resetProjectItemForm();
      formikHelpers.resetForm();
      
    } catch (error) {
      console.error("Error updating project item:", error);
      alert(error instanceof Error ? error.message : "Error updating item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProjectItem = async (projectId: string, itemId: string): Promise<void> => {
    if (!window.confirm("Delete this project item?")) return;

    try {
      const { error } = await supabase
        .from("project_item")
        .delete()
        .eq("id", itemId);

      if (error) {
        console.error("Project item delete error:", error);
        throw error;
      }

      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            projectItems: project.projectItems.filter(item => item.id !== itemId)
          };
        }
        return project;
      }));
      
    } catch (error) {
      console.error("Error deleting project item:", error);
      alert("Error deleting project item");
    }
  };

  // ============ IMAGE HANDLERS ============
  const handleProjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) return
    if (!file.type.startsWith("image/")) return alert("Select image only")
    if (file.size > MAX_IMAGE_SIZE) return alert("File too large")
    setProjectFormData(prev => ({ ...prev, projectImage: file }))
    setProjectPreview(URL.createObjectURL(file))
  }

  const handleProjectItemImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) return
    if (!file.type.startsWith("image/")) return alert("Select image only")
    if (file.size > MAX_IMAGE_SIZE) return alert("File too large")
    setProjectItemFormData(prev => ({ ...prev, itemImage: file }))
    setProjectItemPreview(URL.createObjectURL(file))
  }

  const handleRemoveProjectImage = (): void => {
    setProjectFormData(prev => ({ ...prev, projectImage: null }));
    setProjectPreview(null);
    if (projectFileRef.current) projectFileRef.current.value = "";
  };

  const handleRemoveProjectItemImage = (): void => {
    setProjectItemFormData(prev => ({ ...prev, itemImage: null }));
    setProjectItemPreview(null);
    if (projectItemFileRef.current) projectItemFileRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (projectPreview) URL.revokeObjectURL(projectPreview);
      if (projectItemPreview) URL.revokeObjectURL(projectItemPreview);
    };
  }, [projectPreview, projectItemPreview]);

  // ============ UI HANDLERS ============
  const handleEditProject = (project: Project): void => {
    setIsProjectEdit(true);
    setEditProjectId(project.id);
    setProjectFormData({
      title: project.title,
      heading: project.heading,
      projectImage: null,
    });
    setProjectPreview(project.imageUrl || null);
    setProjectModalOpen(true);
  };

  const handleEditProjectItem = (projectId: string, item: ProjectItem): void => {
    setSelectedProjectId(projectId);
    setIsProjectItemEdit(true);
    setEditProjectItemId(item.id);
    setProjectItemFormData({
      paragraph: item.paragraph,
      title: item.title,
      heading: item.heading,
      btn_text: item.btn_text,
      itemImage: null,
    });
    setProjectItemPreview(item.imageUrl || null);
    setProjectItemModalOpen(true);
  };

  const handleAddProjectItem = (projectId: string): void => {
    setSelectedProjectId(projectId);
    setIsProjectItemEdit(false);
    setEditProjectItemId(null);
    resetProjectItemForm();
    setProjectItemModalOpen(true);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ============ LOADING SKELETON ============
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="space-y-12">
          {[1, 2, 3].map(projectIndex => (
            <div key={projectIndex} className="space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(itemIndex => (
                  <Skeleton key={itemIndex} className="h-64 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* Main Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Project Management
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Manage your projects and their items with full CRUD functionality
        </p>
        
        <Button
          onClick={() => {
            setIsProjectEdit(false);
            resetProjectForm();
            setProjectModalOpen(true);
          }}
          className="gap-2 group"
          size="lg"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Add New Project
        </Button>
      </div>

      {/* Projects Sections */}
      {projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl border-border max-w-2xl mx-auto">
          <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-primary/10">
            <Folder className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Projects Yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first project to get started
          </p>
          <Button 
            onClick={() => {
              setIsProjectEdit(false);
              resetProjectForm();
              setProjectModalOpen(true);
            }} 
            variant="outline" 
            className="gap-2"
          >
            <Plus size={20} />
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-16">
          {projects.map((project) => (
            <section key={project.id} className="scroll-mt-16">
              {/* Project Section Header */}
              <div className="mb-8 bg-[hsl(var(--color-background))] p-6 rounded-2xl border">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {project.imageUrl && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                          {project.title}
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-3xl">
                          {project.heading}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <Badge variant="outline" className="gap-2">
                        <Grid size={14} />
                        {project.projectItems.length} Items
                      </Badge>
                      <Badge variant="secondary">
                        {formatDate(project.created_at)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 flex-shrink-0">
                    <Button
                      onClick={() => handleEditProject(project)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Pen size={16} />
                      Edit Project
                    </Button>
                    <Button
                      onClick={() => handleAddProjectItem(project.id)}
                      className="gap-2"
                    >
                      <Plus size={16} />
                      Add Item
                    </Button>
                    <Button
                      onClick={() => handleDeleteProject(project.id)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Project Items Grid */}
              {project.projectItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.projectItems.map((item) => (
                    <div
  key={item.id}
  className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500"
                    >
                      <div className="h-full rounded-2xl p-3 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-xl shadow-lg dark:shadow-lg hover:shadow-2xl transition-all">
    <div className=" overflow-hidden rounded-lg relative">
    {item.imageUrl ? (
      <img
        src={item.imageUrl}
        alt={item.title}
        className={`
          w-full h-48 object-cover
          transform transition-transform duration-700
          ease-[cubic-bezier(0,0.57,0.55,1)]
          group-hover:translate-x-0
          group-hover:clip-path-[inset(0_0_0_0)]
          clip-path-[inset(0_100%_0_0)]
          
        `}
      />
    ) : (
      <div className="w-full h-48 flex items-center justify-center bg-gray-100">
        <ImageIcon className="h-12 w-12 text-gray-400" />
      </div>
    )}
  </div>

  {/* Card Header */}
  <div className="p-4 flex justify-between items-start">
    <div>
      <h3 className="text-lg font-semibold line-clamp-1">{item.title}</h3>
      <p className="text-gray-500 mt-1 line-clamp-2">{item.heading}</p>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => handleEditProjectItem(project.id, item)}
        className="    p-2 rounded-full
    hover:bg-gray-100 hover:text-black
    transition
    text-gray-700 dark:text-gray-200
    dark:hover:text-white
    dark:hover:bg-white
"
      >
        <Pen className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleDeleteProjectItem(project.id, item.id)}
        className="p-2 rounded-full hover:bg-red-100 transition"
      >
        <Trash className="w-4 h-4 text-red-500" />
      </button>
    </div>
  </div>

  {/* Badge */}
  <div className="px-4">
    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
      {item.btn_text}
    </span>
  </div>

  {/* Card Image */}

  {/* Description */}
  <div className="p-4 pt-2">
    <p className="text-gray-900 dark:text-gray-300 text-sm line-clamp-3">{item.paragraph}</p>
                        <Button className='my-2'>{item.btn_text }</Button>
  </div>

  {/* Footer */}
  {/* <div className="flex justify-between  items-center p-4 pt-0 border-t">
    <span className="text-xs font-lg  text-gray-900 dark:text-gray-300">{formatDate(item.created_at)}</span>
    <button className="text-sm text-blue-600 hover:underline">View Details</button>
  </div> */}
  </div>
</div>

                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-2xl border-border">
                  <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-muted">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Items in This Project
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Add items to showcase features, milestones, or components of this project
                  </p>
                  <Button
                    onClick={() => handleAddProjectItem(project.id)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus size={16} />
                    Add First Item
                  </Button>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* ============ PROJECT MODAL ============ */}
      <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
        <DialogContent className="
  flex flex-col
      sm:max-w-lg 
      w-full 
      max-screen
      h-screen
      p-0           /* Remove padding from DialogContent */
      overflow-hidden
      rounded-xl 
      bg-white 
      dark:bg-gray-800
">
      <div className="flex-shrink-0 p-6 pb-4 border-b dark:border-gray-700">

          
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isProjectEdit ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
            </DialogHeader>
            </div>
          <div className="flex-1 overflow-y-auto px-6 py-2">
      <div className="
        h-full
        scrollbar-thin 
        scrollbar-thumb-gray-300 
        scrollbar-track-gray-100
        dark:scrollbar-thumb-gray-600 
        dark:scrollbar-track-gray-700
        scrollbar-thumb-rounded-full 
        scrollbar-track-rounded-full
        pr-2 /* Scrollbar के लिए space */
      ">
          <Formik
            initialValues={{ 
              title: projectFormData.title, 
              heading: projectFormData.heading 
            }}
            validationSchema={projectValidationSchema}
            onSubmit={isProjectEdit ? handleProjectUpdate : handleProjectSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium">
                    Project Title *
                  </Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="e.g., E-commerce Website"
                    className={`mt-2 text-lg ${errors.title && touched.title ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="heading" className="text-base font-medium">
                    Project Description *
                  </Label>
                  <Field
                    as={Textarea}
                    id="heading"
                    name="heading"
                    placeholder="Brief description of the project..."
                    rows={3}
                    className={`mt-2 resize-none ${errors.heading && touched.heading ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="heading"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium block mb-3">
                    Project Image (Cloud Storage)
                  </Label>
                  
                  <div 
                    className={`relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer hover:border-primary
                      ${projectPreview ? 'border-transparent' : ''}
                      ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => !submitting && projectFileRef.current?.click()}
                  >
                    <input
                      ref={projectFileRef}
                      type="file"
                      onChange={handleProjectImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={submitting}
                    />
                    
                    {projectPreview ? (
                      <div className="relative">
                        <img
                          src={projectPreview}
                          alt="Preview"
                          className="w-full h-24  object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-3 right-3"
                          onClick={handleRemoveProjectImage}
                        >
                          <X size={20} />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-foreground mb-1">
                            Click to upload image
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        {isProjectEdit && (
                          <p className="text-sm text-muted-foreground mt-4">
                            Leave empty to keep existing image
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Images are stored in secure cloud storage bucket.
                  </p>
                </div>

                <DialogFooter className="mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetProjectForm}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        {isProjectEdit ? 'Update Project' : 'Create Project'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            )}
              </Formik>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ PROJECT ITEM MODAL ============ */}
      <Dialog open={projectItemModalOpen} onOpenChange={setProjectItemModalOpen}>
        <DialogContent className="
  flex flex-col
      sm:max-w-lg 
      w-full 
      max-screen
      h-screen
      p-0           /* Remove padding from DialogContent */
      overflow-hidden
      rounded-xl 
      bg-white 
      dark:bg-gray-800
">
      <div className="flex-shrink-0 p-6 pb-4 border-b dark:border-gray-700">

          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isProjectItemEdit ? 'Edit Project Item' : 'Add Project Item'}
            </DialogTitle>
            </DialogHeader>
                </div>

              <div className="flex-1 overflow-y-auto px-6 py-2">
      <div className="
        h-full
        scrollbar-thin 
        scrollbar-thumb-gray-300 
        scrollbar-track-gray-100
        dark:scrollbar-thumb-gray-600 
        dark:scrollbar-track-gray-700
        scrollbar-thumb-rounded-full 
        scrollbar-track-rounded-full
        pr-2 /* Scrollbar के लिए space */
      ">
          <Formik
            initialValues={{
              paragraph: projectItemFormData.paragraph,
              title: projectItemFormData.title,
              heading: projectItemFormData.heading,
              btn_text: projectItemFormData.btn_text
            }}
            validationSchema={projectItemValidationSchema}
            onSubmit={isProjectItemEdit ? handleProjectItemUpdate : handleProjectItemSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium">
                    Item Title *
                  </Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="e.g., Homepage Design"
                    className={`mt-2 text-lg ${errors.title && touched.title ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="heading" className="text-base font-medium">
                    Item Heading *
                  </Label>
                  <Field
                    as={Input}
                    id="heading"
                    name="heading"
                    placeholder="e.g., Responsive homepage with animations"
                    className={`mt-2 ${errors.heading && touched.heading ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="heading"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="paragraph" className="text-base font-medium">
                    Description *
                  </Label>
                  <Field
                    as={Textarea}
                    id="paragraph"
                    name="paragraph"
                    placeholder="Detailed description of the item..."
                    rows={4}
                    className={`mt-2 resize-none ${errors.paragraph && touched.paragraph ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="paragraph"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="btn_text" className="text-base font-medium">
                    Button Text *
                  </Label>
                  <Field
                    as={Input}
                    id="btn_text"
                    name="btn_text"
                    placeholder="e.g., View Details, Learn More"
                    className={`mt-2 ${errors.btn_text && touched.btn_text ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="btn_text"
                    component="div"
                    className="text-sm text-red500 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium block mb-3">
                    Item Image (Database Storage)
                  </Label>
                  
                  <div 
                    className={`relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer hover:border-primary
                      ${projectItemPreview ? 'border-transparent' : ''}
                      ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => !submitting && projectItemFileRef.current?.click()}
                  >
                    <input
                      ref={projectItemFileRef}
                      type="file"
                      onChange={handleProjectItemImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={submitting}
                    />
                    
                    {projectItemPreview ? (
                      <div className="relative">
                        <img
                          src={projectItemPreview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-3 right-3"
                          onClick={handleRemoveProjectItemImage}
                        >
                          <X size={20} />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-foreground mb-1">
                            Click to upload image
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        {isProjectItemEdit && (
                          <p className="text-sm text-muted-foreground mt-4">
                            Leave empty to keep existing image
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Images are automatically compressed and stored in database as Base64.
                  </p>
                </div>

                <DialogFooter className="mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetProjectItemForm}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        {isProjectItemEdit ? 'Update Item' : 'Add Item'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            )}
            </Formik>
            </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectComponent;
