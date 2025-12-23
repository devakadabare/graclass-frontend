import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { useCourses } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CourseForm } from '@/components/courses/CourseForm';
import type { Course } from '@/types/course.types';

export default function LecturerCoursesPage() {
  const { courses, isLoading, createCourse, updateCourse, deleteCourse } = useCourses();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  const handleToggleStatus = (course: Course) => {
    updateCourse({ id: course.id, data: { isActive: !course.isActive } });
  };

  const handleDelete = () => {
    if (deletingCourseId) {
      deleteCourse(deletingCourseId);
      setDeletingCourseId(null);
    }
  };

  const columns = [
    {
      header: 'Course Name',
      accessor: 'name' as keyof Course,
    },
    {
      header: 'Subject',
      accessor: 'subject' as keyof Course,
    },
    {
      header: 'Level',
      accessor: 'level' as keyof Course,
      cell: (value: string) => value || 'N/A',
    },
    {
      header: 'Duration',
      accessor: 'duration' as keyof Course,
      cell: (value: number) => `${value} min`,
    },
    {
      header: 'Rate',
      accessor: 'hourlyRate' as keyof Course,
      cell: (value: number) => `$${value}/hr`,
    },
    {
      header: 'Status',
      accessor: 'isActive' as keyof Course,
      cell: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: ((row: Course) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(row)}
          >
            {row.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingCourse(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingCourseId(row.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )) as any,
    },
  ];

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Manage your course offerings</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        <DataTable
          data={courses || []}
          columns={columns}
          emptyMessage="No courses found. Create your first course to get started."
        />

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Add a new course to your offerings
              </DialogDescription>
            </DialogHeader>
            <CourseForm
              onSubmit={(data) => {
                createCourse(data);
                setShowCreateDialog(false);
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update your course information
              </DialogDescription>
            </DialogHeader>
            {editingCourse && (
              <CourseForm
                course={editingCourse}
                onSubmit={(data) => {
                  updateCourse({ id: editingCourse.id, data });
                  setEditingCourse(null);
                }}
                onCancel={() => setEditingCourse(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingCourseId} onOpenChange={() => setDeletingCourseId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this course. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
