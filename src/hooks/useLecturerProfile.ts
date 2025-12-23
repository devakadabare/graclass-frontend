import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lecturerApi } from '@/api/lecturer.api';
import type { UpdateLecturerProfileDto } from '@/types/lecturer.types';

export const useLecturerProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['lecturer', 'profile'],
    queryFn: () => lecturerApi.getProfile(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateLecturerProfileDto) => lecturerApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecturer', 'profile'] });
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
