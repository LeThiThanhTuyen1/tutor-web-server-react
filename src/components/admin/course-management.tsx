"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/alert-dialog";
import { Trash2, Search, RefreshCw } from "lucide-react";
import { getAllCourses, deleteCourses } from "@/services/courseService";
import { useToast } from "@/hook/use-toast";
import Pagination from "../layout/pagination";
import { cn } from "@/ui/cn";

// Status styles
const STATUS_STYLES: Record<string, string> = {
  ongoing:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  coming:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

export function CourseTable() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCourses({ pageNumber: page, pageSize });
      if (response.succeeded) {
        setCourses(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch courses",
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCourses(courses.map((course) => course.id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleSelectCourse = (courseId: number, checked: boolean) => {
    if (checked) {
      setSelectedCourses((prev) => [...prev, courseId]);
    } else {
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
    }
  };

  const handleDeleteSingle = (courseId: number) => {
    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMultiple = () => {
    if (selectedCourses.length === 0) return;
    setCourseToDelete(null);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    const idsToDelete = courseToDelete ? [courseToDelete] : selectedCourses;

    try {
      const response = await deleteCourses(idsToDelete);
      if (response.succeeded) {
        toast({
          title: "Success",
          description: `Successfully deleted ${idsToDelete.length} course(s)`,
          variant: "success",
        });
        fetchCourses();
        setSelectedCourses([]);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete courses",
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
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tutorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-gray-800 pl-10"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCourses}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={handleDeleteMultiple}
            disabled={selectedCourses.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  className="border border-gray-800"
                  checked={
                    courses.length > 0 &&
                    selectedCourses.length === courses.length
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={8}
                    className="h-12 animate-pulse bg-gray-100 dark:bg-gray-800"
                  ></TableCell>
                </TableRow>
              ))
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <Checkbox
                      className="border border-gray-800"
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={(checked) =>
                        handleSelectCourse(course.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{course.id}</TableCell>
                  <TableCell className="font-medium">
                    {course.courseName}
                  </TableCell>
                  <TableCell>{course.tutorName}</TableCell>
                  <TableCell>${course.fee}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-xs font-medium",
                        STATUS_STYLES[course.status] ||
                          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      )}
                    >
                      {course.status.charAt(0).toUpperCase() +
                        course.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>
                        {new Date(course.startDate).toLocaleDateString()}
                      </div>
                      <div>{new Date(course.endDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSingle(course.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No courses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {courseToDelete
                ? "Are you sure you want to delete this course? This action cannot be undone."
                : `Are you sure you want to delete ${selectedCourses.length} selected courses? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
