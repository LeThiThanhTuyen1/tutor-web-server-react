"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, DollarSign, Users, Edit, Plus, Trash2, Search, BookOpen, XCircle, Clock, Eye } from "lucide-react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Checkbox } from "@/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Tabs, TabsContent } from "@/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/ui/toast"
import { CancelCourseModal } from "@/ui/modals/cancel-course"
import { type Course, formatRelativeDate, STATUS_STYLES } from "@/components/courses/course-utils"
import { cancelCourse, deleteCourses, getTutorCourseByUserId } from "@/services/courseService"
import type { PaginationFilter } from "@/types/paginated-response"
import { cn } from "@/components/layout/cn"
import { Badge } from "@/ui/badge"
import { DeleteConfirmationModal } from "@/ui/modals/delete-confirm"
import Pagination from "@/components/layout/pagination"

export default function TutorCourseList() {
  const [totalPages, setTotalPages] = useState(1)
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [courseToCancel, setCourseToCancel] = useState<number | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // Add a refresh key for forcing re-fetches

  const { toast, toasts, dismiss } = useToast()
  const [pagination, setPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 9,
  })

  // Fetch tutor courses with cache-busting
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      // Add a timestamp parameter to prevent caching
      const response = await getTutorCourseByUserId({
        ...pagination,
      })

      setCourses(response.data || [])
      setFilteredCourses(response.data || [])
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [pagination, statusFilter, searchTerm, refreshKey]) // Add refreshKey to dependencies

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const toggleCourseSelection = useCallback((courseId: number) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.includes(courseId)
      return isSelected ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    })
  }, [])

  const handleDeleteSelected = useCallback(async () => {
    if (selectedCourses.length === 0) return

    try {
      const response = await deleteCourses(selectedCourses)
      if (response.succeeded) {
        toast({
          title: "Success",
          description: "Courses deleted successfully",
          variant: "success",
        })
        setSelectedCourses([])

        // Force a refresh after deletion
        setRefreshKey((prev) => prev + 1)

        // Reset to first page if needed
        if (pagination.pageNumber > 1 && courses.length <= selectedCourses.length) {
          setPagination((prev) => ({ ...prev, pageNumber: 1 }))
        } else {
          // Just refresh the current page
          fetchCourses()
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete courses",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete courses",
        variant: "destructive",
      })
    } finally {
      setIsDeleteModalOpen(false)
    }
  }, [selectedCourses, fetchCourses, pagination, courses.length])

  // Filter courses based on search term and status
  useEffect(() => {
    let result = courses

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (course) => course.courseName.toLowerCase().includes(term) || course.description.toLowerCase().includes(term),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((course) => course.status === statusFilter)
    }

    setFilteredCourses(result)
  }, [courses, searchTerm, statusFilter])

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, pageNumber: newPage }))
  }, [])

  // Select all courses
  const toggleSelectAll = () => {
    setSelectedCourses(
      selectedCourses.length === filteredCourses.length ? [] : filteredCourses.map((course) => course.id),
    )
  }

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false)
  }, [])

  // Open cancel dialog
  const handleCancelCourse = (courseId: number) => {
    setCourseToCancel(courseId)
    setIsCancelDialogOpen(true)
  }

  // Confirm course cancellation
  const confirmCancelCourse = async () => {
    if (!courseToCancel) return

    try {
      setIsCancelling(true)
      const response = await cancelCourse(courseToCancel)

      if (response.succeeded) {
        toast({
          title: "Success",
          description: "Course has been cancelled successfully",
          variant: "success",
        })

        // Force a refresh after cancellation
        setRefreshKey((prev) => prev + 1)
        fetchCourses()
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to cancel course",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
      setIsCancelDialogOpen(false)
      setCourseToCancel(null)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">My Courses</h1>

          <div className="flex flex-col sm:flex-row gap-2">
            {selectedCourses.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center bg-red-600 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedCourses.length})
              </Button>
            )}
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link to="/tutor/courses/new" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Course
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="coming">Coming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Course list */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <Tabs defaultValue="list" className="w-full">
            {filteredCourses.length > 0 && (
              <div className="flex items-center p-4">
                <Checkbox
                  checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                  onCheckedChange={toggleSelectAll}
                  className="mr-2"
                />
                <span className="text-sm text-gray-500">Select all</span>
              </div>
            )}

            <TabsContent value="list" className="p-0">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No courses found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "You haven't created any courses yet"}
                  </p>
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link to="/tutor/courses/new">Create Your First Course</Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCourses.map((course) => (
                    <motion.li
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedCourses.includes(course.id)}
                          onCheckedChange={() => toggleCourseSelection(course.id)}
                          className="mt-1 h-5 w-5 border-indigo-300 dark:border-indigo-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                  {course.courseName}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs font-medium",
                                    STATUS_STYLES[course.status] ||
                                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
                                  )}
                                >
                                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Created {formatRelativeDate(course.createdAt)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {(course.status === "coming" || course.status === "ongoing") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelCourse(course.id)}
                                  className="border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-1" />
                                  Cancel
                                </Button>
                              )}
                              {(course.status === "coming" || course.status === "ongoing") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300"
                                >
                                  <Link to={`/tutor/courses/${course.id}/edit`} className="flex items-center">
                                    <Edit className="h-3.5 w-3.5 mr-1" />
                                    Edit
                                  </Link>
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedCourses([course.id])
                                  setIsDeleteModalOpen(true)
                                }}
                                className="text-white bg-red-500 hover:bg-red-600 dark:bg-red-600/90 dark:hover:bg-red-700/90"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                asChild
                                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                              >
                                <Link to={`/courses/${course.id}`} className="flex items-center">
                                  <Eye className="h-3.5 w-3.5 mr-1" />
                                  View
                                </Link>
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                              <span className="truncate">
                                {new Date(course.startDate).toLocaleDateString()} -{" "}
                                {new Date(course.endDate).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <DollarSign className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                              <span>${course.fee}</span>
                            </div>

                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Users className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                              <span>
                                {course.enrolledStudents || 0}/{course.maxStudents} students
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                              <span>{course.schedule?.length || 0} sessions</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
              {totalPages > 1 && (
                <div className="mt-6 p-4">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={pagination.pageNumber}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Cancel Course Modal */}
      <CancelCourseModal
        isOpen={isCancelDialogOpen}
        onCancel={() => setIsCancelDialogOpen(false)}
        onConfirm={confirmCancelCourse}
        isCancelling={isCancelling}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={handleDeleteModalClose}
        onConfirm={handleDeleteSelected}
        count={selectedCourses.length}
      />

      <ToastContainer toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))} dismiss={dismiss} />
    </div>
  )
}

