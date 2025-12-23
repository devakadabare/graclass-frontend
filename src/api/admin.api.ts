import { apiClient } from './client';
import type { SystemStats, AdminUser, AdminCourse, AdminEnrollment } from '@/types/admin.types';
import type { PaginatedResponse } from '@/types/common.types';

export const adminApi = {
  getUsers: async (page = 1, limit = 20, role?: string, isActive?: boolean): Promise<PaginatedResponse<AdminUser>> => {
    const response = await apiClient.get<PaginatedResponse<AdminUser>>('/admin/users', {
      params: { page, limit, role, isActive },
    });
    return response.data;
  },

  getUserById: async (userId: string): Promise<AdminUser> => {
    const response = await apiClient.get<AdminUser>(`/admin/users/${userId}`);
    return response.data;
  },

  updateUserStatus: async (userId: string, isActive: boolean): Promise<void> => {
    await apiClient.put(`/admin/users/${userId}/status`, { isActive });
  },

  getSystemStats: async (): Promise<SystemStats> => {
    const response = await apiClient.get<SystemStats>('/admin/stats');
    return response.data;
  },

  getAllCourses: async (page = 1, limit = 20): Promise<PaginatedResponse<AdminCourse>> => {
    const response = await apiClient.get<PaginatedResponse<AdminCourse>>('/admin/courses', {
      params: { page, limit },
    });
    return response.data;
  },

  getAllEnrollments: async (page = 1, limit = 20, status?: string): Promise<PaginatedResponse<AdminEnrollment>> => {
    const response = await apiClient.get<PaginatedResponse<AdminEnrollment>>('/admin/enrollments', {
      params: { page, limit, status },
    });
    return response.data;
  },
};
