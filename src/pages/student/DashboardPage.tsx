import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingClasses } from '@/components/dashboard/UpcomingClasses';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { useStudentDashboard } from '@/hooks/useDashboard';
import { BookOpen, GraduationCap, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentDashboardPage() {
  const { dashboard, isLoading } = useStudentDashboard();

  if (isLoading) {
    return <DashboardLayout><PageLoader /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Enrolled Courses" value={dashboard?.overview.approvedEnrollments || 0} icon={BookOpen} />
          <StatCard title="Pending" value={dashboard?.overview.pendingEnrollments || 0} icon={Clock} />
          <StatCard title="Total Classes" value={dashboard?.overview.totalClasses || 0} icon={GraduationCap} />
          <StatCard title="Upcoming" value={dashboard?.classes.upcoming || 0} icon={Calendar} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingClasses classes={dashboard?.upcomingSchedule || []} isLecturer={false} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
