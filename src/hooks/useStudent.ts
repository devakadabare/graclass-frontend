import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentApi } from '@/api/student.api';
import { useAuthStore } from '@/store/authStore';
import type { UpdateStudentProfileDto, EnrollCourseDto } from '@/types/student.types';

export const useStudentProfile = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['student', 'profile'],
    queryFn: () => studentApi.getProfile(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ data, file }: { data: UpdateStudentProfileDto; file?: File }) =>
      studentApi.updateProfile(data, file),
    onSuccess: (updatedProfile) => {
      // Update auth store with the new profile data including profileImage
      updateUser({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        profileImage: updatedProfile.profileImage,
      });
      // Use refetchQueries to immediately refetch the profile data
      queryClient.refetchQueries({ queryKey: ['student', 'profile'] });
      toast.success('Profile updated successfully');
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: (data: UpdateStudentProfileDto, file?: File) =>
      updateMutation.mutate({ data, file }),
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
