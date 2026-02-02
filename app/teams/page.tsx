// components/TeamManagement.tsx
'use client'

import { FC, useCallback, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
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
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Label } from '@/components/ui/label'
import { Pen, Trash, Plus, X, Upload, Check, AlertCircle, MoreVertical, Edit3 } from "lucide-react"
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Interfaces
interface TeamFormValues {
  title: string
  heading: string
}

interface DatabaseTeam {
  id: string;
  title: string;
  heading: string;
  image: string | null;
  created_at?: string;
}

interface Team {
  id: string;
  title: string;
  heading: string;
  image: string | null;
  imageUrl?: string | null;
  created_at?: string;

}

interface FormData {
  title: string;
  heading: string;
  image: File | null;
}

// Constants
const BUCKET_NAME = "teams";
const STORAGE_TYPE = "bucket";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const TeamManagement: FC = () => {
  // States
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form Data State
  const [formData, setFormData] = useState<FormData>({
    title: "",
    heading: "",
    image: null,
  })

  // Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title must be less than 100 characters')
      .required('Title is required'),
    heading: Yup.string()
      .min(10, 'Heading must be at least 10 characters')
      .max(500, 'Heading must be less than 500 characters')
      .required('Heading is required'),
  })

  // Initial Values for Formik
  const initialValues: TeamFormValues = {
    title: formData.title || '',
    heading: formData.heading || '',
  }

  // Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      heading: "",
      image: null
    })
    setEditId(null)
    setPreviewImage(null)
    setIsEdit(false)
    setOpen(false)
    setSubmitting(false)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Fetch Teams
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching teams:", error)
        throw error
      }

      const processedTeams = (data || []).map((dbTeam: DatabaseTeam) => ({
        id: dbTeam.id,
        title: dbTeam.title,
        heading: dbTeam.heading,
        image: dbTeam.image,
        imageUrl: STORAGE_TYPE === "bucket" ? dbTeam.image : null
      }))

      setTeams(processedTeams)
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  // Generate File Name
  const generateFileName = (teamId: string, file: File): string => {
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    return `${teamId}_${timestamp}.${extension}`
  }

  // Upload to Bucket
  const uploadToBucket = async (file: File, teamId: string): Promise<string> => {
    try {
      const fileName = generateFileName(teamId, file)
      
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

  // Delete from Bucket
  const deleteFromBucket = async (imageUrl: string | null): Promise<void> => {
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

  // Convert Image to Base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`))
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }

  // Handle Image Change
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

      setFormData(prev => ({ ...prev, image: file }))
      
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
    }
  }

  // Cleanup Preview URL
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  // Handle Remove Image
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }))
    setPreviewImage(null)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle Edit
  const handleEdit = (team: Team) => {
    setIsEdit(true)
    setEditId(team.id)
    setFormData({
      title: team.title,
      heading: team.heading,
      image: null,
    })
    
    setPreviewImage(team.image || null)
    setOpen(true)
  }

  // Handle Create
  const handleCreate = () => {
    resetForm()
    setIsEdit(false)
    setOpen(true)
  }

  // Handle Delete Confirmation
  const handleDeleteConfirm = (id: string) => {
    setTeamToDelete(id)
    setDeleteConfirmOpen(true)
  }

  // Handle Delete
  const handleDelete = async () => {
    if (!teamToDelete) return

    try {
      // Find team to delete
      const teamToDeleteData = teams.find(t => t.id === teamToDelete)
      
      // Delete image from bucket if exists
      if (teamToDeleteData?.image && STORAGE_TYPE === "bucket") {
        await deleteFromBucket(teamToDeleteData.image)
      }

      // Delete from database
      const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamToDelete)

      if (error) {
        console.error("Error deleting team:", error)
        alert(`Error: ${error.message}`)
        return
      }

      // Update state
      setTeams(prev => prev.filter(t => t.id !== teamToDelete))
      setDeleteConfirmOpen(false)
      setTeamToDelete(null)
      
    } catch (error) {
      console.error("Error deleting team:", error)
      alert("Error deleting team. Please try again.")
    }
  }

  // Handle Form Submit (Create/Update)
  const handleSubmit = async (
    values: TeamFormValues,
    formikHelpers: FormikHelpers<TeamFormValues>
  ) => {
    if (submitting) return

    try {
      setSubmitting(true)

      let imageUrl: string | null = null

      // Process image
      if (formData.image) {
        if (STORAGE_TYPE === "bucket") {
          imageUrl = await uploadToBucket(formData.image, editId || crypto.randomUUID())
        } else {
          imageUrl = await convertImageToBase64(formData.image)
        }
      }

      if (isEdit && editId) {
        // Get old image for deletion if new image uploaded
        const oldTeam = teams.find(t => t.id === editId)
        if (oldTeam?.image && formData.image && STORAGE_TYPE === "bucket") {
          await deleteFromBucket(oldTeam.image)
        }

        // Update existing team
        const { data, error } = await supabase
          .from("teams")
          .update({
            title: values.title,
            heading: values.heading,
            image: imageUrl || oldTeam?.image || null,
          })
          .eq("id", editId)
          .select()
          .single()

        if (error) throw error

        // Update state
        setTeams(prev => prev.map(t => 
          t.id === editId ? { 
            ...data, 
            imageUrl: STORAGE_TYPE === "bucket" ? data.image : null 
          } : t
        ))

      } else {
        // Create new team
        const { data, error } = await supabase
          .from("teams")
          .insert([{
            title: values.title,
            heading: values.heading,
            image: imageUrl,
          }])
          .select()
          .single()

        if (error) throw error

        // Add to state
        const newTeam: Team = {
          ...data,
          imageUrl: STORAGE_TYPE === "bucket" ? data.image : null
        }
        setTeams(prev => [...prev, newTeam])
      }

      resetForm()
      formikHelpers.resetForm()
      
    } catch (error) {
      console.error("Error saving team:", error)
      if (error instanceof Error) {
        alert(`Error: ${error.message}`)
      } else {
        alert("Error saving team. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Get Image URL
  const getImageUrl = (team: Team): string => {
    if (team.image) {
      return team.image
    }
    return '/assets/images/team/team-1-1.jpg' // Default fallback image
  }

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background))] p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40`}>
              <div className="h-full rounded-2xl bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background))] backdrop-blur-xl p-6 shadow-lg">
                <div className="relative mb-6">
                  <Skeleton className="absolute -inset-4 rounded-2xl" />
                  <Skeleton className="relative rounded-xl aspect-square border-2 border-white/20" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background))] p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Meet Our <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Expert Team</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Passionate professionals dedicated to delivering exceptional results
        </p>
        
        {/* Add Team Button */}
        <Button
          onClick={handleCreate}
          className="gap-2 group"
          size="lg"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Add New Team Member
        </Button>
      </div>
      
      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl border-gray-300 dark:border-gray-700 max-w-2xl mx-auto">
          <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <AlertCircle className="w-12 h-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Team Members Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Get started by adding your first team member. Click the button above to begin.
          </p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus size={20} />
            Create First Team Member
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-1 sm:gap-3">
            {teams?.map((team, index) => (
              <div
                key={team.id}
                className={`group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500`}
              >
                {/* Inner card with glass morphism effect */}
                <div className="h-full rounded-2xl bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background))] backdrop-blur-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500">
                  
                  {/* Image container with gradient border */}
                  <div className="relative mb-6">
                    {/* Gradient border effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                    
                    {/* Image wrapper */}
                    <div className="relative overflow-hidden rounded-xl aspect-square border-2 border-white/20">
                      <Image
                        src={getImageUrl(team)}
                        alt={team.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Image overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Action buttons overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(team)
                          }}
                        >
                          <Edit3 size={14} />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConfirm(team.id)
                          }}
                        >
                          <Trash size={14} />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    {/* Floating accent dot */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-white/30 group-hover:scale-125  transition-transform duration-300" />
                    
                    {/* More options dropdown */}
                    <div className="absolute  -top-2 -left-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => handleEdit(team)}>
                            <Pen className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteConfirm(team.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="space-y-3">
                    {/* Name with elegant gradient effect */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {team.title}
                      <span className="block w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 mt-2"></span>
                    </h3>
                    
                    {/* Title/Description with subtle styling */}
                    <div className="relative">
                      <p className="text-gray-600 dark:text-gray-300 font-medium text-sm pl-2 border-l-2 border-blue-400/50 line-clamp-3">
                        {team.heading}
                      </p>
                    </div>
                  </div>

                  {/* Quick info footer */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>Member #{index + 1}</span>
                      <span>
                        {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Card (Always visible) */}
            {/* <div
              className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-gray-300/40 via-gray-400/40 to-gray-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500 cursor-pointer"
              onClick={handleCreate}
            >
              <div className="h-full rounded-2xl bg-[hsl(var(--color-background))] dark:bg-[hsl(var(--color-background))] backdrop-blur-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                  <Plus className="w-10 h-10 text-blue-500 group-hover:text-cyan-500 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Add New Member
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                  Click to add a new team member to your team
                </p>
              </div>
            </div> */}
          </div>
          
          {/* Stats */}
          {/* <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {teams.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Team Members
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {teams.filter(t => t.image).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  With Images
                </div>
              </div>
            </div>
          </div> */}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isEdit ? 'Edit Team Member' : 'Add New Team Member'}
            </DialogTitle>
          </DialogHeader>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-base font-medium">
                    Name/Title *
                  </Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="e.g., John Doe"
                    className={`mt-2 text-lg ${errors.title && touched.title ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                {/* Heading/Description */}
                <div>
                  <Label htmlFor="heading" className="text-base font-medium">
                    Description/Role *
                  </Label>
                  <Field
                    as={Input}
                    id="heading"
                    name="heading"
                    placeholder="e.g., Senior Developer with 5+ years experience in React and Node.js..."
                    rows={4}
                    className={`mt-2 resize-none ${errors.heading && touched.heading ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage
                    name="heading"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                {/* Image Upload - Enhanced */}
                <div>
                  <Label className="text-base font-medium block mb-3">
                    Profile Image
                  </Label>
                  
                  <div 
                    className={`relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400
                      ${previewImage ? 'border-transparent' : 'border-gray-300 dark:border-gray-600'}
                      ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => !submitting && fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={submitting}
                    />
                    
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-3 right-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveImage()
                          }}
                        >
                          <X size={20} />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                          <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Click to upload
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        {isEdit && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                            Leave empty to keep existing image
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        {isEdit ? 'Update Team Member' : 'Add Team Member'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Are you sure you want to delete this team member?
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  This action cannot be undone. All data including the profile image will be permanently removed.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              // variant="destructive"
              onClick={handleDelete}
              className="flex-1 gap-2"
            >
              <Trash size={16} />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TeamManagement