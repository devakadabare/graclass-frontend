import { apiClient } from './client';
import type { LecturerProfile, UpdateLecturerProfileDto, LecturerPublic, LecturerListItem } from '@/types/lecturer.types';
import type { PaginatedResponse } from '@/types/common.types';

export const lecturerApi = {
  getProfile: async (): Promise<LecturerProfile> => {
    const response = await apiClient.get<LecturerProfile>('/lecturer/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateLecturerProfileDto): Promise<LecturerProfile> => {
    const response = await apiClient.put<LecturerProfile>('/lecturer/profile', data);
    return response.data;
  },

  getPublicProfile: async (lecturerId: string): Promise<LecturerPublic> => {
    const response = await apiClient.get<LecturerPublic>(`/lecturer/public/${lecturerId}`);
    return response.data;
  },

  getAllLecturers: async (page = 1, limit = 10): Promise<PaginatedResponse<LecturerListItem>> => {
    const response = await apiClient.get<PaginatedResponse<LecturerListItem>>('/lecturer/list', {
      params: { page, limit },
    });
    return response.data;
  },
};
