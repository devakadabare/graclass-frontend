import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lecturerApi } from '@/api/lecturer.api';
import { useAuthStore } from '@/store/authStore';
import type { UpdateLecturerProfileDto } from '@/types/lecturer.types';

export const useLecturerProfile = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['lecturer', 'profile'],
    queryFn: () => lecturerApi.getProfile(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ data, file }: { data: UpdateLecturerProfileDto; file?: File }) =>
      lecturerApi.updateProfile(data, file),
    onSuccess: (updatedProfile) => {
      // Update auth store with the new profile data including profileImage
      updateUser({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        profileImage: updatedProfile.profileImage,
      });
      // Use refetchQueries to immediately refetch the profile data
      queryClient.refetchQueries({ queryKey: ['lecturer', 'profile'] });
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
    updateProfile: (data: UpdateLecturerProfileDto, file?: File) =>
      updateMutation.mutate({ data, file }),
    isUpdating: updateMutation.isPending,
  };
};
