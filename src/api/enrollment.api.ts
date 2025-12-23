import { apiClient } from './client';
import type { EnrollmentDetails, UpdateEnrollmentStatusDto } from '@/types/enrollment.types';
import type { EnrollmentStatus } from '@/types/student.types';

export const enrollmentApi = {
  getEnrollments: async (status?: EnrollmentStatus, courseId?: string): Promise<EnrollmentDetails[]> => {
    const response = await apiClient.get<EnrollmentDetails[]>('/enrollments', {
      params: { status, courseId },
    });
    return response.data;
  },

  getPendingCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get<{ count: number }>('/enrollments/pending/count');
    return response.data;
  },

  getEnrollmentById: async (enrollmentId: string): Promise<EnrollmentDetails> => {
    const response = await apiClient.get<EnrollmentDetails>(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  updateEnrollmentStatus: async (enrollmentId: string, data: UpdateEnrollmentStatusDto): Promise<EnrollmentDetails> => {
    const response = await apiClient.put<EnrollmentDetails>(`/enrollments/${enrollmentId}/status`, data);
    return response.data;
  },
};
