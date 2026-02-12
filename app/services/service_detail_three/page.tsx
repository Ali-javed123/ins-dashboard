'use client'

import { FC, useCallback, useEffect, useState } from 'react'
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

interface ServiceDetailThree {
  id: string
  created_at: string
  heading: string
  description: string
  icon: string
  service_id: string
  service_group_id: string
}

interface ServiceDetailThreeFormValues {
  heading: string
  description: string
  icon: string
  service_id: string
  service_group_id: string
}

// Validation Schema
const serviceDetailThreeValidationSchema = Yup.object({
  heading: Yup.string()
    .min(2, 'Heading must be at least 2 characters')
    .required('Heading is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  icon: Yup.string()
    .required('Icon class is required'),
  service_group_id: Yup.string()
    .required('Service group is required'),
  service_id: Yup.string()
    .required('Service is required')
})

const ServiceDetailThreeManagement: FC = () => {
  // State
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [serviceDetails, setServiceDetails] = useState<ServiceDetailThree[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  // Filter State - By default first service group and first service selected
  const [selectedFilterServiceGroup, setSelectedFilterServiceGroup] = useState<string>('')
  const [selectedFilterService, setSelectedFilterService] = useState<string>('')
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  
  // Edit state
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [submitting, setSubmitting] = useState<boolean>(false)
  
  // Selected values for dropdowns in form
  const [selectedServiceGroup, setSelectedServiceGroup] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  
  // Form Data
  const [formData, setFormData] = useState<ServiceDetailThreeFormValues>({
    heading: '',
    description: '',
    icon: '',
    service_id: '',
    service_group_id: ''
  })

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

      // Fetch service detail three
      const { data: serviceDetailsData, error: serviceDetailsError } = await supabase
        .from('service_detail_three')
        .select('*')
        .order('created_at', { ascending: true })

      if (serviceDetailsError) throw serviceDetailsError
      setServiceDetails(serviceDetailsData || [])

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

  // Set default filters when data loads - by default show first service group and first service
  useEffect(() => {
    if (serviceGroups.length > 0 && selectedFilterServiceGroup === '') {
      setSelectedFilterServiceGroup(serviceGroups[0].id)
    }
    
    if (services.length > 0 && selectedFilterService === '') {
      // Filter services based on selected service group
      const servicesInGroup = services.filter(s => s.service_group_id === selectedFilterServiceGroup)
      if (servicesInGroup.length > 0) {
        setSelectedFilterService(servicesInGroup[0].id)
      } else if (services.length > 0) {
        setSelectedFilterService(services[0].id)
      }
    }
  }, [serviceGroups, services, selectedFilterServiceGroup, selectedFilterService])

  // Reset Form
  const resetForm = (): void => {
    setIsEdit(false)
    setEditId(null)
    setFormData({
      heading: '',
      description: '',
      icon: '',
      service_id: '',
      service_group_id: ''
    })
    setSelectedServiceGroup('')
    setSelectedService('')
    setSubmitting(false)
  }

  // Reset Filters to default (first service group and first service)
  const resetFilters = (): void => {
    if (serviceGroups.length > 0) {
      setSelectedFilterServiceGroup(serviceGroups[0].id)
      
      // Also set first service in that group
      const servicesInGroup = services.filter(s => s.service_group_id === serviceGroups[0].id)
      if (servicesInGroup.length > 0) {
        setSelectedFilterService(servicesInGroup[0].id)
      } else if (services.length > 0) {
        setSelectedFilterService(services[0].id)
      }
    } else {
      setSelectedFilterServiceGroup('')
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

  // Handle Edit
  const handleEdit = (detail: ServiceDetailThree): void => {
    setIsEdit(true)
    setEditId(detail.id)
    setFormData({
      heading: detail.heading,
      description: detail.description,
      icon: detail.icon,
      service_id: detail.service_id,
      service_group_id: detail.service_group_id
    })
    setSelectedServiceGroup(detail.service_group_id)
    setSelectedService(detail.service_id)
    setDialogOpen(true)
  }

  // Handle Submit (Add/Update)
  const handleSubmit = async (
    values: ServiceDetailThreeFormValues,
    formikHelpers: FormikHelpers<ServiceDetailThreeFormValues>
  ): Promise<void> => {
    if (submitting) return

    try {
      setSubmitting(true)

      if (isEdit && editId) {
        // Update existing record
        const { error } = await supabase
          .from('service_detail_three')
          .update({
            heading: values.heading,
            description: values.description,
            icon: values.icon,
            service_id: values.service_id,
            service_group_id: values.service_group_id
          })
          .eq('id', editId)

        if (error) throw new Error(`Failed to update: ${error.message}`)
      } else {
        // Create new record
        const { error } = await supabase
          .from('service_detail_three')
          .insert([{
            heading: values.heading,
            description: values.description,
            icon: values.icon,
            service_id: values.service_id,
            service_group_id: values.service_group_id
          }])
          .select()
          .single()

        if (error) throw new Error(`Failed to create: ${error.message}`)
      }

      await fetchAllData()
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
    if (!window.confirm('Delete this service detail?')) return

    try {
      const { error } = await supabase
        .from('service_detail_three')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchAllData()
      alert('Service detail deleted successfully!')
    } catch (error) {
      console.error('Error deleting service detail:', error)
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
              Service Details Three Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage service details with icons and descriptions
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Service Detail
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
              {/* Service Group Filter */}
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

              {/* Service Filter */}
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
                        : filteredServicesForFilter.length > 0
                          ? getServiceName(filteredServicesForFilter[0].id)
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
        </div>
      </div>

      {/* Service Details Display */}
      <div className="space-y-6">
        {filteredServiceDetails.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServiceDetails.map((detail) => (
              <div
                key={detail.id}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500"
              >
                <div className="h-full rounded-2xl p-6 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-xl shadow-lg dark:shadow-lg hover:shadow-2xl transition-all">
                        {/* Header with Actions */}
                          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-sky-950 text-white group-hover:scale-110 transition-transform duration-300">
                    <div 
                      dangerouslySetInnerHTML={{
                        __html: `<i class="${detail.icon} text-2xl"></i>`
                      }}
                      className="flex items-center justify-center w-full h-full"
                    />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {detail.heading}
                      </h3>
                      
                      {/* Service Info Badges */}
                      
                    </div>
                    
                    
                  </div>

                  {/* Icon with Gradient Background */}
                

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {detail.description}
                  </p>
                  
                  
                        <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(detail)}
                        className="whitespace-nowrap"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="error"
                        size="sm"
                        onClick={() => handleDelete(detail.id)}
                        className="whitespace-nowrap"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 p-4 text-center dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950/50">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedFilterServiceGroup !== '' || selectedFilterService !== ''
                ? 'No service details found for selected filters'
                : 'No service details yet'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {selectedFilterServiceGroup !== '' || selectedFilterService !== ''
                ? 'Try changing your filters or create a new service detail'
                : 'Create service details to showcase your services'}
            </p>
            <Button
              className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Service Detail
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Service Detail' : 'Create Service Detail'}
            </DialogTitle>
          </DialogHeader>
          
          <Formik
            initialValues={formData}
            validationSchema={serviceDetailThreeValidationSchema}
            onSubmit={handleSubmit}
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
                    placeholder="Describe the service detail..."
                    className={`w-full rounded-md border p-2 ${errors.description && touched.description ? 'border-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="description"
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
                    placeholder="e.g., fa-solid fa-rocket"
                    className={errors.icon && touched.icon ? 'border-red-500' : ''}
                  />
                  <ErrorMessage
                    name="icon"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use FontAwesome classes like fa-solid fa-rocket or fa-regular fa-star
                  </p>
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
                      setDialogOpen(false)
                      resetForm()
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
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

export default ServiceDetailThreeManagement