import { apiClient } from './client';
import type {
  StudentProfile,
  UpdateStudentProfileDto,
  EnrollCourseDto,
  Enrollment,
  EnrollmentStatus,
  StudentClass
} from '@/types/student.types';
import type { PaginatedResponse } from '@/types/common.types';

interface StudentListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  university?: string;
  studentId?: string;
}

export const studentApi = {
  getProfile: async (): Promise<StudentProfile> => {
    const response = await apiClient.get<StudentProfile>('/student/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateStudentProfileDto, file?: File): Promise<StudentProfile> => {
    const formData = new FormData();

    // Append required fields - always include them
    formData.append('firstName', data.firstName || '');
    formData.append('lastName', data.lastName || '');

    // Append optional fields
    formData.append('phone', data.phone || '');
    formData.append('university', data.university || '');
    formData.append('studentId', data.studentId || '');

    // Append file if provided
    if (file) {
      formData.append('profileImage', file);
    }

    const response = await apiClient.put<StudentProfile>('/student/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

  getAllStudents: async (page = 1, limit = 1000): Promise<PaginatedResponse<StudentListItem>> => {
    // Use admin API endpoint to get all students
    const response = await apiClient.get<PaginatedResponse<any>>('/admin/users', {
      params: { page, limit, role: 'STUDENT' },
    });
    // Transform admin user data to student list items
    return {
      ...response.data,
      data: response.data.data.map((user: any) => ({
        id: user.student?.id || user.id,
        email: user.email,
        firstName: user.student?.firstName || '',
        lastName: user.student?.lastName || '',
        phone: user.student?.phone,
        university: user.student?.university,
        studentId: user.student?.studentId,
      })),
    };
  },
};
