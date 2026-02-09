// app/components/testimonials.tsx
'use client'

import { FC, useCallback, useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { supabase } from "@/lib/supabase-client"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
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
import { Plus, Trash, Pen, Loader2, Star, ImageIcon, Upload,Calendar, ArrowRight } from "lucide-react"
import { Badge } from '@/components/ui/badge'

// Storage Configuration - HomeSlide की तरह ही रखें
const BUCKET_NAME = "testimonial";
const STORAGE_TYPE = process.env.NEXT_PUBLIC_STORAGE_TYPE as 'bucket' | 'base64' || 'bucket';
const CHUNK_SIZE = 60000;
const DELIMITER = '|||CHUNK|||';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Types - HomeSlide की तरह structured
interface TestimonialFormValues {
  img_lable: string;
  img_paragraph: string;
  paragraph: string;
  testmonial_id: string;
}

interface TestimonialGroupFormValues {
  title: string;
  heading: string;
}

// Database Types
interface DatabaseTestimonial {
  id: string;
  created_at: string;
  img: string | null;
  img_lable: string;
  img_paragraph: string;
  paragraph: string;
  testmonial_id: string;
}

interface DatabaseTestimonialGroup {
  id: string;
  created_at: string;
  title: string;
  heading: string;
}

// Component Types
interface Testimonial {
  id: string;
  created_at: string;
  img_lable: string;
  img_paragraph: string;
  paragraph: string;
  testmonial_id: string;
  profileImage: string | null; // Base64 के लिए
  profileImageUrl: string | null; // Bucket के लिए
}

interface TestimonialGroup {
  id: string;
  created_at: string;
  title: string;
  heading: string;
  testimonials?: Testimonial[];
}

// Utility Functions - HomeSlide से लिए गए
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

const generateFileName = (testimonialId: string, file: File): string => {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  return `${testimonialId}_${timestamp}.${extension}`;
};

const uploadToBucket = async (file: File, testimonialId: string): Promise<string> => {
  try {
    const fileName = generateFileName(testimonialId, file);
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error("Error uploading to bucket:", error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

const deleteFromBucket = async (imageUrl: string | null | undefined): Promise<void> => {
  try {
    if (!imageUrl) return;
    
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

const Testimonials: FC = () => {
  // State - HomeSlide की तरह
  const [testimonialGroups, setTestimonialGroups] = useState<TestimonialGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Testimonial Group Modal States
  const [testimonialGroupModalOpen, setTestimonialGroupModalOpen] = useState<boolean>(false);
  const [isTestimonialGroupEdit, setIsTestimonialGroupEdit] = useState<boolean>(false);
  const [editTestimonialGroupId, setEditTestimonialGroupId] = useState<string | null>(null);
  
  // Testimonial Modal States
  const [testimonialModalOpen, setTestimonialModalOpen] = useState<boolean>(false);
  const [isTestimonialEdit, setIsTestimonialEdit] = useState<boolean>(false);
  const [editTestimonialId, setEditTestimonialId] = useState<string | null>(null);
  
  // Image State - HomeSlide की तरह
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation Schemas
  const testimonialGroupValidationSchema = Yup.object({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .required('Title is required'),
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .required('Heading is required')
  });

  const testimonialValidationSchema = Yup.object({
    img_lable: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    img_paragraph: Yup.string()
      .min(2, 'Position must be at least 2 characters')
      .required('Position is required'),
    paragraph: Yup.string()
      .min(10, 'Testimonial must be at least 10 characters')
      .required('Testimonial is required'),
    testmonial_id: Yup.string()
      .required('Please select a testimonial group')
  });

  // Initial Values
  const testimonialGroupInitialValues: TestimonialGroupFormValues = {
    title: "",
    heading: ""
  };

  const testimonialInitialValues: TestimonialFormValues = {
    img_lable: "",
    img_paragraph: "",
    paragraph: "",
    testmonial_id: ""
  };

  // Convert Database Testimonial to Component Testimonial - HomeSlide की तरह
  const convertToTestimonial = (dbTestimonial: DatabaseTestimonial): Testimonial => {
    if (STORAGE_TYPE === "bucket") {
      // For bucket storage
      return {
        id: dbTestimonial.id,
        created_at: dbTestimonial.created_at,
        img_lable: dbTestimonial.img_lable,
        img_paragraph: dbTestimonial.img_paragraph,
        paragraph: dbTestimonial.paragraph,
        testmonial_id: dbTestimonial.testmonial_id,
        profileImage: null,
        profileImageUrl: dbTestimonial.img || null
      };
    } else {
      // For Base64 storage
      return {
        id: dbTestimonial.id,
        created_at: dbTestimonial.created_at,
        img_lable: dbTestimonial.img_lable,
        img_paragraph: dbTestimonial.img_paragraph,
        paragraph: dbTestimonial.paragraph,
        testmonial_id: dbTestimonial.testmonial_id,
        profileImage: reconstructFromChunks(dbTestimonial.img),
        profileImageUrl: null
      };
    }
  };

  // Fetch Data - HomeSlide की तरह structured
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);

      // Fetch Testimonial Groups
      const { data: testimonialGroupsData, error: testimonialGroupsError } = await supabase
        .from("testimonial_group")
        .select("*")
        .order("created_at", { ascending: false });

      if (testimonialGroupsError) throw testimonialGroupsError;

      // Fetch Testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from("testimonial")
        .select("*")
        .order("created_at", { ascending: true });

      if (testimonialsError) throw testimonialsError;

      // Process Testimonials
      const processedTestimonials: Testimonial[] = (testimonialsData || []).map(
        (dbTestimonial: DatabaseTestimonial) => convertToTestimonial(dbTestimonial)
      );

      // Process Testimonial Groups
      const processedTestimonialGroups: TestimonialGroup[] = (testimonialGroupsData || []).map(
        (group: DatabaseTestimonialGroup) => ({
          id: group.id,
          created_at: group.created_at,
          title: group.title,
          heading: group.heading,
          testimonials: processedTestimonials.filter(t => t.testmonial_id === group.id)
        })
      );

      setTestimonialGroups(processedTestimonialGroups);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset Forms - HomeSlide की तरह
  const resetTestimonialGroupForm = () => {
    setIsTestimonialGroupEdit(false);
    setEditTestimonialGroupId(null);
    setTestimonialGroupModalOpen(false);
  };

  const resetTestimonialForm = () => {
    setIsTestimonialEdit(false);
    setEditTestimonialId(null);
    setImagePreview(null);
    setImageFile(null);
    setTestimonialModalOpen(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get Data for Edit - HomeSlide की तरह
  const getTestimonialGroupForEdit = (): TestimonialGroupFormValues => {
    if (!isTestimonialGroupEdit || !editTestimonialGroupId) return testimonialGroupInitialValues;
    
    const group = testimonialGroups.find(g => g.id === editTestimonialGroupId);
    if (group) {
      return {
        title: group.title,
        heading: group.heading
      };
    }
    
    return testimonialGroupInitialValues;
  };

  const getTestimonialForEdit = (): TestimonialFormValues => {
    if (!isTestimonialEdit || !editTestimonialId) return testimonialInitialValues;
    
    const testimonial = testimonialGroups
      .flatMap(g => g.testimonials || [])
      .find(t => t.id === editTestimonialId);
    
    if (testimonial) {
      return {
        img_lable: testimonial.img_lable,
        img_paragraph: testimonial.img_paragraph,
        paragraph: testimonial.paragraph,
        testmonial_id: testimonial.testmonial_id
      };
    }
    
    return testimonialInitialValues;
  };

  // Image Handlers - HomeSlide की तरह
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Edit Handlers - HomeSlide की तरह
  const handleEditTestimonialGroup = (testimonialGroup: TestimonialGroup) => {
    setIsTestimonialGroupEdit(true);
    setEditTestimonialGroupId(testimonialGroup.id);
    setTestimonialGroupModalOpen(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setIsTestimonialEdit(true);
    setEditTestimonialId(testimonial.id);
    
    // Set preview based on storage type - HomeSlide की तरह
    if (STORAGE_TYPE === "bucket") {
      setImagePreview(testimonial.profileImageUrl || null);
    } else {
      setImagePreview(testimonial.profileImage || null);
    }
    
    setTestimonialModalOpen(true);
  };

  // ✅ FIXED: handleTestimonialSubmit - HomeSlide की तरह structured
  const handleTestimonialSubmit = async (
    values: TestimonialFormValues,
    formikHelpers: FormikHelpers<TestimonialFormValues>
  ) => {
    if (submitting) return;

    try {
      setSubmitting(true);
      let imageData: string | null = null;

      // Process image based on storage type - HomeSlide की तरह
      if (imageFile) {
        if (STORAGE_TYPE === "bucket") {
          // First create testimonial without image to get ID
          const { data: testimonialData, error: testimonialError } = await supabase
            .from("testimonial")
            .insert([{
              img_lable: values.img_lable,
              img_paragraph: values.img_paragraph,
              paragraph: values.paragraph,
              testmonial_id: values.testmonial_id,
              img: null
            }])
            .select()
            .single();

          if (testimonialError) throw testimonialError;

          // Upload image to bucket
          const bucketUrl = await uploadToBucket(imageFile, testimonialData.id);
          imageData = bucketUrl;

          // Update testimonial with image URL
          const { error: updateError } = await supabase
            .from("testimonial")
            .update({ img: imageData })
            .eq("id", testimonialData.id);

          if (updateError) {
            console.error("Error updating testimonial with image:", updateError);
          }

          // Create new testimonial object - HomeSlide की तरह
          const newTestimonial: Testimonial = {
            id: testimonialData.id,
            created_at: testimonialData.created_at,
            img_lable: testimonialData.img_lable,
            img_paragraph: testimonialData.img_paragraph,
            paragraph: testimonialData.paragraph,
            testmonial_id: testimonialData.testmonial_id,
            profileImage: null,
            profileImageUrl: imageData
          };

          // Update state - HomeSlide की तरह
          setTestimonialGroups(prev => prev.map(group => {
            if (group.id === values.testmonial_id) {
              return {
                ...group,
                testimonials: [...(group.testimonials || []), newTestimonial]
              };
            }
            return group;
          }));

        } else {
          // For Base64 storage - HomeSlide की तरह
          const base64Image = await convertImageToBase64(imageFile);
          imageData = splitIntoChunks(base64Image);

          const { data: testimonialData, error: testimonialError } = await supabase
            .from("testimonial")
            .insert([{
              img: imageData,
              img_lable: values.img_lable,
              img_paragraph: values.img_paragraph,
              paragraph: values.paragraph,
              testmonial_id: values.testmonial_id
            }])
            .select()
            .single();

          if (testimonialError) throw testimonialError;

          const newTestimonial: Testimonial = {
            id: testimonialData.id,
            created_at: testimonialData.created_at,
            img_lable: testimonialData.img_lable,
            img_paragraph: testimonialData.img_paragraph,
            paragraph: testimonialData.para,
            testmonial_id: testimonialData.testmonial_id,
            profileImage: base64Image,
            profileImageUrl: null
          };

          // Update state
          setTestimonialGroups(prev => prev.map(group => {
            if (group.id === values.testmonial_id) {
              return {
                ...group,
                testimonials: [...(group.testimonials || []), newTestimonial]
              };
            }
            return group;
          }));
          fetchData()
        }
      } else {
        // Create testimonial without image - HomeSlide की तरह
        const { data: testimonialData, error: testimonialError } = await supabase
          .from("testimonial")
          .insert([{
            img: null,
            img_lable: values.img_lable,
            img_paragraph: values.img_paragraph,
            paragraph: values.paragraph,
            testmonial_id: values.testmonial_id
          }])
          .select()
          .single();

        if (testimonialError) throw testimonialError;

        const newTestimonial: Testimonial = {
          id: testimonialData.id,
          created_at: testimonialData.created_at,
          img_lable: testimonialData.img_lable,
          img_paragraph: testimonialData.img_paragraph,
          paragraph: testimonialData.para,
          testmonial_id: testimonialData.testmonial_id,
          profileImage: null,
          profileImageUrl: null
        };

        // Update state
        setTestimonialGroups(prev => prev.map(group => {
          if (group.id === values.testmonial_id) {
            return {
              ...group,
              testimonials: [...(group.testimonials || []), newTestimonial]
            };
          }
          return group;
        }));
      }

      resetTestimonialForm();
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error saving Testimonial:", error);
      alert(error instanceof Error ? error.message : "Error saving Testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ FIXED: handleTestimonialUpdate - HomeSlide की तरह structured
  const handleTestimonialUpdate = async (
    values: TestimonialFormValues,
    formikHelpers: FormikHelpers<TestimonialFormValues>
  ) => {
    if (!editTestimonialId || submitting) return;

    try {
      setSubmitting(true);
      
      // Get existing testimonial
      const existingTestimonial = testimonialGroups
        .flatMap(g => g.testimonials || [])
        .find(t => t.id === editTestimonialId);
      
      let imageData: string | null = null;
      let oldImageData: string | null | undefined = null;

      // Get existing image data - HomeSlide की तरह
      if (existingTestimonial) {
        oldImageData = STORAGE_TYPE === "bucket" 
          ? existingTestimonial.profileImageUrl 
          : existingTestimonial.profileImage;
      }

      // Process new image if selected - HomeSlide की तरह
      if (imageFile) {
        if (STORAGE_TYPE === "bucket") {
          // Delete old image from bucket if exists
          if (oldImageData) {
            await deleteFromBucket(oldImageData);
          }
          
          // Upload new image to bucket
          try {
            imageData = await uploadToBucket(imageFile, editTestimonialId);
          } catch (uploadError) {
            console.error("Bucket upload failed:", uploadError);
            imageData = oldImageData || null;
          }
        } else {
          // Convert to Base64 and chunk - HomeSlide की तरह
          try {
            const base64Image = await convertImageToBase64(imageFile);
            imageData = splitIntoChunks(base64Image);
          } catch (convertError) {
            console.error("Base64 conversion failed:", convertError);
            imageData = oldImageData ? splitIntoChunks(oldImageData) : null;
          }
        }
      } else {
        // Keep existing image - HomeSlide की तरह
        imageData = oldImageData || null;
      }

      // Update testimonial in database - HomeSlide की तरह
      const { data, error } = await supabase
        .from("testimonial")
        .update({
          img: imageData,
          img_lable: values.img_lable,
          img_paragraph: values.img_paragraph,
          paragraph: values.paragraph,
          testmonial_id: values.testmonial_id
        })
        .eq("id", editTestimonialId)
        .select()
        .single();

      if (error) throw error;

      // Convert database testimonial to component testimonial - HomeSlide की तरह
      const updatedTestimonial: Testimonial = {
        id: data.id,
        created_at: data.created_at,
        img_lable: data.img_lable,
        img_paragraph: data.img_paragraph,
        paragraph: data.para,
        testmonial_id: data.testmonial_id,
        profileImage: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(data.img),
        profileImageUrl: STORAGE_TYPE === "bucket" ? data.img : null
      };

      // Update testimonial groups state - HomeSlide की तरह
      setTestimonialGroups(prev => prev.map(group => {
        // Remove testimonial from old group if group changed
        const filteredTestimonials = (group.testimonials || []).filter(t => t.id !== editTestimonialId);
        
        if (group.id === values.testmonial_id) {
          // Add to new group
          return {
            ...group,
            testimonials: [...filteredTestimonials, updatedTestimonial]
          };
        }
        
        // Keep other groups unchanged
        return {
          ...group,
          testimonials: filteredTestimonials
        };
      }));

      resetTestimonialForm();
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error updating Testimonial:", error);
      alert(error instanceof Error ? error.message : "Error updating Testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  // Testimonial Group Handlers
  const handleTestimonialGroupSubmit = async (
    values: TestimonialGroupFormValues,
    formikHelpers: FormikHelpers<TestimonialGroupFormValues>
  ) => {
    if (submitting) return;

    try {
      setSubmitting(true);

      const { data: groupData, error: groupError } = await supabase
        .from("testimonial_group")
        .insert([values])
        .select()
        .single();

      if (groupError) throw groupError;

      const newTestimonialGroup: TestimonialGroup = {
        id: groupData.id,
        created_at: groupData.created_at,
        title: groupData.title,
        heading: groupData.heading,
        testimonials: []
      };

      setTestimonialGroups(prev => [newTestimonialGroup, ...prev]);
      resetTestimonialGroupForm();
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error saving Testimonial Group:", error);
      alert(error instanceof Error ? error.message : "Error saving Testimonial Group");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestimonialGroupUpdate = async (
    values: TestimonialGroupFormValues,
    formikHelpers: FormikHelpers<TestimonialGroupFormValues>
  ) => {
    if (!editTestimonialGroupId || submitting) return;

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from("testimonial_group")
        .update(values)
        .eq("id", editTestimonialGroupId)
        .select()
        .single();

      if (error) throw error;

      setTestimonialGroups(prev => prev.map(group => 
        group.id === editTestimonialGroupId 
          ? { ...group, title: data.title, heading: data.heading }
          : group
      ));

      resetTestimonialGroupForm();
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error updating Testimonial Group:", error);
      alert(error instanceof Error ? error.message : "Error updating Testimonial Group");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handlers - HomeSlide की तरह
  const handleDeleteTestimonialGroup = async (id: string) => {
    if (!window.confirm("Delete this Testimonial Group and all its testimonials?")) return;

    try {
      // Delete images from bucket if using bucket storage - HomeSlide की तरह
      if (STORAGE_TYPE === "bucket") {
        const groupToDelete = testimonialGroups.find(g => g.id === id);
        if (groupToDelete?.testimonials) {
          for (const testimonial of groupToDelete.testimonials) {
            if (testimonial.profileImageUrl) {
              await deleteFromBucket(testimonial.profileImageUrl);
            }
          }
        }
      }

      // Delete all testimonials in this group
      const { error: testimonialsError } = await supabase
        .from("testimonial")
        .delete()
        .eq("testmonial_id", id);

      if (testimonialsError) throw testimonialsError;

      // Delete the group
      const { error } = await supabase
        .from("testimonial_group")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTestimonialGroups(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error("Error deleting Testimonial Group:", error);
      alert("Error deleting Testimonial Group");
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string, groupId: string) => {
    if (!window.confirm("Delete this Testimonial?")) return;

    try {
      // Get testimonial to delete image if exists - HomeSlide की तरह
      const testimonialToDelete = testimonialGroups
        .flatMap(g => g.testimonials || [])
        .find(t => t.id === testimonialId);
      
      // Delete image from bucket if using bucket storage
      if (STORAGE_TYPE === "bucket" && testimonialToDelete?.profileImageUrl) {
        await deleteFromBucket(testimonialToDelete.profileImageUrl);
      }

      const { error } = await supabase
        .from("testimonial")
        .delete()
        .eq("id", testimonialId);

      if (error) throw error;

      // Update testimonial groups
      setTestimonialGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            testimonials: (group.testimonials || []).filter(t => t.id !== testimonialId)
          };
        }
        return group;
      }));
    } catch (error) {
      console.error("Error deleting Testimonial:", error);
      alert("Error deleting Testimonial");
    }
  };

  // Get image URL for display - HomeSlide की तरह
  const getImageUrl = (testimonial: Testimonial): string | null => {
    return STORAGE_TYPE === "bucket" ? testimonial.profileImageUrl : testimonial.profileImage;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-6">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {STORAGE_TYPE === "bucket" 
                  ? "Images are stored in cloud storage bucket"
                  : "Images are stored as Base64 in database"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => {
                  setIsTestimonialGroupEdit(false);
                  setTestimonialGroupModalOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Group
              </Button>
              <Button 
                onClick={() => {
                  setIsTestimonialEdit(false);
                  setTestimonialModalOpen(true);
                }}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Testimonial
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {fetchError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-red-700">Error: {fetchError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchData()}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Testimonial Groups List */}
          {testimonialGroups.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No Testimonial Groups found</p>
              <Button onClick={() => {
                setIsTestimonialGroupEdit(false);
                setTestimonialGroupModalOpen(true);
              }}>
                Create First Testimonial Group
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {testimonialGroups.map((testimonialGroup) => (
                <section key={testimonialGroup.id} className="scroll-mt-16">
                  {/* Testimonial Group Header */}
                  <div className="mb-8  p-6 rounded-xl border shadow-sm">
                    <div className="flex group flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-[var(--color-theme)] group-hover:bg-[var(--color-theme-hover)]  flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                              {testimonialGroup.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {testimonialGroup.heading}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge variant="outline" className="gap-1 text-xs">
                                <ImageIcon size={12} />
                                {testimonialGroup.testimonials?.length || 0} Testimonials
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {formatDate(testimonialGroup.created_at)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        <Button
                          onClick={() => handleEditTestimonialGroup(testimonialGroup)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Pen size={14} />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteTestimonialGroup(testimonialGroup.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Testimonials in this group */}
                  {testimonialGroup.testimonials && testimonialGroup.testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testimonialGroup.testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500">
                          <div className="h-full h-full rounded-2xl p-3 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-xl shadow-lg dark:shadow-lg hover:shadow-2xl transition-all overflow-hidden">
                            {/* Image Section - HomeSlide की तरह */}
                            <div className="relative h-48 overflow-hidden ">
                              {getImageUrl(testimonial) ? (
                                <>
                                  <img 
                                    src={getImageUrl(testimonial)!} 
                                    alt={testimonial.img_lable}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform rounded-lg duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                  <ImageIcon className="w-12 h-12 object-cover text-gray-400 mb-3" />
                                  <p className="text-sm text-gray-500 text-center">No image</p>
                                </div>
                              )}
                              
                              {/* Action Buttons - HomeSlide की तरह */}
                              <div className="absolute top-3 right-3 flex gap-2">
                                <Button
                                  onClick={() => handleEditTestimonial(testimonial)}
                                  size="sm"

                                  className="h-8 w-8 p-0 bg-white/90 dark:bg-[#0B1220]/90 text-black dark:text-white "
                                >
                                  <Pen className="w-3 h-3" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteTestimonial(testimonial.id, testimonialGroup.id)}
                                  size="sm"
                                  variant="error"
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className="p-4">
                              <div className="flex mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              
                              <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                {testimonial.img_lable}
                              </h3>
                              
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                {testimonial.img_paragraph}
                              </p>
                              
                              <p className="text-gray-700 dark:text-gray-300 text-sm italic line-clamp-3">
                                {testimonial.paragraph}
                              </p>
                              
                              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Added {formatDate(testimonial.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-gray-500 mb-4">No testimonials in this group yet</p>
                      <Button
                        onClick={() => {
                          setIsTestimonialEdit(false);
                          setTestimonialModalOpen(true);
                        }}
                        size="sm"
                      >
                        Add First Testimonial
                      </Button>
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Testimonial Group Modal */}
      <Dialog open={testimonialGroupModalOpen} onOpenChange={setTestimonialGroupModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isTestimonialGroupEdit ? "Edit Testimonial Group" : "Create New Testimonial Group"}
            </DialogTitle>
          </DialogHeader>

          <Formik
            initialValues={getTestimonialGroupForEdit()}
            validationSchema={testimonialGroupValidationSchema}
            onSubmit={isTestimonialGroupEdit ? handleTestimonialGroupUpdate : handleTestimonialGroupSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="e.g., Customer Testimonials"
                    className={`mt-1 ${errors.title && touched.title ? 'border-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="heading">Heading *</Label>
                  <Field
                    as={Input}
                    id="heading"
                    name="heading"
                    placeholder="e.g., What our customers say"
                    className={`mt-1 ${errors.heading && touched.heading ? 'border-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="heading"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetTestimonialGroupForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      isTestimonialGroupEdit ? 'Update Group' : 'Create Group'
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Testimonial Modal - HomeSlide की तरह Image Upload के साथ */}
      <Dialog open={testimonialModalOpen} onOpenChange={setTestimonialModalOpen}>
        <DialogContent  className="
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
            <DialogTitle>
              {isTestimonialEdit ? "Edit Testimonial" : "Create New Testimonial"}
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
            initialValues={getTestimonialForEdit()}
            validationSchema={testimonialValidationSchema}
            onSubmit={isTestimonialEdit ? handleTestimonialUpdate : handleTestimonialSubmit}
            enableReinitialize
          >
            {({ 
              values, 
              errors, 
              touched, 
              isSubmitting, 
              setFieldValue 
            }) => (
              <Form className="space-y-4">
                {/* Image Upload Section - HomeSlide की तरह */}
                <div>
                  <Label className="mb-2 block">Profile Image (Max 5MB)</Label>
                  <div 
                    className={`
                      relative border-2 border-dashed rounded-lg transition-all duration-200
                      ${!imagePreview 
                        ? 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800' 
                        : 'border-transparent'
                      }
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      max-w-full
                    `}
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isSubmitting}
                    />

                    {imagePreview ? (
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative group flex-shrink-0">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-md shadow"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                              <Button
                                                   variant="error"
                                                   size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage();
                                }}
                                disabled={isSubmitting}
                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                              Image selected
                            </p>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              disabled={isSubmitting}
                              className="py-1.5 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 text-sm"
                            >
                              <Trash className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <div className="mx-auto w-10 h-10 mb-2 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                          <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-primary-600 dark:text-primary-400">
                            Click to upload
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                          PNG, JPG, GIF (max 5MB)
                        </p>
                        
                        {isTestimonialEdit && (
                          <div className="mt-2 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md inline-block">
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              Leave empty to keep existing
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {STORAGE_TYPE === "bucket" 
                        ? "Stored in secure cloud storage bucket."
                        : "Automatically compressed and stored in database."}
                    </p>
                  </div>
                </div>

                {/* Testimonial Group Selection */}
                <div>
                  <Label htmlFor="testmonial_id">Testimonial Group *</Label>
                  <select
                    id="testmonial_id"
                    name="testmonial_id"
                    value={values.testmonial_id}
                    onChange={(e) => setFieldValue('testmonial_id', e.target.value)}
                    className={`w-full p-2 border rounded-md mt-1 ${
                      errors.testmonial_id && touched.testmonial_id ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select a group</option>
                    {testimonialGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.title}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    name="testmonial_id"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                {/* Testimonial Details */}
                <div>
                  <Label htmlFor="img_lable">Name *</Label>
                  <Field
                    as={Input}
                    id="img_lable"
                    name="img_lable"
                    placeholder="e.g., John Doe"
                    className={`mt-1 ${errors.img_lable && touched.img_lable ? 'border-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="img_lable"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="img_paragraph">Position/Role *</Label>
                  <Field
                    as="textarea"
                    id="img_paragraph"
                    name="img_paragraph"
                    rows={2}
                    className={`w-full p-2 border rounded-md mt-1 ${
                      errors.img_paragraph && touched.img_paragraph ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., CEO at Company Inc."
                  />
                  <ErrorMessage
                    name="img_paragraph"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="paragraph">Testimonial Text *</Label>
                  <Field
                    as="textarea"
                    id="paragraph"
                    name="paragraph"
                    rows={4}
                    className={`w-full p-2 border rounded-md mt-1 ${
                      errors.paragraph && touched.paragraph ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., This product has completely transformed our workflow..."
                  />
                  <ErrorMessage
                    name="paragraph"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetTestimonialForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : isTestimonialEdit ? "Update Testimonial" : "Create Testimonial"}
                  </Button>
                </DialogFooter>
              </Form>
            )}
              </Formik>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Testimonials