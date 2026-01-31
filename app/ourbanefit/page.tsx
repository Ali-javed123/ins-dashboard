// app/components/our-benefits-section.tsx
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
import { Plus, Trash, Pen, X, Loader2, Image as ImageIcon, Upload, Check } from "lucide-react"

// Constants
const MAIN_BUCKET_NAME = process.env.NEXT_PUBLIC_OUR_BENEFITS_BUCKET || "ourBenefits"
const FEATURE_BUCKET_NAME = process.env.NEXT_PUBLIC_OUR_BENEFITS_FEATURE_BUCKET || "banefitlist"
const STORAGE_TYPE: 'bucket' | 'base64' = "bucket"
const CHUNK_SIZE = 60000
const DELIMITER = '|||CHUNK|||'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

// Strict Type Definitions
interface Feature {
  title: string
  para: string
  image: File | null | string
  icon: string
}

interface FeatureList {
  title: string
  icon: string
}

interface DatabaseFeature {
  title: string
  para: string
  image: string | null
  icon: string
}

interface DatabaseOurBenefits {
  id: string
  title: string
  heading: string
  subHeading: string  // New field
  btnText: string     // New field
  image: string | null
  features: DatabaseFeature[] | null
  featurelist: FeatureList[] | null
  created_at?: string
}

interface OurBenefits {
  id: string
  title: string
  heading: string
  subHeading: string  // New field
  btnText: string     // New field
  image: string | null 
  features: Feature[]
  featurelist: FeatureList[]
  mainImageUrl: string | null
}

interface OurBenefitsFormValues {
  title: string
  heading: string
  subHeading: string  // New field
  btnText: string     // New field
  features: Feature[]
  featurelist: FeatureList[]
}

interface ImagePreview {
  url: string
  type: 'new' | 'existing'
  field?: 'main' | `feature_${number}`
}

interface FeatureImagePreview {
  url: string
  type: 'new' | 'existing'
  index: number
}

// Error Types
interface FeatureError {
  title?: string
  para?: string
  image?: string
  icon?: string
}

interface FeatureListError {
  title?: string
  icon?: string
}

interface FormikErrorType {
  title?: string
  heading?: string
  subHeading?: string  // New field
  btnText?: string     // New field
  features?: string | FeatureError[]
  featurelist?: string | FeatureListError[]
}

const OurBenefitsSection: FC = () => {
  // State
  const [benefits, setBenefits] = useState<OurBenefits[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [mainImagePreview, setMainImagePreview] = useState<ImagePreview | null>(null)
  const [featureImagePreviews, setFeatureImagePreviews] = useState<FeatureImagePreview[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [editInitialValues, setEditInitialValues] = useState<OurBenefitsFormValues | null>(null)

  const mainFileInputRef = useRef<HTMLInputElement>(null)
  const featureFileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initial Form Values for Create
  const initialValues: OurBenefitsFormValues = {
    title: "",
    heading: "",
    subHeading: "",  // New field
    btnText: "",     // New field
    features: [
      { title: "", para: "", image: null, icon: "" },
      { title: "", para: "", image: null, icon: "" }
    ],
    featurelist: [
      { title: "", icon: "" },
      { title: "", icon: "" }
    ]
  }

  // Validation Schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .required('Title is required'),
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .required('Heading is required'),
    subHeading: Yup.string()  // New field validation
      .min(2, 'Sub-heading must be at least 2 characters')
      .required('Sub-heading is required'),
    btnText: Yup.string()     // New field validation
      .min(2, 'Button text must be at least 2 characters')
      .required('Button text is required'),
    features: Yup.array().of(
      Yup.object().shape({
        title: Yup.string()
          .min(2, 'Feature title is required')
          .required('Title is required'),
        para: Yup.string()
          .min(10, 'Feature description must be at least 10 characters')
          .required('Description is required'),
        image: Yup.mixed().test(
          'image-validation',
          'Image is required',
          function(value) {
            if (isEdit && typeof value === 'string') return true
            if (value instanceof File) return true
            return false
          }
        ),
        icon: Yup.string()
          .min(2, 'Icon class is required')
          .required('Icon is required')
      })
    ).min(1, 'At least one feature is required').required('Features are required'),
    featurelist: Yup.array().of(
      Yup.object().shape({
        title: Yup.string()
          .min(2, 'List item title is required')
          .required('Title is required'),
        icon: Yup.string()
          .min(2, 'Icon class is required')
          .required('Icon is required')
      })
    ).min(1, 'At least one list item is required').required('Feature list is required')
  })

  // Reset Form
  const resetForm = (): void => {
    setEditId(null)
    setEditInitialValues(null)
    setMainImagePreview(null)
    setFeatureImagePreviews([])
    setIsEdit(false)
    setSubmitting(false)
    
    if (mainFileInputRef.current) {
      mainFileInputRef.current.value = ""
    }
    featureFileInputRefs.current.forEach(ref => {
      if (ref) ref.value = ""
    })
  }

  // Fetch Benefits
  const fetchBenefits = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setFetchError(null)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from("ourBenefits")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching benefits:", error)
        setFetchError(error.message || 'Failed to fetch data')
        return
      }

      const processedBenefits: OurBenefits[] = (data || []).map(convertToOurBenefits)
      setBenefits(processedBenefits)
    } catch (error) {
      console.error("Unexpected error:", error)
      setFetchError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBenefits()
  }, [fetchBenefits])

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

  // Image Processing
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
        return new Promise<string>((resolveCompress, rejectCompress) => {
          const img = new Image()
          const canvas = document.createElement('canvas')

          img.onload = (): void => {
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

  // Convert Database to Component Type
  const convertToOurBenefits = (dbSection: DatabaseOurBenefits): OurBenefits => {
    const processedFeatures: Feature[] = (dbSection.features || []).map((feature: DatabaseFeature): Feature => {
      let imageValue: File | null | string = null;
      
      if (STORAGE_TYPE === "bucket") {
        imageValue = typeof feature.image === 'string' ? feature.image : null;
      } else {
        imageValue = feature.image ? reconstructFromChunks(feature.image) : null;
      }
      
      return {
        title: feature.title,
        para: feature.para,
        icon: feature.icon,
        image: imageValue
      };
    });

    return {
      id: dbSection.id,
      title: dbSection.title || "",
      heading: dbSection.heading || "",
      subHeading: dbSection.subHeading || "",  // New field
      btnText: dbSection.btnText || "",       // New field
      image: null,
      features: processedFeatures,
      featurelist: dbSection.featurelist || [],
      mainImageUrl: STORAGE_TYPE === "bucket" ? dbSection.image : null
    };
  }

  // Image Upload Functions
  const generateFileName = (prefix: string, file: File): string => {
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    return `${prefix}_${timestamp}.${extension}`
  }

  const uploadToBucket = async (file: File, bucketName: string, sectionId?: string): Promise<string> => {
    try {
      const prefix = sectionId ? `benefit_${sectionId}` : 'feature'
      const fileName = generateFileName(prefix, file)
      
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error(`Error uploading to bucket ${bucketName}:`, error)
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  const deleteFromBucket = async (imageUrl: string | null, bucketName: string): Promise<void> => {
    try {
      if (!imageUrl) return
      
      const fileName = imageUrl.split('/').pop()
      if (!fileName) return

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName])

      if (error) {
        console.error(`Error deleting from bucket ${bucketName}:`, error)
      }
    } catch (error) {
      console.error("Delete from bucket failed:", error)
    }
  }

  // Handle Main Image Change
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`)
        return
      }

      const previewUrl = URL.createObjectURL(file)
      setMainImagePreview({
        url: previewUrl,
        type: 'new',
        field: 'main'
      })
    }
  }

  // Handle Feature Image Change - Updated to work with Formik
  const handleFeatureImageChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    index: number, 
    setFieldValue: (field: string, value: File | null | string, shouldValidate?: boolean) => void
  ): void => {
    const file = e.target.files?.[0]
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        alert(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`)
        return
      }

      // Update Formik values directly
      setFieldValue(`features.${index}.image`, file)

      const previewUrl = URL.createObjectURL(file)
      setFeatureImagePreviews(prev => [
        ...prev.filter(p => p.index !== index),
        { url: previewUrl, type: 'new', index }
      ])
    }
  }

  // Handle Remove Main Image
  const handleRemoveMainImage = (): void => {
    setMainImagePreview(null)
    if (mainFileInputRef.current) {
      mainFileInputRef.current.value = ""
    }
  }

  // Handle Remove Feature Image
  const handleRemoveFeatureImage = (index: number, setFieldValue: (field: string, value: File | null | string, shouldValidate?: boolean) => void): void => {
    setFieldValue(`features.${index}.image`, null)
    
    const preview = featureImagePreviews.find(p => p.index === index)
    if (preview?.type === 'new') {
      URL.revokeObjectURL(preview.url)
    }
    
    setFeatureImagePreviews(prev => prev.filter(p => p.index !== index))
    if (featureFileInputRefs.current[index]) {
      featureFileInputRefs.current[index]!.value = ""
    }
  }

  // Cleanup preview URLs
  useEffect(() => {
    return (): void => {
      if (mainImagePreview?.type === 'new') {
        URL.revokeObjectURL(mainImagePreview.url)
      }
      featureImagePreviews.forEach(preview => {
        if (preview.type === 'new') {
          URL.revokeObjectURL(preview.url)
        }
      })
    }
  }, [mainImagePreview, featureImagePreviews])

  // Handle Edit
  const handleEdit = (benefit: OurBenefits): void => {
    setIsEdit(true)
    setEditId(benefit.id)
    
    // Prepare edit initial values
    const editValues: OurBenefitsFormValues = {
      title: benefit.title,
      heading: benefit.heading,
      subHeading: benefit.subHeading,  // New field
      btnText: benefit.btnText,        // New field
      features: benefit.features.map(feature => ({
        title: feature.title,
        para: feature.para,
        icon: feature.icon,
        image: feature.image || null
      })),
      featurelist: benefit.featurelist
    }
    
    // Store edit values for Formik
    setEditInitialValues(editValues)
    
    // Set main image preview
    if (benefit.mainImageUrl) {
      setMainImagePreview({
        url: benefit.mainImageUrl,
        type: 'existing',
        field: 'main'
      })
    }
    
    // Set feature image previews
    const featurePreviews: FeatureImagePreview[] = benefit.features
      .map((feature, index): FeatureImagePreview | null => {
        if (feature.image && typeof feature.image === 'string') {
          return {
            url: feature.image,
            type: 'existing',
            index
          }
        }
        return null
      })
      .filter((preview): preview is FeatureImagePreview => preview !== null)
    
    setFeatureImagePreviews(featurePreviews)
    setOpen(true)
  }

  // Get current form values based on edit mode
  const getCurrentInitialValues = (): OurBenefitsFormValues => {
    if (isEdit && editInitialValues) {
      return editInitialValues
    }
    return initialValues
  }

  // Handle Submit (Create)
  const handleSubmit = async (
    values: OurBenefitsFormValues,
    formikHelpers: FormikHelpers<OurBenefitsFormValues>
  ): Promise<void> => {
    if (submitting) return

    try {
      setSubmitting(true)

      let mainImageData: string | null = null
      const featureImagesData: (string | null)[] = []

      // Process main image
      if (mainImagePreview?.type === 'new') {
        const fileInput = mainFileInputRef.current
        if (fileInput?.files?.[0]) {
          if (STORAGE_TYPE === "bucket") {
            // Will upload after section creation
          } else {
            try {
              const base64Image = await convertImageToBase64(fileInput.files[0])
              mainImageData = splitIntoChunks(base64Image)
            } catch (convertError) {
              console.error("Main image base64 conversion failed:", convertError)
            }
          }
        }
      }

      // Process feature images
      for (let i = 0; i < values.features.length; i++) {
        const feature = values.features[i]
        const preview = featureImagePreviews.find(p => p.index === i)
        
        if (preview?.type === 'new') {
          const fileInput = featureFileInputRefs.current[i]
          if (fileInput?.files?.[0]) {
            if (STORAGE_TYPE === "bucket") {
              // Will upload after section creation
              featureImagesData.push(null)
            } else {
              try {
                const base64Image = await convertImageToBase64(fileInput.files[0])
                featureImagesData.push(splitIntoChunks(base64Image))
              } catch (convertError) {
                console.error(`Feature image ${i} base64 conversion failed:`, convertError)
                featureImagesData.push(null)
              }
            }
          } else {
            featureImagesData.push(null)
          }
        } else if (typeof feature.image === 'string') {
          // Existing image
          featureImagesData.push(feature.image)
        } else {
          featureImagesData.push(null)
        }
      }

      // Create section first
      const { data: sectionData, error: sectionError } = await supabase
        .from("ourBenefits")
        .insert([
          {
            title: values.title,
            heading: values.heading,
            subHeading: values.subHeading,  // New field
            btnText: values.btnText,        // New field
            image: STORAGE_TYPE === "bucket" ? null : mainImageData,
            features: values.features.map((feature: Feature, index: number): DatabaseFeature => ({
              title: feature.title,
              para: feature.para,
              icon: feature.icon,
              image: featureImagesData[index]
            })),
            featurelist: values.featurelist
          }
        ])
        .select()
        .single()

      if (sectionError) {
        console.error("Error adding benefit section:", sectionError)
        alert(`Error: ${sectionError.message}`)
        return
      }

      // For bucket storage, upload images after getting section ID
      if (STORAGE_TYPE === "bucket") {
        // Upload main image
        if (mainImagePreview?.type === 'new') {
          const fileInput = mainFileInputRef.current
          if (fileInput?.files?.[0]) {
            try {
              const mainImageUrl = await uploadToBucket(fileInput.files[0], MAIN_BUCKET_NAME, sectionData.id)
              mainImageData = mainImageUrl

              // Update section with main image URL
              const { error: updateError } = await supabase
                .from("ourBenefits")
                .update({ 
                  image: mainImageUrl
                })
                .eq("id", sectionData.id)

              if (updateError) {
                console.error("Error updating section with main image:", updateError)
              }
            } catch (error) {
              console.error("Failed to upload main image:", error)
            }
          }
        }

        // Upload feature images
        const updatedFeatures = [...values.features]
        for (let i = 0; i < values.features.length; i++) {
          const preview = featureImagePreviews.find(p => p.index === i)
          if (preview?.type === 'new') {
            const fileInput = featureFileInputRefs.current[i]
            if (fileInput?.files?.[0]) {
              try {
                const featureImageUrl = await uploadToBucket(fileInput.files[0], FEATURE_BUCKET_NAME, sectionData.id)
                featureImagesData[i] = featureImageUrl
                updatedFeatures[i] = {
                  ...updatedFeatures[i],
                  image: featureImageUrl
                }
              } catch (error) {
                console.error(`Failed to upload feature image ${i}:`, error)
              }
            }
          }
        }

        // Update section with feature image URLs
        if (updatedFeatures.some((f, i) => f.image !== values.features[i].image)) {
          const { error: updateError } = await supabase
            .from("ourBenefits")
            .update({ 
              features: updatedFeatures.map((feature: Feature, index: number): DatabaseFeature => ({
                title: feature.title,
                para: feature.para,
                icon: feature.icon,
                image: featureImagesData[index]
              }))
            })
            .eq("id", sectionData.id)

          if (updateError) {
            console.error("Error updating section with feature images:", updateError)
          }
        }
      }

      // Create new benefit object
      const newBenefit: OurBenefits = {
        id: sectionData.id,
        title: sectionData.title || "",
        heading: sectionData.heading || "",
        subHeading: sectionData.subHeading || "",  // New field
        btnText: sectionData.btnText || "",       // New field
        image: STORAGE_TYPE === "bucket" ? null : reconstructFromChunks(mainImageData),
        features: ((sectionData.features as DatabaseFeature[]) || []).map((feature: DatabaseFeature, index: number): Feature => ({
          title: feature.title,
          para: feature.para,
          icon: feature.icon,
          image: STORAGE_TYPE === "bucket" 
            ? feature.image 
            : reconstructFromChunks(feature.image)
        })),
        featurelist: sectionData.featurelist || [],
        mainImageUrl: STORAGE_TYPE === "bucket" ? mainImageData : null
      }

      // Update state
      setBenefits(prev => {
        const exists = prev.some(b => b.id === newBenefit.id)
        if (exists) {
          return prev.map(b => b.id === newBenefit.id ? newBenefit : b)
        }
        return [...prev, newBenefit]
      })

      resetForm()
      formikHelpers.resetForm()
      setOpen(false)
      fetchBenefits()
    } catch (error) {
      console.error("Error saving benefit section:", error)
      if (error instanceof Error) {
        alert(`Error: ${error.message}`)
      } else {
        alert("Error saving benefit section")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Update
  const handleUpdate = async (
    values: OurBenefitsFormValues,
    formikHelpers: FormikHelpers<OurBenefitsFormValues>
  ): Promise<void> => {
    if (!editId || submitting) return

    try {
      setSubmitting(true)

      // Get existing benefit data
      const existingBenefit = benefits.find(b => b.id === editId)
      let mainImageData: string | null = null
      
      if (existingBenefit) {
        mainImageData = STORAGE_TYPE === "bucket" 
          ? existingBenefit.mainImageUrl 
          : existingBenefit.image
      }

      // Handle main image updates
      if (mainImagePreview?.type === 'new') {
        const fileInput = mainFileInputRef.current
        if (fileInput?.files?.[0]) {
          if (STORAGE_TYPE === "bucket") {
            // Delete old main image if exists
            if (existingBenefit?.mainImageUrl) {
              await deleteFromBucket(existingBenefit.mainImageUrl, MAIN_BUCKET_NAME)
            }
            // Upload new main image
            mainImageData = await uploadToBucket(fileInput.files[0], MAIN_BUCKET_NAME, editId)
          } else {
            // Convert to Base64 and chunk
            try {
              const base64Image = await convertImageToBase64(fileInput.files[0])
              mainImageData = splitIntoChunks(base64Image)
            } catch (convertError) {
              console.error("Main image base64 conversion failed:", convertError)
              // Keep existing image data
              mainImageData = existingBenefit?.image || null
            }
          }
        }
      } else if (!mainImagePreview && existingBenefit) {
        // Keep existing main image data
        mainImageData = existingBenefit.image || existingBenefit.mainImageUrl || null
      }

      // Handle feature images updates
      const updatedFeatures = [...values.features]
      for (let i = 0; i < values.features.length; i++) {
        const feature = values.features[i]
        const preview = featureImagePreviews.find(p => p.index === i)
        const existingImage = existingBenefit?.features[i]?.image

        if (preview?.type === 'new') {
          const fileInput = featureFileInputRefs.current[i]
          if (fileInput?.files?.[0]) {
            if (STORAGE_TYPE === "bucket") {
              // Delete old feature image if exists
              if (existingImage && typeof existingImage === 'string') {
                await deleteFromBucket(existingImage, FEATURE_BUCKET_NAME)
              }
              // Upload new feature image
              try {
                const featureImageUrl = await uploadToBucket(fileInput.files[0], FEATURE_BUCKET_NAME, editId)
                updatedFeatures[i] = {
                  ...updatedFeatures[i],
                  image: featureImageUrl
                }
              } catch (error) {
                console.error(`Failed to upload feature image ${i}:`, error)
                // Keep existing image
                updatedFeatures[i] = {
                  ...updatedFeatures[i],
                  image: existingImage || null
                }
              }
            } else {
              // Convert to Base64 and chunk
              try {
                const base64Image = await convertImageToBase64(fileInput.files[0])
                updatedFeatures[i] = {
                  ...updatedFeatures[i],
                  image: splitIntoChunks(base64Image)
                }
              } catch (convertError) {
                console.error(`Feature image ${i} base64 conversion failed:`, convertError)
                // Keep existing image
                updatedFeatures[i] = {
                  ...updatedFeatures[i],
                  image: existingImage || null
                }
              }
            }
          }
        } else if (!preview && typeof feature.image === 'string') {
          // Keep existing image
          updatedFeatures[i] = {
            ...updatedFeatures[i],
            image: feature.image || existingImage || null
          }
        }
      }

      // Update section in database
      const updateData = {
        title: values.title,
        heading: values.heading,
        subHeading: values.subHeading,  // New field
        btnText: values.btnText,        // New field
        image: mainImageData,
        features: updatedFeatures.map((feature: Feature, index: number): DatabaseFeature => ({
          title: feature.title,
          para: feature.para,
          icon: feature.icon,
          image: typeof feature.image === 'string' ? feature.image : null
        })),
        featurelist: values.featurelist
      }

      const { data, error } = await supabase
        .from("ourBenefits")
        .update(updateData)
        .eq("id", editId)
        .select()
        .single()

      if (error) {
        console.error("Error updating benefit section:", error)
        alert(`Error: ${error.message}`)
        return
      }

      // Convert to component type and update state
      const updatedBenefit: OurBenefits = convertToOurBenefits(data)
      setBenefits(prev => prev.map(b => b.id === editId ? updatedBenefit : b))

      resetForm()
      formikHelpers.resetForm()
      setOpen(false)
      fetchBenefits()
    } catch (error) {
      console.error("Error updating benefit section:", error)
      if (error instanceof Error) {
        alert(`Error: ${error.message}`)
      } else {
        alert("Error updating benefit section")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete
  const handleDeleteBenefit = async (id: string): Promise<void> => {
    if (!window.confirm("Delete this benefit section?")) return

    try {
      // Handle image deletion based on storage type
      const benefitToDelete = benefits.find(b => b.id === id)
      
      if (STORAGE_TYPE === "bucket") {
        // Delete main image from bucket
        if (benefitToDelete?.mainImageUrl) {
          await deleteFromBucket(benefitToDelete.mainImageUrl, MAIN_BUCKET_NAME)
        }
        
        // Delete feature images from bucket
        if (benefitToDelete?.features) {
          for (const feature of benefitToDelete.features) {
            if (feature.image && typeof feature.image === 'string') {
              await deleteFromBucket(feature.image, FEATURE_BUCKET_NAME)
            }
          }
        }
      }

      // Delete from database
      const { error } = await supabase.from("ourBenefits").delete().eq("id", id)

      if (error) {
        console.error("Error deleting benefit section:", error)
        alert(`Error: ${error.message}`)
        return
      }

      // Update state
      setBenefits(prev => prev.filter(b => b.id !== id))
    } catch (error) {
      console.error("Error deleting benefit section:", error)
      alert("Error deleting benefit section. Please try again.")
    }
  }

  // Helper functions
  const getMainImageUrl = (benefit: OurBenefits): string | null => {
    return STORAGE_TYPE === "bucket" ? benefit.mainImageUrl : benefit.image
  }

  const getSafeImageUrl = (
    dynamicSrc: string | null, 
    fallbackSrc: string
  ): string => {
    if (dynamicSrc && dynamicSrc.trim() !== "") {
      return dynamicSrc
    }
    
    return fallbackSrc
  }

  const hasError = (
    errors: FormikErrorType,
    fieldName: keyof OurBenefitsFormValues | keyof Feature | keyof FeatureList,
    index?: number,
    subField?: 'features' | 'featurelist'
  ): boolean => {
    if (index !== undefined && subField) {
      const fieldErrors = errors[subField]
      if (Array.isArray(fieldErrors) && fieldErrors[index]) {
        const error = fieldErrors[index] as FeatureError | FeatureListError
        const fieldNameKey = fieldName as keyof (FeatureError | FeatureListError)
        return !!error[fieldNameKey]
      }
      return false
    }
    
    const fieldNameKey = fieldName as keyof OurBenefitsFormValues
    return !!errors[fieldNameKey]
  }

  const getErrorMessage = (
    errors: FormikErrorType,
    index: number,
    fieldName: keyof Feature | keyof FeatureList,
    subField: 'features' | 'featurelist'
  ): string | undefined => {
    const fieldErrors = errors[subField]
    if (Array.isArray(fieldErrors) && fieldErrors[index]) {
      const error = fieldErrors[index] as FeatureError | FeatureListError
      const fieldNameKey = fieldName as keyof (FeatureError | FeatureListError)
      return error[fieldNameKey]
    }
    return undefined
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading benefits...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full space-y-6">
        <div className=" mx-auto px-2 py-8">
          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Our Benefits Sections</h1>
            <Button onClick={() => setOpen(true)}>
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
                onClick={() => fetchBenefits()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Display existing benefits or empty state */}
          {benefits.length === 0 ? (
            <div className="text-center py-12 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No benefit sections found</p>
              <Button onClick={() => setOpen(true)}>
                Create First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={benefit.id} className="overflow-hidden">
                  <div className="flex justify-between items-center p-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {benefit.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">{benefit.heading}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {benefit.subHeading} {/* New field display */}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                        Button Text: {benefit.btnText} {/* New field display */}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(benefit)}
                      >
                        <Pen className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className='shadow-lg'
                        onClick={() => handleDeleteBenefit(benefit.id)}
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
                    
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                      <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <Check className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {benefit.title}
                      </h1>
                      <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        {benefit.heading}
                      </p>
                      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-4">
                        {benefit.subHeading} {/* New field display */}
                      </p>
                      <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    {/* Button Display */}
                    <div className="flex justify-center mb-8">
                      <Button className="px-8 py-3 text-lg">
                        {benefit.btnText} {/* New field display */}
                      </Button>
                    </div>

                    {/* Main Image Display */}
                    {(benefit.mainImageUrl || benefit.image) && (
                      <div className="mb-8 flex justify-center">
                        <div className="relative w-full max-w-2xl">
                          <img 
                            src={getSafeImageUrl(
                              getMainImageUrl(benefit), 
                              "/assets/images/placeholder.jpg"
                            )} 
                            alt={benefit.title} 
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
                        {benefit.features.map((feature, idx) => (
                          <div 
                            key={idx}
                            className="p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-blue-50 dark:bg-blue-900/20"
                          >
                            <div className="flex items-start space-x-4">
                              {feature.image && (
                                <div className="mt-1 flex-shrink-0">
                                  <img 
                                    src={getSafeImageUrl(
                                      feature.image as string,
                                      "/assets/images/placeholder.jpg"
                                    )}
                                    alt={feature.title}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div 
                                    dangerouslySetInnerHTML={{
                                      __html: `<i class="${feature.icon} text-xl text-blue-600 dark:text-blue-400"></i>`
                                    }}
                                  />
                                  <h3 className="font-bold text-xl">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">{feature.para}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feature List */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">Benefits List</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {benefit.featurelist.map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center p-4 rounded-lg border bg-gray-50 dark:bg-gray-900"
                          >
                            <div 
                              dangerouslySetInnerHTML={{
                                __html: `<i class="${item.icon} text-xl mr-3 text-blue-600 dark:text-blue-400"></i>`
                              }}
                            />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog for Create/Edit */}
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-2xl font-bold">
                {isEdit ? "Edit Benefits Section" : "Create Benefits Section"}
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(90vh-140px)]">
              <Formik
                initialValues={getCurrentInitialValues()}
                validationSchema={validationSchema}
                onSubmit={isEdit ? handleUpdate : handleSubmit}
                enableReinitialize={true}
              >
                {({ 
                  values, 
                  errors, 
                  touched, 
                  isSubmitting, 
                  setFieldValue,
                  isValid 
                }: FormikProps<OurBenefitsFormValues>) => {
                  const formikErrors: FormikErrorType = errors as unknown as FormikErrorType
                  
                  return (
                    <Form id="ourBenefitsForm" className="space-y-6 pb-4">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="title" className="mb-2 block font-medium">
                            Title *
                          </Label>
                          <Field
                            as={Input}
                            id="title"
                            name="title"
                            placeholder="Our Benefits"
                            className={`${hasError(formikErrors, 'title') && touched.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-sm text-red-600 mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="heading" className="mb-2 block font-medium">
                            Heading *
                          </Label>
                          <Field
                            as={Input}
                            id="heading"
                            name="heading"
                            placeholder="Why Choose Our Services?"
                            className={`${hasError(formikErrors, 'heading') && touched.heading ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          <ErrorMessage
                            name="heading"
                            component="div"
                            className="text-sm text-red-600 mt-1"
                          />
                        </div>

                        {/* New: SubHeading Field */}
                        <div>
                          <Label htmlFor="subHeading" className="mb-2 block font-medium">
                            Sub-Heading *
                          </Label>
                          <Field
                            as={Input}
                            id="subHeading"
                            name="subHeading"
                            placeholder="Discover our amazing benefits"
                            className={`${hasError(formikErrors, 'subHeading') && touched.subHeading ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          <ErrorMessage
                            name="subHeading"
                            component="div"
                            className="text-sm text-red-600 mt-1"
                          />
                        </div>

                        {/* New: BtnText Field */}
                        <div>
                          <Label htmlFor="btnText" className="mb-2 block font-medium">
                            Button Text *
                          </Label>
                          <Field
                            as={Input}
                            id="btnText"
                            name="btnText"
                            placeholder="Get Started"
                            className={`${hasError(formikErrors, 'btnText') && touched.btnText ? 'border-red-500 focus:ring-red-500' : ''}`}
                          />
                          <ErrorMessage
                            name="btnText"
                            component="div"
                            className="text-sm text-red-600 mt-1"
                          />
                        </div>
                      </div>

                      {/* Main Image Upload */}
                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-lg mb-4">Main Image (Bucket: {MAIN_BUCKET_NAME})</h3>
                        <div className="space-y-3">
                          <div className="
                            border-2 border-dashed border-gray-300 dark:border-gray-700
                            rounded-lg p-4 
                            hover:border-gray-400 dark:hover:border-gray-600
                            transition-colors
                          ">
                            <input
                              type="file"
                              ref={mainFileInputRef}
                              onChange={handleMainImageChange}
                              accept="image/*"
                              className="hidden"
                              disabled={submitting}
                              id="main-image-upload"
                            />
                            
                            {mainImagePreview ? (
                              <div className="text-center space-y-3">
                                <img
                                  src={mainImagePreview.url}
                                  alt="Main Preview"
                                  className="mx-auto max-h-48 rounded-lg object-contain"
                                />
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => mainFileInputRef.current?.click()}
                                    disabled={submitting}
                                  >
                                    Change Image
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleRemoveMainImage}
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
                                  onClick={() => mainFileInputRef.current?.click()}
                                  className="w-full py-8 border-dashed"
                                  disabled={submitting}
                                >
                                  <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                    <span className="font-medium">Upload Main Image</span>
                                    <span className="text-xs text-gray-500">Max 5MB</span>
                                  </div>
                                </Button>
                              </div>
                            )}
                            
                            {isEdit && !mainImagePreview && (
                              <div className="mt-2 text-center text-xs text-gray-500">
                                Leave empty to keep existing image
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Features Section */}
                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg">Features * (Bucket: {FEATURE_BUCKET_NAME})</h3>
                          <FieldArray name="features">
                            {({ push }: FieldArrayRenderProps) => (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push({ title: "", para: "", image: null, icon: "" })}
                                disabled={submitting}
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
                              {values.features.map((feature, index) => {
                                const featurePreview = featureImagePreviews.find(p => p.index === index)
                                return (
                                  <div key={index} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                                    <div className="flex justify-between items-center mb-4">
                                      <h4 className="font-medium text-gray-900 dark:text-white">Feature {index + 1}</h4>
                                      {values.features.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            remove(index)
                                            handleRemoveFeatureImage(index, setFieldValue)
                                          }}
                                          disabled={submitting}
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      {/* Left Column: Text Fields */}
                                      <div className="space-y-4">
                                        <div>
                                          <Label htmlFor={`features.${index}.title`} className="mb-2 block font-medium">
                                            Title *
                                          </Label>
                                          <Field
                                            as={Input}
                                            id={`features.${index}.title`}
                                            name={`features.${index}.title`}
                                            placeholder="Feature Title"
                                            className={`${getErrorMessage(formikErrors, index, 'title', 'features') ? 'border-red-500 focus:ring-red-500' : ''}`}
                                          />
                                          <ErrorMessage
                                            name={`features.${index}.title`}
                                            component="div"
                                            className="text-sm text-red-600 mt-1"
                                          />
                                        </div>
                                        
                                        <div>
                                          <Label htmlFor={`features.${index}.icon`} className="mb-2 block font-medium">
                                            Icon Class (Font Awesome) *
                                          </Label>
                                          <Field
                                            as={Input}
                                            id={`features.${index}.icon`}
                                            name={`features.${index}.icon`}
                                            placeholder="fas fa-check"
                                            className={`${getErrorMessage(formikErrors, index, 'icon', 'features') ? 'border-red-500 focus:ring-red-500' : ''}`}
                                          />
                                          <ErrorMessage
                                            name={`features.${index}.icon`}
                                            component="div"
                                            className="text-sm text-red-600 mt-1"
                                          />
                                          <div className="text-xs text-gray-500 mt-1">
                                            Example: fas fa-check, fab fa-react
                                          </div>
                                          
                                          {/* Icon Preview */}
                                          <div className="mt-3 flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Icon Preview:</span>
                                            <div 
                                              dangerouslySetInnerHTML={{
                                                __html: `<i class="${feature.icon || 'fas fa-question'} text-lg"></i>`
                                              }}
                                            />
                                            <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                              {feature.icon || 'No icon selected'}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <Label htmlFor={`features.${index}.para`} className="mb-2 block font-medium">
                                            Description *
                                          </Label>
                                          <Field
                                            as="textarea"
                                            id={`features.${index}.para`}
                                            name={`features.${index}.para`}
                                            rows={3}
                                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                              getErrorMessage(formikErrors, index, 'para', 'features') 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : ''
                                            }`}
                                            placeholder="Feature description..."
                                          />
                                          <ErrorMessage
                                            name={`features.${index}.para`}
                                            component="div"
                                            className="text-sm text-red-600 mt-1"
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Right Column: Image Upload */}
                                      <div>
                                        <Label className="mb-2 block font-medium">
                                          Feature Image *
                                        </Label>
                                        <div className="
                                          border-2 border-dashed border-gray-300 dark:border-gray-700
                                          rounded-lg p-4 
                                          hover:border-gray-400 dark:hover:border-gray-600
                                          transition-colors h-full
                                        ">
                                          <input
                                            type="file"
                                            ref={(el: HTMLInputElement | null): void => {
                                              featureFileInputRefs.current[index] = el;
                                            }}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFeatureImageChange(e, index, setFieldValue)}
                                            accept="image/*"
                                            className="hidden"
                                            disabled={submitting}
                                            id={`feature-image-${index}`}
                                          />
                                          
                                          {featurePreview ? (
                                            <div className="text-center space-y-3">
                                              <img
                                                src={featurePreview.url}
                                                alt={`Feature ${index + 1} Preview`}
                                                className="mx-auto max-h-48 rounded-lg object-contain"
                                              />
                                              <div className="flex gap-2 justify-center">
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => featureFileInputRefs.current[index]?.click()}
                                                  disabled={submitting}
                                                >
                                                  Change Image
                                                </Button>
                                                <Button
                                                  type="button"
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() => handleRemoveFeatureImage(index, setFieldValue)}
                                                  disabled={submitting}
                                                >
                                                  Remove
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="text-center h-full flex flex-col justify-center">
                                              <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => featureFileInputRefs.current[index]?.click()}
                                                className="w-full py-12 border-dashed"
                                                disabled={submitting}
                                              >
                                                <div className="flex flex-col items-center gap-2">
                                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                                  <span className="font-medium">Upload Feature Image</span>
                                                  <span className="text-xs text-gray-500">Max 5MB</span>
                                                </div>
                                              </Button>
                                              {isEdit && typeof feature.image === 'string' && (
                                                <div className="mt-2 text-xs text-gray-500">
                                                  Existing image will be kept
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        {getErrorMessage(formikErrors, index, 'image', 'features') && (
                                          <div className="text-sm text-red-600 mt-1">
                                            {getErrorMessage(formikErrors, index, 'image', 'features')}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                              
                              {typeof errors.features === 'string' && (
                                <div className="text-sm text-red-600 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                  {errors.features}
                                </div>
                              )}
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      {/* Feature List Section */}
                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg">Feature List *</h3>
                          <FieldArray name="featurelist">
                            {({ push }: FieldArrayRenderProps) => (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push({ title: "", icon: "" })}
                                disabled={submitting}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add List Item
                              </Button>
                            )}
                          </FieldArray>
                        </div>
                        
                        <FieldArray name="featurelist">
                          {({ push, remove }: FieldArrayRenderProps) => (
                            <div className="space-y-4">
                              {values.featurelist.map((item, index) => (
                                <div key={index} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                                  <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white">List Item {index + 1}</h4>
                                    {values.featurelist.length > 1 && (
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
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor={`featurelist.${index}.title`} className="mb-2 block font-medium">
                                        Title *
                                      </Label>
                                      <Field
                                        as={Input}
                                        id={`featurelist.${index}.title`}
                                        name={`featurelist.${index}.title`}
                                        placeholder="List Item Title"
                                        className={`${getErrorMessage(formikErrors, index, 'title', 'featurelist') ? 'border-red-500 focus:ring-red-500' : ''}`}
                                      />
                                      <ErrorMessage
                                        name={`featurelist.${index}.title`}
                                        component="div"
                                        className="text-sm text-red-600 mt-1"
                                      />
                                    </div>
                                    
                                    <div>
                                      <Label htmlFor={`featurelist.${index}.icon`} className="mb-2 block font-medium">
                                        Icon Class (Font Awesome) *
                                      </Label>
                                      <Field
                                        as={Input}
                                        id={`featurelist.${index}.icon`}
                                        name={`featurelist.${index}.icon`}
                                        placeholder="fas fa-check"
                                        className={`${getErrorMessage(formikErrors, index, 'icon', 'featurelist') ? 'border-red-500 focus:ring-red-500' : ''}`}
                                      />
                                      <ErrorMessage
                                        name={`featurelist.${index}.icon`}
                                        component="div"
                                        className="text-sm text-red-600 mt-1"
                                      />
                                      <div className="text-xs text-gray-500 mt-1">
                                        Example: fas fa-check, fab fa-react
                                      </div>
                                      
                                      {/* Icon Preview */}
                                      <div className="mt-3 flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Icon Preview:</span>
                                        <div 
                                          dangerouslySetInnerHTML={{
                                            __html: `<i class="${item.icon || 'fas fa-question'} text-lg"></i>`
                                          }}
                                        />
                                        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                          {item.icon || 'No icon selected'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {typeof errors.featurelist === 'string' && (
                                <div className="text-sm text-red-600 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                  {errors.featurelist}
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
                          form="ourBenefitsForm"
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

export default OurBenefitsSection