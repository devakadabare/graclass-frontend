import { apiClient } from './client';
import type {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  CourseSearchParams,
  CourseSearchResult
} from '@/types/course.types';
import type { PaginatedResponse } from '@/types/common.types';

export const courseApi = {
  createCourse: async (data: CreateCourseDto): Promise<Course> => {
    const response = await apiClient.post<Course>('/courses', data);
    return response.data;
  },

  getMyCourses: async (includeInactive = false): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>('/courses/my-courses', {
      params: { includeInactive },
    });
    return response.data;
  },

  searchCourses: async (params: CourseSearchParams): Promise<PaginatedResponse<CourseSearchResult>> => {
    const response = await apiClient.get<PaginatedResponse<CourseSearchResult>>('/courses/search', { params });
    return response.data;
  },

  getCourseById: async (courseId: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${courseId}`);
    return response.data;
  },

  updateCourse: async (courseId: string, data: UpdateCourseDto): Promise<Course> => {
    const response = await apiClient.put<Course>(`/courses/${courseId}`, data);
    return response.data;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}`);
  },
};
