import { apiClient } from './client';
import type {
  StudentProfile,
  UpdateStudentProfileDto,
  EnrollCourseDto,
  Enrollment,
  EnrollmentStatus,
  StudentClass
} from '@/types/student.types';

export const studentApi = {
  getProfile: async (): Promise<StudentProfile> => {
    const response = await apiClient.get<StudentProfile>('/student/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateStudentProfileDto): Promise<StudentProfile> => {
    const response = await apiClient.put<StudentProfile>('/student/profile', data);
    return response.data;
  },

  enrollInCourse: async (data: EnrollCourseDto): Promise<Enrollment> => {
    const response = await apiClient.post<Enrollment>('/student/enroll', data);
    return response.data;
  },

  getEnrollments: async (status?: EnrollmentStatus): Promise<Enrollment[]> => {
    const response = await apiClient.get<Enrollment[]>('/student/enrollments', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  getEnrolledCourses: async (): Promise<any[]> => {
    const response = await apiClient.get('/student/courses');
    return response.data;
  },

  getClasses: async (upcoming = true): Promise<StudentClass[]> => {
    const response = await apiClient.get<StudentClass[]>('/student/classes', {
      params: { upcoming },
    });
    return response.data;
  },
};
