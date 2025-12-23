import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard.api';

export const useLecturerDashboard = () => {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'lecturer'],
    queryFn: () => dashboardApi.getLecturerDashboard(),
  });

  return {
    dashboard,
    isLoading,
    error,
  };
};

export const useStudentDashboard = () => {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: () => dashboardApi.getStudentDashboard(),
  });

  return {
    dashboard,
    isLoading,
    error,
  };
};
