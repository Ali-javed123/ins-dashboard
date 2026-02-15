'use client'

import { FC, useCallback, useEffect, useState, useRef } from 'react'
import { Code, Shield, Cloud, Plus, Edit, Trash2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { supabase } from "@/lib/supabase-client"
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

// Constants
const BUCKET_NAME = "services-images";

const STORAGE_TYPE = "bucket"  // यहाँ "base64" या "bucket" में change करें
const CHUNK_SIZE = 60000 as const
const DELIMITER = '|||CHUNK|||' as const
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 
const USE_BUCKET_STORAGE = true; // true for bucket, false for base64

// Types
interface ServiceGroupDatabase {
  id: string
  created_at: string
  title: string
  slug: string
}

interface ServiceDatabase {
  id: string
  created_at: string
  service_group_id: string
  slug: string
  title: string
  icon: string
  image: string | null  // base64 chunks store होंगे
}

interface Service {
  id: string
  slug: string
  title: string
  icon: string
  image: string | null        // Base64 के लिए
  imageUrl?: string | null    // Bucket के लिए
}

interface ServiceGroup {
  id: string
  title: string
  slug: string
  services: Service[]
}

interface ServiceGroupFormValues {
  title: string
}

interface ServiceFormValues {
  service_group_id: string
  title: string
  icon: string
}

interface ServiceFormData {
  service_group_id: string
  title: string
  icon: string
  image: File | null
}

interface ServiceInsertData {
  service_group_id: string
  slug: string
  title: string
  icon: string
  image: string | null
}

interface ServiceUpdateData {
  service_group_id: string
  slug: string
  title: string
  icon: string
  image?: string | null
}



// Validation Schemas
const serviceGroupValidationSchema = Yup.object({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .required('Title is required')
})

const serviceValidationSchema = Yup.object({
  service_group_id: Yup.string()
    .required('Please select a service group'),
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .required('Title is required'),
  icon: Yup.string()
    .required('Icon class is required')
})

// Utility Functions
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Base64 Functions
const splitIntoChunks = (base64String: string): string => {
  if (!base64String || base64String.length <= CHUNK_SIZE) {
    return base64String
  }
  const chunks: string[] = []
  for (let i = 0; i < base64String.length; i += CHUNK_SIZE) {
    chunks.push(base64String.slice(i, i + CHUNK_SIZE))
  }
  return chunks.join(DELIMITER)
}

const reconstructFromChunks = (chunkedString: string | null | undefined): string | null => {
  if (!chunkedString) return null
  if (!chunkedString.includes(DELIMITER)) {
    return chunkedString
  }
  return chunkedString.split(DELIMITER).join('')
}

// Image conversion function
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMAGE_SIZE) {
    toast.error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`, {
        icon: <XCircle className="text-red-500" />,
      });

      reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`))
      return
    }

    // First try to compress if needed
    const compressImage = (imageFile: File): Promise<string> => {
      return new Promise((resolveCompress, rejectCompress) => {
        if (typeof window === 'undefined') {
          rejectCompress(new Error('Image compression only available in browser'))
          return
        }

        const img = new window.Image()
        const canvas = document.createElement('canvas')

        img.onload = () => {
          let width = img.width
          let height = img.height

          // Resize if too large
          const maxDimension = 1024
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

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            rejectCompress(new Error('Could not get canvas context'))
            return
          }

          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)

          // Adjust quality based on file size
          let quality = 0.8
          if (file.size > 2 * 1024 * 1024) quality = 0.6
          if (file.size > 3 * 1024 * 1024) quality = 0.5

          const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          resolveCompress(compressedBase64)
        }

        img.onerror = rejectCompress
        img.src = URL.createObjectURL(imageFile)
      })
    }

    // Process image based on size
    const processImage = async () => {
      try {
        // If file is larger than 500KB, compress it
        if (file.size > 500 * 1024) {
          return await compressImage(file)
        } else {
          // Direct conversion for small files
          return new Promise<string>((resolveNormal, rejectNormal) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
              const result = reader.result as string
              // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
              const base64 = result.split(',')[1] || result
              resolveNormal(base64)
            }
            reader.onerror = rejectNormal
          })
        }
      } catch (compressError) {
        // Fallback to simple conversion if compression fails
        console.warn('Compression failed, using fallback:', compressError)
        return new Promise<string>((resolveFallback, rejectFallback) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const result = reader.result as string
            const base64 = result.split(',')[1] || result
            resolveFallback(base64)
          }
          reader.onerror = rejectFallback
        })
      }
    }

    processImage()
      .then(resolve)
      .catch(reject)
  })
}


// Utility Functions for Bucket Storage
const generateFileName = (serviceId: string, file: File): string => {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  return `service_${serviceId}_${timestamp}.${extension}`;
};


// uploadToBucket function में ये add करो
const uploadToBucket = async (
  file: File,
  serviceId: string
): Promise<string | null> => {
  try {
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `service_${serviceId}_${Date.now()}.${extension}`;

    if (file.size > 5 * 1024 * 1024) {
      // alert('Image must be less than 5MB');
            toast.error("Image must be less than 5MB", {
        icon: <XCircle className="text-red-500" />,
      });

      return null;
    }

    const { error } = await supabase.storage
      .from('services-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
            toast.error("Failed to upload image", {
        icon: <XCircle className="text-red-500" />,
      });

      throw error;
    }

    const { data } = supabase.storage
      .from('services-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {
    console.error('Bucket upload failed:', err);
        toast.error("Image upload failed", {
      icon: <XCircle className="text-red-500" />,
    });

    return null;
  }
};


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


// Main Component
const ServicesPage: FC = () => {
  // State
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [serviceGroupOpen, setServiceGroupOpen] = useState<boolean>(false)
  const [serviceOpen, setServiceOpen] = useState<boolean>(false)
  const [isEditServiceGroup, setIsEditServiceGroup] = useState<boolean>(false)
  const [isEditService, setIsEditService] = useState<boolean>(false)
  const [editServiceGroupId, setEditServiceGroupId] = useState<string | null>(null)
  const [editServiceId, setEditServiceId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedServiceGroup, setSelectedServiceGroup] = useState<string>('')

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form Data
  const [serviceGroupFormData, setServiceGroupFormData] = useState<ServiceGroupFormValues>({
    title: ''
  })

  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
    service_group_id: '',
    title: '',
    icon: '',
    image: null
  })

  // Fetch Data
  const fetchServiceGroups = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      
      const { data: groupsData, error: groupsError } = await supabase
        .from('service_groups')
        .select('*')
        .order('created_at', { ascending: true })

      if (groupsError) {
        console.error('Error fetching service groups:', groupsError)
        return
      }

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true })

      if (servicesError) {
        console.error('Error fetching services:', servicesError)
        return
      }

      const processedGroups: ServiceGroup[] = (groupsData || []).map((group: ServiceGroupDatabase) => {
        const groupServices = (servicesData || [])
          .filter((service: ServiceDatabase) => service.service_group_id === group.id)
          .map((service: ServiceDatabase) => convertToService(service))

        return {
          id: group.id,
          title: group.title,
          slug: group.slug,
          services: groupServices
        }
      })

      setServiceGroups(processedGroups)
    } catch (error) {
      console.error('Unexpected error:', error)
    }
    finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServiceGroups()
  }, [fetchServiceGroups])

  // Convert Database to Service Type
const convertToService = (dbService: ServiceDatabase): Service => {
  if (USE_BUCKET_STORAGE) {
    // For bucket storage
    return {
      id: dbService.id,
      slug: dbService.slug,
      title: dbService.title,
      icon: dbService.icon,
      image: null,
      imageUrl: dbService.image // यहाँ bucket URL आएगी
    };
  } else {
    // For Base64 storage (existing functionality)
    return {
      id: dbService.id,
      slug: dbService.slug,
      title: dbService.title,
      icon: dbService.icon,
      image: reconstructFromChunks(dbService.image)
    };
  }
};

  // Reset Forms
  const resetServiceGroupForm = (): void => {
    setIsEditServiceGroup(false)
    setEditServiceGroupId(null)
    setServiceGroupFormData({ title: '' })
    setSubmitting(false)
  }

  const resetServiceForm = (): void => {
    setIsEditService(false)
    setEditServiceId(null)
    setPreviewImage(null)
    setServiceFormData({
      service_group_id: '',
      title: '',
      icon: '',
      image: null
    })
    setSubmitting(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Service Group Handlers
  const handleEditServiceGroup = (group: ServiceGroup): void => {
    setIsEditServiceGroup(true)
    setEditServiceGroupId(group.id)
    setServiceGroupFormData({ title: group.title })
    setServiceGroupOpen(true)
  }

  const handleSubmitServiceGroup = async (
    values: ServiceGroupFormValues,
    formikHelpers: FormikHelpers<ServiceGroupFormValues>
  ): Promise<void> => {
    if (submitting) return

    try {
      setSubmitting(true)
      const slug = generateSlug(values.title)

      if (isEditServiceGroup && editServiceGroupId) {
        const { error } = await supabase
          .from('service_groups')
          .update({
            title: values.title,
            slug: slug,
          })
          .eq('id', editServiceGroupId)

        if (error) throw new Error(`Failed to update: ${error.message}`)
              toast.success("Service group updated successfully!", {
        icon: <CheckCircle className="text-green-500" />,
      });

      } else {
        const { error } = await supabase
          .from('service_groups')
          .insert([{
            title: values.title,
            slug: slug
          }])
          .select()
          .single()

        if (error) throw new Error(`Failed to create: ${error.message}`)
              toast.success("Service group created successfully!", {
        icon: <CheckCircle className="text-green-500" />,
      });

      }

      await fetchServiceGroups()
      resetServiceGroupForm()
      setServiceGroupOpen(false)
      formikHelpers.resetForm()
    }
    // catch (error) {
    //   console.error('Error saving service group:', error)
    //   // alert(error instanceof Error ? `Error: ${error.message}` : 'Error saving service group')
    //       toast.error(error instanceof Error ? error.message : 'Error saving service group', {
    //   icon: <XCircle className="text-red-500" />,
    // });

    // }
    catch (error: unknown) {
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
}
    finally {
      setSubmitting(false)
    }
  }

  const handleDeleteServiceGroup = async (id: string): Promise<void> => {
    if (!window.confirm('Delete this service group and all its services?')) return

    try {
      const { error: servicesError } = await supabase
        .from('services')
        .delete()
        .eq('service_group_id', id)

      if (servicesError) throw servicesError

      const { error: groupError } = await supabase
        .from('service_groups')
        .delete()
        .eq('id', id)

      if (groupError) throw groupError

      await fetchServiceGroups()
      // alert('Service group deleted successfully!')
          toast.success("Service group deleted successfully!", {
      icon: <CheckCircle className="text-green-500" />,
    });

    } catch (error) {
      console.error('Error deleting service group:', error)
      // alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`)
          toast.error(error instanceof Error ? error.message : 'Error deleting service group', {
      icon: <XCircle className="text-red-500" />,
    });

    }
  }

  // Service Handlers
const handleEditService = (service: Service, groupId: string): void => {
  setIsEditService(true);
  setEditServiceId(service.id);
  setSelectedServiceGroup(groupId);
  
  const newFormData: ServiceFormData = {
    service_group_id: groupId,
    title: service.title,
    icon: service.icon,
    image: null
  };
  
  setServiceFormData(newFormData);
  
  // Set preview based on storage type
  if (USE_BUCKET_STORAGE) {
    setPreviewImage(service.imageUrl || null);
  } else {
    // Existing base64 functionality
    if (service.image) {
      const base64Image = reconstructFromChunks(service.image);
      setPreviewImage(base64Image ? `data:image/jpeg;base64,${base64Image}` : null);
    } else {
      setPreviewImage(null);
    }
  }
  
  setServiceOpen(true);
};

  // Image Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        // alert('Please select an image file')
              toast.error("Please select an image file", {
        icon: <XCircle className="text-red-500" />,
      });

        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        // alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`)
              toast.error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`, {
        icon: <XCircle className="text-red-500" />,
      });

        return
      }

      setServiceFormData(prev => ({ ...prev, image: file }))
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
          toast.info("Image selected successfully", {
      icon: <CheckCircle className="text-green-500" />,
    });

    }
  }

  const handleRemoveImage = (): void => {
    setServiceFormData(prev => ({ ...prev, image: null }))
    setPreviewImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // FIXED: handleSubmitService function
const handleSubmitService = async (
  values: ServiceFormValues,
  formikHelpers: FormikHelpers<ServiceFormValues>
): Promise<void> => {
  if (submitting) return;

  try {
    setSubmitting(true);

    const slug = generateSlug(values.title);
    let imageUrl: string | null = null;

    /* =============================
       CREATE SERVICE (BUCKET)
    ============================== */
    if (!isEditService && USE_BUCKET_STORAGE) {
      // 1️⃣ create service first
      const { data: service, error } = await supabase
        .from('services')
        .insert({
          service_group_id: values.service_group_id,
          slug,
          title: values.title,
          icon: values.icon,
          image: null,
        })
        .select()
        .single();

      if (error) throw error;

      // 2️⃣ upload image
      if (serviceFormData.image) {
        imageUrl = await uploadToBucket(serviceFormData.image, service.id);

        if (imageUrl) {
          await supabase
            .from('services')
            .update({ image: imageUrl })
            .eq('id', service.id);
        }
      }

      await fetchServiceGroups();
      resetServiceForm();
      setServiceOpen(false);
      formikHelpers.resetForm();
      // alert('Service created successfully!');
            toast.success("Service created successfully!", {
        icon: <CheckCircle className="text-green-500" />,
      });

      return;
    }

    /* =============================
       EDIT SERVICE (BUCKET)
    ============================== */
    if (isEditService && editServiceId) {
      if (serviceFormData.image) {
        imageUrl = await uploadToBucket(
          serviceFormData.image,
          editServiceId
        );
      }

      const updateData: ServiceUpdateData = {
        service_group_id: values.service_group_id,
        slug,
        title: values.title,
        icon: values.icon,
        image: imageUrl ?? undefined,
      };

      const { error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', editServiceId);

      if (error) throw error;
            toast.success("Service updated successfully!", {
        icon: <CheckCircle className="text-green-500" />,
      });

    }

    await fetchServiceGroups();
    resetServiceForm();
    setServiceOpen(false);
    formikHelpers.resetForm();
    // alert('Service updated successfully!');
   
  }
  catch (error: unknown) {
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
}
 finally {
    setSubmitting(false);
  }
};


const handleDeleteService = async (id: string): Promise<void> => {
  if (!window.confirm('Delete this service?')) return;

  try {
    // Delete image from bucket if using bucket storage
    if (USE_BUCKET_STORAGE) {
      const serviceToDelete = serviceGroups
        .flatMap(g => g.services)
        .find(s => s.id === id);
      
      if (serviceToDelete?.imageUrl) {
        await deleteFromBucket(serviceToDelete.imageUrl);
      }
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchServiceGroups();
    // alert('Service deleted successfully!');
        toast.success("Service deleted successfully!", {
      icon: <CheckCircle className="text-green-500" />,
    });

  }
  // catch (error) {
  //   console.error('Error deleting service:', error);
  //   // alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`);
  //       toast.error(
  //     error instanceof Error ? error.message : 'Error deleting service',
  //     {
  //       icon: <XCircle className="text-red-500" />,
  //     }
  //   );
  // }

  catch (error: unknown) {
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
}
};


  // Get safe image URL
 const getSafeImageUrl = (service: Service): string => {
  if (USE_BUCKET_STORAGE) {
    // For bucket storage
    return service.imageUrl || '/assets/images/service/service-1-2.png';
  } else {
    // Existing base64 functionality
    if (service.image) {
      const base64Image = reconstructFromChunks(service.image);
      if (base64Image) {
        return `data:image/jpeg;base64,${base64Image}`;
      }
    }
    return '/assets/images/service/service-1-2.png';
  }
};


  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full  "></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Services Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your service groups and services
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={() => {
            resetServiceGroupForm()
            setServiceGroupOpen(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service Group
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              resetServiceForm()
              setSelectedServiceGroup(serviceGroups[0]?.id || '')
              setServiceOpen(true)
            }}
            disabled={serviceGroups.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Service Groups Display */}
      <div className="space-y-8">
        {serviceGroups.map((group) => (
          <div key={group.id} className="my-5 ">
            {/* rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 */}
            {/* Group Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {group.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Slug: {group.slug} • {group.services.length} services
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="update"
                  // size="sm"
                  onClick={() => handleEditServiceGroup(group)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Group
                </Button>
                
                <Button
                  variant="default"
                  // size="sm"
                  onClick={() => {
                    resetServiceForm()
                    setSelectedServiceGroup(group.id)
                    setServiceOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
                
              
              </div>
            </div>

            {/* Services Grid */}
            {group.services.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.services.map((service) => (
                  <div
                    key={service.id}
                    className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500"
                  >
                    <div className="h-full rounded-2xl p-3 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-xl shadow-lg dark:shadow-lg hover:shadow-2xl transition-all">
                      {/* Service Image */}
                      <div className="mb-4 h-48 overflow-hidden rounded-lg">
                        <img
                          src={getSafeImageUrl(service)}
                          alt={service.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/service/service-1-2.png'
                          }}
                        />
                      </div>

                      {/* Icon */}
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
                        <div 
                          dangerouslySetInnerHTML={{
                            __html: `<i class="${service.icon} text-2xl"></i>`
                          }}
                          className="flex items-center justify-center w-full h-full"
                        />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {service.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Slug: {service.slug}
                      </p>

                      {/* Actions */}
                      <div className="mt-5 flex gap-2">
                        <Button
                          variant="update"
                          size="sm"
                          onClick={() => handleEditService(service, group.id)}
                          className="flex-1"
                        >
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                        
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                          className="flex-1"
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                <Code className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No services yet
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating a new service
                </p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    resetServiceForm()
                    setSelectedServiceGroup(group.id)
                    setServiceOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>
            )}
          </div>
        ))}

        {serviceGroups.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <Cloud className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No service groups yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first service group
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                resetServiceGroupForm()
                setServiceGroupOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Service Group
            </Button>
          </div>
        )}
      </div>

      {/* Service Group Dialog */}
      <Dialog open={serviceGroupOpen} onOpenChange={setServiceGroupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditServiceGroup ? 'Edit Service Group' : 'Create Service Group'}
            </DialogTitle>
          </DialogHeader>
          
          <Formik
            initialValues={serviceGroupFormData}
            validationSchema={serviceGroupValidationSchema}
            onSubmit={handleSubmitServiceGroup}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="title">Group Title *</Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="e.g., Core Services"
                    className={errors.title && touched.title ? 'border-red-500' : ''}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Slug will be: {serviceGroupFormData.title ? generateSlug(serviceGroupFormData.title) : '...'}
                  </p>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setServiceGroupOpen(false)
                      resetServiceGroupForm()
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (isEditServiceGroup ? 'Update' : 'Create')}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={serviceOpen} onOpenChange={setServiceOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditService ? 'Edit Service' : 'Create Service'}
            </DialogTitle>
          </DialogHeader>
          
          <Formik
            initialValues={{
              service_group_id: selectedServiceGroup,
              title: serviceFormData.title,
              icon: serviceFormData.icon
            }}
            validationSchema={serviceValidationSchema}
            onSubmit={handleSubmitService}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, values, setFieldValue }) => (
              <Form className="space-y-4">
                {/* Service Group Selection */}
                <div>
                  <Label htmlFor="service_group_id">Service Group *</Label>
                  <Field
                    as="select"
                    id="service_group_id"
                    name="service_group_id"
                    className={`w-full rounded-md border p-2 ${errors.service_group_id && touched.service_group_id ? 'border-red-500' : ''}`}
                    value={values.service_group_id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const value = e.target.value
                      setFieldValue('service_group_id', value)
                      setSelectedServiceGroup(value)
                    }}
                  >
                    <option value="">Select a group</option>
                    {serviceGroups.map((group) => (
                      <option 
                        key={group.id} 
                        value={group.id}
                      >
                        {group.title}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="service_group_id"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Service Title *</Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="e.g., Web Development"
                    className={errors.title && touched.title ? 'border-red-500' : ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('title', e.target.value)
                      setServiceFormData(prev => ({ ...prev, title: e.target.value }))
                    }}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Slug will be: {values.title ? generateSlug(values.title) : '...'}
                  </p>
                </div>

                {/* Icon */}
                <div>
                  <Label htmlFor="icon">FontAwesome Icon Class *</Label>
                  <Field
                    as={Input}
                    id="icon"
                    name="icon"
                    placeholder="e.g., fa-solid fa-code"
                    className={errors.icon && touched.icon ? 'border-red-500' : ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('icon', e.target.value)
                      setServiceFormData(prev => ({ ...prev, icon: e.target.value }))
                    }}
                  />
                  <ErrorMessage
                    name="icon"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use FontAwesome classes like fa-solid fa-code or fa-regular fa-layer-group
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <Label htmlFor="image">Service Image</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-4 hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    
                    {previewImage ? (
                      <div className="space-y-3 text-center">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mx-auto max-h-28 rounded-lg object-contain"
                        />
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSubmitting}
                          >
                            <Upload className="mr-2 h-3 w-3" />
                            Change
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveImage}
                            disabled={isSubmitting}
                          >
                            <X className="mr-2 h-3 w-3" />
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
                          className="w-full py-6"
                          disabled={isSubmitting}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span>Upload Image</span>
                            <span className="text-xs text-gray-500">
                              Max {MAX_IMAGE_SIZE / 1024 / 1024}MB • Base64 Storage
                            </span>
                          </div>
                        </Button>
                      </div>
                    )}
                    
                    {isEditService && !previewImage && (
                      <div className="mt-2 text-center text-xs text-gray-500">
                        Current image will be kept if no new image is selected
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Images are compressed and stored in database as Base64.
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setServiceOpen(false)
                      resetServiceForm()
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting || !values.service_group_id || !values.title || !values.icon}
                  >
                    {isSubmitting ? 'Saving...' : (isEditService ? 'Update' : 'Create')}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ServicesPage