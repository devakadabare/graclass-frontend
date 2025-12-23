import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin.api';
import { Users, BookOpen, GraduationCap, UserPlus } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getSystemStats(),
  });

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats?.overview.totalUsers || 0} icon={Users} />
          <StatCard title="Lecturers" value={stats?.overview.totalLecturers || 0} icon={GraduationCap} />
          <StatCard title="Students" value={stats?.overview.totalStudents || 0} icon={Users} />
          <StatCard title="Courses" value={stats?.overview.totalCourses || 0} subtitle={`${stats?.overview.activeCourses || 0} active`} icon={BookOpen} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Classes" value={stats?.overview.totalClasses || 0} />
          <StatCard title="Enrollments" value={stats?.overview.totalEnrollments || 0} icon={UserPlus} />
          <StatCard title="Pending" value={stats?.overview.pendingEnrollments || 0} />
        </div>
      </div>
    </DashboardLayout>
  );
}
