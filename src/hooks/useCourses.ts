import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { courseApi } from '@/api/course.api';
import type { CreateCourseDto, UpdateCourseDto, CourseSearchParams } from '@/types/course.types';

export const useCourses = () => {
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', 'my-courses'],
    queryFn: () => courseApi.getMyCourses(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCourseDto) => courseApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create course');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseDto }) =>
      courseApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update course');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => courseApi.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    },
  });

  return {
    courses,
    isLoading,
    createCourse: createMutation.mutate,
    updateCourse: updateMutation.mutate,
    deleteCourse: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useCourseSearch = (params: CourseSearchParams) => {
  return useQuery({
    queryKey: ['courses', 'search', params],
    queryFn: () => courseApi.searchCourses(params),
  });
};
