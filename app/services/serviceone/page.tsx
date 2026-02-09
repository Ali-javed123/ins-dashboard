// 'use client'

// import { FC, useState, useEffect, useCallback } from 'react'
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
// import { Textarea } from '@/components/ui/textarea'
// import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
// import * as Yup from 'yup'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// // Types based on your table structure
// interface ServiceGroup {
//   id: string;
//   title: string;  // Changed from 'name' to 'title'
//   description?: string;
//   created_at: string;
//   slug: string;
// }

// interface Service {
//   id: string;
//   title: string;  // Changed from 'name' to 'title'
//   description?: string;
//   created_at: string;
//   slug: string;
//   service_group_id: string;
//   icon: string;
//   image: string | null;
// }

// interface ServiceDetailOne {
//   id: string;
//   created_at: string;
//   icon: string;
//   heading: string;
//   des: string;
//   service_id: string; // Foreign key to service_detail_one_group.id
// }

// interface ServiceDetailOneGroup {
//   id: string;
//   created_at: string;
//   heading: string;
//   des: string;
//   service_group_id: string;
//   service_id: string; // Foreign key to services.id
//   service_groups?: ServiceGroup;
//   services?: Service;
//   service_detail_ones: ServiceDetailOne[];
// }

// // Form Values Types
// interface ServiceDetailOneFormValues {
//   icon: string;
//   heading: string;
//   des: string;
// }

// interface ServiceDetailOneGroupFormValues {
//   heading: string;
//   des: string;
//   service_group_id: string;
//   service_id: string;
//   service_detail_ones: ServiceDetailOneFormValues[];
// }

// const ServiceDetailManager: FC = () => {
//   // State
//   const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])
//   const [services, setServices] = useState<Service[]>([])
//   const [serviceDetailOneGroups, setServiceDetailOneGroups] = useState<ServiceDetailOneGroup[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isEdit, setIsEdit] = useState(false)
//   const [editId, setEditId] = useState<string | null>(null)
//   const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
//   const [open, setOpen] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [initialFormValues, setInitialFormValues] = useState<ServiceDetailOneGroupFormValues>({
//     heading: '',
//     des: '',
//     service_group_id: '',
//     service_id: '',
//     service_detail_ones: [{
//       icon: '',
//       heading: '',
//       des: ''
//     }]
//   })

//   // Fetch Service Groups and Services - UPDATED
//   const fetchServiceGroups = useCallback(async () => {
//     try {
//       const { data, error } = await supabase
//         .from('service_groups')
//         .select('id, title, slug, created_at')  // Changed from 'name' to 'title'
//         .order('created_at', { ascending: false })

//       if (error) {
//         console.error('Service Groups Error:', error)
//         setError(`Service Groups Error: ${error.message}`)
//         return
//       }
//       console.log('Service Groups Data:', data)
//       setServiceGroups(data || [])
//     } catch (error) {
//       console.error('Error fetching service groups:', error)
//       setError('Failed to load service groups')
//     }
//   }, [])

//   const fetchServices = useCallback(async () => {
//     try {
//       const { data, error } = await supabase
//         .from('services')
//         .select('id, title, slug, created_at, service_group_id, icon, image')  // Changed from 'name' to 'title'
//         .order('created_at', { ascending: false })

//       if (error) {
//         console.error('Services Error:', error)
//         setError(`Services Error: ${error.message}`)
//         return
//       }
//       console.log('Services Data:', data)
//       setServices(data || [])
//     } catch (error) {
//       console.error('Error fetching services:', error)
//       setError('Failed to load services')
//     }
//   }, [])

//   // Fetch Service Detail One Groups
//   const fetchServiceDetailOneGroups = useCallback(async () => {
//     try {
//       console.log('Fetching service detail groups...')
      
//       // First fetch groups
//       const { data: groups, error: groupsError } = await supabase
//         .from('service_detail_one_group')
//         .select('*')
//         .order('created_at', { ascending: false })

//       console.log('Groups raw data:', groups)

//       if (groupsError) {
//         console.error('Groups fetch error:', groupsError)
//         setError(`Groups fetch error: ${groupsError.message}`)
//         return
//       }

//       if (!groups || groups.length === 0) {
//         console.log('No groups found')
//         setServiceDetailOneGroups([])
//         return
//       }

//       // Fetch related data for each group
//       const groupsWithDetails = await Promise.all(
//         groups.map(async (group) => {
//           try {
//             // Fetch service_group
//             let serviceGroupData: ServiceGroup | undefined;
//             try {
//               const { data } = await supabase
//                 .from('service_groups')
//                 .select('*')
//                 .eq('id', group.service_group_id)
//                 .single()
//               serviceGroupData = data || undefined;
//             } catch (err) {
//               console.log(`Service group ${group.service_group_id} not found`)
//             }

//             // Fetch service
//             let serviceData: Service | undefined;
//             try {
//               const { data } = await supabase
//                 .from('services')
//                 .select('*')
//                 .eq('id', group.service_id)
//                 .single()
//               serviceData = data || undefined;
//             } catch (err) {
//               console.log(`Service ${group.service_id} not found`)
//             }

//             // Fetch service detail ones (children)
//             const { data: details } = await supabase
//               .from('service_detail_one')
//               .select('*')
//               .eq('service_id', group.id)  // Note: service_id in child table references parent's id
//               .order('created_at', { ascending: true })

//             return {
//               ...group,
//               service_groups: serviceGroupData,
//               services: serviceData,
//               service_detail_ones: details || []
//             }
//           } catch (error) {
//             console.error(`Error fetching details for group ${group.id}:`, error)
//             return {
//               ...group,
//               service_groups: undefined,
//               services: undefined,
//               service_detail_ones: []
//             }
//           }
//         })
//       )

//       console.log('Processed groups:', groupsWithDetails)
//       setServiceDetailOneGroups(groupsWithDetails)
//       setError(null)
//     } catch (error) {
//       console.error('Error fetching service detail groups:', error)
//       setError('Failed to load service detail groups.')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   // Initial fetch
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true)
//       setError(null)
//       try {
//         await fetchServiceGroups()
//         await fetchServices()
//         await fetchServiceDetailOneGroups()
//       } catch (error) {
//         console.error('Error loading data:', error)
//         setError('Failed to load data. Please check console for details.')
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadData()
//   }, [fetchServiceGroups, fetchServices, fetchServiceDetailOneGroups])

//   // Form Validation Schema
//   const serviceDetailOneValidationSchema = Yup.object({
//     icon: Yup.string().required('Icon is required'),
//     heading: Yup.string()
//       .min(2, 'Heading must be at least 2 characters')
//       .max(100, 'Heading must be less than 100 characters')
//       .required('Heading is required'),
//     des: Yup.string()
//       .min(10, 'Description must be at least 10 characters')
//       .max(500, 'Description must be less than 500 characters')
//       .required('Description is required'),
//   })

//   const validationSchema = Yup.object({
//     heading: Yup.string()
//       .min(2, 'Heading must be at least 2 characters')
//       .max(100, 'Heading must be less than 100 characters')
//       .required('Heading is required'),
//     des: Yup.string()
//       .min(10, 'Description must be at least 10 characters')
//       .max(1000, 'Description must be less than 1000 characters')
//       .required('Description is required'),
//     service_group_id: Yup.string().required('Service group is required'),
//     service_id: Yup.string().required('Service is required'),
//     service_detail_ones: Yup.array()
//       .of(serviceDetailOneValidationSchema)
//       .min(1, 'At least one service detail is required')
//       .required('Service details are required'),
//   })

//   // Reset Form
//   const resetForm = () => {
//     setIsEdit(false)
//     setEditId(null)
//     setInitialFormValues({
//       heading: '',
//       des: '',
//       service_group_id: '',
//       service_id: '',
//       service_detail_ones: [{
//         icon: '',
//         heading: '',
//         des: ''
//       }]
//     })
//     setOpen(false)
//   }

//   // Handle Edit
//   const handleEdit = (group: ServiceDetailOneGroup) => {
//     setIsEdit(true)
//     setEditId(group.id)
    
//     const formValues: ServiceDetailOneGroupFormValues = {
//       heading: group.heading,
//       des: group.des,
//       service_group_id: group.service_group_id,
//       service_id: group.service_id,
//       service_detail_ones: group.service_detail_ones.map(detail => ({
//         icon: detail.icon,
//         heading: detail.heading,
//         des: detail.des
//       }))
//     }

//     setInitialFormValues(formValues)
//     setOpen(true)
//   }

//   // Toggle expanded group
//   const toggleGroup = (groupId: string) => {
//     setExpandedGroups(prev => {
//       const newSet = new Set(prev)
//       if (newSet.has(groupId)) {
//         newSet.delete(groupId)
//       } else {
//         newSet.add(groupId)
//       }
//       return newSet
//     })
//   }

//   // Get service group name - UPDATED
//   const getServiceGroupName = (serviceGroupId: string): string => {
//     const group = serviceGroups.find(g => g.id === serviceGroupId)
//     return group?.title || 'Unknown Group'  // Changed from 'name' to 'title'
//   }

//   // Get service name - UPDATED
//   const getServiceName = (serviceId: string): string => {
//     const service = services.find(s => s.id === serviceId)
//     return service?.title || 'Unknown Service'  // Changed from 'name' to 'title'
//   }

//   // Handle Submit (Create)
//   const handleSubmit = async (values: ServiceDetailOneGroupFormValues) => {
//     try {
//       setLoading(true)
      
//       // Create the parent group first
//       const { data: groupData, error: groupError } = await supabase
//         .from('service_detail_one_group')
//         .insert([{
//           heading: values.heading,
//           des: values.des,
//           service_group_id: values.service_group_id,
//           service_id: values.service_id
//         }])
//         .select()
//         .single()

//       if (groupError) {
//         console.error('Group creation error:', groupError)
//         throw new Error(`Failed to create group: ${groupError.message}`)
//       }

//       // Create child details with correct foreign key reference
//       const serviceDetailOnes = values.service_detail_ones.map((detail, index) => ({
//         icon: detail.icon,
//         heading: detail.heading,
//         des: detail.des,
//         service_id: groupData.id,
//         // order_index: index
//       }))

//       const { error: detailsError } = await supabase
//         .from('service_detail_one')
//         .insert(serviceDetailOnes)

//       if (detailsError) {
//         console.error('Details creation error:', detailsError)
//         throw new Error(`Failed to create details: ${detailsError.message}`)
//       }

//       // Refresh data
//       await fetchServiceDetailOneGroups()
//       resetForm()
      
//       alert('Service detail group created successfully!')
//     } catch (error) {
//       console.error('Error creating service detail group:', error)
//       alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Handle Update
//   const handleUpdate = async (values: ServiceDetailOneGroupFormValues) => {
//     if (!editId) return

//     try {
//       setLoading(true)
      
//       // Update parent group
//       const { error: groupError } = await supabase
//         .from('service_detail_one_group')
//         .update({
//           heading: values.heading,
//           des: values.des,
//           service_group_id: values.service_group_id,
//           service_id: values.service_id
//         })
//         .eq('id', editId)

//       if (groupError) {
//         console.error('Group update error:', groupError)
//         throw new Error(`Failed to update group: ${groupError.message}`)
//       }

//       // Delete existing child details
//       const { error: deleteError } = await supabase
//         .from('service_detail_one')
//         .delete()
//         .eq('service_id', editId)

//       if (deleteError) {
//         console.error('Delete details error:', deleteError)
//         throw new Error(`Failed to delete details: ${deleteError.message}`)
//       }

//       // Insert updated child details
//       const serviceDetailOnes = values.service_detail_ones.map((detail, index) => ({
//         icon: detail.icon,
//         heading: detail.heading,
//         des: detail.des,
//         service_id: editId,
//         // order_index: index
//       }))

//       const { error: detailsError } = await supabase
//         .from('service_detail_one')
//         .insert(serviceDetailOnes)

//       if (detailsError) {
//         console.error('Details insert error:', detailsError)
//         throw new Error(`Failed to insert details: ${detailsError.message}`)
//       }

//       // Refresh data
//       await fetchServiceDetailOneGroups()
//       resetForm()
      
//       alert('Service detail group updated successfully!')
//     } catch (error) {
//       console.error('Error updating service detail group:', error)
//       alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Handle Delete Group
//   const handleDeleteGroup = async (groupId: string) => {
//     if (!confirm('Are you sure you want to delete this group and all its details?')) return

//     try {
//       setLoading(true)
      
//       // Delete child details first
//       const { error: detailsError } = await supabase
//         .from('service_detail_one')
//         .delete()
//         .eq('service_id', groupId)

//       if (detailsError) {
//         console.error('Delete child details error:', detailsError)
//         throw new Error(`Failed to delete child details: ${detailsError.message}`)
//       }

//       // Delete parent group
//       const { error: groupError } = await supabase
//         .from('service_detail_one_group')
//         .delete()
//         .eq('id', groupId)

//       if (groupError) {
//         console.error('Delete group error:', groupError)
//         throw new Error(`Failed to delete group: ${groupError.message}`)
//       }

//       // Refresh data
//       await fetchServiceDetailOneGroups()
      
//       alert('Service detail group deleted successfully!')
//     } catch (error) {
//       console.error('Error deleting service detail group:', error)
//       alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Handle Delete Detail
//   const handleDeleteDetail = async (detailId: string) => {
//     if (!confirm('Are you sure you want to delete this detail?')) return

//     try {
//       setLoading(true)
      
//       const { error } = await supabase
//         .from('service_detail_one')
//         .delete()
//         .eq('id', detailId)

//       if (error) {
//         console.error('Delete detail error:', error)
//         throw new Error(`Failed to delete detail: ${error.message}`)
//       }

//       // Refresh data
//       await fetchServiceDetailOneGroups()
      
//       alert('Service detail deleted successfully!')
//     } catch (error) {
//       console.error('Error deleting service detail:', error)
//       alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading service details...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Service Detail Manager</h1>
//           <p className="text-muted-foreground mt-2">
//             Manage service detail groups and their individual details
//           </p>
//         </div>
//         <Button onClick={() => setOpen(true)} disabled={loading}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Service Detail Group
//         </Button>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {/* Service Detail Groups List */}
//       <div className="space-y-4">
//         {serviceDetailOneGroups.length === 0 ? (
//           <div className="text-center py-12 border-2 border-dashed rounded-lg">
//             <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold">No service detail groups found</h3>
//             <p className="text-muted-foreground mt-2 mb-4">
//               Create your first service detail group to get started
//             </p>
//             <Button onClick={() => setOpen(true)}>
//               <Plus className="w-4 h-4 mr-2" />
//               Create First Group
//             </Button>
//           </div>
//         ) : (
//           serviceDetailOneGroups.map((group) => (
//             <Collapsible
//               key={group.id}
//               open={expandedGroups.has(group.id)}
//               onOpenChange={() => toggleGroup(group.id)}
//               className="border rounded-lg overflow-hidden bg-card"
//             >
//               <div className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <CollapsibleTrigger asChild>
//                       <Button variant="ghost" size="sm">
//                         {expandedGroups.has(group.id) ? (
//                           <ChevronUp className="h-4 w-4" />
//                         ) : (
//                           <ChevronDown className="h-4 w-4" />
//                         )}
//                       </Button>
//                     </CollapsibleTrigger>
//                     <div>
//                       <h3 className="font-semibold text-lg">{group.heading}</h3>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Badge variant="secondary">
//                           Group: {getServiceGroupName(group.service_group_id)}
//                         </Badge>
//                         <Badge variant="outline">
//                           Service: {getServiceName(group.service_id)}
//                         </Badge>
//                         <Badge variant="secondary">
//                           {group.service_detail_ones.length} details
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       // variant="outline"
//                       // size="sm"
//                       onClick={() => handleEdit(group)}
//                       disabled={loading}
//                     >
//                       <Edit className="h-4 w-4 mr-2" />
//                       Edit
//                     </Button>
//                     <Button
//                       variant="error"
//                       // size="sm"
//                       onClick={() => handleDeleteGroup(group.id)}
//                       disabled={loading}
//                     >
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <CollapsibleContent>
//                 <div className="border-t p-6 bg-muted/30">
//                   <div className="mb-6">
//                     <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
//                     <p className="text-sm">{group.des}</p>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <h4 className="text-sm font-medium text-muted-foreground">Service Details</h4>
//                     {group.service_detail_ones.length === 0 ? (
//                       <div className="text-center py-8 border rounded-lg bg-background">
//                         <p className="text-muted-foreground">No details added yet</p>
//                       </div>
//                     ) : (
//               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

//                         {group.service_detail_ones.map((detail) => (
//                           // <div
//                           //   key={detail.id}
//                           //   className="border flex-col rounded-lg p-4 bg-background hover:shadow-md transition-shadow"
//                           // >
//                           //   <div className="flex items-start justify-between">
//                           //     <div className="flex items-start gap-3">
//                           //       <div className="text-2xl mt-1">{detail.icon}</div>
//                           //       <div>
//                           //         <h4 className="font-medium">{detail.heading}</h4>
//                           //         <p className="text-sm text-muted-foreground mt-2">
//                           //           {detail.des}
//                           //         </p>
//                           //       </div>
//                           //     </div>
//                           //     <Button
//                           //       variant="ghost"
//                           //       size="sm"
//                           //       onClick={() => handleDeleteDetail(detail.id)}
//                           //       disabled={loading}
//                           //     >
//                           //       <Trash2 className="h-4 w-4 text-destructive" />
//                           //     </Button>
//                           //   </div>
//                           // </div>


//                           <div
//                     key={detail.id}
//                     className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500"
//                   >
//                     <div className="h-full rounded-2xl p-3 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-xl shadow-lg dark:shadow-lg hover:shadow-2xl transition-all">
//                       {/* Service Image */}
                      

//                       {/* Icon */}
//                       <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
//                         <div
//                           dangerouslySetInnerHTML={{
//                             __html: `<i class="${detail.icon} text-2xl"></i>`
//                           }}
//                           className="flex items-center justify-center w-full h-full"
//                         />
//                       </div>

//                       {/* Content */}
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                         {detail.heading}
//                       </h3>

//                       <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//                          {detail.des}
//                       </p>

//                       {/* Actions */}
//                       <div className="mt-5 flex gap-2">
//                         <Button
//                           variant="update"
//                           size="sm"
//                           onClick={() => handleEdit(group)}
//                           className="flex-1"
//                         >
//                           <Edit className="mr-2 h-3 w-3" />
//                           Edit
//                         </Button>
                        
//                         <Button
//                           variant="error"
//                           size="sm"
//                           onClick={() => handleDeleteDetail(detail.id)}
//                           className="flex-1"
//                         >
//                           <Trash2 className="mr-2 h-3 w-3" />
//                           Delete
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </CollapsibleContent>
//             </Collapsible>
//           ))
//         )}
//       </div>

//       {/* Create/Edit Modal */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {isEdit ? 'Edit Service Detail Group' : 'Create Service Detail Group'}
//             </DialogTitle>
//             <DialogDescription>
//               {isEdit
//                 ? 'Update the service detail group and its individual details.'
//                 : 'Create a new service detail group with multiple individual details.'
//               }
//             </DialogDescription>
//           </DialogHeader>

//           <Formik
//             initialValues={initialFormValues}
//             validationSchema={validationSchema}
//             onSubmit={isEdit ? handleUpdate : handleSubmit}
//             enableReinitialize
//           >
//             {({ values, errors, touched, isSubmitting, setFieldValue }) => (
//               <Form className="space-y-6">
//                 {/* Group Details */}
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Service Group */}
//                     <div>
//                       <Label htmlFor="service_group_id">Service Group *</Label>
//                       <Select
//                         value={values.service_group_id}
//                         onValueChange={(value) => setFieldValue('service_group_id', value)}
//                         disabled={isSubmitting}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a service group" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {serviceGroups.map((group) => (
//                             <SelectItem key={group.id} value={group.id}>
//                               {group.title}  {/* Changed from 'name' to 'title' */}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       {errors.service_group_id && touched.service_group_id && (
//                         <p className="text-sm text-destructive mt-1">
//                           {errors.service_group_id}
//                         </p>
//                       )}
//                     </div>

//                     {/* Service */}
//                     <div>
//                       <Label htmlFor="service_id">Service *</Label>
//                       <Select
//                         value={values.service_id}
//                         onValueChange={(value) => setFieldValue('service_id', value)}
//                         disabled={isSubmitting}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a service" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {services.map((service) => (
//                             <SelectItem key={service.id} value={service.id}>
//                               {service.title}  {/* Changed from 'name' to 'title' */}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       {errors.service_id && touched.service_id && (
//                         <p className="text-sm text-destructive mt-1">
//                           {errors.service_id}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Group Heading */}
//                   <div>
//                     <Label htmlFor="heading">Group Heading *</Label>
//                     <Field
//                       as={Input}
//                       id="heading"
//                       name="heading"
//                       placeholder="Enter group heading"
//                       disabled={isSubmitting}
//                       className={errors.heading && touched.heading ? 'border-destructive' : ''}
//                     />
//                     <ErrorMessage
//                       name="heading"
//                       component="div"
//                       className="text-sm text-destructive mt-1"
//                     />
//                   </div>

//                   {/* Group Description */}
//                   <div>
//                     <Label htmlFor="des">Group Description *</Label>
//                     <Field
//                       as={Textarea}
//                       id="des"
//                       name="des"
//                       placeholder="Enter group description"
//                       rows={3}
//                       disabled={isSubmitting}
//                       className={errors.des && touched.des ? 'border-destructive' : ''}
//                     />
//                     <ErrorMessage
//                       name="des"
//                       component="div"
//                       className="text-sm text-destructive mt-1"
//                     />
//                   </div>
//                 </div>

//                 {/* Service Details Array */}
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <Label>Service Details *</Label>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setFieldValue('service_detail_ones', [
//                         ...values.service_detail_ones,
//                         { icon: '', heading: '', des: '' }
//                       ])}
//                       disabled={isSubmitting}
//                     >
//                       <Plus className="h-4 w-4 mr-2" />
//                       Add Detail
//                     </Button>
//                   </div>

//                   <FieldArray name="service_detail_ones">
//                     {({ push, remove }) => (
//                       <div className="space-y-4">
//                         {values.service_detail_ones.map((_, index) => (
//                           <div key={index} className="border rounded-lg p-4 space-y-3">
//                             <div className="flex items-center justify-between">
//                               <h4 className="font-medium">Detail #{index + 1}</h4>
//                               {values.service_detail_ones.length > 1 && (
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => remove(index)}
//                                   disabled={isSubmitting}
//                                 >
//                                   <X className="h-4 w-4" />
//                                 </Button>
//                               )}
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                               {/* Icon */}
//                               <div>
//                                 <Label htmlFor={`service_detail_ones.${index}.icon`}>
//                                   Icon *
//                                 </Label>
//                                 <Field
//                                   as={Input}
//                                   id={`service_detail_ones.${index}.icon`}
//                                   name={`service_detail_ones.${index}.icon`}
//                                   placeholder="e.g., ⭐, 🔧, 💡"
//                                   disabled={isSubmitting}
//                                 />
//                                 <ErrorMessage
//                                   name={`service_detail_ones.${index}.icon`}
//                                   component="div"
//                                   className="text-sm text-destructive mt-1"
//                                 />
//                               </div>

//                               {/* Detail Heading */}
//                               <div>
//                                 <Label htmlFor={`service_detail_ones.${index}.heading`}>
//                                   Heading *
//                                 </Label>
//                                 <Field
//                                   as={Input}
//                                   id={`service_detail_ones.${index}.heading`}
//                                   name={`service_detail_ones.${index}.heading`}
//                                   placeholder="Enter detail heading"
//                                   disabled={isSubmitting}
//                                 />
//                                 <ErrorMessage
//                                   name={`service_detail_ones.${index}.heading`}
//                                   component="div"
//                                   className="text-sm text-destructive mt-1"
//                                 />
//                               </div>
//                             </div>

//                             {/* Detail Description */}
//                             <div>
//                               <Label htmlFor={`service_detail_ones.${index}.des`}>
//                                 Description *
//                               </Label>
//                               <Field
//                                 as={Textarea}
//                                 id={`service_detail_ones.${index}.des`}
//                                 name={`service_detail_ones.${index}.des`}
//                                 placeholder="Enter detail description"
//                                 rows={2}
//                                 disabled={isSubmitting}
//                               />
//                               <ErrorMessage
//                                 name={`service_detail_ones.${index}.des`}
//                                 component="div"
//                                 className="text-sm text-destructive mt-1"
//                               />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </FieldArray>

//                   {errors.service_detail_ones && typeof errors.service_detail_ones === 'string' && (
//                     <p className="text-sm text-destructive">{errors.service_detail_ones}</p>
//                   )}
//                 </div>

//                 {/* Form Actions */}
//                 <DialogFooter className="gap-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       resetForm()
//                       setOpen(false)
//                     }}
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         {isEdit ? 'Updating...' : 'Creating...'}
//                       </>
//                     ) : (
//                       <>
//                         <Save className="h-4 w-4 mr-2" />
//                         {isEdit ? 'Update Group' : 'Create Group'}
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
//   )
// }

// export default ServiceDetailManager


'use client'

import { FC, useState, useEffect, useCallback } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, AlertCircle, MoreVertical } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"

// Types based on your table structure
interface ServiceGroup {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  slug: string;
}

interface Service {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  slug: string;
  service_group_id: string;
  icon: string;
  image: string | null;
}

interface ServiceDetailOne {
  id: string;
  created_at: string;
  icon: string;
  heading: string;
  des: string;
  service_id: string; // Foreign key to service_detail_one_group.id
}

interface ServiceDetailOneGroup {
  id: string;
  created_at: string;
  heading: string;
  des: string;
  service_group_id: string;
  service_id: string; // Foreign key to services.id
  service_groups?: ServiceGroup;
  services?: Service;
  service_detail_ones: ServiceDetailOne[];
}

// Form Values Types
interface ServiceDetailOneFormValues {
  icon: string;
  heading: string;
  des: string;
}

interface ServiceDetailOneGroupFormValues {
  heading: string;
  des: string;
  service_group_id: string;
  service_id: string;
  service_detail_ones: ServiceDetailOneFormValues[];
}

// Separate form for ServiceDetailOne
interface ServiceDetailOneCreateFormValues {
  icon: string;
  heading: string;
  des: string;
  service_id: string; // Parent service_detail_one_group id
}

const ServiceDetailManager: FC = () => {
  // State for service_detail_one_group
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [serviceDetailOneGroups, setServiceDetailOneGroups] = useState<ServiceDetailOneGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Separate state for service_detail_one operations
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailEditId, setDetailEditId] = useState<string | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [isDetailEdit, setIsDetailEdit] = useState(false)
  
  // Initial form values
  const [initialFormValues, setInitialFormValues] = useState<ServiceDetailOneGroupFormValues>({
    heading: '',
    des: '',
    service_group_id: '',
    service_id: '',
    service_detail_ones: [{
      icon: '',
      heading: '',
      des: ''
    }]
  })

  // Initial form values for service_detail_one
  const [initialDetailFormValues, setInitialDetailFormValues] = useState<ServiceDetailOneCreateFormValues>({
    icon: '',
    heading: '',
    des: '',
    service_id: ''
  })

  // Fetch Service Groups
  const fetchServiceGroups = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('service_groups')
        .select('id, title, slug, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Service Groups Error:', error)
        setError(`Service Groups Error: ${error.message}`)
        return
      }
      setServiceGroups(data || [])
    } catch (error) {
      console.error('Error fetching service groups:', error)
      setError('Failed to load service groups')
    }
  }, [])

  // Fetch Services
  const fetchServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, slug, created_at, service_group_id, icon, image')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Services Error:', error)
        setError(`Services Error: ${error.message}`)
        return
      }
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setError('Failed to load services')
    }
  }, [])

  // Fetch Service Detail One Groups
  const fetchServiceDetailOneGroups = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch parent groups
      const { data: groups, error: groupsError } = await supabase
        .from('service_detail_one_group')
        .select('*')
        .order('created_at', { ascending: false })

      if (groupsError) throw groupsError

      if (!groups || groups.length === 0) {
        setServiceDetailOneGroups([])
        return
      }

      // Process each group with related data
      const groupsWithDetails = await Promise.all(
        groups.map(async (group) => {
          // Fetch service_group
          const { data: serviceGroup } = await supabase
            .from('service_groups')
            .select('*')
            .eq('id', group.service_group_id)
            .single()

          // Fetch service
          const { data: service } = await supabase
            .from('services')
            .select('*')
            .eq('id', group.service_id)
            .single()

          // Fetch service detail ones (children)
          const { data: details } = await supabase
            .from('service_detail_one')
            .select('*')
            .eq('service_id', group.id)
            .order('created_at', { ascending: true })

          return {
            ...group,
            service_groups: serviceGroup || undefined,
            services: service || undefined,
            service_detail_ones: details || []
          }
        })
      )

      setServiceDetailOneGroups(groupsWithDetails)
      setError(null)
    } catch (error) {
      console.error('Error fetching service detail groups:', error)
      setError('Failed to load service detail groups.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        await fetchServiceGroups()
        await fetchServices()
        await fetchServiceDetailOneGroups()
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load data. Please check console for details.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [fetchServiceGroups, fetchServices, fetchServiceDetailOneGroups])

  // ========== SERVICE_DETAIL_ONE_GROUP FORM VALIDATION ==========
  const serviceDetailOneValidationSchema = Yup.object({
    icon: Yup.string().required('Icon is required'),
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .max(100, 'Heading must be less than 100 characters')
      .required('Heading is required'),
    des: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters')
      .required('Description is required'),
  })

  const validationSchema = Yup.object({
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .max(100, 'Heading must be less than 100 characters')
      .required('Heading is required'),
    des: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must be less than 1000 characters')
      .required('Description is required'),
    service_group_id: Yup.string().required('Service group is required'),
    service_id: Yup.string().required('Service is required'),
    service_detail_ones: Yup.array()
      .of(serviceDetailOneValidationSchema)
      .min(1, 'At least one service detail is required')
      .required('Service details are required'),
  })

  // ========== SERVICE_DETAIL_ONE FORM VALIDATION ==========
  const detailValidationSchema = Yup.object({
    icon: Yup.string().required('Icon is required'),
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .max(100, 'Heading must be less than 100 characters')
      .required('Heading is required'),
    des: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters')
      .required('Description is required'),
    service_id: Yup.string().required('Parent group is required'),
  })

  // ========== RESET FUNCTIONS ==========
  const resetGroupForm = () => {
    setIsEdit(false)
    setEditId(null)
    setInitialFormValues({
      heading: '',
      des: '',
      service_group_id: '',
      service_id: '',
      service_detail_ones: [{
        icon: '',
        heading: '',
        des: ''
      }]
    })
    setOpen(false)
  }

  const resetDetailForm = () => {
    setIsDetailEdit(false)
    setDetailEditId(null)
    setSelectedGroupId(null)
    setInitialDetailFormValues({
      icon: '',
      heading: '',
      des: '',
      service_id: ''
    })
    setDetailOpen(false)
  }

  // ========== HANDLE EDIT FUNCTIONS ==========
  const handleEditGroup = (group: ServiceDetailOneGroup) => {
    setIsEdit(true)
    setEditId(group.id)
    
    const formValues: ServiceDetailOneGroupFormValues = {
      heading: group.heading,
      des: group.des,
      service_group_id: group.service_group_id,
      service_id: group.service_id,
      service_detail_ones: group.service_detail_ones.map(detail => ({
        icon: detail.icon,
        heading: detail.heading,
        des: detail.des
      }))
    }

    setInitialFormValues(formValues)
    setOpen(true)
  }

  const handleEditDetail = (detail: ServiceDetailOne, groupId: string) => {
    setIsDetailEdit(true)
    setDetailEditId(detail.id)
    setSelectedGroupId(groupId)
    
    setInitialDetailFormValues({
      icon: detail.icon,
      heading: detail.heading,
      des: detail.des,
      service_id: groupId // This is the parent group id
    })
    
    setDetailOpen(true)
  }

  // ========== TOGGLE FUNCTIONS ==========
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const getServiceGroupName = (serviceGroupId: string): string => {
    const group = serviceGroups.find(g => g.id === serviceGroupId)
    return group?.title || 'Unknown Group'
  }

  const getServiceName = (serviceId: string): string => {
    const service = services.find(s => s.id === serviceId)
    return service?.title || 'Unknown Service'
  }

  // ========== CRUD FOR SERVICE_DETAIL_ONE_GROUP ==========
  const handleSubmitGroup = async (values: ServiceDetailOneGroupFormValues) => {
    try {
      setLoading(true)
      
      // Create the parent group first
      const { data: groupData, error: groupError } = await supabase
        .from('service_detail_one_group')
        .insert([{
          heading: values.heading,
          des: values.des,
          service_group_id: values.service_group_id,
          service_id: values.service_id
        }])
        .select()
        .single()

      if (groupError) {
        console.error('Group creation error:', groupError)
        throw new Error(`Failed to create group: ${groupError.message}`)
      }

      // Create child details
      const serviceDetailOnes = values.service_detail_ones.map((detail) => ({
        icon: detail.icon,
        heading: detail.heading,
        des: detail.des,
        service_id: groupData.id,
      }))

      const { error: detailsError } = await supabase
        .from('service_detail_one')
        .insert(serviceDetailOnes)

      if (detailsError) {
        console.error('Details creation error:', detailsError)
        throw new Error(`Failed to create details: ${detailsError.message}`)
      }

      // Refresh data
      await fetchServiceDetailOneGroups()
      resetGroupForm()
      
      alert('Service detail group created successfully!')
    } catch (error) {
      console.error('Error creating service detail group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateGroup = async (values: ServiceDetailOneGroupFormValues) => {
    if (!editId) return

    try {
      setLoading(true)
      
      // Update parent group
      const { error: groupError } = await supabase
        .from('service_detail_one_group')
        .update({
          heading: values.heading,
          des: values.des,
          service_group_id: values.service_group_id,
          service_id: values.service_id
        })
        .eq('id', editId)

      if (groupError) {
        console.error('Group update error:', groupError)
        throw new Error(`Failed to update group: ${groupError.message}`)
      }

      // Delete existing child details
      const { error: deleteError } = await supabase
        .from('service_detail_one')
        .delete()
        .eq('service_id', editId)

      if (deleteError) {
        console.error('Delete details error:', deleteError)
        throw new Error(`Failed to delete details: ${deleteError.message}`)
      }

      // Insert updated child details
      const serviceDetailOnes = values.service_detail_ones.map((detail) => ({
        icon: detail.icon,
        heading: detail.heading,
        des: detail.des,
        service_id: editId,
      }))

      const { error: detailsError } = await supabase
        .from('service_detail_one')
        .insert(serviceDetailOnes)

      if (detailsError) {
        console.error('Details insert error:', detailsError)
        throw new Error(`Failed to insert details: ${detailsError.message}`)
      }

      // Refresh data
      await fetchServiceDetailOneGroups()
      resetGroupForm()
      
      alert('Service detail group updated successfully!')
    } catch (error) {
      console.error('Error updating service detail group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group and all its details?')) return

    try {
      setLoading(true)
      
      // Delete child details first
      const { error: detailsError } = await supabase
        .from('service_detail_one')
        .delete()
        .eq('service_id', groupId)

      if (detailsError) {
        console.error('Delete child details error:', detailsError)
        throw new Error(`Failed to delete child details: ${detailsError.message}`)
      }

      // Delete parent group
      const { error: groupError } = await supabase
        .from('service_detail_one_group')
        .delete()
        .eq('id', groupId)

      if (groupError) {
        console.error('Delete group error:', groupError)
        throw new Error(`Failed to delete group: ${groupError.message}`)
      }

      // Refresh data
      await fetchServiceDetailOneGroups()
      
      alert('Service detail group deleted successfully!')
    } catch (error) {
      console.error('Error deleting service detail group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // ========== SEPARATE CRUD FOR SERVICE_DETAIL_ONE ==========
  const handleAddDetail = (groupId: string) => {
    setIsDetailEdit(false)
    setDetailEditId(null)
    setSelectedGroupId(groupId)
    
    setInitialDetailFormValues({
      icon: '',
      heading: '',
      des: '',
      service_id: groupId
    })
    
    setDetailOpen(true)
  }

  const handleSubmitDetail = async (values: ServiceDetailOneCreateFormValues) => {
    try {
      setLoading(true)
      
      // Create service_detail_one
      const { error } = await supabase
        .from('service_detail_one')
        .insert([{
          icon: values.icon,
          heading: values.heading,
          des: values.des,
          service_id: values.service_id // This is the parent group id
        }])

      if (error) {
        console.error('Detail creation error:', error)
        throw new Error(`Failed to create detail: ${error.message}`)
      }

      // Refresh data
      await fetchServiceDetailOneGroups()
      resetDetailForm()
      
      alert('Service detail created successfully!')
    } catch (error) {
      console.error('Error creating service detail:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDetail = async (values: ServiceDetailOneCreateFormValues) => {
    if (!detailEditId) return

    try {
      setLoading(true)
      
      // Update service_detail_one
      const { error } = await supabase
        .from('service_detail_one')
        .update({
          icon: values.icon,
          heading: values.heading,
          des: values.des,
          service_id: values.service_id
        })
        .eq('id', detailEditId)

      if (error) {
        console.error('Detail update error:', error)
        throw new Error(`Failed to update detail: ${error.message}`)
      }

      // Refresh data
      await fetchServiceDetailOneGroups()
      resetDetailForm()
      
      alert('Service detail updated successfully!')
    } catch (error) {
      console.error('Error updating service detail:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle Delete Detail
const handleDeleteDetail = async (detailId: string, groupId?: string) => {
  if (!confirm('Are you sure you want to delete this detail?')) return

  try {
    setLoading(true)
    
    console.log('Deleting detail with ID:', detailId)
    
    // First check if the detail exists
    const { data: existingDetail, error: checkError } = await supabase
      .from('service_detail_one')
      .select('id')
      .eq('id', detailId)
      .single()

    if (checkError) {
      console.error('Detail not found:', checkError)
      throw new Error(`Detail not found: ${checkError.message}`)
    }

    console.log('Found detail to delete:', existingDetail)
    
    // Now delete the detail
    const { error: deleteError } = await supabase
      .from('service_detail_one')
      .delete()
      .eq('id', detailId)

    if (deleteError) {
      console.error('Delete detail error:', deleteError)
      throw new Error(`Failed to delete detail: ${deleteError.message}`)
    }

    console.log('Detail deleted successfully')
    
    // Refresh data - multiple approaches for reliability
    try {
      // Approach 1: Direct refresh
      await fetchServiceDetailOneGroups()
    } catch (refreshError) {
      console.error('Refresh error, trying manual update:', refreshError)
      
      // Approach 2: Manual update of state
      if (groupId) {
        setServiceDetailOneGroups(prev => 
          prev.map(group => {
            if (group.id === groupId) {
              return {
                ...group,
                service_detail_ones: group.service_detail_ones.filter(d => d.id !== detailId)
              }
            }
            return group
          })
        )
      }
    }
    
    alert('Service detail deleted successfully!')
  } catch (error) {
    console.error('Error deleting service detail:', error)
    alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    setLoading(false)
  }
}

  if (loading && !serviceDetailOneGroups.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
        <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Service Detail Manager</h1>
      <p className="text-muted-foreground mt-2">
        Manage service detail groups and their individual details
      </p>
    </div>
    <Button onClick={() => setOpen(true)} disabled={loading}>
      <Plus className="w-4 h-4 mr-2" />
      Add Service Detail Group
    </Button>
  </div>

  {/* Error Alert */}
  {error && (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )}

  {/* Service Detail Groups List - WITHOUT COLLAPSE */}
  <div className="space-y-4">
    {serviceDetailOneGroups.length === 0 ? (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No service detail groups found</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Create your first service detail group to get started
        </p>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create First Group
        </Button>
      </div>
    ) : (
      serviceDetailOneGroups.map((group) => (
        // REMOVED Collapsible component - replaced with normal div
        <div
          key={group.id}
          className="border rounded-lg overflow-hidden bg-card"
        >
          {/* Group Header - Always visible */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* REMOVED CollapsibleTrigger - collapse button hata diya */}
                {/* Icon or indicator if needed */}
                <div className="p-2 bg-primary/10 rounded">
                  {/* <Folder className="h-4 w-4 text-primary" /> */}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{group.heading}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">
                      Group: {getServiceGroupName(group.service_group_id)}
                    </Badge>
                    <Badge variant="outline">
                      Service: {getServiceName(group.service_id)}
                    </Badge>
                    <Badge variant="secondary">
                      {group.service_detail_ones.length} details
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleEditGroup(group)}
                  disabled={loading}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Group
                </Button>
                <Button
                  variant="error"
                  onClick={() => handleDeleteGroup(group.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* REMOVED CollapsibleContent - sab kuch ab always visible hai */}
          <div className="border-t p-6 bg-muted/30">
            {/* Description Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Description
                </h4>
                <Button
                  onClick={() => handleAddDetail(group.id)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Detail
                </Button>
              </div>
              <p className="text-sm">{group.des}</p>
            </div>
            
            {/* Service Details Section - Always visible */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Service Details ({group.service_detail_ones.length})
              </h4>
              
              {group.service_detail_ones.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-background">
                  <p className="text-muted-foreground">No details added yet</p>
                  <Button
                    onClick={() => handleAddDetail(group.id)}
                    size="sm"
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Detail
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-10">
                    {group.service_detail_ones.map((detail) => (
                      <div 
                        key={detail.id} 
                        className="group relative rounded-2xl p-[1px] p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500"
                      >
                        <div className="flex flex-col items-center h-full rounded-2xl p-3 py-10 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-xl shadow-lg dark:shadow-lg hover:shadow-2xl transition-all">
                              <div className="flex-shrink-0 relative top-0 -mt-17">
      {/* <div className="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-500 text-white border-4 border-white text-xl font-semibold">
        1
      </div> */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-theme)] text-white border-4 border-white dark:text-white group-hover:scale-110 transition">
                        <div 
                          dangerouslySetInnerHTML={{
                            __html: `<i class="${detail.icon} text-2xl"></i>`
                          }}
                          className="flex items-center justify-center w-full h-full"
                        />
                      </div>
    </div>

                          <div className="mt-4 text-center">
                            <h4 className="text-lg leading-6 font-semibold  text-gray-900  font-bold dark:text-gray-300">
                              {detail.heading}
                            </h4>
                            <p className="mt-2 text-sm  text-base leading-6  text-gray-900 dark:text-gray-400">
                              {detail.des}
                            </p>
                          </div>
                          <div className="mt-5 flex gap-4">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleEditDetail(detail, group.id)}
                              className="flex-1"
                            >
                              <Edit className="mr-2 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="error"
                              size="sm"
                              onClick={() => handleDeleteDetail(detail.id)}
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
                </>
              )}
            </div>
          </div>
        </div>
      ))
    )}
  </div>

      {/* ========== MODAL FOR SERVICE_DETAIL_ONE_GROUP ========== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Service Detail Group' : 'Create Service Detail Group'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the service detail group and its individual details.'
                : 'Create a new service detail group with multiple individual details.'
              }
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={isEdit ? handleUpdateGroup : handleSubmitGroup}
            enableReinitialize
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Group Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Service Group */}
                    <div>
                      <Label htmlFor="service_group_id">Service Group *</Label>
                     <DropdownMenu >
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="w-full justify-between text-black dark:text-white">
      {values.service_group_id 
        ? serviceGroups.find(g => g.id === values.service_group_id)?.title || "Select a service group"
        : "Select a service group"}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
    {serviceGroups.map((group) => (
      <DropdownMenuItem
        key={group.id}
        onSelect={() => setFieldValue('service_group_id', group.id)}
        className="cursor-pointer"
      >
        {group.title}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
                      {errors.service_group_id && touched.service_group_id && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.service_group_id}
                      </p>
                      )}
                    </div>

                    {/* Service */}
                    <div>
                      <Label htmlFor="service_id">Service *</Label>
                      <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button 
      variant="outline" 
      className="w-full justify-between"
      disabled={isSubmitting}
    >
      {values.service_id 
        ? services.find(s => s.id === values.service_id)?.title || "Select a service"
        : "Select a service"
      }
      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
    <DropdownMenuLabel>Select Service</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {services.map((service) => (
      <DropdownMenuItem 
        key={service.id}
        onClick={() => setFieldValue('service_id', service.id)}
        className={values.service_id === service.id ? "bg-accent" : ""}
      >
        {service.title}
        {values.service_id === service.id && (
          <ChevronDown className="ml-auto h-4 w-4" />
        )}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
                      {errors.service_id && touched.service_id && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.service_id}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Group Heading */}
                  <div>
                    <Label htmlFor="heading">Group Heading *</Label>
                    <Field
                      as={Input}
                      id="heading"
                      name="heading"
                      placeholder="Enter group heading"
                      disabled={isSubmitting}
                      className={errors.heading && touched.heading ? 'border-destructive' : ''}
                    />
                    <ErrorMessage
                      name="heading"
                      component="div"
                      className="text-sm text-destructive mt-1"
                    />
                  </div>

                  {/* Group Description */}
                  <div>
                    <Label htmlFor="des">Group Description *</Label>
                    <Field
                      as={Textarea}
                      id="des"
                      name="des"
                      placeholder="Enter group description"
                      rows={3}
                      disabled={isSubmitting}
                      className={errors.des && touched.des ? 'border-destructive' : ''}
                    />
                    <ErrorMessage
                      name="des"
                      component="div"
                      className="text-sm text-destructive mt-1"
                    />
                  </div>
                </div>

                {/* Service Details Array - Only for group create/update */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Service Details *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFieldValue('service_detail_ones', [
                        ...values.service_detail_ones,
                        { icon: '', heading: '', des: '' }
                      ])}
                      disabled={isSubmitting}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Detail
                    </Button>
                  </div>

                  <FieldArray name="service_detail_ones">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.service_detail_ones.map((_, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Detail #{index + 1}</h4>
                              {values.service_detail_ones.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => remove(index)}
                                  disabled={isSubmitting}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* Icon */}
                              <div>
                                <Label htmlFor={`service_detail_ones.${index}.icon`}>
                                  Icon *
                                </Label>
                                <Field
                                  as={Input}
                                  id={`service_detail_ones.${index}.icon`}
                                  name={`service_detail_ones.${index}.icon`}
                                  placeholder="e.g., ⭐, 🔧, 💡"
                                  disabled={isSubmitting}
                                />
                                <ErrorMessage
                                  name={`service_detail_ones.${index}.icon`}
                                  component="div"
                                  className="text-sm text-destructive mt-1"
                                />
                              </div>

                              {/* Detail Heading */}
                              <div>
                                <Label htmlFor={`service_detail_ones.${index}.heading`}>
                                  Heading *
                                </Label>
                                <Field
                                  as={Input}
                                  id={`service_detail_ones.${index}.heading`}
                                  name={`service_detail_ones.${index}.heading`}
                                  placeholder="Enter detail heading"
                                  disabled={isSubmitting}
                                />
                                <ErrorMessage
                                  name={`service_detail_ones.${index}.heading`}
                                  component="div"
                                  className="text-sm text-destructive mt-1"
                                />
                              </div>
                            </div>

                            {/* Detail Description */}
                            <div>
                              <Label htmlFor={`service_detail_ones.${index}.des`}>
                                Description *
                              </Label>
                              <Field
                                as={Textarea}
                                id={`service_detail_ones.${index}.des`}
                                name={`service_detail_ones.${index}.des`}
                                placeholder="Enter detail description"
                                rows={2}
                                disabled={isSubmitting}
                              />
                              <ErrorMessage
                                name={`service_detail_ones.${index}.des`}
                                component="div"
                                className="text-sm text-destructive mt-1"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>

                  {errors.service_detail_ones && typeof errors.service_detail_ones === 'string' && (
                    <p className="text-sm text-destructive">{errors.service_detail_ones}</p>
                  )}
                </div>

                {/* Form Actions */}
                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetGroupForm()
                      setOpen(false)
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEdit ? 'Update Group' : 'Create Group'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* ========== SEPARATE MODAL FOR SERVICE_DETAIL_ONE ========== */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isDetailEdit ? 'Edit Service Detail' : 'Add New Service Detail'}
            </DialogTitle>
            <DialogDescription>
              {isDetailEdit
                ? 'Update this service detail.'
                : 'Add a new service detail to the selected group.'
              }
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={initialDetailFormValues}
            validationSchema={detailValidationSchema}
            onSubmit={isDetailEdit ? handleUpdateDetail : handleSubmitDetail}
            enableReinitialize
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">
                {/* Parent Group Selection - Only show when adding new detail */}
                {!isDetailEdit && (
                  <div>
                    <Label htmlFor="service_id">Parent Group *</Label>
                    <Select
                      value={values.service_id}
                      onValueChange={(value) => setFieldValue('service_id', value)}
                      disabled={isSubmitting || isDetailEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent group" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceDetailOneGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.heading}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service_id && touched.service_id && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.service_id}
                      </p>
                    )}
                  </div>
                )}

                {/* Icon */}
                <div>
                  <Label htmlFor="icon">Icon *</Label>
                  <Field
                    as={Input}
                    id="icon"
                    name="icon"
                    placeholder="e.g., fas fa-star, fas fa-wrench"
                    disabled={isSubmitting}
                    className={errors.icon && touched.icon ? 'border-destructive' : ''}
                  />
                  <ErrorMessage
                    name="icon"
                    component="div"
                    className="text-sm text-destructive mt-1"
                  />
                </div>

                {/* Heading */}
                <div>
                  <Label htmlFor="heading">Heading *</Label>
                  <Field
                    as={Input}
                    id="heading"
                    name="heading"
                    placeholder="Enter detail heading"
                    disabled={isSubmitting}
                    className={errors.heading && touched.heading ? 'border-destructive' : ''}
                  />
                  <ErrorMessage
                    name="heading"
                    component="div"
                    className="text-sm text-destructive mt-1"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="des">Description *</Label>
                  <Field
                    as={Textarea}
                    id="des"
                    name="des"
                    placeholder="Enter detail description"
                    rows={3}
                    disabled={isSubmitting}
                    className={errors.des && touched.des ? 'border-destructive' : ''}
                  />
                  <ErrorMessage
                    name="des"
                    component="div"
                    className="text-sm text-destructive mt-1"
                  />
                </div>

                {/* Form Actions */}
                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetDetailForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isDetailEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isDetailEdit ? 'Update Detail' : 'Create Detail'}
                      </>
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

export default ServiceDetailManager









