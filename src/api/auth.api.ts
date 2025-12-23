import { apiClient } from './client';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterLecturerDto,
  RegisterStudentDto
} from '@/types/auth.types';

export const authApi = {
  registerLecturer: async (data: RegisterLecturerDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register/lecturer', data);
    return response.data;
  },

  registerStudent: async (data: RegisterStudentDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register/student', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },
};
