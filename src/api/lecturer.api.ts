import { apiClient } from './client';
import type { LecturerProfile, UpdateLecturerProfileDto, LecturerPublic, LecturerListItem } from '@/types/lecturer.types';
import type { PaginatedResponse } from '@/types/common.types';

interface CreateStudentDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  university?: string;
  studentId?: string;
}

interface CreateEnrollmentDto {
  courseId: string;
  studentId?: string;
  studentGroupId?: string;
  notes?: string;
}

interface StudentResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  university?: string;
  studentId?: string;
}

interface EnrollmentResponse {
  id: string;
  courseId: string;
  studentId?: string;
  studentGroupId?: string;
  status: string;
  course: {
    name: string;
    subject: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  studentGroup?: {
    id: string;
    name: string;
  };
}

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

  createStudent: async (data: CreateStudentDto): Promise<StudentResponse> => {
    const response = await apiClient.post<StudentResponse>('/lecturer/students', data);
    return response.data;
  },

  createEnrollment: async (data: CreateEnrollmentDto): Promise<EnrollmentResponse> => {
    const response = await apiClient.post<EnrollmentResponse>('/lecturer/enrollments', data);
    return response.data;
  },
};
