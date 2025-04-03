"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, Filter, Book, Grid, List } from "lucide-react";
import { getAllCourses, deleteCourses } from "@/services/courseService";
import { Button } from "@/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { Checkbox } from "@/ui/checkbox";
import { Input } from "@/ui/input";
import { Skeleton } from "@/ui/skeleton";
import { ToastContainer } from "@/ui/toast";
import { fadeIn, staggerContainer } from "../layout/animation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "../../ui/cn";
import Pagination from "../layout/pagination";
import { DeleteConfirmationModal } from "@/ui/modals/delete-confirm";
import { PaginationFilter } from "@/types/paginated-response";
import CourseCard, { STATUS_STYLES } from "./course-card";
import { enrollCourse } from "@/services/enrollmentService";

// Lazy load components for better performance
// const CourseCard = lazy(() => import("@/components/courses/course-card"));
const CourseListItem = lazy(() => import("./course-list-item"));

// Fallback components for lazy loading
const CardSkeleton = () => (
  <div className="rounded-lg border border-indigo-100 dark:border-indigo-900 p-4">
    <Skeleton className="h-40 w-full rounded-md mb-4" />
    <Skeleton className="h-6 w-3/4 rounded-md mb-2" />
    <Skeleton className="h-4 w-full rounded-md mb-2" />
    <Skeleton className="h-4 w-2/3 rounded-md" />
  </div>
);

const ListItemSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900">
    <Skeleton className="h-24 w-full md:w-40 rounded-md" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-6 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
    </div>
    <div className="w-full md:w-32 space-y-2">
      <Skeleton className="h-8 w-full rounded-md" />
      <Skeleton className="h-8 w-full rounded-md" />
    </div>
  </div>
);

const statusOptions = ["All", ...Object.keys(STATUS_STYLES)];

// Animation variants - moved outside component
const container = staggerContainer(0.05);

export default function CourseList() {
  // Use context hooks with memoization
  const { user } = useAuth();
  const { toast, toasts, dismiss } = useToast();

  // Memoize the isTutor value to prevent unnecessary re-renders
  const isTutor = useMemo(() => user?.role === "Tutor", [user?.role]);

  // State
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [pagination, setPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 9,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    isTutor ? "list" : "grid"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [key, setKey] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState<Record<number, boolean>>({});

  // Refs
  const lastCourseElementRef = useRef<HTMLDivElement | null>(null);
  const prevViewModeRef = useRef(viewMode);

  // Debounce search term to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch courses - optimized with useCallback and proper dependencies
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllCourses(pagination);

      setCourses(response.data || []);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError("Failed to load courses. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination, debouncedSearchTerm, selectedStatus]);

  // Fetch courses when dependencies change
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Prefetch the other view mode components when idle
  useEffect(() => {
    if (prevViewModeRef.current !== viewMode) {
      prevViewModeRef.current = viewMode;
      setKey((prev) => prev + 1); // Force re-render when view mode changes

      // Use requestIdleCallback to prefetch the other view mode during idle time
      const prefetchOtherView = () => {
        if (viewMode === "grid") {
          import("@/components/courses/course-card");
        } else {
          import("./course-list-item");
        }
      };

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(prefetchOtherView);
      } else {
        setTimeout(prefetchOtherView, 200);
      }
    }
  }, [viewMode]);

  // Filter courses - memoized to prevent recalculation on every render
  const filteredCourses = useMemo(() => {
    // We're now handling filtering on the server side through the API call
    // This is just a backup client-side filter
    return courses;
  }, [courses]);

  // Course selection - optimized to use functional updates
  const toggleCourseSelection = useCallback((courseId: number) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.includes(courseId);
      return isSelected
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];
    });
  }, []);

  // Handle course enrollment
  const handleEnrollCourse = useCallback(
    async (courseId: number) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to enroll in this course",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsEnrolling((prev) => ({ ...prev, [courseId]: true }));

        const response = await enrollCourse(courseId);

        if (response.succeeded) {
          toast({
            title: "Success",
            description: "You have successfully enrolled in this course",
            variant: "success",
          });
          // Refresh the course list to update enrollment status
          fetchCourses();
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to enroll in course",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsEnrolling((prev) => ({ ...prev, [courseId]: false }));
      }
    },
    [user, fetchCourses, toast]
  );

  // Delete courses - wrapped in useCallback to prevent recreation
  // Removed toast from dependencies to prevent infinite loop
  const handleDeleteSelected = useCallback(async () => {
    if (selectedCourses.length === 0) return;

    try {
      const response = await deleteCourses(selectedCourses);
      if (response.succeeded) {
        toast({
          title: "Success",
          description: "Courses deleted successfully",
          variant: "success",
        });
        setSelectedCourses([]);
        setTimeout(() => {
          fetchCourses();
        }, 500);
        setPagination({ ...pagination, pageNumber: 1 });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete courses",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete courses",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  }, [selectedCourses, fetchCourses, pagination]);

  // Memoize handlers to prevent recreation on each render
  const handleViewModeChange = useCallback((mode: "grid" | "list") => {
    setViewMode(mode);
  }, []);

  const handleFilterToggle = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  const handleDeleteModalOpen = useCallback((id: number) => {
    setSelectedCourses([id]);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, pageNumber: newPage }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedStatus("All");
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  }, []);

  // Render functions for grid and list views
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredCourses.map((course, index) => (
        <motion.div
          key={course.id}
          variants={fadeIn("up", Math.min(index * 0.05, 0.5))} // Cap the delay to prevent too long animations
          ref={
            index === filteredCourses.length - 1 ? lastCourseElementRef : null
          }
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Suspense fallback={<CardSkeleton />}>
            <CourseCard course={course} isTutor={isTutor} />
          </Suspense>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredCourses.map((course, index) => (
        <motion.div
          key={course.id}
          variants={fadeIn("up", Math.min(index * 0.05, 0.5))}
          ref={
            index === filteredCourses.length - 1 ? lastCourseElementRef : null
          }
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Suspense fallback={<ListItemSkeleton />}>
            <CourseListItem
              course={course}
              isSelected={selectedCourses.includes(course.id)}
              onSelect={toggleCourseSelection}
              onDelete={handleDeleteModalOpen}
              isTutor={isTutor}
              onCourseUpdated={fetchCourses}
              handleEnrollCourse={() => handleEnrollCourse(course.id)}
              isEnrolling={isEnrolling[course.id] || false}
            />
          </Suspense>
        </motion.div>
      ))}
    </div>
  );

  // Memoize the loading skeletons
  const LoadingSkeletons = useMemo(
    () => (
      <div className="space-y-4">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <ListItemSkeleton key={index} />
            ))}
          </div>
        )}
      </div>
    ),
    [viewMode]
  );

  // Memoize the empty state
  const EmptyState = useMemo(
    () => (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Book className="h-12 w-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            We couldn't find any courses matching your criteria. Try adjusting
            your filters or search terms.
          </p>
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
          >
            Clear filters
          </Button>
        </motion.div>
      </div>
    ),
    [handleClearFilters]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
      >
        <h1 className="text-2xl font-bold text-indigo-950 dark:text-indigo-50 mb-4 md:mb-0">
          Courses
        </h1>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center mr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewModeChange("grid")}
              className={cn(
                "rounded-r-none border-r-0",
                viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewModeChange("list")}
              className={cn(
                "rounded-l-none",
                viewMode === "list"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleFilterToggle}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </motion.div>

      {error && (
        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          animate="show"
          className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center"
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          animate="show"
          className={cn(
            "w-full md:w-64 md:block flex-shrink-0",
            !isFilterOpen && "hidden md:block"
          )}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-indigo-950 dark:text-indigo-50 mb-2">
                Filters
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            <Accordion type="single" collapsible defaultValue="status">
              <AccordionItem
                value="status"
                className="border-b-indigo-200 dark:border-b-indigo-800"
              >
                <AccordionTrigger className="text-indigo-950 dark:text-indigo-50 hover:text-indigo-700 dark:hover:text-indigo-300">
                  Status
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatus === status}
                          onCheckedChange={() => handleStatusChange(status)}
                          className="border-indigo-300 dark:border-indigo-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <label
                          htmlFor={`status-${status}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {status === "All"
                            ? "All Statuses"
                            : status.charAt(0).toUpperCase() + status.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="date"
                className="border-b-indigo-200 dark:border-b-indigo-800"
              >
                <AccordionTrigger className="text-indigo-950 dark:text-indigo-50 hover:text-indigo-700 dark:hover:text-indigo-300">
                  Date
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        From
                      </label>
                      <Input
                        type="date"
                        className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        To
                      </label>
                      <Input
                        type="date"
                        className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="price"
                className="border-b-indigo-200 dark:border-b-indigo-800"
              >
                <AccordionTrigger className="text-indigo-950 dark:text-indigo-50 hover:text-indigo-700 dark:hover:text-indigo-300">
                  Price Range
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                          Min
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                          Max
                        </label>
                        <Input
                          type="number"
                          placeholder="10000"
                          className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="h-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mt-4 mb-1">
                        <div className="h-full w-3/4 bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>0</span>
                        <span>10000</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="flex-1 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
              >
                Reset
              </Button>
              {/* <Button
                variant="default"
                size="sm"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
              >
                Apply
              </Button> */}
            </div>
          </div>
        </motion.div>

        {/* Course List */}
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          animate="show"
          className="flex-1"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900 p-4 md:p-6">
            {loading ? (
              LoadingSkeletons
            ) : filteredCourses.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                key={key} // Add key to force re-render
              >
                {/* Direct rendering instead of using AnimatePresence for immediate UI updates */}
                {viewMode === "grid" ? renderGridView() : renderListView()}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      totalPages={totalPages}
                      currentPage={pagination.pageNumber}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              EmptyState
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={handleDeleteModalClose}
        onConfirm={handleDeleteSelected}
        count={selectedCourses.length}
      />

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  );
}
