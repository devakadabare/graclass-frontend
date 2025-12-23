import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentApi } from '@/api/student.api';
import type { UpdateStudentProfileDto, EnrollCourseDto } from '@/types/student.types';

export const useStudentProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['student', 'profile'],
    queryFn: () => studentApi.getProfile(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateStudentProfileDto) => studentApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};

export const useStudentEnrollment = () => {
  const queryClient = useQueryClient();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['student', 'enrollments'],
    queryFn: () => studentApi.getEnrollments(),
  });

  const enrollMutation = useMutation({
    mutationFn: (data: EnrollCourseDto) => studentApi.enrollInCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'enrollments'] });
      toast.success('Enrollment request submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    },
  });

  return {
    enrollments,
    isLoading,
    enroll: enrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
  };
};
