import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import type { LoginCredentials, RegisterLecturerDto, RegisterStudentDto } from '@/types/auth.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Login successful!');

      switch (data.user.role) {
        case 'LECTURER':
          navigate('/lecturer/dashboard');
          break;
        case 'STUDENT':
          navigate('/student/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const registerLecturerMutation = useMutation({
    mutationFn: (data: RegisterLecturerDto) => authApi.registerLecturer(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Registration successful!');
      navigate('/lecturer/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const registerStudentMutation = useMutation({
    mutationFn: (data: RegisterStudentDto) => authApi.registerStudent(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Registration successful!');
      navigate('/student/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    registerLecturer: registerLecturerMutation.mutate,
    registerStudent: registerStudentMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerLecturerMutation.isPending || registerStudentMutation.isPending,
  };
};
