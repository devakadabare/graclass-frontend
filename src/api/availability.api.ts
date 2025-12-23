import { apiClient } from './client';
import type { Availability, CreateAvailabilityDto, UpdateAvailabilityDto } from '@/types/availability.types';

export const availabilityApi = {
  createAvailability: async (data: CreateAvailabilityDto): Promise<Availability> => {
    const response = await apiClient.post<Availability>('/availability', data);
    return response.data;
  },

  getMyAvailability: async (includeExpired = false): Promise<Availability[]> => {
    const response = await apiClient.get<Availability[]>('/availability/my-availability', {
      params: { includeExpired },
    });
    return response.data;
  },

  getLecturerAvailability: async (lecturerId: string): Promise<Availability[]> => {
    const response = await apiClient.get<Availability[]>(`/availability/lecturer/${lecturerId}`);
    return response.data;
  },

  updateAvailability: async (availabilityId: string, data: UpdateAvailabilityDto): Promise<Availability> => {
    const response = await apiClient.put<Availability>(`/availability/${availabilityId}`, data);
    return response.data;
  },

  deleteAvailability: async (availabilityId: string): Promise<void> => {
    await apiClient.delete(`/availability/${availabilityId}`);
  },
};
