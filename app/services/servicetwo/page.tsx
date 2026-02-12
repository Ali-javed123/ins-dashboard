// 'use client'

// import { FC, useCallback, useEffect, useState, useRef } from 'react'
// import { Plus, Edit, Trash2, X, ChevronDown, Layers, Award, Server, CreditCard, Filter } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
// import * as Yup from 'yup'
// import { supabase } from "@/lib/supabase-client"

// // Types
// interface ServiceGroup {
//   id: string
//   title: string
// }

// interface Service {
//   id: string
//   title: string
//   service_group_id: string
// }

// interface HighValueGroup {
//   id: string
//   created_at: string
//   heading: string
//   description: string
//   service_group_id: string
//   service_id: string
// }

// interface HighValueCard {
//   id: string
//   created_at: string
//   icon: string
//   title: string
//   high_value_id: string
// }

// interface HighValueGroupFormValues {
//   heading: string
//   description: string
//   service_group_id: string
//   service_id: string
// }

// interface HighValueCardFormValues {
//   icon: string
//   title: string
//   high_value_id: string
// }

// // Validation Schemas
// const highValueGroupValidationSchema = Yup.object({
//   heading: Yup.string()
//     .min(2, 'Heading must be at least 2 characters')
//     .required('Heading is required'),
//   description: Yup.string()
//     .min(10, 'Description must be at least 10 characters')
//     .required('Description is required'),
//   service_group_id: Yup.string()
//     .required('Service group is required'),
//   service_id: Yup.string()
//     .required('Service is required')
// })

// const highValueCardValidationSchema = Yup.object({
//   icon: Yup.string()
//     .required('Icon class is required'),
//   title: Yup.string()
//     .min(2, 'Title must be at least 2 characters')
//     .required('Title is required'),
//   high_value_id: Yup.string()
//     .required('High value group is required')
// })

// const HighValueManagement: FC = () => {
//   // State
//   const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])
//   const [services, setServices] = useState<Service[]>([])
//   const [highValueGroups, setHighValueGroups] = useState<HighValueGroup[]>([])
//   const [highValueCards, setHighValueCards] = useState<HighValueCard[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
  
//   // Filter State
//   const [selectedFilterServiceGroup, setSelectedFilterServiceGroup] = useState<string>('all')
//   const [selectedFilterService, setSelectedFilterService] = useState<string>('all')
  
//   // Dialogs state
//   const [groupDialogOpen, setGroupDialogOpen] = useState<boolean>(false)
//   const [cardDialogOpen, setCardDialogOpen] = useState<boolean>(false)
  
//   // Edit state
//   const [isEditGroup, setIsEditGroup] = useState<boolean>(false)
//   const [isEditCard, setIsEditCard] = useState<boolean>(false)
//   const [editGroupId, setEditGroupId] = useState<string | null>(null)
//   const [editCardId, setEditCardId] = useState<string | null>(null)
  
//   const [submitting, setSubmitting] = useState<boolean>(false)
  
//   // Selected values for dropdowns in forms
//   const [selectedServiceGroup, setSelectedServiceGroup] = useState<string>('')
//   const [selectedService, setSelectedService] = useState<string>('')
//   const [selectedHighValueGroup, setSelectedHighValueGroup] = useState<string>('')
  
//   // Form Data
//   const [groupFormData, setGroupFormData] = useState<HighValueGroupFormValues>({
//     heading: '',
//     description: '',
//     service_group_id: '',
//     service_id: ''
//   })

//   const [cardFormData, setCardFormData] = useState<HighValueCardFormValues>({
//     icon: '',
//     title: '',
//     high_value_id: ''
//   })

//   // Filtered services based on selected service group in form
//   const filteredServices = services.filter(service => 
//     selectedServiceGroup ? service.service_group_id === selectedServiceGroup : true
//   )

//   // Filtered services for filter dropdown
//   const filteredServicesForFilter = selectedFilterServiceGroup !== 'all' 
//     ? services.filter(service => service.service_group_id === selectedFilterServiceGroup)
//     : services

//   // Filtered high value groups based on selected filters
//   const filteredHighValueGroups = highValueGroups.filter(group => {
//     if (selectedFilterServiceGroup === 'all' && selectedFilterService === 'all') {
//       return true
//     }
    
//     if (selectedFilterServiceGroup !== 'all' && selectedFilterService === 'all') {
//       return group.service_group_id === selectedFilterServiceGroup
//     }
    
//     if (selectedFilterService !== 'all') {
//       return group.service_id === selectedFilterService
//     }
    
//     return true
//   })

//   // Filtered high value cards for display
//   const filteredCards = highValueCards.filter(card => {
//     const group = highValueGroups.find(g => g.id === card.high_value_id)
//     if (!group) return false
    
//     if (selectedFilterServiceGroup === 'all' && selectedFilterService === 'all') {
//       return true
//     }
    
//     if (selectedFilterServiceGroup !== 'all' && selectedFilterService === 'all') {
//       return group.service_group_id === selectedFilterServiceGroup
//     }
    
//     if (selectedFilterService !== 'all') {
//       return group.service_id === selectedFilterService
//     }
    
//     return true
//   })

//   // Fetch all data
//   const fetchAllData = useCallback(async (): Promise<void> => {
//     try {
//       setLoading(true)
      
//       // Fetch service groups
//       const { data: groupsData, error: groupsError } = await supabase
//         .from('service_groups')
//         .select('id, title')
//         .order('created_at', { ascending: true })

//       if (groupsError) throw groupsError
//       setServiceGroups(groupsData || [])

//       // Fetch services
//       const { data: servicesData, error: servicesError } = await supabase
//         .from('services')
//         .select('id, title, service_group_id')
//         .order('created_at', { ascending: true })

//       if (servicesError) throw servicesError
//       setServices(servicesData || [])

//       // Fetch high value groups
//       const { data: highValueGroupsData, error: highValueGroupsError } = await supabase
//         .from('high_value_group')
//         .select('*')
//         .order('created_at', { ascending: true })

//       if (highValueGroupsError) throw highValueGroupsError
//       setHighValueGroups(highValueGroupsData || [])

//       // Fetch high value cards
//       const { data: highValueCardsData, error: highValueCardsError } = await supabase
//         .from('high_value_card')
//         .select('*')
//         .order('created_at', { ascending: true })

//       if (highValueCardsError) throw highValueCardsError
//       setHighValueCards(highValueCardsData || [])

//     } catch (error) {
//       console.error('Error fetching data:', error)
//       alert('Failed to load data. Please refresh the page.')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchAllData()
//   }, [fetchAllData])

//   // Reset Forms
//   const resetGroupForm = (): void => {
//     setIsEditGroup(false)
//     setEditGroupId(null)
//     setGroupFormData({
//       heading: '',
//       description: '',
//       service_group_id: '',
//       service_id: ''
//     })
//     setSelectedServiceGroup('')
//     setSelectedService('')
//     setSubmitting(false)
//   }

//   const resetCardForm = (): void => {
//     setIsEditCard(false)
//     setEditCardId(null)
//     setCardFormData({
//       icon: '',
//       title: '',
//       high_value_id: highValueGroups.length > 0 ? highValueGroups[0].id : ''
//     })
//     setSelectedHighValueGroup(highValueGroups.length > 0 ? highValueGroups[0].id : '')
//     setSubmitting(false)
//   }

//   // Reset Filters
//   const resetFilters = (): void => {
//     setSelectedFilterServiceGroup('all')
//     setSelectedFilterService('all')
//   }

//   // Get service group name by ID
//   const getServiceGroupName = (id: string): string => {
//     const group = serviceGroups.find(g => g.id === id)
//     return group ? group.title : 'Unknown Group'
//   }

//   // Get service name by ID
//   const getServiceName = (id: string): string => {
//     const service = services.find(s => s.id === id)
//     return service ? service.title : 'Unknown Service'
//   }

//   // Get high value group heading by ID
//   const getHighValueGroupHeading = (id: string): string => {
//     const group = highValueGroups.find(g => g.id === id)
//     return group ? group.heading : 'Unknown Group'
//   }

//   // High Value Group Handlers
//   const handleEditGroup = (group: HighValueGroup): void => {
//     setIsEditGroup(true)
//     setEditGroupId(group.id)
//     setGroupFormData({
//       heading: group.heading,
//       description: group.description,
//       service_group_id: group.service_group_id,
//       service_id: group.service_id
//     })
//     setSelectedServiceGroup(group.service_group_id)
//     setSelectedService(group.service_id)
//     setGroupDialogOpen(true)
//   }

//   const handleSubmitGroup = async (
//     values: HighValueGroupFormValues,
//     formikHelpers: FormikHelpers<HighValueGroupFormValues>
//   ): Promise<void> => {
//     if (submitting) return

//     try {
//       setSubmitting(true)

//       if (isEditGroup && editGroupId) {
//         // Update existing group
//         const { error } = await supabase
//           .from('high_value_group')
//           .update({
//             heading: values.heading,
//             description: values.description,
//             service_group_id: values.service_group_id,
//             service_id: values.service_id
//           })
//           .eq('id', editGroupId)

//         if (error) throw new Error(`Failed to update: ${error.message}`)
//       } else {
//         // Create new group
//         const { error } = await supabase
//           .from('high_value_group')
//           .insert([{
//             heading: values.heading,
//             description: values.description,
//             service_group_id: values.service_group_id,
//             service_id: values.service_id
//           }])
//           .select()
//           .single()

//         if (error) throw new Error(`Failed to create: ${error.message}`)
//       }

//       await fetchAllData()
//       resetGroupForm()
//       setGroupDialogOpen(false)
//       formikHelpers.resetForm()
//       alert(`High value group ${isEditGroup ? 'updated' : 'created'} successfully!`)
//     } catch (error) {
//       console.error('Error saving high value group:', error)
//       alert(error instanceof Error ? `Error: ${error.message}` : 'Error saving high value group')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteGroup = async (id: string): Promise<void> => {
//     if (!window.confirm('Delete this high value group and all its cards?')) return

//     try {
//       // First delete all associated cards
//       const { error: cardsError } = await supabase
//         .from('high_value_card')
//         .delete()
//         .eq('high_value_id', id)

//       if (cardsError) throw cardsError

//       // Then delete the group
//       const { error: groupError } = await supabase
//         .from('high_value_group')
//         .delete()
//         .eq('id', id)

//       if (groupError) throw groupError

//       await fetchAllData()
//       alert('High value group deleted successfully!')
//     } catch (error) {
//       console.error('Error deleting high value group:', error)
//       alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`)
//     }
//   }

//   // High Value Card Handlers
//   const handleEditCard = (card: HighValueCard): void => {
//     setIsEditCard(true)
//     setEditCardId(card.id)
//     setCardFormData({
//       icon: card.icon,
//       title: card.title,
//       high_value_id: card.high_value_id
//     })
//     setSelectedHighValueGroup(card.high_value_id)
//     setCardDialogOpen(true)
//   }

//   const handleSubmitCard = async (
//     values: HighValueCardFormValues,
//     formikHelpers: FormikHelpers<HighValueCardFormValues>
//   ): Promise<void> => {
//     if (submitting) return

//     try {
//       setSubmitting(true)

//       if (isEditCard && editCardId) {
//         // Update existing card
//         const { error } = await supabase
//           .from('high_value_card')
//           .update({
//             icon: values.icon,
//             title: values.title,
//             high_value_id: values.high_value_id
//           })
//           .eq('id', editCardId)

//         if (error) throw new Error(`Failed to update: ${error.message}`)
//       } else {
//         // Create new card
//         const { error } = await supabase
//           .from('high_value_card')
//           .insert([{
//             icon: values.icon,
//             title: values.title,
//             high_value_id: values.high_value_id
//           }])
//           .select()
//           .single()

//         if (error) throw new Error(`Failed to create: ${error.message}`)
//       }

//       await fetchAllData()
//       resetCardForm()
//       setCardDialogOpen(false)
//       formikHelpers.resetForm()
//       alert(`High value card ${isEditCard ? 'updated' : 'created'} successfully!`)
//     } catch (error) {
//       console.error('Error saving high value card:', error)
//       alert(error instanceof Error ? `Error: ${error.message}` : 'Error saving high value card')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteCard = async (id: string): Promise<void> => {
//     if (!window.confirm('Delete this high value card?')) return

//     try {
//       const { error } = await supabase
//         .from('high_value_card')
//         .delete()
//         .eq('id', id)

//       if (error) throw error

//       await fetchAllData()
//       alert('High value card deleted successfully!')
//     } catch (error) {
//       console.error('Error deleting high value card:', error)
//       alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-6">
//       {/* Header with Filters */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               High Value Management
//             </h1>
//             <p className="mt-2 text-gray-600 dark:text-gray-400">
//               Organize premium features and benefits
//             </p>
//           </div>

//           <div className="flex gap-3 flex-wrap">
//             <Button onClick={() => { resetGroupForm(); setGroupDialogOpen(true); }}>
//               <Plus className="mr-2 h-4 w-4" /> Add High Value Group
//             </Button>

//             <Button
//               variant="outline"
//               onClick={() => { resetCardForm(); setCardDialogOpen(true); }}
//               disabled={highValueGroups.length === 0}
//             >
//               <Plus className="mr-2 h-4 w-4" /> Add High Value Card
//             </Button>
//           </div>
//         </div>

//         {/* Filter Section */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4">
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//               <span className="font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
//             </div>
            
//             <div className="flex flex-col md:flex-row gap-3 flex-1">
//               {/* Service Group Filter */}
//               <div className="flex-1">
//                 <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Service Group</Label>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" className="w-full justify-between">
//                       {selectedFilterServiceGroup === 'all' 
//                         ? "All Service Groups" 
//                         : getServiceGroupName(selectedFilterServiceGroup)}
//                       <ChevronDown className="ml-2 h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-full">
//                     <DropdownMenuItem onClick={() => setSelectedFilterServiceGroup('all')}>
//                       All Service Groups
//                     </DropdownMenuItem>
//                     {serviceGroups.map((group) => (
//                       <DropdownMenuItem
//                         key={group.id}
//                         onClick={() => {
//                           setSelectedFilterServiceGroup(group.id)
//                           setSelectedFilterService('all') // Reset service filter
//                         }}
//                       >
//                         {group.title}
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>

//               {/* Service Filter */}
//               <div className="flex-1">
//                 <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Service</Label>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button 
//                       variant="outline" 
//                       className="w-full justify-between"
//                       disabled={selectedFilterServiceGroup === 'all' && filteredServicesForFilter.length === 0}
//                     >
//                       {selectedFilterService === 'all' 
//                         ? "All Services" 
//                         : getServiceName(selectedFilterService)}
//                       <ChevronDown className="ml-2 h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-full">
//                     <DropdownMenuItem onClick={() => setSelectedFilterService('all')}>
//                       All Services
//                     </DropdownMenuItem>
//                     {filteredServicesForFilter.map((service) => (
//                       <DropdownMenuItem
//                         key={service.id}
//                         onClick={() => setSelectedFilterService(service.id)}
//                       >
//                         {service.title}
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>

//             {/* Reset Filter Button */}
//             {(selectedFilterServiceGroup !== 'all' || selectedFilterService !== 'all') && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={resetFilters}
//                 className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//               >
//                 <X className="mr-2 h-4 w-4" />
//                 Clear Filters
//               </Button>
//             )}
//           </div>

//           {/* Active Filters Display */}
//           {(selectedFilterServiceGroup !== 'all' || selectedFilterService !== 'all') && (
//             <div className="mt-4 flex items-center gap-2 text-sm">
//               <span className="text-gray-600 dark:text-gray-400">Showing:</span>
//               {selectedFilterServiceGroup !== 'all' && (
//                 <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
//                   Service Group: {getServiceGroupName(selectedFilterServiceGroup)}
//                 </span>
//               )}
//               {selectedFilterService !== 'all' && (
//                 <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
//                   Service: {getServiceName(selectedFilterService)}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* High Value Groups Display */}
//       <div className="space-y-8">
//         {filteredHighValueGroups.length > 0 ? (
//           filteredHighValueGroups.map((group) => (
//             <div key={group.id} className="my-5">
//               {/* Group Header */}
//               <div className="mb-6">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
//                   <div className="flex items-center gap-3 flex-wrap">
//                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                       {group.heading}
//                     </h2>
//                     <div className="flex gap-2 justify-end items-center">
//                       <Button
//                         variant="update"
//                         size="sm"
//                         onClick={() => handleEditGroup(group)}
//                         className="whitespace-nowrap"
//                       >
//                         <Edit className="mr-2 h-4 w-4" />
//                         Edit
//                       </Button>
                      
//                       <Button
//                         variant="error"
//                         size="sm"
//                         onClick={() => handleDeleteGroup(group.id)}
//                         className="whitespace-nowrap"
//                       >
//                         <Trash2 className="mr-2 h-4 w-4" />
//                         Delete
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Group Info */}
//                 <div className="mb-3 flex flex-wrap items-center gap-3">
//                   <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
//                     <Layers className="h-3 w-3" />
//                     {getServiceGroupName(group.service_group_id)}
//                   </span>
//                   <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
//                     <Server className="h-3 w-3" />
//                     {getServiceName(group.service_id)}
//                   </span>
//                   <span className="text-sm text-gray-500 dark:text-gray-400">
//                     {filteredCards.filter(card => card.high_value_id === group.id).length} cards
//                   </span>
//                 </div>
                
//                 {/* Description */}
//                 <p className="text-gray-700 dark:text-gray-300 w-full">
//                   {group.description}
//                 </p>
//               </div>
              
//               {/* Add Card Button */}
//               <div className='flex item justify-end mb-6'>
//                 <Button
//                   variant="default"
//                   onClick={() => {
//                     resetCardForm()
//                     setSelectedHighValueGroup(group.id)
//                     setCardDialogOpen(true)
//                   }}
//                   className="whitespace-nowrap"
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Card to this Group
//                 </Button>
//               </div>

//               {/* Cards Display */}
//               <div>
//                 {filteredCards.filter(card => card.high_value_id === group.id).length > 0 ? (
//                   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                     {filteredCards
//                       .filter(card => card.high_value_id === group.id)
//                       .map((card) => (
//                         <div
//                           key={card.id}
//                           className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500"
//                         >
//                           <div className="h-full rounded-2xl p-6 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-xl shadow-lg dark:shadow-lg hover:shadow-2xl transition-all">
//                             {/* Icon with Gradient Background */}
//                             <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-sky-950 text-white group-hover:scale-110 transition-transform duration-300">
//                               <div 
//                                 dangerouslySetInnerHTML={{
//                                   __html: `<i class="${card.icon} text-2xl"></i>`
//                                 }}
//                                 className="flex items-center justify-center w-full h-full"
//                               />
//                             </div>

//                             {/* Content */}
//                             <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                               {card.title}
//                             </h4>
                            
//                             <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
//                               Card ID: {card.id}
//                             </div>

//                             {/* Actions */}
//                             <div className="mt-6 flex gap-2">
//                               <Button
//                                 size="sm"
//                                 onClick={() => handleEditCard(card)}
//                               >
//                                 <Edit className="mr-2 h-3 w-3" />
//                                 Edit
//                               </Button>
                              
//                               <Button
//                                 variant="error"
//                                 size="sm"
//                                 onClick={() => handleDeleteCard(card.id)}
//                               >
//                                 <Trash2 className="mr-2 h-3 w-3" />
//                                 Delete
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 ) : (
//                   <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950/50">
//                     <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
//                       <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                       No premium cards yet
//                     </h3>
//                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                       Add cards to showcase high value features
//                     </p>
//                     <Button
//                       className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
//                       onClick={() => {
//                         resetCardForm()
//                         setSelectedHighValueGroup(group.id)
//                         setCardDialogOpen(true)
//                       }}
//                     >
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add First Card
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950/50">
//             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
//               <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//               {selectedFilterServiceGroup !== 'all' || selectedFilterService !== 'all'
//                 ? 'No high value groups found for selected filters'
//                 : 'No high value groups yet'}
//             </h3>
//             <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//               {selectedFilterServiceGroup !== 'all' || selectedFilterService !== 'all'
//                 ? 'Try changing your filters or create a new group'
//                 : 'Create groups to organize premium features and benefits'}
//             </p>
//             <Button
//               className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
//               onClick={() => {
//                 resetGroupForm()
//                 setGroupDialogOpen(true)
//               }}
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Create First Group
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Modals (Same as before) */}
//       <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               {isEditGroup ? 'Edit High Value Group' : 'Create High Value Group'}
//             </DialogTitle>
//           </DialogHeader>
          
//           <Formik
//             initialValues={groupFormData}
//             validationSchema={highValueGroupValidationSchema}
//             onSubmit={handleSubmitGroup}
//             enableReinitialize
//           >
//             {({ isSubmitting, errors, touched, values, setFieldValue }) => (
//               <Form className="space-y-4">
//                 {/* Heading */}
//                 <div>
//                   <Label htmlFor="heading">Heading *</Label>
//                   <Field
//                     as={Input}
//                     id="heading"
//                     name="heading"
//                     placeholder="e.g., Core Features"
//                     className={errors.heading && touched.heading ? 'border-red-500' : ''}
//                   />
//                   <ErrorMessage
//                     name="heading"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <Label htmlFor="description">Description *</Label>
//                   <Field
//                     as="textarea"
//                     id="description"
//                     name="description"
//                     rows={4}
//                     placeholder="Describe the high value group..."
//                     className={`w-full rounded-md border p-2 ${errors.description && touched.description ? 'border-red-500' : ''}`}
//                   />
//                   <ErrorMessage
//                     name="description"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>

//                 {/* Service Group Dropdown */}
//                 <div>
//                   <Label>Service Group *</Label>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="outline" className="w-full justify-between">
//                         {selectedServiceGroup ? getServiceGroupName(selectedServiceGroup) : "Select service group"}
//                         <ChevronDown className="ml-2 h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-full">
//                       {serviceGroups.map((group) => (
//                         <DropdownMenuItem
//                           key={group.id}
//                           onClick={() => {
//                             const groupId = group.id
//                             setFieldValue('service_group_id', groupId)
//                             setSelectedServiceGroup(groupId)
//                             setFieldValue('service_id', '')
//                             setSelectedService('')
//                           }}
//                         >
//                           {group.title}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                   <input
//                     type="hidden"
//                     name="service_group_id"
//                     value={values.service_group_id}
//                   />
//                   <ErrorMessage
//                     name="service_group_id"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>

//                 {/* Service Dropdown */}
//                 <div>
//                   <Label>Service *</Label>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button 
//                         variant="outline" 
//                         className="w-full justify-between"
//                         disabled={!selectedServiceGroup}
//                       >
//                         {selectedService ? getServiceName(selectedService) : "Select service"}
//                         <ChevronDown className="ml-2 h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-full">
//                       {filteredServices.map((service) => (
//                         <DropdownMenuItem
//                           key={service.id}
//                           onClick={() => {
//                             setFieldValue('service_id', service.id)
//                             setSelectedService(service.id)
//                           }}
//                         >
//                           {service.title}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                   <input
//                     type="hidden"
//                     name="service_id"
//                     value={values.service_id}
//                   />
//                   <ErrorMessage
//                     name="service_id"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                   {!selectedServiceGroup && (
//                     <p className="mt-1 text-xs text-gray-500">
//                       Please select a service group first
//                     </p>
//                   )}
//                 </div>

//                 <DialogFooter>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setGroupDialogOpen(false)
//                       resetGroupForm()
//                     }}
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </Button>
                  
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? 'Saving...' : (isEditGroup ? 'Update' : 'Create')}
//                   </Button>
//                 </DialogFooter>
//               </Form>
//             )}
//           </Formik>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               {isEditCard ? 'Edit High Value Card' : 'Create High Value Card'}
//             </DialogTitle>
//           </DialogHeader>
          
//           <Formik
//             initialValues={{
//               ...cardFormData,
//               high_value_id: selectedHighValueGroup || (highValueGroups.length > 0 ? highValueGroups[0].id : '')
//             }}
//             validationSchema={highValueCardValidationSchema}
//             onSubmit={handleSubmitCard}
//             enableReinitialize
//           >
//             {({ isSubmitting, errors, touched, values, setFieldValue }) => (
//               <Form className="space-y-4">
//                 {/* High Value Group Dropdown */}
//                 <div>
//                   <Label>High Value Group *</Label>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="outline" className="w-full justify-between">
//                         {values.high_value_id ? getHighValueGroupHeading(values.high_value_id) : "Select high value group"}
//                         <ChevronDown className="ml-2 h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-full">
//                       {highValueGroups.map((group) => (
//                         <DropdownMenuItem
//                           key={group.id}
//                           onClick={() => {
//                             setFieldValue('high_value_id', group.id)
//                             setSelectedHighValueGroup(group.id)
//                           }}
//                         >
//                           {group.heading}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                   <input
//                     type="hidden"
//                     name="high_value_id"
//                     value={values.high_value_id}
//                   />
//                   <ErrorMessage
//                     name="high_value_id"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>

//                 {/* Title */}
//                 <div>
//                   <Label htmlFor="title">Title *</Label>
//                   <Field
//                     as={Input}
//                     id="title"
//                     name="title"
//                     placeholder="e.g., 24/7 Support"
//                     className={errors.title && touched.title ? 'border-red-500' : ''}
//                   />
//                   <ErrorMessage
//                     name="title"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>

//                 {/* Icon */}
//                 <div>
//                   <Label htmlFor="icon">FontAwesome Icon Class *</Label>
//                   <Field
//                     as={Input}
//                     id="icon"
//                     name="icon"
//                     placeholder="e.g., fa-solid fa-headset"
//                     className={errors.icon && touched.icon ? 'border-red-500' : ''}
//                   />
//                   <ErrorMessage
//                     name="icon"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                   <p className="mt-1 text-xs text-gray-500">
//                     Use FontAwesome classes like fa-solid fa-headset or fa-regular fa-clock
//                   </p>
//                 </div>

//                 <DialogFooter>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setCardDialogOpen(false)
//                       resetCardForm()
//                     }}
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </Button>
                  
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? 'Saving...' : (isEditCard ? 'Update' : 'Create')}
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

// export default HighValueManagement


'use client'

import { FC, useCallback, useEffect, useState, useRef } from 'react'
import { Plus, Edit, Trash2, X, ChevronDown, Layers, Award, Server, CreditCard, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { supabase } from "@/lib/supabase-client"

// Types
interface ServiceGroup {
  id: string
  title: string
}

interface Service {
  id: string
  title: string
  service_group_id: string
}

interface HighValueGroup {
  id: string
  created_at: string
  heading: string
  description: string
  service_group_id: string
  service_id: string
}

interface HighValueCard {
  id: string
  created_at: string
  icon: string
  title: string
  high_value_id: string
    des: string,            // ✅ NEW

}

interface HighValueGroupFormValues {
  heading: string
  description: string
  service_group_id: string
  service_id: string
}

interface HighValueCardFormValues {
  icon: string
  title: string
  high_value_id: string
    des: string,            // ✅ NEW

}

// Validation Schemas
const highValueGroupValidationSchema = Yup.object({
  heading: Yup.string()
    .min(2, 'Heading must be at least 2 characters')
    .required('Heading is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  service_group_id: Yup.string()
    .required('Service group is required'),
  service_id: Yup.string()
    .required('Service is required')
})

const highValueCardValidationSchema = Yup.object({
  icon: Yup.string()
    .required('Icon class is required'),
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .required('Title is required'),
  high_value_id: Yup.string()
    .required('High value group is required'),
    des: Yup.string()    // ✅ NEW
    .min(5, 'Description must be at least 5 characters')
    .required('Description is required'),

})

const HighValueManagement: FC = () => {
  // State
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [highValueGroups, setHighValueGroups] = useState<HighValueGroup[]>([])
  const [highValueCards, setHighValueCards] = useState<HighValueCard[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  // Filter State - By Default पहला Service Group और चौथा Service Select होगा
  const [selectedFilterServiceGroup, setSelectedFilterServiceGroup] = useState<string>('')
  const [selectedFilterService, setSelectedFilterService] = useState<string>('')
  
  // Dialogs state
  const [groupDialogOpen, setGroupDialogOpen] = useState<boolean>(false)
  const [cardDialogOpen, setCardDialogOpen] = useState<boolean>(false)
  
  // Edit state
  const [isEditGroup, setIsEditGroup] = useState<boolean>(false)
  const [isEditCard, setIsEditCard] = useState<boolean>(false)
  const [editGroupId, setEditGroupId] = useState<string | null>(null)
  const [editCardId, setEditCardId] = useState<string | null>(null)
  
  const [submitting, setSubmitting] = useState<boolean>(false)
  
  // Selected values for dropdowns in forms
  const [selectedServiceGroup, setSelectedServiceGroup] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedHighValueGroup, setSelectedHighValueGroup] = useState<string>('')
  
  // Form Data
  const [groupFormData, setGroupFormData] = useState<HighValueGroupFormValues>({
    heading: '',
    description: '',
    service_group_id: '',
    service_id: ''
  })

  const [cardFormData, setCardFormData] = useState<HighValueCardFormValues>({
    icon: '',
    title: '',
    high_value_id: '',
      des: '',            // ✅ NEW

  })

  // Filtered services based on selected service group in form
  const filteredServices = services.filter(service => 
    selectedServiceGroup ? service.service_group_id === selectedServiceGroup : true
  )

  // Filtered services for filter dropdown
  const filteredServicesForFilter = selectedFilterServiceGroup !== '' 
    ? services.filter(service => service.service_group_id === selectedFilterServiceGroup)
    : services

  // Filtered high value groups based on selected filters
  const filteredHighValueGroups = highValueGroups.filter(group => {
    if (selectedFilterServiceGroup === '' && selectedFilterService === '') {
      return true
    }
    
    if (selectedFilterServiceGroup !== '' && selectedFilterService === '') {
      return group.service_group_id === selectedFilterServiceGroup
    }
    
    if (selectedFilterService !== '') {
      return group.service_id === selectedFilterService
    }
    
    return true
  })

  // Filtered high value cards for display
  const filteredCards = highValueCards.filter(card => {
    const group = highValueGroups.find(g => g.id === card.high_value_id)
    if (!group) return false
    
    if (selectedFilterServiceGroup === '' && selectedFilterService === '') {
      return true
    }
    
    if (selectedFilterServiceGroup !== '' && selectedFilterService === '') {
      return group.service_group_id === selectedFilterServiceGroup
    }
    
    if (selectedFilterService !== '') {
      return group.service_id === selectedFilterService
    }
    
    return true
  })

  // Fetch all data
  const fetchAllData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      
      // Fetch service groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('service_groups')
        .select('id, title')
        .order('created_at', { ascending: true })

      if (groupsError) throw groupsError
      setServiceGroups(groupsData || [])

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, title, service_group_id')
        .order('created_at', { ascending: true })

      if (servicesError) throw servicesError
      setServices(servicesData || [])

      // Fetch high value groups
      const { data: highValueGroupsData, error: highValueGroupsError } = await supabase
        .from('high_value_group')
        .select('*')
        .order('created_at', { ascending: true })

      if (highValueGroupsError) throw highValueGroupsError
      setHighValueGroups(highValueGroupsData || [])

      // Fetch high value cards
      const { data: highValueCardsData, error: highValueCardsError } = await supabase
        .from('high_value_card')
        .select('*')
        .order('created_at', { ascending: true })

      if (highValueCardsError) throw highValueCardsError
      setHighValueCards(highValueCardsData || [])

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
      // पहला service group (index 0) select करें
      setSelectedFilterServiceGroup(serviceGroups[0].id)
    }
    
    if (services.length > 3 && selectedFilterService === '') {
      // चौथा service (index 3) select करें
      const fourthService = services[3] // 0-based index, so index 3 is fourth item
      if (fourthService) {
        setSelectedFilterService(fourthService.id)
      }
    }
  }, [serviceGroups, services, selectedFilterServiceGroup, selectedFilterService])

  // Reset Forms
  const resetGroupForm = (): void => {
    setIsEditGroup(false)
    setEditGroupId(null)
    setGroupFormData({
      heading: '',
      description: '',
      service_group_id: '',
      service_id: ''
    })
    setSelectedServiceGroup('')
    setSelectedService('')
    setSubmitting(false)
  }

  const resetCardForm = (): void => {
    setIsEditCard(false)
    setEditCardId(null)
    setCardFormData({
      icon: '',
      title: '',
          des: '',          // ✅ NEW

      high_value_id: highValueGroups.length > 0 ? highValueGroups[0].id : ''
    })
    setSelectedHighValueGroup(highValueGroups.length > 0 ? highValueGroups[0].id : '')
    setSubmitting(false)
  }

  // Reset Filters to default (first service group and fourth service)
  const resetFilters = (): void => {
    if (serviceGroups.length > 0) {
      setSelectedFilterServiceGroup(serviceGroups[0].id)
    } else {
      setSelectedFilterServiceGroup('')
    }
    
    if (services.length > 3) {
      const fourthService = services[3]
      if (fourthService) {
        setSelectedFilterService(fourthService.id)
      }
    } else {
      setSelectedFilterService('')
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

  // Get service group of a specific service
  const getServiceGroupOfService = (serviceId: string): string => {
    const service = services.find(s => s.id === serviceId)
    return service ? service.service_group_id : ''
  }

  // Get high value group heading by ID
  const getHighValueGroupHeading = (id: string): string => {
    const group = highValueGroups.find(g => g.id === id)
    return group ? group.heading : 'Unknown Group'
  }

  // High Value Group Handlers
  const handleEditGroup = (group: HighValueGroup): void => {
    setIsEditGroup(true)
    setEditGroupId(group.id)
    setGroupFormData({
      heading: group.heading,
      description: group.description,
      service_group_id: group.service_group_id,
      service_id: group.service_id
    })
    setSelectedServiceGroup(group.service_group_id)
    setSelectedService(group.service_id)
    setGroupDialogOpen(true)
  }

  const handleSubmitGroup = async (
    values: HighValueGroupFormValues,
    formikHelpers: FormikHelpers<HighValueGroupFormValues>
  ): Promise<void> => {
    if (submitting) return

    try {
      setSubmitting(true)

      if (isEditGroup && editGroupId) {
        // Update existing group
        const { error } = await supabase
          .from('high_value_group')
          .update({
            heading: values.heading,
            description: values.description,
            service_group_id: values.service_group_id,
            service_id: values.service_id
          })
          .eq('id', editGroupId)

        if (error) throw new Error(`Failed to update: ${error.message}`)
      } else {
        // Create new group
        const { error } = await supabase
          .from('high_value_group')
          .insert([{
            heading: values.heading,
            description: values.description,
            service_group_id: values.service_group_id,
            service_id: values.service_id
          }])
          .select()
          .single()

        if (error) throw new Error(`Failed to create: ${error.message}`)
      }

      await fetchAllData()
      resetGroupForm()
      setGroupDialogOpen(false)
      formikHelpers.resetForm()
      alert(`High value group ${isEditGroup ? 'updated' : 'created'} successfully!`)
    } catch (error) {
      console.error('Error saving high value group:', error)
      alert(error instanceof Error ? `Error: ${error.message}` : 'Error saving high value group')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteGroup = async (id: string): Promise<void> => {
    if (!window.confirm('Delete this high value group and all its cards?')) return

    try {
      // First delete all associated cards
      const { error: cardsError } = await supabase
        .from('high_value_card')
        .delete()
        .eq('high_value_id', id)

      if (cardsError) throw cardsError

      // Then delete the group
      const { error: groupError } = await supabase
        .from('high_value_group')
        .delete()
        .eq('id', id)

      if (groupError) throw groupError

      await fetchAllData()
      alert('High value group deleted successfully!')
    } catch (error) {
      console.error('Error deleting high value group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  // High Value Card Handlers
  const handleEditCard = (card: HighValueCard): void => {
    setIsEditCard(true)
    setEditCardId(card.id)
    setCardFormData({
      icon: card.icon,
      title: card.title,
          des: card.des,          // ✅ NEW

      high_value_id: card.high_value_id
    })
    setSelectedHighValueGroup(card.high_value_id)
    setCardDialogOpen(true)
  }

  const handleSubmitCard = async (
    values: HighValueCardFormValues,
    formikHelpers: FormikHelpers<HighValueCardFormValues>
  ): Promise<void> => {
    if (submitting) return

    try {
      setSubmitting(true)

      if (isEditCard && editCardId) {
        // Update existing card
        const { error } = await supabase
          .from('high_value_card')
          .update({
            icon: values.icon,
            title: values.title,
                      des: values.des,          // ✅ NEW

            high_value_id: values.high_value_id
          })
          .eq('id', editCardId)

        if (error) throw new Error(`Failed to update: ${error.message}`)
      } else {
        // Create new card
        const { error } = await supabase
          .from('high_value_card')
          .insert([{
            icon: values.icon,
            title: values.title,
                      des: values.des,          // ✅ NEW

            high_value_id: values.high_value_id
          }])
          .select()
          .single()

        if (error) throw new Error(`Failed to create: ${error.message}`)
      }

      await fetchAllData()
      resetCardForm()
      setCardDialogOpen(false)
      formikHelpers.resetForm()
      alert(`High value card ${isEditCard ? 'updated' : 'created'} successfully!`)
    } catch (error) {
      console.error('Error saving high value card:', error)
      alert(error instanceof Error ? `Error: ${error.message}` : 'Error saving high value card')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCard = async (id: string): Promise<void> => {
    if (!window.confirm('Delete this high value card?')) return

    try {
      const { error } = await supabase
        .from('high_value_card')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchAllData()
      alert('High value card deleted successfully!')
    } catch (error) {
      console.error('Error deleting high value card:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header with Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              High Value Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Organize premium features and benefits
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => { resetGroupForm(); setGroupDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add High Value Group
            </Button>

            <Button
              variant="outline"
              onClick={() => { resetCardForm(); setCardDialogOpen(true); }}
              disabled={highValueGroups.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" /> Add High Value Card
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              {/* Service Group Filter - By Default पहला group selected होगा */}
              <div className="flex-1">
                <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Service Group</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedFilterServiceGroup 
                        ? getServiceGroupName(selectedFilterServiceGroup)
                        : serviceGroups.length > 0 
                          ? getServiceGroupName(serviceGroups[0].id)
                          : "Select service group"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {serviceGroups.map((group) => (
                      <DropdownMenuItem
                        key={group.id}
                        onClick={() => {
                          setSelectedFilterServiceGroup(group.id)
                          // Reset service filter when group changes
                          setSelectedFilterService('')
                        }}
                      >
                        {group.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Service Filter - By Default चौथा service selected होगा */}
              <div className="flex-1">
                <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Service</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                    >
                      {selectedFilterService 
                        ? getServiceName(selectedFilterService)
                        : services.length > 3
                          ? getServiceName(services[3].id)
                          : services.length > 0
                            ? getServiceName(services[0].id)
                            : "Select service"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setSelectedFilterService('')}>
                      All Services
                    </DropdownMenuItem>
                    {filteredServicesForFilter.map((service) => (
                      <DropdownMenuItem
                        key={service.id}
                        onClick={() => setSelectedFilterService(service.id)}
                      >
                        {service.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Show All Button */}
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
                <Layers className="mr-2 h-4 w-4" />
                Show All
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedFilterServiceGroup !== '' || selectedFilterService !== '') && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Showing:</span>
              {selectedFilterServiceGroup && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  Service Group: {getServiceGroupName(selectedFilterServiceGroup)}
                </span>
              )}
              {selectedFilterService && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Service: {getServiceName(selectedFilterService)}
                </span>
              )}
            </div>
          )}
          
          {/* Default Selection Info */}
          {selectedFilterServiceGroup !== '' && selectedFilterService !== '' && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Default Selection:</span> First Service Group ({getServiceGroupName(selectedFilterServiceGroup)}) 
              and Fourth Service ({getServiceName(selectedFilterService)})
            </div>
          )}
        </div>
      </div>

      {/* High Value Groups Display */}
      <div className="space-y-8">
        {filteredHighValueGroups.length > 0 ? (
          filteredHighValueGroups.map((group) => (
            <div key={group.id} className="my-5">
              {/* Group Header */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {group.heading}
                    </h2>
                    <div className="flex gap-2 justify-end items-center">
                      <Button
                        variant="update"
                        size="sm"
                        onClick={() => handleEditGroup(group)}
                        className="whitespace-nowrap"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="error"
                        size="sm"
                        onClick={() => handleDeleteGroup(group.id)}
                        className="whitespace-nowrap"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Group Info */}
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <Layers className="h-3 w-3" />
                    {getServiceGroupName(group.service_group_id)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <Server className="h-3 w-3" />
                    {getServiceName(group.service_id)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredCards.filter(card => card.high_value_id === group.id).length} cards
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 w-full">
                  {group.description}
                </p>
              </div>
              
              {/* Add Card Button */}
              <div className='flex item justify-end mb-6'>
                <Button
                  variant="default"
                  onClick={() => {
                    resetCardForm()
                    setSelectedHighValueGroup(group.id)
                    setCardDialogOpen(true)
                  }}
                  className="whitespace-nowrap"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Card to this Group
                </Button>
              </div>

              {/* Cards Display */}
              <div>
                {filteredCards.filter(card => card.high_value_id === group.id).length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCards
                      .filter(card => card.high_value_id === group.id)
                      .map((card) => (
                        <div
                          key={card.id}
                          className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500"
                        >
                          <div className="h-full rounded-2xl p-6 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-xl shadow-lg dark:shadow-lg hover:shadow-2xl transition-all">
                            {/* Icon with Gradient Background */}
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-sky-950 text-white group-hover:scale-110 transition-transform duration-300">
                              <div 
                                dangerouslySetInnerHTML={{
                                  __html: `<i class="${card.icon} text-2xl"></i>`
                                }}
                                className="flex items-center justify-center w-full h-full"
                              />
                            </div>

                            {/* Content */}
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {card.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
  {card.des}
</p>

                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                              Card ID: {card.id}
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditCard(card)}
                              >
                                <Edit className="mr-2 h-3 w-3" />
                                Edit
                              </Button>
                              
                              <Button
                                variant="error"
                                size="sm"
                                onClick={() => handleDeleteCard(card.id)}
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
                  <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950/50">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      No premium cards yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Add cards to showcase high value features
                    </p>
                    <Button
                      className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                      onClick={() => {
                        resetCardForm()
                        setSelectedHighValueGroup(group.id)
                        setCardDialogOpen(true)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Card
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950/50">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedFilterServiceGroup !== '' || selectedFilterService !== ''
                ? 'No high value groups found for selected filters'
                : 'No high value groups yet'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {selectedFilterServiceGroup !== '' || selectedFilterService !== ''
                ? 'Try changing your filters or create a new group'
                : 'Create groups to organize premium features and benefits'}
            </p>
            <Button
              className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
              onClick={() => {
                resetGroupForm()
                setGroupDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Group
            </Button>
          </div>
        )}
      </div>

      {/* Modals (Same as before) */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditGroup ? 'Edit High Value Group' : 'Create High Value Group'}
            </DialogTitle>
          </DialogHeader>
          
          <Formik
            initialValues={groupFormData}
            validationSchema={highValueGroupValidationSchema}
            onSubmit={handleSubmitGroup}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, values, setFieldValue }) => (
              <Form className="space-y-4">
                {/* Heading */}
                <div>
                  <Label htmlFor="heading">Heading *</Label>
                  <Field
                    as={Input}
                    id="heading"
                    name="heading"
                    placeholder="e.g., Core Features"
                    className={errors.heading && touched.heading ? 'border-red-500' : ''}
                  />
                  <ErrorMessage
                    name="heading"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe the high value group..."
                    className={`w-full rounded-md border p-2 ${errors.description && touched.description ? 'border-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Service Group Dropdown */}
                <div>
                  <Label>Service Group *</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedServiceGroup ? getServiceGroupName(selectedServiceGroup) : "Select service group"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {serviceGroups.map((group) => (
                        <DropdownMenuItem
                          key={group.id}
                          onClick={() => {
                            const groupId = group.id
                            setFieldValue('service_group_id', groupId)
                            setSelectedServiceGroup(groupId)
                            setFieldValue('service_id', '')
                            setSelectedService('')
                          }}
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
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Service Dropdown */}
                <div>
                  <Label>Service *</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        disabled={!selectedServiceGroup}
                      >
                        {selectedService ? getServiceName(selectedService) : "Select service"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {filteredServices.map((service) => (
                        <DropdownMenuItem
                          key={service.id}
                          onClick={() => {
                            setFieldValue('service_id', service.id)
                            setSelectedService(service.id)
                          }}
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
                    className="mt-1 text-sm text-red-500"
                  />
                  {!selectedServiceGroup && (
                    <p className="mt-1 text-xs text-gray-500">
                      Please select a service group first
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setGroupDialogOpen(false)
                      resetGroupForm()
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (isEditGroup ? 'Update' : 'Create')}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditCard ? 'Edit High Value Card' : 'Create High Value Card'}
            </DialogTitle>
          </DialogHeader>
          
          <Formik
            initialValues={{
              ...cardFormData,
              high_value_id: selectedHighValueGroup || (highValueGroups.length > 0 ? highValueGroups[0].id : '')
            }}
            validationSchema={highValueCardValidationSchema}
            onSubmit={handleSubmitCard}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, values, setFieldValue }) => (
              <Form className="space-y-4">
                {/* High Value Group Dropdown */}
                <div>
                  <Label>High Value Group *</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {values.high_value_id ? getHighValueGroupHeading(values.high_value_id) : "Select high value group"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {highValueGroups.map((group) => (
                        <DropdownMenuItem
                          key={group.id}
                          onClick={() => {
                            setFieldValue('high_value_id', group.id)
                            setSelectedHighValueGroup(group.id)
                          }}
                        >
                          {group.heading}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <input
                    type="hidden"
                    name="high_value_id"
                    value={values.high_value_id}
                  />
                  <ErrorMessage
                    name="high_value_id"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="e.g., 24/7 Support"
                    className={errors.title && touched.title ? 'border-red-500' : ''}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Icon */}
                <div>
                  <Label htmlFor="icon">FontAwesome Icon Class *</Label>
                  <Field
                    as={Input}
                    id="icon"
                    name="icon"
                    placeholder="e.g., fa-solid fa-headset"
                    className={errors.icon && touched.icon ? 'border-red-500' : ''}
                  />
                  <ErrorMessage
                    name="icon"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use FontAwesome classes like fa-solid fa-headset or fa-regular fa-clock
                  </p>
                </div>
                {/* Description Field - ✅ NEW */}
<div>
  <Label htmlFor="des">Description *</Label>
  <Field
    as="textarea"
    id="des"
    name="des"
                    rows={3}
                        value={values.des || ''} // ✅ FIX: Ensure value is never null

    placeholder="Describe this feature..."
    className={`w-full rounded-md border p-2 ${errors.des && touched.des ? 'border-red-500' : ''}`}
  />
  <ErrorMessage
    name="des"
    component="div"
    className="mt-1 text-sm text-red-500"
  />
</div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCardDialogOpen(false)
                      resetCardForm()
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (isEditCard ? 'Update' : 'Create')}
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

export default HighValueManagement