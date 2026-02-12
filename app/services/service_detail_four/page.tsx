// components/ServiceDetailFourManagement.tsx
'use client'

import { FC, useCallback, useEffect, useState, useRef } from 'react'
import { Plus, Edit, Trash2, ChevronDown, Filter, Image as ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { supabase } from "@/lib/supabase-client"

// ============ CONSTANTS ============
const BUCKET_NAME = "service_detail_four"
const STORAGE_TYPE = "bucket" // 'bucket' or 'base64'
const CHUNK_SIZE = 60000
const DELIMITER = '|||CHUNK|||'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

// ============ TYPES ============
interface ServiceGroup {
  id: string
  title: string
  created_at?: string
}

interface Service {
  id: string
  title: string
  service_group_id: string
  created_at?: string
}

interface ServiceDetailFour {
  id: string
  created_at: string
  img: string | null // base64 or bucket URL
  heading: string
  description: string
  service_id: string
  service_group_id: string
  // For bucket storage - URL

  imgUrl?: string | null
}

interface ServiceDetailFourFormValues {
  heading: string
  description: string
  service_id: string
  service_group_id: string
  // Image is handled separately
}

interface FormDataState {
  heading: string
  description: string
  service_id: string
  service_group_id: string
  image_file: File | null
}

// ============ VALIDATION SCHEMA ============
const serviceDetailFourValidationSchema = Yup.object({
  heading: Yup.string()
    .min(2, 'Heading must be at least 2 characters')
    .max(100, 'Heading must be at most 100 characters')
    .required('Heading is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters')
    .required('Description is required'),
  service_group_id: Yup.string()
    .required('Service group is required'),
  service_id: Yup.string()
    .required('Service is required')
})

// ============ MAIN COMPONENT ============
const ServiceDetailFourManagement: FC = () => {
  // ============ STATE ============
  // Data states
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [serviceDetails, setServiceDetails] = useState<ServiceDetailFour[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  // Filter states - Default to first service group and first service
  const [selectedFilterServiceGroup, setSelectedFilterServiceGroup] = useState<string>('')
  const [selectedFilterService, setSelectedFilterService] = useState<string>('')
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)
  
  // Form states
  const [formData, setFormData] = useState<FormDataState>({
    heading: '',
    description: '',
    service_id: '',
    service_group_id: '',
    image_file: null
  })
  
  // Image states
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  
  // Selected values for dropdowns in form
  const [selectedServiceGroup, setSelectedServiceGroup] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')

  // ============ COMPUTED PROPERTIES ============
  // Filtered services based on selected service group in form
  const filteredServices = services.filter(service => 
    selectedServiceGroup ? service.service_group_id === selectedServiceGroup : true
  )

  // Filtered services for filter dropdown
  const filteredServicesForFilter = selectedFilterServiceGroup !== '' 
    ? services.filter(service => service.service_group_id === selectedFilterServiceGroup)
    : services

  // Filtered service details based on selected filters
  const filteredServiceDetails = serviceDetails.filter(detail => {
    if (selectedFilterServiceGroup === '' && selectedFilterService === '') {
      return true
    }
    
    if (selectedFilterServiceGroup !== '' && selectedFilterService === '') {
      return detail.service_group_id === selectedFilterServiceGroup
    }
    
    if (selectedFilterService !== '') {
      return detail.service_id === selectedFilterService
    }
    
    return true
  })

  // Ensure at least one row is shown - if filtered results are empty, show default
  const displayServiceDetails = filteredServiceDetails.length > 0 
    ? filteredServiceDetails 
    : serviceDetails.length > 0 ? [serviceDetails[0]] : []

  // ============ DATA FETCHING ============
  const fetchAllData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      
      // Fetch service groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('service_groups')
        .select('id, title, created_at')
        .order('created_at', { ascending: true })

      if (groupsError) throw groupsError
      setServiceGroups(groupsData || [])

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, title, service_group_id, created_at')
        .order('created_at', { ascending: true })

      if (servicesError) throw servicesError
      setServices(servicesData || [])

      // Fetch service detail four
      const { data: serviceDetailsData, error: serviceDetailsError } = await supabase
        .from('service_detail_four')
        .select('*')
        .order('created_at', { ascending: true })

      if (serviceDetailsError) throw serviceDetailsError
      
      // Process images based on storage type
      const processedDetails = (serviceDetailsData || []).map(detail => convertToServiceDetail(detail))
      setServiceDetails(processedDetails)

    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Set default filters when data loads
  useEffect(() => {
    if (serviceGroups.length > 0 && selectedFilterServiceGroup === '') {
      setSelectedFilterServiceGroup(serviceGroups[0].id)
    }
    
    if (services.length > 0 && selectedFilterService === '') {
      const servicesInGroup = services.filter(s => s.service_group_id === selectedFilterServiceGroup)
      if (servicesInGroup.length > 0) {
        setSelectedFilterService(servicesInGroup[0].id)
      } else if (services.length > 0) {
        setSelectedFilterService(services[0].id)
      }
    }
  }, [serviceGroups, services, selectedFilterServiceGroup, selectedFilterService])

  // ============ CONVERSION FUNCTIONS ============
  const convertToServiceDetail = (dbRecord: ServiceDetailFour): ServiceDetailFour => {
    if (STORAGE_TYPE === "bucket") {
      return {
        id: dbRecord.id,
        created_at: dbRecord.created_at,
        heading: dbRecord.heading,
        description: dbRecord.description,
        img: null,
        imgUrl: dbRecord.img || null,
        service_id: dbRecord.service_id,
        service_group_id: dbRecord.service_group_id
      }
    } else {
      return {
        id: dbRecord.id,
        created_at: dbRecord.created_at,
        heading: dbRecord.heading,
        description: dbRecord.description,
        img: reconstructFromChunks(dbRecord.img),
        imgUrl: null,
        service_id: dbRecord.service_id,
        service_group_id: dbRecord.service_group_id
      }
    }
  }

  // ============ IMAGE HANDLING FUNCTIONS ============
  // Base64 chunking functions
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

  const reconstructFromChunks = (chunkedString: string | null | undefined): string | null => {
    if (!chunkedString) return null
    
    if (!chunkedString.includes(DELIMITER)) {
      return chunkedString
    }
    
    return chunkedString.split(DELIMITER).join('')
  }

  // Optimized Base64 conversion with compression
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`))
        return
      }

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

      const processImage = async () => {
        try {
          if (file.size > 500 * 1024) {
            return await compressImage(file)
          } else {
            return new Promise<string>((resolveNormal, rejectNormal) => {
              const reader = new FileReader()
              reader.readAsDataURL(file)
              reader.onload = () => resolveNormal(reader.result as string)
              reader.onerror = rejectNormal
            })
          }
        } catch {
          return new Promise<string>((resolveFallback, rejectFallback) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolveFallback(reader.result as string)
            reader.onerror = rejectFallback
          })
        }
      }

      processImage()
        .then(resolve)
        .catch(reject)
    })
  }

  // Generate filename for bucket storage
  const generateFileName = (id: string, file: File): string => {
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    return `service-detail-four/${id}_${timestamp}.${extension}`
  }

  // Upload to bucket
  const uploadToBucket = async (file: File, recordId: string): Promise<string> => {
    try {
      const fileName = generateFileName(recordId, file)
      
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

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  // Delete image from bucket
  const deleteFromBucket = async (imageUrl: string | null | undefined): Promise<void> => {
    try {
      if (!imageUrl) return
      
      // Extract filename from URL
      const urlParts = imageUrl.split('/')
      const fileName = urlParts.slice(urlParts.indexOf(BUCKET_NAME) + 1).join('/')
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

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setFormData(prev => ({ ...prev, image_file: file }))
      
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
    }
  }

  // Handle remove image
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_file: null }))
    setPreviewImage(null)
    setExistingImageUrl(null)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewImage && !previewImage.startsWith('http')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  // ============ FORM HANDLING ============
  const resetForm = (): void => {
    setIsEdit(false)
    setEditId(null)
    setFormData({
      heading: '',
      description: '',
      service_id: '',
      service_group_id: '',
      image_file: null
    })
    setSelectedServiceGroup('')
    setSelectedService('')
    setPreviewImage(null)
    setExistingImageUrl(null)
    setSubmitting(false)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Get service group name by ID
  const getServiceGroupName = (id: string): string => {
    const group = serviceGroups.find(g => g.id === id)
    return group ? group.title : 'Unknown Group'
  }

  // Get service name by ID
  const getServiceName = (id: string): string => {
    const service = services.find(s => s.id === id)
    return service ? service.title : 'Unknown Service'
  }

  // Get image URL for display
  const getImageUrl = (detail: ServiceDetailFour): string | null => {
    if (STORAGE_TYPE === "bucket") {
      return detail.imgUrl || null
    } else {
      return detail.img || null
    }
  }

  // Handle Edit
  const handleEdit = (detail: ServiceDetailFour): void => {
    setIsEdit(true)
    setEditId(detail.id)
    setFormData({
      heading: detail.heading,
      description: detail.description,
      service_id: detail.service_id,
      service_group_id: detail.service_group_id,
      image_file: null
    })
    setSelectedServiceGroup(detail.service_group_id)
    setSelectedService(detail.service_id)
    
    // Set preview image based on storage type
    if (STORAGE_TYPE === "bucket") {
      setExistingImageUrl(detail.imgUrl || null)
      setPreviewImage(detail.imgUrl || null)
    } else {
      setExistingImageUrl(detail.img || null)
      setPreviewImage(detail.img || null)
    }
    
    setDialogOpen(true)
  }

  // Handle Create/Update Submit
  const handleSubmit = async (
    values: ServiceDetailFourFormValues,
    formikHelpers: FormikHelpers<ServiceDetailFourFormValues>
  ): Promise<void> => {
    if (submitting) return

    try {
      setSubmitting(true)

      if (isEdit && editId) {
        // ============ UPDATE OPERATION ============
        let imageData: string | null = null
        let oldImageData: string | null | undefined = null
        
        // Get existing record
        const existingRecord = serviceDetails.find(d => d.id === editId)
        if (existingRecord) {
          oldImageData = STORAGE_TYPE === "bucket" 
            ? existingRecord.imgUrl 
            : existingRecord.img
        }
        
        // Process new image if selected
        if (formData.image_file) {
          if (STORAGE_TYPE === "bucket") {
            // Delete old image from bucket if exists
            if (oldImageData) {
              await deleteFromBucket(oldImageData)
            }
            
            // Upload new image to bucket
            try {
              imageData = await uploadToBucket(formData.image_file, editId)
            } catch (uploadError) {
              console.error("Bucket upload failed:", uploadError)
              imageData = oldImageData || null
            }
          } else {
            // Convert to Base64 and chunk
            try {
              const base64Image = await convertImageToBase64(formData.image_file)
              imageData = splitIntoChunks(base64Image)
            } catch (convertError) {
              console.error("Base64 conversion failed:", convertError)
              imageData = oldImageData ? splitIntoChunks(oldImageData) : null
            }
          }
        } else {
          // Keep existing image
          imageData = oldImageData || null
        }

        // Update record in database
        const { error } = await supabase
          .from('service_detail_four')
          .update({
            heading: values.heading,
            description: values.description,
            img: imageData,
            service_id: values.service_id,
            service_group_id: values.service_group_id
          })
          .eq('id', editId)

        if (error) throw new Error(`Failed to update: ${error.message}`)

      } else {
        // ============ CREATE OPERATION ============
        // First create record without image to get ID
        const { data: newRecord, error: createError } = await supabase
          .from('service_detail_four')
          .insert([{
            heading: values.heading,
            description: values.description,
            img: null, // Will update after processing
            service_id: values.service_id,
            service_group_id: values.service_group_id
          }])
          .select()
          .single()

        if (createError) throw new Error(`Failed to create: ${createError.message}`)

        let imageData: string | null = null
        
        // Process image if provided
        if (formData.image_file && newRecord) {
          if (STORAGE_TYPE === "bucket") {
            // Upload to bucket
            try {
              imageData = await uploadToBucket(formData.image_file, newRecord.id)
            } catch (uploadError) {
              console.error("Bucket upload failed:", uploadError)
            }
          } else {
            // Convert to Base64 and chunk
            try {
              const base64Image = await convertImageToBase64(formData.image_file)
              imageData = splitIntoChunks(base64Image)
            } catch (convertError) {
              console.error("Base64 conversion failed:", convertError)
            }
          }
          
          // Update record with image data
          if (imageData) {
            const { error: updateError } = await supabase
              .from('service_detail_four')
              .update({ img: imageData })
              .eq('id', newRecord.id)

            if (updateError) {
              console.error("Error updating record with image:", updateError)
            }
          }
        }
      }

      // Refresh data
      await fetchAllData()
      
      // Reset form and close dialog
      resetForm()
      setDialogOpen(false)
      formikHelpers.resetForm()
      
      alert(`Service detail ${isEdit ? 'updated' : 'created'} successfully!`)
      
    } catch (error) {
      console.error('Error saving service detail:', error)
      alert(error instanceof Error ? `Error: ${error.message}` : 'Error saving service detail')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete
  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this service detail?')) return

    try {
      // Handle image deletion based on storage type
      if (STORAGE_TYPE === "bucket") {
        const recordToDelete = serviceDetails.find(d => d.id === id)
        if (recordToDelete?.imgUrl) {
          await deleteFromBucket(recordToDelete.imgUrl)
        }
      }

      // Delete record from database
      const { error } = await supabase
        .from('service_detail_four')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh data
      await fetchAllData()
      
      alert('Service detail deleted successfully!')
    } catch (error) {
      console.error('Error deleting service detail:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  // ============ RENDER ============
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Service Details Four Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage service details with images and descriptions
            </p>
          </div>

          <Button 
            onClick={() => { resetForm(); setDialogOpen(true); }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Service Detail
          </Button>
        </div>

        {/* ============ FILTER SECTION ============ */}
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-blue-100 dark:border-gray-700 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Filter by:</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              {/* Service Group Filter */}
              <div className="flex-1">
                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Service Group
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-900"
                    >
                      {selectedFilterServiceGroup 
                        ? getServiceGroupName(selectedFilterServiceGroup)
                        : "Select service group"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[200px]">
                    {serviceGroups.map((group) => (
                      <DropdownMenuItem
                        key={group.id}
                        onClick={() => {
                          setSelectedFilterServiceGroup(group.id)
                          setSelectedFilterService('')
                        }}
                        className="cursor-pointer"
                      >
                        {group.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Service Filter */}
              <div className="flex-1">
                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Service
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-900"
                      disabled={!selectedFilterServiceGroup}
                    >
                      {selectedFilterService 
                        ? getServiceName(selectedFilterService)
                        : filteredServicesForFilter.length > 0
                          ? "Select service"
                          : "No services available"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[200px]">
                    <DropdownMenuItem 
                      onClick={() => setSelectedFilterService('')}
                      className="cursor-pointer font-medium text-blue-600"
                    >
                      All Services
                    </DropdownMenuItem>
                    {filteredServicesForFilter.map((service) => (
                      <DropdownMenuItem
                        key={service.id}
                        onClick={() => setSelectedFilterService(service.id)}
                        className="cursor-pointer"
                      >
                        {service.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedFilterServiceGroup !== '' || selectedFilterService !== '') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFilterServiceGroup('')
                  setSelectedFilterService('')
                }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedFilterServiceGroup !== '' || selectedFilterService !== '') && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Showing:</span>
              {selectedFilterServiceGroup && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  Group: {getServiceGroupName(selectedFilterServiceGroup)}
                </span>
              )}
              {selectedFilterService && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Service: {getServiceName(selectedFilterService)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============ SERVICE DETAILS DISPLAY ============ */}
      <div className="space-y-6">
        {displayServiceDetails.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {displayServiceDetails.map((detail) => {
              const imageUrl = getImageUrl(detail)
              
              return (
                <div
                  key={detail.id}
                  className="group relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={detail.heading}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                        <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                    
                    {/* Overlay with service info */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {getServiceGroupName(detail.service_group_id)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {getServiceName(detail.service_id)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {detail.heading}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {detail.description}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(detail)}
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                      >
                        <Edit className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(detail.id)}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950/50">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <ImageIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No service details found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {selectedFilterServiceGroup !== '' || selectedFilterService !== ''
                ? 'Try changing your filters or create a new service detail'
                : 'Create your first service detail to get started'}
            </p>
            <Button
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Service Detail
            </Button>
          </div>
        )}
      </div>

      {/* ============ ADD/EDIT DIALOG ============ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {isEdit ? 'Edit Service Detail' : 'Create New Service Detail'}
            </DialogTitle>
          </DialogHeader>
          
          <Formik
            initialValues={{
              heading: formData.heading,
              description: formData.description,
              service_id: formData.service_id,
              service_group_id: formData.service_group_id
            }}
            validationSchema={serviceDetailFourValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
              <Form className="space-y-5">
                {/* Image Upload Section - Like HomeSliderCard */}
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Service Image (Max 5MB)
                  </Label>

                  {/* File Upload Card */}
                  <div 
                    className={`
                      relative border-2 border-dashed rounded-xl transition-all duration-200
                      ${!previewImage 
                        ? 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800' 
                        : 'border-transparent bg-gray-50 dark:bg-gray-800/50'
                      }
                      ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
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
                      <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <ImageIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            Click to upload
                          </span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          PNG, JPG, GIF (max 5MB)
                        </p>
                        
                        {isEdit && existingImageUrl && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                              <span>📷</span>
                              Current image will be kept if no new image is selected
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Image Preview */}
                          <div className="relative group flex-shrink-0">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-24 h-24 object-cover rounded-lg shadow-md"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveImage()
                                }}
                                disabled={submitting}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Image Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2 truncate">
                              {formData.image_file?.name || 'Existing image'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                              {formData.image_file 
                                ? `${(formData.image_file.size / 1024).toFixed(1)} KB`
                                : 'Current image will be replaced'
                              }
                            </p>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={handleRemoveImage}
                              disabled={submitting}
                              className="text-xs"
                            >
                              <X className="mr-1 h-3 w-3" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Storage Info */}
                  <div className="mt-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="text-blue-500">●</span>
                      {STORAGE_TYPE === "bucket" 
                        ? "Images are stored in secure cloud storage bucket for optimal performance"
                        : "Images are compressed and stored in database as Base64"
                      }
                    </p>
                  </div>
                </div>

                {/* Heading Field */}
                <div>
                  <Label htmlFor="heading" className="text-sm font-medium">
                    Heading <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="heading"
                    name="heading"
                    placeholder="Enter heading (e.g., Premium Hosting)"
                    className={`mt-1.5 ${errors.heading && touched.heading ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="heading"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe the service detail in detail..."
                    className={`mt-1.5 w-full rounded-md border p-3 text-sm ${
                      errors.description && touched.description 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {values.description.length}/500 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Service Group Dropdown */}
                  <div>
                    <Label className="text-sm font-medium">
                      Service Group <span className="text-red-500">*</span>
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between mt-1.5 bg-white dark:bg-gray-950"
                        >
                          {selectedServiceGroup 
                            ? getServiceGroupName(selectedServiceGroup) 
                            : "Select service group"}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full min-w-[200px]">
                        {serviceGroups.map((group) => (
                          <DropdownMenuItem
                            key={group.id}
                            onClick={() => {
                              setFieldValue('service_group_id', group.id)
                              setSelectedServiceGroup(group.id)
                              setFieldValue('service_id', '')
                              setSelectedService('')
                            }}
                            className="cursor-pointer"
                          >
                            {group.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <input
                      type="hidden"
                      name="service_group_id"
                      value={values.service_group_id}
                    />
                    <ErrorMessage
                      name="service_group_id"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  {/* Service Dropdown */}
                  <div>
                    <Label className="text-sm font-medium">
                      Service <span className="text-red-500">*</span>
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between mt-1.5 bg-white dark:bg-gray-950"
                          disabled={!selectedServiceGroup}
                        >
                          {selectedService 
                            ? getServiceName(selectedService) 
                            : filteredServices.length > 0
                              ? "Select service"
                              : "No services available"}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full min-w-[200px]">
                        {filteredServices.map((service) => (
                          <DropdownMenuItem
                            key={service.id}
                            onClick={() => {
                              setFieldValue('service_id', service.id)
                              setSelectedService(service.id)
                            }}
                            className="cursor-pointer"
                          >
                            {service.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <input
                      type="hidden"
                      name="service_id"
                      value={values.service_id}
                    />
                    <ErrorMessage
                      name="service_id"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                    {!selectedServiceGroup && (
                      <p className="mt-1 text-xs text-gray-500">
                        Please select a service group first
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter className="mt-6 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false)
                      resetForm()
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedServiceGroup || !selectedService}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white min-w-[100px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </div>
                    ) : (
                      isEdit ? 'Update' : 'Create'
                    )}
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

export default ServiceDetailFourManagement