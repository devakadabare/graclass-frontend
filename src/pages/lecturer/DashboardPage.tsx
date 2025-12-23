import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingClasses } from '@/components/dashboard/UpcomingClasses';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { useLecturerDashboard } from '@/hooks/useDashboard';
import { BookOpen, Users, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LecturerDashboardPage() {
  const { dashboard, isLoading } = useLecturerDashboard();

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Courses" value={dashboard?.overview.totalCourses || 0} subtitle={`${dashboard?.overview.activeCourses || 0} active`} icon={BookOpen} />
          <StatCard title="Total Students" value={dashboard?.overview.totalStudents || 0} icon={Users} />
          <StatCard title="This Month" value={`$${dashboard?.overview.thisMonthEarnings || '0'}`} icon={DollarSign} />
          <StatCard title="Upcoming Classes" value={dashboard?.classes.upcoming || 0} icon={Calendar} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingClasses classes={dashboard?.upcomingSchedule || []} isLecturer />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
