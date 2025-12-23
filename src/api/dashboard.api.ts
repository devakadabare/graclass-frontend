import { apiClient } from './client';
import type { LecturerDashboard, StudentDashboard } from '@/types/dashboard.types';

export const dashboardApi = {
  getLecturerDashboard: async (): Promise<LecturerDashboard> => {
    const response = await apiClient.get<LecturerDashboard>('/dashboard/lecturer');
    return response.data;
  },

  getStudentDashboard: async (): Promise<StudentDashboard> => {
    const response = await apiClient.get<StudentDashboard>('/dashboard/student');
    return response.data;
  },

  getCourseStatistics: async (): Promise<any> => {
    const response = await apiClient.get('/dashboard/courses');
    return response.data;
  },
};
