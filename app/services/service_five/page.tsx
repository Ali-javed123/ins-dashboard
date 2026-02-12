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
import { Plus, Trash2, Edit, Save, X, AlertCircle, Filter, ChevronDown, ChevronUp } from 'lucide-react'
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

// Service Five Group Table (Parent)
interface ServiceFiveGroup {
  id: string;
  created_at: string;
  heading: string;
  description: string;
  service_group_id: string; // Foreign key to service_groups
  service_id: string; // Foreign key to services
  service_groups?: ServiceGroup;
  services?: Service;
  service_fives: ServiceFive[]; // Child records
}

// Service Five Table (Child)
interface ServiceFive {
  id: string;
  created_at: string;
  heading: string;
  des: string;
  service_card: string; // Foreign key to service_five_group.id
}

// ============ FORM VALUE TYPES ============

// For Service Five Group Form (Parent)
interface ServiceFiveGroupFormValues {
  heading: string;
  description: string;
  service_group_id: string;
  service_id: string;
  service_fives: ServiceFiveFormValues[];
}

// For Service Five Form (Child)
interface ServiceFiveFormValues {
  heading: string;
  des: string;
}

// For creating/editing individual Service Five (Child)
interface ServiceFiveCreateFormValues {
  heading: string;
  des: string;
  service_card: string; // Parent service_five_group id
}

// ============ FILTER TYPES ============

interface FilterState {
  serviceGroupIds: string[];
  serviceIds: string[];
}


// ============ MAIN COMPONENT ============

const ServiceFiveManager: FC = () => {
  // ============ STATE MANAGEMENT ============
  
  // Reference data
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])
  const [services, setServices] = useState<Service[]>([])
  
  // Main data
  const [serviceFiveGroups, setServiceFiveGroups] = useState<ServiceFiveGroup[]>([])
  const [filteredGroups, setFilteredGroups] = useState<ServiceFiveGroup[]>([])
  const [displayedGroups, setDisplayedGroups] = useState<ServiceFiveGroup[]>([])
  
  // UI States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Parent Group Modal States
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  // Child Modal States
  const [childOpen, setChildOpen] = useState(false)
  const [isChildEdit, setIsChildEdit] = useState(false)
  const [childEditId, setChildEditId] = useState<string | null>(null)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  
  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    serviceGroupIds: [],
    serviceIds: []
  })
  
  // Display Toggle State
  const [showAllData, setShowAllData] = useState(false)
  
  // ============ INITIAL FORM VALUES ============
  
  const [initialFormValues, setInitialFormValues] = useState<ServiceFiveGroupFormValues>({
    heading: '',
    description: '',
    service_group_id: '',
    service_id: '',
    service_fives: [{
      heading: '',
      des: ''
    }]
  })

  const [initialChildFormValues, setInitialChildFormValues] = useState<ServiceFiveCreateFormValues>({
    heading: '',
    des: '',
    service_card: ''
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

  const fetchServiceFiveGroups = useCallback(async () => {
    try {
      setLoading(true)
      
      const { data: groups, error: groupsError } = await supabase
        .from('service_five_group')
        .select('*')
        .order('created_at', { ascending: false })

      if (groupsError) throw groupsError

      if (!groups || groups.length === 0) {
        setServiceFiveGroups([])
        setFilteredGroups([])
        setDisplayedGroups([])
        return
      }

      const groupsWithDetails = await Promise.all(
        groups.map(async (group) => {
          const { data: serviceGroup } = await supabase
            .from('service_groups')
            .select('*')
            .eq('id', group.service_group_id)
            .single()

          const { data: service } = await supabase
            .from('services')
            .select('*')
            .eq('id', group.service_id)
            .single()

          const { data: serviceFives } = await supabase
            .from('service_five')
            .select('*')
            .eq('service_card', group.id)
            .order('created_at', { ascending: true })

          return {
            ...group,
            service_groups: serviceGroup || undefined,
            services: service || undefined,
            service_fives: serviceFives || []
          }
        })
      )

      setServiceFiveGroups(groupsWithDetails)
      setFilteredGroups(groupsWithDetails)
      
      if (groupsWithDetails.length > 0) {
        setDisplayedGroups([groupsWithDetails[0]])
      } else {
        setDisplayedGroups([])
      }
      
      setError(null)
    } catch (error) {
      console.error('Error fetching service five groups:', error)
      setError('Failed to load service five groups.')
    } finally {
      setLoading(false)
    }
  }, [])

  // ============ FILTER EFFECT ============

  useEffect(() => {
    if (serviceFiveGroups.length === 0) return

    let filtered = serviceFiveGroups

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
  }, [filters, serviceFiveGroups])

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

  // ============ RESET FUNCTIONS ============

const resetGroupForm = () => {
  setIsEdit(false)
  setEditId(null)
  setInitialFormValues({
    heading: '',
    description: '',
    service_group_id: '',
    service_id: '',
    service_fives: [{
      heading: '',
      des: ''
    }]
  })
}

const handleAddGroup = () => {
  resetGroupForm() // Reset form first
  setOpen(true) // Then open modal
}

  const resetChildForm = () => {
    setIsChildEdit(false)
    setChildEditId(null)
    setSelectedParentId(null)
    setInitialChildFormValues({
      heading: '',
      des: '',
      service_card: ''
    })
    setChildOpen(false)
  }

  // ============ EDIT HANDLERS ============

  const handleEditGroup = (group: ServiceFiveGroup) => {
  setIsEdit(true)
  setEditId(group.id)
  
  const formValues: ServiceFiveGroupFormValues = {
    heading: group.heading,
    description: group.description,
    service_group_id: group.service_group_id,
    service_id: group.service_id,
    service_fives: group.service_fives.map(child => ({
      heading: child.heading,
      des: child.des
    }))
  }

  setInitialFormValues(formValues)
  setOpen(true) // Open modal after setting values
}


  const handleEditChild = (child: ServiceFive, parentId: string) => {
    setIsChildEdit(true)
    setChildEditId(child.id)
    setSelectedParentId(parentId)
    
    setInitialChildFormValues({
      heading: child.heading,
      des: child.des,
      service_card: parentId
    })
    
    setChildOpen(true)
  }

  // ============ CRUD VALIDATION SCHEMAS ============

  const childValidationSchema = Yup.object({
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
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must be less than 1000 characters')
      .required('Description is required'),
    service_group_id: Yup.string().required('Service group is required'),
    service_id: Yup.string().required('Service is required'),
    service_fives: Yup.array()
      .of(childValidationSchema)
      .min(1, 'At least one service five detail is required')
      .required('Service five details are required'),
  })

  const childCreateValidationSchema = Yup.object({
    heading: Yup.string()
      .min(2, 'Heading must be at least 2 characters')
      .max(100, 'Heading must be less than 100 characters')
      .required('Heading is required'),
    des: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters')
      .required('Description is required'),
    service_card: Yup.string().required('Parent group is required'),
  })

  // ============ CRUD OPERATIONS FOR PARENT GROUP ============

  const handleSubmitGroup = async (values: ServiceFiveGroupFormValues) => {
    try {
      setLoading(true)
      
      const { data: groupData, error: groupError } = await supabase
        .from('service_five_group')
        .insert([{
          heading: values.heading,
          description: values.description,
          service_group_id: values.service_group_id,
          service_id: values.service_id
        }])
        .select()
        .single()

      if (groupError) throw groupError

      const serviceFives = values.service_fives.map((child) => ({
        heading: child.heading,
        des: child.des,
        service_card: groupData.id,
      }))

      const { error: childError } = await supabase
        .from('service_five')
        .insert(serviceFives)

      if (childError) throw childError

      await fetchServiceFiveGroups()
      resetGroupForm()
      alert('Service five group created successfully!')
    } catch (error) {
      console.error('Error creating service five group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateGroup = async (values: ServiceFiveGroupFormValues) => {
    if (!editId) return

    try {
      setLoading(true)
      
      const { error: groupError } = await supabase
        .from('service_five_group')
        .update({
          heading: values.heading,
          description: values.description,
          service_group_id: values.service_group_id,
          service_id: values.service_id
        })
        .eq('id', editId)

      if (groupError) throw groupError

      const { error: deleteError } = await supabase
        .from('service_five')
        .delete()
        .eq('service_card', editId)

      if (deleteError) throw deleteError

      const serviceFives = values.service_fives.map((child) => ({
        heading: child.heading,
        des: child.des,
        service_card: editId,
      }))

      const { error: childError } = await supabase
        .from('service_five')
        .insert(serviceFives)

      if (childError) throw childError

      await fetchServiceFiveGroups()
      resetGroupForm()
      alert('Service five group updated successfully!')
    } catch (error) {
      console.error('Error updating service five group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group and all its service five details?')) return

    try {
      setLoading(true)
      
      const { error: childError } = await supabase
        .from('service_five')
        .delete()
        .eq('service_card', groupId)

      if (childError) throw childError

      const { error: groupError } = await supabase
        .from('service_five_group')
        .delete()
        .eq('id', groupId)

      if (groupError) throw groupError

      await fetchServiceFiveGroups()
      alert('Service five group deleted successfully!')
    } catch (error) {
      console.error('Error deleting service five group:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // ============ CRUD OPERATIONS FOR CHILD (SERVICE_FIVE) ============

  const handleAddChild = (parentId: string) => {
    setIsChildEdit(false)
    setChildEditId(null)
    setSelectedParentId(parentId)
    
    setInitialChildFormValues({
      heading: '',
      des: '',
      service_card: parentId
    })
    
    setChildOpen(true)
  }

  const handleSubmitChild = async (values: ServiceFiveCreateFormValues) => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('service_five')
        .insert([{
          heading: values.heading,
          des: values.des,
          service_card: values.service_card
        }])

      if (error) throw error

      await fetchServiceFiveGroups()
      resetChildForm()
      alert('Service five detail created successfully!')
    } catch (error) {
      console.error('Error creating service five detail:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateChild = async (values: ServiceFiveCreateFormValues) => {
    if (!childEditId) return

    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('service_five')
        .update({
          heading: values.heading,
          des: values.des,
          service_card: values.service_card
        })
        .eq('id', childEditId)

      if (error) throw error

      await fetchServiceFiveGroups()
      resetChildForm()
      alert('Service five detail updated successfully!')
    } catch (error) {
      console.error('Error updating service five detail:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteChild = async (childId: string) => {
    if (!confirm('Are you sure you want to delete this service five detail?')) return

    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('service_five')
        .delete()
        .eq('id', childId)

      if (error) throw error

      await fetchServiceFiveGroups()
      alert('Service five detail deleted successfully!')
    } catch (error) {
      console.error('Error deleting service five detail:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
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
        await fetchServiceFiveGroups()
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load data. Please check console for details.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [fetchServiceGroups, fetchServices, fetchServiceFiveGroups])

  // ============ LOADING STATE ============

  if (loading && !serviceFiveGroups.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading service five details...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Service Five Manager</h1>
          <p className="text-muted-foreground mt-2">
            Manage service five groups and their individual details
          </p>
        </div>
        <Button onClick={handleAddGroup} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service Five Group
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
              {filteredGroups.length} of {serviceFiveGroups.length} groups
            </Badge>
          )}
          {!showAllData && displayedGroups.length > 0 && (
            <Badge variant="outline" className="ml-2">
              Showing 1 of {filteredGroups.length} groups
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Service Group Filter Dropdown */}
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

          {/* Service Filter Dropdown */}
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
                  Show Less (First Row Only)
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

      {/* Service Five Groups List */}
      <div className="space-y-4">
        {displayedGroups.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">
              {serviceFiveGroups.length === 0 
                ? "No service five groups found" 
                : "No matching service five groups found"
              }
            </h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {serviceFiveGroups.length === 0
                ? "Create your first service five group to get started"
                : "Try adjusting your filters or clear all filters to see all groups"
              }
            </p>
            <Button onClick={() => {
              if (serviceFiveGroups.length === 0) {
                setOpen(true);
              } else {
                clearAllFilters();
              }
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {serviceFiveGroups.length === 0 ? "Create First Group" : "Clear Filters"}
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
                        {/* Optional icon */}
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
                            {group.service_fives.length} details
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

                {/* Group Content */}
                <div className="border-t p-6 bg-muted/30">
                  {/* Description Section */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Description
                      </h4>
                      <Button
                        onClick={() => handleAddChild(group.id)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Service Five
                      </Button>
                    </div>
                    <p className="text-sm">{group.description}</p>
                  </div>
                  
                  {/* Service Five Details Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Service Five Details ({group.service_fives.length})
                    </h4>
                    
                    {group.service_fives.length === 0 ? (
                      <div className="text-center py-8 border rounded-lg bg-background">
                        <p className="text-muted-foreground">No details added yet</p>
                        <Button
                          onClick={() => handleAddChild(group.id)}
                          size="sm"
                          className="mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Detail
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-10">
                        {group.service_fives.map((detail) => (
                          <div 
                            key={detail.id} 
                            className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-500"
                          >
                            <div className="flex flex-col h-full rounded-2xl p-6 bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-xl shadow-lg dark:shadow-lg hover:shadow-2xl transition-all">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-2">
                                  {detail.heading}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {detail.des}
                                </p>
                              </div>
                              <div className="mt-5 flex gap-4">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleEditChild(detail, group.id)}
                                  className="flex-1"
                                >
                                  <Edit className="mr-2 h-3 w-3" />
                                  Edit
                                </Button>
                                <Button
                                  variant="error"
                                  size="sm"
                                  onClick={() => handleDeleteChild(detail.id)}
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
                    )}
                  </div>
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

      {/* ========== MODAL FOR SERVICE_FIVE_GROUP (PARENT) ========== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Service Five Group' : 'Create Service Five Group'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the service five group and its individual details.'
                : 'Create a new service five group with multiple individual details.'
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
                    {/* Service Group Dropdown */}
                    <div>
                      <Label htmlFor="service_group_id">Service Group *</Label>
                      <DropdownMenu>
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

                    {/* Service Dropdown */}
                    <div>
                      <Label htmlFor="service_id">Service *</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between"
                            disabled={isSubmitting || !values.service_group_id}
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
                          {services
                            .filter(service => service.service_group_id === values.service_group_id)
                            .map((service) => (
                              <DropdownMenuItem 
                                key={service.id}
                                onClick={() => setFieldValue('service_id', service.id)}
                                className={values.service_id === service.id ? "bg-accent" : ""}
                              >
                                {service.title}
                              </DropdownMenuItem>
                            ))
                          }
                          {values.service_group_id && services.filter(s => s.service_group_id === values.service_group_id).length === 0 && (
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
                    <Label htmlFor="description">Group Description *</Label>
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      placeholder="Enter group description"
                      rows={3}
                      disabled={isSubmitting}
                      className={errors.description && touched.description ? 'border-destructive' : ''}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-sm text-destructive mt-1"
                    />
                  </div>
                </div>

                {/* Service Five Details Array */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Service Five Details *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFieldValue('service_fives', [
                        ...values.service_fives,
                        { heading: '', des: '' }
                      ])}
                      disabled={isSubmitting}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Detail
                    </Button>
                  </div>

                  <FieldArray name="service_fives">
                    {({ remove }) => (
                      <div className="space-y-4">
                        {values.service_fives.map((_, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Detail #{index + 1}</h4>
                              {values.service_fives.length > 1 && (
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

                            {/* Detail Heading */}
                            <div>
                              <Label htmlFor={`service_fives.${index}.heading`}>
                                Heading *
                              </Label>
                              <Field
                                as={Input}
                                id={`service_fives.${index}.heading`}
                                name={`service_fives.${index}.heading`}
                                placeholder="Enter detail heading"
                                disabled={isSubmitting}
                              />
                              <ErrorMessage
                                name={`service_fives.${index}.heading`}
                                component="div"
                                className="text-sm text-destructive mt-1"
                              />
                            </div>

                            {/* Detail Description */}
                            <div>
                              <Label htmlFor={`service_fives.${index}.des`}>
                                Description *
                              </Label>
                              <Field
                                as={Textarea}
                                id={`service_fives.${index}.des`}
                                name={`service_fives.${index}.des`}
                                placeholder="Enter detail description"
                                rows={2}
                                disabled={isSubmitting}
                              />
                              <ErrorMessage
                                name={`service_fives.${index}.des`}
                                component="div"
                                className="text-sm text-destructive mt-1"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>

                  {errors.service_fives && typeof errors.service_fives === 'string' && (
                    <p className="text-sm text-destructive">{errors.service_fives}</p>
                  )}
                </div>

                {/* Form Actions */}
                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetGroupForm}
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

      {/* ========== SEPARATE MODAL FOR SERVICE_FIVE (CHILD) ========== */}
      <Dialog open={childOpen} onOpenChange={setChildOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isChildEdit ? 'Edit Service Five Detail' : 'Add New Service Five Detail'}
            </DialogTitle>
            <DialogDescription>
              {isChildEdit
                ? 'Update this service five detail.'
                : 'Add a new service five detail to the selected group.'
              }
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={initialChildFormValues}
            validationSchema={childCreateValidationSchema}
            onSubmit={isChildEdit ? handleUpdateChild : handleSubmitChild}
            enableReinitialize
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">
                {/* Parent Group Selection - Only show when adding new detail */}
                {!isChildEdit && (
                  <div>
                    <Label htmlFor="service_card">Parent Group *</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {values.service_card 
                            ? serviceFiveGroups.find(g => g.id === values.service_card)?.heading || "Select a parent group"
                            : "Select a parent group"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                        {serviceFiveGroups.map((group) => (
                          <DropdownMenuItem
                            key={group.id}
                            onSelect={() => setFieldValue('service_card', group.id)}
                            className="cursor-pointer"
                          >
                            {group.heading}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {errors.service_card && touched.service_card && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.service_card}
                      </p>
                    )}
                  </div>
                )}

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
                    onClick={resetChildForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isChildEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isChildEdit ? 'Update Detail' : 'Create Detail'}
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

export default ServiceFiveManager