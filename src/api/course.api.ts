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
  createCourse: async (data: CreateCourseDto & { flyer?: File; images?: File[] }): Promise<Course> => {
    const formData = new FormData();

    // Append text fields
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('subject', data.subject);
    if (data.level) formData.append('level', data.level);
    formData.append('duration', data.duration.toString());
    formData.append('hourlyRate', data.hourlyRate.toString());

    // Append flyer if provided
    if (data.flyer) {
      formData.append('flyer', data.flyer);
    }

    // Append images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await apiClient.post<Course>('/courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

  updateCourse: async (courseId: string, data: UpdateCourseDto & { flyer?: File; images?: File[] }): Promise<Course> => {
    // Check if we have files to upload
    const hasFiles = data.flyer || (data.images && data.images.length > 0);

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Append text fields
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.description !== undefined) formData.append('description', data.description);
      if (data.subject !== undefined) formData.append('subject', data.subject);
      if (data.level !== undefined) formData.append('level', data.level);
      if (data.duration !== undefined) formData.append('duration', data.duration.toString());
      if (data.hourlyRate !== undefined) formData.append('hourlyRate', data.hourlyRate.toString());
      if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());

      // Append flyer if provided
      if (data.flyer) {
        formData.append('flyer', data.flyer);
      }

      // Append images if provided
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await apiClient.put<Course>(`/courses/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Use regular JSON for non-file updates
      const { flyer, images, ...updateData } = data;
      const response = await apiClient.put<Course>(`/courses/${courseId}`, updateData);
      return response.data;
    }
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}`);
  },
};
