import { apiClient } from './client';
import type { Class, CreateClassDto, UpdateClassDto, ClassWithDetails, ClassStatus } from '@/types/class.types';

export const classApi = {
  scheduleClass: async (data: CreateClassDto): Promise<Class> => {
    const response = await apiClient.post<Class>('/classes', data);
    return response.data;
  },

  getMyClasses: async (status?: ClassStatus, fromDate?: string): Promise<ClassWithDetails[]> => {
    const response = await apiClient.get<ClassWithDetails[]>('/classes/my-classes', {
      params: { status, fromDate },
    });
    return response.data;
  },

  getClassById: async (classId: string): Promise<ClassWithDetails> => {
    const response = await apiClient.get<ClassWithDetails>(`/classes/${classId}`);
    return response.data;
  },

  updateClass: async (classId: string, data: UpdateClassDto): Promise<Class> => {
    const response = await apiClient.put<Class>(`/classes/${classId}`, data);
    return response.data;
  },

  cancelClass: async (classId: string): Promise<Class> => {
    const response = await apiClient.patch<Class>(`/classes/${classId}/cancel`);
    return response.data;
  },

  deleteClass: async (classId: string): Promise<void> => {
    await apiClient.delete(`/classes/${classId}`);
  },
};
