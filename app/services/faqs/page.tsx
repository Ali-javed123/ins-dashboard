// app/components/service-faq-manager.tsx
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
import { Formik, Form, Field, ErrorMessage, FieldArray, FormikHelpers, FormikProps,FormikErrors } from 'formik'
import * as Yup from 'yup'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  AlertCircle, 
  Filter, 
  ChevronDown, 
    ChevronUp,
  ChevronRight,
  Folder,
  Grid,
  Check,
  Loader2
} from 'lucide-react'
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
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// ============ TYPES ============

// Service Groups Table (Reference)
interface ServiceGroup {
  id: string
  title: string
  slug: string
  created_at: string
}

// Services Table (Reference)
interface Service {
  id: string
  title: string
  slug: string
  created_at: string
  service_group_id: string
  icon: string
  image: string | null
}

// Service Detail FAQ Group Table (Parent)
interface ServiceDetailFAQGroup {
  id: string
  created_at: string
  heading: string
  service_id: string
  service_group_id: string
  service_groups?: ServiceGroup
  services?: Service
  service_detail_faqs: ServiceDetailFAQ[]
}

// Service Detail FAQ Table (Child)
interface ServiceDetailFAQ {
  id: string
  created_at: string
  heading: string
  des: string
  faq_group_id: string
  list: FAQListItem[]
}

interface FAQListItem {
  answer: string
}

// ============ FORM VALUE TYPES ============

// For Service Detail FAQ Group Form (Parent)
interface ServiceDetailFAQGroupFormValues {
  heading: string
  service_id: string
  service_group_id: string
  service_detail_faqs: ServiceDetailFAQFormValues[]
}

// For Service Detail FAQ Form (Child within Parent)
interface ServiceDetailFAQFormValues {
  heading: string
  des: string
  list: FAQListItem[]
}

// For creating/editing individual Service Detail FAQ (Child)
interface ServiceDetailFAQCreateFormValues {
  heading: string
  des: string
  faq_group_id: string
  list: FAQListItem[]
}

// ============ FILTER TYPES ============

interface FilterState {
  serviceGroupIds: string[]
  serviceIds: string[]
}

// ============ ERROR TYPES ============

interface FAQItemErrors {
  answer?: string
}

interface FAQListErrors {
  list?: FAQItemErrors[] | string
}

interface ServiceDetailFAQFormErrors {
  heading?: string
  des?: string
  list?: FAQListErrors[] | string
}

// ============ MAIN COMPONENT ============

const ServiceFAQManager: FC = () => {
  // ============ STATE MANAGEMENT ============
  
  // Reference data
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])
  const [services, setServices] = useState<Service[]>([])
  
  // Main data
  const [serviceDetailFAQGroups, setServiceDetailFAQGroups] = useState<ServiceDetailFAQGroup[]>([])
  const [filteredGroups, setFilteredGroups] = useState<ServiceDetailFAQGroup[]>([])
  const [displayedGroups, setDisplayedGroups] = useState<ServiceDetailFAQGroup[]>([])
  
  // UI States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  // Parent Group Modal States
  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [isGroupEdit, setIsGroupEdit] = useState(false)
  const [editGroupId, setEditGroupId] = useState<string | null>(null)
  
  // Child Modal States
  const [faqModalOpen, setFaqModalOpen] = useState(false)
  const [isFaqEdit, setIsFaqEdit] = useState(false)
  const [editFaqId, setEditFaqId] = useState<string | null>(null)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  
  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    serviceGroupIds: [],
    serviceIds: []
  })
  
  // Display Toggle State
  const [showAllData, setShowAllData] = useState(false)
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({})
  
  // ============ INITIAL FORM VALUES ============
  
  const [initialGroupFormValues, setInitialGroupFormValues] = useState<ServiceDetailFAQGroupFormValues>({
    heading: '',
    service_id: '',
    service_group_id: '',
    service_detail_faqs: [{
      heading: '',
      des: '',
      list: [{ answer: '' }]
    }]
  })

  const [initialFaqFormValues, setInitialFaqFormValues] = useState<ServiceDetailFAQCreateFormValues>({
    heading: '',
    des: '',
    faq_group_id: '',
    list: [{ answer: '' }]
  })

  // ============ VALIDATION SCHEMAS ============

  const faqItemValidationSchema = Yup.object({
    answer: Yup.string()
      .min(2, 'Answer must be at least 2 characters')
      .required('Answer is required')
  })

  const childFAQValidationSchema = Yup.object({
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .max(100, 'Heading must be less than 100 characters')
      .required('Heading is required'),
    des: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters')
      .required('Description is required'),
    list: Yup.array().of(
      Yup.object().shape({
        answer: Yup.string()
          .min(2, 'Answer must be at least 2 characters')
          .required('Answer is required')
      })
    ).min(1, 'At least one answer is required')
  })

  const groupValidationSchema = Yup.object({
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .max(100, 'Heading must be less than 100 characters')
      .required('Heading is required'),
    service_group_id: Yup.string().required('Service group is required'),
    service_id: Yup.string().required('Service is required'),
    service_detail_faqs: Yup.array()
      .of(childFAQValidationSchema)
      .min(1, 'At least one FAQ detail is required')
  })

  const faqCreateValidationSchema = Yup.object({
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .max(100, 'Heading must be less than 100 characters')
      .required('Heading is required'),
    des: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters')
      .required('Description is required'),
    faq_group_id: Yup.string().required('Parent group is required'),
    list: Yup.array().of(
      Yup.object().shape({
        answer: Yup.string()
          .min(2, 'Answer must be at least 2 characters')
          .required('Answer is required')
      })
    ).min(1, 'At least one answer is required')
  })

  // ============ FETCH DATA ============

  const fetchServiceGroups = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('service_groups')
        .select('id, title, slug, created_at')
        .order('title', { ascending: true })

      if (error) throw error
      setServiceGroups(data || [])
    } catch (error) {
      console.error('Error fetching service groups:', error)
      setError('Failed to load service groups')
    }
  }, [])

  const fetchServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, slug, created_at, service_group_id, icon, image')
        .order('title', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setError('Failed to load services')
    }
  }, [])

  const fetchServiceDetailFAQGroups = useCallback(async () => {
    try {
      setLoading(true)
      
      const { data: groups, error: groupsError } = await supabase
        .from('service_detail_faq_group')
        .select('*')
        .order('created_at', { ascending: false })

      if (groupsError) throw groupsError

      if (!groups || groups.length === 0) {
        setServiceDetailFAQGroups([])
        setFilteredGroups([])
        setDisplayedGroups([])
        return
      }

      const groupsWithDetails = await Promise.all(
        groups.map(async (group) => {
          // Fetch service group details
          const { data: serviceGroup } = await supabase
            .from('service_groups')
            .select('*')
            .eq('id', group.service_group_id)
            .single()

          // Fetch service details
          const { data: service } = await supabase
            .from('services')
            .select('*')
            .eq('id', group.service_id)
            .single()

          // Fetch child FAQs
          const { data: serviceDetailFaqs } = await supabase
            .from('service_detail_faq')
            .select('*')
            .eq('faq_group_id', group.id)
            .order('created_at', { ascending: true })

          return {
            ...group,
            service_groups: serviceGroup || undefined,
            services: service || undefined,
            service_detail_faqs: serviceDetailFaqs?.map(faq => ({
              ...faq,
              list: faq.list || []
            })) || []
          }
        })
      )

      setServiceDetailFAQGroups(groupsWithDetails)
      setFilteredGroups(groupsWithDetails)
      
      if (groupsWithDetails.length > 0) {
        setDisplayedGroups([groupsWithDetails[0]])
      } else {
        setDisplayedGroups([])
      }
      
      setError(null)
    } catch (error) {
      console.error('Error fetching service detail FAQ groups:', error)
      setError('Failed to load service detail FAQ groups.')
    } finally {
      setLoading(false)
    }
  }, [])

  // ============ FILTER EFFECT ============
const isListErrorsArray = (
  listErrors: string | FormikErrors<{ answer: string }>[] | undefined
): listErrors is FormikErrors<{ answer: string }>[] => {
  return Array.isArray(listErrors);
};

  useEffect(() => {
    if (serviceDetailFAQGroups.length === 0) return

    let filtered = serviceDetailFAQGroups

    if (filters.serviceGroupIds.length > 0) {
      filtered = filtered.filter(group => 
        filters.serviceGroupIds.includes(group.service_group_id)
      )
    }

    if (filters.serviceIds.length > 0) {
      filtered = filtered.filter(group => 
        filters.serviceIds.includes(group.service_id)
      )
    }

    setFilteredGroups(filtered)
    
    if (filters.serviceGroupIds.length > 0 || filters.serviceIds.length > 0) {
      setShowAllData(true)
      setDisplayedGroups(filtered)
    } else {
      if (filtered.length > 0) {
        setDisplayedGroups([filtered[0]])
      } else {
        setDisplayedGroups([])
      }
      setShowAllData(false)
    }
  }, [filters, serviceDetailFAQGroups])

  // ============ FILTER HANDLERS ============

  const handleServiceGroupFilter = (groupId: string, checked: boolean) => {
    setFilters(prev => {
      const newServiceGroupIds = checked 
        ? [...prev.serviceGroupIds, groupId]
        : prev.serviceGroupIds.filter(id => id !== groupId)
      
      const servicesInGroup = services.filter(s => s.service_group_id === groupId)
      const serviceIdsToRemove = servicesInGroup.map(s => s.id)
      
      const newServiceIds = prev.serviceIds.filter(id => 
        !serviceIdsToRemove.includes(id)
      )

      return {
        ...prev,
        serviceGroupIds: newServiceGroupIds,
        serviceIds: newServiceIds
      }
    })
  }

  const handleServiceFilter = (serviceId: string, checked: boolean) => {
    setFilters(prev => {
      const newServiceIds = checked 
        ? [...prev.serviceIds, serviceId]
        : prev.serviceIds.filter(id => id !== serviceId)
      
      const service = services.find(s => s.id === serviceId)
      if (service && checked) {
        const newServiceGroupIds = prev.serviceGroupIds.includes(service.service_group_id)
          ? prev.serviceGroupIds
          : [...prev.serviceGroupIds, service.service_group_id]
        
        return {
          serviceGroupIds: newServiceGroupIds,
          serviceIds: newServiceIds
        }
      }
      
      return {
        ...prev,
        serviceIds: newServiceIds
      }
    })
  }

  const clearAllFilters = () => {
    setFilters({
      serviceGroupIds: [],
      serviceIds: []
    })
    if (filteredGroups.length > 0) {
      setDisplayedGroups([filteredGroups[0]])
    }
    setShowAllData(false)
  }

  const getFilteredServices = () => {
    if (filters.serviceGroupIds.length === 0) {
      return services
    }
    return services.filter(service => 
      filters.serviceGroupIds.includes(service.service_group_id)
    )
  }

  // ============ DISPLAY TOGGLE ============

  const toggleShowAllData = () => {
    if (showAllData) {
      if (filteredGroups.length > 0) {
        setDisplayedGroups([filteredGroups[0]])
      }
      setShowAllData(false)
    } else {
      setDisplayedGroups(filteredGroups)
      setShowAllData(true)
    }
  }

  const loadMoreData = () => {
    if (displayedGroups.length < filteredGroups.length) {
      const nextIndex = displayedGroups.length
      const nextGroup = filteredGroups[nextIndex]
      if (nextGroup) {
        setDisplayedGroups(prev => [...prev, nextGroup])
      }
    }
  }

  // ============ HELPER FUNCTIONS ============

  const getServiceGroupName = (serviceGroupId: string): string => {
    const group = serviceGroups.find(g => g.id === serviceGroupId)
    return group?.title || 'Unknown Group'
  }

  const getServiceName = (serviceId: string): string => {
    const service = services.find(s => s.id === serviceId)
    return service?.title || 'Unknown Service'
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const toggleExpansion = (faqId: string, itemIndex: number): void => {
    const key = `${faqId}-${itemIndex}`
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const hasAnswerError = (errors: ServiceDetailFAQFormErrors, groupIndex: number, itemIndex: number): boolean => {
    if (!errors.list || typeof errors.list === 'string') return false
    
    const listErrors = errors.list[groupIndex]
    if (!listErrors || typeof listErrors === 'string') return false
    
    const listArrayErrors = listErrors.list
    if (!listArrayErrors || typeof listArrayErrors === 'string') return false
    
    const answerError = listArrayErrors[itemIndex]?.answer
    return !!answerError
  }

  // ============ RESET FUNCTIONS ============

  const resetGroupForm = () => {
    setIsGroupEdit(false)
    setEditGroupId(null)
    setInitialGroupFormValues({
      heading: '',
      service_id: '',
      service_group_id: '',
      service_detail_faqs: [{
        heading: '',
        des: '',
        list: [{ answer: '' }]
      }]
    })
    setGroupModalOpen(false)
  }

  const resetFaqForm = () => {
    setIsFaqEdit(false)
    setEditFaqId(null)
    setSelectedParentId(null)
    setInitialFaqFormValues({
      heading: '',
      des: '',
      faq_group_id: '',
      list: [{ answer: '' }]
    })
    setFaqModalOpen(false)
  }

  // ============ EDIT HANDLERS ============

  const handleEditGroup = (group: ServiceDetailFAQGroup) => {
    setIsGroupEdit(true)
    setEditGroupId(group.id)
    
    const formValues: ServiceDetailFAQGroupFormValues = {
      heading: group.heading,
      service_group_id: group.service_group_id,
      service_id: group.service_id,
      service_detail_faqs: group.service_detail_faqs.map(faq => ({
        heading: faq.heading,
        des: faq.des,
        list: faq.list.length > 0 ? faq.list : [{ answer: '' }]
      }))
    }

    setInitialGroupFormValues(formValues)
    setGroupModalOpen(true)
  }

  const handleEditFaq = (faq: ServiceDetailFAQ, parentId: string) => {
    setIsFaqEdit(true)
    setEditFaqId(faq.id)
    setSelectedParentId(parentId)
    
    setInitialFaqFormValues({
      heading: faq.heading,
      des: faq.des,
      faq_group_id: parentId,
      list: faq.list.length > 0 ? faq.list : [{ answer: '' }]
    })
    
    setFaqModalOpen(true)
  }

  const handleAddFaq = (parentId: string) => {
    setIsFaqEdit(false)
    setEditFaqId(null)
    setSelectedParentId(parentId)
    
    setInitialFaqFormValues({
      heading: '',
      des: '',
      faq_group_id: parentId,
      list: [{ answer: '' }]
    })
    
    setFaqModalOpen(true)
  }

  // ============ CRUD OPERATIONS FOR PARENT GROUP ============

  const handleSubmitGroup = async (
    values: ServiceDetailFAQGroupFormValues,
    formikHelpers: FormikHelpers<ServiceDetailFAQGroupFormValues>
  ): Promise<void> => {
    if (submitting) return

    try {
      setSubmitting(true)

      const { data: groupData, error: groupError } = await supabase
        .from('service_detail_faq_group')
        .insert([{
          heading: values.heading,
          service_group_id: values.service_group_id,
          service_id: values.service_id
        }])
        .select()
        .single()

      if (groupError) throw groupError

      const serviceDetailFaqs = values.service_detail_faqs.map((faq) => ({
        heading: faq.heading,
        des: faq.des,
        faq_group_id: groupData.id,
        list: faq.list
      }))

      const { error: childError } = await supabase
        .from('service_detail_faq')
        .insert(serviceDetailFaqs)

      if (childError) throw childError

      await fetchServiceDetailFAQGroups()
      resetGroupForm()
      formikHelpers.resetForm()
    } catch (error) {
      console.error('Error creating service detail FAQ group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateGroup = async (
    values: ServiceDetailFAQGroupFormValues,
    formikHelpers: FormikHelpers<ServiceDetailFAQGroupFormValues>
  ): Promise<void> => {
    if (!editGroupId || submitting) return

    try {
      setSubmitting(true)
      
      const { error: groupError } = await supabase
        .from('service_detail_faq_group')
        .update({
          heading: values.heading,
          service_group_id: values.service_group_id,
          service_id: values.service_id
        })
        .eq('id', editGroupId)

      if (groupError) throw groupError

      const { error: deleteError } = await supabase
        .from('service_detail_faq')
        .delete()
        .eq('faq_group_id', editGroupId)

      if (deleteError) throw deleteError

      const serviceDetailFaqs = values.service_detail_faqs.map((faq) => ({
        heading: faq.heading,
        des: faq.des,
        faq_group_id: editGroupId,
        list: faq.list
      }))

      const { error: childError } = await supabase
        .from('service_detail_faq')
        .insert(serviceDetailFaqs)

      if (childError) throw childError

      await fetchServiceDetailFAQGroups()
      resetGroupForm()
      formikHelpers.resetForm()
    } catch (error) {
      console.error('Error updating service detail FAQ group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteGroup = async (groupId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this FAQ group and all its FAQs?')) return

    try {
      setSubmitting(true)
      
      const { error: childError } = await supabase
        .from('service_detail_faq')
        .delete()
        .eq('faq_group_id', groupId)

      if (childError) throw childError

      const { error: groupError } = await supabase
        .from('service_detail_faq_group')
        .delete()
        .eq('id', groupId)

      if (groupError) throw groupError

      await fetchServiceDetailFAQGroups()
    } catch (error) {
      console.error('Error deleting service detail FAQ group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  // ============ CRUD OPERATIONS FOR CHILD (SERVICE_DETAIL_FAQ) ============
  const [expandedFaqs, setExpandedFaqs] = useState<{[key: string]: boolean}>({})

  // Toggle FAQ expansion
  const toggleFaqExpansion = (faqId: string) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }))
  }

  const handleSubmitFaq = async (
    values: ServiceDetailFAQCreateFormValues,
    formikHelpers: FormikHelpers<ServiceDetailFAQCreateFormValues>
  ): Promise<void> => {
    if (submitting) return

    try {
      setSubmitting(true)
      
      const { error } = await supabase
        .from('service_detail_faq')
        .insert([{
          heading: values.heading,
          des: values.des,
          faq_group_id: values.faq_group_id,
          list: values.list
        }])

      if (error) throw error

      await fetchServiceDetailFAQGroups()
      resetFaqForm()
      formikHelpers.resetForm()
    } catch (error) {
      console.error('Error creating service detail FAQ:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateFaq = async (
    values: ServiceDetailFAQCreateFormValues,
    formikHelpers: FormikHelpers<ServiceDetailFAQCreateFormValues>
  ): Promise<void> => {
    if (!editFaqId || submitting) return

    try {
      setSubmitting(true)
      
      const { error } = await supabase
        .from('service_detail_faq')
        .update({
          heading: values.heading,
          des: values.des,
          list: values.list
        })
        .eq('id', editFaqId)

      if (error) throw error

      await fetchServiceDetailFAQGroups()
      resetFaqForm()
      formikHelpers.resetForm()
    } catch (error) {
      console.error('Error updating service detail FAQ:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteFaq = async (faqId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return

    try {
      setSubmitting(true)
      
      const { error } = await supabase
        .from('service_detail_faq')
        .delete()
        .eq('id', faqId)

      if (error) throw error

      await fetchServiceDetailFAQGroups()
    } catch (error) {
      console.error('Error deleting service detail FAQ:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  // ============ INITIAL LOAD ============

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        await fetchServiceGroups()
        await fetchServices()
        await fetchServiceDetailFAQGroups()
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load data. Please check console for details.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [fetchServiceGroups, fetchServices, fetchServiceDetailFAQGroups])

  // ============ LOADING STATE ============

  if (loading && !serviceDetailFAQGroups.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading service FAQ details...</p>
        </div>
      </div>
    )
  }

  // ============ RENDER ============

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service FAQ Manager</h1>
          <p className="text-muted-foreground mt-2">
            Manage service FAQ groups and their individual FAQ items
          </p>
        </div>
        <Button 
          onClick={() => {
            resetGroupForm()
            setGroupModalOpen(true)
          }} 
          disabled={loading || submitting}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ Group
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {(filters.serviceGroupIds.length > 0 || filters.serviceIds.length > 0) && (
            <Badge variant="secondary" className="ml-2">
              {filteredGroups.length} of {serviceDetailFAQGroups.length} groups
            </Badge>
          )}
          {!showAllData && displayedGroups.length > 0 && (
            <Badge variant="outline" className="ml-2">
              Showing 1 of {filteredGroups.length} groups
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Service Group Filter Dropdown - SHADCN UI DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Service Groups
                {filters.serviceGroupIds.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.serviceGroupIds.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Service Group</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-60">
                <DropdownMenuGroup>
                  {serviceGroups.map((group) => (
                    <DropdownMenuCheckboxItem
                      key={group.id}
                      checked={filters.serviceGroupIds.includes(group.id)}
                      onCheckedChange={(checked) => 
                        handleServiceGroupFilter(group.id, checked === true)
                      }
                    >
                      {group.title}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Service Filter Dropdown - SHADCN UI DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={getFilteredServices().length === 0}>
                Services
                {filters.serviceIds.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.serviceIds.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Service</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-60">
                <DropdownMenuGroup>
                  {getFilteredServices().map((service) => (
                    <DropdownMenuCheckboxItem
                      key={service.id}
                      checked={filters.serviceIds.includes(service.id)}
                      onCheckedChange={(checked) => 
                        handleServiceFilter(service.id, checked === true)
                      }
                    >
                      {service.title}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {getFilteredServices().length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Select service groups first
                    </div>
                  )}
                </DropdownMenuGroup>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show All / Show Less Toggle Button */}
          {filteredGroups.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleShowAllData}
            >
              {showAllData ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show All ({filteredGroups.length} Groups)
                </>
              )}
            </Button>
          )}

          {/* Clear Filters Button */}
          {(filters.serviceGroupIds.length > 0 || filters.serviceIds.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Service Detail FAQ Groups List */}
      <div className="space-y-4">
        {displayedGroups.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">
              {serviceDetailFAQGroups.length === 0 
                ? "No FAQ groups found" 
                : "No matching FAQ groups found"
              }
            </h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {serviceDetailFAQGroups.length === 0
                ? "Create your first FAQ group to get started"
                : "Try adjusting your filters or clear all filters to see all groups"
              }
            </p>
            <Button onClick={() => {
              if (serviceDetailFAQGroups.length === 0) {
                resetGroupForm()
                setGroupModalOpen(true)
              } else {
                clearAllFilters()
              }
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {serviceDetailFAQGroups.length === 0 ? "Create First Group" : "Clear Filters"}
            </Button>
          </div>
        ) : (
          <>
            {displayedGroups.map((group) => (
              <div
                key={group.id}
                className="border rounded-lg overflow-hidden bg-card"
              >
                {/* Group Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded">
                        <Folder className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{group.heading}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="secondary">
                            Group: {getServiceGroupName(group.service_group_id)}
                          </Badge>
                          <Badge variant="outline">
                            Service: {getServiceName(group.service_id)}
                          </Badge>
                          <Badge variant="secondary">
                            {group.service_detail_faqs.length} FAQs
                          </Badge>
                          <Badge variant="outline">
                            {formatDate(group.created_at)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEditGroup(group)}
                        disabled={loading || submitting}
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Group
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteGroup(group.id)}
                        disabled={loading || submitting}
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Group Content - FAQs */}
                <div className="border-t p-6 bg-muted/30">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      FAQs ({group.service_detail_faqs.length})
                    </h4>
                    <Button
                      onClick={() => handleAddFaq(group.id)}
                      size="sm"
                      disabled={loading || submitting}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New FAQ
                    </Button>
                  </div>
                  
                  {group.service_detail_faqs.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg bg-background">
                      <p className="text-muted-foreground">No FAQs added yet</p>
                      <Button
                        onClick={() => handleAddFaq(group.id)}
                        size="sm"
                        className="mt-4"
                        disabled={loading || submitting}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First FAQ
                      </Button>
                    </div>
                  ) : (
                    // <div className="space-y-6">
                    //   {group.service_detail_faqs.map((faq) => (
                    //     <div key={faq.id} className="border rounded-lg overflow-hidden bg-background">
                    //       {/* FAQ Header */}
                    //       <div className="p-4 bg-card border-b">
                    //         <div className="flex items-center justify-between">
                    //           <div>
                    //             <h4 className="font-semibold text-base">{faq.heading}</h4>
                    //             <p className="text-sm text-muted-foreground mt-1">{faq.des}</p>
                    //           </div>
                    //           <div className="flex items-center gap-2">
                    //             <Button
                    //               onClick={() => handleEditFaq(faq, group.id)}
                    //             //   variant="outline"
                    //               size="sm"
                    //               disabled={loading || submitting}
                    //             >
                    //               <Edit className="h-4 w-4 mr-2" />
                    //               Edit
                    //             </Button>
                    //             <Button
                    //               variant="error"
                    //               size="sm"
                    //               onClick={() => handleDeleteFaq(faq.id)}
                    //               disabled={loading || submitting}
                    //             >
                    //               <Trash2 className="h-4 w-4 mr-2" />
                    //               Delete
                    //             </Button>
                    //           </div>
                    //         </div>
                    //       </div>

                    //       {/* FAQ Items (Answers) */}
                    //       <div className="p-4">
                    //         <h5 className="text-sm font-medium mb-3">FAQ Items:</h5>
                    //         <div className="space-y-3">
                    //           {faq.list.map((item, index) => (
                    //             <div key={index} className="p-3 bg-muted/20 rounded-md">
                    //               <p className="text-sm">
                    //                 <span className="font-medium mr-2">{index + 1}.</span>
                    //                 {item.answer}
                    //               </p>
                    //             </div>
                    //           ))}
                    //         </div>
                    //       </div>
                    //     </div>
                    //   ))}
                    // </div>
                        <div className="space-y-4">
      {group.service_detail_faqs.map((faq) => (
        <Collapsible
          key={faq.id}
          open={expandedFaqs[faq.id]}
          onOpenChange={() => toggleFaqExpansion(faq.id)}
          className="border rounded-lg overflow-hidden bg-card"
        >
          {/* FAQ Header - Collapsible Trigger */}
          <CollapsibleTrigger asChild>
            <div className="w-full p-4 hover:bg-accent/50 transition-colors cursor-pointer border-b">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {expandedFaqs[faq.id] ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-base">{faq.heading}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                        {faq.des}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons - Stop propagation to prevent collapsible toggle */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline" className="gap-1">
                    <span className="font-medium">{faq.list?.length || 0}</span>
                    {faq.list?.length === 1 ? 'Answer' : 'Answers'}
                  </Badge>
                  <Button
                    onClick={() => handleEditFaq(faq, group.id)}
                    size="sm"
                    variant="ghost"
                    disabled={loading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFaq(faq.id)}
                    disabled={loading}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          {/* Collapsible Content - FAQ Answers */}
          <CollapsibleContent>
            <div className="p-5 bg-muted/10 space-y-4">
              {/* Description */}
              <div className="text-sm text-muted-foreground bg-background p-3 rounded-md ">
                <span className="font-medium text-foreground">Description: </span>
                {faq.des}
              </div>

              {/* FAQ Items (Answers) */}
              <div>
                <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <span>FAQ Items</span>
                  <Badge variant="secondary" className="text-xs">
                    {faq.list?.length || 0} items
                  </Badge>
                </h5>
                
                {faq.list && faq.list.length > 0 ? (
                  <div className="space-y-2">
                    {faq.list.map((item, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-background border rounded-md hover:border-primary/50 transition-colors"
                      >
                        <div className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <p className="text-sm flex-1 text-foreground/90">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-background border rounded-md">
                    <p className="text-sm text-muted-foreground">
                      No answers added yet
                    </p>
                  </div>
                )}
              </div>

              {/* Add More Button */}
              {/* <div className="flex justify-end pt-2 border-t">
                <Button
                  onClick={() => handleAddFaq(group.id)}
                  size="sm"
                //   variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Another FAQ
                </Button>
              </div> */}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>

                  )}
                </div>
              </div>
            ))}
            
            {/* Load More Button */}
            {!showAllData && displayedGroups.length < filteredGroups.length && filteredGroups.length > 1 && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={loadMoreData}
                  className="mx-auto"
                  disabled={loading || submitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Load More (Next {Math.min(3, filteredGroups.length - displayedGroups.length)} Groups)
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Showing {displayedGroups.length} of {filteredGroups.length} groups
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ========== MODAL FOR SERVICE_DETAIL_FAQ_GROUP (PARENT) ========== */}
      <Dialog open={groupModalOpen} onOpenChange={setGroupModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isGroupEdit ? 'Edit FAQ Group' : 'Create New FAQ Group'}
            </DialogTitle>
            <DialogDescription>
              {isGroupEdit
                ? 'Update the FAQ group and its individual FAQ items.'
                : 'Create a new FAQ group with multiple FAQ items for a specific service.'
              }
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={initialGroupFormValues}
            validationSchema={groupValidationSchema}
            onSubmit={isGroupEdit ? handleUpdateGroup : handleSubmitGroup}
            enableReinitialize
          >
            {({ 
              values, 
              errors, 
              touched, 
              isSubmitting: formikSubmitting, 
              setFieldValue 
            }: FormikProps<ServiceDetailFAQGroupFormValues>) => (
              <Form className="space-y-6">
                {/* Group Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Service Group Dropdown - SHADCN UI DROPDOWN */}
                    <div>
                      <Label htmlFor="service_group_id" className="text-base font-medium">
                        Service Group *
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between mt-2 text-left font-normal"
                            disabled={formikSubmitting}
                          >
                            {values.service_group_id 
                              ? serviceGroups.find(g => g.id === values.service_group_id)?.title || "Select a service group"
                              : "Select a service group"}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                          <DropdownMenuLabel>Service Groups</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {serviceGroups.map((group) => (
                            <DropdownMenuItem
                              key={group.id}
                              onSelect={() => {
                                setFieldValue('service_group_id', group.id)
                                setFieldValue('service_id', '')
                              }}
                              className="cursor-pointer"
                            >
                              {group.id === values.service_group_id && (
                                <Check className="mr-2 h-4 w-4" />
                              )}
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

                    {/* Service Dropdown - SHADCN UI DROPDOWN */}
                    <div>
                      <Label htmlFor="service_id" className="text-base font-medium">
                        Service *
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between mt-2 text-left font-normal"
                            disabled={formikSubmitting || !values.service_group_id}
                          >
                            {values.service_id 
                              ? services.find(s => s.id === values.service_id)?.title || "Select a service"
                              : values.service_group_id 
                                ? "Select a service" 
                                : "Select service group first"}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                          <DropdownMenuLabel>Services</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {services
                            .filter(service => service.service_group_id === values.service_group_id)
                            .map((service) => (
                              <DropdownMenuItem 
                                key={service.id}
                                onSelect={() => setFieldValue('service_id', service.id)}
                                className="cursor-pointer"
                              >
                                {service.id === values.service_id && (
                                  <Check className="mr-2 h-4 w-4" />
                                )}
                                {service.title}
                              </DropdownMenuItem>
                            ))
                          }
                          {values.service_group_id && 
                           services.filter(s => s.service_group_id === values.service_group_id).length === 0 && (
                            <DropdownMenuItem disabled className="text-muted-foreground">
                              No services found for this group
                            </DropdownMenuItem>
                          )}
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
                    <Label htmlFor="heading" className="text-base font-medium">
                      Group Heading *
                    </Label>
                    <Field
                      as={Input}
                      id="heading"
                      name="heading"
                      placeholder="Enter FAQ group heading"
                      disabled={formikSubmitting}
                      className={`mt-2 ${errors.heading && touched.heading ? 'border-destructive' : ''}`}
                    />
                    <ErrorMessage
                      name="heading"
                      component="div"
                      className="text-sm text-red-500 mt-1"
                    />
                  </div>
                </div>

                {/* FAQ Details Array */}
                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">FAQ Details *</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFieldValue('service_detail_faqs', [
                        ...values.service_detail_faqs,
                        { heading: '', des: '', list: [{ answer: '' }] }
                      ])}
                      disabled={formikSubmitting}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add FAQ
                    </Button>
                  </div>

                  <FieldArray name="service_detail_faqs">
                    {({ remove }) => (
                      <div className="space-y-4">
                        {values.service_detail_faqs.map((_, index) => {
                                  const faqErrors = errors.service_detail_faqs;
        const currentFaqError = Array.isArray(faqErrors) 
          ? (faqErrors as ServiceDetailFAQFormErrors[])[index] 
          : undefined;

                          // const faqErrors = errors.service_detail_faqs && 
                          //   !Array.isArray(errors.service_detail_faqs) && 
                          //   typeof errors.service_detail_faqs === 'object' 
                          //     ? errors.service_detail_faqs[index] 
                          //     : undefined
                          
                          return (
                            <div key={index} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">FAQ #{index + 1}</h4>
                                {values.service_detail_faqs.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => remove(index)}
                                    disabled={formikSubmitting}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              {/* FAQ Heading */}
                              <div>
                                <Label htmlFor={`service_detail_faqs.${index}.heading`}>
                                  FAQ Heading *
                                </Label>
                                <Field
                                  as={Input}
                                  id={`service_detail_faqs.${index}.heading`}
                                  name={`service_detail_faqs.${index}.heading`}
                                  placeholder="Enter FAQ heading"
                                  disabled={formikSubmitting}
                                  className="mt-1"
                                />
                                <ErrorMessage
                                  name={`service_detail_faqs.${index}.heading`}
                                  component="div"
                                  className="text-sm text-red-500 mt-1"
                                />
                              </div>

                              {/* FAQ Description */}
                              <div>
                                <Label htmlFor={`service_detail_faqs.${index}.des`}>
                                  FAQ Description *
                                </Label>
                                <Field
                                  as={Textarea}
                                  id={`service_detail_faqs.${index}.des`}
                                  name={`service_detail_faqs.${index}.des`}
                                  placeholder="Enter FAQ description"
                                  rows={2}
                                  disabled={formikSubmitting}
                                  className="mt-1"
                                />
                                <ErrorMessage
                                  name={`service_detail_faqs.${index}.des`}
                                  component="div"
                                  className="text-sm text-red-500 mt-1"
                                />
                              </div>

                              {/* FAQ List Items (Answers) */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="font-medium">FAQ Items *</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const currentList = [...values.service_detail_faqs[index].list]
                                      setFieldValue(
                                        `service_detail_faqs.${index}.list`,
                                        [...currentList, { answer: '' }]
                                      )
                                    }}
                                    disabled={formikSubmitting}
                                  >
                                    <Plus className="h-3 w-3 mr-2" />
                                    Add Answer
                                  </Button>
                                </div>

                                <FieldArray name={`service_detail_faqs.${index}.list`}>
                                  {({ remove: removeListItem }) => (
                                    <div className="space-y-3">
                                      {values.service_detail_faqs[index].list.map((_, itemIndex) => (
                                        <div key={itemIndex} className="flex items-start gap-2">
                                          <div className="flex-1">
                                            <Field
                                              as={Textarea}
                                              id={`service_detail_faqs.${index}.list.${itemIndex}.answer`}
                                              name={`service_detail_faqs.${index}.list.${itemIndex}.answer`}
                                              placeholder={`Answer ${itemIndex + 1}`}
                                              rows={2}
                                              disabled={formikSubmitting}
                                              className="w-full text-sm"
                                            />
                                            <ErrorMessage
                                              name={`service_detail_faqs.${index}.list.${itemIndex}.answer`}
                                              component="div"
                                              className="text-sm text-red-500 mt-1"
                                            />
                                          </div>
                                          {values.service_detail_faqs[index].list.length > 1 && (
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeListItem(itemIndex)}
                                              disabled={formikSubmitting}
                                              className="h-8 w-8 p-0"
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </FieldArray>

                  {typeof errors.service_detail_faqs === 'string' && (
                    <p className="text-sm text-destructive">{errors.service_detail_faqs}</p>
                  )}
                </div>

                {/* Form Actions */}
                <DialogFooter className="gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetGroupForm}
                    disabled={formikSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={formikSubmitting}
                  >
                    {formikSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isGroupEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isGroupEdit ? 'Update Group' : 'Create Group'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* ========== MODAL FOR SERVICE_DETAIL_FAQ (CHILD) ========== */}
      <Dialog open={faqModalOpen} onOpenChange={setFaqModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isFaqEdit ? 'Edit FAQ Item' : 'Add New FAQ Item'}
            </DialogTitle>
            <DialogDescription>
              {isFaqEdit
                ? 'Update this FAQ item and its answers.'
                : 'Add a new FAQ item to the selected group.'
              }
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={initialFaqFormValues}
            validationSchema={faqCreateValidationSchema}
            onSubmit={isFaqEdit ? handleUpdateFaq : handleSubmitFaq}
            enableReinitialize
          >
            {({ 
              values, 
              errors, 
              touched, 
              isSubmitting: formikSubmitting, 
              setFieldValue 
            }: FormikProps<ServiceDetailFAQCreateFormValues>) => (
              <Form className="space-y-6">
                {/* Parent Group Selection - SHADCN UI DROPDOWN */}
                {!isFaqEdit && (
                  <div>
                    <Label htmlFor="faq_group_id" className="text-base font-medium">
                      Parent Group *
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between mt-2 text-left font-normal"
                          disabled={formikSubmitting}
                        >
                          {values.faq_group_id 
                            ? serviceDetailFAQGroups.find(g => g.id === values.faq_group_id)?.heading || "Select a parent group"
                            : "Select a parent group"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>FAQ Groups</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {serviceDetailFAQGroups.map((group) => (
                          <DropdownMenuItem
                            key={group.id}
                            onSelect={() => setFieldValue('faq_group_id', group.id)}
                            className="cursor-pointer"
                          >
                            {group.id === values.faq_group_id && (
                              <Check className="mr-2 h-4 w-4" />
                            )}
                            {group.heading}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {errors.faq_group_id && touched.faq_group_id && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.faq_group_id}
                      </p>
                    )}
                  </div>
                )}

                {/* FAQ Heading */}
                <div>
                  <Label htmlFor="heading" className="text-base font-medium">
                    FAQ Heading *
                  </Label>
                  <Field
                    as={Input}
                    id="heading"
                    name="heading"
                    placeholder="Enter FAQ heading"
                    disabled={formikSubmitting}
                    className={`mt-2 ${errors.heading && touched.heading ? 'border-destructive' : ''}`}
                  />
                  <ErrorMessage
                    name="heading"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                {/* FAQ Description */}
                <div>
                  <Label htmlFor="des" className="text-base font-medium">
                    FAQ Description *
                  </Label>
                  <Field
                    as={Textarea}
                    id="des"
                    name="des"
                    placeholder="Enter FAQ description"
                    rows={3}
                    disabled={formikSubmitting}
                    className={`mt-2 ${errors.des && touched.des ? 'border-destructive' : ''}`}
                  />
                  <ErrorMessage
                    name="des"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                {/* FAQ List Items (Answers) */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">FAQ Items *</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFieldValue('list', [...values.list, { answer: '' }])
                      }}
                      disabled={formikSubmitting}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Answer
                    </Button>
                  </div>

                  <FieldArray name="list">
                    {({ remove }) => (
                      <div className="space-y-4">
                        {values.list.map((_, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Label htmlFor={`list.${index}.answer`} className="font-medium">
                                Answer {index + 1} *
                              </Label>
                              {values.list.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => remove(index)}
                                  disabled={formikSubmitting}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <Field
                              as={Textarea}
                              id={`list.${index}.answer`}
                              name={`list.${index}.answer`}
                              placeholder={`Enter answer ${index + 1}`}
                              rows={3}
                              disabled={formikSubmitting}
                              className="w-full"
                            />
                            <ErrorMessage
                              name={`list.${index}.answer`}
                              component="div"
                              className="text-sm text-red-500 mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Form Actions */}
                <DialogFooter className="gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFaqForm}
                    disabled={formikSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={formikSubmitting}
                  >
                    {formikSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isFaqEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isFaqEdit ? 'Update FAQ' : 'Create FAQ'}
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

export default ServiceFAQManager